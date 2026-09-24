import { pedirSesion, json } from './_sesion.mjs';

/* Colecciones editables: cada una es un archivo JSON con un array. */
const ARCHIVOS = {
  propiedades: 'data/propiedades.json',
  momentos: 'data/momentos.json',
  casos: 'data/casos.json',
};
const CARPETA_FOTOS = 'img/uploads';

function entorno() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;           // usuario/repositorio
  const rama = process.env.GITHUB_BRANCH || 'main';
  if (!token || !repo) throw new Error('Faltan GITHUB_TOKEN o GITHUB_REPO en las variables de entorno.');
  return { token, repo, rama };
}

async function gh(ruta, opciones = {}) {
  const { token, repo } = entorno();
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${ruta}`, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'gonzalez-inmuebles-admin',
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
  });
  if (!res.ok) {
    const detalle = await res.text();
    const e = new Error(`GitHub respondió ${res.status}: ${detalle.slice(0, 300)}`);
    e.status = res.status;
    throw e;
  }
  return res.json();
}

const b64aTexto = (b) => Buffer.from(b, 'base64').toString('utf8');
const textoAb64 = (t) => Buffer.from(t, 'utf8').toString('base64');

function slug(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

async function leerColeccion(coleccion) {
  const { rama } = entorno();
  try {
    const archivo = await gh(`${ARCHIVOS[coleccion]}?ref=${rama}`);
    return { items: JSON.parse(b64aTexto(archivo.content)), sha: archivo.sha };
  } catch (e) {
    if (e.status === 404) return { items: [], sha: null };
    throw e;
  }
}

async function guardarColeccion(coleccion, items, sha, mensaje) {
  const { rama } = entorno();
  const res = await gh(ARCHIVOS[coleccion], {
    method: 'PUT',
    body: JSON.stringify({
      message: mensaje,
      content: textoAb64(JSON.stringify(items, null, 2) + '\n'),
      branch: rama,
      ...(sha ? { sha } : {}),
    }),
  });
  return res.content.sha;
}

export default async (req) => {
  const sinSesion = pedirSesion(req);
  if (sinSesion) return sinSesion;

  const url = new URL(req.url);
  const accion = url.searchParams.get('accion');
  const coleccion = url.searchParams.get('coleccion');

  try {
    if (accion === 'listar') {
      if (!ARCHIVOS[coleccion]) return json({ error: 'Colección desconocida' }, { status: 400 });
      const { items } = await leerColeccion(coleccion);
      return json({ items });
    }

    if (accion === 'todo') {
      const salida = {};
      for (const k of Object.keys(ARCHIVOS)) salida[k] = (await leerColeccion(k)).items;
      return json(salida);
    }

    if (req.method !== 'POST') return json({ error: 'Método no permitido' }, { status: 405 });
    const body = await req.json();

    /* ---- alta o edición de un elemento ---- */
    if (accion === 'guardar') {
      if (!ARCHIVOS[body.coleccion]) return json({ error: 'Colección desconocida' }, { status: 400 });
      const { items, sha } = await leerColeccion(body.coleccion);
      const dato = body.dato || {};
      dato.id = dato.id || `${slug(dato.titulo || body.coleccion)}-${Date.now().toString(36)}`;
      const i = items.findIndex((x) => x.id === dato.id);
      if (i > -1) items[i] = { ...items[i], ...dato };
      else items.push(dato);
      items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      await guardarColeccion(body.coleccion, items, sha, `${i > -1 ? 'Edición' : 'Alta'} en ${body.coleccion}: ${dato.titulo || dato.id}`);
      return json({ ok: true, id: dato.id });
    }

    /* ---- baja ---- */
    if (accion === 'borrar') {
      if (!ARCHIVOS[body.coleccion]) return json({ error: 'Colección desconocida' }, { status: 400 });
      const { items, sha } = await leerColeccion(body.coleccion);
      const restantes = items.filter((x) => x.id !== body.id);
      await guardarColeccion(body.coleccion, restantes, sha, `Baja en ${body.coleccion}: ${body.id}`);
      return json({ ok: true });
    }

    /* ---- reordenar (lista completa de ids) ---- */
    if (accion === 'ordenar') {
      const { items, sha } = await leerColeccion(body.coleccion);
      const orden = body.ids || [];
      items.forEach((x) => { const i = orden.indexOf(x.id); x.orden = i > -1 ? i + 1 : 999; });
      items.sort((a, b) => a.orden - b.orden);
      await guardarColeccion(body.coleccion, items, sha, `Reordenado ${body.coleccion}`);
      return json({ ok: true });
    }

    /* ---- subida de imágenes ---- */
    if (accion === 'subir') {
      const { rama } = entorno();
      const { nombre, contenidoBase64 } = body;
      if (!nombre || !contenidoBase64) return json({ error: 'Falta el archivo' }, { status: 400 });
      const ext = (nombre.match(/\.[^.]+$/) || ['.jpg'])[0].toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'].includes(ext)) {
        return json({ error: 'Formato no permitido. Usá JPG, PNG o WebP.' }, { status: 400 });
      }
      if (contenidoBase64.length > 8_000_000) {
        return json({ error: 'La imagen es muy pesada. Subila de menos de 5 MB.' }, { status: 400 });
      }
      const archivo = `${Date.now()}-${slug(nombre.replace(/\.[^.]+$/, ''))}${ext}`;
      await gh(`${CARPETA_FOTOS}/${archivo}`, {
        method: 'PUT',
        body: JSON.stringify({ message: `Imagen subida: ${archivo}`, content: contenidoBase64, branch: rama }),
      });
      return json({ ok: true, url: `/${CARPETA_FOTOS}/${archivo}` });
    }

    return json({ error: 'Acción desconocida' }, { status: 400 });
  } catch (e) {
    return json({ error: e.message }, { status: e.status === 409 ? 409 : 500 });
  }
};

export const config = { path: '/api/contenido' };
