import * as Vue from 'vue';
import App from './App.vue';
import store from './store/store.js'
import router from './router';

const app = Vue.createApp(App);

app.use(router).use(store).mount('#root');