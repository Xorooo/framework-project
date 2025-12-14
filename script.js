// ====================== PHARMACIES ======================
const pharmacies = [
  {name:"Pharmacie Tunis Centre",lat:36.8065,lon:10.1815,meds:["Paracetamol","Doliprane","Ibuprofen","Insuline","Ventoline"]},
  {name:"Pharmacie La Marsa",lat:36.8786,lon:10.3243,meds:["Vitamin C","Paracetamol","Aspirine"]},
  {name:"Pharmacie Ariana",lat:36.8625,lon:10.1956,meds:["Insuline","Ibuprofen","Doliprane"]},
  {name:"Pharmacie Ben Arous",lat:36.7545,lon:10.2310,meds:["Paracetamol","Amoxicilline","Ventoline"]},
  {name:"Pharmacie Sousse Centre",lat:35.8256,lon:10.6360,meds:["Paracetamol","Ibuprofen","Amoxicilline"]},
  {name:"Pharmacie Hammam Sousse",lat:35.8600,lon:10.6030,meds:["Vitamin D","Doliprane","Cough Syrup"]},
  {name:"Pharmacie Khezama",lat:35.8360,lon:10.6160,meds:["Paracetamol","Insuline","Ventoline"]},
  {name:"Pharmacie Monastir Centre",lat:35.7770,lon:10.8260,meds:["Paracetamol","Ibuprofen","Ventoline"]},
  {name:"Pharmacie Ksar Hellal",lat:35.6500,lon:10.8900,meds:["Doliprane","Vitamin C","Amoxicilline"]},
  {name:"Pharmacie Moknine",lat:35.6340,lon:10.8950,meds:["Paracetamol","Insuline","Ibuprofen"]},
  {name:"Pharmacie Sfax Centre",lat:34.7406,lon:10.7603,meds:["Paracetamol","Aspirine","Vitamin B12"]},
  {name:"Pharmacie Sfax Jadida",lat:34.7200,lon:10.7500,meds:["Doliprane","Insuline","Ventoline"]},
  {name:"Pharmacie Nabeul",lat:36.4500,lon:10.7333,meds:["Paracetamol","Vitamin C","Ibuprofen"]},
  {name:"Pharmacie Hammamet",lat:36.4020,lon:10.6220,meds:["Doliprane","Ventoline","Cough Syrup"]},
  {name:"Pharmacie Bizerte Centre",lat:37.2744,lon:9.8739,meds:["Paracetamol","Insuline","Vitamin D"]},
  {name:"Pharmacie Kairouan",lat:35.6781,lon:10.0963,meds:["Doliprane","Amoxicilline","Ibuprofen"]},
  {name:"Pharmacie Gabès",lat:33.8833,lon:10.1000,meds:["Insuline","Paracetamol","Ventoline"]},
  {name:"Pharmacie Gafsa",lat:34.4258,lon:8.7842,meds:["Doliprane","Vitamin C","Ibuprofen"]}
];

// ====================== DISTANCE (HAVERSINE) ======================
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) *
            Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ====================== INIT MAP ======================
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'© OpenStreetMap'
}).addTo(map);
let markers = [];

// ====================== SEARCH ======================
const searchForm = document.getElementById("searchForm");
const results = document.getElementById("results");
const medicineInput = document.getElementById("medicineInput");

searchForm.addEventListener("submit", function(e){
  e.preventDefault();
  results.innerHTML = "";
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  if(!navigator.geolocation){
    alert("Géolocalisation non supportée");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    // USER MARKER (rouge)
    const userMarker = L.circleMarker([userLat,userLon],{
      color:'red', radius:8
    }).addTo(map).bindPopup("📍 Vous êtes ici").openPopup();
    markers.push(userMarker);
    map.setView([userLat,userLon], 9);

    const med = medicineInput.value.trim().toLowerCase();

    let found = pharmacies
      .filter(p => p.meds.some(m => m.toLowerCase() === med))
      .map(p => {
        return {...p, distance: distanceKm(userLat,userLon,p.lat,p.lon)};
      })
      .sort((a,b) => a.distance - b.distance);

    if(found.length === 0){
      results.innerHTML = "<p>Aucune pharmacie trouvée.</p>";
      return;
    }

    found.forEach(p => {
      // LIST
      results.innerHTML += `
        <div class="card">
          <h4>${p.name}</h4>
          <p>Médicaments : ${p.meds.join(", ")}</p>
          <p class="distance">📏 ${p.distance.toFixed(2)} km</p>
        </div>
      `;

      // MAP MARKER
      const m = L.marker([p.lat,p.lon])
        .addTo(map)
        .bindPopup(`<strong>${p.name}</strong><br>${p.distance.toFixed(2)} km`);
      markers.push(m);
    });

  }, err => {
    alert("⚠️ Veuillez autoriser la localisation dans votre navigateur : "+err.message);
  }, {enableHighAccuracy:true, timeout:10000, maximumAge:0});
});







