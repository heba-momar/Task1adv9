// ====== Book Class ======
class Book {
    #title;
    #author;
    #category;
    #isAvailable;
  
    constructor(title, author, category, isAvailable = true) {
      this.#title = title;
      this.#author = author;
      this.#category = category;
      this.#isAvailable = isAvailable;
    }
  
    getTitle() {
      return this.#title;
    }
  
    getAuthor() {
      return this.#author;
    }
  
    getCategory() {
      return this.#category;
    }
  
    isBookAvailable() {
      return this.#isAvailable;
    }
  
    toggleAvailability() {
      this.#isAvailable = !this.#isAvailable;
    }
  
    displayInfo() {
      return `Title:${this.#title} , Author:${this.#author}, Category: ${this.#category}, Available:${this.#isAvailable}`;
    }
  }
  
  // ====== ReferenceBook (inherits Book) ======
  class ReferenceBook extends Book {
    #locationCode;
  
    constructor(title, author, category, isAvailable, locationCode) {
      super(title, author, category, isAvailable);
      this.#locationCode = locationCode
    }
  
    getLocationCode() {
      return this.#locationCode;
    }
  
    displayInfo() {
      return super.displayInfo()`Location:${this.#locationCode}`
    }
  }
  
  // ====== Library Class ======
  class Library {
    #books;

  constructor() {
    this.#books = [];
  }

  addBook(book) {
    this.#books.push(book);
  }

  removeBook(title) {
    this.#books = this.#books.filter(book => book.getTitle() !== title);
  }

  searchBook(query) {
    const lowerQuery = query.toLowerCase();
    return this.#books.filter(book =>
      book.getTitle().toLowerCase().includes(lowerQuery) ||
      book.getAuthor().toLowerCase().includes(lowerQuery)
    );
  }

  filterByCategory(category) {
    if (category === "all") return this.#books;
    return this.#books.filter(book => book.getCategory() === category);
  }

  toggleAvailability(title) {
    const book = this.#books.find(b => b.getTitle() === title);
    if (book) book.toggleAvailability();
  }

  getCategories() {
    const cats = new Set();
    this.#books.forEach(book => cats.add(book.getCategory()));
    return Array.from(cats);
  }

  getBooks() {
    return this.#books;
  }
}

// ====== UI Handling ======
let library = new Library();
library.addBook(new Book("Atomic Habits", "James Clear", "Self-Help", "EN001"));
library.addBook(new Book("Sapiens", "Yuval Noah Harari", "History", "EN002"));
library.addBook(new Book("The Selfish Gene", "Richard Dawkins", "Science", "EN003"));
library.addBook(new ReferenceBook("Oxford Dictionary", "Oxford", "Reference", "REF001"));
library.addBook(new Book("Harry Potter", "J.K. Rowling", "Fantasy", "EN004"));
library.addBook(new Book("Educated", "Tara Westover", "Biography", "EN005"));

const bookContainer = document.getElementById("bookcontainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const addBtn = document.getElementById("addBookBtn");
const form = document.getElementById("addForm");
const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const categoryInput = document.getElementById("categoryInput")
const locationCodeInput = document.getElementById("locationCodeInput");

function renderBooks(books = library.getBooks()) {
  bookContainer.innerHTML = "";
  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "bookcards";
    card.innerHTML =    `
      <h3>${book.getTitle()}</h3>
      <p>Author:${book.getAuthor()}</p>
      <p>Category: ${book.getCategory()}</p>
      <p>Available:${book.isBookAvailable() ? "Yes" : "No"}</p>
      <p>Location: ${book.getLocationCode ?book.getLocationCode():"N/A"}</p>
      <button class="toggle-btn">isvisibal</button>
      <button class="delete-btn">Delete</button>`
    ;
    console.log(books)
    card.querySelector(".toggle-btn").onclick = () => {
      library.toggleAvailability(book.getTitle());
      renderBooks(filterBooks());
    };
    card.querySelector(".delete-btn").onclick = () => {
      library.removeBook(book.getTitle());
      renderBooks(filterBooks());
    };
    bookContainer.appendChild(card);
  });
  renderCategories();
}

function renderCategories() {
    const categories = library.getCategories();
  categoryFilter.innerHTML =` <option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterBooks() {
  const query = searchInput.value.trim();
  const category = categoryFilter.value;
  let books = library.getBooks();

  if (query) books = library.searchBook(query);
  if (category!== "all") books = books.filter(b => b.getCategory() === category);

  return books;
}

searchInput.addEventListener("input", () => renderBooks(filterBooks()));
categoryFilter.addEventListener("change", () => renderBooks(filterBooks()));

addBtn.addEventListener("click", () => {
    form.style.display = form.classList.toggle("show")
});
document.getElementById("submitBook").onclick = () => {
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const category = categoryInput.value.trim();
    const location = locationCodeInput.value.trim();
  
    if (title && author && category) {
      const newBook = location
        ? new ReferenceBook(title, author, category, location)
        : new Book(title, author, category);
     library.addBook(newBook);
      renderBooks();
      form.style.display = "none";
      titleInput.value = "";
      authorInput.value = "";
      categoryInput.value = "";
      locationCodeInput.value = "";
    }
  };

// Initial render
renderBooks();