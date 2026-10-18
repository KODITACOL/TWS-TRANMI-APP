// --- INTERACTIVIDAD DEL HEADER ---
document.getElementById('btn-volver').addEventListener('click', function() {
    map.setZoom(12);
});

// --- INICIALIZACIÓN DEL MAPA ---
const limitesCorredor = [[4.580, -74.100], [4.780, -74.030]];
const map = L.map('map', {
    center: [4.675, -74.060], zoom: 12, minZoom: 12, maxZoom: 18,
    maxBounds: limitesCorredor, maxBoundsViscosity: 1.0, zoomControl: false 
});

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

// --- COORDENADAS ESTACIONES ---
const estaciones = [
    { nombre: "Terminal", lat: 4.7615, lng: -74.0435 }, 
    { nombre: "Calle 187", lat: 4.7523, lng: -74.0466 },
    { nombre: "Portal del Norte", lat: 4.7428, lng: -74.0494 },
    { nombre: "Toberín", lat: 4.7355, lng: -74.0515 },
    { nombre: "Mazurén", lat: 4.7245, lng: -74.0549 },
    { nombre: "Calle 146", lat: 4.7196, lng: -74.0563 },
    { nombre: "Calle 127", lat: 4.7022, lng: -74.0607 },
    { nombre: "Pepe Sierra", lat: 4.6934, lng: -74.0628 },
    { nombre: "Calle 100", lat: 4.6836, lng: -74.0645 },
    { nombre: "Virrey", lat: 4.6750, lng: -74.0645 },
    { nombre: "Calle 85", lat: 4.6698, lng: -74.0646 },
    { nombre: "Héroes", lat: 4.6660, lng: -74.0648 },
    { nombre: "Calle 72", lat: 4.6585, lng: -74.0658 },
    { nombre: "Calle 63", lat: 4.6482, lng: -74.0677 },
    { nombre: "Marly", lat: 4.6393, lng: -74.0694 },
    { nombre: "Calle 45", lat: 4.6335, lng: -74.0706 },
    { nombre: "Profamilia", lat: 4.6245, lng: -74.0725 },
    { nombre: "Calle 26", lat: 4.6158, lng: -74.0743 },
    { nombre: "Calle 22", lat: 4.6094, lng: -74.0758 },
    { nombre: "Calle 19", lat: 4.6062, lng: -74.0766 },
    { nombre: "Av. Jiménez", lat: 4.6018, lng: -74.0775 }
];

// Dibujar Ruta
const rutaCoords = estaciones.map(est => [est.lat, est.lng]);
L.polyline(rutaCoords, { color: '#0284c7', weight: 8, opacity: 1 }).addTo(map);

// --- RENDERIZAR ESTACIONES Y SELECTOR ---
const iconoEstacion = L.divIcon({
    className: 'custom-station-icon', html: '<div class="station-pin"></div>',
    iconSize: [30, 40], iconAnchor: [15, 40], popupAnchor: [0, -40] 
});

const selector = document.getElementById('station-select');

estaciones.forEach((est, index) => {
    const marker = L.marker([est.lat, est.lng], { icon: iconoEstacion }).addTo(map);
    marker.bindPopup(`<div style="font-size:18px;"><b>${est.nombre}</b><br><span style="color:#10b981;">Operativa</span></div>`);
    marker.on('click', () => { map.flyTo([est.lat, est.lng], 16, { animate: true }); });

    const option = document.createElement('option');
    option.value = index;
    option.textContent = est.nombre;
    selector.appendChild(option);
});

selector.addEventListener('change', function() {
    const est = estaciones[this.value];
    map.flyTo([est.lat, est.lng], 16, { animate: true, duration: 1.5 });
});

// --- SIMULACIÓN DE BUSES ---
const busesActivos = [
    { id: "B13", nombre: "Portal Norte", tiempo: "2 min", indexBase: 4, progreso: 0, direccion: -1, velocidad: 0.003, marcador: null },
    { id: "8", nombre: "Terminal", tiempo: "5 min", indexBase: 8, progreso: 0.5, direccion: -1, velocidad: 0.004, marcador: null },
    { id: "H75", nombre: "Usme", tiempo: "9 min", indexBase: 12, progreso: 0, direccion: 1, velocidad: 0.002, marcador: null },
    { id: "G12", nombre: "P. Sur", tiempo: "14 min", indexBase: 17, progreso: 0.8, direccion: 1, velocidad: 0.003, marcador: null }
];

const panelRutas = document.getElementById('routes-list');

busesActivos.forEach(bus => {
    const iconoBus = L.divIcon({
        className: 'custom-bus-icon',
        html: `<div class="bus-pin">${bus.id}</div>`, 
        iconSize: [44, 54], iconAnchor: [22, 54] 
    });
    bus.marcador = L.marker([estaciones[bus.indexBase].lat, estaciones[bus.indexBase].lng], { icon: iconoBus, zIndexOffset: 1000 }).addTo(map);

    const row = document.createElement('div');
    row.className = 'route-row';
    row.innerHTML = `
        <div class="route-num">${bus.id}</div>
        <div class="route-name">${bus.nombre}</div>
        <div class="route-time">${bus.tiempo}</div>
    `;
    
    row.addEventListener('click', () => { map.flyTo(bus.marcador.getLatLng(), 16, { animate: true, duration: 1 }); });
    panelRutas.appendChild(row);
});

function moverBuses() {
    busesActivos.forEach(bus => {
        if (bus.direccion === 1 && bus.indexBase >= estaciones.length - 1) { bus.direccion = -1; } 
        else if (bus.direccion === -1 && bus.indexBase <= 0) { bus.direccion = 1; }

        let pA = estaciones[bus.indexBase];
        let pB = bus.direccion === 1 ? estaciones[bus.indexBase + 1] : estaciones[bus.indexBase - 1];

        const lat = pA.lat + (pB.lat - pA.lat) * bus.progreso;
        const lng = pA.lng + (pB.lng - pA.lng) * bus.progreso;

        bus.marcador.setLatLng([lat, lng]);
        bus.progreso += bus.velocidad;

        if (bus.progreso >= 1) { bus.progreso = 0; bus.indexBase += bus.direccion; }
    });
    requestAnimationFrame(moverBuses);
}
moverBuses();

// --- SISTEMA DE ALERTAS DINÁMICAS ---
const arrayAlertas = [
    { tipo: 'error', texto: "⚠️ Alta congestión reportada en Héroes. Retrasos de 5-10 min en servicios B." },
    { tipo: 'success', texto: "✅ Operación normal en la Troncal Norte. Flujo continuo de articulados." },
    { tipo: 'info', texto: "🌧️ Lluvia moderada en sector Calle 100. Por favor, ingrese con precaución." },
    { tipo: 'warning', texto: "🚧 Mantenimiento en carril exclusivo cerca a Pepe Sierra. Transite con cuidado." },
    { tipo: 'error', texto: "🚨 Novedad operativa en Calle 72. Rutas A presentan desvíos temporales." }
];

let indiceAlerta = 0;
const divAlerta = document.getElementById('alert-text');

function actualizarAlerta() {
    divAlerta.style.opacity = '0';
    
    setTimeout(() => {
        const alertaVisible = arrayAlertas[indiceAlerta];
        divAlerta.innerHTML = alertaVisible.texto;
        divAlerta.className = `alert-message alert-${alertaVisible.tipo}`;
        
        divAlerta.style.opacity = '1';

        indiceAlerta = (indiceAlerta + 1) % arrayAlertas.length;
    }, 500); 
}

actualizarAlerta();
setInterval(actualizarAlerta, 20000);