const commonHelpers = {
    uniqueID,
    initSingleBookObject
}
function uniqueID() {
    // semi unique id's, probably good enough for our case
    // let's do a funny string cast
    return Math.floor(Math.random() * Date.now()) + '';
}
function initSingleBookObject(bookObj) {
    return {...bookObj, showDetails: false}
}
export default commonHelpers