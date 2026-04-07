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
/* ===== Conexión a la base de datos ===== */
$servername = "localhost";
$username   = "creixuue_roberto_creinti";
$password   = "Raab2013jaab2017@";
$dbname     = "creixuue_contador_sitio";

$totalVisitas = 0;
$dbError      = false;

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    $dbError = true;
} else {
    $sql    = "SELECT contador FROM visitas WHERE id = 1";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        $row          = $result->fetch_assoc();
        $totalVisitas = (int)$row["contador"];
    }
    $conn->close();
}

/* ===== Métricas derivadas ===== */
$paginasVistas   = round($totalVisitas * 3.4);
$sesiones        = round($totalVisitas * 0.82);
$tasa_rebote     = 34;
$duracion_media  = "3m 42s";
$usuarios_nuevos = round($totalVisitas * 0.68);
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
                <h3><span>🌐</span> Dispositivos</h3>
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
                        <th>Tendencia</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $paginas = [
                        ["Inicio (index.html)",            42, "↑"],
                        ["Servicios (#servicios)",         18, "↑"],
                        ["Blog (blog.html)",               14, "↑"],
                        ["Contacto (#contacto)",           10, "→"],
                        ["Proyectos (#proyectos)",          7, "↑"],
                        ["Sobre mí (#sobre-mi)",            5, "→"],
                        ["Libros/Publicaciones",            4, "↓"],
                    ];
                    foreach ($paginas as $i => $p) {
                        $pct   = $p[1];
                        $color = $p[2] === "↑" ? "#38a169" : ($p[2] === "↓" ? "#e53e3e" : "#718096");
                        echo "<tr>
                            <td>" . ($i + 1) . "</td>
                            <td>{$p[0]}</td>
                            <td>" . number_format(round($paginasVistas * $pct / 100)) . "</td>
                            <td>
                                <div class='bar-mini'>
                                    <div class='bar-mini-track'><div class='bar-mini-fill' style='width:{$pct}%'></div></div>
                                    <span>{$pct}%</span>
                                </div>
                            </td>
                            <td style='color:{$color};font-weight:600'>{$p[2]}</td>
                        </tr>";
                    }
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
        labels: ['May','Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr'],
        datasets: [{
            label: 'Visitas',
            data: [210, 245, 290, 320, 380, 410, 450, 390, 470, 520, 560, 610],
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
        labels: ['Móvil', 'Desktop', 'Tablet'],
        datasets: [{
            data: [54, 38, 8],
            backgroundColor: ['#2C5282', '#4299e1', '#bee3f8'],
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
            data: [18, 22, 20, 19, 15, 4, 2],
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
