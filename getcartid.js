/* Script: getcartid.js (Modificado para Tesis)
   Función: Captura el ID del carrito de la respuesta del servidor y lo guarda.
   Mejoras: Traducción a español y manejo de errores robusto.
*/

let body = $response.body;

try {
    // Intentamos parsear la respuesta como JSON
    let obj = JSON.parse(body);

    // Verificamos si existe la estructura del carrito y el ID
    if (obj.cart && obj.cart.id) {
        let cartId = obj.cart.id;
        
        // Guardamos el ID en el almacenamiento persistente
        let success = $persistentStore.write(cartId, "cartId");

        if (success) {
            // Notificación visual SOLO si se guarda con éxito
            $notification.post("Cart ID Capturado", `ID: ${cartId}`, "Guardado en memoria para inyección");
            console.log(`[Script] Cart ID guardado exitosamente: ${cartId}`);
        } else {
            console.log("[Script] Error al escribir en persistentStore");
        }

    } else {
        // Si la respuesta es JSON pero no tiene carrito, solo logueamos (sin alerta visual)
        console.log("[Script] La respuesta no contiene un objeto 'cart.id' válido.");
    }

} catch (e) {
    // Si la respuesta no es JSON (ej. HTML o error de red), capturamos el error silenciosamente
    console.log(`[Script] Error al procesar respuesta (No es JSON válido): ${e}`);
}

// Finalizamos la ejecución dejando pasar la respuesta original
$done({});