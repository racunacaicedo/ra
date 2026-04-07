<?php
// =====================================================================
// ARCHIVO DE PRUEBA TEMPORAL - ELIMINAR DESPUÉS DE VERIFICAR
// =====================================================================

header('Content-Type: application/json');

try {
    // Probar conexión a base de datos
    $pdo = new PDO(
        "mysql:host=localhost;dbname=creixuue_contactos_roberto;charset=utf8mb4",
        "creixuue_admin",
        "Rwac1974@",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    echo json_encode([
        'status' => 'SUCCESS',
        'message' => 'Conexión a base de datos exitosa',
        'database' => 'creixuue_contactos_roberto',
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'ERROR',
        'message' => 'Error de conexión: ' . $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}

// =====================================================================
// ELIMINA ESTE ARCHIVO DESPUÉS DE LA PRUEBA
// =====================================================================
?>