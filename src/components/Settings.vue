<template>
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
</template>

<script>
// import Vue from 'vue';

export default {
  name: 'Settings',
  props: {
    editorThemeGiven: {
      type: String,
      required: true,
    },
  },
  data: function() {
    return {
      editorTheme: 'default',
    }
  },
  watch: {
    editorTheme: function(newVal) {
      this.$emit('update-editor-theme', newVal);
    }
  },
  beforeMount: function () {
    this.editorTheme = this.editorThemeGiven;
  },
}
</script>
