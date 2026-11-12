// Datos de mentira compartidos por los prototipos de design/.
// Copia de design/_mock/datos.js para el prototipo de la prueba (ticket 36). Se carga con <script src="datos.js"></script>.
// "Hoy" es el domingo 8/11/2026. Los días de la semana de las citas coinciden con el calendario de 2026 (corregido en el ticket 32). La Persona vive en Rosario (no en Buenos Aires, a propósito).
// Artistas reales para que se sienta verosímil; fechas, lugares y citas son inventados.

window.MOCK = {
  hoy: "2026-11-08",
  persona: {
    nombre: "Lucía",
    localidad: "Rosario, Santa Fe",
    km: 60,
    siguiendo: 28,
    limiteGratis: 30,
    ultimaVisita: "2026-11-03", // el martes
  },

  // foto: true = tiene Foto; false = sin Foto (quitada o nunca hubo)
  artistas: {
    bandalos: { nombre: "Bándalos Chinos", foto: true, alcance: "cerca", genero: "pop" },
    fierro: { nombre: "Orquesta Típica Fernández Fierro", foto: true, alcance: "pais", genero: "tango" },
    emapm: { nombre: "El Mató a un Policía Motorizado", foto: true, alcance: "cerca", genero: "rock" },
    wos: { nombre: "WOS", foto: true, alcance: "cerca", genero: "rap" },
    fito: { nombre: "Fito Páez", foto: true, alcance: "pais", genero: "rock" },
    juana: { nombre: "Juana Molina", foto: true, alcance: "cerca", genero: "experimental" },
    usted: { nombre: "Usted Señálemelo", foto: true, alcance: "cerca", genero: "indie" },
    espil: { nombre: "An Espil", foto: false, alcance: "cerca", genero: "folk" },
    cebra: { nombre: "Mujer Cebra", foto: true, alcance: "cerca", genero: "post-punk" },
    cory: { nombre: "Cory Wong", foto: true, alcance: "pais", genero: "funk" },
    cypa: { nombre: "Ca7riel & Paco Amoroso", foto: true, alcance: "cerca", genero: "trap" },
    babasonicos: { nombre: "Babasónicos", foto: true, alcance: "cerca", genero: "rock" },
    perotti: { nombre: "Los Espíritus", foto: true, alcance: "cerca", genero: "blues" },
    chancha: { nombre: "Chancha Vía Circuito", foto: false, alcance: "cerca", genero: "electrónica" },
  },

  // estado del aviso para Lucía: nuevo (true/false), marca: null | "voy" | "interesa" | "no"
  // entradas: { url, desde } — desde = cuándo salen a la venta si todavía no salieron
  fechas: [
    {
      id: "f1", artista: "bandalos", fecha: "2027-03-14", hora: "21 h",
      lugar: "Teatro El Círculo", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: true, marca: null,
      entradas: { url: null, desde: "vie 13/11, 10 h" },
      cita: "ROSARIO 🌙 14 de marzo en El Círculo. Entradas a la venta este viernes a las 10.",
      publicado: "2026-11-06",
    },
    {
      id: "f2", artista: "emapm", fecha: "2026-12-06", hora: "20 h",
      lugar: "Anfiteatro Municipal Humberto de Nito", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: true, marca: null,
      entradas: { url: "passline", desde: null },
      cita: "Anfi de Rosario, domingo 6 de diciembre. Ya están las entradas en Passline.",
      publicado: "2026-11-07",
    },
    {
      id: "f3", artista: "fito", fecha: "2026-12-18", hasta: "2026-12-19",
      lugar: "Estadio Mario Alberto Kempes", ciudad: "Córdoba", provincia: "Córdoba",
      nuevo: true, marca: null, fueraDeZona: true, // aparece porque el Alcance es "todo el país"
      entradas: { url: "ticketek", desde: null },
      cita: "Córdoba, dos noches: 18 y 19 de diciembre en el Kempes.",
      publicado: "2026-11-05",
    },
    {
      id: "f4", artista: "fierro", fecha: "2026-11-27", hora: "21:30 h",
      lugar: "Centro Cultural Kirchner — Sala Sinfónica", ciudad: "Buenos Aires", provincia: "CABA",
      nuevo: true, marca: null, fueraDeZona: true,
      entradas: { url: "cck", desde: null }, gratis: true,
      cita: "Este viernes 27/11 en la Sinfónica del CCK. Entrada gratuita con reserva previa.",
      publicado: "2026-11-07",
    },
    {
      id: "f5", artista: "juana", fecha: "2026-11-15", hora: "21 h",
      lugar: "Teatro Fundación Astengo", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: true, marca: "voy",
      corregida: { antes: "sáb 14/11", ahora: "dom 15/11" },
      entradas: { url: "alpogo", desde: null },
      cita: "Rosario, domingo 15 de noviembre en el Astengo. (Perdón, el 14 era un error del flyer)",
      publicado: "2026-11-07",
    },
    {
      id: "f6", artista: "usted", fecha: "2026-11-22", hora: "21 h",
      lugar: "Distrito Siete", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: false, marca: "interesa", agotado: true,
      entradas: { url: "alpogo", desde: null },
      cita: "AGOTADO Rosario 22/11 🙏 gracias",
      publicado: "2026-10-20",
    },
    {
      id: "f7", artista: "espil", fecha: "2026-11-27", hora: "21 h",
      lugar: "Bon Scott Bar", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: false, marca: null,
      entradas: { url: "passline", desde: null },
      cita: "viernes 27 en Bon Scott, Rosario ✨ voy con banda completa",
      publicado: "2026-10-28",
    },
    {
      id: "f8", artista: "cebra", fecha: "2026-11-29", hora: "22 h",
      lugar: "Club Riberas del Paraná", ciudad: "Villa Constitución", provincia: "Santa Fe",
      nuevo: false, marca: null,
      entradas: { url: null, desde: null }, // no se sabe dónde se venden
      cita: "Villa Constitución!! domingo 29/11, Club Riberas. Puerta.",
      publicado: "2026-10-31",
    },
    {
      id: "f9", artista: "cory", proyecto: "con Vulfpeck", fecha: "2026-12-02", hora: "20 h",
      lugar: "Galpón 11", ciudad: null, provincia: null, sinUbicar: true,
      nuevo: false, marca: null,
      entradas: { url: "allaccess", desde: null },
      cita: "Vulfpeck + Cory Wong — Galpón 11, Dec 2nd 🇦🇷🔥",
      publicado: "2026-10-15",
    },
    {
      id: "f10", artista: "cypa", fecha: "2026-12-12", hora: "21 h",
      lugar: "Metropolitano", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: false, marca: null, duplicadoDe: "f11",
      entradas: { url: "ticketek", desde: null },
      cita: "ROSARIO 12/12 METROPOLITANO",
      publicado: "2026-10-30",
    },
    {
      id: "f11", artista: "cypa", fecha: "2026-12-13", hora: "21 h",
      lugar: "Metropolitano", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: false, marca: null, duplicadoDe: "f10",
      entradas: { url: "ticketek", desde: null },
      cita: "domingo 13 en el Metro de Rosario, nos vemos",
      publicado: "2026-11-01",
    },
    {
      id: "f12", artista: "perotti", fecha: "2026-11-14", hora: "21 h",
      lugar: "La Sala de las Artes", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: false, marca: "voy",
      entradas: { url: "passline", desde: null },
      cita: "Sábado 14/11 en La Sala de las Artes. Abrimos con temas nuevos.",
      publicado: "2026-10-10",
    },
    {
      id: "f13", artista: "chancha", fecha: "2027-01-24", hora: "20 h",
      lugar: "Anfiteatro Municipal Humberto de Nito", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: false, marca: null,
      entradas: { url: "passline", desde: null },
      cita: "Verano en el Anfi 🌊 24 de enero",
      publicado: "2026-10-25",
    },
    // pasada, para "A las que fui"
    {
      id: "f14", artista: "babasonicos", fecha: "2026-10-02", hora: "21 h",
      lugar: "Metropolitano", ciudad: "Rosario", provincia: "Santa Fe",
      nuevo: false, marca: "voy", pasada: true,
      entradas: { url: "ticketek", desde: null },
      cita: "Rosario 2/10",
      publicado: "2026-08-01",
    },
  ],

  // Anuncio vago: dice que va a tocar, sin fecha o sin lugar
  anuncios: [
    {
      id: "a1", artista: "wos", nuevo: true,
      texto: "Se viene gira por el interior en 2027",
      cita: "2027 vamos a todas las provincias que podamos. Fechas pronto 🤝",
      publicado: "2026-11-06",
    },
  ],

  // Fecha promocionada: la paga un artista, sala o productora. Solo en la app, marcada, nunca en la Notificación.
  promocionadas: [
    {
      id: "p1", nombre: "Festival Bandera", detalle: "Dos días, doce bandas",
      fecha: "2027-02-06", hasta: "2027-02-07",
      lugar: "Parque de la Independencia", ciudad: "Rosario", provincia: "Santa Fe",
      quien: "Lo promociona la productora",
    },
  ],
};
