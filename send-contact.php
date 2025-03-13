<?php
// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Optionally configure SMTP for DreamHost (uncomment if mail() fails)
// ini_set('SMTP', 'smtp.dreamhost.com');
// ini_set('smtp_port', 587);
// ini_set('sendmail_from', 'no-reply@parksoluciones.com');

// Check if the request is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Set the recipient email (REPLACE WITH YOUR REAL EMAIL)
    $to = "fedebarberan@gmail.com"; // Replace with your actual email address

    // Collect and sanitize form data
    $nombre = isset($_POST['nombre']) ? htmlspecialchars($_POST['nombre']) : '';
    $correo = isset($_POST['correo']) ? htmlspecialchars($_POST['correo']) : '';
    $ciudad = isset($_POST['ciudad']) ? htmlspecialchars($_POST['ciudad']) : '';
    $provincia = isset($_POST['provincia']) ? htmlspecialchars($_POST['provincia']) : '';
    $telefono = isset($_POST['telefono']) ? htmlspecialchars($_POST['telefono']) : '';
    $mensaje = isset($_POST['mensaje']) ? htmlspecialchars($_POST['mensaje']) : '';

    // Validate that all fields are present (basic server-side check)
    if (empty($nombre) || empty($correo) || empty($ciudad) || empty($provincia) || empty($telefono) || empty($mensaje)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Todos los campos son requeridos"]);
        exit;
    }

    // Email details
    $subject = "Nuevo mensaje de contacto desde Park Soluciones";
    $body = "Nombre: $nombre\n";
    $body .= "Correo: $correo\n";
    $body .= "Ciudad: $ciudad\n";
    $body .= "Provincia: $provincia\n";
    $body .= "Teléfono: $telefono\n";
    $body .= "Mensaje: $mensaje\n";

    // Headers
    $headers = "From: no-reply@parksoluciones.com\r\n"; // Use an email from your domain
    $headers .= "Reply-To: $correo\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Log attempt for debugging
    error_log("Attempting to send email to $to from no-reply@parksoluciones.com");

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        // Log success
        error_log("Email successfully sent to $to");
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Mensaje enviado con éxito"]);
    } else {
        // Log failure
        $error = error_get_last();
        error_log("Failed to send email to $to: " . ($error['message'] ?? 'Unknown error'));
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error al enviar el mensaje"]);
    }
} else {
    // Invalid request method
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
?>