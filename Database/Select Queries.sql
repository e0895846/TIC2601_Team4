-- Search function
-- if title is selected as search criteria
SELECT p.post_id, p.user_id, p.header, p.contents, p.update_at, p.created_at, count(p.post_id) as nosPost, count(p.post_id)- sum(p.is_comment) As nosTopics
FROM posts p
WHERE p.header like '%search word%'
GROUP by p.user_id;

-- if username is selected as search criteria
SELECT p.post_id, p.user_id, p.header, p.contents, p.update_at, p.created_at, count(p.post_id) as nosPost, count(p.post_id)- sum(p.is_comment) As nosTopics
FROM posts p
LEFT OUTER JOIN users u ON p.user_id =  u.user_id
WHERE u.name like '%search word%' 
GROUP by p.user_id;

-- if description is selected as search criteria
SELECT p.post_id, p.user_id, p.header, p.contents, p.update_at, p.created_at, count(p.post_id) as nosPost, count(p.post_id)- sum(p.is_comment) As nosTopics
FROM posts p
WHERE p.contents like '%search word%'
GROUP by p.user_id;
