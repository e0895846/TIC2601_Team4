CREATE DATABASE IF NOT EXISTS rabbit;
USE rabbit;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
  username VARCHAR(20) PRIMARY KEY,
  password VARCHAR(64) NOT NULL,
  email VARCHAR(64) NOT NULL,
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

delimiter $
CREATE TRIGGER subscribe_AFTER_INSERT AFTER INSERT ON subscribe
FOR EACH ROW 
BEGIN
		UPDATE category SET reputation = reputation + 1 WHERE NEW.category = category.category;
END$
delimiter ;

delimiter $
CREATE TRIGGER subscribe_BEFORE_DELETE BEFORE DELETE ON subscribe
FOR EACH ROW 
BEGIN
		UPDATE category SET reputation = reputation - 1 WHERE OLD.category = category.category;
END$
delimiter ;

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
INSERT INTO user (username, email, password) VALUES 
('Kelvin', 'kelvin@rabbit.com', '$2b$10$V4bx3onIgab/mvuIlkgAVOTlB/dzOCeGy7Q5GY6aeZUr.f/u3zy/y'),
('James', 'james@rabbit.com','$2b$10$TRXpr7RpJn2jVs1EWAR9aOoEHElhee4PpOxIsJtbc2nCXSyVjnlmS'),
('Robert', 'robert@rabbit.com', '$2b$10$wTudTtgk6FXR0rU.akBl3.luCzPDLtDnvc7o9YeQTdkfWK7xA.E0O'),
('John', 'john@rabbit.com', '$2b$10$WRXgM85h4Wy6iib9djz1duK8BynJ2SQYuod4UB9Tc9OPTakqh0eyi');
#Kelvin 123456
#James 654321
#Robert 654321
#John 654321

INSERT INTO user (username, email, password, is_admin) VALUES 
('admin', 'admin@rabbit.com', '$2b$10$V4bx3onIgab/mvuIlkgAVOTlB/dzOCeGy7Q5GY6aeZUr.f/u3zy/y', 1);
#admin 123456

TRUNCATE category;
INSERT INTO category (category) VALUES
('mildlyinteresting'),
('funny'),
('space'),
('worldnews'),
('technology'),
('Music');

TRUNCATE data;
INSERT INTO data (username, category, content, img, update_at, created_at) VALUES 
('Kelvin', 'mildlyinteresting', '', 'https://preview.redd.it/qb6r9v6l6my91.jpg?width=960&crop=smart&auto=webp&s=20fb44f6e9fb5dc8a53f7ceebe57bd963288b59a', '2022-11-9 20:55:09', '2022-11-9 20:55:09'),
('James', 'mildlyinteresting', 'Pro tip: if you put a flashlight against those puppies you can see the quick clear as day to trim them safely','','2022-11-9 22:55:29','2022-11-9 22:55:29'),
('Robert', 'mildlyinteresting', "Last time I trimmed my huskies nails, I accidentally clipped it because he was twitching a bit (he's usually really calm doing it but holding the back leg makes him twitch) and I got his quick,it was bleeding profusely and I felt so bad. Thankfully it healed up a lot by the next day.",'','2022-11-9 23:25:29','2022-11-9 23:25:29'),
('John', 'mildlyinteresting', "Does this work with black nails as well? I have massive anxiety when I cut my dogs' black nails. I once cut the quick and never want to do that again.",'','2022-11-9 21:26:59','2022-11-9 21:26:59'),
('James', 'space','', 'https://preview.redd.it/1mu80jm1bey91.jpg?width=640&crop=smart&auto=webp&s=af1ffde29212876990de85e4b64250f24da5237a','2022-11-6 10:28:17','2022-11-6 10:28:17'),
('John', 'space', 'Am I right that is just a photo from camera? How you get so much stars?','','2022-11-6 11:58:14','2022-11-6 11:58:14'),
('James', 'space', "Long exposure picture. The aperture (the hole that opens to allow light in) stays open for 2 minutes, allowing light in for the whole time it's open, which basically makes every light source brighter, so a dim star or not even visible to the naked eye, will appear in the picture.

Edit: I messed up and called the aperture the shutter. The aperture does open larger though for more light to be let into the camera usually on these photos as well though.",'','2022-11-6 12:08:24','2022-11-6 12:08:24'),
('James', 'mildlyinteresting', 'Dropped a screw and this is how it landed.', 'https://preview.redd.it/fgxmowyl8hw91.jpg?width=960&crop=smart&auto=webp&s=169bbf3cdc073ed6346f775d19699bdddddbb77a','2022-11-11 15:03:44','2022-11-11 15:03:44'),
('Robert', 'technology', 'Meta says it will lay off more than 11,000 employees','https://i.insider.com/6284f111e19cda00188666d3?width=1300&format=jpeg&auto=webp','2022-11-9 20:38:19','2022-11-9 20:38:19'),
('John', 'technology', "Between this and the twitter layoffs.. there're going to be a lot of tech employees fighting for the same jobs.",'','2022-11-9 20:48:55','2022-11-9 20:48:55');

INSERT INTO post (post_id, header) VALUES
(1, 'My dog has a claw that is half black and half white.'),
(5, 'Too many to count.'),
(8, 'Dropped a screw and this is how it landed.'),
(9, 'Meta says it will lay off more than 11,000 employees');

INSERT INTO is_comment_of (parent, child) VALUES
(1, 2),
(2, 3),
(1, 4),
(5, 6),
(6, 7),
(9, 10);


INSERT INTO vote (username, post_id, is_upvote) VALUES
('Kelvin', 1, 1),
('Kelvin', 5, 0);

UPDATE data SET reputation = 1 WHERE post_id = 1;
UPDATE data SET reputation = -1 WHERE post_id = 5;

INSERT INTO subscribe (username, category) VALUES
('Kelvin', 'mildlyinteresting'),
('Kelvin', 'worldnews'),
('James', 'worldnews'),
('James', 'space'),
('James', 'technology');

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
