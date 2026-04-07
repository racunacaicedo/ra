<?php
// =====================================================================
// PROCESADOR DE FORMULARIO DE CONTACTO - ROBERTO ACUÑA CAICEDO
// Versión CORREGIDA - Solo fixes críticos sin cambios estructurales
// =====================================================================

// Headers básicos pero seguros
header('Content-Type: application/json; charset=utf-8');

// CORS - Solo dominios específicos (CORREGIDO)
$allowedOrigins = [
    'https://robertoacunacaicedo.com',
    'https://www.robertoacunacaicedo.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins) || empty($origin)) {
    header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Solo se acepta POST.'
    ]);
    exit();
}

// =====================================================================
// CONFIGURACIÓN - Mantenemos simple pero agregamos fallbacks
// =====================================================================

class DatabaseConfig {
    const HOST = 'localhost';
    const USERNAME = 'creixuue_admin';
    const PASSWORD = 'Rwac1974@';  // TEMPORAL - cambiar en producción
    const DATABASE = 'creixuue_contactos_roberto';
    const CHARSET = 'utf8mb4';
}

// =====================================================================
// CLASE PRINCIPAL - CONSERVADORA CON FIXES MÍNIMOS
// =====================================================================

class ContactFormProcessor {
    private $pdo;
    private $config;
    private $requestId;

    public function __construct() {
        $this->requestId = uniqid('req_', true);
        $this->connectDatabase();
        $this->loadConfiguration();

        // Log simple
        error_log("ContactForm: Nueva instancia - ID: {$this->requestId}");
    }

    // Conectar a la base de datos - IGUAL AL ORIGINAL
    private function connectDatabase() {
        try {
            $dsn = "mysql:host=" . DatabaseConfig::HOST .
                   ";dbname=" . DatabaseConfig::DATABASE .
                   ";charset=" . DatabaseConfig::CHARSET;

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            $this->pdo = new PDO($dsn, DatabaseConfig::USERNAME, DatabaseConfig::PASSWORD, $options);

        } catch (PDOException $e) {
            error_log("ContactForm ERROR - DB Connection: " . $e->getMessage());
            $this->sendError('Error de conexión a la base de datos', 500);
        }
    }

    // Cargar configuración - IGUAL AL ORIGINAL
    private function loadConfiguration() {
        try {
            $stmt = $this->pdo->query("SELECT clave, valor FROM configuracion");
            $this->config = [];

            while ($row = $stmt->fetch()) {
                $this->config[$row['clave']] = $row['valor'];
            }
        } catch (PDOException $e) {
            error_log("ContactForm WARNING - Config load failed: " . $e->getMessage());
            $this->config = [
                'max_intentos_dia' => 5,
                'auto_respuesta' => 1,
                'email_notificacion' => 'contacto@robertoacunacaicedo.com'
            ];
        }
    }

    // Procesar formulario - CON PROTECCIÓN ANTI-DUPLICADOS
    public function processForm() {
        try {
            // NUEVO: Verificar si ya se procesó este request
            if ($this->isDuplicateRequest()) {
                error_log("ContactForm WARNING - Duplicate request detected: {$this->requestId}");
                $this->sendError('Request duplicado detectado', 409);
            }

            // Obtener y validar datos
            $data = $this->getFormData();
            $validationResult = $this->validateData($data);

            if (!$validationResult['valid']) {
                error_log("ContactForm WARNING - Validation failed: " . $validationResult['message']);
                $this->sendError($validationResult['message'], 400);
            }

            // Verificar límite de envíos por IP - MEJORADO
            if (!$this->checkIPLimit($data['ip_address'])) {
                error_log("ContactForm WARNING - IP limit exceeded: " . $data['ip_address']);
                $this->sendError('Has excedido el límite de envíos diarios. Inténtalo mañana.', 429);
            }

            // NUEVO: Verificar email duplicado reciente
            if (!$this->checkEmailLimit($data['email'])) {
                error_log("ContactForm WARNING - Email duplicate: " . $data['email']);
                $this->sendError('Ya has enviado un mensaje recientemente. Espera antes de enviar otro.', 429);
            }

            // Insertar en la base de datos
            $contactId = $this->insertContact($data);

            if ($contactId > 0) {
                error_log("ContactForm SUCCESS - Contact inserted: ID {$contactId}");

                // Marcar request como procesado
                $this->markRequestProcessed();

                // Enviar emails
                $emailResults = $this->sendNotificationEmails($data, $contactId);

                // Respuesta exitosa
                $this->sendSuccess([
                    'message' => '¡Mensaje enviado exitosamente!',
                    'details' => 'Te contactaremos pronto para agendar tu consulta gratuita.',
                    'contact_id' => $contactId,
                    'email_sent' => $emailResults
                ]);
            } else {
                error_log("ContactForm ERROR - Insert failed");
                $this->sendError('Error al procesar tu mensaje. Inténtalo más tarde.', 500);
            }

        } catch (Exception $e) {
            error_log("ContactForm CRITICAL - Exception: " . $e->getMessage());
            $this->sendError('Error interno del servidor', 500);
        }
    }

    // NUEVO: Verificar requests duplicados
    private function isDuplicateRequest() {
        $cacheFile = sys_get_temp_dir() . '/contact_processed_' . md5($this->getClientIP() . date('Y-m-d-H-i'));
        return file_exists($cacheFile);
    }

    // NUEVO: Marcar request como procesado
    private function markRequestProcessed() {
        $cacheFile = sys_get_temp_dir() . '/contact_processed_' . md5($this->getClientIP() . date('Y-m-d-H-i'));
        file_put_contents($cacheFile, $this->requestId);
    }

    // Obtener datos del formulario - CONSERVADOR
    private function getFormData() {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);

        // Si no es JSON, intentar $_POST
        if (json_last_error() !== JSON_ERROR_NONE) {
            $data = $_POST;
        }

        return [
            'nombre' => $this->sanitizeInput($data['name'] ?? ''),
            'email' => $this->sanitizeInput($data['email'] ?? ''),
            'telefono' => $this->sanitizeInput($data['phone'] ?? ''),
            'empresa' => $this->sanitizeInput($data['company'] ?? ''),
            'tipo_cliente' => $this->sanitizeInput($data['audience'] ?? ''),
            'servicio_interes' => $this->sanitizeInput($data['service'] ?? ''),
            'mensaje' => $this->sanitizeInput($data['message'] ?? ''),
            'ip_address' => $this->getClientIP(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ];
    }

    // Limpiar datos - IGUAL AL ORIGINAL
    private function sanitizeInput($input) {
        return trim(htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8'));
    }

    // Obtener IP real - IGUAL AL ORIGINAL
    private function getClientIP() {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];

        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = trim(explode(',', $_SERVER[$key])[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }

    // Validar datos - IGUAL AL ORIGINAL
    private function validateData($data) {
        $errors = [];

        // Validar nombre
        if (empty($data['nombre'])) {
            $errors[] = 'El nombre es obligatorio';
        } elseif (strlen($data['nombre']) < 2) {
            $errors[] = 'El nombre debe tener al menos 2 caracteres';
        } elseif (strlen($data['nombre']) > 100) {
            $errors[] = 'El nombre no puede exceder 100 caracteres';
        }

        // Validar email
        if (empty($data['email'])) {
            $errors[] = 'El email es obligatorio';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'El formato del email no es válido';
        } elseif (strlen($data['email']) > 150) {
            $errors[] = 'El email no puede exceder 150 caracteres';
        }

        // Validar teléfono (opcional)
        if (!empty($data['telefono'])) {
            $telefonoLimpio = preg_replace('/[^\d\+]/', '', $data['telefono']);
            if (strlen($telefonoLimpio) < 7 || strlen($telefonoLimpio) > 20) {
                $errors[] = 'El teléfono debe tener entre 7 y 20 dígitos';
            }
        }

        // Validar tipo de cliente
        $tiposValidos = ['empresa', 'institucion', 'investigador', 'profesional'];
        if (empty($data['tipo_cliente'])) {
            $errors[] = 'Debes seleccionar el tipo de cliente';
        } elseif (!in_array($data['tipo_cliente'], $tiposValidos)) {
            $errors[] = 'Tipo de cliente no válido';
        }

        // Validar mensaje
        if (empty($data['mensaje'])) {
            $errors[] = 'El mensaje es obligatorio';
        } elseif (strlen($data['mensaje']) < 10) {
            $errors[] = 'El mensaje debe tener al menos 10 caracteres';
        } elseif (strlen($data['mensaje']) > 5000) {
            $errors[] = 'El mensaje no puede exceder 5000 caracteres';
        }

        // Validar empresa (opcional)
        if (!empty($data['empresa']) && strlen($data['empresa']) > 200) {
            $errors[] = 'El nombre de la empresa no puede exceder 200 caracteres';
        }

        // Detectar spam básico
        if ($this->isSpam($data)) {
            $errors[] = 'El mensaje parece ser spam. Por favor, revisa el contenido.';
        }

        return [
            'valid' => empty($errors),
            'message' => empty($errors) ? 'Datos válidos' : implode(', ', $errors)
        ];
    }

    // Detectar spam - IGUAL AL ORIGINAL
    private function isSpam($data) {
        $spamPatterns = [
            '/\b(viagra|cialis|casino|poker|lottery|winner|congratulations)\b/i',
            '/\b(urgent|claim|prize|million|inheritance)\b/i',
            '/http[s]?:\/\/[^\s]{20,}/i',
            '/(.)\1{10,}/',
        ];

        $fullText = $data['nombre'] . ' ' . $data['email'] . ' ' . $data['mensaje'];

        foreach ($spamPatterns as $pattern) {
            if (preg_match($pattern, $fullText)) {
                return true;
            }
        }

        return false;
    }

    // Verificar límite de IP - IGUAL AL ORIGINAL
    private function checkIPLimit($ip) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) as count
                FROM contactos
                WHERE ip_address = ? AND DATE(fecha_creacion) = CURDATE()
            ");
            $stmt->execute([$ip]);
            $result = $stmt->fetch();

            $maxIntentos = intval($this->config['max_intentos_dia'] ?? 10);
            return $result['count'] < $maxIntentos;

        } catch (PDOException $e) {
            error_log("ContactForm ERROR - IP limit check: " . $e->getMessage());
            return true;
        }
    }

    // NUEVO: Verificar límite de email duplicado
    private function checkEmailLimit($email) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) as count
                FROM contactos
                WHERE email = ? AND fecha_creacion > DATE_SUB(NOW(), INTERVAL 1 HOUR)
            ");
            $stmt->execute([$email]);
            $result = $stmt->fetch();

            return $result['count'] == 0;

        } catch (PDOException $e) {
            error_log("ContactForm ERROR - Email limit check: " . $e->getMessage());
            return true;
        }
    }

    // Insertar contacto - IGUAL AL ORIGINAL
    private function insertContact($data) {
        try {
            $stmt = $this->pdo->prepare("CALL InsertarContacto(?, ?, ?, ?, ?, ?, ?, ?, ?, @contacto_id, @resultado)");

            $stmt->execute([
                $data['nombre'],
                $data['email'],
                $data['telefono'],
                $data['empresa'],
                $data['tipo_cliente'],
                $data['servicio_interes'],
                $data['mensaje'],
                $data['ip_address'],
                $data['user_agent']
            ]);

            // Obtener resultados del procedimiento
            $result = $this->pdo->query("SELECT @contacto_id as contacto_id, @resultado as resultado")->fetch();

            if (strpos($result['resultado'], 'SUCCESS') === 0) {
                return intval($result['contacto_id']);
            } else {
                error_log("ContactForm ERROR - Procedure: " . $result['resultado']);
                return 0;
            }

        } catch (PDOException $e) {
            error_log("ContactForm ERROR - Insert: " . $e->getMessage());
            return 0;
        }
    }

    // Enviar emails - IGUAL AL ORIGINAL
    private function sendNotificationEmails($data, $contactId) {
        $results = [
            'admin_email' => false,
            'user_email' => false
        ];

        try {
            // Email de notificación al administrador
            $results['admin_email'] = $this->sendAdminNotification($data, $contactId);
            error_log("ContactForm: Admin email " . ($results['admin_email'] ? 'sent' : 'failed'));

            // Auto-respuesta al cliente
            if (intval($this->config['auto_respuesta'] ?? 1) === 1) {
                $results['user_email'] = $this->sendAutoResponse($data);
                error_log("ContactForm: User email " . ($results['user_email'] ? 'sent' : 'failed'));
            }

        } catch (Exception $e) {
            error_log("ContactForm ERROR - Email: " . $e->getMessage());
        }

        return $results;
    }

    // Email administrador - IGUAL AL ORIGINAL
    private function sendAdminNotification($data, $contactId) {
        $to = $this->config['email_notificacion'] ?? 'contacto@robertoacunacaicedo.com';
        $subject = "📧 Nuevo contacto desde el sitio web - #" . $contactId;

        $telefonoDisplay = !empty($data['telefono']) ? $data['telefono'] : 'No proporcionado';

        $htmlMessage = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Nuevo Contacto - Roberto Acuña Caicedo</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4A90E2, #FF6B35); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { background: #f9f9f9; padding: 30px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4A90E2; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .info-box h3 { color: #4A90E2; margin-top: 0; margin-bottom: 15px; }
        .info-box p { margin: 8px 0; }
        .message-box { background: #fff5f5; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #FF6B35; }
        .message-box h3 { color: #FF6B35; margin-top: 0; margin-bottom: 15px; }
        .buttons { text-align: center; margin: 30px 0; }
        .button { background: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px; }
        .button-phone { background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px; }
        .footer { text-align: center; padding: 20px; background: #f8fafc; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
        .urgent { background: #fee2e2; color: #dc2626; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; font-weight: bold; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>📧 Nuevo Contacto</h1>
            <p>Sitio Web Roberto Acuña Caicedo</p>
        </div>

        <div class='content'>
            <div class='urgent'>
                ⚡ CONTACTO #{$contactId} - REQUIERE ATENCIÓN
            </div>

            <div class='info-box'>
                <h3>👤 Información del Contacto</h3>
                <p><strong>ID:</strong> #{$contactId}</p>
                <p><strong>Nombre:</strong> {$data['nombre']}</p>
                <p><strong>Email:</strong> <a href='mailto:{$data['email']}' style='color: #4A90E2;'>{$data['email']}</a></p>
                <p><strong>Teléfono:</strong> " . ($telefonoDisplay !== 'No proporcionado' ? "<a href='tel:{$data['telefono']}' style='color: #16a34a;'>{$telefonoDisplay}</a>" : $telefonoDisplay) . "</p>
                <p><strong>Empresa:</strong> " . ($data['empresa'] ?: 'No especificada') . "</p>
                <p><strong>Tipo de Cliente:</strong> " . ucfirst($data['tipo_cliente']) . "</p>
                <p><strong>Servicio de Interés:</strong> " . ($data['servicio_interes'] ? ucfirst($data['servicio_interes']) : 'No especificado') . "</p>
            </div>

            <div class='message-box'>
                <h3>💬 Mensaje del Cliente</h3>
                <p style='white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border: 1px solid #fee2e2;'>{$data['mensaje']}</p>
            </div>

            <div class='buttons'>
                <a href='mailto:{$data['email']}?subject=Re: Tu consulta sobre IA - Roberto Acuña Caicedo&body=Hola {$data['nombre']},%0D%0A%0D%0AGracias por contactarme...' class='button'>
                    📧 Responder por Email
                </a>" .
                (!empty($data['telefono']) ? "
                <a href='tel:{$data['telefono']}' class='button-phone'>
                    📱 Llamar Ahora
                </a>" : "") . "
            </div>
        </div>

        <div class='footer'>
            <p>Este email fue generado automáticamente desde el formulario de contacto</p>
            <p><strong>robertoacunacaicedo.com</strong> | " . date('Y-m-d H:i:s') . "</p>
        </div>
    </div>
</body>
</html>";

        $headers = [
            'From: Sitio Web Roberto Acuña <noreply@robertoacunacaicedo.com>',
            'Reply-To: ' . $data['email'],
            'Content-Type: text/html; charset=UTF-8',
            'X-Mailer: PHP/' . phpversion(),
            'X-Priority: 1',
            'Importance: High'
        ];

        return mail($to, $subject, $htmlMessage, implode("\r\n", $headers));
    }

    // Auto-respuesta - IGUAL AL ORIGINAL
    private function sendAutoResponse($data) {
        $to = $data['email'];
        $subject = "✅ Confirmación de contacto - Roberto Acuña Caicedo";

        $mensajeConfig = $this->config['mensaje_auto_respuesta'] ??
                        'Gracias por contactarme. He recibido tu mensaje y me pondré en contacto contigo pronto.';

        $htmlMessage = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Confirmación de Contacto - Roberto Acuña Caicedo</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4A90E2, #FF6B35); color: white; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .welcome-box { background: white; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center; }
        .welcome-box h2 { color: #4A90E2; margin-bottom: 15px; }
        .footer { text-align: center; padding: 25px; background: #f8fafc; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Dr. Roberto Acuña Caicedo</h1>
            <p>Asesor en Inteligencia Artificial</p>
        </div>
        <div class='content'>
            <div class='welcome-box'>
                <h2>¡Gracias por contactarme!</h2>
                <p>Hola <strong>{$data['nombre']}</strong>,</p>
                <p>{$mensajeConfig}</p>
            </div>
        </div>
        <div class='footer'>
            <p>Dr. Roberto Acuña Caicedo | contacto@robertoacunacaicedo.com</p>
        </div>
    </div>
</body>
</html>";

        $headers = [
            'From: Roberto Acuña Caicedo <contacto@robertoacunacaicedo.com>',
            'Content-Type: text/html; charset=UTF-8'
        ];

        return mail($to, $subject, $htmlMessage, implode("\r\n", $headers));
    }

    // Respuestas - IGUAL AL ORIGINAL
    private function sendError($message, $httpCode = 400) {
        http_response_code($httpCode);
        echo json_encode([
            'success' => false,
            'message' => $message,
            'timestamp' => date('c'),
            'request_id' => $this->requestId
        ]);
        exit();
    }

    private function sendSuccess($data) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('c'),
            'request_id' => $this->requestId
        ]);
        exit();
    }
}

// =====================================================================
// EJECUTAR EL PROCESADOR
// =====================================================================

try {
    $processor = new ContactFormProcessor();
    $processor->processForm();
} catch (Exception $e) {
    error_log("ContactForm FATAL: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'timestamp' => date('c')
    ]);
}
?>