<template>
<div>
  <div v-if="bookList.length > 0" class="bookListContainer">
    <h2>All available books</h2>
    <transition-group name="slide-in" tag="div">
        <div v-for="book in bookList" :key="book.title" class="bookContainer">
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
            this.selectedBook = {...book}
        },
        unselectBook(book) {
            book.showDetails = false
            this.clearSelectedBook()
        },
        clearSelectedBook() {
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

<style scoped>
    h2 {
        text-align: left;
    }
    .bookListContainer {
        display: flex;
        flex-flow: column nowrap;
    }
    .bookContainer {
        display: flex;
        flex-flow: row nowrap;
        align-self: center;
    }
    .bookContainer button {
        background: unset;
        border: none;
        cursor: pointer;
    }
    p.title {
        font-weight: 600;
        font-size: 14px;
        text-align: left;
    }
    p.author {
        font-style: italic;
        text-align: left;
        padding-left: 12px;
    }
    section.selected {
        box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.5);
        transition: all 0.05s ease-in;
        min-height: 200px;
        display: flex;
        flex-flow: row nowrap;
        gap: 100px;
        align-items: flex-start;
        width: 100%;
        justify-content: space-between;
    }
    .slide-in-enter-active,
    .slide-in-leave-active {
        transition: all 0.5s ease;
    }

    .slide-in-enter,
    .slide-in-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    .editBookInfo {
        width: 60%;
    }
    .itemDetailsContainer {
        display: flex;
        flex-flow: column nowrap;
        padding-right: 12px;
    }
    .itemDetailsContainer h3 {
        width: 80%;
        align-self: flex-end;
        text-align: left;
    }
    .itemDetailsContainer div {
        margin-bottom: 12px;
        display: flex;
        align-self: flex-end;
        width: 80%;
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
        gap: 12px;
    }
    .buttonContainer button {
        min-width: 100px;
        min-height: 30px;
        color: #fff;
        border-radius: 4px;
        padding: 4px;
    }
    button.save {
        background: linear-gradient(90deg, rgba(68,179,21,1) 0%, rgba(25,182,59,1) 59%, rgba(17,144,42,1) 100%);
        animation: gradient 5s ease-in infinite;
        background-size: 400%;
    }
    button.save:hover {
        /* box-shadow:  */
    }
    button.save[disabled] {
        background: gray;
        cursor: default;
    }
    button.delete {
        background: linear-gradient(90deg, rgba(196,63,23,1) 0%, rgba(182,67,25,1) 60%, rgba(158,54,21,1) 100%); 
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