<template>
  <div class="user-info">
      <div class="info">{{user.username}}
          <span v-if="user.place"> #{{ user.place }}</span>
      </div>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  props: ['user'],
}
</script>

<style scoped lang="scss">

@import '../script'; // Using this should get you the variables

.info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5%;
  height: 30px;
  font-size: 15px;
  border-radius: 30px;
  background-color: $white;
  color: black;
}
</style>
