<template>
  <div class="game">
    <div class="game__id">
      <span>{{ game_id }}</span>
    </div>
    <div class="wiki__page">
      <iframe width="80%" height="900em" id="ifr" src="http://localhost:8000/wiki_page?u=https://fr.wikipedia.org/wiki/Cuillère"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "Game",
  props:{
    game_id: {
      type: String,
      default: undefined
    }
  }
}
</script>

<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://code.jquery.com/jquery-migrate-1.4.1.min.js"></script>

<script>
window.addEventListener('message', event => {
  if (event.origin.startsWith(`${this.$base_url}`)) {
    alert(event.data.new_page)
    alert(event.data.last_page)
  }
});
</script>

<style scoped>

</style>
