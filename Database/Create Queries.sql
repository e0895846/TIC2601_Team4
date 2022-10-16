
CREATE DATABASE IF NOT EXISTS rabbit;
USE rabbit;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
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
  username VARCHAR(20) NOT NULL REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE,
  category VARCHAR(45) NOT NULL REFERENCES category(category) ON DELETE CASCADE ON UPDATE CASCADE,
  header VARCHAR(255) NOT NULL,
  content VARCHAR(16000),
  #image_id INT NOT NULL REFERENCES image(image_id) ON DELETE CASCADE ON UPDATE CASCADE,
  reputation INT NOT NULL DEFAULT 0,
  update_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

DROP TABLE IF EXISTS subscribe;
CREATE TABLE subscribe (
  category VARCHAR(45) NOT NULL REFERENCES category(category) ON DELETE CASCADE ON UPDATE CASCADE,
  username VARCHAR(20) NOT NULL REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS vote;
CREATE TABLE vote (
  username VARCHAR(20) NOT NULL REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE,
  post_id INT NOT NULL REFERENCES data(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
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
  parent INT NOT NULL REFERENCES data(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  child INT NOT NULL REFERENCES data(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (parent, child)
);

TRUNCATE user;
INSERT INTO user (username, password) VALUES 
('Kelvin', '$2b$10$V4bx3onIgab/mvuIlkgAVOTlB/dzOCeGy7Q5GY6aeZUr.f/u3zy/y'), --123456
('James', '$2b$10$TRXpr7RpJn2jVs1EWAR9aOoEHElhee4PpOxIsJtbc2nCXSyVjnlmS'), --654321
('Robert', '$2b$10$wTudTtgk6FXR0rU.akBl3.luCzPDLtDnvc7o9YeQTdkfWK7xA.E0O'), --654321
('John', '$2b$10$WRXgM85h4Wy6iib9djz1duK8BynJ2SQYuod4UB9Tc9OPTakqh0eyi'); --654321

TRUNCATE category;
INSERT INTO category (category) VALUES
('test');

TRUNCATE data;
INSERT INTO data (username, header, category, content) VALUES 
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

INSERT INTO vote (username, post_id, is_upvote) VALUES
('Kelvin', 1, 1),
('Kelvin', 5, 0);

UPDATE data SET reputation = 1 WHERE post_id = 1;
UPDATE data SET reputation = -1 WHERE post_id = 5;