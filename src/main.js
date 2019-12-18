import Vue from 'vue';
import VueRouter from 'vue-router';
import VueClipboard from 'vue-clipboard2';
import VueAnalytics from 'vue-analytics';
import BootstrapVue from 'bootstrap-vue';
import VueCodemirror from 'vue-codemirror';

import { library } from '@fortawesome/fontawesome-svg-core';

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from '@fortawesome/vue-fontawesome';
import {
  faQuestionCircle,
  faCheckCircle,
  faTimesCircle,
  faClipboard,
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
  faClipboardCheck,
  faCloudUploadAlt,
} from '@fortawesome/free-solid-svg-icons';

import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'codemirror/lib/codemirror.css';

import App from './App.vue';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(VueAnalytics, {
  id: 'UA-140186694-1',
  autoTracking: {
    exception: true,
  },
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production',
  },
});
Vue.use(VueClipboard);
Vue.use(VueCodemirror);
Vue.component('icon', FontAwesomeIcon);
Vue.component('icon-layers', FontAwesomeLayers);

Vue.config.productionTip = false;

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
  faClipboard,
  faClipboardCheck,
  faCloudUploadAlt
);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: App,
    },
    {
      path: '/s/:data',
      component: App,
    },
  ],
});

new Vue({
  render: h => h(App),
  router: router,
}).$mount('#app');
