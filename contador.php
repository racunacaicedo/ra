<?php
// Configuración de la base de datos
$servername = "localhost"; // Usualmente "localhost" en hosting compartido
$username = "creixuue_roberto_creinti"; // El usuario que creaste en cPanel
$password = "Raab2013jaab2017@"; // La contraseña para el usuario
$dbname = "creixuue_contador_sitio"; // La base de datos que creaste

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Leer el valor actual del contador
$sql = "SELECT contador FROM visitas WHERE id = 1";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        // Obtener el valor del contador
        $row = $result->fetch_assoc();
        $contador = $row["contador"];

        // Incrementar el contador
        $contador++;

        // Actualizar el contador en la base de datos
        $sql = "UPDATE visitas SET contador = $contador WHERE id = 1";
        if ($conn->query($sql) !== TRUE) {
            die("Error actualizando el contador: " . $conn->error);
        }
    } else {
        die("Error: No se encontró el contador en la base de datos.");
    }
} else {
    die("Error ejecutando la consulta: " . $conn->error);
}

// Cerrar conexión
$conn->close();

// Devolver el contador actualizado
echo $contador;
?>
