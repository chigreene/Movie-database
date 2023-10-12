const express = require('express');

const connection = require('./database')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/movies', (req, res) => {
  connection.query('SELECT * FROM movies', (err, results) => {
    if (err) {
      return res.status(500).json("Error getting movies");
    }
    return res.json(results);
  })
})

app.get('/api/movie-reviews', (req, res) => {
  const query = `
    SELECT movies.name, reviews.review
    FROM movies
    JOIN reviews
    ON movies.id = reviews.movie_id;
  `
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json("Error getting reviews");
    }
    return res.json(results);
  })
})

app.post('/api/add-movie', (req, res) => {
  const { name, review } = req.body

  const movieQuery = `
        INSERT INTO movies (name)
        VALUES (?);
      `;

  connection.query(movieQuery, [name], (err, movieResult) => {
    if (err) {
      return res.status(500).json('Error inserting movie');
    };

    const movieId = movieResult.insertId;

    const reviewQuery = `
      INSERT INTO reviews (review, movie_id)
      VALUES (?, ?);
    `;

    connection.query(reviewQuery, [review, movieId], (err, reviewResults) => {
      if (err) {
        return res.status(500).json("Error inserting review");
      }
    });

    return res.json("review move successfully added to respective tables");
  });
})

app.put('/api/review/:id', (req, res) => {
  const { review } = req.body
  const reviewId = req.params.id

  const query = `
    UPDATE reviews
    SET review = ?
    WHERE id = ?
  `

  connection.query(query, [ review, reviewId ], (err, results) => {
    if (err) {
      return res.status(500).json("Error updating review");
    }
    return res.json(results)
  })

})

app.delete('/api/movie/:id', (req, res) => {
  const reviewId = req.params.id

  const moviesQuery =`
    DELETE FROM movies
    WHERE id = ?
  `
  connection.query(moviesQuery, [reviewId], (err, results) => {
    if (err) {
      return res.status(500).json("Error deleting movie");
    }
  })

  connection.query('DELETE FROM reviews WHERE id = ?', [reviewId], (err, results) => {
    if (err) {
      return res.status(500).json("Error deleting review")
    }
  })

  res.json('Successfully deleted movie')
})

app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}!`);
});