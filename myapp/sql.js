const getAllCategory = 'SELECT category FROM category';
const getAllSubscribes = 'SELECT category FROM subscribe WHERE username = ?';

module.exports.getAllCategory = getAllCategory;
module.exports.getAllSubscribes = getAllSubscribes;