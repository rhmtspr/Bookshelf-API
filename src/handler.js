const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      'message': 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      }
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const filteredBooks = books
      .filter((book) => book.name.toLowerCase() === name.toLowerCase())
      .map(({ id, name, publisher }) => ({ id, name, publisher }));

    return h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      }
    }).code(200);
  }

  if (reading === 1) {
    const filteredBooks = books
      .filter((book) => book.reading === true)
      .map(({ id, name, publisher }) => ({ id, name, publisher }));

    return h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      }
    }).code(200);
  } else if (reading === 0) {
    const filteredBooks = books
      .filter((book) => book.reading === false)
      .map(({ id, name, publisher }) => ({ id, name, publisher }));

    return h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      }
    }).code(200);
  }

  if (finished === 1) {
    const filteredBooks = books
      .filter((book) => book.finished === true)
      .map(({ id, name, publisher }) => ({ id, name, publisher }));

    return h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      }
    }).code(200);
  } else if (finished === 0) {
    const filteredBooks = books
      .filter((book) => book.reading === false)
      .map(({ id, name, publisher }) => ({ id, name, publisher }));

    return h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      }
    }).code(200);
  }

  // const formattedBooks = books.map(({ id, name, publisher }) => ({ id, name, publisher }));

  return h.response({
    status: 'success',
    data: {
      books: books.map(({ id, name, publisher }) => ({ id, name, publisher }))
    }
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((book) => book.id === id)[0];

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book,
      }
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const updateBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404);
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };