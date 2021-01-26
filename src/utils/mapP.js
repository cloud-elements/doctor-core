const {curry} = require('ramda');

module.exports = curry(async (fn, objects) => {
  const array = [];
  for (let i = 0; i < objects.length; i++) {
    array.push(fn(objects[i]));
  }
  return await Promise.all(array);
});
