// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        // const StoredBooks = 
        // [
        //     {
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn: '3434343'
        //     },
        //     {
        //         title: 'Book Two',
        //         author: 'Jane Doe',
        //         isbn: '12212'
        //     }
        // ];

        // Loop through all the books in this array and call the method addBooktoList()
        books.forEach((book) => UI.addBookToList(book));
    }

    // Methods

    // addBookToList Method
    static addBookToList(book) {
        const list = document.querySelector('#book-list'); // Grabs the book-list tbody element in DOM.

        const row = document.createElement('tr'); 

        // Add HTML elements in tr
        row.innerHTML = ` 
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td> <a href="#" class="btn btn-danger btn-sm delete"> X </a> </td>
        `;

        // Append Row to List
        list.appendChild(row);  
    }

    // deleteBook
    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove() // twice because <td> would be the parent, you want to go 1 above.
        }
    }

    // Show alerts with Bootsrap
    static showAlert(message, className) {
        const div = document.createElement('div'); // create a div
        div.className = `alert alert-${className}`; // basically creating <div class="alert alert-success">Msg</div> with JS
        div.appendChild(document.createTextNode(message));


        // Insert the alert into the parent container
        const container = document.querySelector('.container'); // select parent container
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form); //inserts div before the form in HTML.

        // Vanish alert in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000) // second parameter to setTimeout
    }

    //clearFields method grab each value and remove it
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books')); // run it with JSON.parse or else it will just be a string
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books (Calls an Event to List Books)
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submission
    e.preventDefault();

    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Form Validation
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instantiate
        const book = new Book(title, author, isbn);

        UI.showAlert('Book Added', 'success');

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to store in local storage
        Store.addBook(book);

        //Clear Fields
        UI.clearFields()
    }
});

// Event: Remove a Book --> Event Propagation, because if you add an event listener with click it will only work for 1st button
document.querySelector('#book-list').addEventListener('click', (e) => {

    // Remove book from UI
    UI.deleteBook(e.target)

    // Remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show removed message
    UI.showAlert('Book Removed', 'success');
})