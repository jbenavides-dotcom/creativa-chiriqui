/**
 * Google Apps Script — Receptor de formulario de contacto
 * Cafetalera Río Cochea
 *
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * ─────────────────────────────────────────────────────────────
 * 1. Crear una hoja de cálculo nueva en Google Sheets:
 *    - Ve a sheets.google.com y crea una hoja nueva
 *    - Nómbrala "Contactos Cafetalera Río Cochea" (o el nombre que prefieras)
 *    - La primera fila se creará automáticamente con los encabezados
 *
 * 2. Abrir el editor de Apps Script:
 *    - En la hoja, ve a Extensiones → Apps Script
 *    - Borra el código predeterminado
 *    - Pega TODO el contenido de este archivo
 *
 * 3. Guardar el proyecto:
 *    - Ctrl+S o el botón de guardar
 *    - Puedes nombrarlo "Formulario Cafetalera"
 *
 * 4. Publicar como Web App:
 *    - Clic en "Implementar" → "Nueva implementación"
 *    - Tipo: "Aplicación web"
 *    - Descripción: "Formulario contacto v1"
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier persona"  ← IMPORTANTE
 *    - Clic en "Implementar"
 *    - Autoriza los permisos cuando te los pida
 *    - COPIA la URL que aparece (termina en /exec)
 *
 * 5. Conectar con el HTML:
 *    - Abre index.html
 *    - Busca la constante: const GOOGLE_SCRIPT_URL = 'TU_URL_DE_APPS_SCRIPT_AQUI'
 *    - Reemplaza 'TU_URL_DE_APPS_SCRIPT_AQUI' con la URL que copiaste
 *
 * 6. Para actualizaciones futuras al script:
 *    - Implementar → "Gestionar implementaciones" → editar → nueva versión
 *    - La URL NO cambia si usas "Nueva versión" (no nueva implementación)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Maneja las solicitudes POST del formulario de contacto.
 * @param {Object} e - Evento de solicitud HTTP
 * @returns {ContentService.TextOutput} Respuesta JSON
 */
function doPost(e) {
  try {
    // Parsear los datos del formulario
    var datos = JSON.parse(e.postData.contents);

    // Obtener la hoja activa
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Si la hoja está vacía, crear encabezados
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(['Fecha', 'Nombre', 'Email', 'Teléfono', 'Mensaje']);

      // Dar formato a la fila de encabezados
      var encabezados = hoja.getRange(1, 1, 1, 5);
      encabezados.setFontWeight('bold');
      encabezados.setBackground('#1B3A2D');
      encabezados.setFontColor('#FFFFFF');
      hoja.setFrozenRows(1);
    }

    // Agregar la nueva fila con los datos recibidos
    hoja.appendRow([
      datos.fecha   || new Date().toLocaleString('es-PA'),
      datos.nombre  || '',
      datos.email   || '',
      datos.telefono || '',
      datos.mensaje || ''
    ]);

    // Ajustar el ancho de las columnas automáticamente (solo la primera vez)
    if (hoja.getLastRow() === 2) {
      hoja.autoResizeColumns(1, 5);
    }

    // Respuesta exitosa con headers CORS
    return ContentService
      .createTextOutput(JSON.stringify({
        resultado: 'ok',
        mensaje: 'Datos guardados correctamente',
        fila: hoja.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Registrar el error en los logs de Apps Script
    console.error('Error en doPost:', error.toString());

    return ContentService
      .createTextOutput(JSON.stringify({
        resultado: 'error',
        mensaje: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Maneja solicitudes GET — útil para verificar que el script está activo.
 * Accede a la URL del script en el navegador para comprobarlo.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      resultado: 'ok',
      mensaje: 'Script activo — Cafetalera Río Cochea',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
