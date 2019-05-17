import Vue from 'vue';
import App from './App.vue';

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import VueCodemirror from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'


import { library } from '@fortawesome/fontawesome-svg-core';

import {FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome';
import {
  faQuestionCircle,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-regular-svg-icons';

import {
  faMinusCircle,
  faCheckDouble,
  faCircleNotch,
  faCheck,
  faClipboardList,
  faTasks,
  faHandHoldingHeart,
  faCogs,
  faFileAlt,
  faIndent,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import {
  faGithub,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faQuestionCircle,
  faCheckCircle,
  faMinusCircle,
  faTimesCircle,
  faCheckDouble,
  faCircleNotch,
  faCheck,
  faClipboardList,
  faTasks,
  faHandHoldingHeart,
  faCogs,
  faFileAlt,
  faIndent,
  faTimes,
  faGithub,
  faTwitter,
);

import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-140186694-1',
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production',
  }
})

Vue.use(VueCodemirror);

Vue.component('icon', FontAwesomeIcon);

Vue.component('icon-layers', FontAwesomeLayers)

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
