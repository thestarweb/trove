import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/gem/check',
    name: 'Gem-Check',
    component:() => import('../views/gem/check.vue')
  },
  // {
  //   path: '/mod/edit',
  //   name: 'mod-edit',
  //   component:() => import('../views/mod/edit.vue')
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/lang/editer',
    name: 'Lang-Editer',
    component:() => import('../views/lang-helper/index.vue')
  },
  { path: '/lang-helper', redirect: '/lang/editer' }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
