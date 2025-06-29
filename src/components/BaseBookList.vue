<template>
  <div>
    <div v-if="bookList.length > 0" class="bookListContainer">
      <h2>All available books</h2>
      <TransitionGroup appear name="slide-in" tag="div">
          <div 
              v-for="book in bookList" 
              :key="book.id" 
              class="bookContainer"
          >
              <section 
                  :class="[book.showDetails && 'selected']"
              >
                  <button 
                      @click="book.showDetails ? unselectBook(book) : selectBook(book)"
                  >
                      <p class="title">{{book.title}}</p>
                      <p class="author">By author: {{book.author}}</p>
                  </button>
                  <div 
                      v-show="book.showDetails" 
                      class="editBookInfo"
                  >
                      <div 
                          v-if="selectedBook != null"
                          class="itemDetailsContainer" 
                      >
                          <h3>Edit book info</h3>
                          <div class="title">
                              <label>Title: </label>
                              <input v-model="selectedBook.title" class="form_bookTitle">
                          </div>
                          <div class="author">
                              <label>Author: </label>
                              <input v-model="selectedBook.author" class="form_bookAuthor">
                          </div>
                          <div class="description">
                              <label>Description:</label>
                              <textarea v-model="selectedBook.description"/>
                          </div>
                          <div class="buttonContainer">
                              <button 
                                  :class="['save', {disabled: selectedBook.isUpdatingBook}]"
                                  :disabled="(!bookDataChanged || selectedBook.isUpdatingBook)" 
                                  :title="!bookDataChanged ? 'Updating a book requires changes to book data' : 'Update book data'"
                                  @click="updateBook()" 
                              >
                                  {{selectedBook.isUpdatingBook ? 'Updating book..' : 'Update book'}}
                              </button>
                              <button 
                                  class="delete" 
                                  :disabled="selectedBook.isDeletingBook"
                                  @click="deleteBook()" 
                              >
                                {{selectedBook.isDeletingBook ? 'Deleting book..' : 'Delete book'}}
                              </button>
                          </div>
                      </div>
                  </div>
              </section>
          </div>
      </TransitionGroup>
    </div>
    <h2 v-else>No books found! You can submit new ones from the form below.</h2>
      <AddNewBookForm
          @newBookAdded="addNewBookToList"
      />
  </div>
</template>

<script setup>
import AddNewBookForm from "@/components/AddNewBookForm.vue"
import bookHelpers from "@/helpers/bookHelpers.js"
import commonHelpers from "@/helpers/commonHelpers.js"
import {computed, ref} from "vue";

const bookList = ref([]);
const selectedBook = ref(null);
await initBooklist();

const bookDataChanged = computed(() => {
  if (selectedBook.value == null) return false;
  const ogBookObj = bookList.value.find(book => book.id === selectedBook.value.id);
  if (ogBookObj) {
    for (const key of Object.keys(ogBookObj)) {
      // check if properties match, as we don't want to check selectedBook's 'isUpdatingBook' property, which doesn't exist on originalBookObj
      if (selectedBook.value[key] && ogBookObj[key] !== selectedBook.value[key]) {
        return true
      }
    }
  }
})

async function initBooklist() {
  try {
    const { data} = await bookHelpers.getBooks()
    if (data && data.length > 0) {
      bookList.value = data.map(x => commonHelpers.initSingleBookObject(x))
    }
  } catch (error) {
    console.error(error)
  }
}

function selectBook(selectedBookParam) {
  // Probably a bit hacky way to achieve this
  // The idea is to have only one book item "open" at a time, so we clear all other "open" ones
  for (const book of bookList.value) {
    book.showDetails = false;
  }
  selectedBookParam.showDetails = true;
  // set selected books data to selectedBook-data property,
  // so we can later check if the user has modified it, and allow saving (updating) it
  selectedBook.value = {...selectedBookParam, isUpdatingBook: false, isDeletingBook: false }
}

function unselectBook(selectedBook) {
  selectedBook.showDetails = false;
  clearSelectedBook()
}
const clearSelectedBook = () => {
  // clear selected book v-model just in case, to not have data lingering if no book is selected
  selectedBook.value = null;
}

function addNewBookToList(book) {
  bookList.value.push(commonHelpers.initSingleBookObject(book));
}

async function updateBook() {
  try {
    // switch isUpdatingBook to true, to show a different text when a user has clicked update button
    // cleared on this.clearSelectedBook
    selectedBook.value.isUpdatingBook = true;
    const res = await bookHelpers.updateBook(selectedBook.value.id, selectedBook.value)
    console.log(res)
    if (res && res.status === 200) {
      updateBookInformationOnList(res.data);
      showSuccessAlert()
      clearSelectedBook()
    } else {
      alert('Could not update book. Possible server error')
    }
  } catch (error) {
    console.error(error)
  }
}
function updateBookInformationOnList(bookData) {
  // update the "old" book with new data
  const bookObj = bookList.value.find(x => x.id === bookData.id);
  for (const key of Object.keys(bookObj)) {
    // Note: showDetails comes up as undefined, which is unwanted but still works (thanks Javascript).
    // this is because when we are updating a book, we delete the showDetails prop in bookHelpers, to not send it to "backend"
    // this closes the opened book
    bookObj[key] = bookData[key];
  }
}

async function deleteBook() {
  try {
    selectedBook.value.isDeletingBook = true;
    const bookId = selectedBook.value.id;
    const res = await bookHelpers.deleteBook(bookId)
    if (res && res.status === 200) { // should probably use enums to check http status'
      deleteBookFromList(bookId)
      clearSelectedBook
    } else {
      alert('Could not delete book. Possible server error')
    }
  } catch (error) {
    console.error(error)
  }
}
function deleteBookFromList(bookId) {
  // delete the removed book from array to trigger re-render of book list
  const deletedBookIndex = bookList.value.findIndex(x => x.id === bookId);
  bookList.value.splice(deletedBookIndex, 1);
}

function showSuccessAlert() {
  // TODO
}

</script>

<style scoped src="@/styles/book-list.css"></style>