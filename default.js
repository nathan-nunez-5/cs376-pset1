let reqsPerQ = 10

class ArtObject{
  constructor(id, name, artist, yearCreated){
		this.id = id
    this.name = name
    this.artist = artist
    this.yearCreated = yearCreated
  }

  name() {
    return this.name
  }

  artist() {
    return this.artist
  }

  yearCreated(){
    return this.yearCreated
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
	let name = data.name + ((data.theme != null) ? (': ' + data.theme) : '');
	document.getElementById('content-title').innerHTML = '<h2> '+ name + '</h2>'

  let golUrl = buildURL({gallery: id}, 'object/'); //url to get objects in gallery
  response = await fetch(golUrl)
  data = await response.json()
  //console.log(data2)
	let objList = []
	let pages = data.info.pages
  if (pages < 1){//no objects render
		document.getElementById('content-list').innerHTML = '<h1 class="header"> No objects found in this gallery. </h1>'
  }else{
		let count = 1;
		for(let i = 1; i <= pages; i++){
			let pageiURL = buildURL({gallery: id, page: i}, 'object/')
	    response = await fetch(pageiURL)
	    let pageData = await response.json()
			let recordSize = pageData.records.length
			//console.log(pageData)
			for (let i = 0; i < recordSize; i++, count++) {
				console.log(count);
				let objId = pageData.records[i].id
				let objUrl = buildURL({}, 'object/'+objId)
				response = await fetch(objUrl)
				data = await response.json()
				console.log(data)
				
			}
		}
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
