<?php
$servername = "localhost";
$username   = "creixuue_roberto_user";
$password   = "Raab2013jaab2017@";
$dbname     = "creixuue_roberto_web";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) { http_response_code(500); exit; }

    // Incrementar contador total
    $conn->query("UPDATE visitas SET contador = contador + 1 WHERE id = 1");

    // Registrar visita del día (INSERT o sumar si ya existe)
    $conn->query("INSERT INTO visitas_diarias (fecha, visitas) VALUES (CURDATE(), 1)
                  ON DUPLICATE KEY UPDATE visitas = visitas + 1");

    // Devolver total actual
    $r = $conn->query("SELECT contador FROM visitas WHERE id = 1");
    $row = $r->fetch_assoc();
    echo (int)$row['contador'];

    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
}
?>
