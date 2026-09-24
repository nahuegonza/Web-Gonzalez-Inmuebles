import { igualSeguro, crearToken, cookieSesion, cookieBorrada, leerCookie, tokenValido, json } from './_sesion.mjs';

export default async (req) => {
  const url = new URL(req.url);
  const accion = url.searchParams.get('accion') || 'entrar';

  if (accion === 'salir') {
    return json({ ok: true }, { headers: { 'Set-Cookie': cookieBorrada() } });
  }

  if (accion === 'estado') {
    const usuario = tokenValido(leerCookie(req));
    return json({ autenticado: Boolean(usuario), usuario });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido' }, { status: 405 });
  }

  const usuarioOk = process.env.ADMIN_USER;
  const claveOk = process.env.ADMIN_PASSWORD;
  if (!usuarioOk || !claveOk) {
    return json({ error: 'Faltan ADMIN_USER o ADMIN_PASSWORD en las variables de entorno del sitio.' }, { status: 500 });
  }

  let datos;
  try {
    datos = await req.json();
  } catch {
    return json({ error: 'Datos inválidos' }, { status: 400 });
  }

  const correcto = igualSeguro(datos.usuario || '', usuarioOk) && igualSeguro(datos.clave || '', claveOk);

  // Demora fija para que no se pueda medir el tiempo de respuesta.
  await new Promise((r) => setTimeout(r, 400));

  if (!correcto) {
    return json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  }

  return json({ ok: true }, { headers: { 'Set-Cookie': cookieSesion(crearToken(usuarioOk)) } });
};

export const config = { path: '/api/login' };
