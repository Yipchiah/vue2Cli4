<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/file">File</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      imgArrSrc: ["./assets/1.jpg"],
      imgArr: []
    }
  },
  created() {
    this.preloadImg(this.imgArrSrc)
    console.log('imgArr', this.imgArr)
  },
  methods: {
    preloadImg(arr) {
      for (let i = 0; i < arr.length; i++) {
        this.imgArr[i] = new Image()
        this.imgArr[i].src = arr[i]
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
