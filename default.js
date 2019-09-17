let api = 'https://api.harvardartmuseums.org/'
let apikey = 'eeb7e1a0-d3f4-11e9-a98b-17c2205dae62'
// fetch(url)
//   .then(response => console.log(response))//document.getElementById('gallery-list').innerHTML = JSON.parse(response))
//   .catch(error => console.error(error))
getGalleryList()

function buildURL(params, resourceType){
  let base = api + resourceType
  let url = new URL(base)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  url.searchParams.append('apikey', apikey)
  return url
}
async function getGalleryList(){
  let galleryList = []
  let url = buildURL({}, 'gallery')
  let response = await fetch(url)
  let data = await response.json()
  console.log(data)
  let pages = data.info.pages
  //console.log(pages)
  for (let i = 1; i <= pages; i++) {
    let pageiURL = buildURL({page: i}, 'gallery')
    response = await fetch(pageiURL)
    data = await response.json()
    let recordSize = data.records.length
    //console.log(recordSize)
    for (let j = 0; j < recordSize; j++) {
      //console.log(data.records[j].name, data.records[j].theme, data.records[j].id)
      let fullname = data.records[j].name + ((data.records[j].theme != null) ? (': ' + data.records[j].theme) : '')
      galleryList.push(
        {name: fullname,
        id: data.records[j].id})
    }
  }
  galleryList.forEach(gallery => document.getElementById('gallery-list').append(gallery.name + ' '))
}
