// Prototipo navegable para la prueba con personas (ticket 36).
// Une las pantallas elegidas en los tickets 30 a 35: Inicio D, la fecha E, artista E, agenda E2,
// Artistas E, primer uso D, Vos D y la Notificación D. Datos de mentira (datos.js).
(function () {
'use strict';
const M = window.MOCK;
const $ = id => document.getElementById(id);

// ---------- utilidades ----------
const DIAS = ['dom','lun','mar','mié','jue','vie','sáb'];
const DIAS_L = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const HOY = M.hoy, HOYD = parse(HOY);
const corto = s => { const d = parse(s); return DIAS[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1); };
const largo = s => { const d = parse(s); return DIAS_L[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()]; };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const menos7 = s => { const d = parse(s); d.setDate(d.getDate() - 7); return DIAS[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1); };
const diaLargo = s => {
  const d = parse(s), dif = Math.round((d - HOYD) / 864e5), base = cap(largo(s));
  if (dif === 0) return 'Hoy · ' + base;
  if (dif === 1) return 'Mañana · ' + base;
  if (dif < 7) return 'Este ' + largo(s);
  return base;
};
const mesDe = s => { const d = parse(s); return cap(MESES[d.getMonth()]) + (d.getFullYear() !== HOYD.getFullYear() ? ' ' + d.getFullYear() : ''); };
const ini = n => n.split(/\s+/).filter(w => /^[A-ZÁÉÍÓÚÑ0-9]/.test(w)).slice(0, 2).map(w => w[0]).join('');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sinTilde = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const slug = n => '@' + sinTilde(n).replace(/[^a-z0-9]/g, '').slice(0, 18);
const pesos = n => '$' + n.toLocaleString('es-AR');
const haceCuanto = s => { const d = Math.round((HOYD - parse(s)) / 864e5); return d <= 0 ? 'hoy' : d === 1 ? 'ayer' : 'hace ' + d + ' días'; };
const TICKETERAS = { passline: 'Passline', ticketek: 'Ticketek', alpogo: 'Alpogo', cck: 'CCK', allaccess: 'All Access' };
const DOMINIO = { passline: 'passline.com', ticketek: 'ticketek.com.ar', alpogo: 'alpogo.com', cck: 'cck.gob.ar', allaccess: 'allaccess.com.ar' };
const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LIMITE = M.persona.limiteGratis;
const PRECIO = { mes: 3000, anio: 30000 }; // provisorio, inventado (ticket 34)
const NO_ESTA = 'Esto no está en la prueba.';

// ---------- datos ----------
M.artistas.fierro.alcance = 'cerca'; // recorrido 6: el CCK queda fuera de la zona (como en el ticket 32)
Object.assign(M.artistas, {
  patane: { nombre: 'Lucy Patané', foto: true, alcance: 'cerca', genero: 'rock' },
  invencible: { nombre: 'Mi Amigo Invencible y la Orquesta de Cámara de Rosario', foto: false, alcance: 'cerca', genero: 'indie' },
  winona: { nombre: 'Winona Riders', foto: true, alcance: 'cerca', genero: 'indie' },
  ligas: { nombre: 'Las Ligas Menores', foto: true, alcance: 'cerca', genero: 'indie' },
  bestia: { nombre: 'Bestia Bebé', foto: true, alcance: 'cerca', genero: 'indie' },
  marilina: { nombre: 'Marilina Bertoldi', foto: true, alcance: 'cerca', genero: 'rock' },
  louta: { nombre: 'Louta', foto: true, alcance: 'cerca', genero: 'pop' },
});
const RELLENO = ['Conociendo Rusia','Lisandro Aristimuño','Barbi Recanati','Sara Hebe','Miss Bolivia','Gauchito Club','El Zar','Turf','Eruca Sativa','Hipnótica','Militantes del Clímax','Viva Elástico',
  'Perras on the Beach','1915','Paula Maffía','Fémina','Valdés','Peces Raros','Carca','Shaira','Emmanuel Horvilleur','Los Látigos','Rayos Láser','Juan Ingaramo','Silvestre y la Naranja','Sol Pereyra',
  'Paz Carrara','Onda Vaga','Morbo y Mambo','Nonpalidece','Raly Barrionuevo','Liliana Herrero','Kevin Johansen','Jorge Drexler','Divididos','Las Pelotas'];
RELLENO.forEach((n, i) => { M.artistas['r' + i] = { nombre: n, foto: i % 7 !== 3, alcance: 'cerca', genero: ['rock','pop','indie','folk','rap'][i % 5], relleno: true }; });

const EXTRA = [
  // gira de El Mató: una en tu zona y tres afuera (ticket 32)
  { id: 'g1', artista: 'emapm', fecha: '2026-11-28', hora: '21 h', lugar: 'Club Paraguay', ciudad: 'Córdoba', provincia: 'Córdoba', entradas: { url: 'passline' }, publicado: '2026-11-07', cita: 'GIRA: Córdoba 28/11 · Rosario 6/12 · Buenos Aires 12/12 · Mendoza 18/12' },
  { id: 'g2', artista: 'emapm', fecha: '2026-12-12', hora: '21 h', lugar: 'Estadio Obras', ciudad: 'Buenos Aires', provincia: 'CABA', entradas: { url: 'ticketek' }, publicado: '2026-11-07', cita: 'GIRA: Córdoba 28/11 · Rosario 6/12 · Buenos Aires 12/12 · Mendoza 18/12' },
  { id: 'g3', artista: 'emapm', fecha: '2026-12-18', hora: '21 h', lugar: 'Teatro Plaza', ciudad: 'Mendoza', provincia: 'Mendoza', entradas: { url: 'passline' }, publicado: '2026-11-07', cita: 'GIRA: Córdoba 28/11 · Rosario 6/12 · Buenos Aires 12/12 · Mendoza 18/12' },
  { id: 'w1', artista: 'winona', fecha: '2026-12-11', hora: '22 h', lugar: 'Bon Scott Bar', ciudad: 'Rosario', provincia: 'Santa Fe', entradas: { url: 'passline' }, publicado: '2026-11-02', cita: 'Rosario viernes 11/12 en Bon Scott 💥' },
  { id: 'p2', artista: 'cebra', fecha: '2026-09-12', hora: '22 h', lugar: 'Club Riberas del Paraná', ciudad: 'Villa Constitución', provincia: 'Santa Fe', pasada: true, entradas: {}, publicado: '2026-08-20', cita: 'Villa 12/9' },
  { id: 'p3', artista: 'emapm', fecha: '2026-08-15', hora: '21 h', lugar: 'Metropolitano', ciudad: 'Rosario', provincia: 'Santa Fe', pasada: true, entradas: {}, publicado: '2026-07-01', cita: 'Rosario 15/8' },
];
const FECHAS = M.fechas.concat(EXTRA).map(f => ({ ...f, tipo: 'fecha', entradas: f.entradas || {} }));
const ANUNCIOS = M.anuncios.map(a => ({ ...a, tipo: 'anuncio' }));
const PROMO = M.promocionadas.map(p => ({ ...p, tipo: 'promo' }));
const TODO = [...FECHAS, ...ANUNCIOS, ...PROMO];
const porId = id => TODO.find(i => i.id === id);
const nomA = a => M.artistas[a].nombre;
const nombreI = i => i.tipo === 'promo' ? i.nombre : nomA(i.artista) + (i.proyecto ? ' ' + i.proyecto : '');

const MARCAS_INI = {}; FECHAS.forEach(f => { if (f.marca) MARCAS_INI[f.id] = f.marca; });
Object.assign(MARCAS_INI, { p2: 'voy', p3: 'voy' });
const MOCK_ARTISTAS = ['bandalos','fierro','emapm','wos','fito','juana','usted','espil','cebra','cory','cypa','babasonicos','perotti','chancha'];
const SIGUE_LUCIA = MOCK_ARTISTAS.concat(['patane', 'invencible']).concat(Array.from({ length: 12 }, (_, i) => 'r' + i)); // 28
// Las historias que abre el aviso resumen ("2 fechas nuevas") van primero, en el orden del aviso.
const PRIMERO = ['f1', 'f2'];

// Zona: ciudades y pueblos (tickets 33 y 34)
const CIUDADES = [
  ['Rosario', 'Santa Fe'], ['Rosario de la Frontera', 'Salta'], ['Rosario de Lerma', 'Salta'], ['Funes', 'Santa Fe'], ['Buenos Aires', 'CABA'], ['Córdoba', 'Córdoba'],
  ['Mendoza', 'Mendoza'], ['La Plata', 'Buenos Aires'], ['Mar del Plata', 'Buenos Aires'], ['San Miguel de Tucumán', 'Tucumán'], ['Santa Fe', 'Santa Fe'], ['Neuquén', 'Neuquén'],
  ['Salta', 'Salta'], ['Bahía Blanca', 'Buenos Aires'], ['Paraná', 'Entre Ríos'], ['Rafaela', 'Santa Fe'], ['Villa Constitución', 'Santa Fe'], ['San Carlos de Bariloche', 'Río Negro'],
];
const COMUNES = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'San Miguel de Tucumán', 'Santa Fe'];
const provDe = c => (CIUDADES.find(x => x[0] === c) || [c, ''])[1];
const ALREDEDOR = {
  Rosario: [['Funes', 15], ['Granadero Baigorria', 12], ['Villa Gobernador Gálvez', 10], ['Pérez', 14], ['San Lorenzo', 25], ['Arroyo Seco', 33], ['Cañada de Gómez', 60], ['Villa Constitución', 52], ['Casilda', 55], ['San Nicolás', 70], ['Coronda', 85], ['Pergamino', 110], ['Santa Fe', 165], ['Paraná', 170], ['Venado Tuerto', 160]],
  'Buenos Aires': [['Avellaneda', 8], ['Vicente López', 12], ['Quilmes', 20], ['San Isidro', 22], ['Morón', 25], ['Tigre', 32], ['La Plata', 56], ['Luján', 68], ['Zárate', 90], ['San Nicolás', 230]],
};
const ANG = { Funes: 270, 'Granadero Baigorria': 20, 'Villa Gobernador Gálvez': 160, 'Pérez': 220, 'San Lorenzo': 10, 'Arroyo Seco': 150, 'Cañada de Gómez': 280, 'Villa Constitución': 140, Casilda: 225, 'San Nicolás': 130, Coronda: 345, Pergamino: 165, 'Santa Fe': 355, 'Paraná': 15, 'Venado Tuerto': 235,
  Avellaneda: 120, 'Vicente López': 330, Quilmes: 135, 'San Isidro': 320, 'Morón': 250, Tigre: 315, 'La Plata': 140, 'Luján': 275, 'Zárate': 310 };
const KMS = [30, 60, 100, 200];
const zonaDe = (ciudad, km) => [ciudad].concat((ALREDEDOR[ciudad] || []).filter(p => p[1] <= km).map(p => p[0]));
function radar(ciudad, km) {
  const W = 300, c = W / 2, k = 130 / 200, r = km * k;
  const dots = (ALREDEDOR[ciudad] || []).filter(p => p[1] <= 200).map(([n, d]) => {
    const a = ((ANG[n] || 0) - 90) * Math.PI / 180, x = c + Math.cos(a) * d * k, y = c + Math.sin(a) * d * k, den = d <= km;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${den ? 4 : 3}" fill="${den ? 'var(--fuerte)' : 'none'}" stroke="var(--g3)"/>${den || d < 120 ? `<text x="${(x + 6).toFixed(1)}" y="${(y + 3).toFixed(1)}">${n.length > 14 ? n.split(' ')[0] : n}</text>` : ''}`;
  }).join('');
  return `<svg class="radar" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}" role="img" aria-label="Tu zona: ${km} km alrededor de ${esc(ciudad)}">
    <circle cx="${c}" cy="${c}" r="${r}" fill="var(--g1)" stroke="var(--fuerte)" stroke-width="1.5"/>${dots}
    <circle cx="${c}" cy="${c}" r="6" fill="var(--fuerte)"/><text x="${c + 9}" y="${c - 8}" style="font-weight:700;fill:var(--fg)">${esc(ciudad)}</text></svg>`;
}
function pueblosTxt(ciudad, km) {
  const l = (ALREDEDOR[ciudad] || []).filter(p => p[1] <= km).sort((a, b) => a[1] - b[1]).map(p => p[0]);
  if (!l.length) return `${esc(ciudad)} y lo que esté a menos de ${km} km.`;
  return `${esc(ciudad)}, ${l.slice(0, 5).join(', ')}${l.length > 5 ? ` y ${l.length - 5} más` : ''}.`;
}

// Primer uso (ticket 33, D)
const PARECIDOS = {
  emapm: ['ligas','bestia','winona','r21'], bandalos: ['louta','r0','r23','cypa'], juana: ['espil','chancha','r1','r30'],
  usted: ['ligas','winona','r11','r17'], cypa: ['wos','r3','r19','louta'], babasonicos: ['marilina','r20','r34','fito'],
  espil: ['r1','r25','juana','r30'], cebra: ['patane','r12','bestia','r15'], wos: ['cypa','r3','r19','r4'],
  fito: ['r32','r33','babasonicos','r20'], perotti: ['r8','r35','r34','marilina'], chancha: ['r1','juana','r5','r29'],
  ligas: ['bestia','winona','r21','r22'], marilina: ['patane','r2','r8','cebra'],
};
const parecidosDe = a => (PARECIDOS[a] || ['r' + (a.length * 3 % 36), 'r' + (a.length * 5 % 36), 'r' + (a.length * 7 % 36)]).filter(x => M.artistas[x]);
const FECHAS_ZONA = { espil: 9, cebra: 8, perotti: 7, invencible: 6, usted: 6, chancha: 5, ligas: 5, juana: 4, emapm: 4, bestia: 4, patane: 4, winona: 3, bandalos: 2, cypa: 2, babasonicos: 1, wos: 1, fito: 1, fierro: 0 };
const ARRANQUE_D = Object.keys(FECHAS_ZONA).sort((a, b) => FECHAS_ZONA[b] - FECHAS_ZONA[a]);
const TIPOS = [
  ['nuevas', 'Fechas nuevas', 'Cuando uno de tus artistas anuncia una fecha en tu zona.'],
  ['cambios', 'Cambios en lo que marcaste', 'Si cambia el día o el lugar, o se suspende una fecha que marcaste Voy o Me interesa.'],
  ['entradas', 'Salen las entradas', 'Cuando empiezan a vender una fecha que marcaste Voy o Me interesa.'],
  ['recordatorio', 'Recordatorio', 'Una semana antes de lo que marcaste.'],
  ['agotado', 'Se agotó', 'Si se agotan las entradas de algo que marcaste Me interesa.'],
];

// ---------- estado (se guarda en sessionStorage; se resetea al entrar a una tarea) ----------
const CLAVE = 'tocan-prueba';
function estadoBase() {
  const alcance = {}; Object.keys(M.artistas).forEach(k => alcance[k] = M.artistas[k].alcance || 'cerca');
  return {
    modo: 'app', bloqueo: null, tk: null,
    tab: 'inicio', pilas: { inicio: [], agenda: [], artistas: [] }, scroll: {},
    nombre: 'Lucía', zona: { ciudad: 'Rosario', prov: 'Santa Fe', km: 60 },
    sigue: new Set(SIGUE_LUCIA), marca: { ...MARCAS_INI }, sacadas: new Set(), visto: new Set(), alcance,
    hist: null, primeraVez: false, avisos: 'si', google: true,
    tipos: Object.fromEntries(TIPOS.map(t => [t[0], true])), silencio: true, desdeH: 0, hastaH: 9, plan: 'mes',
    q: '', filtro: 'todo', mes: '2026-11', dia: HOY, fuiAbierto: false, asomo: false, pu: null,
  };
}
function puBase() {
  return { paso: 'bienvenida', dir: 0, ciudad: null, prov: null, km: 60, qZona: '', q: '', sigue: new Set(), abiertos: [], avisos: null, google: null, cuentaPrevia: false, soloSeguidos: false };
}
function tarea(n) {
  const s = estadoBase();
  if (n === '1') { s.modo = 'primer'; s.pu = puBase(); }
  if (n === '2') { s.modo = 'bloqueo'; s.bloqueo = 'f2'; }
  if (n === '3') { s.modo = 'bloqueo'; s.bloqueo = 'resumen'; }
  return s; // 4, 5 y explorar: el Inicio de Lucía
}
const reemplazo = (k, v) => v instanceof Set ? { __set: [...v] } : v;
const revivir = (k, v) => v && typeof v === 'object' && Array.isArray(v.__set) ? new Set(v.__set) : v;
function guardar() { try { sessionStorage.setItem(CLAVE, JSON.stringify(S, reemplazo)); } catch (_) {} }
function cargar() { try { const t = sessionStorage.getItem(CLAVE); return t ? JSON.parse(t, revivir) : null; } catch (_) { return null; } }

let S;
const q0 = new URLSearchParams(location.search).get('tarea');
if (q0) { S = tarea(q0); guardar(); try { history.replaceState(null, '', location.pathname); } catch (_) {} }
else S = cargar() || estadoBase();
// Lo que no se guarda: hojas, avisos chicos, permisos.
const T = { hoja: null, toast: null, permiso: false, pendiente: null, ctx: null, eligiendo: null, qCiudad: '', scrollA: null, dirPu: 0 };

const sigo = a => S.sigue.has(a);
const pila = () => S.pilas[S.tab];
const tope = () => pila()[pila().length - 1];
const zonaActual = () => zonaDe(S.zona.ciudad, S.zona.km);
const cerca = f => zonaActual().includes(f.ciudad);
const NOMBRE_TAB = { inicio: 'Inicio', agenda: 'Agenda', artistas: 'Artistas' };

let toastT;
function toast(txt, undo) {
  T.toast = { txt, undo }; clearTimeout(toastT);
  toastT = setTimeout(function fin() { if (document.activeElement && document.activeElement.closest('.toast')) { toastT = setTimeout(fin, 1000); return; } T.toast = null; dibujarCapa(); }, 5000);
}
const noEsta = () => toast(NO_ESTA);

// ---------- piezas ----------
function fotoA(a, cls = '') {
  const A = M.artistas[a];
  if (A.foto) return `<div class="foto ${cls}" role="img" aria-label="Foto de ${esc(A.nombre)}"></div>`;
  const ang = (A.nombre.length * 37) % 180;
  return `<div class="foto sin ${cls}" style="--ang:${ang}deg" role="img" aria-label="${esc(A.nombre)}, sin foto">${ini(A.nombre)}</div>`;
}
const fotoI = (i, cls = '') => i.tipo === 'promo' ? `<div class="foto promo ${cls}" aria-hidden="true"></div>` : fotoA(i.artista, cls);
const yoBtn = () => `<button class="yo" data-act="abrir-vos" aria-label="Vos: tu zona, avisos y cuenta">${S.nombre ? esc(S.nombre.slice(0, 2)) : ''}</button>`;
const cuandoVenta = d => { const [dia, hora] = d.split(', '); return `el ${dia} a las ${hora}`; };
const estrella = on => `<span aria-hidden="true">${on ? '★' : '☆'}</span> `;
function estadoEntradas(f) {
  const e = f.entradas || {};
  if (f.pasada) return 'Fuiste';
  if (f.agotado) return 'Agotada';
  if (e.url) return 'Entradas en ' + TICKETERAS[e.url];
  if (e.desde) return 'Las entradas salen el ' + e.desde;
  return 'Entradas en la puerta';
}
function volverTxt() {
  const p = pila(), prev = p[p.length - 2];
  if (!prev) return NOMBRE_TAB[S.tab];
  if (prev.t === 'vos') return 'Vos';
  if (prev.t === 'artista') return 'Artista';
  return 'Fecha';
}
function empujar(x) { pila().push(x); delete S.scroll[claveVista()]; }

// ================= INICIO (ticket 30, D) =================
const fechasInicio = () => FECHAS.filter(f => !f.pasada && !f.sinUbicar && cerca(f) && sigo(f.artista));
const anunciosInicio = () => ANUNCIOS.filter(a => sigo(a.artista) && !S.sacadas.has(a.id));
const esNueva = i => !S.primeraVez && i.nuevo && !S.visto.has(i.id) && !S.sacadas.has(i.id);
const prio = i => { const k = PRIMERO.indexOf(i.id); return k < 0 ? 99 : k; };
const nuevas = () => S.primeraVez ? [] : [...fechasInicio(), ...anunciosInicio()].filter(esNueva).sort((a, b) => prio(a) - prio(b) || b.publicado.localeCompare(a.publicado));
const proximas = () => [...fechasInicio().filter(f => !S.sacadas.has(f.id)), ...PROMO].sort((a, b) => a.fecha.localeCompare(b.fecha));
const lugarI = i => esc(i.lugar) + (i.ciudad && i.ciudad !== S.zona.ciudad ? ' · ' + esc(i.ciudad) : '');
const cuandoI = i => corto(i.fecha) + (i.hasta ? ' al ' + corto(i.hasta) : '') + (i.hora ? ' · ' + i.hora : '');
function etqs(i) {
  const c = [], m = S.marca[i.id];
  if (m === 'voy') c.push('<span class="etq fuerte">Voy</span>');
  if (m === 'interesa') c.push('<span class="etq fuerte">Me interesa</span>');
  if (i.agotado) c.push('<span class="etq">Agotado</span>');
  if (i.gratis) c.push('<span class="etq">Gratis</span>');
  if (i.tipo === 'fecha' && !i.entradas.url && !i.entradas.desde) c.push('<span class="etq">Entrada en puerta</span>');
  if (i.duplicadoDe) c.push('<span class="etq">¿Es la misma que otra?</span>');
  if (i.tipo === 'promo') c.push('<span class="etq promo">Promocionado</span>');
  return c.length ? `<div class="etqs">${c.join('')}</div>` : '';
}
const notaCambio = i => i.corregida ? `<div class="nota-c">Cambió el día: era el ${esc(i.corregida.antes.replace(/^\S+ /, ''))}, ahora es el ${esc(i.corregida.ahora.replace(/^\S+ /, ''))}</div>` : '';
function filaLista(i) {
  const nueva = esNueva(i);
  const det = (i.hora ? i.hora + ' · ' : '') + lugarI(i) + (i.detalle ? ' · ' + esc(i.detalle) : '');
  const inner = `<div class="fi ${nueva ? 'nueva' : ''}" role="button" tabindex="0" data-act="abrir" data-id="${i.id}"><span class="punto" style="${nueva ? '' : 'visibility:hidden'}"></span>${fotoI(i)}<div class="txt">
      <div class="nom">${esc(nombreI(i))}</div><div class="det">${det}</div>${notaCambio(i)}${etqs(i)}</div></div>`;
  if (i.tipo !== 'fecha') return inner;
  return `<div class="desl" data-id="${i.id}" data-tipo="inicio"><div class="fondo" aria-hidden="true"><span class="d">★ Me interesa</span><span class="i">No me interesa ✕</span></div><div class="frente">${inner}</div></div>`;
}
function listaPorDia(items) {
  if (!items.length) return `<div class="tranqui">Por ahora tus artistas no tienen fechas en ${esc(S.zona.ciudad)} y alrededores. Cuando anuncien una, te avisamos.</div>`;
  let h = '<div class="lista">', mes = mesDe(HOY), dia = '';
  items.forEach(i => {
    const m = mesDe(i.fecha);
    if (m !== mes) { h += `<div class="mes-sep">${m}</div>`; mes = m; }
    if (i.fecha !== dia) { h += `<div class="dia">${diaLargo(i.fecha)}</div>`; dia = i.fecha; }
    h += filaLista(i);
  });
  return h + '</div>';
}
const topInicio = () => `<div class="top"><div class="tit"><h2>Inicio</h2><small>${esc(S.zona.ciudad)} y ${S.zona.km} km</small></div>${yoBtn()}</div>`;
function franjas() {
  if (S.avisos === 'no') return `<div class="franja"><b>Los avisos están apagados.</b>Sin avisos, para enterarte tenés que entrar a mirar.<button class="btn borde" data-act="pedir-avisos">Activar avisos</button></div>`;
  if (S.avisos === 'bloqueado') return `<div class="franja"><b>Bloqueaste los avisos en el navegador.</b>Para recibirlos, permitilos en los ajustes del navegador para este sitio.<button class="link" data-act="no-esta">Cómo se hace</button></div>`;
  return '';
}
// Botones de una historia. El botón lleno es siempre sobre las entradas (ticket 31).
function accionesHist(i) {
  if (i.tipo === 'anuncio') return `<div class="acciones"><button class="btn borde" data-act="artista" data-a="${i.artista}">Ver artista</button><button class="btn ico" data-act="mas" data-id="${i.id}" aria-label="Más acciones">⋯</button></div>`;
  const m = S.marca[i.id], e = i.entradas;
  let prim = '', estado = '';
  if (i.agotado) estado = 'Se agotaron las entradas.';
  else if (e.url) prim = `<button class="btn lleno" data-act="entradas" data-id="${i.id}">Entradas · ${TICKETERAS[e.url]}</button>`;
  else if (e.desde) { if (m) estado = `<b>Te avisamos ${cuandoVenta(esc(e.desde))}</b>, cuando salgan las entradas.`; else prim = `<button class="btn lleno" data-act="interesa-fuerte" data-id="${i.id}">${estrella(false)}Me interesa · te avisamos cuando salgan</button>`; }
  else estado = 'Entradas en la puerta: no hay venta anticipada.';
  return `${estado ? `<p class="estado">${estado}</p>` : ''}<div class="acciones">${prim}
    <button class="btn" data-act="voy" data-id="${i.id}" aria-pressed="${m === 'voy'}">Voy</button>
    <button class="btn" data-act="interesa" data-id="${i.id}" aria-pressed="${m === 'interesa'}">${estrella(m === 'interesa')}Me interesa</button>
    <button class="btn ico" data-act="mas" data-id="${i.id}" aria-label="Más acciones">⋯</button></div>`;
}
let histPausaVisual = false;
function vistaInicio() {
  if (!S.sigue.size) return `${topInicio()}${franjas()}<div class="sec"><div class="vacio"><b>Todavía no seguís a nadie.</b>Seguí a tus artistas y acá vas a ver sus fechas cerca de ${esc(S.zona.ciudad)}.<button class="btn lleno" data-act="tab" data-t="artistas">Buscar artistas</button></div></div>`;
  if (S.primeraVez) {
    const fs = proximas().filter(i => i.tipo === 'fecha'), n = S.sigue.size;
    if (!fs.length) return `${topInicio()}${franjas()}<div class="sec"><div class="vacio"><b>${n === 1 ? 'Tu artista no tiene' : `Tus ${n} artistas no tienen`} fechas anunciadas cerca de ${esc(S.zona.ciudad)} por ahora.</b>Ya los estamos mirando. Cuando anuncien una, aparece acá${S.avisos === 'si' ? ' y te llega un aviso' : ''}.<button class="btn borde" data-act="tab" data-t="artistas">Sumar más artistas</button></div></div>`;
    return `${topInicio()}${franjas()}<div class="franja hueco">Ya estamos mirando a ${n === 1 ? 'tu artista' : `tus ${n} artistas`}. Cuando anuncien algo nuevo, aparece acá arriba${S.avisos === 'si' ? ' y te llega un aviso' : ''}.</div>
      <div class="isec"><div class="sec-tit"><h3>Ya anunciado cerca de ${esc(S.zona.ciudad)}</h3></div>${listaPorDia(fs)}</div><div style="height:24px"></div>`;
  }
  if (!S.hist) S.hist = { ids: nuevas().map(i => i.id), i: 0, pausa: false };
  const l = S.hist.ids.filter(x => !S.sacadas.has(x) && porId(x));
  if (S.hist.i > l.length - 1) S.hist.i = Math.max(0, l.length - 1);
  const i = porId(l[S.hist.i]), ultima = S.hist.i === l.length - 1;
  let bloque;
  const vioAlgo = [...FECHAS, ...ANUNCIOS].some(x => x.nuevo && S.visto.has(x.id));
  if (!i) bloque = `<div class="isec">${vioAlgo ? `<div class="tranqui">Viste lo nuevo de esta semana. <button class="link" data-act="hist-otra">Ver otra vez</button></div>` : `<div class="tranqui">Nada nuevo desde el martes. Seguimos mirando a tus ${S.sigue.size} artistas.</div>`}</div>`;
  else {
    const pausa = S.hist.pausa || REDUCIR;
    const abre = i.tipo === 'anuncio' ? `data-act="artista" data-a="${i.artista}"` : `data-act="abrir" data-id="${i.id}"`;
    const det = i.tipo === 'anuncio' ? `${esc(i.texto)} · sin fecha todavía` : `${cuandoI(i)} · ${lugarI(i)}`;
    bloque = `<div class="pantallazo hist">${fotoI(i, 'gigante')}
      <div class="barras" aria-hidden="true">${l.map((x, k) => `<span class="${k < S.hist.i ? 'llena' : k === S.hist.i ? 'actual' + (S.hist.pausa ? ' pausa' : '') : ''}"><i></i></span>`).join('')}</div>
      <div class="hist-cab"><span><b>Nuevo</b> · ${haceCuanto(i.publicado)}</span><button class="pausa-btn" data-act="hist-pausa">${pausa ? '▶ Seguir' : '❚❚ Pausa'}</button></div>
      <button class="hz izq" data-act="hist-ant" aria-label="Anterior"></button><button class="hz der" data-act="hist-sig" aria-label="Siguiente"></button>
      <div class="hist-pie"><button class="abre" ${abre}><div class="txt"><div class="nom">${esc(nombreI(i))}</div><div class="det">${det}</div></div><span class="chev" aria-hidden="true">›</span></button>${notaCambio(i)}${etqs(i)}${accionesHist(i)}</div>
      <div class="bajar">${ultima ? 'Es la última novedad · ' : ''}Lo que se viene ↓</div></div>`;
  }
  const anun = anunciosInicio();
  const secAnun = anun.length ? `<div class="isec"><div class="sec-tit"><h3>Anunciados, sin fecha todavía</h3></div><div class="lista">${anun.map(a => `<div class="fi" role="button" tabindex="0" data-act="artista" data-a="${a.artista}">${fotoA(a.artista)}<div class="txt"><div class="nom">${esc(nomA(a.artista))}</div><div class="det">${esc(a.texto)}</div><div class="nota-c" style="color:var(--muted)">Te avisamos cuando haya fecha.</div></div></div>`).join('')}</div></div>` : '';
  return `${topInicio()}${franjas()}${bloque}<div class="isec"><div class="sec-tit"><h3>Lo que se viene cerca tuyo</h3></div>${listaPorDia(proximas())}</div>${secAnun}<div style="height:24px"></div>`;
}

// ================= LA FECHA (ticket 31, E) =================
function accionesE(f) {
  const e = f.entradas, m = S.marca[f.id];
  let estado = '', prim = '';
  if (f.agotado) estado = `Se agotaron las entradas. <button class="link" data-act="entradas" data-id="${f.id}">Ver en ${TICKETERAS[e.url]}</button>`;
  else if (e.url) prim = `<button class="btn lleno ancho" data-act="entradas" data-id="${f.id}">Entradas · ${TICKETERAS[e.url]}</button>`;
  else if (e.desde) {
    const cs = cuandoVenta(esc(e.desde));
    if (m) estado = `<b>Te avisamos ${cs}</b>, cuando salgan las entradas. Lo marcaste ${m === 'voy' ? 'Voy' : 'Me interesa'}.`;
    else { estado = `Las entradas salen ${cs}.`; prim = `<button class="btn lleno ancho" data-act="interesa-fuerte" data-id="${f.id}">${estrella(false)}Me interesa · te avisamos cuando salgan</button>`; }
  } else estado = 'Entradas en la puerta: no hay venta anticipada.';
  const marcas = `<button class="btn" data-act="voy" data-id="${f.id}" aria-pressed="${m === 'voy'}">Voy</button><button class="btn" data-act="interesa" data-id="${f.id}" aria-pressed="${m === 'interesa'}">${estrella(m === 'interesa')}Me interesa</button>`;
  return (estado ? `<p class="estadoE">${estado}</p>` : '') + prim + `<div class="fila-btns">${marcas}</div><div class="secE"><button class="btn" data-act="no-esta">Compartir</button><button class="btn" data-act="no-esta">Calendario</button></div>`;
}
function vistaFecha(f) {
  const alto = $('contenido').clientHeight;
  const cambio = f.corregida ? `<div class="cambio-l"><b>Cambió el día:</b> era el <s>${esc(f.corregida.antes)}</s>. <button class="link" data-act="ir-post">Lo corrigió en su post</button>.</div>` : '';
  const donde = f.sinUbicar ? esc(f.lugar) + ' · no sabemos la ciudad' : esc(f.lugar) + ', ' + esc(f.ciudad);
  return `<div class="pantE" style="height:${Math.max(420, alto - 56)}px">${fotoA(f.artista, 'gigante')}<button class="foto-btn" data-act="artista" data-a="${f.artista}" aria-label="Ver la página de ${esc(nomA(f.artista))}"></button>
      <div class="tapaE"><button class="chip-e" data-act="volver">‹ ${esc(volverTxt())}</button><button class="chip-e" data-act="mas" data-id="${f.id}">Más</button></div>
      <div class="tarjE"><div><h1><button class="nombre-btn" data-act="artista" data-a="${f.artista}">${esc(nombreI(f))}</button></h1>
        <div class="dato" style="margin-top:4px"><b>${cap(largo(f.fecha))}${f.hora ? ', ' + f.hora : ''}</b><span>${donde}</span></div>${cambio}</div>
        ${accionesE(f)}</div></div>
    <div class="restoE" id="post-e"><p class="tit-sec">De dónde salió</p><div class="post"><div class="cab"><span class="av"></span><span class="h">${slug(nomA(f.artista))}</span><small>${corto(f.publicado)}</small></div><div class="flyer" aria-hidden="true"></div><div class="cita">${esc(f.cita)}</div></div></div>`;
}

// ================= EL ARTISTA (ticket 32, E) =================
function diab(f) { const d = parse(f.fecha); return `<div class="diab"><small>${DIAS[d.getDay()]} · ${MESES[d.getMonth()].slice(0, 3)}</small><b>${d.getDate()}</b></div>`; }
const marcaTxt = id => ({ voy: '✓ Voy', interesa: '★ Me interesa' })[S.marca[id]] || '';
function fechasDe(a) {
  const todas = FECHAS.filter(f => f.artista === a && !f.pasada && !S.sacadas.has(f.id)).sort((x, y) => x.fecha.localeCompare(y.fecha));
  const pais = S.alcance[a] === 'pais';
  const ve = todas.filter(f => cerca(f) || f.sinUbicar || (pais && f.provincia));
  return { ve, otras: todas.filter(f => !ve.includes(f)), fui: FECHAS.filter(f => f.artista === a && f.pasada && S.marca[f.id] === 'voy') };
}
const anunciosDe = a => M.anuncios.filter(x => x.artista === a);
const proxima = a => fechasDe(a).ve[0];
function filaFecha(f, conArtista) {
  const lugar = f.sinUbicar ? `${esc(f.lugar)} · sin ubicar` : `${esc(f.lugar)}, ${esc(f.ciudad)}`;
  const izq = conArtista ? fotoA(f.artista) : diab(f);
  const tit = conArtista ? esc(nombreI(f)) : cap(largo(f.fecha));
  const det = conArtista ? `${corto(f.fecha)} · ${lugar}` : lugar;
  return `<div class="desl" data-id="${f.id}" data-tipo="fecha"><div class="fondo" aria-hidden="true"><span class="d">★ Me interesa</span><span class="i">No me interesa</span></div>
    <div class="frente"><div class="ff" role="button" tabindex="0" data-act="abrir" data-id="${f.id}">${izq}<div class="txt"><div class="nom">${tit}</div><div class="det">${det}</div><div class="est">${estadoEntradas(f)}</div></div><span class="marca">${marcaTxt(f.id)}</span></div></div></div>`;
}
const botonSeguir = a => sigo(a)
  ? `<button class="btn" data-act="dejar" data-a="${a}" aria-pressed="true">✓ Siguiendo</button>`
  : `<button class="btn borde" data-act="seguir" data-a="${a}">+ Seguir</button>`;
const alcanceCtl = a => sigo(a) ? `<div><p class="nota" style="margin-bottom:6px">Te avisamos de sus fechas:</p><div class="alcance" role="group" aria-label="Alcance">
    <button data-act="alcance" data-a="${a}" data-x="cerca" aria-pressed="${S.alcance[a] === 'cerca'}">Cerca de ${esc(S.zona.ciudad)}</button>
    <button data-act="alcance" data-a="${a}" data-x="pais" aria-pressed="${S.alcance[a] === 'pais'}">En todo el país</button></div></div>` : '';
function vacioArtista(a) {
  const an = anunciosDe(a);
  if (fechasDe(a).otras.length) return `<div class="sec"><div class="vacio"><b>Por ahora no tiene fechas cerca de ${esc(S.zona.ciudad)}.</b>${sigo(a) ? 'Si anuncia una, te avisamos.' : 'Si lo seguís, te avisamos cuando anuncie una.'}</div></div>`;
  return `<div class="sec"><div class="vacio"><b>Por ahora no tiene fechas${an.length ? ' con día' : ''}.</b>${sigo(a) ? (an.length ? 'Cuando le ponga día, te avisamos.' : 'Cuando anuncie, te avisamos.') : 'Si lo seguís, te avisamos cuando anuncie.'}</div></div>`;
}
function proxBox(a, p, total) {
  const zona = S.alcance[a] === 'pais' && sigo(a) ? 'en el país' : 'en tu zona';
  return `<div class="prox"><div class="linea1" role="button" tabindex="0" data-act="abrir" data-id="${p.id}">${diab(p)}<div style="flex:1;min-width:0"><b>${total > 1 ? 'Próxima' : 'Su fecha'} ${zona}</b><div class="nota">${esc(p.lugar)}, ${esc(p.ciudad || '')}</div></div><span class="marca" style="font-size:.78rem;font-weight:600">${marcaTxt(p.id)}</span></div>
    ${p.entradas.url && !p.agotado ? `<button class="btn lleno ancho" data-act="entradas" data-id="${p.id}">Entradas · ${TICKETERAS[p.entradas.url]}</button>` : `<p class="nota">${estadoEntradas(p)}</p>`}</div>`;
}
function vistaArtista(a) {
  const A = M.artistas[a], { ve, otras, fui } = fechasDe(a), p = ve[0], resto = ve.slice(1), alc = alcanceCtl(a);
  const an = anunciosDe(a).map(x => `<div class="anuncio"><b>Anunció, todavía sin fecha:</b> ${esc(x.texto)}.</div>`).join('');
  const fuiH = fui.length ? `<div class="fui"><span class="tit-sec">Fuiste</span>${fui.map(f => `<span>${corto(f.fecha)}/${parse(f.fecha).getFullYear() % 100} · ${esc(f.lugar)}</span>`).join('')}</div>` : '';
  return `<div class="top"><button class="volver" data-act="volver">‹ ${esc(volverTxt())}</button><div class="tit"></div><button class="btn" data-act="no-esta">Compartir</button></div>
    <div class="cabC">${fotoA(a)}<div class="txt"><h1>${esc(A.nombre)}</h1><div>${botonSeguir(a)}</div></div></div>
    ${alc ? `<div class="sec" style="padding-top:0">${alc}</div>` : ''}
    ${p ? `<div class="sec" style="padding-top:0">${proxBox(a, p, ve.length)}</div>` : vacioArtista(a)}
    ${resto.length ? `<div class="sec" style="padding-bottom:4px"><p class="tit-sec">Más fechas ${S.alcance[a] === 'pais' && sigo(a) ? 'en el país' : 'en tu zona'}</p></div>${resto.map(f => filaFecha(f)).join('')}` : ''}
    ${otras.length ? `<div class="otras-zonas">Tiene ${otras.length} ${otras.length === 1 ? 'fecha' : 'fechas'} en otras zonas. <button class="link" data-act="otras-zonas" data-a="${a}">Sumar zonas</button></div>` : ''}
    ${an || fuiH ? `<div class="sec">${an}${fuiH}</div>` : ''}
    <div class="sos">¿Sos ${esc(A.nombre)} o de su equipo? <button class="link" data-act="no-esta">Pedí sacar la foto o no aparecer</button></div>`;
}

// ================= AGENDA (ticket 32, E2) =================
const marcadas = () => FECHAS.filter(f => !f.pasada && S.marca[f.id] && !S.sacadas.has(f.id) && (S.filtro === 'todo' || S.marca[f.id] === S.filtro)).sort((x, y) => x.fecha.localeCompare(y.fecha));
const fuiLista = () => FECHAS.filter(f => f.pasada && S.marca[f.id] === 'voy').sort((x, y) => y.fecha.localeCompare(x.fecha));
const MES_MIN = '2026-11', MES_MAX = '2027-03';
function grilla(lista) {
  const [y, m] = S.mes.split('-').map(Number);
  const prim = new Date(y, m - 1, 1), offset = (prim.getDay() + 6) % 7, dias = new Date(y, m, 0).getDate();
  const porDia = {}; lista.forEach(f => (porDia[f.fecha] = porDia[f.fecha] || []).push(f));
  let celdas = ['lun','mar','mié','jue','vie','sáb','dom'].map(d => `<div class="cab">${d}</div>`).join('');
  for (let i = 0; i < offset; i++) celdas += `<div class="d otro"></div>`;
  for (let d = 1; d <= dias; d++) {
    const k = iso(new Date(y, m - 1, d)), fs = porDia[k] || [];
    const pts = fs.slice(0, 3).map(f => `<span class="pt ${S.marca[f.id] === 'interesa' ? 'int' : ''}"></span>`).join('');
    const lab = `${k === HOY ? 'Hoy, ' : ''}${largo(k)}${fs.length ? ': ' + fs.map(f => nombreI(f) + (S.marca[f.id] === 'voy' ? ', Voy' : ', Me interesa')).join('; ') : ''}`;
    celdas += `<button class="d ${k < HOY ? 'pasado' : ''} ${k === HOY ? 'hoy' : ''}" data-act="dia-salta" data-x="${k}" aria-pressed="${S.dia === k}" aria-label="${esc(lab)}"><span>${d}</span><span class="puntos">${pts}</span></button>`;
  }
  return `<div class="mes-nav"><button data-act="mes" data-x="-1" aria-label="Mes anterior" ${S.mes <= MES_MIN ? 'disabled' : ''}>‹</button><b>${MESES[m - 1]} ${y}</b><button data-act="mes" data-x="1" aria-label="Mes siguiente" ${S.mes >= MES_MAX ? 'disabled' : ''}>›</button></div>
    <div class="grilla">${celdas}</div>
    <div class="leyenda"><span><span class="pt"></span>Voy</span><span><span class="pt int"></span>Me interesa</span></div>`;
}
function filaFechaAgenda(f, tipo) {
  const fondo = tipo === 'agenda' ? '<span class="d"></span><span class="i">Quitar de la agenda</span>' : '<span class="d"></span><span class="i"></span>';
  return `<div class="desl" data-id="${f.id}" data-tipo="${tipo}"><div class="fondo" aria-hidden="true">${fondo}</div>
    <div class="frente"><div class="ff" role="button" tabindex="0" data-act="abrir" data-id="${f.id}">${diab(f)}${fotoA(f.artista, 'chica')}<div class="txt"><div class="nom">${esc(nombreI(f))}</div><div class="det">${esc(f.lugar)}, ${esc(f.ciudad)}</div><div class="est">${estadoEntradas(f)}</div></div><span class="marca">${marcaTxt(f.id)}</span></div></div></div>`;
}
function porMes(l) {
  let h = '', mes = '', dia = '';
  l.forEach(f => { const k = f.fecha.slice(0, 7); if (k !== mes) { mes = k; const d = parse(f.fecha); h += `<div class="mes-h">${MESES[d.getMonth()]} ${d.getFullYear()}</div>`; }
    if (f.fecha !== dia) { dia = f.fecha; h += `<span id="d-${f.fecha}" class="ancla"></span>`; }
    h += filaFechaAgenda(f, 'agenda'); });
  return h;
}
function vistaAgenda() {
  const l = marcadas();
  const filtros = `<div class="filtros" role="group" aria-label="Filtro">${[['todo','Todo'],['voy','Voy'],['interesa','Me interesa']].map(([k, t]) => `<button class="btn" data-act="filtro" data-x="${k}" aria-pressed="${S.filtro === k}">${t}</button>`).join('')}</div>`;
  const fl = fuiLista();
  const fui = fl.length ? `<div class="fui-pie"><button class="btn" data-act="fui" aria-expanded="${S.fuiAbierto}">A las que fui (${fl.length}) ${S.fuiAbierto ? '▴' : '▾'}</button></div>${S.fuiAbierto ? fl.map(f => filaFechaAgenda(f, 'pasada')).join('') : ''}` : '';
  const top = `<div class="top"><div class="tit"><h2>Agenda</h2></div>${yoBtn()}</div>`;
  if (!l.length) {
    const vac = S.filtro === 'todo' ? `<div class="sec"><div class="vacio"><b>Todavía no marcaste ninguna fecha.</b>Cuando en una fecha toques Voy o Me interesa, aparece acá. Te recordamos una semana antes.<button class="btn" data-act="tab" data-t="inicio">Ver lo que viene en el Inicio</button></div></div>`
      : `<div class="sec"><div class="vacio"><b>No marcaste ninguna fecha con ${S.filtro === 'voy' ? 'Voy' : 'Me interesa'}.</b><button class="btn" data-act="filtro" data-x="todo">Ver todo</button></div></div>`;
    return `${top}${filtros}${vac}${fui}`;
  }
  return `${top}${filtros}${grilla(l)}<div class="dia-tit">Todo lo que viene</div>${porMes(l)}${fui}<div style="height:24px"></div>`;
}

// ================= ARTISTAS (ticket 32, E) =================
const listaSeguidos = () => [...S.sigue].filter(a => M.artistas[a]).sort((x, y) => sinTilde(nomA(x)).localeCompare(sinTilde(nomA(y))));
function filaArtista(a, enResultados) {
  const p = proxima(a), n = fechasDe(a).ve.length, an = anunciosDe(a).length;
  const seg = p ? `${corto(p.fecha)} · ${esc(p.ciudad || p.lugar)}${n > 1 ? ` · y ${n - 1} más` : ''}` : an ? 'Anunció, todavía sin fecha' : 'Sin fechas en tu zona';
  const btn = enResultados ? botonSeguir(a).replace('class="btn', 'class="btn seguir') : '';
  const inner = `<div class="ff" role="button" tabindex="0" data-act="artista" data-a="${a}">${fotoA(a, 'red chica')}<div class="txt"><div class="nom">${esc(nomA(a))}</div><div class="det">${sigo(a) ? seg : (p ? seg : 'No lo seguís')}</div></div>${btn}</div>`;
  if (!sigo(a) || enResultados) return `<div class="desl">${inner}</div>`;
  return `<div class="desl" data-id="${a}" data-tipo="artista"><div class="fondo" aria-hidden="true"><span class="d"></span><span class="i">Dejar de seguir</span></div><div class="frente">${inner}</div></div>`;
}
function cuenta() {
  const n = S.sigue.size;
  return `<div class="cuenta" role="status"><span>Seguís a <b>${n} de ${LIMITE}</b> gratis.</span>${n >= LIMITE - 1 ? '<button class="link" data-act="banca-general">Con Bancá la app, sin límite</button>' : ''}</div>`;
}
const buscador = () => `<div class="buscador"><input type="search" id="q" placeholder="Buscar un artista" value="${esc(S.q)}" aria-label="Buscar un artista" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></div>`;
function resultados() {
  const q = sinTilde(S.q.trim());
  const emp = k => sinTilde(nomA(k)).startsWith(q) ? 0 : 1;
  const r = Object.keys(M.artistas).filter(k => sinTilde(nomA(k)).includes(q)).sort((x, y) => (emp(x) - emp(y)) || nomA(x).localeCompare(nomA(y))).slice(0, 30);
  if (!r.length) return `<div class="sec"><div class="vacio"><b>No encontramos "${esc(S.q)}".</b>Si es un artista que anuncia sus fechas en redes, proponelo y lo sumamos.<button class="btn borde" data-act="proponer">Proponer "${esc(S.q)}"</button></div></div>`;
  return `${cuenta()}<div class="sec" style="padding-bottom:4px"><p class="tit-sec">Resultados</p></div>${r.map(a => filaArtista(a, true)).join('')}<div class="sec"><p class="nota">¿No está? <button class="link" data-act="proponer">Proponelo</button></p></div>`;
}
function vistaArtistas() {
  const top = `<div class="top"><div class="tit"><h2>Artistas</h2></div>${yoBtn()}</div>`;
  const sumar = `<div class="sumar"><button class="btn suave" data-act="no-esta">Importar de Spotify</button><button class="btn suave" data-act="proponer">Proponer un artista</button></div>`;
  if (S.q.trim()) return `${top}${buscador()}${resultados()}`;
  const l = listaSeguidos();
  if (!l.length) return `${top}${buscador()}<div class="sec"><div class="vacio"><b>Todavía no seguís a nadie.</b>Buscá a tus artistas y te avisamos cuando anuncien una fecha cerca tuyo.</div></div>`;
  const proxCerca = a => fechasDe(a).ve.find(f => cerca(f));
  const conFecha = l.filter(a => proxCerca(a)).sort((x, y) => proxCerca(x).fecha.localeCompare(proxCerca(y).fecha));
  let cuerpo = '', ult = '';
  const letras = [];
  l.forEach(a => { const L = sinTilde(nomA(a))[0].toUpperCase().replace(/[0-9]/, '#'); if (L !== ult) { ult = L; letras.push(L); cuerpo += `<div class="letra" id="L-${L}">${L}</div>`; } cuerpo += filaArtista(a); });
  const indice = `<div class="indice oculto" id="indice" aria-label="Saltar a una letra">${letras.map(L => `<button data-act="letra" data-x="${L}">${L}</button>`).join('')}</div>`;
  return `<div class="con-indice">${top}${buscador()}${cuenta()}${sumar}
    ${conFecha.length ? `<div class="sec" style="padding-bottom:0"><p class="tit-sec">Tocan pronto cerca tuyo</p></div><div class="caras">${conFecha.map(a => `<button class="cara" data-act="artista" data-a="${a}">${fotoA(a)}<span>${esc(nomA(a))}</span><small>${corto(proxCerca(a).fecha)}</small></button>`).join('')}</div>` : ''}
    <div class="sec" style="padding-bottom:4px" id="todos"><p class="tit-sec">Todos (${l.length})</p></div>${cuerpo}<div style="height:24px"></div></div>${indice}`;
}

// ================= VOS (ticket 34, D) =================
const porqueTxt = '<b>Tocan la hace un fan</b>, sin publicidad ni venta de datos. La bancan los que la usan.';
const VIENE = [['Avisos extra', 'Todavía estamos viendo cuáles.'], ['Un resumen por semana', 'Lo que anunciaron tus artistas, todo junto.'], ['Tus fechas en tu calendario, solas', 'Lo que marcás Voy aparece en tu calendario sin que hagas nada.'], ['Historial', 'Todas las fechas a las que fuiste.']];
const vieneLista = () => `<ul class="suma viene">${VIENE.map(([t, d]) => `<li><div><b>${t}</b><small>${d}</small></div></li>`).join('')}</ul>`;
const sumaHoy = () => `<ul class="suma"><li><div><b>Artistas sin límite</b><small>Hoy seguís a ${S.sigue.size} de ${LIMITE} gratis.</small></div></li>
    <li><div><b>Otra zona cercana, para todos tus artistas</b><small>Por ejemplo, ${esc(S.zona.ciudad)} y ${S.zona.ciudad === 'Buenos Aires' ? 'Rosario' : 'Buenos Aires'}: te avisamos de lo que anuncien en las dos.</small></div></li></ul>`;
function precioCaja() {
  const mes = S.plan === 'mes';
  return `<div class="precio"><div class="seg" role="group" aria-label="Cada cuánto pagás"><button data-act="plan" data-x="mes" aria-pressed="${mes}">Por mes</button><button data-act="plan" data-x="anio" aria-pressed="${!mes}">Por año</button></div>
    <div class="monto">${pesos(mes ? PRECIO.mes : PRECIO.anio)} <small>${mes ? 'por mes' : 'por año: pagás 10 meses'}</small></div>
    <button class="btn lleno ancho" data-act="no-esta">Bancar por ${pesos(mes ? PRECIO.mes : PRECIO.anio)} ${mes ? 'por mes' : 'por año'}</button></div>`;
}
const bancaEnVos = foco => `<div class="bloque-banca ${foco ? 'resaltado' : ''}" id="bloque-banca"><p class="tit-sec">Bancá la app</p><p style="margin:0">${porqueTxt}</p>${sumaHoy()}
    <details><summary>Lo que viene, sin fecha</summary><div style="padding-top:8px">${vieneLista()}</div></details>${precioCaja()}<p class="nota">El aviso es gratis, siempre. Quien ya usa la app conserva lo que sigue.</p></div>`;
const filaV = (act, t, d) => `<button class="fv" data-act="${act}"><div class="txt"><span class="t">${t}</span>${d ? `<span class="d">${d}</span>` : ''}</div><span class="chev" aria-hidden="true">›</span></button>`;
function avisosDet() {
  if (S.avisos === 'bloqueado') return 'Bloqueados en este navegador';
  if (S.avisos === 'no') return 'Apagados';
  const off = TIPOS.filter(t => !S.tipos[t[0]]).length;
  const base = off === 0 ? 'Todos prendidos' : off === TIPOS.length ? 'Todos apagados' : `${TIPOS.length - off} de ${TIPOS.length} prendidos`;
  return base + (S.silencio ? ` · silencio de ${S.desdeH} a ${S.hastaH} h` : '');
}
function vistaVos(t) {
  return `<div class="top"><button class="volver" data-act="volver">‹ ${esc(volverTxt())}</button><div class="tit"><h2>Vos</h2></div></div>
    <div class="tarjeta-res"><div class="linea"><span class="yo-g" aria-hidden="true">${S.nombre ? esc(S.nombre.slice(0, 2)) : ''}</span><div><b>${S.nombre ? esc(S.nombre) : 'Vos'}</b><span class="s">${esc(S.zona.ciudad)} · ${S.zona.km} km · ${S.sigue.size} de ${LIMITE} artistas</span></div></div></div>
    ${bancaEnVos(t.foco === 'banca')}
    <div class="grupo"><div class="caja">${filaV('sub', 'Tu zona', `${esc(S.zona.ciudad)} · ${S.zona.km} km`).replace('data-act="sub"', 'data-act="sub" data-x="zona"')}${filaV('sub', 'Avisos', avisosDet()).replace('data-act="sub"', 'data-act="sub" data-x="avisos"')}</div></div>
    <div class="grupo"><div class="caja">${filaV('sub', 'Lo que sacaste', S.sacadas.size ? `${S.sacadas.size} ${S.sacadas.size === 1 ? 'fecha' : 'fechas'}` : 'Nada por ahora').replace('data-act="sub"', 'data-act="sub" data-x="sacaste"')}</div><div class="pie-g">Las fechas que marcaste No me interesa, por si te arrepentís.</div></div>
    <div class="grupo"><div class="caja">${filaV('sub', 'Tu cuenta', S.google ? 'Conectada con Google' : 'Sin conectar: tus artistas viven en este teléfono').replace('data-act="sub"', 'data-act="sub" data-x="cuenta"')}${filaV('no-esta', 'Instalar la app', 'Te queda en la pantalla de inicio, como cualquier app')}${filaV('no-esta', 'Privacidad y preguntas', 'No vendemos tus datos')}</div></div>
    <div style="height:28px"></div>`;
}
function elegirCiudad() {
  const q = sinTilde(T.qCiudad.trim());
  const r = (q ? CIUDADES.filter(([c]) => sinTilde(c).includes(q)) : COMUNES.map(c => CIUDADES.find(x => x[0] === c))).slice(0, q ? 6 : 8);
  return `<div class="ciudad-el"><b>¿De dónde sos?</b><button class="link" data-act="cancelar-ciudad">Cancelar</button></div>
    <input type="text" id="qc" placeholder="Escribí la ciudad" value="${esc(T.qCiudad)}" autocomplete="off" aria-label="Ciudad">
    <div class="lista-ciud">${r.length ? r.map(([c, p]) => `<button data-act="ciudad-vos" data-x="${esc(c)}" data-p="${esc(p)}">${esc(c)} <small>${esc(p)}</small></button>`).join('') : `<p class="nota">No encontramos "${esc(T.qCiudad)}". Probá con la ciudad más cercana.</p>`}</div>`;
}
function zonaCuerpo() {
  if (T.eligiendo) return elegirCiudad();
  const z = S.zona;
  return `<div class="ciudad-el"><b>${esc(z.ciudad)}</b><span class="nota">${esc(z.prov)}</span><button class="link" data-act="cambiar-ciudad">Cambiar</button></div>
    ${radar(z.ciudad, z.km)}<p class="tit-sec">¿Hasta dónde vas a ver un show?</p>
    <div class="chips" role="group" aria-label="Hasta dónde vas a ver un show">${KMS.map(k => `<button class="btn" data-act="km-vos" data-x="${k}" aria-pressed="${z.km === k}">${k} km</button>`).join('')}</div>
    <p class="pueblos">Entran ${pueblosTxt(z.ciudad, z.km)}</p>
    <p class="nota">Los artistas que seguís en todo el país te avisan de cualquier lado: eso se elige en cada artista, gratis.</p>
    <button class="fv" data-act="sumar-zona" style="padding:10px 0;border-top:1px solid var(--line)"><div class="txt"><span class="t">+ Sumar otra zona</span><span class="d" style="white-space:normal">Por ejemplo, ${esc(z.ciudad)} y ${z.ciudad === 'Buenos Aires' ? 'Rosario' : 'Buenos Aires'}. Es con Bancá la app.</span></div><span class="chev" aria-hidden="true">›</span></button>`;
}
function avisosCuerpo() {
  const sw = (k, t, d) => `<div class="sw-fila"><div class="txt"><span class="t" id="sw-${k}">${t}</span><span class="d">${d}</span></div><button class="switch" role="switch" aria-checked="${!!S.tipos[k]}" aria-labelledby="sw-${k}" data-act="tipo" data-x="${k}"></button></div>`;
  const horas = (id, val) => `<select id="${id}" aria-label="${id === 'h-desde' ? 'Desde' : 'Hasta'}">${Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${h === val ? 'selected' : ''}>${h} h</option>`).join('')}</select>`;
  const caja = S.avisos !== 'si' ? `<div class="aviso-caja" role="status"><p><b>${S.avisos === 'no' ? 'Los avisos están apagados.' : 'Los avisos están bloqueados en este navegador.'}</b></p>${S.avisos === 'no' ? '<button class="btn lleno" data-act="pedir-avisos">Activar avisos</button>' : '<button class="btn lleno" data-act="no-esta">Cómo se activan</button>'}</div>` : '';
  return `${caja}<div class="grupo" style="margin:0"><div class="caja">${TIPOS.map(t => sw(...t)).join('')}</div></div>
    <div class="grupo" style="margin:0"><div class="caja"><div class="sw-fila"><div class="txt"><span class="t" id="sw-sil">Silencio de noche</span><span class="d">${!S.silencio ? 'Apagado: los avisos llegan a cualquier hora.' : `Lo que llegue entre las ${S.desdeH} y las ${S.hastaH} h te espera hasta las ${S.hastaH} h.`}</span></div><button class="switch" role="switch" aria-checked="${S.silencio}" aria-labelledby="sw-sil" data-act="silencio"></button></div>
    ${S.silencio ? `<div class="hora-fila">De ${horas('h-desde', S.desdeH)} a ${horas('h-hasta', S.hastaH)}</div>` : ''}</div></div>
    <div class="pie-g">No hay avisos por artista: si uno no te interesa, lo dejás de seguir. Lo de otras zonas no avisa.</div>`;
}
function sacasteCuerpo() {
  const l = [...S.sacadas].map(porId).filter(Boolean);
  if (!l.length) return `<div class="vacio"><b>No sacaste nada.</b>Lo que marques No me interesa aparece acá, por si te arrepentís.</div>`;
  return `<p class="nota">Las fechas que marcaste No me interesa. Si devolvés una, vuelve a tu Inicio.</p><div class="grupo" style="margin:0"><div class="caja">${l.map(f => `<div class="ff" style="cursor:default">${fotoI(f)}<div class="txt"><div class="nom">${esc(nombreI(f))}</div><div class="det">${f.fecha ? corto(f.fecha) + ' · ' + esc(f.lugar) : esc(f.texto || '')}</div></div><button class="btn" data-act="devolver" data-x="${f.id}">Devolver</button></div>`).join('')}</div></div>`;
}
function cuentaCuerpo() {
  if (S.google) return `<div class="grupo" style="margin:0"><div class="caja"><div class="fv estatica"><span class="ico-f" aria-hidden="true"></span><div class="txt"><span class="t">Conectada con Google</span></div></div></div>
      <div class="pie-g">Tus artistas, tu zona y lo que marcaste quedan guardados. Si cambiás de teléfono, entrás con Google y está todo.</div></div>
    <div class="grupo" style="margin:0"><div class="caja"><button class="fv" data-act="no-esta"><div class="txt"><span class="t">Cerrar sesión</span></div></button><button class="fv" data-act="no-esta"><div class="txt"><span class="t">Borrar mi cuenta</span></div><span class="chev" aria-hidden="true">›</span></button></div></div>`;
  return `<div class="aviso-caja"><p><b>Conectá Google para no perder tus artistas si cambiás de teléfono.</b></p><p class="nota">Hoy tus ${S.sigue.size} artistas y tu zona viven solo en este teléfono.</p><button class="btn lleno" data-act="no-esta">Conectar con Google</button></div>`;
}
const SUB = { zona: ['Tu zona', zonaCuerpo], avisos: ['Avisos', avisosCuerpo], sacaste: ['Lo que sacaste', sacasteCuerpo], cuenta: ['Tu cuenta', cuentaCuerpo] };

// ================= FUERA DE LA APP =================
function vistaBloqueo() {
  const cab = `<div class="cab"><span class="bdg"></span><span class="orig">Tocan · tocan.app · ahora</span></div>`;
  let aviso;
  if (S.bloqueo === 'resumen') {
    const lineas = ['f1', 'f2'].map(id => { const f = porId(id); return `${nomA(f.artista)} · ${corto(f.fecha)} · ${f.ciudad}`; }).join('\n');
    aviso = `<button class="an" data-act="tocar-aviso">${cab}<span class="cu"><span class="tx"><span class="tit">2 fechas nuevas</span><span class="lin">${esc(lineas)}</span></span><span class="ft app" aria-hidden="true">T</span></span></button>`;
  } else {
    const f = porId(S.bloqueo);
    aviso = `<button class="an" data-act="tocar-aviso">${cab}<span class="cu"><span class="tx"><span class="tit">${esc(nomA(f.artista))}</span><span class="lin">${corto(f.fecha)} · Anfiteatro Municipal, ${esc(f.ciudad)}</span></span><span class="ft" aria-hidden="true">${ini(nomA(f.artista))}</span></span></button>`;
  }
  return `<div class="bloq"><div class="estado-b"><span>21:40</span><span>100 %</span></div><div class="reloj">21:40</div><div class="fecha-b">domingo 8 de noviembre</div>${aviso}<div class="abajo">Deslizá para desbloquear</div></div>`;
}
function vistaTicketera() {
  const f = porId(S.tk) || porId('f2'), t = TICKETERAS[f.entradas.url] || 'la ticketera';
  return `<div class="tk"><div class="url">${DOMINIO[f.entradas.url] || 'ticketera'}</div><div class="tk-cuerpo"><div class="cargando" aria-hidden="true"><i></i></div>
    <h1>Te vas a ${esc(t)}</h1><p class="nota">${esc(nombreI(f))} · ${corto(f.fecha)} · ${esc(f.lugar)}</p>
    <div class="vacio">Acá se abriría ${esc(t)} para comprar la entrada. Esa parte no está en la prueba.</div>
    <button class="btn borde" data-act="volver-tk" style="align-self:flex-start">‹ Volver a Tocan</button></div></div>`;
}

// ================= PRIMER USO (ticket 33, D) =================
const ORDEN = ['bienvenida', 'zona', 'artistas', 'avisos', 'google', 'inicio'];
const P = () => S.pu;
const psigo = a => P().sigue.has(a);
const puZona = () => P().ciudad ? zonaDe(P().ciudad, P().km) : [];
const puFechasCerca = () => M.fechas.filter(f => psigo(f.artista) && !f.pasada && !f.duplicadoDe && puZona().includes(f.ciudad)).sort((a, b) => a.fecha.localeCompare(b.fecha));
function arranqueD() {
  const cz = puZona(), fut = M.fechas.filter(f => !f.pasada);
  const nivel = a => fut.some(f => f.artista === a && cz.includes(f.ciudad)) ? 0 : fut.some(f => f.artista === a) ? 1 : 2;
  const base = ARRANQUE_D.concat(Object.keys(M.artistas).filter(a => fut.some(f => f.artista === a) && !ARRANQUE_D.includes(a)))
    .map((a, i) => [a, nivel(a), i]).sort((x, y) => x[1] - y[1] || x[2] - y[2]).map(x => x[0]);
  // Al final, el resto de los artistas, para que la grilla alcance para chocar el límite sin depender de los parecidos.
  return base.concat(Object.keys(M.artistas).filter(a => !base.includes(a)));
}
const atras = () => `<div class="arriba"><button class="atras" data-act="pu-atras" aria-label="Volver al paso anterior">‹ Atrás</button></div>`;
const TILES = [['bandalos', 18, 20, 120, 150, -4], ['fierro', 160, 4, 92, 92, 0, 'red'], ['juana', 268, 40, 100, 130, 5], ['espil', 30, 190, 92, 92, 0, 'red'], ['emapm', 140, 120, 130, 160, -2], ['cebra', 270, 190, 84, 104, 3]];
function puBienvenida() {
  const collage = `<div class="collage" aria-hidden="true">${TILES.map(([a, x, y, w, h, r, red], i) => `<div class="t ${red || ''} ${M.artistas[a].foto ? '' : 'sin'}" style="left:${(x / 390 * 100).toFixed(1)}%;top:${y}px;width:${w}px;height:${h}px;--r:${r}deg;animation-delay:-${i * 0.9}s">${ini(nomA(a))}</div>`).join('')}</div>`;
  return `<div class="paso"><div class="pu-cuerpo">${collage}<h2>Seguís a tus artistas una vez. Te avisamos cuando anuncian fecha cerca tuyo.</h2>
    <p class="baj">También las fechas chicas, las que no salen en ningún otro lado.</p></div>
    <div class="pu-pie sin-linea"><button class="btn lleno ancho" data-act="pu-sig">Empezar</button><button class="link centro" data-act="tengo-cuenta">Ya tengo cuenta · Entrar con Google</button></div></div>`;
}
function puZonaV() {
  const p = P();
  if (!p.ciudad) {
    const q = sinTilde(p.qZona.trim());
    const sug = q ? (r => r.length ? `<div class="sugs">${r.map(([c, pr]) => `<button data-act="pu-ciudad" data-x="${esc(c)}" data-p="${esc(pr)}">${esc(c)} <small>· ${esc(pr)}</small></button>`).join('')}</div>` : `<p class="nota">No encontramos "${esc(p.qZona)}". Probá con la ciudad más cercana.</p>`)(CIUDADES.filter(([c]) => sinTilde(c).includes(q)).slice(0, 6)) : '';
    return `<div class="paso">${atras()}<div class="pu-cuerpo"><h2>¿De dónde sos?</h2><p class="baj">Te avisamos de las fechas cerca tuyo.</p>
      <div class="lista-ciud">${COMUNES.map(c => `<button data-act="pu-ciudad" data-x="${c}" data-p="${provDe(c)}">${c} <small>${provDe(c)}</small></button>`).join('')}</div>
      <label class="tit-sec" style="margin-top:6px" for="qz">¿Otra?</label><input type="text" id="qz" placeholder="Escribí tu ciudad" value="${esc(p.qZona)}" autocomplete="off">${sug}</div></div>`;
  }
  return `<div class="paso">${atras()}<div class="pu-cuerpo"><h2>¿Hasta dónde vas a ver un show?</h2>
    <div class="elegida"><b>${esc(p.ciudad)}</b><span class="nota">${esc(p.prov)}</span><button class="link" data-act="pu-cambiar-ciudad">Cambiar</button></div>
    ${radar(p.ciudad, p.km)}<div class="chips" role="group" aria-label="Distancia">${KMS.map(k => `<button class="btn" data-act="pu-km" data-x="${k}" aria-pressed="${p.km === k}">${k} km</button>`).join('')}</div>
    <p class="pueblos">Entran ${pueblosTxt(p.ciudad, p.km)}</p></div><div class="pu-pie"><button class="btn lleno ancho" data-act="pu-sig">Listo</button></div></div>`;
}
function celda(a) {
  const f = fotoA(a).replace('<div class="foto', '<div aria-hidden="true" class="foto').replace(/ role="img" aria-label="[^"]*"/, '');
  return `<button class="celda" data-act="pu-seguir" data-a="${a}" aria-pressed="${psigo(a)}">${f}${psigo(a) ? '<span class="ok" aria-hidden="true">✓</span>' : ''}<span class="n">${esc(nomA(a))}</span></button>`;
}
function puArtistas() {
  const p = P();
  let cuerpo;
  if (p.q.trim()) {
    const q = sinTilde(p.q.trim()), emp = k => sinTilde(nomA(k)).startsWith(q) ? 0 : 1;
    const r = Object.keys(M.artistas).filter(k => sinTilde(nomA(k)).includes(q)).sort((x, y) => (emp(x) - emp(y)) || nomA(x).localeCompare(nomA(y))).slice(0, 21);
    cuerpo = r.length ? `<div class="grilla-c">${r.map(celda).join('')}</div>` : `<div class="vacio"><b>No encontramos "${esc(p.q)}".</b>Si anuncia sus fechas en redes, proponelo y lo sumamos. Mientras, podés seguir cargando.<button class="btn borde" data-act="proponer">Proponer "${esc(p.q)}"</button></div>`;
  } else {
    // La grilla crece: al tocar a alguien, sus parecidos entran al terminar esa fila.
    const cols = 3;
    const armar = lista => {
      const out = [], ya = new Set(); let pend = [];
      const poner = a => { if (ya.has(a) || !M.artistas[a]) return; ya.add(a); out.push(a);
        if (p.abiertos.includes(a)) pend = pend.concat(parecidosDe(a));
        if (out.length % cols === 0 && pend.length) { const x = pend; pend = []; x.forEach(poner); } };
      lista.forEach(poner); pend.forEach(poner); return out;
    };
    let orden = armar(arranqueD());
    if (p.soloSeguidos) orden = orden.filter(psigo);
    cuerpo = `${p.soloSeguidos ? `<p class="nota">Seguís a estos ${p.sigue.size}. Tocá a los que quieras dejar. <button class="link" data-act="pu-todos">Volver a todos</button></p>` : ''}<div class="grilla-c">${orden.map(celda).join('')}</div>`;
  }
  const n = p.sigue.size, nf = n ? puFechasCerca().length : 0;
  const hall = n ? `<p class="nota" role="status">${nf ? `Ya encontramos <b>${nf} fecha${nf === 1 ? '' : 's'}</b> de tus artistas cerca de ${esc(p.ciudad)}.` : `Tus artistas no tienen fechas anunciadas cerca de ${esc(p.ciudad)} por ahora. Cuando anuncien, aparecen en tu Inicio.`}</p>` : '';
  const listo = n ? `<button class="btn lleno" data-act="pu-sig" style="min-width:120px">Listo</button>` : `<button class="link" data-act="pu-sig">Lo hago después</button>`;
  return `<div class="paso">${atras()}<div class="pu-cuerpo" style="gap:10px"><h2>Tocá a los que seguís</h2><p class="baj">Primero, los que tienen fechas cerca de ${esc(p.ciudad)}. Al tocar uno, aparecen otros parecidos.</p>
    <input type="search" id="pq" placeholder="Buscar un artista" value="${esc(p.q)}" aria-label="Buscar un artista" autocomplete="off" autocapitalize="off" spellcheck="false">${cuerpo}</div>
    <div class="pu-pie">${hall}<div class="fila-p"><span class="cnt" role="status">Seguís a <b>${n} de ${LIMITE}</b> gratis</span>${listo}</div></div></div>`;
}
function puAvisos() {
  const p = P(), fc = puFechasCerca(), nf = fc.length, n = p.sigue.size, ej = fc.find(f => f.entradas && f.entradas.url) || fc[0];
  const noti = ej ? `${fotoA(ej.artista, 'chica')}<div class="txt"><b>${esc(nomA(ej.artista))}</b>${corto(ej.fecha)} · ${esc(ej.lugar.split(' ').slice(0, 2).join(' '))}, ${esc(ej.ciudad)}</div>`
    : `<div class="foto chica" aria-hidden="true"></div><div class="txt"><b>Uno de tus artistas</b>sáb 12/12 · un lugar de ${esc(p.ciudad)}</div>`;
  const tit = nf ? `Tus artistas tienen ${nf} fecha${nf === 1 ? '' : 's'} cerca. Te avisamos de las próximas.` : `Te avisamos cuando ${n === 1 ? 'tu artista anuncie' : `tus ${n} artistas anuncien`} fecha`;
  const pie = p.avisos === 'si' ? `<p class="nota centro" role="status">Los avisos ya están activados.</p><button class="btn lleno ancho" data-act="pu-sig">Seguir</button>`
    : p.avisos === 'bloqueado' ? `<p class="nota centro" role="status">Bloqueaste los avisos en el navegador.</p><button class="btn lleno ancho" data-act="pu-sig">Seguir sin avisos</button>`
    : `<button class="btn lleno ancho" data-act="pedir-avisos">Activar avisos</button><button class="link centro" data-act="pu-no-avisos">Lo hago después</button>`;
  return `<div class="paso">${atras()}<div class="pu-cuerpo" style="gap:16px">
    <div class="telefono-bloq" aria-label="Así te llega un aviso"><div class="hora">21:14</div><div class="noti">${noti}<small>ahora</small></div></div>
    <h2>${tit}</h2><p class="baj">Solo cuando hay una fecha cerca de ${esc(p.ciudad)}. Nada de publicidad ni "hace mucho que no entrás".</p></div>
    <div class="pu-pie sin-linea">${pie}</div></div>`;
}
function puGoogle() {
  const n = P().sigue.size;
  return `<div class="paso">${atras()}<div class="pu-cuerpo" style="justify-content:center;gap:16px"><h2>Guardá tus ${n} artista${n === 1 ? '' : 's'}</h2>
    <ul class="lista-ok"><li>Si cambiás o perdés el teléfono, no los cargás de nuevo.</li><li>Los ves también en la compu.</li><li>No publicamos nada ni vendemos tus datos.</li></ul></div>
    <div class="pu-pie sin-linea"><button class="btn lleno ancho" data-act="pu-google"><span class="google-ico" aria-hidden="true"></span>Continuar con Google</button><button class="link centro" data-act="pu-omitir">Omitir</button>
    <p class="nota centro">Podés hacerlo después desde Vos, arriba a la derecha.</p></div></div>`;
}
const PASOS = { bienvenida: puBienvenida, zona: puZonaV, artistas: puArtistas, avisos: puAvisos, google: puGoogle };
function puSiguiente() {
  const p = P(); let i = ORDEN.indexOf(p.paso) + 1;
  while ((ORDEN[i] === 'google' && (!p.sigue.size || p.cuentaPrevia)) || (ORDEN[i] === 'avisos' && !p.sigue.size)) i++;
  if (ORDEN[i] === 'inicio') return terminarPrimerUso();
  p.paso = ORDEN[i]; T.dirPu = 1; p.q = '';
}
function puAnterior() {
  const p = P();
  if (p.paso === 'zona' && p.ciudad) { p.ciudad = null; T.dirPu = -1; return; }
  let i = ORDEN.indexOf(p.paso) - 1;
  while ((ORDEN[i] === 'google' && (!p.sigue.size || p.cuentaPrevia)) || (ORDEN[i] === 'avisos' && !p.sigue.size)) i--;
  p.paso = ORDEN[Math.max(0, i)]; T.dirPu = -1;
}
function terminarPrimerUso() {
  const p = P(), base = estadoBase();
  Object.assign(S, base);
  if (p.cuentaPrevia) { S.avisos = p.avisos || 'no'; }
  else {
    S.nombre = null; S.sigue = new Set(p.sigue); S.marca = {}; S.primeraVez = true;
    S.zona = { ciudad: p.ciudad || 'Rosario', prov: p.prov || 'Santa Fe', km: p.km };
    S.avisos = p.sigue.size ? (p.avisos || 'no') : 'no'; S.google = p.google === 'si';
  }
  S.modo = 'app';
}

// ================= CAPA: hojas, permiso, aviso chico =================
function bancaCorta() {
  const ctx = T.ctx, pend = T.pendiente ? nomA(T.pendiente) : '';
  const tit = ctx === 'zona' ? 'Para sumar otra zona' : ctx === 'limite' ? `Para seguir a ${esc(pend)}` : 'Bancá la app';
  const txt = ctx === 'zona' ? `Con Bancá la app sumás otra zona cercana para todos tus artistas: por ejemplo, ${esc(S.zona.ciudad)} y ${S.zona.ciudad === 'Buenos Aires' ? 'Rosario' : 'Buenos Aires'}. Y seguís a todos los artistas que quieras.`
    : ctx === 'limite' ? `Ya seguís a ${LIMITE}, el límite gratis. Con Bancá la app seguís a todos los que quieras, y sumás otra zona.`
    : 'Artistas sin límite y otra zona cercana para todos tus artistas.';
  const art = T.artistaZona;
  const gratis = ctx === 'limite' ? `<button class="op" data-act="elegir-dejar"><b>O dejá de seguir a alguien</b><small>Gratis: elegís a quién y entra ${esc(pend)}.</small></button>`
    : ctx === 'zona' && art && sigo(art) && S.alcance[art] !== 'pais' ? `<button class="op" data-act="alcance" data-a="${art}" data-x="pais"><b>O seguí a este artista en todo el país</b><small>Gratis. Solo para ${esc(nomA(art))}.</small></button>` : '';
  return `<h3 id="hoja-tit">${tit}</h3><p>${txt}</p>${gratis}${precioCaja()}<p>${porqueTxt} El aviso es gratis, siempre.</p>
    <button class="btn" data-act="ver-todo">Ver todo: lo que viene y cómo se cobra</button><button class="btn" data-act="cerrar-hoja">Ahora no</button>`;
}
function hojaHTML() {
  const H = T.hoja; if (!H) return '';
  const env = (inner, alta) => `<div class="hoja-fondo" data-act="cerrar-hoja"><div class="hoja ${alta ? 'alta' : ''}" role="dialog" aria-modal="true" aria-labelledby="hoja-tit">${inner}</div></div>`;
  if (H.t === 'mas') {
    const i = porId(H.id);
    return env(`<h3 id="hoja-tit">${esc(nombreI(i))}</h3>
      <button class="op" data-act="no" data-id="${i.id}"><b>No me interesa</b><small>La saca del Inicio. Va a "Lo que sacaste" y se puede devolver.</small></button>
      <button class="op" data-act="reportar"><b>Reportar</b><small>Si algo está mal o es la misma fecha que otra.</small></button>
      <button class="btn" data-act="cerrar-hoja">Cancelar</button>`);
  }
  if (H.t === 'reportar') return env(`<h3 id="hoja-tit">¿Qué pasa con esta fecha?</h3>
      <button class="op" data-act="no-esta"><b>La fecha está mal</b><small>El día, el lugar o la hora no son los del post.</small></button>
      <button class="op" data-act="no-esta"><b>Es el mismo evento que otro</b><small>Aparece dos veces.</small></button>
      <button class="btn" data-act="cerrar-hoja">Cancelar</button>`);
  if (H.t === 'promo') {
    const p = porId(H.id);
    return env(`${fotoI(p)}<h3 id="hoja-tit">${esc(p.nombre)}</h3><p>${esc(p.detalle)} · ${corto(p.fecha)} al ${corto(p.hasta)} · ${esc(p.lugar)}</p><p><span class="etq promo">Promocionado</span> ${esc(p.quien)}</p>
      <button class="btn lleno ancho" data-act="no-esta">Entradas</button><button class="btn" data-act="cerrar-hoja">Cerrar</button>`);
  }
  if (H.t === 'otras') {
    const a = H.a, { otras } = fechasDe(a);
    return env(`<h3 id="hoja-tit">Fechas en otras zonas</h3><p>${esc(nomA(a))} tiene ${otras.length} ${otras.length === 1 ? 'fecha' : 'fechas'} lejos de ${esc(S.zona.ciudad)}: ${[...new Set(otras.map(f => f.ciudad))].map(esc).join(', ')}.</p>
      ${sigo(a) && S.alcance[a] !== 'pais' ? `<button class="op" data-act="alcance" data-a="${a}" data-x="pais"><b>Seguirlo en todo el país</b><small>Gratis. Ves y te avisamos de sus fechas en cualquier lugar de Argentina.</small></button>` : ''}
      <button class="op" data-act="banca-zona" data-a="${a}"><b>Sumar una zona, con Bancá la app</b><small>Por ejemplo, Rosario y Buenos Aires, para todos los artistas que seguís.</small></button>
      <p>Mientras tanto, lo de otras zonas no te llega como aviso.</p><button class="btn" data-act="cerrar-hoja">Ahora no</button>`);
  }
  if (H.t === 'banca-corta') return env(bancaCorta());
  if (H.t === 'pu-limite') return env(`<h3 id="hoja-tit">Ya seguís a ${LIMITE}, el límite gratis</h3>
      <p>El aviso de los que seguís es gratis, siempre. Para seguir a más, podés dejar a alguno o bancar la app.</p>
      <button class="btn borde ancho" data-act="pu-elegir-dejar">Elegir a quién dejar</button><button class="btn ancho" data-act="no-esta">Bancá la app: artistas sin límite</button><button class="btn" data-act="cerrar-hoja">Ahora no</button>`);
  if (H.t === 'sub') { const [tit, f] = SUB[H.k]; return env(`<div class="cab-h"><h3 id="hoja-tit">${tit}</h3><button class="btn" data-act="cerrar-hoja">Listo</button></div><div class="sec">${f()}</div>`, true); }
  return '';
}
function dibujarCapa() {
  let h = hojaHTML();
  if (T.permiso) h += `<div class="hoja-fondo" style="align-items:flex-start;background:#0003"><div class="permiso" role="dialog" aria-modal="true" aria-labelledby="perm-tit">
    <div id="perm-tit"><b>tocan.app</b> quiere mostrar notificaciones</div><div class="botones"><button class="btn" data-act="perm-no">Bloquear</button><button class="btn lleno" data-act="perm-si">Permitir</button></div></div></div>`;
  if (T.toast) h += `<div class="toast" role="status"><span>${T.toast.txt}</span>${T.toast.undo ? '<button data-act="deshacer">Deshacer</button>' : ''}</div>`;
  const cap = $('capa'), ix = cap.querySelector('#indice');
  cap.innerHTML = h;
  if (ix) cap.appendChild(ix);
}

// ================= RENDER =================
function claveVista() {
  if (S.modo === 'primer') return 'pu|' + P().paso + (P().paso === 'zona' && P().ciudad ? '-km' : '');
  if (S.modo !== 'app') return S.modo;
  return 'app|' + S.tab + '|' + pila().map(p => p.t + ':' + (p.id || p.a || '')).join('/');
}
let histT, vistoT;
function render() {
  const app = $('app'), c = $('contenido');
  const a = document.activeElement;
  const foco = a && a.id && /^(q|pq|qz|qc)$/.test(a.id) ? { id: a.id, sel: a.selectionStart } : null;
  const prev = c.dataset.key, st = c.scrollTop;
  if (prev) S.scroll[prev] = st;
  const key = claveVista();
  app.className = (S.modo === 'app' ? 'con-tabs' : 'full') + (S.modo === 'primer' ? ' pu' : '');
  let html, indice = '';
  if (S.modo === 'bloqueo') html = vistaBloqueo();
  else if (S.modo === 'tk') html = vistaTicketera();
  else if (S.modo === 'primer') html = PASOS[P().paso]();
  else {
    const t = tope();
    if (!t) html = S.tab === 'inicio' ? vistaInicio() : S.tab === 'agenda' ? vistaAgenda() : vistaArtistas();
    else if (t.t === 'fecha') html = vistaFecha(porId(t.id));
    else if (t.t === 'artista') html = vistaArtista(t.a);
    else html = vistaVos(t);
  }
  c.innerHTML = html;
  const ix = c.querySelector('#indice'); if (ix) { indice = ix; ix.remove(); }
  c.dataset.key = key;
  const viejo = $('capa').querySelector('#indice'); if (viejo) viejo.remove();
  if (prev !== key && S.modo === 'primer' && T.dirPu && c.firstElementChild) c.firstElementChild.classList.add('entra-' + T.dirPu);
  T.dirPu = 0;
  c.scrollTop = prev === key ? st : (S.scroll[key] || 0);
  document.querySelectorAll('.barra-tabs [data-t]').forEach(b => { if (b.dataset.t === S.tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  // historias: alto, visto a los 2 s y avance cada 7 s
  const pz = c.querySelector('.pantallazo');
  if (pz) { const top = c.querySelector('.top'); pz.style.height = Math.max(460, c.clientHeight - (top ? top.offsetHeight : 0)) + 'px'; }
  dibujarCapa();
  if (indice) $('capa').appendChild(indice);
  mostrarIndice();
  programarHistorias(pz);
  if (T.scrollA) { const el = document.getElementById(T.scrollA); T.scrollA = null; if (el) el.scrollIntoView({ block: 'start' }); }
  if (foco) { const el = document.getElementById(foco.id); if (el) { el.focus({ preventScroll: true }); try { if (foco.sel != null) el.setSelectionRange(foco.sel, foco.sel); } catch (_) {} } }
  guardar();
}
function programarHistorias(pz) {
  clearTimeout(histT); clearTimeout(vistoT);
  if (!pz || !S.hist) return;
  const l = S.hist.ids.filter(x => !S.sacadas.has(x) && porId(x)), cur = l[S.hist.i];
  vistoT = setTimeout(() => { if (document.visibilityState === 'visible' && cur) { S.visto.add(cur); guardar(); } }, 2000);
  const ultima = S.hist.i >= l.length - 1;
  if (S.hist.pausa || REDUCIR || ultima) return;
  histT = setTimeout(function avanza() {
    if (S.modo !== 'app' || S.tab !== 'inicio' || tope() || !S.hist) return;
    if (T.hoja || T.permiso || document.visibilityState !== 'visible' || $('contenido').scrollTop > 80 || sostenida) { histT = setTimeout(avanza, 1000); return; }
    S.hist.i++; render();
  }, 7000);
}
function mostrarIndice() {
  const ix = document.getElementById('indice'), t = document.getElementById('todos');
  if (!ix || !t) return;
  const oculto = t.getBoundingClientRect().top > $('contenido').getBoundingClientRect().top + 160;
  ix.classList.toggle('oculto', oculto); ix.inert = oculto;
}
function irLetra(L) {
  const cab = document.getElementById('L-' + L); if (!cab) return;
  const fila = cab.nextElementSibling, c = $('contenido');
  const tope_ = (document.querySelector('.buscador') || {}).offsetHeight || 0;
  c.scrollTop = fila.offsetTop - 60 - tope_ - cab.offsetHeight;
}

// ================= ACCIONES =================
function marcar(id, m, conToast) {
  const f = porId(id), antes = S.marca[id];
  S.marca[id] = antes === m ? null : m;
  if (!S.marca[id]) { delete S.marca[id]; return; }
  if (f.tipo === 'fecha' && !f.entradas.url && f.entradas.desde) toast(`Te avisamos ${cuandoVenta(esc(f.entradas.desde))}, cuando salgan las entradas.`);
  else if (conToast) toast(`${m === 'voy' ? 'Voy' : 'Me interesa'} · ${esc(nombreI(f))}`, () => { if (antes) S.marca[id] = antes; else delete S.marca[id]; });
  else if ((parse(f.fecha) - HOYD) / 864e5 > 7) toast(`Te recordamos el ${menos7(f.fecha)}, una semana antes.`);
}
function sacar(id) {
  const i = porId(id), antes = S.marca[id];
  S.sacadas.add(id); delete S.marca[id];
  toast(`Sacaste ${esc(nombreI(i))}. Va a "Lo que sacaste".`, () => { S.sacadas.delete(id); if (antes) S.marca[id] = antes; });
}
function seguir(a) {
  if (S.sigue.size >= LIMITE) { T.pendiente = a; T.ctx = 'limite'; T.hoja = { t: 'banca-corta' }; return; }
  S.sigue.add(a);
  toast(`Seguís a ${esc(nomA(a))}. Te avisamos cuando anuncie cerca tuyo.`, () => S.sigue.delete(a));
}
function dejar(a) { S.sigue.delete(a); toast(`Dejaste de seguir a ${esc(nomA(a))}.`, () => S.sigue.add(a)); }
function abrirItem(id) {
  const i = porId(id);
  if (!i) return;
  if (i.tipo === 'promo') { T.hoja = { t: 'promo', id }; return; }
  if (i.tipo === 'anuncio') { empujar({ t: 'artista', a: i.artista }); return; }
  S.visto.add(id);
  empujar({ t: 'fecha', id });
}
function irATab(t) {
  T.hoja = null;
  if (S.tab === t) { S.pilas[t] = []; S.scroll['app|' + t + '|'] = 0; if (t === 'artistas') S.q = ''; if (t === 'inicio') S.hist = null; return; }
  if (S.tab === 'inicio' && !tope()) S.hist = null; // al volver, arranca en la primera sin ver
  S.tab = t;
}
function verTodoBanca() {
  T.hoja = null;
  const t = tope();
  if (t && t.t === 'vos') t.foco = 'banca'; else empujar({ t: 'vos', foco: 'banca' });
  T.scrollA = 'bloque-banca';
}
function salirAlIndice() { location.href = 'index.html'; }

let arrastreReciente = false;
document.addEventListener('click', e => {
  if (arrastreReciente) { e.preventDefault(); e.stopPropagation(); arrastreReciente = false; return; }
  const t = e.target.closest('[data-act]');
  if (!t || !$('app').contains(t)) return;
  if (t.classList.contains('hoja-fondo') && e.target !== t) return;
  const act = t.dataset.act, x = t.dataset.x, id = t.dataset.id, a = t.dataset.a;
  if (S.hist && t.closest('.hist') && !act.startsWith('hist')) S.hist.pausa = true;
  switch (act) {
    // fuera de la app
    case 'tocar-aviso':
      S.modo = 'app'; S.tab = 'inicio'; S.pilas = { inicio: [], agenda: [], artistas: [] }; S.hist = null; S.scroll = {};
      if (S.bloqueo !== 'resumen') abrirItem(S.bloqueo);
      S.bloqueo = null; break;
    case 'volver-tk': S.modo = 'app'; S.tk = null; break;
    // navegación
    case 'tab': irATab(t.dataset.t); break;
    case 'volver': pila().pop(); T.hoja = null; break;
    case 'abrir': abrirItem(id); break;
    case 'artista': T.hoja = null; empujar({ t: 'artista', a }); break;
    case 'abrir-vos': empujar({ t: 'vos' }); break;
    case 'no-esta': T.hoja = (T.hoja && T.hoja.t === 'reportar') ? null : T.hoja; noEsta(); break;
    case 'cerrar-hoja': T.hoja = null; T.eligiendo = null; break;
    case 'deshacer': if (T.toast && T.toast.undo) T.toast.undo(); T.toast = null; break;
    // historias
    case 'hist-ant': S.hist.i = Math.max(0, S.hist.i - 1); S.hist.pausa = false; break;
    case 'hist-sig': {
      const l = S.hist.ids.filter(z => !S.sacadas.has(z) && porId(z));
      if (S.hist.i >= l.length - 1) { const pz = document.querySelector('.pantallazo'); if (pz) $('contenido').scrollTo({ top: pz.offsetHeight, behavior: REDUCIR ? 'auto' : 'smooth' }); return; }
      S.hist.i++; S.hist.pausa = false; break;
    }
    case 'hist-pausa': S.hist.pausa = !S.hist.pausa; break;
    case 'hist-otra': S.hist = { ids: [...fechasInicio(), ...anunciosInicio()].filter(z => z.nuevo && !S.sacadas.has(z.id)).sort((p, q) => prio(p) - prio(q) || q.publicado.localeCompare(p.publicado)).map(z => z.id), i: 0, pausa: false }; break;
    // la fecha
    case 'entradas': { const f = porId(id); S.modo = 'tk'; S.tk = f.id; T.hoja = null; break; }
    case 'interesa-fuerte': S.marca[id] = 'interesa'; toast(`Te avisamos ${cuandoVenta(esc(porId(id).entradas.desde))}, cuando salgan las entradas.`); break;
    case 'voy': marcar(id, 'voy'); break;
    case 'interesa': marcar(id, 'interesa'); break;
    case 'mas': T.hoja = { t: 'mas', id }; break;
    case 'reportar': T.hoja = { t: 'reportar' }; break;
    case 'no': { T.hoja = null; const t0 = tope(); if (t0 && t0.t === 'fecha' && t0.id === id) pila().pop(); sacar(id); break; }
    case 'ir-post': { const p = document.getElementById('post-e'); if (p) p.scrollIntoView({ behavior: REDUCIR ? 'auto' : 'smooth' }); return; }
    // artista
    case 'seguir': seguir(a); break;
    case 'dejar': dejar(a); break;
    case 'alcance': T.hoja = null; S.alcance[a] = x; toast(x === 'pais' ? `Te avisamos de ${esc(nomA(a))} en todo el país.` : `Te avisamos de ${esc(nomA(a))} solo cerca de ${esc(S.zona.ciudad)}.`); break;
    case 'otras-zonas': T.hoja = { t: 'otras', a }; break;
    case 'banca-zona': T.ctx = 'zona'; T.artistaZona = a; T.hoja = { t: 'banca-corta' }; break;
    case 'banca-general': T.ctx = 'general'; T.hoja = { t: 'banca-corta' }; break;
    case 'sumar-zona': T.ctx = 'zona'; T.artistaZona = null; T.hoja = { t: 'banca-corta' }; break;
    case 'ver-todo': verTodoBanca(); break;
    case 'plan': S.plan = x; break;
    case 'elegir-dejar': T.hoja = null; S.q = ''; S.pilas.artistas = []; S.tab = 'artistas'; render();
      { const el = document.getElementById('todos'); if (el) { $('contenido').scrollTop = el.offsetTop - 60; } }
      toast('Deslizá a la izquierda al que quieras dejar, o abrilo y tocá "Siguiendo".'); break;
    case 'proponer': toast(`Gracias. Revisamos ${S.q.trim() && S.modo === 'app' ? '"' + esc(S.q.trim()) + '"' : 'el artista'} y, si anuncia en redes, lo sumamos.`); break;
    case 'letra': irLetra(x); return;
    // agenda
    case 'filtro': S.filtro = x; break;
    case 'mes': { const [y, m] = S.mes.split('-').map(Number); S.mes = iso(new Date(y, m - 1 + Number(x), 1)).slice(0, 7); S.dia = S.mes === HOY.slice(0, 7) ? HOY : S.mes + '-01'; break; }
    case 'dia-salta': {
      S.dia = x; const l = marcadas(), sig = l.find(f => f.fecha >= x);
      if (sig && sig.fecha !== x) toast(`Nada el ${corto(x)}. Lo siguiente es el ${corto(sig.fecha)}.`); else if (!sig) toast(`Nada desde el ${corto(x)}.`);
      render(); if (sig) { const el = document.getElementById('d-' + sig.fecha); if (el) el.scrollIntoView({ block: 'start', behavior: REDUCIR ? 'auto' : 'smooth' }); } return;
    }
    case 'fui': S.fuiAbierto = !S.fuiAbierto; break;
    // vos
    case 'sub': T.hoja = { t: 'sub', k: x }; T.eligiendo = null; break;
    case 'km-vos': S.zona.km = Number(x); S.hist = null; break;
    case 'cambiar-ciudad': T.eligiendo = true; T.qCiudad = ''; break;
    case 'cancelar-ciudad': T.eligiendo = null; break;
    case 'ciudad-vos': { const antes = { ...S.zona }; S.zona = { ciudad: x, prov: t.dataset.p, km: S.zona.km }; T.eligiendo = null; S.hist = null;
      toast(`Tu zona ahora es ${esc(x)}.`, () => { S.zona = antes; }); break; }
    case 'tipo': S.tipos[x] = !S.tipos[x]; break;
    case 'silencio': S.silencio = !S.silencio; break;
    case 'devolver': { S.sacadas.delete(x); const i = porId(x); toast(`${esc(nombreI(i))} volvió a tu Inicio.`, () => S.sacadas.add(x)); break; }
    case 'pedir-avisos': T.permiso = true; break;
    case 'perm-si': T.permiso = false; if (S.modo === 'primer') { P().avisos = 'si'; puSiguiente(); } else { S.avisos = 'si'; toast('Listo, los avisos están activados.'); } break;
    case 'perm-no': T.permiso = false; if (S.modo === 'primer') { P().avisos = 'bloqueado'; puSiguiente(); } else S.avisos = 'bloqueado'; break;
    // primer uso
    case 'pu-sig': puSiguiente(); break;
    case 'pu-atras': puAnterior(); break;
    case 'tengo-cuenta': {
      const p = P(); p.cuentaPrevia = true; p.google = 'si'; p.ciudad = 'Rosario'; p.prov = 'Santa Fe'; p.km = 60; p.sigue = new Set(SIGUE_LUCIA);
      p.paso = 'avisos'; T.dirPu = 1; toast(`Entraste con Google. Recuperamos tu zona (Rosario, 60 km) y tus ${p.sigue.size} artistas.`); break;
    }
    case 'pu-ciudad': P().ciudad = x; P().prov = t.dataset.p; P().qZona = ''; T.dirPu = 1; break;
    case 'pu-cambiar-ciudad': P().ciudad = null; T.dirPu = -1; break;
    case 'pu-km': P().km = Number(x); break;
    case 'pu-seguir': {
      const p = P();
      if (p.sigue.has(a)) { p.sigue.delete(a); break; }
      if (p.sigue.size >= LIMITE) { T.hoja = { t: 'pu-limite' }; break; }
      p.sigue.add(a); if (!p.abiertos.includes(a)) p.abiertos.push(a);
      if (p.q.trim()) { render(); const el = $('pq'); if (el) { el.focus({ preventScroll: true }); el.select(); } return; }
      break;
    }
    case 'pu-elegir-dejar': T.hoja = null; P().q = ''; P().soloSeguidos = true; break;
    case 'pu-todos': P().soloSeguidos = false; break;
    case 'pu-no-avisos': P().avisos = 'no'; puSiguiente(); break;
    case 'pu-google': P().google = 'si'; toast('Google no está en la prueba: seguimos como si hubieras entrado.'); puSiguiente(); break;
    case 'pu-omitir': P().google = 'omitido'; puSiguiente(); break;
    default: return;
  }
  render();
});
document.addEventListener('input', e => {
  const id = e.target.id;
  if (id === 'q') { S.q = e.target.value; render(); }
  if (id === 'pq') { P().q = e.target.value; render(); }
  if (id === 'qz') { P().qZona = e.target.value; render(); }
  if (id === 'qc') { T.qCiudad = e.target.value; dibujarCapa(); const el = $('qc'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }
});
document.addEventListener('change', e => {
  if (e.target.id === 'h-desde') { S.desdeH = Number(e.target.value); render(); }
  if (e.target.id === 'h-hasta') { S.hastaH = Number(e.target.value); render(); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); return; }
  if (e.key === 'Escape' && (T.hoja || T.permiso)) { T.hoja = null; T.permiso = false; render(); }
});
$('contenido').addEventListener('scroll', () => {
  mostrarIndice();
  // la primera vez que bajás en el Inicio, la primera fila se asoma para enseñar el gesto
  if (S.asomo || REDUCIR || S.modo !== 'app' || S.tab !== 'inicio' || tope()) return;
  const c = $('contenido'), pz = c.querySelector('.pantallazo'), f = c.querySelector('.lista .desl');
  if (!f || c.scrollTop < (pz ? pz.offsetHeight * .6 : 120)) return;
  S.asomo = true; guardar(); f.classList.add('izq'); const fr = f.querySelector('.frente'); fr.classList.add('asoma');
  setTimeout(() => { f.classList.remove('izq'); fr.classList.remove('asoma'); }, 1150);
}, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') guardar(); });

// ---------- gestos ----------
// Historias: mantener apretado pausa.
let holdT, sostenida = false;
// Quien modera: mantener apretada 2 s la esquina de arriba a la izquierda vuelve a la página de la prueba.
let modT = null, modXY = null;
// Deslizar filas.
let arr = null;
document.addEventListener('pointerdown', e => {
  const r = $('app').getBoundingClientRect();
  if (e.clientX - r.left < 44 && e.clientY - r.top < 44) { modXY = [e.clientX, e.clientY]; clearTimeout(modT); modT = setTimeout(salirAlIndice, 2000); }
  if (e.target.closest('.hist .hz')) {
    holdT = setTimeout(() => { sostenida = true; clearTimeout(histT); const b = document.querySelector('.barras .actual'); if (b) b.classList.add('pausa'); }, 300);
  }
  if (e.target.closest('#indice')) { enIndice = true; const b = e.target.closest('[data-x]'); if (b) irLetra(b.dataset.x); return; }
  if (e.target.closest('button, .link, input')) return;
  const f = e.target.closest('.desl[data-tipo] .frente');
  if (!f) return;
  const d = f.closest('.desl');
  if (d.dataset.tipo === 'pasada') return;
  arr = { f, d, x0: e.clientX, y0: e.clientY, dx: 0, movio: false, id: d.dataset.id, tipo: d.dataset.tipo };
  f.classList.remove('vuelve');
});
let enIndice = false;
document.addEventListener('pointermove', e => {
  if (modXY && Math.hypot(e.clientX - modXY[0], e.clientY - modXY[1]) > 12) { clearTimeout(modT); modXY = null; }
  if (enIndice) { const b = document.elementFromPoint(e.clientX, e.clientY); const k = b && b.closest && b.closest('#indice [data-x]'); if (k) irLetra(k.dataset.x); return; }
  if (!arr) return;
  const crudo = e.clientX - arr.x0;
  arr.dx = (arr.tipo === 'artista' || arr.tipo === 'agenda') && crudo > 0 ? 0 : crudo; // artistas y agenda: solo a la izquierda
  if (!arr.movio && Math.abs(crudo) > 8 && Math.abs(crudo) > Math.abs(e.clientY - arr.y0)) { arr.movio = true; try { arr.f.setPointerCapture(e.pointerId); } catch (_) {} }
  if (!arr.movio) { if (Math.abs(e.clientY - arr.y0) > 10) arr = null; return; }
  e.preventDefault();
  arr.f.style.transform = `translateX(${arr.dx}px)`;
  arr.d.classList.toggle('der', arr.dx > 0); arr.d.classList.toggle('izq', arr.dx < 0);
});
function soltar() {
  clearTimeout(modT); modXY = null; enIndice = false;
  clearTimeout(holdT);
  if (sostenida) { sostenida = false; arrastreReciente = true; setTimeout(() => arrastreReciente = false, 60); render(); }
  if (!arr) return;
  const { f, dx, movio, id, tipo } = arr; arr = null;
  if (!movio) return;
  arrastreReciente = true; setTimeout(() => arrastreReciente = false, 60);
  if (dx < -90) { if (tipo === 'artista') dejar(id); else if (tipo === 'agenda') { const antes = S.marca[id]; delete S.marca[id]; toast(`Quitaste ${esc(nombreI(porId(id)))} de la agenda. Sigue en el Inicio.`, () => { S.marca[id] = antes; }); } else sacar(id); render(); }
  else if (dx > 90 && (tipo === 'fecha' || tipo === 'inicio')) { const antes = S.marca[id]; S.marca[id] = 'interesa'; toast(`Me interesa · ${esc(nombreI(porId(id)))}`, () => { if (antes) S.marca[id] = antes; else delete S.marca[id]; }); render(); }
  else { f.classList.add('vuelve'); f.style.transform = ''; f.closest('.desl').classList.remove('der', 'izq'); }
}
document.addEventListener('pointerup', soltar);
document.addEventListener('pointercancel', () => { if (arr) { arr.f.style.transform = ''; arr.d.classList.remove('der', 'izq'); arr = null; } soltar(); });
document.addEventListener('contextmenu', e => { if ($('app').contains(e.target) && !e.target.closest('input')) e.preventDefault(); });
window.addEventListener('resize', () => { if (S.modo === 'app' && (tope() || S.tab === 'inicio')) render(); });

render();
})();
