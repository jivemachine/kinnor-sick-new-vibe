import { createApp } from 'vue'
import KinnorApp from './KinnorApp.vue'

const menu = JSON.parse(document.getElementById('published-menu')?.textContent ?? 'null');
const storeHours = JSON.parse(document.getElementById('published-store-hours')?.textContent ?? 'null');
createApp(KinnorApp)
    .provide('publishedMenu', menu)
    .provide('publishedStoreHours', storeHours)
    .mount('#kinnor-app');
