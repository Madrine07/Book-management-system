document.addEventListener("DOMContentLoaded", () => {
    let books = JSON.parse(localStorage.getItem("newBooksModel")) || [];
    const bookList = document.getElementById("bookList");
});