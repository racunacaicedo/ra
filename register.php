<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "creixuue_roberto_creinti";
$password = "Raab2013jaab2017@";
$dbname = "creixuue_contador_sitio";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Inicializar variable para mostrar mensaje
$message = "";

// Comprobar si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $conn->real_escape_string($_POST["email"]);

    // Verificar si el correo ya existe en la base de datos
    $sql_check = "SELECT * FROM suscripciones WHERE email = '$email'";
    $result_check = $conn->query($sql_check);

    if ($result_check->num_rows > 0) {
        // El correo ya está registrado
        $message = "Correo ya registrado";
    } else {
        // Insertar el correo en la base de datos
        $sql_insert = "INSERT INTO suscripciones (email) VALUES ('$email')";
        
        if ($conn->query($sql_insert) === TRUE) {
            $message = "Correo registrado con éxito";
        } else {
            $message = "Error: " . $sql_insert . "<br>" . $conn->error;
        }
    }
}

// Cerrar conexión
$conn->close();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Registro de Correo</title>
    <link rel="stylesheet" type="text/css" href="css/style2.css">
</head>
<body>
    <form method="POST" action="register.php">
        <input type="email" name="email" required>
        <button type="submit">Registrar</button>
    </form>

    <div id="popup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closePopup()">&times;</span>
            <p><?php echo $message; ?></p>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            <?php if (!empty($message)): ?>
            showPopup();
            <?php endif; ?>
        });
    </script>
</body>
</html>
