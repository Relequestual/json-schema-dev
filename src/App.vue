<template>

  <div id="app">
    <b-container fluid>
      <b-row>
        <b-col>
          <h1>JSON Schema Check</h1>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col md="6">
          <b-row class="mb-3">
            <b-col>
              <h2>JSON Schema</h2>
              <p>Valid JSON:
                <icon v-if="this.schemaJSONValid === true" :icon="['far', 'check-circle']" size="2x" class="align-middle"></icon>
                <icon v-else-if="this.schemaJSONValid === false" :icon="['far', 'times-circle']" size="2x" class="align-middle"></icon>
                <icon v-else :icon="['far', 'question-circle' ]" size="2x" class="align-middle"></icon>
              </p>
            </b-col>
          </b-row>
          <b-row class="col">
            <!-- <textarea id="schema" v-model="schema" cols="100" rows="30" v-on:change="debug($event)"></textarea> -->
            <!-- <editor v-model="schemaText" @init="editorInit" lang="json" theme="chrome" width="100%" height="500"></editor> -->
            <codemirror ref="schemaCM" v-model="schemaText" :options="cmOption"></codemirror>

          </b-row>
        </b-col>
        <b-col md="6">
          <b-row class="mb-3 col">
            JSON instance Status:  <icon :icon="['far', 'question-circle']" size="2x"></icon>
          </b-row>
          <b-row class="col">
            <editor v-model="instanceText" @init="editorInit" lang="json" theme="chrome" width="100%" height="500"></editor>
            <!-- <textarea id="data" v-model="instance" cols="100" rows="30" v-on:change="debug($event)"></textarea> -->
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col>
          <b-button variant="primary" size="lg" v-on:click="validate">Check valid </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from 'lodash';

import CodeMirror from 'codemirror';

import 'codemirror/theme/solarized.css'
import 'codemirror/addon/lint/lint.css';
import 'codemirror/mode/javascript/javascript.js'

import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/json-lint.js';

import 'codemirror/addon/display/panel.js';

const jsonlint = require("jsonlint");
window.jsonlint = jsonlint;

const Ajv = require('ajv');
// require('ajv-async')(Ajv);

export default {
  name: 'app',
  components: {
    editor: require('vue2-ace-editor'),
  },
  methods: {
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/json')
      require('brace/theme/chrome')
    },
    validate: function() {
      this.checkingValidation = true
      this.debug(this.schemaText);
      this.debug(this.instanceText);

      try {
        this.schema = jsonlint.parse(this.schemaText);
        this.validSchemaJSON = true;
      } catch(e) {
        this.validSchemaJSON = false;
        this.checkingValidation = false
        console.log(e);
        return;
      }
      const jsonInstance = jsonlint.parse(this.instanceText);

      const ajv = Ajv();
      const validator = ajv.compile(this.schema);
      const result = validator(jsonInstance);

      if (result) {
        console.log('Data is valid', result);
      } else {
        console.log('Validation errors:', validator.errors);
      }

      this.checkingValidation = false

    },
    debug: function(data) {
      console.log(data);
    },
    checkJSONValid: function(jsonText, name) {
      try {
        const json = jsonlint.parse(jsonText);
        this[`${name}JSONValid`] = true;
        return json;
      } catch(e) {
        this[`${name}JSONValid`] = false;
        console.log(e);
        return e;
      }
    },
    jsonlintCheck: function(cm, updateLinting, options) {
      if (this.$refs.schemaCM.codemirror === null) {
        return [];
      }
      const errors = CodeMirror.lint.json(cm);
      updateLinting(errors);
    },
  },
  data: function () {
    return {
      checkingValidation: false,
      schema: null,
      schemaText: "",
      instanceText: "" ,
      schemaJSONValid: null,
      schemaJSONErrors: [],
      cmOption: {
        mode: 'application/json',
        theme: 'solarized light',
        gutters: ["CodeMirror-lint-markers"],
        tabSize: 4,
        foldGutter: true,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        lint: {
          async: true,
          getAnnotations: this.jsonlintCheck,
        },
        viewportMargin: Infinity,
      },
    };
  },
  watch: {
    schemaText: _.debounce( function (newVal) {
      // These three lines disable the linter if the content empty, only enabling linting if content has non whitespace content
      const schemaCM = this.$refs.schemaCM.codemirror;
      const lint = newVal.trim();
      // schemaCM.setOption("lint", lint);


      this.schemaJSONValid = null;
      // const response = this.checkJSONValid(newVal, 'schema');
      // if (!this.schemaValidJSON){
      //   this.schemaJSONErrors.push(e)
      // }
    }, 1000),
  },
  mounted: function() {
    this.$refs.schemaCM.codemirror.setSize("100%", "500px");
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