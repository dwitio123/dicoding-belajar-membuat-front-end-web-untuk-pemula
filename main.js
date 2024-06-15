const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data != null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}

function findBookTitle(bookTitle) {
  const foundBooks = [];
  for (const bookItem of books) {
    if (bookItem.title.toLowerCase().includes(bookTitle.toLowerCase())) {
      foundBooks.push(bookItem);
    }
  }
  return foundBooks;
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + year;

  const deletebutton = document.createElement("button");
  deletebutton.classList.add("red");
  deletebutton.innerText = "Hapus buku";
  deletebutton.addEventListener("click", function () {
    removeBook(id);
  });

  const doneButton = document.createElement("button");
  doneButton.classList.add("green");

  if (isComplete) {
    doneButton.innerText = "Belum selesai di Baca";
    doneButton.addEventListener("click", function () {
      undoBookFromCompleted(id);
    });
  } else {
    doneButton.innerText = "Selesai dibaca";
    doneButton.addEventListener("click", function () {
      addBookToCompleted(id);
    });
  }

  const containerButton = document.createElement("div");
  containerButton.classList.add("action");
  containerButton.append(doneButton, deletebutton);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear, containerButton);
  container.setAttribute("id", `book-${id}`);

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBook(bookId);
  const confirmation = confirm(
    `Apakah Anda yakin ingin menghapus buku berjudul "${bookTarget.title}"?`
  );
  if (confirmation) {
    const bookIndex = findBookIndex(bookId);
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBook() {
  const bookTitle = document.getElementById("searchBookTitle").value;
  const foundBooks = findBookTitle(bookTitle);

  const incompleteBook = document.getElementById("incompleteBookshelfList");
  const completeBook = document.getElementById("completeBookshelfList");

  incompleteBook.innerHTML = "";
  completeBook.innerHTML = "";

  for (const bookItem of foundBooks) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBook.append(bookElement);
    } else {
      incompleteBook.append(bookElement);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil disimpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBook = document.getElementById("incompleteBookshelfList");
  const completeBook = document.getElementById("completeBookshelfList");

  incompleteBook.innerHTML = "";
  completeBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBook.append(bookElement);
    } else {
      incompleteBook.append(bookElement);
    }
  }
});
