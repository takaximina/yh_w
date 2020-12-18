import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui';
import http from '@/utils/request'

import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$http=http;
Vue.config.productionTip = false
Vue.use(ElementUi);
new Vue({
  render: h => h(App),
}).$mount('#app')
