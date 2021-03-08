<template>
  <div class="user-info">
    <div>{{user.username}}</div>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  props: ['user'],
}
</script>

<style scoped>

</style>
