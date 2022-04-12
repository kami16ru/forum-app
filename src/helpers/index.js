export const findById = function (collection, id) {
  if (!collection) return null

  return collection.find(c => c.id === id)
}

export const updateOrInsert = function (collection, model) {
  const index = collection.findIndex(c => c.id === model.id)

  if (model.id && index !== -1) collection[index] = model
  else collection.push(model)
}
