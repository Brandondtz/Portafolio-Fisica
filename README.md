# Portafolio de Física

Sitio web personal construido con HTML, CSS y JavaScript vanilla.

## Estructura

```text
portafolio-fisica/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── README.md
```

## Cómo verlo localmente

Abre `index.html` en un navegador. No necesita instalar dependencias ni ejecutar un servidor.

## Cómo modificar los proyectos

Abre `js/main.js` y busca la constante `PROYECTOS`. Cada proyecto es un objeto dentro de esa lista. Puedes agregar, editar o eliminar objetos.

Ejemplo:

```js
{
  titulo: "Nombre del proyecto",
  area: "CFD",
  semestre: "5.º",
  estado: "En curso", // "Terminado", "En curso" o "Planeado"
  resumen: "Descripción breve del proyecto.",
  herramientas: ["ANSYS"],
  hice: "Describe qué hiciste.",
  resultados: "Describe los resultados.",
  validacion: "Describe cómo verificaste los resultados.",
  imagenes: [
    { src: "img/resultado.png", pie: "Descripción de la imagen" }
  ],
  video: "video/simulacion.mp4",
  enlaces: [
    { texto: "Informe", url: "https://ejemplo.com" }
  ]
}
```

Los campos `hice`, `resultados`, `validacion`, `imagenes`, `video` y `enlaces` son opcionales. Para usar imágenes o videos, crea las carpetas `img/` o `video/` en la raíz del proyecto y coloca ahí tus archivos.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube el contenido de esta carpeta, manteniendo la estructura.
3. En el repositorio, entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.

GitHub Pages publicará el sitio usando `index.html`.

## Notas

- El sitio utiliza Google Fonts; para cargarlas se necesita conexión a internet.
- El modo oscuro sigue la preferencia de apariencia del dispositivo.
- La animación del flujo potencial se dibuja en un elemento `canvas`.
