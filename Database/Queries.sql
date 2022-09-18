CREATE TABLE users (
  user_id INT PRIMARY KEY,
  name VARCHAR NOT NULL,
  password VARCHAR(60) NOT NULL, 
  reputation INT DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  post_id INT PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id),
  header VARCHAR(255),
  contents VARCHAR,
  is_comment TINYINT(1) NOT NULL,
  update_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK(is_comment EXIST (1, 0))
);

CREATE TABLE is_comment_of (
  parent INT NOT NULL REFERENCES posts(post_id),
  child INT NOT NULL REFERENCES posts(post_id),
  PRIMARY KEY (parent, child)
);

CREATE TABLE votes (
  user_id INT NOT NULL REFERENCES users(user_id),
  post_id INT NOT NULL REFERENCES posts(post_id),
  is_upvote TINYINT(1) NOT NULL,
  PRIMARY KEY (user_id, post_id)
  update_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK(is_upvote EXIST (1, 0))
);
