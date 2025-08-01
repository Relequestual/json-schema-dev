<template>
  <b-btn :variant="`outline-${btnVariant}`" :disabled="disabled" @click="saveURLClick()">
    <icon
      :icon="['fas', 'cloud-upload-alt']"
      class=""
      size="sm"
    /> {{ btnMessage }}
  </b-btn>
</template>

<script>
import Vue from 'vue';
import shorter from '../utilities/shortner';

const initialData = () => {
  return {
    btnVariant: 'dark',
    btnMessage: 'Save',
    disabled: false,
    saving: false,
    saved: false,
  }
};

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
  data: () => {
    return {
      ...(initialData()),
      savedSchema: '',
      savedInstance: '',
    }
  },
  computed: {
    userDataModified: function () {
      return (this.schema != this.savedSchema) || (this.instance != this.savedInstance);
    },
  },
  watch: {
    saving: function (newSaving) {
      if(newSaving) {
        Vue.set(this, 'btnVariant', 'info');
        Vue.set(this, 'btnMessage', 'Saving...');
        Vue.set(this, 'disabled', true);
      }
    },
    saved: function (newSaved) {
      if(newSaved) {
        Vue.set(this, 'btnVariant', 'success');
        Vue.set(this, 'btnMessage', 'Saved!');
        Vue.set(this, 'savedSchema', this.schema);
        Vue.set(this, 'savedInstance', this.instance);
      }
    },
    userDataModified: function (newDataModified) {
      if(newDataModified) {
        this.resetData();
      }
    }
  },
  methods: {
    saveURLClick: async function() {
      Vue.set(this, 'saving', true);
      try{
        const url = await shorter.genSaveURL({ sharedSchema: this.schema, sharedInstance: this.instance});
        const shortURL = await shorter.shortenURL(url);
        this.$router.replace(`/s/${shortURL}`);
        Vue.set(this, 'saved', true);
      } catch(e) {
        this.resetData();
        this.$emit('error', e.message);
      }
    },
    resetData: function (){
      const data = initialData();
      for (const key in data) {
        Vue.set(this, key, data[key]);
      }
    }
  },
}
</script>
