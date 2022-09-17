import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'


// 我们后面再讨论嵌套路由。
const routes  = [
    { path: '/',redirect:'/environment-geometry' },
    { path: '/environment-geometry',title:"环境球体", component: ()=>import('../three/environment-geometry.vue') },
    { path: '/door',title:"门", component: ()=>import('../three/door.vue') },
    { path: '/shadow',title:"阴影", component: ()=>import('../three/shadow.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
