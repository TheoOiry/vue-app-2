<template>
  <div class="game">
    <div class="wikiTitles">
      <div class="wikiTitles_container">
        <div class="wikiTitles_unit" v-for="wikiTitles in wikiTitles">
          <span>{{wikiTitles.title}}</span>
        </div>
      </div>
    </div>
    <div class="wiki__page">
      <iframe class="iframe" id="ifr" :src="game.url_start"></iframe>
    </div>
    <div class="players">
      <div class="players_container">
        <UserInfo class="players_unit" v-for="user in game.users" :key="user.uuid" :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import UserInfo from "@/components/UserInfo";

export default {
  name: "Game",
  components: {UserInfo},
  props: {
    game_id: {
      type: String,
      default: undefined
    }
  },
  data: function () {
    return {
      game: undefined,
      wikiTitles: []
    }
  },
  created: function () {
    const requestOptions = {
      method: "GET",
      headers: this.$store.getters.auth_full_header
    }
    const self = this
    fetch(`${this.$base_url}/get_game`, requestOptions)
        .then(res => res.json())
        .then(res => {
          if(res.message)
            console.log(res.message)

          self.game = res.game
          self.wikiTitles.push({title: self.game.page_start, link: self.game.url_start})
          self.iframeStartLink = self.game.url_start
          console.log(self.game.url_start)
        })
        .catch(err => console.log(err))

    window.addEventListener('message', event => {
      if (event.origin.startsWith(`http://localhost:8000`)) {
        this.updateWikiTitles(event)
        console.log(`NEW = ${event.data.new_page.title}`)
        console.log(`LAST = ${event.data.last_page.title}`)
      }
    })
  },
  comments: {
    UserInfo
  },
  methods: {
    updateWikiTitles: function (event) {
      if (event.data.last_page.title === this.wikiTitles[this.wikiTitles.length - 1].title) {
        this.wikiTitles.push(event.data.new_page)
      } else if(this.wikiTitles.find(w => w.title === event.data.last_page.title)) {
        while (this.wikiTitles.length > this.wikiTitles.indexOf(this.wikiTitles.find(w => w.title === event.data.last_page.title)) + 1) {
          this.wikiTitles.pop() //
        }
        this.wikiTitles.push(event.data.new_page)
      }
      else {
        alert("C'est pas ouf de tricher")
      }
    },
  }
}
</script>

<style scoped lang="scss">

@import '../script'; // Using this should get you the variables

.game {
  display: flex;
  align-items: center;
  width: 98vw;
  height: 95vh;
  flex-direction: row;
  justify-content: space-evenly;
}

.players,
.wikiTitles {
  display: flex;
  flex-direction: column;
  //justify-content: space-between;
  align-items: center;
  width: 15%;
  height: 70%;
  background: rgba(red($dark-grey), green($dark-grey), blue($dark-grey), 0.9);
  border-radius: 75px 30px;
  padding-top: 1%;
  padding-bottom: 0.5%;
  font-weight: 700;
  font-size: 1vw;
  font-family: Roboto, sans-serif;
}

.players_container,
.wikiTitles_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  height: 100%;
  margin-top: 3%;
  margin-bottom: 3%;
  overflow: auto;
}

.players_unit,
.wikiTitles_unit {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5%;
  height: 30px;
  width: 100%;
  border-radius: 30px;
  background-color: $white;
  color: black;
}

.iframe {
  width: 60vw;
  height: 80vh;
  //height: 900em;
  box-shadow: 1px 1px 15px 2.5px $dark-grey;
  border-radius: 10px;
  border: 10px;
}

</style>
