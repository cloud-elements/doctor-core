const m = require('moment')
if (isWhere) {
  transformedObject.where.forEach(item => {
    switch (item.attribute) {
      case 'createdDateUTC':
      case 'updatedDateUTC':
        item.value = m(item.value, m.ISO_8601).format('DD/MM/YYYY HH:mm:ss')
        break
      default:
    }
  })
} else if (fromVendor) {
  // All the objects that are returned by this VDR are of type CATEGORY.
  transformedObject.type = 'CATEGORY'
  transformedObject.is_active = true

  // other static values
  transformedObject.present_at_all_locations = true

  const concatSquareProps = (name, id) => {
    return `${name} (${id})`
  }

  if (!transformedObject.category_data) { transformedObject.category_data = {} }

  if (originalObject.GroupName && originalObject.Number) {
    transformedObject.category_data.name = concatSquareProps(originalObject.GroupName, originalObject.Number)
  }
  if (originalObject.createdDateUTC) {
    transformedObject.created_at = m(originalObject.createdDateUTC, 'DD/MM/YYYY HH:mm:ss').toISOString()
  }
  if (originalObject.updatedDateUTC) {
    transformedObject.updated_at = m(originalObject.updatedDateUTC, 'DD/MM/YYYY HH:mm:ss').toISOString()
  }
}

done(transformedObject)
