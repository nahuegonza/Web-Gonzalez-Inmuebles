import crypto from 'node:crypto';

const NOMBRE_COOKIE = 'gi_sesion';
const DURACION_MS = 8 * 60 * 60 * 1000; // 8 horas

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('Falta la variable de entorno SESSION_SECRET');
  return s;
}

function firmar(payload) {
  return crypto.createHmac('sha256', secreto()).update(payload).digest('hex');
}

/** Compara dos textos sin filtrar información por el tiempo de respuesta. */
export function igualSeguro(a = '', b = '') {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function crearToken(usuario) {
  const vence = Date.now() + DURACION_MS;
  const payload = `${usuario}|${vence}`;
  return `${Buffer.from(payload).toString('base64url')}.${firmar(payload)}`;
}

export function tokenValido(token) {
  if (!token || !token.includes('.')) return null;
  const [datos, firma] = token.split('.');
  let payload;
  try {
    payload = Buffer.from(datos, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  if (!igualSeguro(firma, firmar(payload))) return null;
  const [usuario, vence] = payload.split('|');
  if (!vence || Number(vence) < Date.now()) return null;
  return usuario;
}

export function leerCookie(req) {
  const cookies = req.headers.get('cookie') || '';
  const par = cookies.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${NOMBRE_COOKIE}=`));
  return par ? decodeURIComponent(par.slice(NOMBRE_COOKIE.length + 1)) : null;
}

export function cookieSesion(token) {
  const max = Math.floor(DURACION_MS / 1000);
  return `${NOMBRE_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${max}`;
}

export function cookieBorrada() {
  return `${NOMBRE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function pedirSesion(req) {
  const usuario = tokenValido(leerCookie(req));
  if (!usuario) {
    return new Response(JSON.stringify({ error: 'Sesión vencida o inexistente' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return null;
}

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}
