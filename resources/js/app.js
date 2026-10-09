import { createApp } from 'vue'
import KinnorApp from './KinnorApp.vue'

const menu = JSON.parse(document.getElementById('published-menu')?.textContent ?? 'null');
createApp(KinnorApp).provide('publishedMenu', menu).mount('#kinnor-app');
