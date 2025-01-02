//创建一个路由器，并暴露出去

//第一步 : 引入createRouter
import { createRouter, createWebHashHistory } from 'vue-router'

//引入一个一个可以能要呈现的组件

import AGVCar from '../view/AGVCar/AGVCar.vue'
import AGVSetting from '../view/AGVCar/AGVSetting.vue'
const routes = [
    {
        path: '/setting',
        component: AGVSetting
      },
      {
        path: '/',
        component: AGVCar
      }
  ];
//第二步 : 创建路由器
const router = createRouter({
    history : createWebHashHistory(), //路由器的工作模式
    routes
})

//暴露出去
export default router
