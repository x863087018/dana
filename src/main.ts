import { createApp } from 'vue'
import './assets/reset.scss'
import App from './App.vue'
import store from './store'
import router from './router'
createApp(App)
const app = createApp(App)
app
  .use(router)
  .use(store)
  .mount('#dana')
