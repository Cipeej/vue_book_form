import axios from "axios"
const BASE_URL = 'http://localhost:3000/books'
const httpHelpers = {
    getBooks,
    updateBook,
    deleteBook,
    submitNewBook
}

async function getBooks() {
    try {
        return await axios.get(BASE_URL);
    } catch (error) {
        console.error(error)
    }
}

async function updateBook(bookId, data) {
    if (data.showDetails) {
        // don't need showDetails property when updating book
        delete data.showDetails
    }
    try {
        return await axios.put(BASE_URL + '/' + bookId, data);
    } catch (error) {
        console.error(error)
    } 
}

async function deleteBook(bookId) {
    try {
        return await axios.delete(BASE_URL + '/' + bookId);
    } catch (error) {
        console.error(error)
    }
}

async function submitNewBook(bookObj) {
    try {
        return await axios.post(BASE_URL, bookObj);
    } catch (error) {
        console.error(error)
    }
}

export default httpHelpers
