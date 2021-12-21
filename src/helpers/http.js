const fetchResource = (resource, id) => fetch(`/api/${resource}/${id}`)

const makeFetcher = (resource) => (id) => fetchResource(resource, id)

const fetchTheater = makeFetcher('theaters')

console.log(fetchTheater(666))
