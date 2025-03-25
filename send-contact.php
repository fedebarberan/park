<?php
// Set content type for text response
header('Content-Type: text/plain; charset=UTF-8');

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // Method Not Allowed
    echo "Método no permitido.";
    exit;
}

// Sanitize and validate inputs
$nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_STRING) ?? '';
$correo = filter_input(INPUT_POST, 'correo', FILTER_SANITIZE_EMAIL) ?? '';
$provincia = filter_input(INPUT_POST, 'provincia', FILTER_SANITIZE_STRING) ?? '';
$telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_STRING) ?? '';
$comentarios = filter_input(INPUT_POST, 'comentarios', FILTER_SANITIZE_STRING) ?? filter_input(INPUT_POST, 'mensaje', FILTER_SANITIZE_STRING) ?? ''; // Handle both
$intencion = filter_input(INPUT_POST, 'intencion', FILTER_SANITIZE_STRING) ?? '';
$duracion = filter_input(INPUT_POST, 'duracion', FILTER_SANITIZE_NUMBER_INT) ?? '';
$unidad = filter_input(INPUT_POST, 'unidad', FILTER_SANITIZE_STRING) ?? '';
$marca = filter_input(INPUT_POST, 'marca', FILTER_SANITIZE_STRING) ?? '';
$pasajeros = filter_input(INPUT_POST, 'pasajeros', FILTER_SANITIZE_STRING) ?? '';
$bateria = filter_input(INPUT_POST, 'bateria', FILTER_SANITIZE_STRING) ?? '';
$color = filter_input(INPUT_POST, 'color', FILTER_SANITIZE_STRING) ?? '';
$accesorios = isset($_POST['accesorios']) && is_array($_POST['accesorios']) ? implode(', ', array_map('htmlspecialchars', $_POST['accesorios'])) : '';

// Validate required fields
if (empty($nombre) || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400); // Bad Request
    echo "Nombre y correo válidos son obligatorios.";
    exit;
}

// Build email body
$to = "info@parksoluciones.com.ar"; // Replace with your email
$subject = "Nuevo mensaje de formulario - Park Soluciones";
$body = "Nombre: $nombre\n" .
        "Correo: $correo\n" .
        "Provincia: $provincia\n" .
        "Teléfono: $telefono\n" .
        "Comentarios/Mensaje: $comentarios\n" .
        "Intención: $intencion\n" .
        "Duración: $duracion $unidad\n" .
        "Marca: $marca\n" .
        "Pasajeros: $pasajeros\n" .
        "Batería: $bateria\n" .
        "Color: $color\n" .
        "Accesorios: $accesorios";

// Prevent email header injection by using a fixed From address
$headers = "From: no-reply@parksoluciones.com.ar\r\n" .
           "Reply-To: $correo\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $subject, $body, $headers)) {
    http_response_code(200); // OK
    echo "Mensaje enviado con éxito.";
} else {
    http_response_code(500); // Internal Server Error
    echo "Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.";
}
?>