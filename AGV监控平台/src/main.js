import { createApp} from 'vue'
import App from './App.vue'
import Layui from '@layui/layui-vue'
import '@layui/layui-vue/lib/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/index.css'
import {createPinia} from "pinia";
import router from './router'


export const app=createApp(App)
app.use(Layui)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.mount('#app')


