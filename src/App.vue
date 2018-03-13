<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.header {
  width:100%;
  height:44px;
  background:#0058f1;
  color:#fff;
  line-height:44px;
  text-align: center;
}
.header .left {
  position: absolute;
  font-size: 20x;
  font-weight: bold;
  padding: 0px 20px;
}
</style>
