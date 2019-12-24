<template>
  <b-btn variant="outline-dark" @click="saveURLClick()">
    <icon
      :icon="['fas', 'cloud-upload-alt']"
      class=""
      size="sm"
    /> Save
  </b-btn>
</template>

<script>
import shorter from '../utilities/shortner';

export default {
  name: 'SaveButton',
  props: {
    schema: {
      type: String,
      required: true,
    },
    instance: {
      type: String,
      required: true,
    },
  },
  methods: {
    saveURLClick: async function() {
      const url = await shorter.genSaveURL({ sharedSchema: this.schema, sharedInstance: this.instance});
      const shortURL = await shorter.shortenURL(url);
      this.$router.replace(`/s/${shortURL}`);
    }
  },
}
</script>
