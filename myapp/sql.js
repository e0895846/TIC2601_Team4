const getAllCategory = 'SELECT category FROM category';
const getAllSubscribes = 'SELECT category FROM subscribe WHERE username = ?';
const getTopCategories = 'SELECT category FROM category ORDER BY reputation DESC LIMIT 5';

module.exports.getAllCategory = getAllCategory;
module.exports.getAllSubscribes = getAllSubscribes;
module.exports.getTopCategories = getTopCategories;