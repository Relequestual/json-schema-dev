<template>
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
        JSONSchema.dev -
      </b-navbar-brand>
      <b-navbar-brand href="#results">
        {
        <icon :icon="['fas', 'check-double']" :class="ajvValidationSuccess === true ? 'text-success' : ''" />
        /
        <icon :icon="['fas', 'times']" :class="ajvValidationSuccess === false ? 'text-danger' : ''" />
        }
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
          <a href="https://ko-fi.com/F1F3TKJK" target="_blank">
            <img
              height="36"
              style="border:0px;height:36px;"
              src="https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2"
              border="0"
              alt="Buy Me a Coffee at ko-fi.com"
            >
          </a>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navigation',
  props: {
    ajvValidationSuccess: {
      type: Boolean,
    }
  }
}
</script>
