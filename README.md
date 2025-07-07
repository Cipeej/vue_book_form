### Vue book form

This project acts as a book managing app, where the user can add new books to the collection, and update or delete them.
It consists of a Vue front-end part and a quick and "fake" json-server backend.

### Prerequisites
- Node.js with node package manager (npm)
- git

### First clone the repository
- Either open with github desktop
- Or run `git clone https://github.com/Cipeej/vue_book_form.git` at terminal at your specific folder

### Starting front-end
- First off, run the command `npm install` to install required packages at project root
- After installing packages start the front-end by running the command `vite serve` with a terminal at project root. Note: while the front-end is now running, the server is not. So let's start that next

### Starting back-end
- Due to my poor config skills, json-server must be installed globally in order to start it
- To do this, run the command `npm install -g json-server` at a node terminal for instance
- To start json-server, use the command `json-server booksData.json` at project root. Json-server should now be running

#### after front and back-end are running, you should be able to run the app at localhost:8080. The server itself runs at localhost:3000.
#### Note: if you want to uninstall global json-server after running the project, run `npm uninstall -g json-server` at terminal