const commonHelpers = {
    uniqueID,
    initSingleBookObject
}
function uniqueID() {
    // semi unique id's
    return Math.floor(Math.random() * Date.now())
}
function initSingleBookObject(bookObj) {
    return {...bookObj, showDetails: false}
}
export default commonHelpers