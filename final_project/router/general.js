const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop using async await
public_users.get('/', (req, res) => {
    const getBooks = () => {
        return new Promise((resolve,reject) => {
          setTimeout(() => {
            resolve(books)},1000)   
          }
    )}
    
    getBooks().then((books) => {
        res.json(books);
    }).catch((err) =>{
      res.status(500).json({error: "An error occured"});
    });
      
});
  
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', async (req, res) => {
  const ISBN = req.params.isbn;
  try {
    const book = books[ISBN];
    
    if (!book) {
      throw new Error("Book not found");
    }
    res.json(book);
  } catch (err) {
    res.status(404).json({ error: "Book not found" });
  }
});
    
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  const booksBasedOnAuthor = (auth) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter((b) => b.author.toLowerCase() === auth.toLowerCase());
        
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });
  }

  booksBasedOnAuthor(author)
    .then((book) => {
      res.json(book);
    })
    .catch((err) => {
      res.status(404).json({ error: "Book not found" });
    });
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  try {
    const filteredBooks = Object.values(books).filter((b) => 
      new RegExp(title, 'i').test(b.title)
    );
    
    if (filteredBooks.length > 0) {
      res.json(filteredBooks);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  const ISBN = req.params.isbn;
  try {
    const book = books[ISBN];
    
    if (!book) {
      throw new Error("Book not found");
    }
    res.json(book.reviews);
  } catch (err) {
    res.status(404).json({ error: "Book not found" });
  }
});

module.exports.general = public_users;