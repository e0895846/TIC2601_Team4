const insPostSQL = `INSERT INTO data (username, header, content) VALUES (?, ?, ?)`;
const userinfowPassSQL = 'SELECT * FROM user WHERE username = ? AND password = ?';
const userinfonoPassSQL = 'SELECT * FROM user WHERE username = ?';
const postSQL = 'SELECT * FROM data WHERE username = ?';
const coutPostSQL = 'SELECT COUNT(*) as count FROM data WHERE username = ?';
const insUserSQL = 'INSERT INTO user (username, password) VALUES (?, ?)';
const deletepostSQL = 'DELETE FROM data WHERE post_id = ?';
const getpostbyIdSQL = 'SELECT * FROM data WHERE postid = ?';
const updatepostSQL = 'UPDATE data SET header = ?, content = ? WHERE postId = ?';
const selectAllPostSQL = 'SELECT * FROM data';
const selectPostByUser = 'SELECT * FROM data WHERE username LIKE ?';
const selectPostByHeader = 'SELECT * FROM data WHERE header LIKE ?';
const selectPostByContents = 'SELECT * FROM data WHERE content LIKE ?';
const selectPost = 'SELECT * FROM data p WHERE p.username LIKE ? OR p.header LIKE ? OR p.content LIKE ?';



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