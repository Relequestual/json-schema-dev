<template>
  <div>
    <b-container fluid>
      <b-row class="mb-3">
        <b-col>
          <p>
            <span class="align-middle mr-1">Valid JSON:</span>
            <icon
              v-if="this.JSONValid === true"
              :icon="['far', 'check-circle']"
              size="2x"
              class="align-middle text-success"
            />
            <icon
              v-else-if="this.JSONValid === false"
              :icon="['far', 'times-circle']"
              size="2x"
              class="align-middle text-danger"
            />
            <icon
              v-else
              :icon="['far', 'question-circle' ]"
              size="2x"
              class="align-middle"
            />
          </p>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <codemirror
          ref="cm"
          v-model="editorText"
          :options="cmOption"
        />
      </b-row>
      <b-row v-if="this.JSONValid === false">
        <b-col>
          <b-alert
            show
            variant="danger"
          >
            <code class="text-left"><pre>{{ this.jsonErrorMessage }}</pre></code>
          </b-alert>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from 'lodash';

import CodeMirror from 'codemirror';

// import 'codemirror/theme/solarized.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/mode/javascript/javascript.js'

import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/json-lint.js';

import 'codemirror/addon/display/panel.js';

const jsonlint = require("jsonlint");
window.jsonlint = jsonlint;

export default {
  name: 'JsonEditor',
  props: {
    fileName: String,
    jsonText: String,
    theme: String,
  },
  data: function () {
    return {
      editorText: this.jsonText,
      checkingValidation: false,
      JSONValid: null,
      JSONErrors: [],
      cmOption: {
        mode: 'application/json',
        theme: this.theme || 'default',
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
  computed: {
    jsonErrorMessage: function () {
      console.log(this.JSONErrors);
      return this.JSONErrors.length === 0 ? '' : this.JSONErrors[0].message;
    },
  },
  methods: {
    debug: function(data) {
      console.log(data);
    },
    jsonlintCheck: function(cm, updateLinting) { // This should be debounced
      if (this.$refs.cm.codemirror === null) {
        return [];
      }
      const errors = CodeMirror.lint.json(cm);
      this.JSONErrors = errors;
      if(errors.length === 0) {
        this.JSONValid = true
      } else {
        this.JSONValid = false
      }
      this.$emit('update-valid-status', this.JSONValid);
      updateLinting(errors);
    },
    changeTheme: function(theme) {
      if(theme && theme !== 'default'){
        // Solarized light and dark are the only themes which don't use their own CSS file.
        theme = theme.replace(/\s.+/, '');
        require('codemirror/theme/' + theme + '.css');
      }
    },
  },
  watch: {
    editorText: _.debounce( function (newVal) {
      this.$emit('update:jsonText', newVal);
      // if (!this.schemaValidJSON){
      //   this.schemaJSONErrors.push(e)
      // }
    }),
    theme: function() {
      this.changeTheme(this.theme);
      this.$refs.cm.codemirror.setOption('theme', this.theme);
    }
  },
  mounted: function() {
    this.$refs.cm.codemirror.setSize("100%", "500px");
  },
}
</script>

<style>

.vue-codemirror {
  border: 1px solid #eee;
  height: 100%;
  width: 100%;
  text-align: left;
}
</style>


