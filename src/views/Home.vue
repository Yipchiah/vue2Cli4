<template>
  <div class="home">
    <Demo/>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {
    Demo: () => import("@/components/Demo")
  }
}
</script>
