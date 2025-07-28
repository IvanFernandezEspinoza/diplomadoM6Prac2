import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.mount('#app')

axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token') || ''}`
    return config
})