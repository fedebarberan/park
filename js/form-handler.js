$(document).ready(function() {
    // Custom popup function
    function showPopup(message, isSuccess) {
        const formattedMessage = message.replace(/\n/g, '<br>');
        const popup = $('<div class="tm-popup"></div>').html(formattedMessage)
            .css({
                position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
                padding: '20px', background: isSuccess ? '#d4edda' : '#f8d7da',
                color: isSuccess ? '#155724' : '#721c24', borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)', zIndex: 1000, maxWidth: '80%'
            });
        $('body').append(popup);
        setTimeout(() => popup.fadeOut(500, () => popup.remove()), 3000);
    }

    // Lock/unlock form
    function lockForm(formId, lock) {
        $(`#${formId} input, #${formId} textarea, #${formId} select, #${formId} button`)
            .prop('disabled', lock);
    }

    // Clear placeholder on focus (inputs and textareas only)
    $('input, textarea').on('focus', function() {
        if (this.placeholder && (this.placeholder.startsWith('Ingresa') || this.placeholder.startsWith('Comentarios'))) {
            this.placeholder = '';
        }
    }).on('blur', function() {
        if (!this.value) {
            switch(this.id) {
                case 'nombre': this.placeholder = 'Nombre *'; break;
                case 'correo': this.placeholder = 'E-mail *'; break;
                case 'provincia': this.placeholder = 'Provincia'; break;
                case 'telefono': this.placeholder = 'Teléfono'; break;
                case 'comentarios': this.placeholder = 'Comentarios adicionales (máx. 200 caracteres)'; break;
                case 'mensaje': this.placeholder = 'Mensaje'; break;
            }
        }
    });

    // Generic form submission handler
    function setupForm(formId, submitBtnId) {
        $(`#${submitBtnId}`).on('click', function(e) {
            e.preventDefault();
            submitForm(formId);
        });

        $(`#${formId}`).on('submit', function(e) {
            e.preventDefault();
            submitForm(formId);
        });
    }

    function submitForm(formId) {
        let isValid = true;
        let errorMessage = '';
        $(`#${formId} .form-control`).removeClass('error');

        const nombre = $(`#${formId} #nombre`).val().trim();
        if (!nombre || !/^[a-zA-Z\s]+$/.test(nombre)) {
            $(`#${formId} #nombre`).addClass('error');
            errorMessage += 'Nombre es requerido y solo debe contener letras.\n\n';
            isValid = false;
        }

        const correo = $(`#${formId} #correo`).val().trim();
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!correo || !emailRegex.test(correo)) {
            $(`#${formId} #correo`).addClass('error');
            errorMessage += 'Correo electrónico es requerido y debe ser válido.\n\n';
            isValid = false;
        }

        if (!isValid) {
            showPopup(errorMessage, false);
            lockForm(formId, true);
            setTimeout(() => lockForm(formId, false), 3000);
            return;
        }

        // Add hidden input for form source
        if ($(`#${formId} input[name="form_source"]`).length === 0) {
            $(`#${formId}`).append(`<input type="hidden" name="form_source" value="${formId}">`);
        }

        const formData = $(`#${formId}`).serialize();
        console.log(`Sending (${formId}):`, formData);
        lockForm(formId, true);
        $.ajax({
            url: 'send-contact.php',
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                console.log(`Response (${formId}):`, response);
                if (response.status === 'success') {
                    showPopup(response.message, true);
                    $(`#${formId}`)[0].reset();
                    setTimeout(() => lockForm(formId, false), 3000);
                } else {
                    showPopup(response.message, false);
                    lockForm(formId, false);
                }
            },
            error: function(xhr) {
                console.log(`AJAX Error (${formId}):`, xhr.status, xhr.responseText);
                showPopup('Error en el servidor: ' + xhr.responseJSON.message, false);
                lockForm(formId, false);
            }
        });
    }

    // Initialize forms
    setupForm('accesorios-form', 'accesorios-submit-btn');
    setupForm('baterias-form', 'baterias-submit-btn');
    setupForm('contacto-form', 'contacto-submit-btn');
    setupForm('mantenimiento-form', 'mantenimiento-submit-btn');
    setupForm('reciclado-form', 'reciclado-submit-btn');
    setupForm('repuestos-form', 'repuestos-submit-btn');

    // Input restrictions
    $('#nombre').on('input', function() {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        if (this.value.length > 70) this.value = this.value.slice(0, 70);
    });

    $('#correo').on('input', function() {
        if (this.value.length > 70) this.value = this.value.slice(0, 70);
    });

    $('#telefono').on('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length > 15) this.value = this.value.slice(0, 15);
    });

    $('#provincia').on('input', function() {
        if (this.value.length > 70) this.value = this.value.slice(0, 70);
    });

    $('#comentarios, #mensaje').on('input', function() {
        if (this.value.length > 200) this.value = this.value.slice(0, 200);
    });
});