<template>

  <div id="app">
    <b-container fluid>
      <b-row>
        <h1>JSON Schema Check</h1>
      </b-row>
<!--     <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
      <b-row>
        <b-col>
          <!-- <textarea id="schema" v-model="schema" cols="100" rows="30" v-on:change="debug($event)"></textarea> -->
          <editor v-model="schema" @init="editorInit" lang="JSON" theme="chrome" width="100%" height="80"></editor>
        </b-col>
        <b-col>
          <editor v-model="instance" @init="editorInit" lang="JSON" theme="chrome" width="100%" height="80%"></editor>
          <!-- <textarea id="data" v-model="instance" cols="100" rows="30" v-on:change="debug($event)"></textarea> -->
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <button v-on:click="validate">Check valid</button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

var Ajv = require('ajv');
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
      // require('brace/mode/javascript')    //language
      // require('brace/mode/less')
      require('brace/theme/chrome')
      // require('brace/snippets/javascript') //snippet
    },
    validate: function() {
      this.debug(this.schema);
      this.debug(this.instance);

      const jsonSchema = JSON.parse(this.schema);
      const jsonInstance = JSON.parse(this.instance);

      const ajv = Ajv();
      const validator = ajv.compile(jsonSchema);
      const result = validator(jsonInstance);

      if (result) {
        console.log('Data is valid', data);
      } else {
        console.log('Validation errors:', validator.errors);
      }

    },
    debug: function(data) {
      console.log(data);
    }
  },
  data: function () {
    return {
      schema: "",
      instance: "" ,
    }
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
  margin-top: 60px;
}
</style>
