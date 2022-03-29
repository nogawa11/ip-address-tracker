const leafIcon = L.Icon.extend({
});

const mapIcon = new leafIcon({
  iconUrl: 'images/icon-location.svg',
  iconSize:     [38, 45],
  iconAnchor:   [22, 45],
  popupAnchor:  [-3, -76]
})
const mymap = L.map('map')
const marker = L.marker([0, 0], {icon: mapIcon}).addTo(mymap);
const ipAddress = document.querySelector('.info-ipaddress')
const region = document.querySelector('.info-location')
const timezone = document.querySelector('.info-timezone');
const isp = document.querySelector('.info-isp');
const submit = document.querySelector('.button-submit');
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const mapboxKey = config.MAPBOX_KEY;
const ipifyKey = config.IPIFY_KEY;

const displayMap = (lat, long) => {
  mymap.setView([lat, long], 13);
  marker.setLatLng([lat, long]);

  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxKey}`, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: `${mapboxKey}`
  }).addTo(mymap);
}

const displayCurrentLocation = () => {
  const response = fetch(`https://geo.ipify.org/api/v1?apiKey=${ipifyKey}`, { method: 'GET' })
                .then(response => response.json())
                .catch(() => console.error('Request failed'));
  response.then(response => {
      const lat = response.location.lat;
      const lng = response.location.lng;

      ipAddress.innerHTML = response.ip;
      region.innerHTML = response.location.city;
      timezone.innerHTML = `UTC ${response.location.timezone}`;
      isp.innerHTML = response.isp;
      displayMap(lat, lng);
    })
    .catch(() => console.error('Request failed'));
}

displayCurrentLocation();

const getLocation = () =>  {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const response = fetch(`https://geo.ipify.org/api/v1?apiKey=${ipifyKey}&ipAddress=${input.value}`)
                  .then(res => res.json())
                  .catch(() => console.error("Request failed"));
    response.then(response => {
        const lat = response.location.lat;
        const lng = response.location.lng;

        ipAddress.innerHTML = response.ip;
        region.innerHTML = response.location.city;
        timezone.innerHTML = `UTC ${response.location.timezone}`;
        isp.innerHTML = response.isp;

        displayMap(lat, lng);
      })
      .catch(() => console.error('Request failed'));
  });
}

submit.addEventListener('click', getLocation());
