# Suyai Encinas · Estética Avanzada

Web del centro de estética de Suyai Encinas Tejada en Casas-Ibáñez (Albacete): manicura, pedicura y cejas.

Es una web estática (HTML, CSS y JavaScript), sin dependencias ni proceso de compilación.

## Estructura

```
├── index.html              Página principal
├── aviso-legal.html        Aviso legal
├── privacidad.html         Política de privacidad y cookies
├── partials/
│   ├── header.html         Menú (común a todas las páginas)
│   └── footer.html         Pie y botón de WhatsApp (común a todas las páginas)
├── assets/
│   ├── css/
│   │   ├── main.css        Hoja de estilos única: importa todas las demás
│   │   └── ...             Un archivo por sección (ver abajo)
│   ├── js/
│   │   ├── partials.js     Inserta la cabecera y el pie en cada página
│   │   └── main.js         Menú móvil, citas por WhatsApp, horario en directo y mapa
│   └── img/
│       ├── ui/             Logo, favicon, icono del móvil e imagen para compartir
│       ├── unas/           Manicura y pedicura
│       ├── cejas/          Cejas
│       ├── pestanas/       En pausa
│       └── faciales/       En pausa
└── pausado/
    └── servicios-pausados.html   Servicios que no se muestran (pestañas, faciales, maquillaje, premium)
```

### Cabecera y pie (`partials/`)

El menú y el pie están en un solo sitio y se comparten entre todas las páginas. Cada página tiene un hueco:

```html
<div data-include="partials/header.html"></div>
...
<div data-include="partials/footer.html"></div>

<script src="assets/js/partials.js"></script>
<script src="assets/js/main.js"></script>
```

`partials.js` sustituye cada hueco por el contenido del archivo. Para cambiar el menú o el pie de toda la web, edita solo `partials/header.html` o `partials/footer.html`.

Los enlaces del menú se escriben como `index.html#seccion` para que funcionen desde cualquier página.

### Estilos (`assets/css/`)

Todas las páginas enlazan una sola hoja de estilos:

```html
<link rel="stylesheet" href="assets/css/main.css">
```

`main.css` importa el resto con `@import`. Para añadir un archivo nuevo, créalo en esta carpeta y añade su `@import` en `main.css`.

| Archivo | Qué contiene |
|---|---|
| `variables.css` | Colores, tipografías, radios y sombras. Para cambiar los colores de toda la web, edita este archivo |
| `base.css` | Textos generales, logo, botones, secciones y animación |
| `nav.css` | Menú de navegación (y menú móvil) |
| `footer.css` | Pie de página |
| `whatsapp.css` | Botón flotante de WhatsApp |
| `hero.css` | Portada |
| `aviso.css` | Aviso de apertura |
| `servicios.css` | Servicios y precios |
| `regalo.css` | Tarjeta regalo |
| `horario.css` | Abierto/cerrado, horario, contacto y mapa |
| `legal.css` | Aviso legal y privacidad |
| `premium.css` | Tratamientos Premium (en pausa, no se importa en `main.css`) |

## Ver la web en local

Como la cabecera y el pie se cargan desde `partials/`, **la web tiene que abrirse desde un servidor**. Con doble clic en `index.html` no aparecerán el menú ni el pie. Cualquiera de estas opciones sirve:

- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Node.js:** `npx serve` en la carpeta del proyecto y abrir la dirección que indique.
- **Python:** `python -m http.server 5500` y abrir `http://localhost:5500`.

Una vez publicada (GitHub Pages, Netlify…), funciona sin hacer nada más.

## Cambios habituales

- **Precios y servicios:** en `index.html`, sección `id="servicios"`. Cada servicio es un `<li class="service">` y su precio va en `<span class="service__price">`. El enlace de WhatsApp de cada servicio se crea solo.
- **Horario:** en `index.html`, tabla del horario. El aviso «Abierto ahora / Cerrado» lee las horas de esa tabla. Si cambia, actualiza también `openingHoursSpecification` en los datos para Google (en el `<head>`).
- **Menú o pie:** en `partials/header.html` y `partials/footer.html`.
- **Reactivar servicios en pausa:** copia los bloques de `pausado/servicios-pausados.html` en `index.html`:
  - Las categorías (Pestañas, Tratamientos faciales, Maquillaje) dentro de `<div class="categories">`.
  - La sección Premium antes de la sección `id="regalo"`, y añade `@import url("premium.css");` al final de `assets/css/main.css`.
  - Las fotos están en `assets/img/pestanas` y `assets/img/faciales`.

## Antes de publicar

- [x] Rellenar los datos resaltados de `aviso-legal.html` y `privacidad.html` (NIF, dirección, correo, dominio, alojamiento e IVA).
- [ ] En el `<head>` de `index.html`, cambiar `og:image` y la `image`/`logo` de los datos para Google por la URL completa (`https://dominio/assets/img/ui/compartir.jpg`) y añadir `og:url`.

---

Diseño web: Antolín Murcia
