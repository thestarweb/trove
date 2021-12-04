import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/gem/check',
    name: 'gem-check',
    component:() => import('../views/gem/check.vue')
  },
  // {
  //   path: '/mod/edit',
  //   name: 'mod-edit',
  //   component:() => import('../views/mod/edit.vue')
  // },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/lang/editer',
    name: 'lang-editer',
    component:() => import('../views/lang-helper/index.vue')
  },
  { path: '/lang-helper', redirect: '/lang/editer' },
  { path: '/mastery', redirect: '/mastery/trove' },
  {
    path: '/mastery/:type',
    name: 'mastery',
    component:() => import('../views/mastery/index.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
