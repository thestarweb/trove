import { createApp } from 'vue';
import StarUI from "@thestarweb/ui";
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from "@/lang/index";

createApp(App).use(StarUI).use(i18n).use(store).use(router).mount('#app');
