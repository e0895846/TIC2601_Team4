-- snp Verison 1.0

CREATE DATABASE IF NOT EXISTS snp;
USE snp;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  username VARCHAR(20) NOT NULL PRIMARY KEY,
  password VARCHAR(64) NOT NULL,
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  reputation INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

DROP TABLE IF EXISTS category;
CREATE TABLE category (
  category VARCHAR(45) NOT NULL PRIMARY KEY,
  reputation INT NOT NULL DEFAULT 0
);

/*
DROP TABLE IF EXISTS image;
CREATE TABLE image (
  image_id INT NOT NULL PRIMARY KEY,
  data BLOB NOT NULL
);z
*/

DROP TABLE IF EXISTS data;
CREATE TABLE data (
  post_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
  category VARCHAR(45) NOT NULL REFERENCES category(category) ON DELETE CASCADE ON UPDATE CASCADE,
  header VARCHAR(255) NOT NULL,
  contents VARCHAR(16000),
  #image_id INT NOT NULL REFERENCES image(image_id) ON DELETE CASCADE ON UPDATE CASCADE,
  reputation INT NOT NULL DEFAULT 0,
  update_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

DROP TABLE IF EXISTS subscribes;
CREATE TABLE subscribes (
  category VARCHAR(45) NOT NULL REFERENCES category(category) ON DELETE CASCADE ON UPDATE CASCADE,
  username VARCHAR(20) NOT NULL REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS votes;
CREATE TABLE votes (
  username VARCHAR(20) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  is_upvote TINYINT(1) NOT NULL,
  update_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (username, post_id),
  CHECK(is_upvote = 1 OR is_upvote = 0)
);

DROP TABLE IF EXISTS post;
CREATE TABLE post (
  post_id INT NOT NULL REFERENCES data(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS is_comment_of;
CREATE TABLE is_comment_of (
  parent INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  child INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (parent, child)
);

TRUNCATE users;
INSERT INTO users (username, password) VALUES 
('Kelvin', '123456'),
('James', '654321'),
('Robert', '654321'),
('John', '654321');

TRUNCATE category;
INSERT INTO category (category) VALUES
('test');

TRUNCATE data;
INSERT INTO data (username, header, category, contents) VALUES 
('Kelvin', 'TESTING1', 'test', 'This is testing 1 contents'),
('James', 'TESTING2', 'test', 'This is testing 2 contents'),
('Robert', 'TESTING3', 'test', 'This is testing 3 contents'),
('John', 'TESTING4', 'test', 'This is testing 4 contents'),
('James', 'TESTING5', 'test', 'This is testing 5 reply'),
('Robert', 'TESTING3', 'test', 'This is testing 6 reply'),
('John', 'TESTING4', 'test', 'This is testing 7 reply');

INSERT INTO post (post_id) VALUES
(1),
(2),
(3),
(4);

INSERT INTO is_comment_of (parent, child) VALUES
(1, 5),
(1, 6),
(5, 7);