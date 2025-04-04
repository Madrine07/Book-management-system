document.addEventListener("DOMContentLoaded", () => {
    let books = JSON.parse(localStorage.getItem("newBooksModel")) || [];
    const bookList = document.getElementById("bookList");

    function renderBooks() {
        bookList.innerHTML = ""; // Clear the book list

        books.forEach((book, index) => {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("col-md-5", "book-card");

            bookDiv.innerHTML = `
                <img src="${book.coverImage}" alt="Book Cover" class="book-cover">
                <h5>${book.title}</h5>
                <p>${book.author}</p>
                <p>Status: ${book.status}</p>
                <button class="btn btn-primary favourite-btn" data-id="${index}">
                    ${book.isFavourite ? "Unfavourite" : "Favourite"}
                </button>
                <button class="btn btn-warning edit-btn" data-id="${index}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${index}">Delete</button>
            `;

            bookList.appendChild(bookDiv);
        });
    }

    bookList.addEventListener("click", (event) => {
        const target = event.target;
        const bookIndex = target.dataset.id;

        if (target.classList.contains("favourite-btn")) {
            books[bookIndex].isFavourite = !books[bookIndex].isFavourite;
            localStorage.setItem("newBooksModel", JSON.stringify(books));
            renderBooks(); // Refresh the list
        }

        if (target.classList.contains("delete-btn")) {
            books.splice(bookIndex, 1); // Remove the book
            localStorage.setItem("newBooksModel", JSON.stringify(books));
            renderBooks();
        }

        if (target.classList.contains("edit-btn")) {
            const book = books[bookIndex];
            document.getElementById("title").value = book.title;
            document.getElementById("author").value = book.author;
            document.getElementById("genre").value = book.genre;
            document.getElementById("status").value = book.status;
            document.getElementById("bookId").value = bookIndex;
        }
    });

   
    document.getElementById("bookForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const genre = document.getElementById("genre").value;
        const status = document.getElementById("status").value;
        const coverImageInput = document.getElementById("coverImage");
        const bookId = document.getElementById("bookId").value;

        if (!coverImageInput.files.length) {
            alert("Please upload a cover image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const coverImage = event.target.result;

            const newBook = { title, author, genre, status, coverImage, isFavourite: false };

            if (bookId === "") {
                books.push(newBook);
            } else {
                books[bookId] = newBook;
            }

            localStorage.setItem("newBooksModel", JSON.stringify(books));
            renderBooks();
            document.getElementById("bookForm").reset();
        };

        reader.readAsDataURL(coverImageInput.files[0]);
    });

    renderBooks();
});
