if (fromVendor) {
  transformedObject.type = 'CATEGORY'
  transformedObject.present_at_all_locations = true
  transformedObject.is_active = !originalObject.isInactive
}
done(transformedObject)
