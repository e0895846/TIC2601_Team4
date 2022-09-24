START TRANSACTION;
CREATE TABLE users (  
  username VARCHAR(256) PRIMARY KEY,
  password VARCHAR(64) NOT NULL,
  email VARCHAR(256) UNIQUE,
  phone CHAR(8) UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE posts (
  postId INT auto_increment PRIMARY KEY,
  username VARCHAR(256) NOT NULL REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
  header VARCHAR(256) NOT NULL,
  contents VARCHAR(256),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE likes (
  username VARCHAR(256) NOT NULL REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
  postId INT NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  is_like boolean, 
  update_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()  
);

COMMIT;