<template>
  <div class="game">
    <div class="wikiTitles">
      <div class="wikiTitles_container">
        <div class="wikiTitles_unit" v-for="title in wikiTitles.title">
          <span>{{title}}</span>
        </div>
      </div>
    </div>
    <div class="wiki__page">
      <iframe class="iframe" id="ifr" src="http://localhost:8000/wiki_page?u=https://fr.wikipedia.org/wiki/Cuillère"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "Game",
  props: {
    game_id: {
      type: String,
      default: undefined
    }
  },
  data: function () {
    return {
      game: undefined,
      wikiTitles: [],
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
          self.wikiTitles.push(self.game.page_start)
          console.log(self.game)
        })
        .catch(err => console.log(err))

    window.addEventListener('message', event => {
      if (event.origin.startsWith(`http://localhost:8000`)) {
        this.updateWikiTitles()
      }
    })
  },
  methods: {
    updateWikiTitles: (event) => {
      if (Array.isArray(this.wikiTitles)) {
        // TODO : Il faut reflechir
          this.wikiTitles.push(event.data.new_page)
      }
    },
  }
}
</script>

<!--<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>-->
<!--<script src="https://code.jquery.com/jquery-migrate-1.4.1.min.js"></script>-->

<!--<script>-->

<!--window.addEventListener('message', event => {-->
<!--  window.onpopstate = function(event) {-->
<!--    alert("location: " + document.location + ", state: " + JSON.stringify(event.state));-->
<!--  };-->
<!--})-->
<!--</script>-->


<style scoped lang="scss">

@import '../script'; // Using this should get you the variables

.game {
  display: flex;
  align-items: center;
  width: 98vw;
  height: 95vh;
  flex-direction: row;
  justify-content: space-evenly;
  border: solid orange 3px;
}

.wikiTitles {
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
  font-size: 1vw;
  font-family: Roboto, sans-serif;
}

.wikiTitles_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  height: 100%;
  margin-top: 3%;
  margin-bottom: 3%;
  overflow: auto;
  border: solid pink 3px;
}

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
  height: 60vh;
  //height: 900em;
  box-shadow: 1px 1px 15px 2.5px $dark-grey;
  border-radius: 10px;
  border: 10px;
}

</style>
