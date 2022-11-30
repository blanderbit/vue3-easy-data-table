import { createApp } from 'vue';
import App from './App.vue';
import { appDirectives } from './directives';

const app = createApp(App);
app.use(appDirectives).mount('#app');
