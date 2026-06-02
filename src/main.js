import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css'
import { vFocusTrap } from './directives/vFocusTrap.js'

createApp(App).use(router).directive('focus-trap', vFocusTrap).mount('#app')
