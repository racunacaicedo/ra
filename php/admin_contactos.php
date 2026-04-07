<?php
// =====================================================================
// PANEL DE ADMINISTRACIÓN SIMPLE - CONTACTOS ROBERTO ACUÑA
// =====================================================================

// Autenticación básica (CAMBIAR EN PRODUCCIÓN)
session_start();
if (!isset($_SESSION['admin_logged']) && !isset($_POST['admin_pass'])) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Admin - Contactos Roberto Acuña</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .login-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 300px; }
            input[type="password"] { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
            button { width: 100%; background: #4A90E2; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #357ABD; }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>Acceso Administrador</h2>
            <form method="POST">
                <input type="password" name="admin_pass" placeholder="Contraseña" required>
                <button type="submit">Ingresar</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit();
}

// Verificar contraseña (CAMBIAR EN PRODUCCIÓN)
if (isset($_POST['admin_pass'])) {
    if ($_POST['admin_pass'] === 'Roberto2024@') { // CAMBIAR ESTA CONTRASEÑA
        $_SESSION['admin_logged'] = true;
    } else {
        echo "<script>alert('Contraseña incorrecta'); history.back();</script>";
        exit();
    }
}

// Conectar a base de datos
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=creixuue_contactos_roberto;charset=utf8mb4",
        "creixuue_admin",
        "Rwac1974@",
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Procesar acciones
if (isset($_GET['action']) && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $action = $_GET['action'];

    if ($action === 'marcar_leido') {
        $stmt = $pdo->prepare("UPDATE contactos SET estado = 'leido' WHERE id = ?");
        $stmt->execute([$id]);
    } elseif ($action === 'marcar_respondido') {
        $stmt = $pdo->prepare("UPDATE contactos SET estado = 'respondido', fecha_respuesta = NOW() WHERE id = ?");
        $stmt->execute([$id]);
    } elseif ($action === 'eliminar') {
        $stmt = $pdo->prepare("DELETE FROM contactos WHERE id = ?");
        $stmt->execute([$id]);
    }
}

// Obtener contactos
$filtro = $_GET['filtro'] ?? 'todos';
$sql = "SELECT * FROM contactos_resumen";

if ($filtro === 'nuevos') {
    $sql .= " WHERE estado = 'nuevo'";
} elseif ($filtro === 'pendientes') {
    $sql .= " WHERE estado IN ('nuevo', 'leido')";
}

$sql .= " ORDER BY fecha_creacion DESC LIMIT 50";
$stmt = $pdo->query($sql);
$contactos = $stmt->fetchAll();

// Obtener estadísticas
$stats = $pdo->query("
    SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'nuevo' THEN 1 END) as nuevos,
        COUNT(CASE WHEN estado = 'leido' THEN 1 END) as leidos,
        COUNT(CASE WHEN estado = 'respondido' THEN 1 END) as respondidos,
        COUNT(CASE WHEN DATE(fecha_creacion) = CURDATE() THEN 1 END) as hoy
    FROM contactos
")->fetch();

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Contactos Roberto Acuña</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; }
        .header { background: linear-gradient(135deg, #4A90E2, #FF6B35); color: white; padding: 20px; text-align: center; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #4A90E2; }
        .stat-label { color: #666; margin-top: 5px; }
        .filters { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
        .filter-btn { padding: 8px 16px; background: white; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #333; }
        .filter-btn.active { background: #4A90E2; color: white; }
        .contactos-table { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8fafc; font-weight: 600; }
        .estado { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; }
        .estado.nuevo { background: #fee2e2; color: #dc2626; }
        .estado.leido { background: #fef3c7; color: #d97706; }
        .estado.respondido { background: #d1fae5; color: #16a34a; }
        .acciones { display: flex; gap: 5px; }
        .btn { padding: 4px 8px; font-size: 0.8rem; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
        .btn-primary { background: #4A90E2; color: white; }
        .btn-success { background: #16a34a; color: white; }
        .btn-danger { background: #dc2626; color: white; }
        .mensaje-preview { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .logout { position: fixed; top: 20px; right: 20px; }
        @media (max-width: 768px) {
            .contactos-table { overflow-x: auto; }
            table { min-width: 800px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Panel de Administración - Contactos</h1>
        <p>Dr. Roberto Acuña Caicedo - Asesor en Inteligencia Artificial</p>
        <a href="?logout=1" class="btn btn-danger logout">Cerrar Sesión</a>
    </div>

    <div class="container">
        <!-- Estadísticas -->
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number"><?= $stats['total'] ?></div>
                <div class="stat-label">Total Contactos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['nuevos'] ?></div>
                <div class="stat-label">Nuevos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['leidos'] ?></div>
                <div class="stat-label">Leídos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['respondidos'] ?></div>
                <div class="stat-label">Respondidos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?= $stats['hoy'] ?></div>
                <div class="stat-label">Hoy</div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filters">
            <a href="?" class="filter-btn <?= $filtro === 'todos' ? 'active' : '' ?>">Todos</a>
            <a href="?filtro=nuevos" class="filter-btn <?= $filtro === 'nuevos' ? 'active' : '' ?>">Nuevos</a>
            <a href="?filtro=pendientes" class="filter-btn <?= $filtro === 'pendientes' ? 'active' : '' ?>">Pendientes</a>
        </div>

        <!-- Tabla de contactos -->
        <div class="contactos-table">
<!-- En admin_contactos.php, REEMPLAZA la tabla con esta versión actualizada: -->
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>  <!-- NUEVA COLUMNA -->
                        <th>Empresa</th>
                        <th>Tipo Cliente</th>
                        <th>Mensaje</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($contactos as $contacto): ?>
                    <tr>
                        <td>#<?= $contacto['id'] ?></td>
                        <td><?= htmlspecialchars($contacto['nombre']) ?></td>
                        <td>
                            <a href="mailto:<?= htmlspecialchars($contacto['email']) ?>">
                                <?= htmlspecialchars($contacto['email']) ?>
                            </a>
                        </td>
                        <td>
                            <?php if (!empty($contacto['telefono'])): ?>
                                <a href="tel:<?= htmlspecialchars($contacto['telefono']) ?>">
                                    <?= htmlspecialchars($contacto['telefono']) ?>
                                </a>
                            <?php else: ?>
                                <span style="color: #9ca3af;">No proporcionado</span>
                            <?php endif; ?>
                        </td>
                        <td><?= htmlspecialchars($contacto['empresa'] ?: 'N/A') ?></td>
                        <td><?= ucfirst($contacto['tipo_cliente']) ?></td>
                        <td class="mensaje-preview" title="<?= htmlspecialchars($contacto['mensaje_preview']) ?>">
                            <?= htmlspecialchars($contacto['mensaje_preview']) ?>
                        </td>
                        <td><?= date('d/m/Y H:i', strtotime($contacto['fecha_creacion'])) ?></td>
                        <td>
                            <span class="estado <?= $contacto['estado'] ?>">
                                <?= ucfirst($contacto['estado']) ?>
                            </span>
                        </td>
                        <td class="acciones">
                            <?php if ($contacto['estado'] === 'nuevo'): ?>
                                <a href="?action=marcar_leido&id=<?= $contacto['id'] ?>" class="btn btn-primary" title="Marcar como leído">📖</a>
                            <?php endif; ?>
                            <?php if (in_array($contacto['estado'], ['nuevo', 'leido'])): ?>
                                <a href="?action=marcar_respondido&id=<?= $contacto['id'] ?>" class="btn btn-success" title="Marcar como respondido">✅</a>
                            <?php endif; ?>
                            <a href="?action=eliminar&id=<?= $contacto['id'] ?>" class="btn btn-danger"
                               onclick="return confirm('¿Seguro que quieres eliminar este contacto?')" title="Eliminar">🗑️</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Auto-refresh cada 30 segundos si hay contactos nuevos
        <?php if ($stats['nuevos'] > 0): ?>
        setTimeout(() => location.reload(), 30000);
        <?php endif; ?>
    </script>
</body>
</html>

<?php
// Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit();
}
?>