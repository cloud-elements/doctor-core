const {map, find, equals, keys, propEq, reduce, append} = require('ramda');
const http = require('../../utils/http');
const {logDebug} = require('../../utils/logger');

const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const makePathGet = elementKey => `organizations/elements/${elementKey}/transformations`;

module.exports = async data => {
  const {transformations} = data;
  map(async elementKey => {
    let endpointTransformations = [];
    try {
      endpointTransformations = await http.get(makePathGet(elementKey), '');
    } catch (err) {
      /* ignore */
    }
    map(async objectName => {
      const endpointObjectName = find(equals(objectName))(keys(endpointTransformations));
      if (endpointObjectName) {
        const cleaned = cleanTransformation(
          transformations[elementKey][endpointObjectName],
          data.objectDefinitions[endpointObjectName],
        );
        await http.update(makePath(elementKey, endpointObjectName), cleaned);
        logDebug(`Updated Transformation: ${endpointObjectName} - ${elementKey}`);
      } else {
        const cleaned = cleanTransformation(
          transformations[elementKey][objectName],
          data.objectDefinitions[objectName],
        );
        await http.post(makePath(elementKey, objectName), cleaned);
        logDebug(`Created Transformation: ${objectName} - ${elementKey}`);
      }
    })(keys(transformations[elementKey]));
  })(keys(transformations));
};

const cleanTransformation = (transformation, objectDefinition) => {
  if (transformation && transformation.fields) {
    transformation.fields = reduce((fields, field) => {
      const definitionField = find(propEq('path', field.path))(objectDefinition.fields);
      if (definitionField) {
        field.type = definitionField ? definitionField.type : field.type;
        return append(field, fields);
      }
      /* istanbul ignore next */
      return fields;
    })([], transformation.fields);
  }
  return transformation;
};
