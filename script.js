// --- SISTEMA DE IDIOMAS (i18n) ---
const traducciones = {
    es: {
        w_title: "Bienvenido a TWS", w_desc: "Sistema de Información Cívica en Tiempo Real",
        w_step1: "Revisa el tiempo estimado de llegada de los buses.",
        w_step2: "Toca cualquier estación para ver su nivel de ocupación.",
        w_step3: "Mantente informado con nuestras alertas de movilidad en vivo.",
        w_start: "👉 Tocar para Empezar", app_title: "Troncal Norte - Caracas",
        filter_title: "Ver paradas por ruta", btn_all: "Todas",
        hdr_num: "N°", hdr_dest: "Destino", hdr_time: "Tiempo",
        sel_title: "Selecciona tu estación actual", sel_opt: "-- Elige una estación --",
        alert_title: "Alertas de movilidad", prox: "Próximo"
    },
    en: {
        w_title: "Welcome to TWS", w_desc: "Real-Time Civic Information System",
        w_step1: "Check the estimated arrival time of the buses.",
        w_step2: "Touch any station to see its current occupancy level.",
        w_step3: "Stay informed with our live mobility alerts.",
        w_start: "👉 Touch to Start", app_title: "North - Caracas Routes",
        filter_title: "View stops by route", btn_all: "All",
        hdr_num: "N°", hdr_dest: "Destination", hdr_time: "Time",
        sel_title: "Select your current station", sel_opt: "-- Choose a station --",
        alert_title: "Mobility Alerts", prox: "Arriving"
    }
};

let idiomaActual = 'es';

document.getElementById('btn-es').addEventListener('click', () => cambiarIdioma('es'));
document.getElementById('btn-en').addEventListener('click', () => cambiarIdioma('en'));

function cambiarIdioma(lang) {
    idiomaActual = lang;
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    const t = traducciones[lang];
    document.getElementById('wel-title').textContent = t.w_title;
    document.getElementById('wel-desc').textContent = t.w_desc;
    document.getElementById('wel-step1').textContent = t.w_step1;
    document.getElementById('wel-step2').textContent = t.w_step2;
    document.getElementById('wel-step3').textContent = t.w_step3;
    document.getElementById('btn-start').textContent = t.w_start;
    
    document.getElementById('app-title').textContent = t.app_title;
    document.getElementById('filter-title').textContent = t.filter_title;
    document.getElementById('btn-filter-all').textContent = t.btn_all;
    document.getElementById('hdr-num').textContent = t.hdr_num;
    document.getElementById('hdr-dest').textContent = t.hdr_dest;
    document.getElementById('hdr-time').textContent = t.hdr_time;
    document.getElementById('sel-title').textContent = t.sel_title;
    document.getElementById('sel-opt').textContent = t.sel_opt;
    document.getElementById('alert-title').textContent = t.alert_title;
}

// --- BOTÓN DE EMPEZAR ---
document.getElementById('btn-start').addEventListener('click', () => {
    const screen = document.getElementById('welcome-screen');
    screen.style.transform = 'translateY(-100%)'; 
    screen.style.opacity = '0';
    setTimeout(() => { 
        screen.style.display = 'none'; 
        map.invalidateSize(); 
    }, 500);
});

document.getElementById('btn-volver').addEventListener('click', function() {
    map.setZoom(12);
    const screen = document.getElementById('welcome-screen');
    screen.style.display = 'flex';
    setTimeout(() => { screen.style.transform = 'translateY(0)'; screen.style.opacity = '1'; }, 10);
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

window.addEventListener('resize', () => map.invalidateSize());

// --- ESTACIONES Y CONFIGURACIÓN DE PARADAS MÚLTIPLES ---
const estaciones = [
    { nombre: "Terminal", lat: 4.7615, lng: -74.0435, congestion: "Normal", rutas: ["8", "B13"] }, 
    { nombre: "Calle 187", lat: 4.7523, lng: -74.0466, congestion: "Poca gente", rutas: ["8"] },
    { nombre: "Portal del Norte", lat: 4.7428, lng: -74.0494, congestion: "Mucha gente", rutas: ["8", "B13", "H75", "G12"] },
    { nombre: "Toberín", lat: 4.7355, lng: -74.0515, congestion: "Normal", rutas: ["8", "B13"] },
    { nombre: "Mazurén", lat: 4.7245, lng: -74.0549, congestion: "Poca gente", rutas: ["8", "H75"] },
    { nombre: "Calle 146", lat: 4.7196, lng: -74.0563, congestion: "Normal", rutas: ["8", "B13", "G12"] },
    { nombre: "Calle 127", lat: 4.7022, lng: -74.0607, congestion: "Mucha gente", rutas: ["8", "H75", "G12"] },
    { nombre: "Pepe Sierra", lat: 4.6934, lng: -74.0628, congestion: "Normal", rutas: ["8", "B13"] },
    { nombre: "Calle 100", lat: 4.6836, lng: -74.0645, congestion: "Mucha gente", rutas: ["8", "B13", "H75", "G12"] },
    { nombre: "Virrey", lat: 4.6750, lng: -74.0645, congestion: "Poca gente", rutas: ["8", "G12"] },
    { nombre: "Calle 85", lat: 4.6698, lng: -74.0646, congestion: "Normal", rutas: ["8", "B13", "H75", "G12"] },
    { nombre: "Héroes", lat: 4.6660, lng: -74.0648, congestion: "Mucha gente", rutas: ["8", "G12"] },
    { nombre: "Calle 72", lat: 4.6585, lng: -74.0658, congestion: "Mucha gente", rutas: ["8", "B13", "H75", "G12"] },
    { nombre: "Calle 63", lat: 4.6482, lng: -74.0677, congestion: "Normal", rutas: ["8", "H75"] },
    { nombre: "Marly", lat: 4.6393, lng: -74.0694, congestion: "Normal", rutas: ["8", "B13", "G12"] },
    { nombre: "Calle 45", lat: 4.6335, lng: -74.0706, congestion: "Poca gente", rutas: ["8", "H75", "G12"] },
    { nombre: "Profamilia", lat: 4.6245, lng: -74.0725, congestion: "Poca gente", rutas: ["8", "B13"] },
    { nombre: "Calle 26", lat: 4.6158, lng: -74.0743, congestion: "Normal", rutas: ["8", "H75"] },
    { nombre: "Calle 22", lat: 4.6094, lng: -74.0758, congestion: "Poca gente", rutas: ["8", "G12"] },
    { nombre: "Calle 19", lat: 4.6062, lng: -74.0766, congestion: "Normal", rutas: ["8", "B13", "H75"] },
    { nombre: "Av. Jiménez", lat: 4.6018, lng: -74.0775, congestion: "Mucha gente", rutas: ["8", "B13", "H75", "G12"] }
];

const rutaCoords = estaciones.map(est => [est.lat, est.lng]);
L.polyline(rutaCoords, { color: '#0284c7', weight: 8, opacity: 1 }).addTo(map);

const selector = document.getElementById('station-select');

// Dibujar pines y guardarlos
estaciones.forEach((est, index) => {
    const htmlIcono = '<div class="station-pin"><img src="https://cdn-icons-png.flaticon.com/512/3034/3034002.png"></div>';
    const divIcon = L.divIcon({ className: 'custom-station-icon', html: htmlIcono, iconSize: [38, 48], iconAnchor: [19, 48], popupAnchor: [0, -45] });
    
    est.marcador = L.marker([est.lat, est.lng], { icon: divIcon }).addTo(map);
    
    let badgeClass = "", icono = "";
    if(est.congestion === "Poca gente") { badgeClass = "cong-baja"; icono = "🟢"; }
    else if(est.congestion === "Normal") { badgeClass = "cong-normal"; icono = "🟡"; }
    else if(est.congestion === "Mucha gente") { badgeClass = "cong-alta"; icono = "🔴"; }

    est.marcador.bindPopup(`
        <div class="popup-custom">
            <h3>${est.nombre}</h3>
            <p><b>Estado:</b> Operativa</p>
            <p><b>Ocupación:</b></p>
            <span class="badge-cong ${badgeClass}">${icono} ${est.congestion}</span>
        </div>
    `);
    
    est.marcador.on('click', () => { map.flyTo([est.lat, est.lng], 16, { animate: true }); });

    const option = document.createElement('option');
    option.value = index; option.textContent = est.nombre;
    selector.appendChild(option);
});

selector.addEventListener('change', function() {
    const est = estaciones[this.value];
    map.flyTo([est.lat, est.lng], 16, { animate: true, duration: 1.5 });
});

// --- LÓGICA DE FILTRADO DE RUTAS MÚLTIPLES ---
function filtrarRuta(rutaSeleccionada) {
    document.querySelectorAll('.route-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-filter-${rutaSeleccionada.toLowerCase()}`).classList.add('active');

    estaciones.forEach(est => {
        let esValida = (rutaSeleccionada === 'all' || est.rutas.includes(rutaSeleccionada));
        
        const claseAdicional = esValida ? '' : 'inactive';
        const htmlIcono = `<div class="station-pin ${claseAdicional}"><img src="https://cdn-icons-png.flaticon.com/512/3034/3034002.png"></div>`;
        
        est.marcador.setIcon(L.divIcon({ 
            className: 'custom-station-icon', 
            html: htmlIcono, 
            iconSize: [38, 48], iconAnchor: [19, 48], popupAnchor: [0, -45] 
        }));
        
        est.marcador.setZIndexOffset(esValida ? 100 : 0);
    });
}

document.getElementById('btn-filter-all').addEventListener('click', () => filtrarRuta('all'));
document.getElementById('btn-filter-8').addEventListener('click', () => filtrarRuta('8'));
document.getElementById('btn-filter-b13').addEventListener('click', () => filtrarRuta('B13'));
document.getElementById('btn-filter-h75').addEventListener('click', () => filtrarRuta('H75'));
document.getElementById('btn-filter-g12').addEventListener('click', () => filtrarRuta('G12'));


// --- FUNCION PARA OBTENER COLOR SEGÚN LA LETRA ---
function getColorClass(id) {
    if (id.startsWith('B')) return 'bus-b'; // Verde
    if (id.startsWith('G')) return 'bus-g'; // Azul
    if (id.startsWith('H')) return 'bus-h'; // Naranja
    return 'bus-default'; // Rojo para la 8
}

// --- SIMULACIÓN DE BUSES EN TIEMPO REAL ---
const busesActivos = [
    { id: "B13", nombre: "Portal Norte", tiempoSegundos: 135, indexBase: 4, progreso: 0, direccion: -1, velocidad: 0.003, marcador: null },
    { id: "8", nombre: "Terminal", tiempoSegundos: 310, indexBase: 8, progreso: 0.5, direccion: -1, velocidad: 0.004, marcador: null },
    { id: "H75", nombre: "Usme", tiempoSegundos: 540, indexBase: 12, progreso: 0, direccion: 1, velocidad: 0.002, marcador: null },
    { id: "G12", nombre: "P. Sur", tiempoSegundos: 840, indexBase: 17, progreso: 0.8, direccion: 1, velocidad: 0.003, marcador: null }
];

const panelRutas = document.getElementById('routes-list');

busesActivos.forEach(bus => {
    // Detectar color correspondiente
    const colorClass = getColorClass(bus.id);

    const iconoBus = L.divIcon({
        className: 'custom-bus-icon',
        html: `<div class="bus-pin ${colorClass}">${bus.id}</div>`, 
        iconSize: [44, 54], iconAnchor: [22, 54] 
    });
    bus.marcador = L.marker([estaciones[bus.indexBase].lat, estaciones[bus.indexBase].lng], { icon: iconoBus, zIndexOffset: 1000 }).addTo(map);

    const row = document.createElement('div');
    row.className = 'route-row';
    row.innerHTML = `
        <div class="route-num ${colorClass}">${bus.id}</div>
        <div class="route-name">${bus.nombre}</div>
        <div class="route-time" id="time-${bus.id}-${bus.indexBase}">--</div>
    `;
    
    row.addEventListener('click', () => { 
        map.flyTo(bus.marcador.getLatLng(), 16, { animate: true, duration: 1 });
        filtrarRuta(bus.id);
    });
    panelRutas.appendChild(row);
});

setInterval(() => {
    busesActivos.forEach(bus => {
        bus.tiempoSegundos--; 
        if (bus.tiempoSegundos <= 0) { bus.tiempoSegundos = Math.floor(Math.random() * 600) + 300; }

        const timeUI = document.getElementById(`time-${bus.id}-${bus.indexBase}`);
        if (timeUI) {
            if (bus.tiempoSegundos <= 20) {
                timeUI.textContent = traducciones[idiomaActual].prox;
                timeUI.classList.add("arriving");
            } else {
                const m = Math.floor(bus.tiempoSegundos / 60);
                const s = bus.tiempoSegundos % 60;
                timeUI.textContent = `${m}:${s.toString().padStart(2, '0')} min`;
                timeUI.classList.remove("arriving");
            }
        }
    });
}, 1000);

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

// --- ALERTAS DINÁMICAS ---
const arrayAlertas = {
    es: [
        { tipo: 'error', texto: "⚠️ Alta congestión en Héroes. Retrasos de 5-10 min." },
        { tipo: 'success', texto: "✅ Operación normal en la Troncal Norte." },
        { tipo: 'info', texto: "🌧️ Lluvia en Calle 100. Ingrese con precaución." }
    ],
    en: [
        { tipo: 'error', texto: "⚠️ High congestion at Héroes. 5-10 min delays." },
        { tipo: 'success', texto: "✅ Normal operation on North Trunk line." },
        { tipo: 'info', texto: "🌧️ Rain at Calle 100. Please enter with caution." }
    ]
};

let indiceAlerta = 0;
const divAlerta = document.getElementById('alert-text');

function actualizarAlerta() {
    divAlerta.style.opacity = '0';
    setTimeout(() => {
        const alertaVisible = arrayAlertas[idiomaActual][indiceAlerta];
        divAlerta.innerHTML = alertaVisible.texto;
        divAlerta.className = `alert-message alert-${alertaVisible.tipo}`;
        divAlerta.style.opacity = '1';
        indiceAlerta = (indiceAlerta + 1) % arrayAlertas[idiomaActual].length;
    }, 500); 
}
actualizarAlerta();
setInterval(actualizarAlerta, 20000);
