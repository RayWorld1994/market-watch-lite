# Market Watch Lite

Un panel de criptomonedas responsivo y mobile-first construido con Angular 21. Consume la API pública de [CoinGecko](https://www.coingecko.com/) para mostrar datos de mercado en tiempo real, buscar/filtrar activos e inspeccionar información detallada de cada moneda en un modal — todo con estados de carga skeleton y soporte para modo oscuro.

**Live Demo:** [https://market-watch-lite-one.vercel.app/dashboard](https://market-watch-lite-one.vercel.app/dashboard)

## Requisitos Previos

| Herramienta | Versión |
|-------------|---------|
| Node.js | >= 20.19 o >= 22.12 |
| npm | >= 10 |

## Ejecución Local

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd market-watch-lite

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm start
```

Abrir **http://localhost:4200** — la aplicación se recarga automáticamente con cada cambio de archivo.

## Compilación para Producción

```bash
npm run build
```

La salida se escribe en `dist/market-watch-lite/`.

## Ejecución de Tests

```bash
npm test
```

## Tecnologías

| Aspecto | Librería | Por qué |
|---------|----------|---------|
| **Framework** | Angular 21 | Componentes standalone, signals y la última sintaxis de flujo de control (`@if`, `@for`) para un código moderno y limpio |
| **Componentes UI** | PrimeNG 21 | Componentes listos para producción (Dialog, Skeleton, Toast, Button, InputText) con accesibilidad y temas integrados |
| **Gestión de Estado** | NgRx 21 | Flujo de datos predecible y unidireccional con store, effects y devtools para la funcionalidad del dashboard |
| **Estilos** | Tailwind CSS 4 | CSS utility-first con diseño responsivo mobile-first; sin archivos CSS personalizados para el layout |
| **Tokens de Diseño** | Preset personalizado ABANK | Propiedades CSS personalizadas (`--color-brand`, `--color-surface-*`, `--color-text-*`) conectadas al sistema de temas de PrimeNG para una marca consistente |
| **Gráficos** | Chart.js 4 | Gráfico sparkline ligero para el historial de precios de 7 días en el modal de detalle del activo |
| **i18n** | Transloco 8 | Cambio de idioma en tiempo real (EN/ES) sin recargar la página — las traducciones son archivos JSON cargados de forma lazy |
| **HTTP** | Angular HttpClient | Llamadas API a través de un `CoingeckoService` centralizado; interceptor global de errores que muestra mensajes toast localizados |
| **Modo Oscuro** | Clase CSS `.dark` | Alternancia mediante botón en el header, persistido en `localStorage`, respeta `prefers-color-scheme` del sistema |

## Funcionalidades

### Núcleo (Fases 0–1)
- Configuración de API basada en entornos
- Interceptor global de errores HTTP con notificaciones Toast de PrimeNG
- Shell de la aplicación con header fijo, toggle de modo oscuro y enrutamiento lazy-loaded

### Dashboard (Fase 2)
- Top 50 criptomonedas por capitalización de mercado desde CoinGecko
- Cuadrícula de tarjetas responsiva: 1 columna en móvil, 2 en tablet, 3 en escritorio
- Cambio de precio en 24h con código de color (verde/rojo)
- Gestión de estado con NgRx con manejo de carga/errores

### Búsqueda (Fase 3)
- Filtrado del lado del cliente por nombre o símbolo (insensible a mayúsculas)
- Debounce de 300ms con `debounceTime` + `distinctUntilChanged` de RxJS
- Estado vacío informativo cuando no hay resultados coincidentes

### Modal de Detalle del Activo (Fase 4)
- Pantalla completa en móvil, diálogo centrado de 600px en escritorio
- Encabezado de la moneda con imagen, nombre y símbolo
- Visualización de precio grande con indicador de cambio en 24h
- Gráfico sparkline de 7 días (Chart.js)
- Tarjetas de estadísticas: Capitalización de Mercado, Volumen 24h, Máximo 24h, Mínimo 24h
- Descripción HTML sanitizada con toggle "Leer más / Mostrar menos"
- Estado de carga skeleton dentro del modal

### Carga Skeleton (Fase 5)
- Tarjetas skeleton con animación shimmer mientras se cargan los datos
- Placeholders skeleton en el modal de detalle
- Transición suave de skeleton a contenido real sin cambio de layout

## Funcionalidades Extra

- **i18n en tiempo real (EN/ES)** — Internacionalización basada en Transloco con cambio de idioma instantáneo desde el header. La preferencia de idioma se persiste en `localStorage` y se detecta automáticamente desde la configuración del navegador en la primera visita. Todo el texto de la UI, mensajes de error y etiquetas aria están traducidos.
- **Modo oscuro/claro** — Toggle de tema persistido que se integra con el sistema de temas de PrimeNG y la variante dark de Tailwind. Respeta la preferencia del sistema en la primera carga.
- **Modal responsivo** — El diálogo de detalle del activo se adapta entre pantalla completa (móvil) y overlay centrado (escritorio) usando listeners de `matchMedia`.
- **Gráfico sparkline de 7 días** — Gráfico de historial de precios con código de color renderizado con Chart.js dentro del modal de detalle.
- **Accesible** — Etiquetas aria en elementos interactivos, navegación por teclado (ESC para cerrar el modal), componentes PrimeNG compatibles con lectores de pantalla.

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                     # Interceptores, cargador de transloco
│   ├── data/
│   │   ├── const/                # Constantes de la API
│   │   ├── model/dashboard/      # Interfaces de TypeScript
│   │   └── service/dashboard/    # Servicio HTTP de CoinGecko
│   ├── features/dashboard/       # Página del dashboard + componentes hijos
│   │   └── components/
│   │       ├── asset-card/       # Tarjeta individual de moneda
│   │       ├── asset-detail/     # Modal de detalle
│   │       └── asset-list/       # Cuadrícula de tarjetas con estados de carga
│   ├── layout/                   # Header, layout principal
│   ├── shared/components/        # Tarjeta skeleton, gráfico sparkline
│   └── store/dashboard/          # Acciones, reducer, effects y selectores de NgRx
├── environments/                 # Configuración de URL base de la API
└── public/i18n/                  # Archivos JSON de traducción EN y ES
```
