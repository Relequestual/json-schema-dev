<template>
  <div id="app">
    <navigation :ajv-validation-success="ajvValidationSuccess">
      <template v-slot:save-button>
        <save-button
          :schema="primarySchemaText"
          :instance="instanceText"
        />
      </template>
    </navigation>
    <b-container fluid>
      <b-row>
        <b-col>
          <p class="mt-3">
            The home of JSON Schema validation right in your browser 🚧 Alpha 🚧 draft-7 only
          </p>
        </b-col>
      </b-row>

      <b-row v-if="errorMessage !== null" align-h="center">
        <b-col>
          <error-message :error-message="errorMessage" />
        </b-col>
      </b-row>
      <b-collapse id="features" v-model="showFeatures">
        <features />
      </b-collapse>

      <b-collapse id="settings" v-model="showSettings">
        <settings
          :editor-theme-given="editorTheme"
          @update-editor-theme="updateEditorTheme($event)"
        />
      </b-collapse>

      <b-row class="mb-3 no-gutters">
        <b-col md="6">
          <h2>JSON Schema</h2>
          <json-editor
            file-name="schema.json"
            :json-text.sync="primarySchemaText"
            :theme="editorTheme"
            @update-valid-status="
              updateJSONLintValid('primarySchemaText', $event)
            "
          />
        </b-col>
        <b-col md="6">
          <h2>JSON instance</h2>
          <json-editor
            file-name="instance.json"
            :json-text.sync="instanceText"
            :theme="editorTheme"
            @update-valid-status="updateJSONLintValid('instanceText', $event)"
          />
        </b-col>
      </b-row>
      <results
        :ajv-validation-success="ajvValidationSuccess"
        :ajv-schema-error="ajvSchemaError"
        :ajv-validation-errors="ajvValidationErrors"
        :schema-validation-error-messages="schemaValidationErrorMessages"
      />
    </b-container>
    <footer-bar />
  </div>
</template>

<script>
import Vue from 'vue';
import _ from 'lodash';

import LZ from 'lz-string';

import JSONEditor from './components/JSONEditor.vue';
import SaveButton from './components/SaveButton.vue';
import Navigation from './components/Navigation.vue';
import Features from './components/Features.vue';
import Settings from './components/Settings.vue';
import ErrorMessage from './components/ErrorMessage.vue';
import Results from './components/Results.vue';
import Footer from './components/Footer.vue';

import shortner from './utilities/shortner.js';

const Ajv = require('ajv');
// require('ajv-async')(Ajv);

const defaultPrimarySchemaText = '{\n\n}';
const defaultInstanceText = '{\n\n}';

const tryParse = data => {
  try {
    return JSON.parse(LZ.decompressFromEncodedURIComponent(data));
  } catch {
    return null;
  }
};

export default {
  name: 'App',
  components: {
    'json-editor': JSONEditor,
    'save-button': SaveButton,
    navigation: Navigation,
    features: Features,
    settings: Settings,
    'error-message': ErrorMessage,
    results: Results,
    'footer-bar': Footer,
  },
  data: function() {
    return {
      errorMessage: null,
      checkingValidation: false,
      schema: null,
      primarySchemaText: defaultPrimarySchemaText,
      instanceText: defaultInstanceText,
      ajvValidationErrors: [],
      ajvSchemaError: [],
      ajvValidationSuccess: null,
      jsonLintValid: {},
      editorTheme: 'default',
      showFeatures: false,
      showSettings: false,
    };
  },
  computed: {
    isDefault: function() {
      const isSchemaDefault =
        this.primarySchemaText === defaultPrimarySchemaText;
      const isInstanceDefault = this.instanceText === defaultInstanceText;

      return isSchemaDefault && isInstanceDefault;
    },
    schemaValidationErrorMessages: function() {
      return (
        this.ajvValidationErrors.map(error => this.formatSchemaErrors(error)) ||
        []
      );
    },
    allJSONValid: function() {
      const lintResults = Object.values(this.jsonLintValid);
      return lintResults.length !== 0 && lintResults.every(v => v === true);
    },
  },
  watch: {
    primarySchemaText: function(newVal) {
      localStorage.setItem('primarySchemaText', newVal);
      this.ajvValidationSuccess = null;
      this.updateJSONLintValid('primarySchemaText', null);
    },
    instanceText: function(newVal) {
      localStorage.setItem('instanceText', newVal);
      this.ajvValidationSuccess = null;
      this.updateJSONLintValid('instanceText', null);
    },
    showFeatures: function(newVal) {
      localStorage.setItem('showFeatures', JSON.stringify(newVal));
    },
    jsonLintValid: {
      handler: function() {
        this.ajvValidationSuccess = null;
        this.validateIfPossible();
      },
      deep: true,
    },
  },
  beforeMount: function() {
    const data = _.get(this, '$route.params.data');

    if (!data) {
      if (localStorage.getItem('showFeatures')) {
        Vue.set(
          this,
          'showFeatures',
          JSON.parse(localStorage.getItem('showFeatures'))
        );
      }
    } else {
      Vue.set(this, 'showFeatures', false);
    }

    if (data) {
      this.loadFromUrl(data);
    } else {
      this.loadFromLocalStorage();
    }
  },
  methods: {
    dismissError() {
      Vue.set(this, 'errorMessage', null);
    },
    loadFromUrl: async function (data) {
      let json = tryParse(data);

      if(!json) {
        // Load from remote URL and try again...
        const decodedData = await shortner.retrieveDataFromURL(data).catch((reason) =>{
          Vue.set(this, 'errorMessage', reason.message);
        });
        if(!decodedData) {
          return;
        }
        json = tryParse(decodedData);
      }


      if (!json) {
        this.$ga.exception(`URL decode error\n\nData: "${data}"`);
        Vue.set(this, 'errorMessage', 'Failed to load data from URL. Sorry.');
        this.$router.replace('/');
        return;
      }

      const {i, s} = json;

      if (i) {
        Vue.set(this, 'instanceText', i);
        this.$ga.event('Share Link', 'loaded instance');
      }

      if (s) {
        Vue.set(this, 'primarySchemaText', s);
        this.$ga.event('Share Link', 'loaded schema');
      }

      // this.$router.replace('/');
    },
    loadFromLocalStorage() {
      if (localStorage.getItem('primarySchemaText')) {
        Vue.set(
          this,
          'primarySchemaText',
          localStorage.getItem('primarySchemaText')
        );
      }
      if (localStorage.getItem('instanceText')) {
        Vue.set(this, 'instanceText', localStorage.getItem('instanceText'));
      }
    },
    validate: function() {
      this.checkingValidation = true;
      this.ajvValidationSuccess = null;
      this.ajvSchemaError = [];
      this.ajvValidationErrors = [];

      const schema = JSON.parse(this.primarySchemaText);
      const jsonInstance = JSON.parse(this.instanceText);

      const ajv = Ajv({ allErrors: true, verbose: true, jsonPointers: true });

      const validSchema = ajv.validateSchema(schema);

      if (!validSchema) {
        this.ajvSchemaError = ajv.errors;
        return;
      }

      const validator = ajv.compile(schema);
      const result = validator(jsonInstance);

      if (result) {
        this.ajvValidationErrors = [];
        this.ajvValidationSuccess = true;
        if (this.primarySchemaText != '{}') {
          this.$ga.event('overall validation', 'validate', 'true');
        }
      } else {
        this.ajvValidationErrors = validator.errors;
        this.ajvValidationSuccess = false;
        this.$ga.event('overall validation', 'validate', 'false');
      }

      this.checkingValidation = false;
    },
    formatSchemaErrors: function(error) {
      return `${error.message}.\n${error.keyword} at "${error.schemaPath}"\nInstance location: "${error.dataPath}"`;
    },
    validateIfPossible: _.debounce(function() {
      if (this.allJSONValid) {
        this.validate();
      }
    }, 300),
    updateJSONLintValid: function(name, valid) {
      Vue.set(this.jsonLintValid, name, valid);
    },
    updateEditorTheme: function(theme) {
      Vue.set(this, 'editorTheme', theme);
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.vue-codemirror {
  border: 1px solid #eee;
  height: 100%;
  width: 100%;
  text-align: left;
}
</style>
