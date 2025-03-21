document.addEventListener("DOMContentLoaded", () => {
    let books = JSON.parse(localStorage.getItem("newBooksModel")) || [];
    const bookList = document.getElementById("bookList");

    
    function renderBooks() {
        bookList.innerHTML = ""; // Clear the current book list

        
        for (let i = 0; i < books.length; i++) {
            const book = books[i];
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("col-md-5", "book-card", );
            
            
            bookDiv.innerHTML = `
                <h5>${book.title}</h5>
                <p>${book.author}</p>
                <p>Status: ${book.status}</p>
                <button class="btn btn-primary favourite-btn" data-id="${book.id}">
                    Favourite
                </button>
                 <button class="btn btn-danger delete-btn" data-id="${book.id}">
                    Delete
                </button>
                <button class="btn btn-warning edit-btn" data-id="${book.id}">
                    Edit
                </button>
            `;
            
           
            const favouriteButton = bookDiv.querySelector(".favourite-btn");
            favouriteButton.addEventListener("click", () => {
                
                book.isFavourite = !book.isFavourite;
                localStorage.setItem("newBooksModel", JSON.stringify(books)); 
                
                
                favouriteButton.textContent = book.isFavourite ? "Unfavourite" : "Favourite";
            });
            
            const deleteButton = bookDiv.querySelector(".delete-btn");
            deleteButton.addEventListener("click", () => {
                books = books.filter(b => b.id !== book.id); 
                localStorage.setItem("newBooksModel", JSON.stringify(books)); 
                renderBooks(); 
            });

            
            const editButton = bookDiv.querySelector(".edit-btn");
            editButton.addEventListener("click", () => {
                
                document.getElementById("editTitle").value = book.title;
                document.getElementById("editAuthor").value = book.author;
                document.getElementById("editStatus").value = book.status;
                document.getElementById("editBookId").value = book.id;

                
                document.getElementById("editFormContainer").style.display = "block";
            });

            
            
            bookList.appendChild(bookDiv);
        }
    }

    
    renderBooks();
});
