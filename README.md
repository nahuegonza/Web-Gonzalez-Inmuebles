# González Inmuebles — sitio web

Sitio estático de una sola página, sin framework ni paso de compilación, con **panel de carga propio** en `/admin` protegido por usuario y contraseña. El contenido vive en archivos JSON del repositorio: cuando se guarda algo desde el panel, se hace un commit y Netlify vuelve a publicar solo.

**Lo que trae:**

- Portada con foto, buscador con filtros reales y propiedades destacadas con carrusel.
- Ficha de cada propiedad: galería con miniaturas, visor a pantalla completa, detalle y mapa de Google de la zona (nunca la dirección exacta).
- Simulador de tasación con los valores oficiales por barrio de la Ciudad y registro de datos para desbloquear la estimación.
- Sección de mercado con mapa de calor de los 48 barrios porteños y datos reales (DGEyC, Zonaprop, Colegio de Escribanos).
- Quiénes somos, propuesta de valor, zonas, casos de éxito, momentos, preguntas frecuentes y contacto.
- Asistente de consultas que responde sobre propiedades, precios por barrio y tasación.
- Diseño propio: fondo off-white, verde profundo y el dorado del logo. Tipografías Gabarito, Figtree y Spline Sans Mono.

---

## 1. Correrlo en tu computadora

```bash
npm install -g netlify-cli   # una sola vez
cp .env.example .env         # completá las variables
netlify dev                  # http://localhost:8888
```

`netlify dev` levanta el sitio y las funciones juntos. Si abrís el `index.html` directamente con doble clic, el sitio se ve pero el panel no puede guardar.

---

## 2. Subirlo a GitHub

```bash
git init
git add .
git commit -m "Sitio de González Inmuebles"
git branch -M main
git remote add origin git@github.com:USUARIO/gonzalez-inmuebles-web.git
git push -u origin main
```

---

## 3. Deploy en Netlify

1. Netlify → **Add new site → Import an existing project** → elegí el repositorio.
2. La configuración ya viene en `netlify.toml`: no hay comando de build y se publica la raíz.
3. Cuando termine, configurá el dominio en **Domain management**. Elegí uno solo como principal y redirigí el otro con un 301.
4. Actualizá el dominio en tres lugares: la etiqueta `canonical` de `index.html`, `robots.txt` y `sitemap.xml`.

---

## 4. El panel de carga (`/admin`)

Se entra por URL: `https://tudominio.com/admin`. Pide **un usuario y una contraseña únicos**, sin invitaciones ni cuentas de terceros.

### Variables de entorno

En Netlify: **Site configuration → Environment variables**. Están todas en `.env.example`.

| Variable | Para qué sirve |
| --- | --- |
| `ADMIN_USER` | Usuario del panel |
| `ADMIN_PASSWORD` | Contraseña. Usá una de 16 caracteres o más |
| `SESSION_SECRET` | Texto aleatorio con el que se firma la sesión. Generalo con `openssl rand -hex 32` |
| `GITHUB_TOKEN` | Token de GitHub con permiso de escritura sobre este repositorio |
| `GITHUB_REPO` | `usuario/gonzalez-inmuebles-web` |
| `GITHUB_BRANCH` | `main` |

Después de cargarlas, **Deploys → Trigger deploy → Deploy site**: las variables solo se aplican en un deploy nuevo.

### Cómo generar el token de GitHub

GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**. Acceso solo a este repositorio y, en *Repository permissions*, **Contents: Read and write**. Ningún permiso más.

### Qué se puede cargar

| Sección | Campos |
| --- | --- |
| **Propiedades** | Título, barrio, operación, tipo, ambientes, superficie, precio y moneda, expensas, baños, cocheras, antigüedad, orientación, zona aproximada, etiqueta, extras, descripción, apto crédito, varias fotos y orden. Se pueden ocultar sin borrarlas. |
| **Momentos** | Foto, título, lugar y orden. |
| **Casos de éxito** | Título, categoría, barrio, resumen, dos datos destacados, foto y orden. |

Las fotos se suben desde el mismo formulario y quedan en `img/uploads/`. La primera foto de cada propiedad es la portada.

### Privacidad de las direcciones

Cada propiedad tiene dos campos separados:

- **Zona aproximada**: se publica y aparece en la ficha.
- **Dirección exacta**: queda guardada para uso interno y el sitio la filtra antes de mostrar la propiedad. El mapa de la ficha siempre centra en el barrio, nunca en la dirección.

---

## 5. Estructura

```
├── index.html              → el sitio completo
├── admin/index.html        → panel de carga
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── app.js          → toda la lógica del sitio
│       ├── admin.js        → lógica del panel
│       └── data.js         → geometría de los 48 barrios y datos de mercado
├── data/
│   ├── propiedades.json    → contenido editable desde el panel
│   ├── momentos.json
│   └── casos.json
├── img/                    → fotos, ilustraciones, logo
│   ├── ilus/               → 15 ilustraciones vectoriales de la marca
│   └── uploads/            → fotos que suba el panel
├── netlify/functions/
│   ├── login.mjs           → acceso al panel
│   ├── contenido.mjs       → lectura y escritura del contenido
│   └── _sesion.mjs
└── netlify.toml
```

Si preferís editar el contenido a mano, tocá directamente los archivos de `data/`: tienen la misma estructura que usa el panel.

---

## 6. Los formularios del sitio

Los de tasación y contacto muestran la confirmación y ofrecen continuar por WhatsApp con el mensaje ya escrito. Para que además te lleguen por mail, agregales `data-netlify="true"` y `name` en `index.html` y activá las notificaciones en **Netlify → Forms**.

---

## 7. Antes de publicar

- [ ] Revisar los datos de las cuatro propiedades cargadas: **barrio, precio, metros y ambientes son estimaciones** hechas a partir del nombre de las carpetas de fotos.
- [ ] Completar los casos de éxito, que tienen los números entre corchetes.
- [ ] Cargar fotos reales de clientes en Momentos, siempre con su autorización.
- [ ] Poner el dominio definitivo en `index.html`, `robots.txt` y `sitemap.xml`.
- [ ] Verificar la matrícula tal como debe figurar según CUCICBA.
- [ ] Crear una imagen `img/og.jpg` de 1200 × 630 y enlazarla con `og:image` para cuando se comparta el sitio.
- [ ] Cargar las variables de entorno y probar el login en `/admin`.

## 8. Datos de mercado

Los valores por barrio salen de la Dirección General de Estadística y Censos de la Ciudad (1.er trimestre de 2026, oferta de departamentos usados de 2 ambientes). Los indicadores generales, de Zonaprop y del Colegio de Escribanos porteño, con fecha de agosto y julio de 2026. Están en `assets/js/data.js` y en la sección de mercado de `index.html`: conviene actualizarlos una o dos veces al año.

## Licencia

Código privado de González Inmuebles.
