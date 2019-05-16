<template>
  <div>
    <b-container fluid>
      <b-row class="mb-3">
        <b-col>
          <p>
            <span class="align-middle mr-1">Valid JSON:</span>
            <icon
              v-if="JSONValid === true"
              :icon="['far', 'check-circle']"
              size="2x"
              class="align-middle text-success"
            />
            <icon
              v-else-if="JSONValid === false"
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
        <b-col>
          <b-card no-body class="p-2">
            <b-button-toolbar>
              <b-button-group class="ml-auto">
                <b-button
                  title="Auto indent"
                  variant="outline-dark"
                  @click="autoIndentEditorText()"
                >
                  <icon :icon="['fas', 'indent']" />
                </b-button>
              </b-button-group>
            </b-button-toolbar>
          </b-card>
          <div>
            <codemirror
              ref="cm"
              v-model="editorText"
              :options="cmOption"
            />
          </div>
        </b-col>
      </b-row>
      <b-row v-if="JSONValid === false">
        <b-col>
          <b-alert
            show
            variant="danger"
          >
            <code class="text-left"><pre>{{ jsonErrorMessage }}</pre></code>
          </b-alert>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from 'lodash';

import CodeMirror from 'codemirror';

import 'codemirror/addon/lint/lint.css';
import 'codemirror/mode/javascript/javascript.js';

import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/json-lint.js';

import Vue from 'vue';

const jsonlint = require("jsonlint");
window.jsonlint = jsonlint;

export default {
  name: 'JsonEditor',
  props: {
    fileName: {
      type: String,
      required: true,
    },
    jsonText: {
      type: String,
      default: '{}',
    },
    theme: {
      type: String,
      default: 'default',
    },
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
        tabSize: 2,
        foldGutter: true,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        lint: {
          async: true,
          getAnnotations: this.jsonlintCheck,
        },
        viewportMargin: Infinity,
        extraKeys: {
          Tab: function(cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
          }
        },
      },
    };
  },
  computed: {
    jsonErrorMessage: function () {
      return this.JSONErrors.length === 0 ? '' : this.JSONErrors[0].message;
    },
  },
  watch: {
    editorText: _.debounce( function (newVal) {
      this.$emit('update:jsonText', newVal);
      // this.$refs.cm.codemirror.setValue(newVal);
      // if (!this.schemaValidJSON){
      //   this.schemaJSONErrors.push(e)
      // }
    }),
    jsonText: function(newVal) {
      // this.$emit('update:jsonText', newVal);
      Vue.set(this, 'editorText', newVal);
    },
    theme: function() {
      this.changeTheme(this.theme);
      this.$refs.cm.codemirror.setOption('theme', this.theme);
    }
  },
  mounted: function() {
    this.$refs.cm.codemirror.setSize("100%", "500px");
  },
  methods: {
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
    autoIndentEditorText: function() {
      console.log('===called stringify')
      if(this.JSONValid) {
        const newVal = JSON.stringify(JSON.parse(this.editorText), null, 2);
        Vue.set(this, 'editorText', newVal);
      }
    }
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


