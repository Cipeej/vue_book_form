### Vue book form

This project acts as a book managing app, where the user can add new books to the collection, and update or delete them.
It consists of a Vue front-end part and a quick and "fake" json-server backend.

### Prerequisites
- Node.js with npm
- git

### First clone the repository
- Either open with github desktop
- Or run `git-clone https://github.com/Cipeej/vue_book_form.git` at terminal

### Starting front-end
- Run the command `npm run serve` with a terminal at project root
- Project utilises localhost:8080 port

### Starting back-end
- Due to my poor config skills, json-server must be installed globally in order to start it
- To do this, run the command `npm install -g json-server` at a terminal
- To start json-server, use the command `json-server booksData.json` at project root
- json-server utilises localhost:3000 port

#### after front and back-end are running, you should be able to run the app at localhost:8080