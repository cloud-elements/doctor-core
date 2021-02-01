const {isEmpty, isNil} = require("ramda");

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

module.exports = {
  isNilOrEmpty
}