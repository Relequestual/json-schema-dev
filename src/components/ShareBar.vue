<template>
  <b-container class="mb-3 ml-auto mr-auto">
    <b-row class="mb-3">
      <b-col md="8" class="ml-auto mr-auto">
        <b-input-group>
          <b-input-group-text slot="prepend" :class="`${shareURL == null ? '' : 'text-success'}`">
            Share schema
            <icon
              :class="{'text-muted': shareURL === null}"
              :icon="['far', 'check-circle']"
              class="align-middle ml-1"
            />
          </b-input-group-text>
          <b-form-input
            class="share-url"
            v-model="shareURL"
            placeholder="Shareable link not ready"
            @click="selectLinkText"
            readonly
          />
          <b-input-group-append>
            <b-button variant="outline-dark" @click="copyLink()">
              <icon
                v-if="copiedLink === true"
                :icon="['fas', 'clipboard-check']"
                class="text-success"
              />
              <icon v-else-if="shareURL == null" :icon="['far', 'clipboard']" />
              <icon
                v-else
                :icon="['far', 'clipboard']"
              />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-alert
      v-if="linkBytes > 2000"
      show
      variant="warning"
      dismissible
    >
      <p>
        The link being generated is over 2000 bytes ({{ linkBytes }}), and may be <a
          :href="linkSizeLink"
          class="alert-link"
          target="_blank"
        >too long to share in some places and browsers</a>.
      </p>
      <p>Consider using a smaller schema and instance for sharing.</p>
      <p>Sharing using GitHub Gists is planned.</p>
    </b-alert>
  </b-container>
</template>

<script>
import Vue from 'vue';

import _ from 'lodash';
import LZ from 'lz-string';

const linkSizeLink = 'https://itty.bitty.site/#Link_sizes/XQAAAAIyBQAAAAAAAAAeHMqHyTY4PyKmqfkwr6ooCXSIMxPQ7ojYR153HqZD3W+keVdvwyoyd+luwncAksyBpBYltNr1Oj+0nFtw4rO71K7JRYBTu1/STbYi7TdKa6fx163w7+2NwPfmhoOPwFp2gWV4ZXeA0rB2gi0U/f9/E2cOaRXxIZgD6U7i6ie89XizK8ZD8Fq+/mkO2WUH0lg9l4PA8NUA4dETHmtQudwTqIJL20SLWQ869JVs8/sYUY6BxSzDgdelbMfaJp4YOuMV0trst4M0VycsfX7c4lFzueWTLzBWWWZLbv0cng0f6Yucm6Spvy04sIcHd7745pNbf8qoFG8Lk+ZTVNQEGvw3062z32Mt1RC1aiEfrT+/2WDIDj0QCJNiVgjHGsyvEEJUdKESrTEVRSPHkH3mS9ZM0yHEH2FiNWLHeHV08kcsHw517OziyN2/I6HEgRxRBv6qazKKSWv2YL3sKtL1bHmlw1kEmk3oXZUPui8nTDz69+6538W4XvsnGgn1VCy/6Ro99wWHxDQ4JwGuHJLCralhEFFM5PamhzrITZsULHd1DQdZWJgCrADVpHMZN9oV/zt6B5Za/N67UQJk/MwB+IG9f89weYnIKR8dyENh5V7i+52eMtcLiyPDyKUxz2N5YLq1bn1iDi4v4WV2bWNYZNNZX807U3xehdpiE0Z7ekifCX0qn6iMTzch8kCeGawescQEukIv2cxu3oEU8Je3l5LhUqVtxx43frl2X8T0qRzL4iy5gFnOC65uIVCWEKuiK7BBCqX2fG++EZqw60D4/e3p0PHdCS74kNlxooJpcahblAZzdd+u01Q0o+Bd9cBHiNw//P75XruL';

export default {
  name: 'ShareBar',
  props: {
    schema: {
      type: String,
      required: true,
    },
    instance: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      required: true,
    },
  },
  data () {
    return {
      sharedSchema: null,
      sharedInstance: null,
      compressedData: null,
      isShareLinkValid: null,
      showShareLink: false,
      copiedLink: false,
      autoUpdateShareURL: true,
      linkSizeLink: linkSizeLink,
      linkBytes: null,
    };
  },
  computed: {
    shareURL: function () {
      const {origin} = window.location;

      return this.compressedData ? `${origin}/s/${this.compressedData}` : null;
    },
  },
  watch: {
    shareURL: function (newVal) {
      if(newVal === null) {
        return;
      }
      const newLinkBytes = Buffer.byteLength(this.shareURL, 'utf8');
      Vue.set(this, 'linkBytes', newLinkBytes);
    }
  },
  mounted: function() {
    if (!this.isDefault) {
      this.updateShareURL();
    }
    this.watchForDataChange();
  },
  methods: {
    selectLinkText(event) {
      event.target.setSelectionRange(0, event.target.value.length);
    },
    updateShareURL: _.debounce(function() {
      const compressed = LZ.compressToEncodedURIComponent(JSON.stringify({
        s: this.schema,
        i: this.instance
      }));
      Vue.set(this, 'compressedData', compressed);
      Vue.set(this, 'copiedLink', false);
    }, 250),
    showLink: function() {
      this.showShareLink = true;
    },
    copyLink: function () {
      const context = this;
      this.$copyText(this.shareURL).then(function () {
        Vue.set(context, 'copiedLink', true);
        this.$ga.event('Share Link', 'copy link');
      }, function (e) {
        alert('Cannot copy to clipbaord. Please select text and copy manually. Please report issue to @relequestual');
        this.$ga.exception(`Cannot copy to clipboard. Error: ${e.message}`);
      });
    },
    watchForDataChange: function() {
      const unwatch = this.$watch(
        function () { return `${this.schema}${this.instance}` },
        function () {
          Vue.set(this, 'compressedData', null);
          this.updateShareURL();
          if (!this.autoUpdateShareURL) {
            unwatch();
          }
        }
      );
    },
  },
}
</script>

<style>
  .share-url:read-only {
    background-color: white;
  }
</style>
