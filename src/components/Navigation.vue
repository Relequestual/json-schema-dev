<template>
  <b-navbar
    variant="light"
    class="border"
    toggleable="md"
    fixed="top"
    :sticky="true"
  >
    <b-container>
      <b-navbar-brand href="/">
        <span class="text-success">
          {<icon :icon="['fas', 'check-double']" />}
        </span>
        <span
          id="nav-site-name"
          class="d-none d-lg-block float-left mr-2"
        >
          JSONSchema.dev
        </span>
      </b-navbar-brand>
      <b-navbar-nav>
        <slot name="save-button" />
      </b-navbar-nav>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-b-toggle.settings>
            <icon :icon="['fas', 'cogs']" class="mr-1" />Settings
          </b-nav-item>
          <b-nav-item v-b-toggle.features>
            <icon :icon="['fas', 'hand-holding-heart']" class="mr-1" />Features
          </b-nav-item>
          <b-nav-item
            href="https://json-schema.org/specification.html"
            target="_blank"
          >
            <icon :icon="['fas', 'file-alt']" class="mr-1" />Specification
          </b-nav-item>
          <b-nav-item
            href="https://json-schema.org"
            target="_blank"
            class="mt-auto mb-auto"
            style="white-space:nowrap;"
          >
            JSON-Schema.org
          </b-nav-item>
          <a
            href="https://ko-fi.com/F1F3TKJK"
            target="_blank"
            class="mt-auto mb-auto"
          >
            <img
              style="border:0px;height:36px;"
              src="https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2"
              alt="Buy Me a Coffee at ko-fi.com"
            >
          </a>
          <!-- Calendly link widget begin -->
          <a class="btn btn-primary ml-2" href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/jsonschema/lets-talk-75'});return false;">Schedule consult</a>
          <!-- Calendly link widget end -->
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>

export default {
  name: 'Navigation',
  mounted: function () {
    const script = document.createElement('script')
    script.type = 'text/javascript';
    script.src = '//assets.calendly.com/assets/external/widget.js';
    this.$el.append(script);
    // Calendly.initBadgeWidget({ url: 'https://calendly.com/jsonschema', text: 'Schedule a consult', color: '#00a2ff', textColor: '#ffffff', branding: true });
  },
};
</script>
<style lang="css">
  @import 'https://assets.calendly.com/assets/external/widget.css';
</style>
