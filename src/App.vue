<template>
  <div id="app">
    <b-navbar
      variant="light"
      class="border"
      toggleable="md"
    >
      <b-container>
        <b-navbar-brand href="/">
          <span class="text-success">
            {<icon :icon="['fas', 'check-double']" />}
          </span>
          JSONSchema.dev - Validation
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse
          id="nav-collapse"
          is-nav
        >
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-b-toggle.features>
              <icon :icon="['fas', 'hand-holding-heart']" class="mr-1" />Features
            </b-nav-item>
            <b-nav-item v-b-toggle.settings>
              <icon :icon="['fas', 'cogs']" class="mr-1" />Settings
            </b-nav-item>
            <b-nav-item href="https://json-schema.org/specification.html" target="_blank">
              <icon :icon="['fas', 'file-alt']" class="mr-1" />Specification
            </b-nav-item>
            <b-nav-item
              href="https://json-schema.org"
              target="_blank"
            >
              JSON-Schema.org
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <b-container fluid>
      <b-row>
        <b-col>
          <p class="mt-3">
            The home of JSON Schema validation right in your browser
          </p>
          <p>🚧Alpha 🚧</p>
        </b-col>
      </b-row>
      <b-collapse id="features" visible>
        <b-container>
          <b-card
            class="mb-2"
            header-tag="header"
          >
            <div slot="header">
              <b-button
                v-b-toggle.features
                class="float-right"
                variant="light"
              >
                X
              </b-button>
              <h4>Features</h4>
            </div>
            <b-card-text>
              <p>JSONSchema.dev allows you to try using and test JSON Schema quickly and easily.</p>
              <p>
                Using the javascript library <a href="https://ajv.js.org/" target="_blank ">ajv</a>
                for JSON Schema based validation, all validation happens in browser.
              </p>
              <p>All text is stored using local storage in your browser, so it will be here when you come back later.</p>
            </b-card-text>
            <b-card-group deck>
              <b-card
                border-variant="success"
                header-tag="header"
              >
                <h4
                  slot="header"
                  class="mb-0"
                >
                  <icon
                    :icon="['fas', 'check']"
                    class="text-success mr-1"
                  />Current
                </h4>
                <b-list-group flush>
                  <b-list-group-item>
                    JSON linting using <a
                      href="https://github.com/zaach/jsonlint"
                      target="_blank"
                    >json lint</a> for schema and instance JSON
                  </b-list-group-item>
                  <b-list-group-item>In editor JSON lint error reporting</b-list-group-item>
                  <b-list-group-item>
                    JSON Schema based validation using <a
                      href="https://ajv.js.org/"
                      target="_blank "
                    >ajv</a>
                  </b-list-group-item>
                  <b-list-group-item>Basic JSON Schema sanity checks using ajv</b-list-group-item>
                  <b-list-group-item>JSON Schema validation error reporting</b-list-group-item>
                  <b-list-group-item>Edit in style with your choice of themes</b-list-group-item>
                  <b-list-group-item>Auto format JSON</b-list-group-item>
                </b-list-group>
              </b-card>
              <b-card
                border-variant="info"
                header-tag="header"
              >
                <h4
                  slot="header"
                  class="mb-0"
                >
                  <icon
                    :icon="['fas', 'clipboard-list']"
                    class="text-info mr-1"
                  /> Planned
                </h4>
                <b-list-group flush>
                  <b-list-group-item>
                    <icon
                      :icon="['fas', 'tasks']"
                      class="text-info mr-2"
                    />Edit in YAML with live JSON translation
                  </b-list-group-item>
                  <b-list-group-item>
                    <icon
                      :icon="['fas', 'tasks']"
                      class="text-info mr-2"
                    />In editor JSON Schema validation error reporting
                  </b-list-group-item>
                  <b-list-group-item>Shareable JSON Schema and JSON Instance example</b-list-group-item>
                  <b-list-group-item>JSON Schema Lint</b-list-group-item>
                  <b-list-group-item>Save and load JSON Schema and JSON Instance via Github</b-list-group-item>
                  <b-list-group-item>Multi-file JSON Schema support to allow for referencing</b-list-group-item>
                  <b-list-group-item>JSON Schema unit testing</b-list-group-item>
                </b-list-group>
              </b-card>
            </b-card-group>
          </b-card>
        </b-container>
      </b-collapse>
      <b-collapse id="settings">
        <b-container>
          <b-card class="mb-2" header-tag="header">
            <div slot="header">
              <b-button
                v-b-toggle.settings
                class="float-right"
                variant="light"
              >
                X
              </b-button>
              <h4>Settings</h4>
            </div>
            Theme: <select v-model="editorTheme" class="mb-2">
              <option selected="">
                default
              </option>
              <option>3024-day</option>
              <option>3024-night</option>
              <option>abcdef</option>
              <option>ambiance</option>
              <option>base16-dark</option>
              <option>base16-light</option>
              <option>bespin</option>
              <option>blackboard</option>
              <option>cobalt</option>
              <option>colorforth</option>
              <option>darcula</option>
              <option>dracula</option>
              <option>duotone-dark</option>
              <option>duotone-light</option>
              <option>eclipse</option>
              <option>elegant</option>
              <option>erlang-dark</option>
              <option>gruvbox-dark</option>
              <option>hopscotch</option>
              <option>icecoder</option>
              <option>idea</option>
              <option>isotope</option>
              <option>lesser-dark</option>
              <option>liquibyte</option>
              <option>lucario</option>
              <option>material</option>
              <option>mbo</option>
              <option>mdn-like</option>
              <option>midnight</option>
              <option>monokai</option>
              <option>neat</option>
              <option>neo</option>
              <option>night</option>
              <option>nord</option>
              <option>oceanic-next</option>
              <option>panda-syntax</option>
              <option>paraiso-dark</option>
              <option>paraiso-light</option>
              <option>pastel-on-dark</option>
              <option>railscasts</option>
              <option>rubyblue</option>
              <option>seti</option>
              <option>shadowfox</option>
              <option>solarized dark</option>
              <option>solarized light</option>
              <option>the-matrix</option>
              <option>tomorrow-night-bright</option>
              <option>tomorrow-night-eighties</option>
              <option>ttcn</option>
              <option>twilight</option>
              <option>vibrant-ink</option>
              <option>xq-dark</option>
              <option>xq-light</option>
              <option>yeti</option>
              <option>yonce</option>
              <option>zenburn</option>
            </select>
          </b-card>
        </b-container>
      </b-collapse>
      <b-row class="mb-3">
        <b-col md="6">
          <h2>JSON Schema</h2>
          <json-editor
            :json-text.sync="primarySchemaText"
            :theme="editorTheme"
            @update-valid-status="updateJSONLintValid('primarySchemaText', $event)"
          />
        </b-col>
        <b-col md="6">
          <h2>JSON instance</h2>
          <json-editor
            :json-text.sync="instanceText"
            :theme="editorTheme"
            @update-valid-status="updateJSONLintValid('instanceText', $event)"
          />
        </b-col>
      </b-row>
      <b-row
        v-if="this.ajvSchemaError.length !== 0"
        align-h="center"
      >
        <b-col cols="8">
          <b-alert
            show
            variant="danger"
          >
            <h5>Schema Error</h5>
            <code
              v-for="(error, i) in this.ajvSchemaError"
              :key="i"
              class="text-left"
            >
              <pre>"{{ error.dataPath }}" {{ error.message }} </pre>
            </code>
          </b-alert>
        </b-col>
      </b-row>
      <b-row
        v-if="this.ajvValidationErrors.length !== 0"
        align-h="center"
      >
        <b-col cols="8">
          <b-alert
            show
            variant="danger"
          >
            <h5>Validation Error</h5>
            <code
              v-for="error in this.schemaValidationErrorMessages"
              :key="error"
              class="text-left"
            >
              <pre>{{ error }}</pre>
            </code>
          </b-alert>
        </b-col>
      </b-row>
      <b-row
        v-if="ajvValidationSuccess === true"
        align-h="center"
      >
        <b-col cols="8">
          <b-alert
            show
            variant="success"
          >
            <h5>
              <icon
                v-if="this.ajvValidationSuccess === true"
                :icon="['far', 'check-circle']"
                size="2x"
                class="align-middle"
              />
              Validation Successful
            </h5>
          </b-alert>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue';
import _ from 'lodash';

import JSONEditor from './components/JSONEditor.vue'
// const jsonlint = require("jsonlint");

const Ajv = require('ajv');
// require('ajv-async')(Ajv);

export default {
  name: 'App',
  components: {
    'json-editor': JSONEditor,
  },
  data: function () {
    return {
      checkingValidation: false,
      schema: null,
      primarySchemaText: "{\n\n}",
      instanceText: "{\n\n}" ,
      ajvValidationErrors: [],
      ajvSchemaError: [],
      ajvValidationSuccess: null,
      jsonLintValid: {},
      editorTheme: 'default',
    };
  },
  computed: {
    schemaValidationErrorMessages: function () {
      return this.ajvValidationErrors.map(error => this.formatSchemaErrors(error)) || [];
    },
  },
  methods: {
    validate: function() {
      this.checkingValidation = true;
      this.ajvValidationSuccess = null;
      this.ajvSchemaError = [];
      this.ajvValidationErrors = [];
      this.debug(this.primarySchemaText);
      this.debug(this.instanceText);

      // try {
      //   this.schema = jsonlint.parse(this.primarySchemaText);
      //   this.validSchemaJSON = true;
      // } catch(e) {
      //   this.validSchemaJSON = false;
      //   this.checkingValidation = false
      //   console.log(e);
      //   return;
      // }

      const schema = JSON.parse(this.primarySchemaText);
      const jsonInstance = JSON.parse(this.instanceText);

      const ajv = Ajv({ allErrors: true, verbose: true, jsonPointers: true });

      const validSchema = ajv.validateSchema(schema);

      if(!validSchema) {
        this.debug(ajv.errors);
        this.ajvSchemaError = ajv.errors;
        return;
      }
      this.debug('+++IS valid schema');

      const validator = ajv.compile(schema);
      const result = validator(jsonInstance);

      if (result) {
        this.debug('Data is valid', result);
        this.ajvValidationErrors = [];
        this.ajvValidationSuccess = true;
      } else {
        this.debug('Validation errors:', validator.errors);
        this.ajvValidationErrors = validator.errors;
        this.ajvValidationSuccess = false;
      }

      this.checkingValidation = false

    },
    formatSchemaErrors: function(error) {
      return `${error.message}.\n${error.keyword} at "${error.schemaPath}"`;
    },
    updateJSONLintValid: function(name, valid) {
      this.debug("event in main app");
      this.debug(name);
      this.debug(valid);
      Vue.set(this.jsonLintValid, name, valid);
      // this.jsonLintValid[name] = valid;
    },
    debug: function(data) {
      console.log(data);
    },
  },
  watch: {
    jsonLintValid: {
      handler: _.debounce( function () {
        this.ajvValidationSuccess = null;
        this.debug("jsonLintValid watch called");
        this.debug(Object.values(this.jsonLintValid));
        this.debug(_.indexOf(Object.values(this.jsonLintValid), false));
        if(_.indexOf(Object.values(this.jsonLintValid), false) === -1){
          this.debug("looks like there's nothing invalid");
          this.validate();
        } else {
          this.debug("!!!looks like there's something invalid");
        }
      }),
      deep: true,
    },
    // instanceText: _.debounce( function () {
    //   this.validate();
    // }, 1000),
    // primarySchemaText: _.debounce( function () {
    //   this.validate();
    // }, 1000),
  },
}
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


<!-- Trying to fix JSON linter to include error about duplicate keys
also looking at using codemirror panel for buttons / as a toolbar -->