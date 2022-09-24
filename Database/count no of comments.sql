/*count number of comments using MySQL. For below to work, cannot have multiple comments attached to one parent comment in is_comment_of table. 
Will need assume the child's parent is the latest comment in the post*/

WITH RECURSIVE comcount (post_id, user_id, contents, noscount) AS
( 
SELECT p.post_id, p.user_id, p.contents, 0
FROM posts p 
LEFT OUTER JOIN is_comment_of c ON p.post_id = c.parent 
WHERE c.child IS NULL
    
UNION ALL

SELECT p.post_id, p.user_id, p.contents, noscount+1
FROM comcount, posts p, is_comment_of c
WHERE p.post_id = c.parent AND comcount.post_id = c.child
)

SELECT * FROM comcount ORDER BY noscount;
