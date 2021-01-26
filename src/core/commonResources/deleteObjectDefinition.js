const remove = require('../../utils/remove');

module.exports = async name => await remove(`organizations/objects/${name}/definitions`);
