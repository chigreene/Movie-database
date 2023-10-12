DROP DATABASE IF EXISTS movies_db;
CREATE DATABASE movies_db;

USE movies_db;

CREATE TABLE movies (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT NOT NULL,
    movie_id INT,
    review TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (movie_id)
    REFERENCES movies(id)
    ON DELETE SET NULL
)