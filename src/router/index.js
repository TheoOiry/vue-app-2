import Vue from 'vue'
import VueRouter from 'vue-router'
import Lobby from "@/views/Lobby";
import Game from "@/views/Game";

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Lobby },
  { path: '/lobby', name: 'Lobby', component: Lobby },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    props: route => ({ game_id: route.query.i })
  },
]

const router = new VueRouter({
  routes
})

export default router
