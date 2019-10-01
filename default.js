let reqsPerQ = 10

class ImageObject{
	constructor(imageid, height, width, format, baseimageurl, iiifbaseuri){
		this.imageid = imageid
		this.height = height
		this.width = width
		this.format = format
		this.baseurl = baseimageurl
		this.iiifuri = iiifbaseuri
		this.dh = 150 //default height
		this.dw = 150 //defualt width
	}

	displayImg(){
		let imgurl = this.baseurl + '?height=' + 150 + '&width=' + 150
		return  '<img src="' + imgurl + '">'
	}

	expandImg(){

	}
}

class ArtObject{
  constructor(id, name, imgObject){
		this.id = id
    this.name = name
    this.img = imgObject
  }

	display(){
		let imgHTML = '<div class="content-image">' + ((this.img == null) ? 'there is no image available :(' : this.img.displayImg()) + '</div>'
		return '<div class="content-result">' + imgHTML + "<br>" + this.id + "<br>" + this.name + " </div>"

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
  let galleryUrl = buildURL({}, 'gallery/' +id) //url to get gallery
	let response = await fetch(galleryUrl)
  let data = await response.json()
	let name = data.name + ((data.theme != null) ? (': ' + data.theme) : '')
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
				objList.push(buildObject(data))
			}
		}
  }
	//sort here
	document.getElementById('content-list').innerHTML = "";
	objList.forEach(function(obj){
    document.getElementById('content-list').innerHTML += obj.display()
  })

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

function buildImage(imageArray){
	let ie = imageArray[0] //imageElement
	let io = new ImageObject(ie.imageid, ie.height, ie.width, ie.format, ie.baseimageurl, ie.iiifbaseuri) //ImageObject
	return io
}


function buildObject(data){
	let io = (data.images.length < 1) ? null : buildImage(data.images)
	let ao = new ArtObject(data.id, data.title, io)
	return ao
}
