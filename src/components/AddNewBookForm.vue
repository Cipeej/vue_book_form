<template>
<div class="formContainer">
    <h2>Add new book to the collection</h2>
    <div class="title">
        <label>Title: *</label>
        <input v-model="newBook.title" class="form_bookTitle">
    </div>
    <div class="author">
        <label>Author: *</label>
        <input v-model="newBook.author" class="form_bookAuthor">
    </div>
    <div class="description">
        <label>Description: *</label>
        <textarea v-model="newBook.description"/>
    </div>
    <div class="buttonContainer">
      <button @click="addNewBook()" :title="isMissingValues ? 'Please fill all fields before uploading data' : 'Upload book'" 
        :disabled="isMissingValues">
          {{ newBook.isUploadingNewBook ? 'Uploading new book..' : 'Add new Book' }}
      </button>
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
      // A bit of an messy way to check the fields have values before posting. This assumes that each field would be required to post a new book
      return this.newBook.title == '' || this.newBook.author == '' || this.newBook.description == ''
    }
  },
  methods: {
    initNewBookObj() {
      // Init the book object, as it is in the parent
      this.newBook = this.newBookObj()
    },
    newBookObj() {
      return {id: commonHelpers.uniqueID(), title: '', author: '', description: '', isUploadingNewBook: false}
    },
    async addNewBook() {
      try {
        this.newBook.isUploadingNewBook = true;
        const response = await bookHelpers.submitNewBook(this.newBook)
        if (response && response.status === 201) { // 201 status corresponds to 'created' response, which means the upload should be succesful. Should add these to a constant file
          this.emitNewBookAdded(response.data)
          this.initNewBookObj() // reset v-model after adding a new book
        } else {
          alert('Could not add book due. Possible server error')
        }
      } catch (error) {
        console.error(error)
        this.newBook.isUploadingNewBook = false;
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

<style scoped src="@/styles/new-book-form.css">

</style>