<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "info@parksoluciones.com"; // REPLACE WITH YOUR EMAIL
    $formType = isset($_POST['intencion']) ? 'Electric Cars' : 'Contact';

    $fields = [];
    foreach ($_POST as $key => $value) {
        if (is_array($value)) {
            $fields[$key] = htmlspecialchars(implode(', ', $value));
        } else {
            $fields[$key] = htmlspecialchars($value);
        }
    }

    // Validate required fields
    if (!isset($fields['nombre']) || empty($fields['nombre']) || 
        !isset($fields['correo']) || empty($fields['correo']) || 
        ($formType === 'Contact' && (!isset($fields['ciudad']) || empty($fields['ciudad']) || 
                                     !isset($fields['provincia']) || empty($fields['provincia']) || 
                                     !isset($fields['telefono']) || empty($fields['telefono']) || 
                                     !isset($fields['mensaje']) || empty($fields['mensaje'])))) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Todos los campos requeridos deben estar completos"]);
        exit;
    }

    $subject = "Nuevo mensaje desde Park Soluciones ($formType)";
    $body = "Formulario: $formType\n";
    foreach ($fields as $key => $value) {
        $body .= ucfirst($key) . ": $value\n";
    }

    $headers = "From: no-reply@parksoluciones.com\r\n";
    $headers .= "Reply-To: " . ($fields['correo'] ?? 'no-reply@parksoluciones.com') . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    error_log("Attempting to send email to $to from no-reply@parksoluciones.com");
    if (mail($to, $subject, $body, $headers)) {
        error_log("Email successfully sent to $to");
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Mensaje enviado con éxito"]);
    } else {
        $error = error_get_last();
        error_log("Failed to send email to $to: " . ($error['message'] ?? 'Unknown error'));
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error al enviar el mensaje"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
?>