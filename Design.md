# Design System - Intranet Universidad Norbert Wiener

## 1. Tipografía
- **Títulos y Encabezados**: `Lato`, sans-serif (Weights: 400, 700, 900)
- **Cuerpo de texto, inputs y cabeceras de tablas**: `Roboto`, sans-serif (Weights: 400, 500, 700)
- **Cabeceras de tablas de datos (`th`)**: `Roboto`, sans-serif, 11.5px, Weight 700, uppercase, letter-spacing: 0.04em.

## 2. Paleta de Colores

### Colores Principales
- **Primary Teal (Principal)**: `#0F848F`
- **Primary Hover**: `#0b6770` o `#09A5B1`
- **Black (Secundario/Botones)**: `#222222`
- **Background Body**: `#F4F6F8` (Fondo general de la intranet)
- **Background Content**: `#FFFFFF` (Fondo de tarjetas y contenedores)

### Textos
- **Text Dark (Títulos principales)**: `#222222` o `#000000`
- **Text Gray (Descripciones y etiquetas)**: `#5B6E80` o `#404040`
- **Text Light (Placeholder/Inactivo)**: `#9AA6B2`

### Bordes y Divisores
- **Border Default**: `#C6CFD7`
- **Border Light**: `#E6F3F4`

### Estados y Semántica
- **Success / Asistencias**:
  - Texto/Icono: `#278B52` o `#33B56B`
  - Fondo claro: `#E7F8EF` o `#E6F3F4` (Para bloques de asistencias)
- **Warning / Inasistencias**:
  - Texto/Icono: `#F59E0B` o `#FBBF24`
  - Fondo claro: `#FFF3E0`
- **Danger / Error**:
  - Texto/Icono: `#D32F2F` o `#E22731`
  - Fondo claro: `#FFEBEE`

## 3. Tags de Modalidad
Se usan para identificar la modalidad de un curso, con un border-radius tipo pill (`16px` o `64px`):
- **Presencial**: Fondo `#0F848F`, Texto `#FFFFFF`
- **Virtual En vivo**: Fondo `#0EA5E9`, Texto `#FFFFFF`
- **Virtual 24/7**: Fondo `#F97316`, Texto `#FFFFFF`

## 4. Botones
- **Radius general**: `6px`
- **Padding general**: `12px 24px` (versión compacta `.btn-sm`: `6px 12px` / font-size: `13px`)
- **Jerarquía y Usos**:
  - `.btn-primary` (Acción principal / emisión final): Fondo `#0F848F`, Texto `#FFFFFF`, Borde `#0F848F`. Hover: `#0b6770`.
  - `.btn-secondary` (Acciones intermedias operativas como 'Procede y Grabar' o 'Grabar Mensaje'): Fondo pizarra oscuro `#1E293B`, Texto `#FFFFFF`, Borde `#1E293B`. Hover: `#334155`.
  - `.btn-warning-pay` (Generación de obligación de pago): Fondo amarillo/ámbar `#F59E0B`, Texto negro `#111827`, Borde `#D97706`, peso 700. Incluye icono SVG al inicio y texto limpio sin caracteres especiales adicionales.
  - `.btn-black`: Fondo `#222222`, Texto `#FFFFFF`
  - `.btn-outline`: Borde `#C6CFD7`, Fondo transparente, Texto `#0F848F`
  - `.btn-danger`: Fondo `#D32F2F`, Texto `#FFFFFF` (desestimar / cancelar)

## 5. Espaciado y Estructura
- **Contenedor Principal (`.main-content`, `.main-container`)**: `max-width: 1082px` (o similar según vista), margin auto.
- **Tarjetas (`.card`)**: 
  - `background-color: #FFFFFF;`
  - `border: 1px solid #C6CFD7;`
  - `border-radius: 8px` (o `16px` para contenedores más grandes)
  - `padding: 24px` o `32px`
- **Sombras**: Las interacciones (hover) suelen tener un `box-shadow: 0 4px 12px rgba(0,0,0,0.05);` y un leve `transform: translateY(-2px);`.

## 6. Pestañas de Navegación (Tabs)
- Contenedor `.tabs-container` con lista `ul.tabs` y elementos `li.tab`.
- **Estado inactivo**: Fondo gris claro (`#F4F6F8`), texto gris (`#5B6E80`).
- **Estado activo (`.active`)**: Fondo blanco, texto color primario (`#0F848F`), con un borde inferior destacado de `3px solid #0F848F`.
- **Interacción**: Alternancia de contenedores mediante atributos `data-target` e inyección de clases por JavaScript.

## 7. Tablas Estructuradas (Basadas en Flexbox)
- En lugar de usar `<table>` tradicional, se emplean contenedores flexibles (`.table-header`, `.table-list`, `.table-row-tb`, `.table-row`).
- **Cabeceras (`.table-row-tb`)**: Fondo gris distintivo (`#E4E8EC`), con `border-radius: 8px` y separación visual de `margin-bottom: 0.5rem`.
- **Comportamiento Mobile**: Los elementos que originalmente están en fila se reestructuran (a menudo omitiendo cabeceras repetitivas o usando `flex-direction: column`) para optimizar el ancho disponible, retirando el padding horizontal exterior.

## 8. Estados Específicos de Pago
Aplicados a celdas clave (como `.vence`):
- **Pendiente (`.estado-pendiente`)**: Fondo `#FFF3F0`, Borde `#FFD0C1`.
- **Pagado (`.estado-pagado`)**: Fondo `#E6F6ED`, Borde `#C4EBD4`.

## 9. Resumen Flotante (Floating Summary Bar)
- **Uso**: Barra anclada a la parte inferior de la pantalla (`position: fixed; bottom: 0;`), útil para mostrar acciones globales y acumuladores (como totales a pagar).
- **Estilos**: Fondo blanco, sombra superior invertida (`box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.12);`).
- **Animación**: Oculta por defecto con `transform: translateY(100%);` y aparece deslizando hacia arriba al agregar la clase `.visible` (`transform: translateY(0);`).
- **Consideración Mobile**: Al aparecer la barra, el contenedor principal (`.table-container` o `.main-container`) debe compensar con un `padding-bottom` generoso (ej. `12rem`) para permitir que el scroll revele por completo el último registro de la vista sin quedar tapado.

## 10. Cabeceras de Página (`.page-header-flex`)
- **Estructura**: `display: flex` separando el contexto (izquierda) de las acciones (derecha).
- **Contexto**: Un ícono SVG (`40x40px`) junto al bloque de textos (`h1` de 24px y `p` descriptivo de 16px).
- **Acciones**: Botones de utilidades o estado en la parte derecha (ej. Botón Imprimir, Botón Descargar), usando layout secundario o outline. Borde inferior demarcado por un divisor `.header-divider`.

## 11. Formularios y Filtros (Alineación y Dimensiones)
- **Altura estándar uniforme (40px)**: Todos los controles interactivos de una fila de filtros o formulario (inputs de texto, selectores de fecha `input[type="date"]`, selects nativos y botones de dropdown personalizados `.custom-select-trigger`) deben tener exactamente la misma altura: `height: 40px; min-height: 40px; box-sizing: border-box;`.
- **Alineación vertical y márgenes**:
  - Ningún control ni contenedor envolvente (`.select-wrap`, `.custom-select-wrap`) debe poseer márgenes verticales desfasados (`margin: 0 !important`).
  - Las etiquetas (`label`) deben tener dimensiones homogéneas (`height: 16px; line-height: 16px; margin: 0 0 6px 0; display: block;`), asegurando que todos los controles de una misma fila comiencen exactamente en la misma línea vertical (`top`).
- **Estilos visuales**:
  - Borde: `1px solid #C6CFD7` (`var(--border)`).
  - Radio de curvatura: `6px` (`border-radius: 6px`).
  - Tipografía interna: `Roboto, sans-serif`, `13.5px`, color `#222222`.
  - Fondo: `#FFFFFF`.
  - Padding horizontal: `12px` (inputs de texto y fecha) / `14px` (selects).
- **Efecto Focus corporativo Wiener**:
  - Borde: `#0F848F` (`var(--brand)`).
  - Anillo de enfoque: `box-shadow: 0 0 0 3px rgba(15, 132, 143, 0.16); outline: none;`.
- **Centrado de Iconos**:
  - La flecha del selector y el icono del selector de fecha deben estar centrados al `50%` vertical de la caja de 40px.

## 12. Componente Desplegable Personalizado (Custom Select Dropdown)
- **Propósito**: Eliminar el popup nativo del sistema operativo (Aqua en macOS / clásico en Windows) que ignora estilos CSS, tipografías y bordes, garantizando una interfaz web consistente en cualquier plataforma.
- **Trigger**:
  - Elemento `.custom-select-trigger` con `height: 40px; box-sizing: border-box;`.
  - Indicador de flecha con rotación: en estado cerrado `transform: translateY(-70%) rotate(45deg);`, en estado abierto `.is-open` rota a `transform: translateY(-30%) rotate(225deg) scale(1.15);`.
- **Retorno inmediato de animación**:
  - Al hacer clic en cualquier opción, el menú se cierra **inmediatamente** (`wrap.classList.remove('is-open')`) y la flecha regresa fluidamente a su estado inicial (`rotate(45deg)`). No debe depender del evento `blur` ni requerir clic fuera.
  - Al hacer clic fuera o presionar la tecla `Escape`, se cierra y la flecha retorna instantáneamente.
- **Menú Flotante (`.custom-select-menu`)**:
  - Fondo blanco `#FFFFFF`, borde `#D6DFE6`, radio `6px` a `8px`.
  - Sombra flotante pronunciada: `box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.14), 0 4px 8px -2px rgba(15, 23, 42, 0.06);`.
  - Altura máxima: `max-height: 250px; overflow-y: auto;` con scrollbar delgada (`6px`) en gris suave `#CBD5E1`.
  - Ancho dinámico: `min-width: 100%; width: max-content; max-width: min(520px, 90vw);`. Si se encuentra próximo al borde derecho de la pantalla, se alinea a la derecha (`right: 0; left: auto`).
- **Estados de las Opciones (`.custom-select-item`)**:
  - **Hover / Foco**: Fondo suave `#EDF9F8`, texto verde oscuro `#0b6770` (`var(--brand-dark)`), font-weight `600`.
  - **Activo / Seleccionado**: Fondo `#E6F4F5` (`var(--brand-soft)`), texto `#0b6770`, font-weight `700`, con ícono checkmark `✓` a la derecha.

## 13. Tablas de Gestión y Vistas Administrativas (`.vt-table`)
- **Cabeceras (`th`)**: Tipografía `Roboto, sans-serif`, `11.5px`, peso `700`, mayúsculas, `letter-spacing: 0.04em`, color suave `#5B6E80`, fondo `#E4E8EC`.
- **Prioridad de ancho y scroll horizontal**:
  - La tabla debe mostrarse completa como prioridad en pantallas estándar. El ancho máximo sugerido del contenedor es `max-width: 1400px` centrado.
  - El scroll horizontal (`.vt-table-wrapper { overflow-x: auto; }`) solo debe activarse si la pantalla se reduce (móvil o tablet) y no entran los datos completos sin comprimirse.
- **Estandarización de Columnas**:
  - **Sede**: Texto plano sin borde ni fondo, con `white-space: nowrap` para evitar saltos de línea innecesarios.
  - **Trámite**: Nombre limpio del trámite sin redundancias.
  - **Estado y Activo**: Badges tipo pill limpios, sin el punto o círculo previo (`::before { display: none !important; }`).
  - **Pago**: Formato binario claro (`✓ Sí` con fondo verde `#E6F6ED` / `✕ No` con fondo ámbar `#FFF3F0`).
  - **Acciones**: Botón conciso etiquetado como `'Detalle'` (evitar textos largos como 'Ver detalle').
- **Paginación Integrada**:
  - Situada en la cabecera o pie de tabla junto al contador de registros.
  - Botones **Anterior** y **Siguiente** con flechas vectoriales SVG (`stroke-width: 2.5`).
  - Botones de número de página compactos (`height: 30px; min-width: 30px; border-radius: 6px;`).
  - Página activa en color Teal `#0F848F` con texto blanco.

## 14. Estandarización de Cabeceras de Página (`.page-head`)
- **Estructura Estándar**:
  ```html
  <div class="page-head">
    <div>
      <h1>Título de la Sección</h1>
      <p>Descripción clara y concisa de la función del módulo.</p>
    </div>
    <!-- Botones de acción principales opcionales a la derecha -->
  </div>
  ```
- **Especificaciones**:
  - `h1`: Tipografía `Lato, sans-serif`, `24px` (o `20px` en mobile), peso `700` (evitar `font-weight: 900` para mantener consistencia con los demás módulos administrativos), margen inferior `4px`.
  - `p`: Tipografía `Roboto`/sistema, `14px`, color `#5B6E80` (`var(--text-muted)`).
  - No añadir estilos en línea que compacten o alteren el espaciado vertical entre el título y la descripción (`margin: 0` indebido en `<p>`), permitiendo una transición visual homogénea al navegar entre secciones del sistema.
