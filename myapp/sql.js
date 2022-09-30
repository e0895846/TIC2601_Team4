const insPostSQL = `INSERT INTO posts (username, header, contents) VALUES (?, ?, ?)`;
const userinfowPassSQL = 'SELECT * FROM users WHERE username = ? AND password = ?';
const userinfonoPassSQL = 'SELECT * FROM users WHERE username = ?';
const postSQL = 'SELECT * FROM posts WHERE username = ?';
const coutPostSQL = 'SELECT COUNT(*) as count FROM posts WHERE username = ?';
const insUserSQL = 'INSERT INTO users (username, password) VALUES (?, ?)';
const deletepostSQL = 'DELETE FROM posts WHERE postid = ?';
const getpostbyIdSQL = 'SELECT * FROM posts WHERE postid = ?';
const updatepostSQL = 'UPDATE posts SET header = ?, contents = ? WHERE postId = ?';
const selectAllPostSQL = 'SELECT * FROM posts';
const selectPostByUser = 'SELECT * FROM posts WHERE username LIKE ?';
const selectPostByHeader = 'SELECT * FROM posts WHERE header LIKE ?';
const selectPostByContents = 'SELECT * FROM posts WHERE contents LIKE ?';
const selectPost = 'SELECT * FROM posts p WHERE p.username LIKE ? OR p.header LIKE ? OR p.contents LIKE ?';



module.exports.insPostSQL = insPostSQL;
module.exports.userinfowPassSQL = userinfowPassSQL;
module.exports.userinfonoPassSQL = userinfonoPassSQL;
module.exports.postSQL = postSQL;
module.exports.coutPostSQL = coutPostSQL;
module.exports.insUserSQL = insUserSQL;
module.exports.deletepostSQL = deletepostSQL;
module.exports.getpostbyIdSQL = getpostbyIdSQL;
module.exports.updatepostSQL = updatepostSQL;
module.exports.selectAllPostSQL = selectAllPostSQL;
module.exports.selectPostByUser = selectPostByUser;
module.exports.selectPostByHeader = selectPostByHeader;
module.exports.selectPostByContents = selectPostByContents;
module.exports.selectPost = selectPost;