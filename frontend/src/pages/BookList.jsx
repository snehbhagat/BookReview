import { useEffect, useState } from "react";
import api from "../api/axios";

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map(book =>
          <li key={book._id}>{book.title} by {book.author}</li>
        )}
      </ul>
    </div>
  );
}

export default BooksList;