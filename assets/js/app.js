
(function(){
'use strict';
var MAPA = window.MAPA_CABA;
var M2 = window.MERCADO_CABA;
var F={"hero": "/img/hero.jpg", "martin": "/img/martin.jpg", "q1": "/img/q1.jpg", "q2": "/img/q2.jpg", "q3": "/img/q3.jpg", "q4": "/img/q4.jpg", "q5": "/img/q5.jpg", "q6": "/img/q6.jpg", "q7": "/img/q7.jpg", "b1": "/img/b1.jpg", "b2": "/img/b2.jpg", "b3": "/img/b3.jpg", "b5": "/img/b5.jpg", "l1": "/img/l1.jpg", "l2": "/img/l2.jpg", "l3": "/img/l3.jpg", "r1": "/img/r1.jpg", "r2": "/img/r2.jpg", "r3": "/img/r3.jpg", "estudio": "/img/estudio.jpg", "fotopro": "/img/foto-pro.jpg", "filmando": "/img/filmando.jpg", "planos": "/img/planos.jpg", "of1": "/img/of1.jpg", "vu": "/img/villaurquiza.jpg", "pc": "/img/parquechas.jpg"};
var WA = '5491124987684';
var ILUS = {"frente": "/img/ilus/frente.svg", "torre": "/img/ilus/torre.svg", "ph": "/img/ilus/ph.svg", "obra": "/img/ilus/obra.svg", "casa": "/img/ilus/casa.svg", "interior": "/img/ilus/interior.svg", "cocina": "/img/ilus/cocina.svg", "llaves": "/img/ilus/llaves.svg", "mudanza": "/img/ilus/mudanza.svg", "firma": "/img/ilus/firma.svg", "puerta": "/img/ilus/puerta.svg", "brindis": "/img/ilus/brindis.svg", "estudio": "/img/ilus/estudio.svg", "escritorio": "/img/ilus/escritorio.svg", "terreno": "/img/ilus/terreno.svg"};
var FICHAS = {
 quevedo:{banos:2,expensas:110000,ant:'A estrenar',orient:'Frente, con terraza',credito:true,cochera:1,
   desc:'Departamento de tres ambientes con terraza propia, jacuzzi exterior y parrilla, en un edificio de pocas unidades. Living comedor integrado a una cocina con isla y muebles a medida, dos dormitorios con placares completos y dos baños revestidos en mármol. Se entrega con cochera cubierta.',
   extras:['Terraza propia','Jacuzzi','Cocina con isla','Cochera cubierta','Apto crédito']},
 bustamante:{banos:2,expensas:null,ant:'Reciclado a nuevo',orient:'Patio y frente',credito:true,cochera:0,
   desc:'PH de cuatro ambientes reciclado por completo, con techos altos, vigas de madera a la vista y carpinterías originales recuperadas. Patio con parrilla, entrepiso con escritorio y una planta alta con dos dormitorios. Sin expensas.',
   extras:['Sin expensas','Patio con parrilla','Techos de madera','Entrepiso','Apto crédito']},
 lugones:{banos:1,expensas:95000,ant:'A estrenar',orient:'Contrafrente',credito:false,cochera:0,
   desc:'Dos ambientes a estrenar en un edificio con amenities: pileta, solárium, parrilla y gimnasio. Cocina integrada equipada, balcón al contrafrente y muy buena entrada de luz durante toda la mañana.',
   extras:['Pileta y solárium','Gimnasio','Parrilla','A estrenar']},
 emprendimiento:{banos:1,expensas:null,ant:'En construcción, entrega 2027',orient:'Varias orientaciones',credito:false,cochera:0,
   desc:'Emprendimiento en construcción con unidades de uno y dos ambientes, terminaciones de categoría y amenities en la terraza. Plan de pago en pesos con anticipo y cuotas durante la obra. Quedan unidades en distintos pisos y orientaciones.',
   extras:['En pozo','Plan de pago en cuotas','Amenities','Entrega 2027']},
 'col-alq':{banos:1,expensas:140000,ant:'A estrenar',orient:'Contrafrente luminoso',credito:false,cochera:0,
   desc:'Dos ambientes a estrenar a pasos de la estación de Colegiales. Cocina integrada equipada, balcón al contrafrente y amenities en la terraza. Contrato de 24 meses con actualización por índice.',
   extras:['A estrenar','Balcón','Amenities','Cocina equipada']},
 'vo-2amb':{banos:1,expensas:78000,ant:'Reciclado',orient:'Contrafrente',credito:true,cochera:0,
   desc:'Dos ambientes reciclado a nuevo en Villa Ortúzar: pisos, instalaciones, cocina y baño renovados por completo. Contrafrente luminoso y silencioso, con expensas bajas. Ideal como primera vivienda o para renta.',
   extras:['Reciclado a nuevo','Expensas bajas','Apto crédito','Luminoso']}
};

/* ---------- utilidades ---------- */
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function fmt(n){return new Intl.NumberFormat('es-AR').format(Math.round(n))}
function waLink(t){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(t)}
var NS='http://www.w3.org/2000/svg';
function el(tag,attrs){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);return e}

/* datos por barrio */
var BY={};
MAPA.b.forEach(function(b){BY[norm(b.n)]=b});
function dato(n){return M2[norm(n)]||null}
function valorM2(n){
  var d=dato(n); if(d&&d.m2) return {v:d.m2,est:false};
  var b=BY[norm(n)]; var com=b?b.c:0, vals=[];
  MAPA.b.forEach(function(x){var dx=dato(x.n); if(x.c===com&&dx&&dx.m2) vals.push(dx.m2)});
  var avg=vals.length?vals.reduce(function(a,c){return a+c},0)/vals.length:2267;
  return {v:Math.round(avg),est:true};
}
var ZP=['villa urquiza','parque chas','palermo'];
/* Corredor norte: barrios al norte de la traza de la AU 25 de Mayo,
   sobre la línea Villa Real – Puerto Madero (calculado con la geometría oficial de la Ciudad). */
var ZN=['agronomia','almagro','balvanera','belgrano','caballito','chacarita','coghlan','colegiales','monte castro','montserrat','nunez','palermo','parque chas','la paternal','puerto madero','recoleta','retiro','saavedra','san nicolas','villa crespo','villa del parque','villa devoto','villa general mitre','villa ortuzar','villa pueyrredon','villa real','villa santa rita','villa urquiza'];
var ZS=ZN.filter(function(k){return ZP.indexOf(k)<0});

/* ---------- header ---------- */
var top=$('#top'),lastY=0;
function onScroll(){
  var y=window.scrollY||0;
  top.classList.toggle('solid',y>40);
  var abierto=document.body.style.overflow==='hidden'||$('#drawer').classList.contains('open');
  top.classList.toggle('hide',!abierto&&y>lastY&&y>260);
  lastY=y;
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
var drawer=$('#drawer');
var drawerBd=$('#drawerBd');
function setDrawer(open){if(open)top.classList.remove('hide');drawer.classList.toggle('open',open);drawerBd.classList.toggle('open',open);$('#burger').setAttribute('aria-expanded',open?'true':'false');if(open)drawer.querySelector('a').focus()}
$('#burger').addEventListener('click',function(){setDrawer(!drawer.classList.contains('open'))});
drawerBd.addEventListener('click',function(){setDrawer(false)});
$$('#drawer a').forEach(function(a){a.addEventListener('click',function(){setDrawer(false)})});
document.addEventListener('keydown',function(e){
  if(!drawer.classList.contains('open'))return;
  if(e.key==='Escape'){setDrawer(false);$('#burger').focus();return}
  if(window.trapFocus)window.trapFocus(drawer,e);
});

/* ---------- mapa del hero ---------- */
(function(){
  var s=$('#heroMap'); s.setAttribute('viewBox','0 0 '+MAPA.meta.w+' '+MAPA.meta.h);
  MAPA.b.forEach(function(b,i){var p=el('path',{d:b.d});if(ZP.indexOf(norm(b.n))>-1)p.setAttribute('class','op');p.style.animationDelay=(i*0.04)+'s';s.appendChild(p)});
  var o=MAPA.meta.office;
  s.appendChild(el('circle',{cx:o[0],cy:o[1],r:6,class:'ring'}));
  s.appendChild(el('circle',{cx:o[0],cy:o[1],r:5,class:'pin'}));
})();

/* ---------- propiedades (muestra) ---------- */
var PROPS=[
  {id:'quevedo',ilus:'torre',fotos:[F.q1,F.q3,F.q2,F.q7,F.q4,F.q5,F.q6],titulo:'Departamento de 3 ambientes con terraza y jacuzzi',barrio:'Villa del Parque',op:'Venta',tipo:'Departamento',amb:3,m2:88,precio:215000,mon:'USD',tags:['exterior','credito','amenities'],etiqueta:'Terraza propia',destacada:true,orden:1,specs:['88 m²','3 amb.','Terraza','Jacuzzi']},
  {id:'bustamante',ilus:'ph',fotos:[F.b1,F.b2,F.b3,F.b5],titulo:'PH reciclado con patio y detalles de época',barrio:'Almagro',op:'Venta',tipo:'PH',amb:4,m2:120,precio:239000,mon:'USD',tags:['exterior','credito'],etiqueta:'Sin expensas',destacada:true,orden:2,specs:['120 m²','4 amb.','Patio','Sin expensas']},
  {id:'lugones',ilus:'interior',fotos:[F.l2,F.l1,F.l3],titulo:'Semipiso a estrenar con amenities y solárium',barrio:'Núñez',op:'Venta',tipo:'Departamento',amb:2,m2:58,precio:189000,mon:'USD',tags:['amenities','exterior'],etiqueta:'A estrenar',gold:true,destacada:true,orden:3,specs:['58 m²','2 amb.','Pileta','Solárium']},
  {id:'emprendimiento',ilus:'obra',fotos:[F.r1,F.r2,F.r3],titulo:'Emprendimiento: unidades de 1 y 2 ambientes',barrio:'Villa Urquiza',op:'Emprendimiento',tipo:'Departamento',amb:2,m2:46,precio:129000,mon:'USD',desde:true,tags:['amenities','exterior'],etiqueta:'En pozo',destacada:true,orden:4,specs:['Desde 46 m²','1 y 2 amb.','Amenities','Entrega 2027']},
  {id:'col-alq',ilus:'interior',fotos:[],titulo:'2 ambientes luminoso a estrenar',barrio:'Colegiales',op:'Alquiler',tipo:'Departamento',amb:2,m2:46,precio:780000,mon:'ARS',tags:['exterior','amenities'],etiqueta:'Alquiler',destacada:true,orden:5,specs:['46 m²','2 amb.','Balcón','Amenities']},
  {id:'vo-2amb',ilus:'cocina',fotos:[],titulo:'2 ambientes reciclado a nuevo',barrio:'Villa Ortúzar',op:'Venta',tipo:'Departamento',amb:2,m2:52,precio:149000,mon:'USD',tags:['credito'],etiqueta:'Apto crédito',destacada:true,orden:6,specs:['52 m²','2 amb.','Reciclado','Contrafrente']}
];
var favs=[];try{favs=JSON.parse(localStorage.getItem('gi_favs')||'[]')}catch(e){favs=[]}
function saveFavs(){try{localStorage.setItem('gi_favs',JSON.stringify(favs))}catch(e){}}

function silhouette(svg,name){
  var b=BY[norm(name)]; if(!b) return;
  var p=el('path',{d:b.d}); svg.appendChild(p);
  try{var bb=p.getBBox();var pad=Math.max(bb.width,bb.height)*.06;svg.setAttribute('viewBox',(bb.x-pad)+' '+(bb.y-pad)+' '+(bb.width+pad*2)+' '+(bb.height+pad*2))}catch(e){}
}
function priceTxt(p){return (p.desde?'Desde ':'')+(p.mon==='ARS'?'$ '+fmt(p.precio)+' /mes':'USD '+fmt(p.precio))}

function renderCards(list){
  var c=$('#cards'); c.innerHTML='';
  if(!list.length){c.innerHTML='<div class="empty">No encontramos propiedades con esos filtros. Probá quitando alguno o <a href="#contacto" class="u-link">contanos qué buscás</a> y te avisamos cuando entre algo así.</div>';return}
  list.forEach(function(p){
    var ref=valorM2(p.barrio);
    var a=document.createElement('article'); a.className='card';
    var ppm=(p.mon==='USD')?Math.round(p.precio/p.m2):null;
    var fotos=(p.fotos&&p.fotos.length)?p.fotos:[ILUS[p.ilus]];
    var slides=fotos.map(function(u,idx){return '<img src="'+u+'" alt="'+(idx?'Foto '+(idx+1)+' de ':'')+p.titulo+'" loading="lazy">'}).join('');
    a.innerHTML='<div class="card-media"><div class="carr"><div class="carr-track">'+slides+'</div>'+
      (fotos.length>1?'<button type="button" class="carr-btn prev" aria-label="Foto anterior">←</button><button type="button" class="carr-btn next" aria-label="Foto siguiente">→</button><div class="carr-dots">'+fotos.map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div><span class="carr-count">1/'+fotos.length+'</span>':'')+
      '</div><span class="bname">'+p.barrio+'</span><span class="tag'+(p.gold?' gold':'')+'">'+p.etiqueta+'</span><button class="fav" type="button" aria-label="Guardar en favoritos" aria-pressed="'+(favs.indexOf(p.id)>-1)+'"><svg viewBox="0 0 24 24"><path d="M20.8 8.6c0 4.8-8.8 10-8.8 10s-8.8-5.2-8.8-10a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2z"/></svg></button></div>'+
      '<div class="card-body"><span class="z">'+p.barrio+' · '+(p.op==='Emprendimiento'?'Emprendimiento':p.op)+'</span><h3>'+p.titulo+'</h3><div class="specs">'+p.specs.map(function(s){return '<span>'+s+'</span>'}).join('<span aria-hidden="true">·</span>')+'</div>'+
      '<div class="card-foot"><div><div class="price">'+priceTxt(p)+'</div>'+(ppm?'<div class="m2ref">US$ '+fmt(ppm)+'/m² · barrio US$ '+fmt(ref.v)+'/m²</div>':'<div class="m2ref">Alquiler mensual</div>')+'</div><button type="button" class="btn btn-secondary" data-ficha="'+p.id+'">Ver ficha</button></div></div>';
    c.appendChild(a);
    a.querySelector('[data-ficha]').addEventListener('click',function(){abrirFicha(p)});
    carrusel(a.querySelector('.carr'),fotos.length,function(){abrirFicha(p)});
    a.querySelector('.fav').addEventListener('click',function(){var i=favs.indexOf(p.id);if(i>-1)favs.splice(i,1);else favs.push(p.id);this.setAttribute('aria-pressed',i===-1);saveFavs()});
  });
}



/* ---------- carrusel reutilizable ---------- */
function carrusel(root,total,onTap,onChange){
  if(!root)return null;
  var track=root.querySelector('.carr-track'),dots=root.querySelectorAll('.carr-dots i'),count=root.querySelector('.carr-count'),i=0;
  function ir(n){
    i=(n+total)%total;
    track.style.transform='translateX('+(-i*100)+'%)';
    dots.forEach(function(d,k){d.classList.toggle('on',k===i)});
    if(count)count.textContent=(i+1)+'/'+total;
    if(onChange)onChange(i);
  }
  var p=root.querySelector('.carr-btn.prev'),n=root.querySelector('.carr-btn.next');
  if(p)p.addEventListener('click',function(e){e.stopPropagation();ir(i-1)});
  if(n)n.addEventListener('click',function(e){e.stopPropagation();ir(i+1)});
  var x0=null,y0=null,mov=false;
  root.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY;mov=false},{passive:true});
  root.addEventListener('touchmove',function(e){
    if(x0===null)return;
    var dx=e.touches[0].clientX-x0,dy=e.touches[0].clientY-y0;
    if(Math.abs(dx)>30&&Math.abs(dx)>Math.abs(dy)){mov=true}
  },{passive:true});
  root.addEventListener('touchend',function(e){
    if(x0===null)return;
    var dx=(e.changedTouches[0].clientX-x0);
    if(mov&&Math.abs(dx)>40){ir(i+(dx<0?1:-1))}
    else if(!mov&&onTap)onTap(i);
    x0=null;
  });
  root.addEventListener('click',function(e){if(onTap&&!e.target.closest('.carr-btn'))onTap(i)});
  root.style.cursor=onTap?'pointer':'';
  return {ir:function(n){ir(n)},get:function(){return i}};
}

/* ---------- visor a pantalla completa ---------- */
var LB={fotos:[],i:0,prev:null};
function abrirVisor(fotos,i,alt){
  if(!fotos||!fotos.length)return;
  LB.fotos=fotos;LB.prev=document.activeElement;
  var lb=$('#lb');
  $('#lbFoot').innerHTML=fotos.length>1?fotos.map(function(u,k){return '<button type="button" data-k="'+k+'" aria-label="Ver imagen '+(k+1)+'"><img src="'+u+'" alt=""></button>'}).join(''):'';
  $$('#lbFoot button').forEach(function(b){b.addEventListener('click',function(){verVisor(Number(b.dataset.k))})});
  $('#lbImg').alt=alt||'';
  lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  verVisor(i||0);$('#lbX').focus();
}
function verVisor(i){
  LB.i=(i+LB.fotos.length)%LB.fotos.length;
  var img=$('#lbImg');img.classList.remove('zoom');img.src=LB.fotos[LB.i];
  $('#lbN').textContent=(LB.i+1)+' / '+LB.fotos.length;
  $$('#lbFoot button').forEach(function(b){b.setAttribute('aria-current',Number(b.dataset.k)===LB.i)});
  var uno=LB.fotos.length<2;$('#lbPrev').hidden=uno;$('#lbNext').hidden=uno;
}
function cerrarVisor(){var lb=$('#lb');lb.classList.remove('open');lb.setAttribute('aria-hidden','true');if(!$('#ficha').classList.contains('open'))document.body.style.overflow='';if(LB.prev)LB.prev.focus()}
$('#lbX').addEventListener('click',cerrarVisor);
$('#lbPrev').addEventListener('click',function(){verVisor(LB.i-1)});
$('#lbNext').addEventListener('click',function(){verVisor(LB.i+1)});
$('#lbImg').addEventListener('click',function(){this.classList.toggle('zoom')});
(function(){var x0=null;var b=document.querySelector('.lb-body');
  b.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  b.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)verVisor(LB.i+(dx<0?1:-1));x0=null});
})();
document.addEventListener('keydown',function(e){
  if(!$('#lb').classList.contains('open'))return;
  if(e.key==='Escape'){e.stopImmediatePropagation();cerrarVisor();return}
  if(e.key==='ArrowRight')verVisor(LB.i+1);
  if(e.key==='ArrowLeft')verVisor(LB.i-1);
});

/* ---------- ficha de propiedad ---------- */
var modal=$('#ficha'),modalCard=$('#fichaCard'),lastFocus=null;
function mapaGoogle(consulta,alto,titulo){
  var q=encodeURIComponent(consulta);
  return '<div class="gmap" style="height:'+alto+'px">'+
    '<div class="gmap-fb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg><span>'+titulo+'</span>'+
      '<a class="btn btn-outline" style="min-height:40px;padding:0 16px;font-size:13px" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+q+'">Abrir en Google Maps ↗</a></div>'+
    '<iframe title="Mapa de '+titulo+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q='+q+'&z=14&output=embed"></iframe></div>';
}
function activarMapas(cont){
  $$('.gmap',cont||document).forEach(function(box){
    var f=box.querySelector('iframe');if(!f||f.dataset.ok)return;
    f.dataset.ok='1';
    var tm=setTimeout(function(){box.classList.remove('conmapa')},2600);
    f.addEventListener('load',function(){clearTimeout(tm);box.classList.add('conmapa')});
    f.addEventListener('error',function(){clearTimeout(tm);box.classList.remove('conmapa')});
  });
}
function miniMapa(barrio){
  return '<div class="mini-map"><span class="lbl">Ubicación aproximada</span>'+
    mapaGoogle(barrio+', Ciudad Autónoma de Buenos Aires',170,barrio)+
    '<p class="u-muted" style="margin-top:8px">Mostramos la zona, no la dirección exacta. Te la pasamos al coordinar la visita.</p></div>';
}
window.trapFocus=trapFocus;
function trapFocus(cont,e){
  if(e.key!=='Tab')return;
  var f=cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if(!f.length)return;
  var first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
}
function abrirFicha(p){
  var f=FICHAS[p.id]||{},ref=valorM2(p.barrio),usd=p.mon==='USD',ppm=usd?Math.round(p.precio/p.m2):null;
  var filas=[['Operación',p.op],['Tipo',p.tipo],['Ambientes',p.amb],['Baños',f.banos||'—'],['Superficie',p.m2+' m²'],
    ['Cochera',f.cochera?f.cochera+(f.cochera>1?' cocheras':' cochera'):'No'],['Expensas',f.expensas?'$ '+fmt(f.expensas):'Sin expensas'],
    ['Antigüedad',f.ant||'—'],['Zona',p.zona||p.barrio],['Orientación',f.orient||'—'],['Apto crédito',f.credito?'Sí':'No']];
  modalCard.innerHTML=
    '<button type="button" class="modal-x" id="fichaX" aria-label="Cerrar la ficha">×</button>'+
    '<div class="ficha-hero" id="fichaGal"></div>'+
    '<div class="ficha-body"><div>'+
      '<span class="lbl">'+p.barrio+' · '+p.op+'</span>'+
      '<h3 class="u-mt-3" id="fichaTitulo">'+p.titulo+'</h3>'+
      '<div class="specs-grid">'+
        '<div><small>Superficie</small><span>'+p.m2+' m²</span></div>'+
        '<div><small>Ambientes</small><span>'+p.amb+'</span></div>'+
        '<div><small>Baños</small><span>'+(f.banos||'—')+'</span></div>'+
        '<div><small>'+(usd?'USD por m²':'Expensas')+'</small><span>'+(usd?fmt(ppm):(f.expensas?'$'+fmt(f.expensas):'—'))+'</span></div>'+
      '</div>'+
      '<p class="ficha-desc">'+(f.desc||'')+'</p>'+
      (f.extras?'<div class="quick u-mt-5">'+f.extras.map(function(x){return '<span class="chip" style="cursor:default">'+x+'</span>'}).join('')+'</div>':'')+
      '<h3 class="u-mt-6" style="font-size:22px">Detalle</h3><div class="ficha-list">'+filas.map(function(r){return '<div><span style="color:var(--muted)">'+r[0]+'</span><span>'+r[1]+'</span></div>'}).join('')+'</div>'+

    '</div>'+
    '<aside class="ficha-aside">'+
      '<div class="price-box"><span class="lbl">'+(p.op==='Alquiler'?'Alquiler mensual':'Precio')+'</span><div class="p">'+priceTxt(p)+'</div>'+
        (usd?'<div class="u-muted u-mt-2">US$ '+fmt(ppm)+' por m²</div>':'')+
        '<div class="u-mt-5" style="display:flex;flex-direction:column;gap:8px">'+
          '<a class="btn btn-primary" target="_blank" rel="noopener" href="'+waLink('Hola, me interesa: '+p.titulo+' en '+p.barrio+' ('+priceTxt(p)+'). ¿Puedo coordinar una visita?')+'">Consultar por WhatsApp</a>'+
          '<a class="btn btn-outline" href="#contacto" data-cerrar>Agendar visita</a>'+
        '</div>'+
        '<div class="u-mt-5" style="display:flex;gap:12px;align-items:center;border-top:1px solid var(--line);padding-top:16px"><div><b style="font-size:15px">Martín González</b><div class="u-muted">Corredor · CPI MN 524</div><a class="u-link" href="tel:+541124987684">11 2498-7684</a></div></div>'+
      '</div>'+
      miniMapa(p.barrio)+
    '</aside></div>';
  var fotos=(p.fotos&&p.fotos.length)?p.fotos:[ILUS[p.ilus]];
  var gal=$('#fichaGal');
  gal.innerHTML='<div class="carr"><div class="carr-track">'+fotos.map(function(u,k){return '<img src="'+u+'" alt="'+p.titulo+' · imagen '+(k+1)+'">'}).join('')+'</div>'+
    (fotos.length>1?'<button type="button" class="carr-btn prev" aria-label="Imagen anterior">←</button><button type="button" class="carr-btn next" aria-label="Imagen siguiente">→</button><span class="carr-count">1/'+fotos.length+'</span>':'')+
    '</div><span class="gal-hint">⤢ Tocá la foto para verla en grande</span>'+
    '<div class="ficha-tags"><span class="tag'+(p.gold?' gold':'')+'">'+p.etiqueta+'</span><span class="tag">'+p.barrio+'</span></div>';
  var ctrl=carrusel(gal.querySelector('.carr'),fotos.length,function(i){abrirVisor(fotos,i,p.titulo)},function(i){
    $$('#fichaThumbs button').forEach(function(b,k){b.setAttribute('aria-current',k===i)});
  });
  if(fotos.length>1){
    gal.insertAdjacentHTML('afterend','<div class="gal-thumbs" id="fichaThumbs">'+fotos.map(function(u,k){return '<button type="button" aria-current="'+(k===0)+'" aria-label="Ver imagen '+(k+1)+'"><img src="'+u+'" alt="" loading="lazy"></button>'}).join('')+'</div>');
    $$('#fichaThumbs button').forEach(function(b,k){b.addEventListener('click',function(){ctrl.ir(k)})});
  }
  var lista=(LISTA&&LISTA.length?LISTA:PROPS.filter(function(x){return x.destacada}));
  var i=lista.map(function(x){return x.id}).indexOf(p.id);
  if(i>-1&&lista.length>1){
    var prev=lista[(i-1+lista.length)%lista.length],next=lista[(i+1)%lista.length];
    modalCard.insertAdjacentHTML('beforeend','<div class="ficha-nav"><button type="button" class="btn btn-outline" data-nav="prev">← '+prev.barrio+'</button><span class="u-muted">'+(i+1)+' de '+lista.length+'</span><button type="button" class="btn btn-outline" data-nav="next">'+next.barrio+' →</button></div>');
    modalCard.querySelector('[data-nav="prev"]').addEventListener('click',function(){abrirFicha(prev)});
    modalCard.querySelector('[data-nav="next"]').addEventListener('click',function(){abrirFicha(next)});
    modalCard._nav={prev:prev,next:next};
  } else { modalCard._nav=null; }
  if(!modal.classList.contains('open'))lastFocus=document.activeElement;
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  $('#fichaX').focus();
  $('#fichaX').addEventListener('click',cerrarFicha);
  activarMapas(modalCard);
  $$('#fichaCard [data-cerrar]').forEach(function(a){a.addEventListener('click',cerrarFicha)});
}
function cerrarFicha(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus)lastFocus.focus()}
modal.addEventListener('click',function(e){if(e.target===modal)cerrarFicha()});
document.addEventListener('keydown',function(e){
  if(!modal.classList.contains('open'))return;
  if($('#lb').classList.contains('open'))return;   /* el visor tiene prioridad */
  if(e.key==='Escape')return cerrarFicha();
  if(e.key==='ArrowRight'&&modalCard._nav)abrirFicha(modalCard._nav.next);
  if(e.key==='ArrowLeft'&&modalCard._nav)abrirFicha(modalCard._nav.prev);
  trapFocus(modalCard,e);
});

/* ---------- buscador ---------- */
var S={op:'Venta',q:{}},LISTA=[];
(function(){
  var sel=$('#s-zona');
  var names=MAPA.b.map(function(b){return b.n}).sort(function(a,b){return a.localeCompare(b,'es')});
  names.forEach(function(n){var o=document.createElement('option');o.value=n;o.textContent=n;sel.appendChild(o)});
})();
$$('#search .tabs button').forEach(function(b){b.addEventListener('click',function(){
  $$('#search .tabs button').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');S.op=b.dataset.op;
  $('#s-max-l').textContent=S.op==='Alquiler'?'Hasta ($/mes)':'Hasta (USD)';applySearch(false);
})});
$$('#search .quick .chip').forEach(function(b){b.addEventListener('click',function(){var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);S.q[b.dataset.q]=on;applySearch(false)})});
['#s-zona','#s-tipo','#s-amb'].forEach(function(id){$(id).addEventListener('change',function(){applySearch(false)})});
$('#s-max').addEventListener('input',function(){this.value=this.value.replace(/[^\d.]/g,'');});
$('#search').addEventListener('submit',function(e){e.preventDefault();applySearch(true)});
function applySearch(scroll){
  var z=$('#s-zona').value,tp=$('#s-tipo').value,a=$('#s-amb').value,mx=Number(String($('#s-max').value).replace(/\./g,''))||0;
  var activos=Boolean(z||tp||a||mx||S.q.credito||S.q.cochera||S.q.exterior||S.q.fav);
  var r=PROPS.filter(function(p){
    if(p.op!==S.op)return false;
    if(z&&norm(p.barrio)!==norm(z))return false;
    if(tp&&p.tipo!==tp)return false;
    if(a&&(a==='4'?p.amb<4:p.amb!==Number(a)))return false;
    if(mx&&p.precio>mx)return false;
    if(S.q.credito&&p.tags.indexOf('credito')<0)return false;
    if(S.q.cochera&&p.tags.indexOf('cochera')<0)return false;
    if(S.q.exterior&&p.tags.indexOf('exterior')<0)return false;
    if(S.q.fav&&favs.indexOf(p.id)<0)return false;
    return true});
  var txt=r.length+(r.length===1?' propiedad':' propiedades');
  $('#count').textContent=txt;
  $('#limpiar').hidden=!activos;
  if(activos||S.op!=='Venta'){
    $('#propsLbl').textContent='Resultados';
    $('#propsTit').textContent=txt+(S.op==='Venta'?' en venta':S.op==='Alquiler'?' en alquiler':' en pozo');
    $('#propsSub').textContent=[z,tp,a?(a==='4'?'4+ ambientes':a+' ambientes'):'',S.q.credito?'apto crédito':'',S.q.cochera?'con cochera':'',S.q.exterior?'con balcón o patio':'',S.q.fav?'entre tus favoritos':''].filter(Boolean).join(' · ')||'Sin filtros adicionales.';
  }else{
    $('#propsLbl').textContent='Selección';
    $('#propsTit').textContent='Propiedades destacadas';
    $('#propsSub').textContent='Una muestra de lo que tenemos disponible hoy.';
  }
  LISTA=r;
  renderCards(r);
  if(scroll)document.getElementById('propiedades').scrollIntoView({behavior:'smooth'});
}
applySearch(false);
$('#limpiar').addEventListener('click',function(){
  $('#s-zona').value='';$('#s-tipo').value='';$('#s-amb').value='';$('#s-max').value='';
  S.q={};$$('#search .quick .chip').forEach(function(c){c.setAttribute('aria-pressed','false')});
  applySearch(false);$('#s-zona').focus();
});

/* ---------- simulador de tasación ---------- */
var T={step:1,tipo:'Departamento',amb:'2',estado:'1',x:{}};
(function(){
  var sel=$('#t-barrio');
  var names=MAPA.b.map(function(b){return b.n}).sort(function(a,b){return a.localeCompare(b,'es')});
  names.forEach(function(n){var o=document.createElement('option');o.value=n;var v=valorM2(n);o.textContent=n+' · US$ '+fmt(v.v)+'/m²'+(v.est?' (estimado)':'');if(norm(n)==='villa urquiza')o.selected=true;sel.appendChild(o)});
})();
$$('#tform .segment').forEach(function(g){$$('button',g).forEach(function(b){b.addEventListener('click',function(){$$('button',g).forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');T[g.dataset.name]=b.dataset.v;preview()})})});
$$('#tform [data-x]').forEach(function(b){b.addEventListener('click',function(){var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);T.x[b.dataset.x]=on;preview()})});
['#t-barrio','#t-ant'].forEach(function(id){$(id).addEventListener('change',preview)});
$('#t-m2').addEventListener('input',function(){this.value=this.value.replace(/\D/g,'').slice(0,4);preview()});

function calc(){
  var barrio=$('#t-barrio').value, ref=valorM2(barrio);
  var m2=Number($('#t-m2').value)||0;
  var fTipo={Departamento:1,PH:0.93,Casa:0.86}[T.tipo];
  var fAmb={'1':1.09,'2':1,'3':0.92,'4':0.88}[T.amb];
  var fAnt=Number($('#t-ant').value), fEst=Number(T.estado);
  var fx=1*(T.x.exterior?1.03:1)*(T.x.amenities?1.04:1)*(T.x.luz?1.02:1);
  var base=ref.v*fTipo*fAmb*fAnt*fEst*fx;
  var coch=T.x.cochera?Math.round(24000*(ref.v/2500)/1000)*1000:0;
  var total=m2*base+coch;
  return {barrio:barrio,ref:ref,m2:m2,ppm:base,coch:coch,total:total,min:total*0.92,max:total*1.08,f:{fTipo:fTipo,fAmb:fAmb,fAnt:fAnt,fEst:fEst,fx:fx}};
}
var ALL=MAPA.b.map(function(b){return valorM2(b.n).v}),VMIN=Math.min.apply(null,ALL),VMAX=Math.max.apply(null,ALL);
function preview(){
  var c=calc();
  $('#sum1').textContent=c.barrio+' · '+T.tipo+' · '+(T.amb==='4'?'4+':T.amb)+' amb.';
  if(c.m2)$('#sum2').textContent=c.m2+' m²'+(c.coch?' · cochera':'');
  var rnd=function(n){return Math.round(n/1000)*1000};
  $('#rBig').textContent='USD '+fmt(rnd(c.total||0));
  $('#rRng').textContent='entre '+fmt(rnd(c.min||0))+' y '+fmt(rnd(c.max||0));
  var pos=function(v){var p=(Math.log(v)-Math.log(VMIN))/(Math.log(VMAX)-Math.log(VMIN));return Math.max(2,Math.min(98,p*100))};
  var p=pos(c.ppm||c.ref.v),lo=pos((c.ppm||c.ref.v)*.92),hi=pos((c.ppm||c.ref.v)*1.08);
  $('#gFill').style.left=lo+'%';$('#gFill').style.width=Math.max(4,hi-lo)+'%';$('#gDot').style.left=p+'%';
  $('#gMin').textContent='US$ '+fmt(VMIN)+'/m²';$('#gMax').textContent='US$ '+fmt(VMAX)+'/m²';
  var bd=$('#breakdown');
  bd.innerHTML='<div><span>Valor de referencia del barrio'+(c.ref.est?' (estimado por comuna)':'')+'</span><span>US$ '+fmt(c.ref.v)+'/m²</span></div>'+
    '<div><span>Ajustado por tipo, tamaño, antigüedad y estado</span><span>US$ '+fmt(c.ppm)+'/m²</span></div>'+
    '<div><span>Superficie</span><span>'+(c.m2||0)+' m²</span></div>'+
    (c.coch?'<div><span>Cochera</span><span>+ US$ '+fmt(c.coch)+'</span></div>':'')+
    '<div><span>Valor de cierre probable (−5% a −15%)</span><span>'+fmt(rnd(c.total*.85))+' – '+fmt(rnd(c.total*.95))+'</span></div>';
  return c;
}
function go(n){
  T.step=n;
  $$('#tform .pane').forEach(function(p){p.classList.toggle('on',Number(p.dataset.p)===n)});
  $$('#steps .step-item').forEach(function(s){var k=Number(s.dataset.s);s.classList.toggle('on',k===n);s.classList.toggle('done',k<n)});
  $('#bar').style.width=(n/3*100)+'%';$('#stepLbl').textContent='Paso '+n+' de 3';
  $('#prev').hidden=n===1;$('#next').textContent=n===3?'Ver mi estimación':'Continuar';
}
$('#prev').addEventListener('click',function(){if(T.step>1)go(T.step-1)});
$('#next').addEventListener('click',function(){
  if(T.step===1){go(2);$('#t-m2').focus();return}
  if(T.step===2){var m=Number($('#t-m2').value);if(!m||m<15||m>2000){$('#err2').classList.add('on');$('#t-m2').setAttribute('aria-invalid','true');$('#t-m2').setAttribute('aria-describedby','err2');$('#t-m2').focus();return}$('#t-m2').removeAttribute('aria-invalid');$('#err2').classList.remove('on');go(3);$('#t-nombre').focus();return}
  var n=$('#t-nombre').value.trim(),em=$('#t-mail').value.trim(),w=$('#t-wa').value.trim();
  var emOk=!em||/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em);
  if(!n||(!em&&!w)||!emOk){$('#err3').classList.add('on');
    $('#t-nombre').setAttribute('aria-invalid',!n);if(!emOk)$('#t-mail').setAttribute('aria-invalid','true');
    (!n?$('#t-nombre'):(!emOk?$('#t-mail'):$('#t-wa'))).focus();return}
  $('#err3').classList.remove('on');['#t-nombre','#t-mail','#t-wa'].forEach(function(s){$(s).removeAttribute('aria-invalid')});
  var c=preview();
  var r=$('#result');r.classList.remove('locked');r.classList.add('unlocked');
  $$('#steps .step-item').forEach(function(s){s.classList.add('done');s.classList.remove('on')});
  var msg='Hola Martín, soy '+n+'. Hice la tasación online: '+T.tipo+' de '+(T.amb==='4'?'4+':T.amb)+' ambientes, '+c.m2+' m², en '+c.barrio+'. Estimación: USD '+fmt(Math.round(c.min/1000)*1000)+' a '+fmt(Math.round(c.max/1000)*1000)+'. Quiero coordinar la tasación presencial.'+(w?' Mi WhatsApp: '+w+'.':'')+(em?' Email: '+em+'.':'');
  $('#rWa').href=waLink(msg);
  if(window.innerWidth<1100)r.scrollIntoView({behavior:'smooth',block:'center'});
});
$('#rAgain').addEventListener('click',function(){var r=$('#result');r.classList.add('locked');r.classList.remove('unlocked');$('#t-m2').value='';go(1);preview()});
preview();


/* ---------- mapa de precios (mercado) ---------- */
var CM={mode:'m2',sel:'villa urquiza'};
var PAL=['#EEF0EA','#CFDBD2','#A7C0B0','#779D88','#4A7662','#1F4A3A','#0B2B20'];
var PALV=['#9A3B2C','#D29A8D','#EFE6E2','#E7EFE9','#A9CDB8','#4C9373','#1E6B4A'];
function colorFor(d){
  if(!d||d.m2==null)return '#F2F1EC';
  if(CM.mode==='m2'){var br=[1700,1950,2200,2450,2700,2950];for(var i=0;i<br.length;i++)if(d.m2<br[i])return PAL[i];return PAL[6]}
  var v=d.var,bv=[-4,-1.5,-0.1,1.5,4,8];for(var j=0;j<bv.length;j++)if(v<bv[j])return PALV[j];return PALV[6];
}
function drawScale(){
  var s=$('#scale');
  if(CM.mode==='m2')s.innerHTML='<span>US$ 1.444</span><span class="sw">'+PAL.map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span><span>US$ 6.009</span><span class="u-push">Gris: sin dato suficiente</span>';
  else s.innerHTML='<span>−5,7%</span><span class="sw">'+PALV.map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span><span>+12,1%</span><span class="u-push">Variación interanual del US$/m²</span>';
}
function detail(k){
  var b=BY[k],d=dato(b.n);CM.sel=k;
  var v=valorM2(b.n),opera=ZN.indexOf(k)>-1;
  $('#bdetail').innerHTML='<div class="t">'+b.n+'</div>'+
    '<div><small>Valor del m²</small><span>US$ '+fmt(v.v)+(v.est?' (est.)':'')+'</span></div>'+
    '<div><small>Variación anual</small><span style="color:'+(d&&d.var!=null?(d.var>=0?'var(--up)':'var(--down)'):'inherit')+'">'+(d&&d.var!=null?(d.var>0?'+':'')+String(d.var).replace('.',',')+'%':'—')+'</span></div>'+
    '<div><small>Alquiler 2 amb.</small><span>'+(d&&d.alq?'$ '+fmt(d.alq):'—')+'</span></div>';
  $$('#cmap path').forEach(function(p){p.classList.toggle('sel',p.dataset.k===k)});
}
(function(){
  var s=$('#cmap'),tip=$('#ctip'),box=s.parentNode,paths={};
  s.setAttribute('viewBox','0 0 '+MAPA.meta.w+' '+MAPA.meta.h);
  MAPA.b.forEach(function(b){
    var k=norm(b.n),d=dato(b.n),opera=ZN.indexOf(k)>-1;
    var p=el('path',{d:b.d,tabindex:'0','aria-label':b.n});
    p.dataset.k=k;p.setAttribute('fill',colorFor(d));s.appendChild(p);paths[k]=p;
    function show(ev){var v=valorM2(b.n);tip.innerHTML='<b>'+b.n+'</b><span>'+(CM.mode==='m2'?'US$ '+fmt(v.v)+'/m²'+(v.est?' (est.)':''):(d&&d.var!=null?(d.var>0?'+':'')+String(d.var).replace('.',',')+'% anual':'sin dato'))+'</span>';tip.style.opacity=1;var r=box.getBoundingClientRect();tip.style.left=Math.min(ev.clientX-r.left+12,r.width-170)+'px';tip.style.top=(ev.clientY-r.top+12)+'px'}
    p.addEventListener('mousemove',show);p.addEventListener('mouseleave',function(){tip.style.opacity=0});
    p.addEventListener('click',function(){detail(k)});p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();detail(k)}});
  });
  var o=MAPA.meta.office;s.appendChild(el('circle',{cx:o[0],cy:o[1],r:7,'class':'ring'}));s.appendChild(el('circle',{cx:o[0],cy:o[1],r:6,'class':'pin'}));
  $$('#mercado .panel-h .tabs button').forEach(function(bt){bt.addEventListener('click',function(){
    $$('#mercado .panel-h .tabs button').forEach(function(x){x.setAttribute('aria-selected','false')});bt.setAttribute('aria-selected','true');CM.mode=bt.dataset.mode;
    $$('#cmap path').forEach(function(p){p.setAttribute('fill',colorFor(M2[p.dataset.k]))});drawScale();
  })});
  drawScale();detail('villa urquiza');
  var arr=Object.keys(M2).map(function(k){return {k:k,n:BY[k]?BY[k].n:k,v:M2[k].m2}}).filter(function(x){return x.v&&x.k!=='puerto madero'}).sort(function(a,b){return b.v-a.v}).slice(0,10);
  var mx=arr[0].v,rk=$('#rank');
  rk.innerHTML='';
  arr.forEach(function(x){var op=ZN.indexOf(x.k)>-1;var r=document.createElement('div');r.className='rank-row'+(op?' op':'');r.dataset.k=x.k;r.innerHTML='<span>'+x.n+(op?' <span class="u-gold-ink" title="Operamos acá">•</span>':'')+'</span><span class="rb"><i style="width:'+(x.v/mx*100)+'%"></i></span><span class="rank-value">'+fmt(x.v)+'</span>';rk.appendChild(r)});
  $$('#rank .rank-row').forEach(function(r){r.addEventListener('click',function(){detail(r.dataset.k);$('#cmap').scrollIntoView({behavior:'smooth',block:'center'})})});

  /* selector de barrios del corredor norte */
  var panel=$('#zdropPanel'),btnSel=$('#zdropBtn'),sel=ZP[0];
  function opcion(k){
    var b=BY[k],v=valorM2(b.n);
    var o=document.createElement('button');o.type='button';o.className='zopt';o.setAttribute('role','option');o.dataset.k=k;
    o.setAttribute('aria-selected',k===sel);
    o.innerHTML='<span>'+b.n+'</span><span class="v">US$ '+fmt(v.v)+'/m²'+(v.est?' est.':'')+'</span>';
    o.addEventListener('click',function(){elegir(k);cerrarPanel();btnSel.focus()});
    o.addEventListener('mouseenter',function(){if(paths[k])paths[k].classList.add('hl')});
    o.addEventListener('mouseleave',function(){if(paths[k])paths[k].classList.remove('hl')});
    return o;
  }
  var h1=document.createElement('div');h1.className='gh';h1.textContent='Zona principal';panel.appendChild(h1);
  ZP.forEach(function(k){panel.appendChild(opcion(k))});
  var h2=document.createElement('div');h2.className='gh';h2.textContent='Resto del corredor norte';panel.appendChild(h2);
  ZS.slice().sort(function(a,b){return (BY[a]?BY[a].n:a).localeCompare(BY[b]?BY[b].n:b,'es')}).forEach(function(k){if(BY[k])panel.appendChild(opcion(k))});

  function elegir(k){
    sel=k;var b=BY[k],v=valorM2(b.n),d=dato(b.n);
    $('#zdropSel').textContent=b.n;
    $('#zdropVal').textContent='US$ '+fmt(v.v)+'/m²';
    $$('#zdropPanel .zopt').forEach(function(o){o.setAttribute('aria-selected',o.dataset.k===k)});
    var disp=PROPS.filter(function(p){return norm(p.barrio)===k}).length;
    $('#zinfo').innerHTML=
      '<div><small>Valor del m²</small><span>US$ '+fmt(v.v)+'</span></div>'+
      '<div><small>Variación anual</small><span style="color:'+(d&&d.var!=null?(d.var>=0?'var(--up)':'var(--down)'):'inherit')+'">'+(d&&d.var!=null?(d.var>0?'+':'')+String(d.var).replace('.',',')+'%':'—')+'</span></div>'+
      '<div><small>Alquiler 2 amb.</small><span>'+(d&&d.alq?'$ '+fmt(d.alq):'—')+'</span></div>'+
      '<div class="zacc"><button type="button" class="btn btn-secondary" id="zver">'+(disp?'Ver '+disp+(disp===1?' propiedad':' propiedades')+' en '+b.n:'Avisame cuando entre algo en '+b.n)+'</button><button type="button" class="btn btn-outline" id="zmap2">Ver en el mapa</button></div>';
    $('#zver').addEventListener('click',function(){
      if(disp){$('#s-zona').value=b.n;S.op='Venta';applySearch(true)}
      else window.open(waLink('Hola, busco una propiedad en '+b.n+'. ¿Me avisan cuando entre algo?'),'_blank');
    });
    $('#zmap2').addEventListener('click',function(){detail(k);$('#mercado').scrollIntoView({behavior:'smooth'})});
    $$('#cmap path').forEach(function(p){p.classList.toggle('hl',p.dataset.k===k)});
  }
  function abrirPanel(){panel.hidden=false;btnSel.setAttribute('aria-expanded','true');var s=panel.querySelector('.zopt[aria-selected="true"]')||panel.querySelector('.zopt');if(s)s.focus()}
  function cerrarPanel(){panel.hidden=true;btnSel.setAttribute('aria-expanded','false');$$('#cmap path').forEach(function(p){p.classList.remove('hl')})}
  btnSel.addEventListener('click',function(){panel.hidden?abrirPanel():cerrarPanel()});
  document.addEventListener('click',function(e){if(!panel.hidden&&!$('#zdrop').contains(e.target))cerrarPanel()});
  document.addEventListener('keydown',function(e){
    if(panel.hidden)return;
    if(e.key==='Escape'){cerrarPanel();btnSel.focus();return}
    var ops=$$('#zdropPanel .zopt'),i=ops.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();ops[Math.min(i+1,ops.length-1)].focus()}
    if(e.key==='ArrowUp'){e.preventDefault();ops[Math.max(i-1,0)].focus()}
  });
  elegir(ZP[0]);
})();

/* ---------- mapa del contacto ---------- */
(function(){
  var box=$('#cmapbox');if(!box)return;
  box.insertAdjacentHTML('afterbegin',mapaGoogle('Arévalo 1800, Palermo, Ciudad Autónoma de Buenos Aires',400,'Arévalo 1800, Palermo'));
  activarMapas(box);
})();

/* ---------- formularios ---------- */
$('#cform').addEventListener('submit',function(e){
  e.preventDefault();var n=$('#c-n').value.trim(),t=$('#c-t').value.trim(),em=$('#c-e').value.trim();
  var ok=$('#c-ok');
  if(!n||(!t&&!em)){ok.style.background='var(--down-soft)';ok.style.color='var(--down)';ok.textContent='Completá tu nombre y un teléfono o email para poder responderte.';ok.classList.add('on');
    $('#c-n').setAttribute('aria-invalid',!n);if(!t&&!em){$('#c-t').setAttribute('aria-invalid','true');$('#c-e').setAttribute('aria-invalid','true')}
    (!n?$('#c-n'):$('#c-t')).focus();return}
  ['#c-n','#c-t','#c-e'].forEach(function(s){$(s).removeAttribute('aria-invalid')});
  var btn=this.querySelector('button[type="submit"]');btn.classList.add('is-loading');btn.setAttribute('aria-busy','true');
  setTimeout(function(){btn.classList.remove('is-loading');btn.removeAttribute('aria-busy')},700);
  var msg='Hola, soy '+n+'. '+$('#c-m').value+'. '+$('#c-x').value.trim()+(t?' Tel: '+t+'.':'')+(em?' Email: '+em+'.':'');
  ok.style.background='';ok.style.color='';ok.innerHTML='Gracias, '+n.split(' ')[0]+'. Para que tu consulta nos llegue al instante, <a href="'+waLink(msg)+'" target="_blank" rel="noopener" class="u-link">enviala por WhatsApp</a> con un toque.';ok.classList.add('on');
});
$('#nform').addEventListener('submit',function(e){
  e.preventDefault();
  var em=$('#n-e').value.trim(),aviso=$('#n-ok'),ok=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em);
  aviso.style.display='block';
  aviso.style.color=ok?'#F7C77A':'#F3B8AA';
  aviso.textContent=ok?'¡Listo! Te vamos a escribir con el próximo informe.':'Revisá el email: parece que falta algo.';
  $('#n-e').setAttribute('aria-invalid',!ok);
  if(ok){$('#n-e').removeAttribute('aria-invalid');this.reset()}
});

/* ---------- aparición ---------- */
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -60px 0px'});$$('.reveal').forEach(function(x){io.observe(x)})}else{$$('.reveal').forEach(function(x){x.classList.add('in')})}

/* ---------- asistente ---------- */
var chat=$('#chat'),fab=$('#chatFab'),body=$('#chatBody'),inp=$('#chatIn');
var HIST=[],started=false,busy=false,samplePromise=null;
function getSample(){
  if(!samplePromise){samplePromise=(window.claude&&typeof window.claude.use==='function')?window.claude.use('sample').catch(function(){return null}):Promise.resolve(null)}
  return samplePromise;
}
function openChat(){chat.classList.add('open');fab.style.display='none';fab.setAttribute('aria-expanded','true');if(!started){started=true;greet()}setTimeout(function(){inp.focus()},50)}
function closeChat(){chat.classList.remove('open');fab.style.display='';fab.setAttribute('aria-expanded','false');fab.focus()}
fab.addEventListener('click',openChat);$('#chatClose').addEventListener('click',closeChat);
$$('[data-open-chat]').forEach(function(b){b.addEventListener('click',openChat)});
document.addEventListener('keydown',function(e){
  if(!chat.classList.contains('open'))return;
  if(e.key==='Escape')return closeChat();
  if(window.trapFocus)window.trapFocus(chat,e);
});
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function linkify(s){return esc(s).replace(/\[([^\]]+)\]\((#[a-z]+|https:\/\/wa\.me\/[^\s)]+)\)/g,function(_,x,h){return '<a href="'+h+'"'+(h.charAt(0)==='#'?'':' target="_blank" rel="noopener"')+'>'+x+'</a>'}).replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>')}
function add(role,text){var m=document.createElement('div');m.className='msg '+(role==='user'?'me':'bot');m.innerHTML=role==='user'?esc(text):linkify(text);body.appendChild(m);body.scrollTop=body.scrollHeight;return m}
function sugs(list){var w=document.createElement('div');w.className='chat-sugs';list.forEach(function(t){var b=document.createElement('button');b.type='button';b.textContent=t;b.addEventListener('click',function(){w.remove();send(t)});w.appendChild(b)});body.appendChild(w);body.scrollTop=body.scrollHeight}
function greet(){add('bot','¡Hola! Soy el asistente de González Inmuebles. Puedo ayudarte a encontrar una propiedad, contarte cuánto vale el m² en cada barrio de la Ciudad o guiarte para tasar la tuya.');sugs(['Busco un 3 ambientes','¿Cuánto vale el m² en Palermo?','Quiero tasar','Hablar con Martín'])}
body.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&a.getAttribute('href').charAt(0)==='#'){if(window.innerWidth<720)closeChat()}});

function findBarrio(t){var n=norm(t),best=null;MAPA.b.forEach(function(b){var k=norm(b.n);if(n.indexOf(k)>-1&&(!best||k.length>norm(best.n).length))best=b});
  if(!best){if(/urquiza/.test(n))best=BY['villa urquiza'];else if(/chas/.test(n))best=BY['parque chas'];else if(/ortuzar/.test(n))best=BY['villa ortuzar'];else if(/nunez/.test(n))best=BY['nunez']}
  return best}
function reglas(t){
  var n=norm(t),b=findBarrio(t);
  if(/martin|humano|persona|asesor|whats|llamar|telefono|contact/.test(n))return 'Te paso directo con Martín: [escribile por WhatsApp](https://wa.me/'+WA+'?text=Hola%20Mart%C3%ADn%2C%20te%20escribo%20desde%20el%20asistente%20de%20la%20web.) o llamá al 11 2498-7684. Atendemos de lunes a viernes de 9 a 18 h en Arévalo 1800, Palermo.';
  if(/tas|cuanto vale mi|valor de mi|vender|vendo/.test(n))return 'Podés tener una referencia en dos minutos con nuestro [simulador de tasación](#tasacion): usa el valor oficial del m² de tu barrio y lo ajusta por tipo, tamaño, antigüedad y estado. Después coordinamos la visita para el valor definitivo, sin cargo.';
  if(b&&/m2|metro|vale|precio|cuesta|valor|caro/.test(n)){var v=valorM2(b.n),d=dato(b.n);return 'En **'+b.n+'** el m² de un departamento usado de 2 ambientes se ofrece en promedio a **US$ '+fmt(v.v)+'**'+(v.est?' (estimado por comuna, sin dato propio)':'')+(d&&d.var!=null?', con una variación de '+(d.var>0?'+':'')+String(d.var).replace('.',',')+'% en el último año':'')+'. Es dato oficial de la Ciudad (DGEyC, 1.er trimestre 2026) y corresponde a precios publicados; el cierre suele quedar entre 5% y 15% abajo. Podés ver todos los barrios en la sección [Mercado](#mercado).'}
  if(/alquil/.test(n)){var r=PROPS.filter(function(p){return p.op==='Alquiler'});return 'Ahora tenemos '+r.length+' opción en alquiler: '+r.map(function(p){return p.titulo+' en '+p.barrio+' ('+priceTxt(p)+')'}).join('; ')+'. Como referencia, el alquiler medio de un 2 ambientes en la Ciudad es de $ 886.527 por mes (Zonaprop, agosto 2026). Mirá las [propiedades](#propiedades).'}
  if(/credit|hipotec/.test(n)){var c=PROPS.filter(function(p){return p.tags.indexOf('credito')>-1});return 'Estas propiedades son aptas para crédito: '+c.map(function(p){return p.titulo+' en '+p.barrio+' ('+priceTxt(p)+')'}).join('; ')+'. Te ayudamos a coordinar con el banco y la escribanía.'}
  var am=n.match(/(\d)\s*amb/);
  if(am||/busco|compr|depto|departamento|casa|ph|propiedad/.test(n)){var list=PROPS.filter(function(p){return p.op!=='Alquiler'&&(!am||(am[1]==='4'?p.amb>=4:p.amb===Number(am[1])))&&(!b||norm(p.barrio)===norm(b.n))});
    if(!list.length)return 'Por ahora no tengo algo publicado con esas características'+(b?' en '+b.n:'')+'. Si querés, [dejanos tu búsqueda por WhatsApp](https://wa.me/'+WA+'?text=Hola%2C%20busco%20una%20propiedad.) y te avisamos apenas entre algo así, incluso antes de publicarlo.';
    return 'Encontré '+list.length+(list.length===1?' opción':' opciones')+':\n'+list.map(function(p){return '• '+p.titulo+' en '+p.barrio+' — '+priceTxt(p)}).join('\n')+'\nPodés verlas en [propiedades destacadas](#propiedades) o pedirme que te pase con Martín para coordinar una visita.'}
  if(/gasto|escritur|sellos|escriban/.test(n))return 'Al comprar en la Ciudad los gastos principales son escribanía, impuesto de sellos (con exención para vivienda única hasta cierto valor), certificados y honorarios inmobiliarios: suelen sumar entre 6% y 9% del precio. Te los calculamos antes de ofertar. Más info en [preguntas frecuentes](#faq).';
  if(/donde|direccion|oficina|horario|ubica/.test(n))return 'Estamos en Arévalo 1800, Palermo. Atendemos de lunes a viernes de 9 a 18 h y los sábados con cita. Mirá el [mapa](#contacto).';
  if(/hola|buen|que tal/.test(n))return '¡Hola! ¿Estás buscando, querés vender o tenés alguna duda sobre el mercado?';
  return 'Puedo ayudarte con propiedades disponibles, precios del m² por barrio en la Ciudad, la tasación online o los gastos de compra. Si preferís hablar con una persona, [escribile a Martín](https://wa.me/'+WA+').';
}
function contexto(){
  var bar=Object.keys(M2).filter(function(k){return M2[k].m2}).map(function(k){var d=M2[k];return (BY[k]?BY[k].n:k)+': US$ '+d.m2+'/m² ('+(d.var>0?'+':'')+d.var+'% anual'+(d.alq?', alquiler 2 amb $ '+d.alq:'')+')'}).join('; ');
  var props=PROPS.map(function(p){return '- '+p.titulo+' | '+p.barrio+' | '+p.op+' | '+p.tipo+' | '+p.amb+' amb | '+p.m2+' m² | '+priceTxt(p)+' | '+p.specs.join(', ')}).join('\n');
  return 'Sos el asistente de la web de González Inmuebles, inmobiliaria familiar con más de 20 años en la Ciudad de Buenos Aires (Villa Urquiza, Parque Chas y Palermo). Estudio: Arévalo 1800, Palermo. Lunes a viernes de 9 a 18 h. Corredor: Martín González, CPI MN 524. WhatsApp: 11 2498-7684.\n'+
  'Respondé en español rioplatense (voseo), cálido y breve: 2 a 4 oraciones, sin listas largas ni encabezados. No inventes propiedades, precios, plazos ni datos: usá solo lo que está acá. Si no sabés algo, ofrecé pasar con Martín por WhatsApp. No des asesoramiento legal ni financiero concluyente.\n'+
  'Podés enlazar secciones del sitio con este formato exacto: [texto](#propiedades), [texto](#tasacion), [texto](#mercado), [texto](#faq), [texto](#contacto). Para WhatsApp: [texto](https://wa.me/'+WA+').\n'+
  'PROPIEDADES DISPONIBLES (muestra):\n'+props+'\n'+
  'MERCADO CABA: m² medio de departamentos US$ 2.476 (Zonaprop, agosto 2026, +0,2% mensual, +1,1% en 2026). Escrituras julio 2026: 6.051 (+9% interanual). En junio 2026 el 12,8% de las escrituras fue con hipoteca. Alquiler medio 2 amb: $ 886.527 (agosto 2026).\n'+
  'VALOR DEL m² POR BARRIO (DGEyC, 1.er trimestre 2026, oferta de 2 amb usados; el cierre suele ser 5-15% menor): '+bar+'.\n'+
  'La tasación online está en la sección #tasacion; la presencial es sin cargo.';
}
function send(text){
  text=String(text||'').trim();if(!text||busy)return;
  add('user',text);HIST.push({role:'user',content:text});
  busy=true;inp.disabled=true;$('#chatForm button').disabled=true;var bot=add('bot','');bot.innerHTML='<span class="typing"><i></i><i></i><i></i></span>';
  getSample().then(function(sample){
    if(!sample)throw {code:'none'};
    var turns=[{role:'user',content:contexto()+'\n\nConfirmá con "Entendido" y esperá la consulta.'},{role:'assistant',content:'Entendido.'}].concat(HIST.slice(-10));
    return sample(turns,{modelTier:'quick',cache:false,onText:function(ev){bot.innerHTML=linkify(ev.text);body.scrollTop=body.scrollHeight}}).then(function(r){var t=(r&&r.text)||'';if(!t)throw {code:'empty'};bot.innerHTML=linkify(t);HIST.push({role:'assistant',content:t})});
  }).catch(function(){
    setTimeout(function(){var t=reglas(text);bot.innerHTML=linkify(t);HIST.push({role:'assistant',content:t});body.scrollTop=body.scrollHeight},450);
  }).then(function(){busy=false;inp.disabled=false;$('#chatForm button').disabled=false;body.scrollTop=body.scrollHeight});
}
$('#chatForm').addEventListener('submit',function(e){e.preventDefault();var t=inp.value;inp.value='';send(t)});

/* ---------- puente con el panel de administración ---------- */
window.GI={
  PROPS:PROPS,FICHAS:FICHAS,ILUS:ILUS,
  setPropiedades:function(lista){
    PROPS.length=0;lista.forEach(function(p){PROPS.push(p);FICHAS[p.id]={banos:p.banos,expensas:p.expensas,ant:p.ant,orient:p.orient,credito:p.credito,cochera:p.cochera,desc:p.desc,extras:p.extras}});
    applySearch(false);
  },
  setMomentos:function(items){
    if(!items.length)return;
    var g=document.getElementById('moments');if(!g)return;
    g.innerHTML=items.map(function(m,i){
      return '<figure class="moment reveal in'+(i%3===0?' tall':'')+'"><img class="ilus" src="'+m.foto+'" alt="'+(m.titulo||'Momento')+'">'+(m.titulo?'<figcaption><b>'+m.titulo+'</b><span>'+(m.lugar||'')+'</span></figcaption>':'')+'</figure>';
    }).join('');
  },
  setCasos:function(items){
    if(!items.length)return;
    var g=document.getElementById('cases');if(!g)return;
    g.innerHTML=items.map(function(c){
      return '<article class="case reveal in"><div class="placeholder u-flush">'+(c.foto?'<img class="ilus" src="'+c.foto+'" alt="'+c.titulo+'" loading="lazy">':'')+'</div><div class="case-b"><span class="z">'+(c.categoria||'')+(c.barrio?' · '+c.barrio:'')+'</span><h3>'+c.titulo+'</h3>'+(c.resumen?'<p>'+c.resumen+'</p>':'')+'<div class="case-kpis">'+(c.kpis||[]).filter(Boolean).map(function(k){return '<span>'+k+'</span>'}).join('')+'</div></div></article>';
    }).join('');
  }
};


/* ---------- contenido editable desde /data (lo carga el panel /admin) ---------- */
(function(){
  function traer(u){return fetch(u,{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).catch(function(){return null})}
  Promise.all([traer('/data/propiedades.json'),traer('/data/momentos.json'),traer('/data/casos.json')]).then(function(r){
    var props=r[0],mom=r[1],cas=r[2];
    if(Array.isArray(props)&&props.length){
      var pub=props.filter(function(p){return p.publicada!==false}).map(function(p){
        var c={};Object.keys(p).forEach(function(k){if(k!=='dirInterna')c[k]=p[k]});
        c.tags=c.tags||[];c.specs=c.specs||[];c.ilus=c.ilus||'frente';
        return c;
      }).sort(function(a,b){return (a.orden||0)-(b.orden||0)});
      if(pub.length)window.GI.setPropiedades(pub);
    }
    if(Array.isArray(mom))window.GI.setMomentos(mom.slice().sort(function(a,b){return (a.orden||0)-(b.orden||0)}));
    if(Array.isArray(cas))window.GI.setCasos(cas.slice().sort(function(a,b){return (a.orden||0)-(b.orden||0)}));
  });
})();

})();
