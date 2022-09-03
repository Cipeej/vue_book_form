<template>
<div class="formContainer">
    <h2>Add new book to the collection</h2>
    <div class="title">
        <label>Title: </label>
        <input v-model="newBook.title" class="form_bookTitle">
    </div>
    <div class="author">
        <label>Author: </label>
        <input v-model="newBook.author" class="form_bookAuthor">
    </div>
    <div class="description">
        <label>Description:</label>
        <textarea v-model="newBook.description"/>
    </div>
    <div class="buttonContainer">
      <button @click="addNewBook()" :disabled="isMissingValues">Add new Book</button>
    </div>
</div>
</template>

<script>
import bookHelpers from "@/helpers/bookHelpers.js"
import commonHelpers from "@/helpers/commonHelpers.js"
export default {
  data() {
    return {
      newBook: {}
    }
  },
  computed: {
    isMissingValues() {
      // A bit of an messy way to check the fields have values before posting. I am assuming that each field would be required to post a new book
      return this.newBook.title == '' || this.newBook.author == '' || this.newBook.description == ''
    }
  },
  methods: {
    initNewBookObj() {
      // Init the book object, as it is in the parent
      this.newBook = this.newBookObj()
    },
    newBookObj() {
      return {id: commonHelpers.uniqueID(), title: '', author: '', description: ''}
    },
    async addNewBook() {
      try {
        const response = await bookHelpers.submitNewBook(this.newBook)
        this.emitNewBookAdded(response.data)
        this.initNewBookObj()
      } catch (error) {
        console.error(error)
      }
    },
    emitNewBookAdded(bookObj) {
      // emit added new book data to parent, so we can push it to the array and trigger re-render of the book list view
      this.$emit("newBookAdded", bookObj)
    },
  },
  mounted() {
    this.initNewBookObj()
  }
}
</script>

<style scoped>
  .formContainer {
    display: flex;
    flex-flow: column nowrap;
    margin-top: 30px;
    background: #d9d9d9;
  }
  .formContainer div {
    margin-bottom: 12px;
    display: flex;
    align-self: center;
    width: 40%;
  }
  label {
    width: 40%;
    text-align: left;
  }
  input, textarea {
    width: 60%;
    min-width: 60%;
    max-width: 60%;
  }
  .buttonContainer {
    display: flex;
    justify-content: flex-end;
  }
  .buttonContainer button {
    min-width: 100px;
    min-height: 30px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 4px;
    color: #fff;
    background: linear-gradient(90deg, rgba(68,179,21,1) 0%, rgba(25,182,59,1) 59%, rgba(17,144,42,1) 100%);
    animation: gradient 5s infinite ease-in;
    background-size: 400%;
  }
  .buttonContainer button[disabled] {
    background: gray;
    cursor: default;
  }
    @keyframes gradient {
      0% {
          background-position: 0% 0%;
      }
      50% {
          background-position: 100% 50%;
      }
      100% {
          background-position: 0% 50%;
      }
    }
</style>