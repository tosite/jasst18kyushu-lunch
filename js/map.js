var map
var jsonPlaces = []
var places     = []
var tagChips   = []
var center     = { lat: 32.741588, lng: 129.870524 }
var marker     = []
var infoWindow = []
var venue

function getJson() {
  var req = new XMLHttpRequest()
  req.onreadystatechange = () => {
    if (req.readyState == 4 && req.status == 200) {
      jsonPlaces = JSON.parse(req.responseText)
      places     = jsonPlaces
      initMap()
    }
  }
  req.open("GET", "./json/places.json", true)
  req.send(null)
}

function initMap() {
  if (places.length == 0) return
  styles  = [{ featureType: 'all', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
  options = { center: center, zoom: 16, disableDefaultUI: true, gestureHandling: 'greedy', }
  type    = new google.maps.StyledMapType(styles)
  map     = new google.maps.Map(document.getElementById("map"), options)
  map.mapTypes.set("noText",type)
  map.setMapTypeId('noText')

  venue = new google.maps.Marker({ position: center, map: map, icon: "./imgs/venue.png" })

  places.forEach((e, i) => {
    let mpos      = { lat: e.lat, lng: e.lng }
    marker[i]     = new google.maps.Marker({ position: mpos, map: map, icon: "./imgs/icon.png" })
    info          = getInfoWindowHtml(e)
    infoWindow[i] = new google.maps.InfoWindow({ content: info })
    markerClick(i)
    markerOver(i)
  })
}

function markerClick(i) {
  marker[i].addListener("click", function () {
    for(j = 0; j < marker.length; j++) { infoWindow[j].close() }
    infoWindow[i].open(map, marker[i])
  })
}

function markerOver(i) {
  marker[i].addListener('mouseover', function(){
    for(j = 0; j < marker.length; j++) { infoWindow[j].close() }
    infoWindow[i].open(map, marker[i])
  })
}

function getInfoWindowHtml(place) {
  var buf = ""
  var tagHtml = ""
  place.tags.forEach(tag => {
    tagHtml += `<span class="chip">${tag}</span>`
  })
  buf += `<p><a target="_blank" href="${place.url}">${place.name}</a></p>`
  buf += `<p>${tagHtml}</p>`
  return buf
}

function searchTag(tag) {
  $("#tag-chips .chip").removeClass("amber")
  places.forEach((row, i) => { marker[i].setVisible(exist_tag(tag, row.tags)) })
  $(`#${tag}`).addClass("amber")
}

function exist_tag(tag, tags) {
  if (tag == "すべて") { return true }
  var exist = false
  tags.forEach(t => { if (tag == t) { exist = true } })
  return exist
}
