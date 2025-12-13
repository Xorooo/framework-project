// main.js — handles search and results
const pharmacies = [
  { name: "Pharmacy El Hana", medicines: ["Paracetamol","Ibuprofen","Amoxicillin"], lat: 35.77, lng: 10.83, open: "08:00-20:00", address: "Rue de la Liberté" },
  { name: "Pharmacie Centrale", medicines: ["Paracetamol","Aspirin"], lat: 35.78, lng: 10.82, open: "09:00-22:00", address: "Avenue Habib Bourguiba" },
  { name: "Pharmacie Noor", medicines: ["Cetirizine","Amoxicillin"], lat: 35.76, lng: 10.84, open: "07:30-19:00", address: "Cité El Fajr" },
  { name: "Pharmacie Sfax", medicines: ["Ibuprofen","Metformin"], lat: 35.79, lng: 10.81, open: "24/7", address: "monastir" }
];

// Simple distance estimator (not real haversine) — for demo only
function estimateDistance(userLat, userLng, lat, lng){
  const dx = Math.abs(userLat - lat);
  const dy = Math.abs(userLng - lng);
  const km = Math.sqrt(dx*dx + dy*dy) * 111; // approx conversion
  return Math.round(km*10)/10;
}

function renderWelcome(){
  const user = JSON.parse(localStorage.getItem('fm_user'));
  const el = document.getElementById('welcome');
  if(user){
    el.innerHTML = `<div class="alert alert-success">Welcome back, <strong>${user.fullname}</strong>! Search for a medicine below.</div>`;
  } else {
    el.innerHTML = `<div class="alert alert-info">You are not logged in. Register or login for saved searches.</div>`;
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderWelcome();
  const searchForm = document.getElementById('searchForm');
  if(searchForm){
    searchForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const q = document.getElementById('medicineInput').value.trim().toLowerCase();
      if(!q){ alert('Please enter a medicine name'); return; }
      performSearch(q);
    });
  }
});

function performSearch(query){
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = '';
  // ask for location (demo fallback to a fixed location if denied)
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((pos)=>{
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      showMatches(query, userLat, userLng);
    }, (err)=>{
      // fallback coords (example: Monastir)
      showMatches(query, 35.77, 10.83);
    }, {timeout:5000});
  } else {
    showMatches(query, 35.77, 10.83);
  }
}

function showMatches(query, userLat, userLng){
  const matches = pharmacies.map(ph => {
    const has = ph.medicines.some(m => m.toLowerCase() === query);
    const dist = estimateDistance(userLat, userLng, ph.lat, ph.lng);
    return { ...ph, has, dist };
  }).filter(p => p.has).sort((a,b)=>a.dist - b.dist);

  const resultsEl = document.getElementById('results');
  if(matches.length === 0){
    resultsEl.innerHTML = '<div class="alert alert-warning">No nearby pharmacies with that medicine were found in our demo dataset.</div>';
    return;
  }
  const row = document.createElement('div');
  row.className = 'row';
  matches.forEach(ph => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="card mb-3 card-pharm">
        <div class="card-body">
          <h5 class="card-title">${ph.name} <span class="badge bg-success badge-stock">In stock</span></h5>
          <p class="card-text">${ph.address} · Opening: ${ph.open}</p>
          <p class="result-distance">Approx distance: ${ph.dist} km</p>
          <a target="_blank" class="btn btn-outline-primary" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ph.address)}">Open in Maps</a>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  resultsEl.appendChild(row);
}
