<template>
  <div class="game">
    {{ game_id }}
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

<style scoped>

</style>