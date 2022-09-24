TRUNCATE users;
INSERT INTO users (username, password) VALUES 
('Kelvin', '123456'),
('James', '654321'),
('Robert', '654321'),
('John', '654321');

TRUNCATE posts;
INSERT INTO posts (username, header, contents) VALUES 
('Kelvin', 'TESTING1', 'This is testing 1 contents'),
('James', 'TESTING2', 'This is testing 2 contents'),
('Robert', 'TESTING3', 'This is testing 3 contents'),
('John', 'TESTING4', 'This is testing 4 contents');
