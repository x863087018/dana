import { createApp } from 'vue'
import './assets/reset.scss'
import App from './App.vue'
import store from './store'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
createApp(App)
const app = createApp(App)
app
  .use(router)
  .use(store)
  .use(Antd).mount('#dana')
