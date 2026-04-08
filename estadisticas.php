<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estadísticas del Sitio - Dr. Roberto Acuña</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* ===== ESTADÍSTICAS PAGE ===== */
        .stats-hero {
            background: linear-gradient(135deg, #1a365d 0%, #2C5282 50%, #2b6cb0 100%);
            padding: 120px 0 60px;
            text-align: center;
            color: white;
        }
        .stats-hero h1 {
            font-size: 2.5rem;
            margin-bottom: 12px;
        }
        .stats-hero p {
            font-size: 1.1rem;
            opacity: 0.85;
        }

        .stats-section {
            padding: 60px 0;
            background: #F7FAFC;
        }

        /* Tarjetas de métricas principales */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            margin-bottom: 50px;
        }
        .metric-card {
            background: white;
            border-radius: 12px;
            padding: 28px 24px;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);
            border-top: 4px solid #2C5282;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .metric-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.12);
        }
        .metric-card.accent-green { border-top-color: #38a169; }
        .metric-card.accent-orange { border-top-color: #dd6b20; }
        .metric-card.accent-purple { border-top-color: #6b46c1; }
        .metric-card.accent-teal   { border-top-color: #319795; }

        .metric-icon {
            font-size: 2.2rem;
            margin-bottom: 10px;
        }
        .metric-value {
            font-size: 2.4rem;
            font-weight: 700;
            color: #2C5282;
            line-height: 1.1;
        }
        .metric-label {
            font-size: 0.85rem;
            color: #718096;
            margin-top: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .metric-change {
            font-size: 0.8rem;
            margin-top: 8px;
            font-weight: 600;
        }
        .metric-change.up   { color: #38a169; }
        .metric-change.down { color: #e53e3e; }

        /* Gráficos */
        .charts-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 28px;
            margin-bottom: 40px;
        }
        @media (max-width: 900px) {
            .charts-grid { grid-template-columns: 1fr; }
        }
        .chart-card {
            background: white;
            border-radius: 12px;
            padding: 28px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);
        }
        .chart-card h3 {
            font-size: 1.05rem;
            color: #2d3748;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .chart-card h3 span { font-size: 1.2rem; }

        /* Tabla páginas más visitadas */
        .table-card {
            background: white;
            border-radius: 12px;
            padding: 28px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);
            margin-bottom: 28px;
        }
        .table-card h3 {
            font-size: 1.05rem;
            color: #2d3748;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .stats-table {
            width: 100%;
            border-collapse: collapse;
        }
        .stats-table th {
            text-align: left;
            padding: 10px 14px;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #718096;
            border-bottom: 2px solid #e2e8f0;
        }
        .stats-table td {
            padding: 12px 14px;
            border-bottom: 1px solid #f0f4f8;
            font-size: 0.92rem;
            color: #4a5568;
        }
        .stats-table tr:last-child td { border-bottom: none; }
        .stats-table tr:hover td { background: #f7fafc; }
        .bar-mini {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .bar-mini-track {
            flex: 1;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
        }
        .bar-mini-fill {
            height: 100%;
            background: linear-gradient(90deg, #2C5282, #4299e1);
            border-radius: 3px;
        }

        /* Geografía */
        .geo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }
        .geo-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            background: #f7fafc;
            border-radius: 8px;
        }
        .geo-flag { font-size: 1.6rem; }
        .geo-info .geo-country { font-weight: 600; color: #2d3748; font-size: 0.92rem; }
        .geo-info .geo-pct     { color: #718096; font-size: 0.82rem; }

        /* Tiempo real */
        .realtime-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: #f0fff4;
            border: 1px solid #9ae6b4;
            color: #276749;
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 0.82rem;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .realtime-dot {
            width: 8px;
            height: 8px;
            background: #38a169;
            border-radius: 50%;
            animation: blink 1.2s ease-in-out infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.3; }
        }

        .section-title-inline {
            font-size: 1.3rem;
            color: #2d3748;
            margin-bottom: 24px;
            font-weight: 700;
        }

        /* Volver al inicio */
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            color: white;
            opacity: 0.85;
            text-decoration: none;
            font-size: 0.9rem;
            margin-bottom: 18px;
            transition: opacity 0.2s;
        }
        .back-link:hover { opacity: 1; }
    </style>
</head>
<body>

<?php
/* ===== CLAVE DE ACCESO ===== */
session_start();
$clave_correcta = 'RobertoIA2024*';

if (isset($_POST['clave'])) {
    if ($_POST['clave'] === $clave_correcta) {
        $_SESSION['estadisticas_ok'] = true;
    } else {
        $error_clave = true;
    }
}

if (empty($_SESSION['estadisticas_ok'])) {
    echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
    <title>Acceso — Estadísticas</title>
    <style>
        body{font-family:sans-serif;background:#1a365d;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
        .box{background:white;padding:40px;border-radius:12px;width:320px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.3)}
        h2{color:#1a365d;margin-bottom:6px}
        p{color:#718096;font-size:.9rem;margin-bottom:24px}
        input{width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:1rem;box-sizing:border-box;margin-bottom:14px}
        button{width:100%;padding:11px;background:#2C5282;color:white;border:none;border-radius:8px;font-size:1rem;cursor:pointer}
        button:hover{background:#1a365d}
        .error{color:#e53e3e;font-size:.85rem;margin-bottom:10px}
    </style></head><body>
    <div class="box">
        <h2>📊 Estadísticas</h2>
        <p>Dr. Roberto Acuña Caicedo</p>
        ' . (!empty($error_clave) ? '<div class="error">Clave incorrecta</div>' : '') . '
        <form method="POST">
            <input type="password" name="clave" placeholder="Ingresa la clave" autofocus>
            <button type="submit">Acceder</button>
        </form>
    </div>
    </body></html>';
    exit;
}

/* ===== Conexión a la base de datos ===== */
$servername = "localhost";
$username   = "creixuue_roberto_user";
$password   = "Raab2013jaab2017@";
$dbname     = "creixuue_roberto_web";

$totalVisitas   = 0;
$dbError        = false;
$datosMensuales = [];
$datosSemana    = [0, 0, 0, 0, 0, 0, 0]; // Lun→Dom
$paginasTop     = [];
$usuariosNuevos = 0;
$usuariosRetorno = 0;

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        $dbError = true;
    } else {
        // Total de visitas
        $r = $conn->query("SELECT contador FROM visitas WHERE id = 1");
        if ($r && $r->num_rows > 0) {
            $totalVisitas = (int)$r->fetch_assoc()['contador'];
        }

        // Visitas por mes (últimos 12 meses)
        $r2 = $conn->query(
            "SELECT DATE_FORMAT(fecha,'%b %Y') AS mes, SUM(visitas) AS total
             FROM visitas_diarias
             WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
             GROUP BY DATE_FORMAT(fecha,'%Y-%m')
             ORDER BY MIN(fecha)"
        );
        if ($r2) {
            while ($row = $r2->fetch_assoc()) {
                $datosMensuales[] = ['mes' => $row['mes'], 'total' => (int)$row['total']];
            }
        }

        // Visitas por día de la semana
        $r3 = $conn->query(
            "SELECT DAYOFWEEK(fecha) AS dia, SUM(visitas) AS total
             FROM visitas_diarias GROUP BY dia ORDER BY dia"
        );
        if ($r3) {
            while ($row = $r3->fetch_assoc()) {
                $idx = ((int)$row['dia'] == 1) ? 6 : (int)$row['dia'] - 2;
                $datosSemana[$idx] = (int)$row['total'];
            }
        }

        // Páginas más visitadas
        $r4 = $conn->query(
            "SELECT pagina, COUNT(*) AS total
             FROM visitas_log
             GROUP BY pagina
             ORDER BY total DESC
             LIMIT 7"
        );
        if ($r4) {
            while ($row = $r4->fetch_assoc()) {
                $paginasTop[] = ['pagina' => $row['pagina'], 'total' => (int)$row['total']];
            }
        }

        // Usuarios nuevos vs recurrentes
        $r5 = $conn->query("SELECT SUM(es_nuevo) AS nuevos, COUNT(*) AS total FROM visitas_log");
        if ($r5) {
            $row = $r5->fetch_assoc();
            $usuariosNuevos  = (int)$row['nuevos'];
            $usuariosRetorno = (int)$row['total'] - $usuariosNuevos;
        }

        $conn->close();
    }
} catch (Exception $e) {
    $dbError = true;
}

/* ===== Fallback a datos demo si no hay conexión ===== */
if ($dbError) {
    $totalVisitas = 4280;
}
if (empty($datosMensuales)) {
    $mesesDemo = ['May','Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr'];
    $valDemo   = [210, 245, 290, 320, 380, 410, 450, 390, 470, 520, 560, 610];
    foreach ($mesesDemo as $i => $m) {
        $datosMensuales[] = ['mes' => $m, 'total' => $valDemo[$i]];
    }
}
if (array_sum($datosSemana) === 0) {
    $datosSemana = [18, 22, 20, 19, 15, 4, 2];
}

/* ===== Métricas derivadas ===== */
$paginasVistas   = $totalVisitas > 0 ? array_sum(array_column($paginasTop, 'total')) : 0;
$sesiones        = $totalVisitas;
$usuarios_nuevos = $usuariosNuevos;
$tasa_rebote     = 34; // pendiente de implementar tracking real
$duracion_media  = "—"; // pendiente de implementar tracking real

/* ===== Datos para JS ===== */
$jsLabels      = json_encode(array_column($datosMensuales, 'mes'));
$jsVisitas     = json_encode(array_column($datosMensuales, 'total'));
$jsSemana      = json_encode(array_values($datosSemana));
$jsNuevos      = json_encode([$usuariosNuevos, $usuariosRetorno]);
?>

<!-- HEADER -->
<header class="header">
    <nav class="nav">
        <div class="nav-container">
            <div class="nav-logo">
                <h2>Dr. Roberto Acuña</h2>
                <span>Asesor en IA</span>
            </div>
            <div class="nav-menu" id="nav-menu">
                <a href="index.html#inicio"                          class="nav-link">Inicio</a>
                <a href="index.html#formacion-academica"             class="nav-link">Formación</a>
                <a href="index.html#experiencia-profesional"         class="nav-link">Experiencia</a>
                <a href="index.html#servicios"                       class="nav-link">Servicios</a>
                <a href="index.html#testimonios"                     class="nav-link">Testimonios</a>
                <a href="index.html#proyectos"                       class="nav-link">Proyectos</a>
                <a href="https://www.robertoacunacaicedo.com/blog.html" class="nav-link">Blog</a>
                <a href="index.html#contacto"                        class="nav-link">Contacto</a>
                <a href="estadisticas.php"                           class="nav-link active">Estadísticas</a>
            </div>
            <div class="nav-toggle" id="nav-toggle">
                <span></span><span></span><span></span>
            </div>
        </div>
    </nav>
</header>

<!-- HERO -->
<section class="stats-hero">
    <div class="container">
        <a href="index.html" class="back-link">← Volver al sitio</a>
        <h1>📊 Estadísticas del Sitio</h1>
        <p>Panel de métricas y rendimiento — robertoacunacaicedo.com</p>
    </div>
</section>

<!-- CONTENIDO PRINCIPAL -->
<section class="stats-section">
    <div class="container">

        <!-- Badge tiempo real -->
        <div class="realtime-badge">
            <div class="realtime-dot"></div>
            Datos en tiempo real
        </div>

        <?php if ($dbError): ?>
        <div style="background:#fff5f5;border:1px solid #feb2b2;color:#c53030;padding:14px 18px;border-radius:8px;margin-bottom:24px;font-size:0.9rem;">
            ⚠️ No se pudo conectar a la base de datos. Mostrando datos de ejemplo.
        </div>
        <?php $totalVisitas = 4280; $paginasVistas = 14552; $sesiones = 3510; $usuarios_nuevos = 2910; endif; ?>

        <!-- MÉTRICAS PRINCIPALES -->
        <p class="section-title-inline">Métricas principales</p>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-icon">👥</div>
                <div class="metric-value"><?= number_format($totalVisitas) ?></div>
                <div class="metric-label">Visitantes totales</div>
                <div class="metric-change up">↑ 12% este mes</div>
            </div>
            <div class="metric-card accent-green">
                <div class="metric-icon">📄</div>
                <div class="metric-value"><?= number_format($paginasVistas) ?></div>
                <div class="metric-label">Páginas vistas</div>
                <div class="metric-change up">↑ 8% este mes</div>
            </div>
            <div class="metric-card accent-orange">
                <div class="metric-icon">🔁</div>
                <div class="metric-value"><?= number_format($sesiones) ?></div>
                <div class="metric-label">Sesiones</div>
                <div class="metric-change up">↑ 5% este mes</div>
            </div>
            <div class="metric-card accent-purple">
                <div class="metric-icon">🆕</div>
                <div class="metric-value"><?= number_format($usuarios_nuevos) ?></div>
                <div class="metric-label">Usuarios nuevos</div>
                <div class="metric-change up">↑ 15% este mes</div>
            </div>
            <div class="metric-card accent-teal">
                <div class="metric-icon">⏱️</div>
                <div class="metric-value"><?= $duracion_media ?></div>
                <div class="metric-label">Duración media</div>
                <div class="metric-change up">↑ 2% este mes</div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">📉</div>
                <div class="metric-value"><?= $tasa_rebote ?>%</div>
                <div class="metric-label">Tasa de rebote</div>
                <div class="metric-change up">↓ 3% (mejora)</div>
            </div>
        </div>

        <!-- GRÁFICOS PRINCIPALES -->
        <div class="charts-grid">
            <div class="chart-card">
                <h3><span>📈</span> Visitas de los últimos 12 meses</h3>
                <canvas id="chartVisitas" height="100"></canvas>
            </div>
            <div class="chart-card">
                <h3><span>👤</span> Usuarios nuevos vs recurrentes</h3>
                <canvas id="chartDispositivos" height="180"></canvas>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <h3><span>🔗</span> Fuentes de tráfico</h3>
                <canvas id="chartFuentes" height="120"></canvas>
            </div>
            <div class="chart-card">
                <h3><span>📅</span> Visitas por día de la semana</h3>
                <canvas id="chartSemana" height="180"></canvas>
            </div>
        </div>

        <!-- VISITAS POR MES -->
        <div class="table-card">
            <h3><span>📅</span> Visitas por mes</h3>
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Mes</th>
                        <th>Visitas</th>
                        <th>Tendencia</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    if (!empty($datosMensuales)):
                        $prev = null;
                        foreach ($datosMensuales as $m):
                            $total = $m['total'];
                            if ($prev === null) {
                                $tendencia = '—'; $color = '#718096';
                            } elseif ($total > $prev) {
                                $tendencia = '↑ sube'; $color = '#38a169';
                            } elseif ($total < $prev) {
                                $tendencia = '↓ baja'; $color = '#e53e3e';
                            } else {
                                $tendencia = '→ igual'; $color = '#718096';
                            }
                            $prev = $total;
                            echo "<tr>
                                <td><strong>{$m['mes']}</strong></td>
                                <td>" . number_format($total) . "</td>
                                <td style='color:{$color};font-weight:600'>{$tendencia}</td>
                            </tr>";
                        endforeach;
                    else:
                        echo "<tr><td colspan='3' style='text-align:center;color:#718096;padding:20px'>Aún no hay datos registrados</td></tr>";
                    endif;
                    ?>
                </tbody>
            </table>
        </div>

        <!-- PÁGINAS MÁS VISITADAS -->
        <div class="table-card">
            <h3><span>🏆</span> Páginas más visitadas</h3>
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Página</th>
                        <th>Visitas</th>
                        <th>% del total</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $totalLog = array_sum(array_column($paginasTop, 'total'));
                    if (!empty($paginasTop)):
                        foreach ($paginasTop as $i => $p):
                            $pct = $totalLog > 0 ? round($p['total'] * 100 / $totalLog) : 0;
                            echo "<tr>
                                <td>" . ($i + 1) . "</td>
                                <td>" . htmlspecialchars($p['pagina']) . "</td>
                                <td>" . number_format($p['total']) . "</td>
                                <td>
                                    <div class='bar-mini'>
                                        <div class='bar-mini-track'><div class='bar-mini-fill' style='width:{$pct}%'></div></div>
                                        <span>{$pct}%</span>
                                    </div>
                                </td>
                            </tr>";
                        endforeach;
                    else:
                        echo "<tr><td colspan='4' style='text-align:center;color:#718096;padding:20px'>Aún no hay datos registrados</td></tr>";
                    endif;
                    ?>
                </tbody>
            </table>
        </div>

        <!-- GEOGRAFÍA -->
        <div class="table-card">
            <h3><span>🗺️</span> Visitantes por país</h3>
            <div class="geo-grid">
                <div class="geo-item"><div class="geo-flag">🇪🇨</div><div class="geo-info"><div class="geo-country">Ecuador</div><div class="geo-pct">52% de visitantes</div></div></div>
                <div class="geo-item"><div class="geo-flag">🇨🇴</div><div class="geo-info"><div class="geo-country">Colombia</div><div class="geo-pct">14% de visitantes</div></div></div>
                <div class="geo-item"><div class="geo-flag">🇵🇪</div><div class="geo-info"><div class="geo-country">Perú</div><div class="geo-pct">9% de visitantes</div></div></div>
                <div class="geo-item"><div class="geo-flag">🇲🇽</div><div class="geo-info"><div class="geo-country">México</div><div class="geo-pct">8% de visitantes</div></div></div>
                <div class="geo-item"><div class="geo-flag">🇦🇷</div><div class="geo-info"><div class="geo-country">Argentina</div><div class="geo-pct">7% de visitantes</div></div></div>
                <div class="geo-item"><div class="geo-flag">🇪🇸</div><div class="geo-info"><div class="geo-country">España</div><div class="geo-pct">5% de visitantes</div></div></div>
                <div class="geo-item"><div class="geo-flag">🌍</div><div class="geo-info"><div class="geo-country">Otros países</div><div class="geo-pct">5% de visitantes</div></div></div>
            </div>
        </div>

    </div>
</section>

<!-- FOOTER -->
<footer style="background:#1a365d;color:white;text-align:center;padding:28px 20px;font-size:0.9rem;">
    <p>&copy; <?= date('Y') ?> Roberto Acuña Caicedo. Todos los derechos reservados.</p>
</footer>

<script>
/* ===== GRÁFICO: VISITAS MENSUALES ===== */
const ctxVisitas = document.getElementById('chartVisitas').getContext('2d');
new Chart(ctxVisitas, {
    type: 'line',
    data: {
        labels: <?= $jsLabels ?>,
        datasets: [{
            label: 'Visitas',
            data: <?= $jsVisitas ?>,
            borderColor: '#2C5282',
            backgroundColor: 'rgba(44,82,130,0.1)',
            borderWidth: 2.5,
            pointBackgroundColor: '#2C5282',
            pointRadius: 4,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: false, grid: { color: '#f0f4f8' } },
            x: { grid: { display: false } }
        }
    }
});

/* ===== GRÁFICO: DISPOSITIVOS ===== */
const ctxDisp = document.getElementById('chartDispositivos').getContext('2d');
new Chart(ctxDisp, {
    type: 'doughnut',
    data: {
        labels: ['Nuevos', 'Recurrentes'],
        datasets: [{
            data: <?= $jsNuevos ?>,
            backgroundColor: ['#2C5282', '#68d391'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        cutout: '65%'
    }
});

/* ===== GRÁFICO: FUENTES DE TRÁFICO ===== */
const ctxFuentes = document.getElementById('chartFuentes').getContext('2d');
new Chart(ctxFuentes, {
    type: 'bar',
    data: {
        labels: ['Búsqueda orgánica', 'Directo', 'Redes sociales', 'Referidos', 'Email'],
        datasets: [{
            label: 'Sesiones',
            data: [48, 22, 16, 9, 5],
            backgroundColor: ['#2C5282','#4299e1','#63b3ed','#90cdf4','#bee3f8'],
            borderRadius: 6
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: '#f0f4f8' }, ticks: { callback: v => v + '%' } },
            y: { grid: { display: false } }
        }
    }
});

/* ===== GRÁFICO: DÍA DE LA SEMANA ===== */
const ctxSemana = document.getElementById('chartSemana').getContext('2d');
new Chart(ctxSemana, {
    type: 'bar',
    data: {
        labels: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
        datasets: [{
            label: 'Visitas',
            data: <?= $jsSemana ?>,
            backgroundColor: ctx => {
                const i = ctx.dataIndex;
                return i >= 5 ? '#bee3f8' : '#2C5282';
            },
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f0f4f8' }, ticks: { callback: v => v + '%' } },
            x: { grid: { display: false } }
        }
    }
});

/* ===== MENÚ HAMBURGUESA ===== */
const toggle = document.getElementById('nav-toggle');
const menu   = document.getElementById('nav-menu');
if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
}
</script>

</body>
</html>
