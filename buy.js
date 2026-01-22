/* Script: buy.js (Modificado para Tesis)
   Función: Inyecta el Cart ID de Nigeria (guardado previamente) en la solicitud de compra.
   Mejoras: Manejo de errores y notificaciones en español.
*/

if ($request.method.toUpperCase() !== "OPTIONS") {
    // 1. Intentamos leer el ID guardado en el almacenamiento persistente
    let storedCartId = $persistentStore.read("cartId");

    if (storedCartId) {
        try {
            // Intentamos parsear el cuerpo de la solicitud original
            let body = JSON.parse($request.body);

            // 2. Verificamos si la solicitud original tiene un campo 'cartId'
            if (body.cartId) {
                let originalId = body.cartId;
                
                // REEMPLAZO: Sobrescribimos con el ID de Nigeria
                body.cartId = storedCartId;
                
                // Notificación visual de éxito
                $notification.post("Cart ID Inyectado", ID Usado: ${storedCartId}, "");
                console.log([Script] Reemplazo Exitoso. Original: ${originalId} -> Nuevo: ${storedCartId});

                // Devolvemos el cuerpo modificado
                $done({
                    body: JSON.stringify(body)
                });
            } else {
                // Si la solicitud no tiene cartId, no hacemos nada (Evita romper otros flujos)
                console.log("[Script] La solicitud no contiene cartId, se omite inyección.");
                $done({});
            }

        } catch (e) {
            // Si hay error al leer el JSON, dejamos pasar la solicitud tal cual
            console.log([Script] Error al procesar JSON: ${e});
            $done({});
        }
    } else {
        // Si no hay ID guardado, no bloqueamos ni notificamos error (Modo Silencioso)
        // Esto es importante para el Admin si no ha generado un carrito él mismo.
        console.log("[Script] No se encontró ningún cartId almacenado para usar.");
        $done({});
    }
} else {
    $done({});
}