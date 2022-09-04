<template>
  <div id="app">
    <BaseBookList/>
  </div>
</template>

<script>
import BaseBookList from './components/BaseBookList.vue'
export default {
  name: 'App',
  components: {
    BaseBookList,
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=PT+Sans:400i,700,700i');
#app {
  font-family: 'PT Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

}
</style>
