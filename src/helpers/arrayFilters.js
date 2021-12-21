const objectHasProperty = function (object, property) {
  return object[property]
}

export const filterByProperty = function (array, property) {
  return array.filter(object => objectHasProperty(object, property))
}
