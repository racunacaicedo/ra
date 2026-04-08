<?php
$servername = "localhost";
$username   = "creixuue_roberto_user";
$password   = "Raab2013jaab2017@";
$dbname     = "creixuue_roberto_web";

// Página visitada (viene como parámetro GET)
$pagina = isset($_GET['pagina']) ? substr(strip_tags($_GET['pagina']), 0, 100) : 'index';

// Detectar usuario nuevo via cookie (1 año de duración)
$es_nuevo = 0;
if (!isset($_COOKIE['ra_visitor'])) {
    setcookie('ra_visitor', '1', time() + (365 * 24 * 3600), '/');
    $es_nuevo = 1;
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) { http_response_code(500); exit; }

    // Incrementar contador total
    $conn->query("UPDATE visitas SET contador = contador + 1 WHERE id = 1");

    // Registrar visita del día
    $conn->query("INSERT INTO visitas_diarias (fecha, visitas) VALUES (CURDATE(), 1)
                  ON DUPLICATE KEY UPDATE visitas = visitas + 1");

    // Log detallado: página + usuario nuevo/recurrente
    $stmt = $conn->prepare("INSERT INTO visitas_log (pagina, es_nuevo) VALUES (?, ?)");
    $stmt->bind_param("si", $pagina, $es_nuevo);
    $stmt->execute();
    $stmt->close();

    // Devolver total actual
    $r   = $conn->query("SELECT contador FROM visitas WHERE id = 1");
    $row = $r->fetch_assoc();
    echo (int)$row['contador'];

    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
}
?>
