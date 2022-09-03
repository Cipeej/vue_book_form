<template>
  <div id="app">
    <BaseBookList v-if="bookList.length > 0"
      :books="bookList"
    />
    <div v-else>
        No books to show :(
        Add a new one?
    </div>
  </div>
</template>

<script>
import BaseBookList from './components/BaseBookList.vue'
import bookHelpers from './helpers/bookHelpers.js'
export default {
  name: 'App',
  components: {
    BaseBookList,
  },
  data() {
    return {
      bookList: []
    }
  },
  methods: {
    async getAllBooksList() {
      try {
        const bookList = await bookHelpers.getBooks()
        this.bookList = bookList.data
      } catch (error) {
        console.error(error)
      }        
    }
  },
  created() {
    this.getAllBooksList()
  }
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
