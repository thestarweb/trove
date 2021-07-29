import { createApp } from 'vue'
import StarUI from "@thestarweb/ui"
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(StarUI).use(store).use(router).mount('#app')
