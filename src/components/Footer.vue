<template>
  <div style="height:100px">
    <b-container fluid class="bg-light p-3">
      <b-row>
        <b-col>
          <p>
            <a
              href="https://github.com/Relequestual/json-schema-dev"
              target="_blank"
              class="mr-2 text-secondary"
            ><icon :icon="['fab', 'github']" class="mr-1" />jsonschema.dev</a>
            <a
              href="https://twitter.com/relequestual"
              target="_blank"
              class="mr-2 text-secondary"
            ><icon :icon="['fab', 'twitter']" class="mr-1" />@relequestual</a>
            Thanks to Sponsors:
            <a href="https://ko-fi.com/F1F3TKJK" target="_blank">
              <img
                height="36"
                style="border:0px;height:36px;"
                src="https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2"
                border="0"
                alt="Buy Me a Coffee at ko-fi.com"
              >
            </a>
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Footer',
};
</script>
