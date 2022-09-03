<template>
<div>
  <div v-if="bookList.length > 0" class="bookListContainer">
    <h2>All available books</h2>
    <transition-group name="slide-in" tag="div">
        <div v-for="book in bookList" :key="book.id" class="bookContainer">
            <section :key="book.id" :class="[book.showDetails ? 'selected' : '']">
                <button @click="book.showDetails ? unselectBook(book) : selectBook(book)">
                    <p class="title">{{book.title}}</p>
                    <p class="author">{{book.author}}</p>
                </button>
                <div v-show="book.showDetails && selectedBook != null" class="editBookInfo">
                    <div class="itemDetailsContainer" v-if="selectedBook != null">
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
                            <button class="save" @click="updateBook()" :disabled="!bookDataChanged">Save book info</button>
                            <button class="delete" @click="deleteBook()">Delete book</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </transition-group>
  </div>
    <AddNewBookForm
        @newBookAdded="addNewBookToList"
    />
  </div>
</template>

<script>
import AddNewBookForm from "@/components/AddNewBookForm"
import bookHelpers from "@/helpers/bookHelpers.js"
import commonHelpers from "@/helpers/commonHelpers.js"
export default {
    name: 'BaseBookList',
    components: {
        AddNewBookForm,
    },
    props: {
        books: {
            type: Array,
        }
    },
    data() {
        return {
            bookList: [],
            selectedBook: null,
        }
    },
    computed: {
        bookDataChanged() {
            // check if selected books data differs from the original book data,
            // then allow updating it should it differ
            if (this.selectedBook != null) {
                const originalBookObj = this.bookList.find(x => x.id === this.selectedBook.id)
                for (const key of Object.keys(originalBookObj)) {
                    if (originalBookObj[key] !== this.selectedBook[key]) {
                        return true
                    }
                }
            }
            return false;
        }
    },
    methods: {
        initBookList() {
            // create a mutateable list based on the original booksList
            // and add a prop which we can use to trigger a "collapsible" section with more info
            this.bookList = this.books.map(x => commonHelpers.initSingleBookObject(x))
        },
        selectBook(book) {
            // Probably a bit hacky way to achieve this
            // The idea is to have only one book item "open" at a time, so we clear all other "open" ones
            for (const book of this.bookList) {
                book.showDetails = false;
            }
            book.showDetails = true
            // set selected books data to selectedBook-data property,
            // so we can later check if the user has modified it, and allow saving (updating) it
            this.selectedBook = {...book}
        },
        unselectBook(book) {
            book.showDetails = false
            this.clearSelectedBook()
        },
        clearSelectedBook() {
            // clear selected book v-model just in case, to not have data lingering if no book is selected
            this.selectedBook = null
        },
        addNewBookToList(bookItem) {
            this.bookList.push(commonHelpers.initSingleBookObject(bookItem))
        },
        async updateBook() {
            try {
                const bookId = this.selectedBook.id;
                const res = await bookHelpers.updateBook(bookId, this.selectedBook)
                this.updateBookInformationOnList(res.data);
            } catch (error) {
                console.error(error)
            }
        },
        updateBookInformationOnList(bookData) {
            // update the "old" book with new data
            const bookObj = this.bookList.find(x => x.id === bookData.id);
            for (const key of Object.keys(bookObj)) {
                this.$set(bookObj, key, bookData[key])
            }
        },
        async deleteBook() {
            try {
                const bookId = this.selectedBook.id;
                await bookHelpers.deleteBook(bookId)
                this.deleteBookFromList(bookId)
            } catch (error) {
                console.error(error)
            }
        },
        deleteBookFromList(bookId) {
            // delete the removed book from array to trigger re-render of book list
            const deletedBookIndex = this.bookList.findIndex(x => x.id === bookId);
            this.bookList.splice(deletedBookIndex, 1);
            this.clearSelectedBook()
        },
    },
    mounted() {
        this.initBookList()
    }
}
</script>

<style scoped src="@/styles/book-list.css"></style>