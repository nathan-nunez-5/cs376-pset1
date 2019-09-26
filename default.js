let reqsPerQ = 10

class ArtObject{
  constructor(name, artist, yearCreated){
    this.name = name;
    this.artist = artist;
    this.yearCreated = yearCreated;
  }

  name() {
    return this.name;
  }

  artist() {
    return this.artist;
  }

  yearCreated(){
    return this.yearCreated;
  }
}

let api = 'https://api.harvardartmuseums.org/'
let apikey = 'eeb7e1a0-d3f4-11e9-a98b-17c2205dae62'

getGalleryList()

function showGalleryList() {
  document.getElementById("gallery-dropdown").classList.toggle("show");
}
//code from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

async function showGalleryContents(id){
  let galleryUrl = buildURL({}, 'gallery/' +id); //url to get gallery
	let response = await fetch(galleryUrl)
  let data = await response.json()
	// console.log(data)
	let name = data.name + ((data.theme != null) ? (': ' + data.theme) : '');
	// console.log(name)
	document.getElementById('content-list').innerHTML = '<h2> '+ name + '</h2>'
  let golUrl = buildURL({gallery: id}, 'object/'); //url to get objects in gallery
  let response2 = await fetch(golUrl)
  let data2 = await response2.json()
  console.log(data2)
  if (data2.pages < 1){//no objects render

  }else if (data2.pages == 1) {

  }else{//call for each page

  }
}

function buildURL(params, resourceType){
  let base = api + resourceType
  let url = new URL(base)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  url.searchParams.append('apikey', apikey)
  return url
}
async function getGalleryList(res){
  let galleryList = []
  let url = buildURL({}, 'gallery')
  let response = await fetch(url)
  let data = await response.json()
  //console.log(data)
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
      { name: fullname,
        id: data.records[j].id
      })
    }
  }
	galleryList.sort(function(a,b){
		return a.name > b.name
	})
  galleryList.forEach(function(gallery){
    document.getElementById('gallery-dropdown').innerHTML += '<a onclick="showGalleryContents('+ gallery.id + ')">' + gallery.name + '</a>'
  })

}
