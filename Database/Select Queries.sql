-- Search function
-- if title is selected as search criteria
SELECT p.post_id, p.user_id, u.name, p.header, p.contents, p.update_at, p.created_at
FROM posts p, users u
WHERE p.user_id =  u.user_id AND p.header LIKE '%search word%';


-- if username is selected as search criteria
SELECT p.post_id, p.user_id, u.name, p.header, p.contents, p.update_at, p.created_at
FROM posts p
LEFT OUTER JOIN users u ON p.user_id =  u.user_id
WHERE u.name LIKE '%search word%';

-- if description is selected as search criteria
SELECT p.post_id, p.user_id, u.name, p.header, p.contents, p.update_at, p.created_at
FROM posts p, users u
WHERE p.user_id =  u.user_id AND p.contents LIKE '%search word%';


-- No. of comments display
