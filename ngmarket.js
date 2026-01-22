/* Script: ngmarket.js (Modificado para Tesis)
   Función: Fuerza el contexto de Nigeria (NG) en la solicitud (Headers y Body).
   Mejoras: Crea headers si faltan y protege contra errores de JSON.
*/

if ($request.method.toUpperCase() !== "OPTIONS") {
  let headers = $request.headers;
  let body = {};
  let modifiedBody = false; // Bandera para saber si tocamos el cuerpo

  // 1. Intentamos manipular el Cuerpo (Body)
  try {
    // Solo intentamos parsear si hay contenido
    if ($request.body) {
      body = JSON.parse($request.body);
      
      let url = $request.url;

      // Modificamos Región y Locale si existen
      if (body.market) {
        body.market = "NG";
        modifiedBody = true;
      }

      if (body.locale) {
        body.locale = "en-NG";
        modifiedBody = true;
      }

      // Lógica específica del friendlyName (conservada del original)
      if (body.friendlyName) {
        if (url.includes("appId=storeCart")) {
          body.friendlyName = "cart-save-for-later-NG";
        } else {
          body.friendlyName = "cart-NG";
        }
        modifiedBody = true;
      }
    }
  } catch (e) {
    console.log("[Script] No se pudo parsear el Body como JSON (posiblemente binario o vacío), saltando modificación de Body.");
  }

  // 2. Manipulación de Encabezados (Headers) - CRÍTICO PARA ADMIN
  // Buscamos variaciones de mayúsculas/minúsculas para asegurar la inyección
  const marketHeaderKeys = ["X-MS-Market", "x-ms-market", "Market", "market"];
  let headerFound = false;

  marketHeaderKeys.forEach(key => {
    if (headers[key]) {
      headers[key] = "NG";
      headerFound = true;
    }
  });

  // SI NO EXISTE EL HEADER, LO CREAMOS (Inyección Forzada)
  // Esto es lo que permite que una solicitud "Hondureña" se convierta en "Nigeriana"
  if (!headerFound) {
    headers["X-MS-Market"] = "NG";
    console.log("[Script] Header X-MS-Market no existía. Inyectado: NG");
  } else {
    console.log("[Script] Header X-MS-Market existente modificado a: NG");
  }

  // 3. Reconstrucción de la respuesta
  // Si modificamos el cuerpo, lo devolvemos stringified. Si no, devolvemos solo headers modificados.
  if (modifiedBody) {
    $done({
      headers: headers,
      body: JSON.stringify(body)
    });
  } else {
    // Mantenemos el cuerpo original si no era JSON o no se tocó
    $done({
      headers: headers
    });
  }

} else {
  $done({});
}