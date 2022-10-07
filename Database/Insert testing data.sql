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

INSERT INTO is_comment_of (parent, child) VALUES
(1, 5),
(1, 6),
(5, 7);