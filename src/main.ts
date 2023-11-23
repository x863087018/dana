import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'
createApp(App)
const app = createApp(App)
app
  .use(router)
  .use(store)
  .mount('#app')
