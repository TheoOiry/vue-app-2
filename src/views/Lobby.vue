<template>
  <div class="create">
    <Login v-if="!$store.getters.is_logged" @onLogin="isCreating ? createGame() : joinGame()"></Login>
    <div class="room-info" v-else-if="game" >
      <div class="players">
        <UserInfo class="user_info" v-for="user in game.users" :key="user.uuid" :user="user"/>
      </div>
      <div class="parameters" v-if="isAdmin">
        <div class="parameters__pages">
          <input v-model="game.page_start" placeholder="PAGE START">
          <input v-model="game.page_end" placeholder="END PAGE">
        </div>
        <div class="parameters__game">
          <button @click="copyLink()" >INVITE</button>
          <button @click="startGame()" >START</button>
        </div>
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
    this.$store.state.connection.onmessage = function(e) {
      const data = JSON.parse(e.data)
      if(self.game) {
        if(data.event === "user enter") {
          self.game.users.push(data.data)
        }
        else if(data.event === "game start") {
          self.$router.push({name: 'Game', query: { 'i': data.data.id }})
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
      await navigator.clipboard.writeText(`http://localhost:8080/#/lobby?i=${this.game.id}`)
    },
    startGame: function (){
      const formData = new FormData();
      formData.append("page_start", this.game.page_start)
      formData.append("page_end", this.game.page_end)

      const requestOptions = {
        method: "POST",
        headers: this.$store.getters.auth_full_header,
        body: formData
      }
      fetch(`${this.$base_url}/start_game`, requestOptions)
          .then(res => res.json())
          .then(res => {
            if(res.message)
              console.log(res.message)
          })
          .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped lang="scss">

@import '../script'; // Using this should get you the variables

.room-info {
  display: flex;
  height: 80vh;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 5vh;
  margin-right: 5vw;
  margin-left: 5vw;
  padding-top: 5%;
  box-shadow: 1px 1px 15px 2.5px $dark-grey;
  border-radius: 10px;
  border: 10px;

  .players {
    display: flex;
    flex-direction: column;
    //justify-content: space-between;
    align-items: center;
    width: 20%;
    height: 70%;
    background: rgba(red($dark-grey), green($dark-grey), blue($dark-grey), 0.9);
    border-radius: 75px 30px;
    padding-top: 1%;
    padding-bottom: 0.5%;
    font-weight: 700;
    font-size: 20px;
    font-family: Roboto, sans-serif;
  }
  .parameters {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 45%;
    height: 70%;

    .parameters__pages {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      border-radius: 75px 30px;
      background: rgba(red($dark-grey), green($dark-grey), blue($dark-grey), 0.9);
      width: 100%;
      height: 65%;

      input {
        text-align: center;
        width: 40%;
        height: 15%;
        font-weight: 700;
        font-size: 1.25em;
        border-radius: 10px;
        border: none;

        &:focus {
          outline:none;
        }
      }
    }

    .parameters__game {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      margin-top: 5%;
      width: 70%;
      height: 15%;

      button {
        width: 40%;
        height: 60%;
        font-weight: 700;
        font-size: 1.5em;
        background-color: $light-grey;
        box-shadow: 1px 2px 2px $dark-grey;
        border-radius: 10px;
        border: none;

        &:focus {
          outline:none;
        }

        &:hover {
          background-color: $grey;
          cursor: pointer;
          color: $light-grey;
        }
      }
    }
  }
}

.user_info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 75%;
  border-radius: 30px;
  background-color: $white;
  color: black;
  margin-bottom: 3%;
}
</style>
