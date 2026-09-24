/* Panel de carga de González Inmuebles.
   Guarda el contenido en los archivos JSON del repositorio y las fotos en /img/uploads,
   a través de las funciones de Netlify /api/login y /api/contenido. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var DATOS = { propiedades: [], momentos: [], casos: [] };
  var vista = 'propiedades', edit = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function api(url, opciones) {
    return fetch(url, Object.assign({ credentials: 'same-origin' }, opciones)).then(function (r) {
      if (r.status === 401) { mostrarLogin(); throw new Error('Se venció la sesión. Volvé a entrar.'); }
      return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || 'Error inesperado'); return d; });
    });
  }
  function aviso(txt, err) {
    var m = $('#msg'); if (!m) return;
    m.className = 'adm-msg on' + (err ? ' err' : ''); m.textContent = txt;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!err) setTimeout(function () { m.className = 'adm-msg'; }, 6000);
  }

  /* ---------------- sesión ---------------- */
  function mostrarLogin() { $('#login').style.display = 'flex'; $('#app').hidden = true; }
  function mostrarPanel() { $('#login').style.display = 'none'; $('#app').hidden = false; cargar(); }

  $('#entrar').addEventListener('click', entrar);
  $('#clave').addEventListener('keydown', function (e) { if (e.key === 'Enter') entrar(); });
  function entrar() {
    var m = $('#loginMsg'), b = $('#entrar');
    m.className = 'adm-msg'; b.disabled = true; b.textContent = 'Entrando…';
    fetch('/api/login', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: $('#usuario').value, clave: $('#clave').value })
    })
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error); return d; }); })
      .then(function () { $('#clave').value = ''; mostrarPanel(); })
      .catch(function (e) { m.className = 'adm-msg on err'; m.textContent = e.message || 'No se pudo entrar'; })
      .then(function () { b.disabled = false; b.textContent = 'Entrar'; });
  }
  $('#salir').addEventListener('click', function () {
    fetch('/api/login?accion=salir', { method: 'POST', credentials: 'same-origin' }).then(mostrarLogin, mostrarLogin);
  });

  /* ---------------- datos ---------------- */
  function cargar() {
    return api('/api/contenido?accion=todo').then(function (d) {
      DATOS = { propiedades: d.propiedades || [], momentos: d.momentos || [], casos: d.casos || [] };
      render();
    }).catch(function (e) { $('#wrap').innerHTML = '<p class="adm-vacio">' + esc(e.message) + '</p>'; });
  }

  function guardar(dato) {
    return api('/api/contenido?accion=guardar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coleccion: vista, dato: dato })
    }).then(cargar).then(function () { edit = null; render(); aviso('Guardado. El sitio se vuelve a publicar en uno o dos minutos.'); });
  }
  function borrar(id, nombre) {
    if (!window.confirm('¿Borrar «' + nombre + '»? No se puede deshacer.')) return;
    api('/api/contenido?accion=borrar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coleccion: vista, id: id })
    }).then(cargar).then(function () { aviso('Eliminado.'); }).catch(function (e) { aviso(e.message, true); });
  }
  function mover(id, paso) {
    var arr = DATOS[vista].slice().sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
    var i = arr.map(function (x) { return x.id; }).indexOf(id), j = i + paso;
    if (i < 0 || j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    api('/api/contenido?accion=ordenar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coleccion: vista, ids: arr.map(function (x) { return x.id; }) })
    }).then(cargar).catch(function (e) { aviso(e.message, true); });
  }

  /* ---------------- fotos ---------------- */
  function subir(file) {
    return new Promise(function (resolve, reject) {
      var lector = new FileReader();
      lector.onload = function () {
        api('/api/contenido?accion=subir', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: file.name, contenidoBase64: String(lector.result).split(',')[1] })
        }).then(function (d) { resolve(d.url); }, reject);
      };
      lector.onerror = reject;
      lector.readAsDataURL(file);
    });
  }

  /* ---------------- interfaz ---------------- */
  function render() {
    $('#wrap').innerHTML =
      '<div class="adm-tabs">' + [['propiedades', 'Propiedades'], ['momentos', 'Momentos'], ['casos', 'Casos de éxito']].map(function (v) {
        return '<button type="button" data-v="' + v[0] + '" aria-selected="' + (vista === v[0]) + '">' + v[1] + ' (' + DATOS[v[0]].length + ')</button>';
      }).join('') + '</div><div class="adm-msg" id="msg"></div><div class="adm-grid"><div id="lista"></div><div id="form"></div></div>';
    $$('.adm-tabs button').forEach(function (b) { b.addEventListener('click', function () { vista = b.dataset.v; edit = null; render(); }); });
    lista(); formulario();
  }

  function lista() {
    var cont = $('#lista');
    var items = DATOS[vista].slice().sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
    cont.innerHTML = '<h2 style="font-family:var(--display);font-size:22px;font-weight:600;margin-bottom:12px">' +
      ({ propiedades: 'Propiedades', momentos: 'Fotos de momentos', casos: 'Casos de éxito' })[vista] + '</h2>' +
      (items.length ? '<div class="adm-list">' + items.map(function (x) {
        var foto = (x.fotos && x.fotos[0]) || x.foto || '';
        var sub = vista === 'propiedades'
          ? esc(x.barrio || '') + ' · ' + esc(x.op || '') + (x.precio ? ' · ' + (x.mon === 'ARS' ? '$' : 'USD ') + x.precio : '')
          : esc(x.lugar || x.categoria || '');
        return '<div class="adm-item">' + (foto ? '<img src="' + foto + '" alt="">' : '<img alt="">') +
          '<div class="t"><b>' + esc(x.titulo || '(sin título)') + '</b><span>' + sub + (x.publicada === false ? ' · oculta' : '') + '</span></div>' +
          '<button type="button" data-sube="' + x.id + '" aria-label="Subir">↑</button>' +
          '<button type="button" data-baja="' + x.id + '" aria-label="Bajar">↓</button>' +
          (vista === 'propiedades' ? '<button type="button" data-pub="' + x.id + '">' + (x.publicada === false ? 'Publicar' : 'Ocultar') + '</button>' : '') +
          '<button type="button" data-e="' + x.id + '">Editar</button>' +
          '<button type="button" class="del" data-d="' + x.id + '">Borrar</button></div>';
      }).join('') + '</div>' : '<p class="adm-vacio">Todavía no hay nada cargado.</p>');

    $$('[data-e]', cont).forEach(function (b) { b.addEventListener('click', function () { edit = DATOS[vista].filter(function (x) { return x.id === b.dataset.e; })[0]; formulario(); window.scrollTo({ top: 0, behavior: 'smooth' }); }); });
    $$('[data-d]', cont).forEach(function (b) { b.addEventListener('click', function () { var x = DATOS[vista].filter(function (y) { return y.id === b.dataset.d; })[0]; borrar(b.dataset.d, (x && x.titulo) || b.dataset.d); }); });
    $$('[data-sube]', cont).forEach(function (b) { b.addEventListener('click', function () { mover(b.dataset.sube, -1); }); });
    $$('[data-baja]', cont).forEach(function (b) { b.addEventListener('click', function () { mover(b.dataset.baja, 1); }); });
    $$('[data-pub]', cont).forEach(function (b) {
      b.addEventListener('click', function () {
        var x = DATOS[vista].filter(function (y) { return y.id === b.dataset.pub; })[0];
        guardar(Object.assign({}, x, { publicada: x.publicada === false })).catch(function (e) { aviso(e.message, true); });
      });
    });
  }

  function campo(l, n, v, tipo, opts) {
    if (tipo === 'select') return '<label>' + l + '<select name="' + n + '">' + opts.map(function (o) { return '<option' + (String(v) === String(o) ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label>';
    if (tipo === 'area') return '<label>' + l + '<textarea name="' + n + '">' + esc(v) + '</textarea></label>';
    if (tipo === 'check') return '<label style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" name="' + n + '" ' + (v ? 'checked' : '') + ' style="width:20px;min-height:20px">' + l + '</label>';
    return '<label>' + l + '<input name="' + n + '" type="' + (tipo || 'text') + '" value="' + esc(v) + '"></label>';
  }

  function formulario() {
    var cont = $('#form'), d = edit || {};
    var fotos = vista === 'propiedades' ? (d.fotos ? d.fotos.slice() : []) : (d.foto ? [d.foto] : []);

    function dibujar() {
      var campos = '';
      if (vista === 'propiedades') {
        campos =
          campo('Título', 'titulo', d.titulo || '') +
          '<div class="adm-row">' + campo('Barrio', 'barrio', d.barrio || '') + campo('Operación', 'op', d.op || 'Venta', 'select', ['Venta', 'Alquiler', 'Emprendimiento']) + '</div>' +
          '<div class="adm-row tres">' + campo('Tipo', 'tipo', d.tipo || 'Departamento', 'select', ['Departamento', 'PH', 'Casa', 'Terreno', 'Local', 'Oficina']) + campo('Ambientes', 'amb', d.amb || '', 'number') + campo('Superficie m²', 'm2', d.m2 || '', 'number') + '</div>' +
          '<div class="adm-row tres">' + campo('Precio', 'precio', d.precio || '', 'number') + campo('Moneda', 'mon', d.mon || 'USD', 'select', ['USD', 'ARS']) + campo('Expensas', 'expensas', d.expensas || '', 'number') + '</div>' +
          '<div class="adm-row tres">' + campo('Baños', 'banos', d.banos || '', 'number') + campo('Cocheras', 'cochera', d.cochera || 0, 'number') + campo('Orden', 'orden', d.orden || 1, 'number') + '</div>' +
          '<div class="adm-row">' + campo('Dirección exacta (uso interno, no se publica)', 'dirInterna', d.dirInterna || '') + campo('Antigüedad', 'ant', d.ant || '') + '</div>' +
          '<div class="adm-row">' + campo('Zona aproximada (se publica)', 'zona', d.zona || '') + campo('Orientación', 'orient', d.orient || '') + '</div>' +
          '<div class="adm-row">' + campo('Etiqueta de la tarjeta', 'etiqueta', d.etiqueta || '') + campo('Extras separados por coma', 'extras', (d.extras || []).join(', ')) + '</div>' +
          campo('Descripción', 'desc', d.desc || '', 'area') +
          '<div class="adm-row">' + campo('Apto crédito', 'credito', d.credito, 'check') + campo('Publicada', 'publicada', d.publicada !== false, 'check') + '</div>';
      } else if (vista === 'momentos') {
        campos = campo('Título (opcional)', 'titulo', d.titulo || '') +
          '<div class="adm-row">' + campo('Lugar o fecha', 'lugar', d.lugar || '') + campo('Orden', 'orden', d.orden || 1, 'number') + '</div>';
      } else {
        campos = campo('Título', 'titulo', d.titulo || '') +
          '<div class="adm-row">' + campo('Categoría', 'categoria', d.categoria || '') + campo('Barrio', 'barrio', d.barrio || '') + '</div>' +
          campo('Resumen', 'resumen', d.resumen || '', 'area') +
          '<div class="adm-row tres">' + campo('Dato 1', 'kpi1', (d.kpis || [])[0] || '') + campo('Dato 2', 'kpi2', (d.kpis || [])[1] || '') + campo('Orden', 'orden', d.orden || 1, 'number') + '</div>';
      }

      cont.innerHTML = '<form class="adm-form" id="f"><h2 style="font-family:var(--display);font-size:22px;font-weight:600">' +
        (edit ? 'Editar' : 'Agregar') + ' ' + ({ propiedades: 'propiedad', momentos: 'momento', casos: 'caso' })[vista] + '</h2>' + campos +
        '<div><div style="font-size:13px;font-weight:600;color:var(--ink2);margin-bottom:8px">' + (vista === 'propiedades' ? 'Fotos (la primera es la portada)' : 'Foto') + '</div>' +
        '<div class="adm-fotos">' + fotos.map(function (u, i) {
          return '<div class="adm-foto"><img src="' + u + '" alt=""><span class="pos">' + (i === 0 ? 'portada' : i + 1) + '</span><button type="button" data-q="' + i + '" aria-label="Quitar">×</button></div>';
        }).join('') + '<label class="adm-drop">+<input type="file" accept="image/*" ' + (vista === 'propiedades' ? 'multiple' : '') + ' hidden></label></div></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="submit" class="btn btn-primary">Guardar</button>' +
        (edit ? '<button type="button" class="btn btn-outline" id="cancelar">Cancelar</button>' : '') + '</div></form>';

      $$('.adm-foto button', cont).forEach(function (b) { b.addEventListener('click', function () { fotos.splice(Number(b.dataset.q), 1); dibujar(); }); });
      var inp = $('.adm-drop input', cont);
      inp.addEventListener('change', function () {
        var archivos = Array.prototype.slice.call(inp.files);
        if (!archivos.length) return;
        inp.parentNode.textContent = '…';
        archivos.reduce(function (cad, f) {
          return cad.then(function () { return subir(f).then(function (u) { if (vista !== 'propiedades') fotos.length = 0; fotos.push(u); }); });
        }, Promise.resolve()).then(dibujar, function (e) { alert('No se pudo subir: ' + e.message); dibujar(); });
      });
      if ($('#cancelar')) $('#cancelar').addEventListener('click', function () { edit = null; formulario(); });

      $('#f').addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this), o = { id: d.id };
        fd.forEach(function (v, k) { o[k] = v; });
        if (vista === 'propiedades') {
          ['amb', 'm2', 'precio', 'expensas', 'banos', 'cochera', 'orden'].forEach(function (k) { o[k] = o[k] ? Number(o[k]) : undefined; });
          o.credito = !!fd.get('credito'); o.publicada = !!fd.get('publicada');
          o.extras = (o.extras || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
          o.fotos = fotos.slice();
          o.tags = []; if (o.credito) o.tags.push('credito'); if (o.cochera) o.tags.push('cochera');
          o.specs = [o.m2 ? o.m2 + ' m²' : '', o.amb ? o.amb + ' amb.' : '', o.cochera ? o.cochera + ' cochera' + (o.cochera > 1 ? 's' : '') : '', o.expensas ? 'Expensas $' + o.expensas : ''].filter(Boolean);
          o.ilus = d.ilus || 'frente';
          if (!o.titulo || !o.barrio) return aviso('Completá al menos el título y el barrio.', true);
        } else if (vista === 'momentos') {
          o.foto = fotos[0] || ''; o.orden = Number(o.orden || 1);
          if (!o.foto) return aviso('Subí una foto.', true);
        } else {
          o.foto = fotos[0] || ''; o.orden = Number(o.orden || 1);
          o.kpis = [o.kpi1, o.kpi2].filter(Boolean); delete o.kpi1; delete o.kpi2;
          if (!o.titulo) return aviso('Completá el título.', true);
        }
        var btn = this.querySelector('button[type="submit"]');
        btn.classList.add('is-loading');
        guardar(o).catch(function (err) { aviso(err.message, true); }).then(function () { btn.classList.remove('is-loading'); });
      });
    }
    dibujar();
  }

  /* ---------------- arranque ---------------- */
  fetch('/api/login?accion=estado', { credentials: 'same-origin' })
    .then(function (r) { return r.json(); })
    .then(function (d) { if (d.autenticado) mostrarPanel(); else mostrarLogin(); }, mostrarLogin);
})();
