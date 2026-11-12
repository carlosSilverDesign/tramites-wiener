# Sistema de Trámites: maqueta

Maqueta navegable del Sistema de Trámites de la Universidad Norbert Wiener.
Esta carpeta funciona sola: no necesita nada de fuera de ella.

Es HTML, CSS y JavaScript sin servidor. Los datos son de ejemplo y se guardan
en el navegador. El correo y el pago con Niubiz están simulados.

## Cómo verla

1. Abre `index.html` con doble clic.
2. Elige **Administrativo** o **Alumno** y pulsa **Ingresar**.

Para volver a los datos de ejemplo iniciales: abre la consola del navegador
(F12) y ejecuta `DB.reset()`.

## Qué mirar primero: armar un trámite

Entra como Administrativo y ve a **Configuración > Diseñar trámites**.

- **Nuevo trámite**: eliges una plantilla y se abre el proceso para armarlo.
- **Configurar**, en un trámite de la lista: abre su proceso.

El proceso se arma sobre una línea vertical, en el orden en que lo vive el
alumno (`admin/tramite-proceso.html`):

- Cada paso es una fila con una frase. Solo se abre uno a la vez.
- El "+" entre dos pasos agrega uno en ese punto. El recuadro "Agregar un paso
  al proceso" agrega pago, revisión de un área o aprobación final.
- El pago es opcional. Puede ir al solicitar, después de cualquier revisión o
  al final. Se mueve con las flechas, arrastrando, o con la lista "¿Cuándo paga?".
- Las revisiones se reordenan arrastrando por los puntos de la derecha.
- Cada paso muestra dos o tres campos. Lo secundario está en "Más opciones".
- Arriba, una frase resume el proceso y se reescribe sola.

Debajo de la línea, **"Lo demás del trámite"** abre los datos que no cambian
el orden del proceso (`admin/tramite-editor.html`): descripción y categorías,
quién puede pedirlo, entrega y texto del documento, avisos por correo y la
vista del alumno. Desde ahí, "Volver al proceso del trámite" regresa a la línea.

## Pantallas

```
index.html                    Ingreso con selección de perfil
alumno/
  solicitar.html              Solicitar trámite
  mis-tramites.html           Mis trámites (seguimiento y pago)
  mis-documentos.html         Mis documentos
admin/
  solicitudes.html            Bandeja de solicitudes
  registrar.html              Registrar solicitud por ventanilla
  catalogo.html               Catálogo de trámites
  certificaciones.html        Certificaciones progresivas
  procesar.html               Resumen
  reportes.html               Reportes
  tramites.html               Diseñar trámites: lista, áreas y requisitos
  tramite-proceso.html        Armar el proceso de un trámite
  tramite-editor.html         Plantillas de inicio y datos del trámite
  usuarios.html               Usuarios y permisos
  seguridad.html              Roles, políticas y auditoría
```

## Recorridos para probar

**Crear un trámite**

1. Configuración > Diseñar trámites > "Nuevo trámite".
2. Elige "Certificado con revisión de documentos".
3. Escribe el nombre arriba. Agrega o quita pasos y pulsa "Guardar".

**Poner el pago a mitad del proceso**

1. En "Constancia de Matrícula", pulsa "Configurar".
2. Abre el paso "El alumno paga" y pulsa la flecha hacia abajo: el pago pasa a
   después de la primera revisión.
3. Pulsa "Guardar".

**Ver ese trámite funcionando**

1. Sal y entra como Alumno. Solicita "Constancia de Matrícula".
2. Entra como Administrativo. En la Bandeja, abre la solicitud y marca la
   primera área como atendida: la solicitud queda en espera de pago.
3. Entra como Alumno. En Mis trámites aparece el botón para pagar.
4. Después del pago, la solicitud sigue con el área siguiente.

## Sistema de diseño

- Tipografías: Lato para títulos, Roboto para texto.
- Color principal: `#0F848F`. Los colores y radios están como variables al
  inicio de `css/styles.css`.
- Los componentes compartidos más recientes están al final de `css/styles.css`,
  bajo el comentario "CAPA UX 2026-11".
- Los estilos propios de la línea del proceso están dentro de
  `admin/tramite-proceso.html`, con el prefijo `pb-`.
- Sin emojis como iconos: todos los iconos son SVG en línea.

## Pendiente de diseño

- **Barra de avance del alumno** en Mis trámites: muestra un orden genérico
  (revisión, aprobación, pago) aunque el pago esté a mitad del proceso.
- **Pantalla "Lo demás del trámite"**: usa una maquetación distinta a la línea
  del proceso (menú a la izquierda, formulario a la derecha).
- **Pestañas Áreas y Requisitos** de `admin/tramites.html`: conservan una
  maquetación más antigua que el resto.
- **Color de "Emitido"**: morado en las etiquetas generales y verde en Mis
  documentos.
- **Móvil**: revisado hasta 490 px de ancho. Falta revisar a 390 px y el
  arrastre con el dedo en un teléfono real.
- **Sin revisar**: lector de pantalla e impresión de documentos.

## Límites de la maqueta

- Los datos viven en el navegador de quien la abre. No se comparten entre
  equipos.
- La disponibilidad por fechas, la vigencia y las plantillas de correo se
  pueden editar y guardar, pero la maqueta todavía no las aplica.
