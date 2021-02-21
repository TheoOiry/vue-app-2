import Vue from 'vue'
import VueRouter from 'vue-router'
import Loby from "@/views/Loby";
Vue.use(VueRouter)

const routes = [
  { path: '/', component: Loby },
  { path: '/loby', name: 'Loby', component: Loby }
]

const router = new VueRouter({
  routes
})

export default router
