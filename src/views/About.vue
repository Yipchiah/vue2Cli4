<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>test skeleton</p>
    <div class="flex-box">
      <img :src="img" alt="">
      <div>
        <p>hello world</p>
        <p>this is line P</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      img: require('@/assets/1.jpg')
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  .flex-box {
    display: flex;
    align-items: center;
  }
}
</style>
