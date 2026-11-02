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

## 11. Formularios, Filtros e Inputs con Iconos Vectoriales SVG (Márgenes Estrictos y Prevención de Colisiones)
- **Altura estándar uniforme (40px)**: Todos los controles interactivos de formularios y filtros (inputs de texto, selectores de fecha, selects nativos y botones de dropdown personalizados `.custom-select-trigger`) deben tener exactamente la misma altura:
  ```css
  height: 40px;
  min-height: 40px;
  box-sizing: border-box;
  ```
- **Alineación vertical y etiquetas (`label`)**:
  - Las etiquetas (`label`) deben tener dimensiones homogéneas:
    ```css
    height: 16px;
    line-height: 16px;
    margin: 0 0 6px 0;
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #5B6E80;
    ```
  - Todos los controles de una misma fila deben iniciar exactamente en la misma línea vertical (`top`).
- **Estilos visuales de inputs**:
  - Borde: `1px solid #CBD5E1` (`var(--border)`).
  - Radio de curvatura: `8px` (`border-radius: 8px`).
  - Tipografía interna: `Roboto, sans-serif`, `13.5px`, color `#1E293B`.
  - Fondo: `#FFFFFF`.
  - Padding estándar sin icono: `padding: 0 14px;`.
- **Efecto Focus corporativo Wiener**:
  ```css
  border-color: #0F848F !important;
  box-shadow: 0 0 0 3px rgba(15, 132, 143, 0.15) !important;
  outline: none;
  ```
- **Márgenes Estrictos para Inputs con Icono a la Izquierda (`.input-wrap-icon-left`)**:
  - El icono vectorial SVG (`.input-icon-svg`) se posiciona de forma absoluta:
    ```css
    position: absolute;
    left: 14px !important;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #5B6E80;
    pointer-events: none;
    z-index: 2;
    ```
  - **Padding obligatorio del input**:
    ```css
    padding: 0 14px 0 42px !important;
    line-height: 38px !important;
    ```
  - **Regla de oro de separación**: Los 42px de padding izquierdo resultan de 14px (margen al borde) + 16px (ancho del icono) + 12px (espacio libre de respiración). **Nunca usar `padding: 0 12px` en inputs con icono**, ya que provoca que el texto escrito o el placeholder colisione y se monte sobre el icono.
- **Inputs con Icono a la Derecha (`.input-wrap-icon-right`)**:
  - El icono vectorial SVG se posiciona a:
    ```css
    position: absolute;
    right: 12px !important;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #5B6E80;
    pointer-events: none;
    ```
  - Padding obligatorio del input: `padding: 0 38px 0 14px !important;`.
- **Iconografía en SVG**: Todos los iconos de filtros, inputs y botones deben ser vectores SVG limpios (`stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`), nunca imágenes rasterizadas ni caracteres emoji o fuentes glifo que puedan desalinearse o presentar artefactos de codificación.

## 12. Componente Desplegable Personalizado Wiener (Custom Select Dropdown con Giro SVG 180° y Flotación Fixed)
- **Propósito**: Eliminar el popup nativo del sistema operativo (Aqua en macOS / clásico en Windows) que ignora estilos CSS, tipografías y bordes, garantizando una interfaz corporativa consistente, fluida y sin recortes en cualquier dispositivo.
- **Estructura HTML**:
  ```html
  <div class="custom-select-container">
    <select class="form-control" name="filtro_ejemplo" style="display: none;">
      <option value="">Todos los registros</option>
      <option value="1">Opción A</option>
      <option value="2">Opción B</option>
    </select>
    <div class="custom-select-trigger" tabindex="0">
      <span class="custom-select-label">Todos los registros</span>
      <svg class="custom-select-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  </div>
  ```
- **Trigger (`.custom-select-trigger`)**:
  - Altura: `height: 40px; box-sizing: border-box;`.
  - Padding: `padding: 0 38px 0 14px;` (deja espacio limpio para el icono derecho).
  - Borde: `1px solid #CBD5E1; border-radius: 8px; background: #FFFFFF; font-size: 13.5px; color: #1E293B; cursor: pointer;`.
  - Al abrirse (`.is-open`), adquiere el foco corporativo: `border-color: #0F848F !important; box-shadow: 0 0 0 3px rgba(15, 132, 143, 0.15) !important;`.
- **Flecha con Animación de Giro Vectorial 180° (`.custom-select-arrow`)**:
  - Icono SVG tipo chevron `<polyline points="6 9 12 15 18 9">`.
  - Margen respecto al borde: `right: 12px; top: 50%; transform: translateY(-50%) rotate(0deg); pointer-events: none;`.
  - Transición suave: `transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.2s ease;`.
  - Estado abierto (`.is-open .custom-select-arrow`): rota suavemente 180 grados:
    ```css
    transform: translateY(-50%) rotate(180deg) !important;
    stroke: #0F848F !important;
    ```
  - **Retorno fluido inmediato**: Al seleccionar una opción, al hacer clic fuera o al presionar `Escape`, la clase `.is-open` se remueve de inmediato y la flecha rota limpiamente de regreso a `0deg`.
- **Fallback en Selects Nativos**:
  - Si un select nativo no se transforma en componente personalizado, debe incluir el mismo chevron SVG corporativo vía CSS:
    ```css
    background-image: url("data:image/svg+xml,...polyline points='6 9 12 15 18 9'...");
    background-repeat: no-repeat;
    background-position: right 12px center !important;
    padding-right: 38px !important;
    appearance: none;
    -webkit-appearance: none;
    ```
- **Menú Flotante Fixed (`.custom-dropdown-menu`)**:
  - Flotación por Viewport: `position: fixed !important; z-index: 999999 !important;`. Se desvincula del contenedor padre para que nunca sea recortado por un modal o tarjeta con `overflow: hidden`.
  - Fondo blanco `#FFFFFF`, borde `1px solid #D6DFE6`, radio `8px`.
  - Sombra flotante pronunciada: `box-shadow: 0 12px 30px -4px rgba(15, 23, 42, 0.18), 0 4px 10px -2px rgba(15, 23, 42, 0.08);`.
  - Altura máxima calculada y scrollbar delgada:
    ```css
    max-height: 260px;
    overflow-y: auto;
    ```
    Si el listado de opciones es extenso, la navegación se realiza internamente dentro del menú con scroll fino (`6px`), sin generar scroll en la página ni en el modal.
- **Estados de las Opciones (`.custom-dropdown-item`)**:
  - Altura: `36px; padding: 0 14px; font-size: 13.5px; color: #1E293B; cursor: pointer;`.
  - **Hover**: Fondo verde agua suave `background-color: #E6F3F4;`, color teal `color: #0F848F;`, font-weight `500`.
  - **Seleccionado (`.is-selected`)**: Fondo `background-color: #F0FAFA;`, color `color: #0F848F;`, font-weight `600;`, con icono checkmark SVG a la derecha.

## 13. Componente Selector de Fechas Wiener (Custom DatePicker con Calendario Flotante y Anti-Duplicado)
- **Propósito**: Estandarizar la selección de fechas en toda la intranet con formato latinoamericano visual (`DD/MM/AAAA`), reemplazando el calendario nativo del navegador que genera desfases estéticos y colisiones en modales.
- **Estructura HTML**:
  ```html
  <div class="custom-date-container">
    <input type="text" class="form-control date-display-input" placeholder="DD/MM/AAAA" readonly>
    <svg class="custom-date-calendar-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
    <input type="date" name="fecha_consulta" class="native-date-hidden" data-enhanced-date="true">
  </div>
  ```
- **Input de Visualización (`.date-display-input`)**:
  - `height: 40px; box-sizing: border-box; border: 1px solid #CBD5E1; border-radius: 8px; background: #FFFFFF; font-size: 13.5px; cursor: pointer;`.
  - Padding: `padding: 0 38px 0 14px;` (espacio reservado para el icono de calendario).
  - Formato legible mostrado al usuario: `DD/MM/AAAA` (ej. `01/10/2026`).
- **Icono de Calendario SVG**:
  - Posición: `position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #5B6E80; pointer-events: none;`.
  - Nunca debe quedar pegado al borde del input.
- **Sincronización con Input Nativo y Regla Anti-Duplicado**:
  - El input nativo almacena el valor estándar ISO (`AAAA-MM-DD`) para compatibilidad total con consultas y envíos.
  - Al ser procesado por el DatePicker, se le asigna el atributo `data-enhanced-date="true"`.
  - **Regla CSS estricta de ocultación**:
    ```css
    input[data-enhanced-date="true"] {
      display: none !important;
      position: absolute !important;
      width: 0 !important;
      height: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
    ```
    Esta regla previene cualquier duplicación visual o inputs repetidos en cascada.
- **Popup de Calendario Flotante (`.custom-calendar-popup`)**:
  - Flotación Fixed: `position: fixed !important; z-index: 999999 !important; width: 285px;`.
  - Fondo blanco, borde `1px solid #D6DFE6`, radio `10px`, sombra `box-shadow: 0 12px 30px -4px rgba(15, 23, 42, 0.18);`.
  - **Cabecera del Calendario**: Mes y año actual con botones vectoriales de navegación previa/siguiente (`‹` / `›`).
  - **Días de la Semana**: `DO LU MA MI JU VI SÁ` en tipografía compacta (`11px`, peso `700`, color `#5B6E80`).
  - **Cuadrícula de Días**: 7 columnas. Días seleccionables con hover circular `#E6F3F4`.
  - **Día Seleccionado**: Círculo de color teal `#0F848F` con texto blanco de alto contraste.
  - **Acciones Rápidas**: Enlaces de pie de calendario ("Hoy" para seleccionar la fecha actual y "Borrar" para limpiar el campo).
  - Al hacer clic en un día, se actualizan el input visual (`DD/MM/AAAA`) y el input nativo (`AAAA-MM-DD`), se dispara el evento `change` y el popup se cierra inmediatamente.

## 14. Detección Inteligente de Pantalla, Flotación Libre y Comportamiento de Cierre
- **Posicionamiento Basado en Coordenadas Viewport (`getBoundingClientRect`)**:
  - Tanto `.custom-dropdown-menu` como `.custom-calendar-popup` calculan sus coordenadas `top`, `left`, `width` y espacio disponible en tiempo real al abrirse.
- **Preferencia de Despliegue Hacia Abajo (Downward Priority)**:
  - Por defecto, el menú o calendario siempre debe desplegarse hacia abajo para una lectura natural.
  - **Condición estricta para invertir (Upward Flip)**: Solo se despliega hacia arriba si:
    1. El espacio libre inferior hacia el borde de la pantalla es menor a 160px (para selects) o 180px (para calendarios), **Y**
    2. El espacio libre superior hacia arriba es mayor que el espacio inferior.
    Si hay suficiente espacio abajo (por ejemplo en modales o filas intermedias), siempre desplegará hacia abajo.
- **Ajuste Dinámico de Altura y Prevención de Scrollbar de Página**:
  - La altura máxima del menú se calcula dinámicamente:
    ```javascript
    const maxMenuHeight = opensUp ? Math.min(260, spaceAbove - 16) : Math.min(260, spaceBelow - 16);
    menu.style.maxHeight = `${Math.max(120, maxMenuHeight)}px`;
    ```
  - Esto garantiza que el desplegado nunca sobrepase el límite inferior ni superior del viewport del usuario, y que nunca obligue al navegador a generar barras de desplazamiento en la ventana principal.
- **Ajuste Horizontal respecto al Borde de la Pantalla**:
  - Si el menú se encuentra cerca del borde derecho (`rect.left + menuWidth > window.innerWidth - 12`), se recoloca automáticamente alineándose a la derecha del disparador para evitar desbordamientos horizontales.
- **Cierre Global Inteligente**:
  - `closeAllDropdowns()` se ejecuta automáticamente al:
    - Hacer clic en cualquier lugar fuera del desplegado (`pointerdown`).
    - Presionar la tecla `Escape`.
    - Redimensionar la ventana (`resize`).
    - Hacer scroll en la página o en un modal. **Excepción estricta**: Si el usuario hace scroll dentro del propio `.custom-dropdown-menu` o dentro del `.custom-calendar-popup`, el menú **no se cierra**, permitiendo explorar todas las opciones cómodamente.

## 15. Prevención de Enmascaramiento y Modales de Configuración (Anti-clipping y Auto-hidratación)
- **Regla Anti-clipping en Tarjetas y Contenedores**:
  - Las tarjetas que contienen filtros o selects (por ejemplo `.cronog-card-wiener`, `.listado-filters-card` o `.card`) deben tener `overflow: visible !important;`.
  - Para mantener las esquinas redondeadas en tarjetas con cabecera de color, los radios deben asignarse a la cabecera misma (`border-top-left-radius: 9px; border-top-right-radius: 9px;`) en lugar de aplicar `overflow: hidden` a la tarjeta completa.
- **Auto-hidratación en Modales Dinámicos**:
  - Cuando se abre un modal de configuración (como "Editar Cronograma", "Editar Área", "Nuevo Trámite", etc.) mediante `APP.openModal(modalId)` o al renderizarse dinámicamente un formulario, se debe invocar automáticamente la hidratación de componentes:
    ```javascript
    APP.openModal = function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        // Hidratar automáticamente componentes Wiener en el modal
        if (typeof window.initCustomSelects === 'function') window.initCustomSelects(modal);
        if (typeof window.initDatePickers === 'function') window.initDatePickers(modal);
      }
    };
    ```
  - Esta práctica garantiza que todos los selects tengan sus flechas vectoriales con giro y que todos los campos de fecha posean el DatePicker flotante sin requerir código redundante por cada modal.

## 16. Tarjeta Estandarizada de Filtros Wiener (`.listado-filters-card`) e Iconografía SVG
- **Estructura Estándar**:
  ```html
  <div class="card listado-filters-card">
    <div class="filter-header-row">
      <div class="filter-title-col">
        <svg class="filter-title-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0F848F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span class="filter-card-title">Filtros de Búsqueda</span>
      </div>
      <div class="filter-card-subtitle">Todos los campos son opcionales</div>
    </div>
    
    <!-- Cuadrícula responsive de inputs y selects (gap: 16px) -->
    <div class="filter-grid-row">
      <!-- Campo con icono izquierdo -->
      <div class="filter-col">
        <label>Código o Nombres</label>
        <div class="input-wrap-icon-left">
          <svg class="input-icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="form-control" placeholder="Buscar por código...">
        </div>
      </div>
      
      <!-- Select personalizado Wiener -->
      <div class="filter-col">
        <label>Trámite</label>
        <div class="custom-select-container">
          <select class="form-control">
            <option value="">Todos los trámites</option>
            <option value="1">Certificado de Estudios</option>
          </select>
        </div>
      </div>

      <!-- DatePicker personalizado Wiener -->
      <div class="filter-col">
        <label>Desde</label>
        <div class="custom-date-container">
          <input type="date" class="form-control" value="2026-09-01">
        </div>
      </div>
    </div>

    <!-- Barra de acciones inferiores -->
    <div class="filter-actions-row">
      <button type="button" class="btn btn-outline" id="btnLimpiarFiltros">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
        Limpiar filtros
      </button>
      <button type="button" class="btn btn-primary" id="btnBuscar">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Buscar
      </button>
    </div>
  </div>
  ```

## 17. Tablas de Gestión y Vistas Administrativas (`.vt-table`)
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

## 18. Estandarización de Cabeceras de Página (`.page-head`)
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

## 19. Reglas de Redacción, Tipografía y Caracteres Especiales (Sin Guiones Largos ni Corrupción)
- **Cero guiones largos (Em-dashes / En-dashes)**: Nunca utilizar guiones largos (`—` o `–`) en textos visibles para el usuario ni en etiquetas de interfaz; utilizar siempre el guion estándar ASCII `-`.
- **Integridad de Caracteres UTF-8**: Todo archivo HTML o JS debe guardarse en codificación UTF-8 estricta. Queda terminantemente prohibido el uso de secuencias corruptas o mojibake (ej. `Ãº`, `Â°`, `â`).
- **Nombres Institucionales Completos**:
  - Universidad: **Universidad Privada Norbert Wiener S.A.** (o Universidad Norbert Wiener según el contexto).
  - Instituto: **Instituto de Educación Superior Daniel Alcides Carrión**.
