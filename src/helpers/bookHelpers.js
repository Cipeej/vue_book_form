import axios from "axios"
const BASE_URL = 'http://localhost:3000/books' // this should probably be configurated somewhere
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
    // remove added helper props when updating books, if present
    if (data.showDetails !== undefined) delete data.showDetails
    if (data.isUpdatingBook !== undefined) delete data.isUpdatingBook
    if (data.isDeletingBook !== undefined) delete data.isDeletingBook
    if (data.successState !== undefined) delete data.successState
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
    if (bookObj.isUploadingNewBook) {
        delete bookObj.isUploadingNewBook
    }
    try {
        return await axios.post(BASE_URL, bookObj);
    } catch (error) {
        console.error(error)
    }
}

export default httpHelpers
