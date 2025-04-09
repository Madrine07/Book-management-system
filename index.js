document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const allBooks = document.getElementById("allBooks");
    const favouriteTab = document.getElementById("favourite");
    const readTab = document.getElementById("read");
    const unreadTab = document.getElementById("unread");
    const searchInput = document.getElementById("searchInput"); // Search input field

    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Function to convert an image to Base64
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject("Error reading file");
            };
            reader.readAsDataURL(file); // Convert image to base64
        });
    }

    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
    }

    function createBookCard(book) {
        const card = document.createElement("div");
        card.className = "book-card";

        const img = document.createElement("img");
        img.src = book.image || "images/white-square.png"; // Use base64 image
        card.appendChild(img);

        const title = document.createElement("h5");
        title.textContent = book.title;
        card.appendChild(title);

        const author = document.createElement("p");
        author.textContent = "by " + book.author;
        card.appendChild(author);

        // Create button group
        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group w-100 mt-2";

        // Favourite button
        const favBtn = document.createElement("button");
        favBtn.className = "btn btn-warning";
        favBtn.textContent = book.favourite ? "★" : "☆";
        favBtn.title = book.favourite ? "Unfavourite" : "Favourite";
        favBtn.onclick = () => {
            book.favourite = !book.favourite;
            saveBooks();
            renderBooks(); // Re-render after favourite change
        };

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-primary";
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
            document.getElementById("bookId").value = book.id;
            document.getElementById("title").value = book.title;
            document.getElementById("author").value = book.author;
            document.getElementById("status").value = book.status;

            const bookModal = new bootstrap.Modal(document.getElementById("bookModal"));
            bookModal.show();
        };

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-danger";
        delBtn.textContent = "Delete";
        delBtn.onclick = () => {
            const confirmDelete = confirm(`Are you sure you want to delete "${book.title}"?`);
            if (confirmDelete) {
                books = books.filter(b => b.id !== book.id);
                saveBooks();
                renderBooks(); // Re-render after delete
            }
        };

        btnGroup.appendChild(favBtn);
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(delBtn);

        card.appendChild(btnGroup);

        return card;
    }

    function renderBooks(filteredBooks) {
        // Clear all tabs
        allBooks.innerHTML = "";
        favouriteTab.innerHTML = "";
        readTab.innerHTML = "";
        unreadTab.innerHTML = "";

        
        const booksToRender = filteredBooks || books;

        booksToRender.forEach(book => {
            const card = createBookCard(book);

           
            allBooks.appendChild(card);

           
            if (book.favourite) {
                favouriteTab.appendChild(createBookCard(book));
            }

           
            if (book.status === "read") {
                readTab.appendChild(createBookCard(book));
            } else {
                unreadTab.appendChild(createBookCard(book));
            }
        });
    }

   
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase(); 

        
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );

        
        renderBooks(filteredBooks);
    });

    bookForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const id = document.getElementById("bookId").value;
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const status = document.getElementById("status").value;
        const imageInput = document.getElementById("coverImage");

        let imageURL = "";
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            imageURL = await convertToBase64(file);  // Convert image to base64
        }

        if (id) {
            // Edit existing book
            const book = books.find(b => b.id === id);
            if (book) {
                book.title = title;
                book.author = author;
                book.status = status;
                if (imageURL) book.image = imageURL;
            }
        } else {
            // Add new book
            books.push({
                id: Date.now().toString(),
                title,
                author,
                status,
                image: imageURL,  
                favourite: false
            });
        }

        saveBooks();
        renderBooks();

        
        bookForm.reset();
        document.getElementById("bookId").value = "";
        const modal = bootstrap.Modal.getInstance(document.getElementById("bookModal"));
        modal.hide();
    });

   
    renderBooks();
});
