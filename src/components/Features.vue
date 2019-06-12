<template>
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
</template>

<script>
export default {
  name: 'Features',
}
</script>
