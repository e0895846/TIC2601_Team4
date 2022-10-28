CREATE DATABASE IF NOT EXISTS rabbit;
USE rabbit;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
  username VARCHAR(20) PRIMARY KEY,
  password VARCHAR(64) NOT NULL,
  reputation INT NOT NULL DEFAULT 0,
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  check(length(username) >=3)
);

DROP TABLE IF EXISTS category;
CREATE TABLE category (
  category VARCHAR(45) NOT NULL PRIMARY KEY,
  reputation INT NOT NULL DEFAULT 0
);


DROP TABLE IF EXISTS data;
CREATE TABLE data (
  post_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE,
  category VARCHAR(45) NOT NULL REFERENCES category(category) ON DELETE CASCADE ON UPDATE CASCADE,
  content VARCHAR(16000),
  img BLOB,
  reputation INT NOT NULL DEFAULT 0,
  update_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP()
);

DROP TABLE IF EXISTS subscribe;
CREATE TABLE subscribe (
  username VARCHAR(20) REFERENCES user(username) ON DELETE CASCADE,
  category VARCHAR(45) REFERENCES category(category) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (username, category)
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
  post_id INT NOT NULL REFERENCES data(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  header VARCHAR(255) NOT NULL,
  comments INT DEFAULT 0
);

DROP TABLE IF EXISTS is_comment_of;
CREATE TABLE is_comment_of (
  parent INT NOT NULL REFERENCES data(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  child INT NOT NULL REFERENCES data(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (parent, child)
);


DROP PROCEDURE IF EXISTS getPost;
DELIMITER $
CREATE PROCEDURE getPost(IN comment_id INT, OUT post_id INT)
BEGIN
	WITH RECURSIVE getParent AS (
	SELECT comment_id AS post
  UNION ALL
  SELECT ico.parent AS post FROM is_comment_of ico INNER JOIN getParent gp ON ico.child = gp.post
)
SELECT min(post) INTO post_id FROM getParent;
END$
DELIMITER ;

delimiter $
CREATE TRIGGER is_comment_of_AFTER_INSERT AFTER INSERT ON is_comment_of
FOR EACH ROW 
BEGIN
    CALL getPost(NEW.child, @postId);
		UPDATE post SET comments = comments + 1 WHERE post.post_id = @postId;
END$
delimiter ;

delimiter $
CREATE TRIGGER is_comment_of_BEFORE_DELETE BEFORE DELETE ON is_comment_of
FOR EACH ROW 
BEGIN
    CALL getPost(OLD.child, @postId);
		UPDATE post SET comments = comments - 1 WHERE post.post_id = @postId;
END$
delimiter ;

TRUNCATE user;
INSERT INTO user (username, password) VALUES 
('Kelvin', '$2b$10$V4bx3onIgab/mvuIlkgAVOTlB/dzOCeGy7Q5GY6aeZUr.f/u3zy/y'),
('James', '$2b$10$TRXpr7RpJn2jVs1EWAR9aOoEHElhee4PpOxIsJtbc2nCXSyVjnlmS'),
('Robert', '$2b$10$wTudTtgk6FXR0rU.akBl3.luCzPDLtDnvc7o9YeQTdkfWK7xA.E0O'),
('John', '$2b$10$WRXgM85h4Wy6iib9djz1duK8BynJ2SQYuod4UB9Tc9OPTakqh0eyi');
INSERT INTO user (username, password, is_admin) VALUES 
('admin', '$2b$10$AWfAC5/7tx4Nk/uoSNYYgeL7lrZ6AM6KZZSW1AZDQbmzgrUUAPJBm', 1);
##admin Admin123

TRUNCATE category;
INSERT INTO category (category) VALUES
('mildlyinteresting'),
('test2'),
('test3'),
('test4'),
('test5'),
('funny');

TRUNCATE data;
INSERT INTO data (username, category, content, img) VALUES 
('Kelvin', 'mildlyinteresting', '', 'https://external-preview.redd.it/DLiwTeV1X4SRj_RMpHIhkMuiwOIq8oMRRESv8pRmN9U.jpg?width=960&crop=smart&auto=webp&s=b80cd3381f59ad72bd0f69ddcb084086e194f59c'),
('James', 'test2', 'This is testing 2 contents',''),
('Robert', 'test3', 'This is testing 3 contents',''),
('John', 'test4', 'This is testing 4 contents',''),
('James', 'mildlyinteresting','The "distressed jeans" of the truck world.', ''),
('John', 'test3', 'This is testing 6 contents',''),
('John', 'mildlyinteresting', 'Destoration',''),
('James', 'mildlyinteresting', 'Dropped a screw and this is how it landed.', 'https://preview.redd.it/fgxmowyl8hw91.jpg?width=960&crop=smart&auto=webp&s=169bbf3cdc073ed6346f775d19699bdddddbb77a'),
('Robert', 'mildlyinteresting', 'This is testing 6 reply',''),
('John', 'mildlyinteresting', 'This is testing 7 reply',''),
('James', 'funny', '', 'https://preview.redd.it/xwnaz3ybvew91.jpg?width=960&crop=smart&auto=webp&s=e89d24fc09cb69526ca2050cc01f3ebd47ea5e3e'),
('John', 'mildlyinteresting', "Inception... OP, you're in a dream... or something.", '');

INSERT INTO post (post_id, header) VALUES
(1, 'This Truck has a Wrap to Make it Look Bad'),
(2, 'TESTING2'),
(3, 'TESTING3'),
(4, 'TESTING4'),
(8, 'Dropped a screw and this is how it landed'),
(11, 'Hear no evil see no evil speak no evil and...?');

INSERT INTO is_comment_of (parent, child) VALUES
(1, 5),
(1, 6),
(5, 7),
(8, 12);


INSERT INTO vote (username, post_id, is_upvote) VALUES
('Kelvin', 1, 1),
('Kelvin', 5, 0);

UPDATE data SET reputation = 1 WHERE post_id = 1;
UPDATE data SET reputation = -1 WHERE post_id = 5;

INSERT INTO subscribe (username, category) VALUES
('Kelvin', 'mildlyinteresting'),
('Kelvin', 'test3'),
('James', 'test2'),
('James', 'test3'),
('James', 'test4');

DROP VIEW IF EXISTS trending_post_count;
CREATE VIEW trending_post_count AS
SELECT c.parent as id, COUNT(*) as count FROM data d
INNER JOIN is_comment_of c
WHERE c.child = d.post_id AND d.created_at > NOW() - INTERVAL 1 DAY
GROUP BY c.parent
UNION ALL
SELECT v.post_id as id, COUNT(*) as count FROM vote v
INNER JOIN post p ON p.post_id = v.post_id
WHERE is_upvote = 1 AND update_at > NOW() - INTERVAL 1 DAY
GROUP BY v.post_id;

DROP VIEW IF EXISTS trending_post_id;
CREATE VIEW trending_post_id AS
SELECT t.id FROM trending_post_count t
GROUP BY t.id
ORDER BY SUM(t.count) DESC
LIMIT 5;
