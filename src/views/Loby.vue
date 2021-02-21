<template>
  <div class="create">
    <Login v-if="!$store.getters.is_logged" @onLogin="isCreating ? createGame() : joinGame()"></Login>
    <div class="room-info" v-else-if="game" >
      <div class="players">
        <UserInfo v-for="user in game.users" :key="user.uuid" :user="user"/>
      </div>
      <div class="parameters" v-if="isAdmin">
        <input v-model="game.page_start" placeholder="page start">
        <input v-model="game.page_end" placeholder="page end">
        <button @click="copyLink()" >Copy invite link</button>
        <button @click="startGame()" >Start</button>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/components/Login";
import UserInfo from "@/components/UserInfo";

export default {
  name: "Create",
  data: function(){
    return {
      game: undefined
    }
  },
  computed: {
    isCreating: function() {
      return this.$route.query.i === undefined
    },
    isAdmin: function() {
      return this.game !== undefined && this.game.user_admin.uuid === this.$store.state.uuid
    }
  },
  created: function() {
    if(this.$store.getters.is_logged) {
      if(this.isCreating)
        this.createGame()
      else
        this.joinGame()
    }
    const self = this
    this.$store.state.connection.onmessage = function(e){
      const data = JSON.parse(e.data)
      if(self.game) {
        if(data.event == "user enter"){
          self.game.users.push(data.data)
        }
      }
    }
  },
  components: {
    UserInfo,
    Login
  },
  methods: {
    createGame: function (){
      const requestOptions = {
        method: "POST",
        headers: this.$store.getters.auth_full_header
      }
      const self = this;
      fetch(`${this.$base_url}/create_game`, requestOptions)
          .then(res => res.json())
          .then(res => {
            if(res.message)
              console.log(res.message)

            self.game = res.game
          })
          .catch(err => console.log(err))
    },
    joinGame: function (){
      const requestOptions = {
        method: "POST",
        headers: this.$store.getters.auth_full_header,
        body: new URLSearchParams(`game_id=${this.$route.query.i}`)
      }
      const self = this;
      fetch(`${this.$base_url}/join_game`, requestOptions)
          .then(res => res.json())
          .then(res => {
            if(res.message)
              console.log(res.message)

            self.game = res.game
          })
          .catch(err => console.log(err))
    },
    copyLink: async function (){
      await navigator.clipboard.writeText(`http://localhost:8080/#/loby?i=${this.game.id}`)
    },
    startGame: function (){

    }
  }
}
</script>

<style scoped lang="scss">
.room-info {
  display: grid;
  .players {
    grid-column: 1 / 2;
  }
  .parameters {
    grid-column: 2 / 2;
  }
}
</style>