CREATE TABLE myblog.authors(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE myblog.posts(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(author_id) REFERENCES authors(id)
);

INSERT INTO myblog.authors (name, email)
VALUES (
    'Roshan',
    'roshan@gmail.com'
  );

INSERT INTO myblog.authors (name, email)
VALUES (
    'Test',
    'test@gmail.com'
  );