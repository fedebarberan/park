// js/accesorios-form.js
$(document).ready(function() {
    $('#accesorios-submit-btn').on('click', function(e) {
        if (!$('#nombre').val() || !$('#correo').val()) {
            e.preventDefault();
            alert('Nombre y correo son obligatorios');
        }
    });
});