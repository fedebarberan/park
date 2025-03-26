<?php
// Set content type to JSON
header('Content-Type: application/json; charset=UTF-8');

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
    exit;
}

// Sanitize and validate inputs
$nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_STRING) ?? '';
$correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL) ?? '';
$provincia = filter_input(INPUT_POST, 'provincia', FILTER_SANITIZE_STRING) ?? '';
$telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_STRING) ?? '';
$comentarios = filter_input(INPUT_POST, 'comentarios', FILTER_SANITIZE_STRING) ?? filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_STRING) ?? '';
$intencion = filter_input(INPUT_POST, 'intencion', FILTER_SANITIZE_STRING) ?? '';
$duracion = filter_input(INPUT_POST, 'duracion', FILTER_SANITIZE_NUMBER_INT) ?? '';
$unidad = filter_input(INPUT_POST, 'unidad', FILTER_SANITIZE_STRING) ?? '';
$marca = filter_input(INPUT_POST, 'marca', FILTER_SANITIZE_STRING) ?? '';
$pasajeros = filter_input(INPUT_POST, 'pasajeros', FILTER_SANITIZE_STRING) ?? '';
$bateria = filter_input(INPUT_POST, 'bateria', FILTER_SANITIZE_STRING) ?? '';
$color = filter_input(INPUT_POST, 'color', FILTER_SANITIZE_STRING) ?? '';
$accesorios = isset($_POST['accesorios']) && is_array($_POST['accesorios']) ? implode(', ', array_map('htmlspecialchars', $_POST['accesorios'])) : '';
$form_source = filter_input(INPUT_POST, 'form_source', FILTER_SANITIZE_STRING) ?? 'Unknown';

// Validate required fields
if (empty($nombre) || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nombre y correo válidos son obligatorios.']);
    exit;
}

// Build email body
$to = "info@parksoluciones.com.ar"; // Replace with your email
$subject = "Nuevo mensaje del formulario web - Park Soluciones";
$body = "Formulario enviado desde: $form_source\n";
if (!empty($correo)) $body .= "Correo: $correo\n";
if (!empty($telefono)) $body .= "Teléfono: $telefono\n";
if (!empty($nombre)) $body .= "Nombre: $nombre\n";
if (!empty($provincia)) $body .= "Provincia: $provincia\n";
if (!empty($intencion)) $body .= "Intención: $intencion\n";
if (!empty($duracion)) $body .= "Duración: $duracion $unidad\n";
if (!empty($marca)) $body .= "Marca: $marca\n";
if (!empty($pasajeros)) $body .= "Pasajeros: $pasajeros\n";
if (!empty($bateria)) $body .= "Batería: $bateria\n";
if (!empty($color)) $body .= "Color: $color\n";
if (!empty($accesorios)) $body .= "Accesorios: $accesorios\n";
if (!empty($comentarios)) $body .= "Comentarios/Mensaje: $comentarios\n";

$headers = "From: no-reply@parksoluciones.com.ar\r\n" .
           "Reply-To: $correo\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Mensaje enviado con éxito.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.']);
}
?>