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
    function lockForm(lock) {
        $('#electric-cars-form input, #electric-cars-form textarea, #electric-cars-form select, #electric-cars-form button')
            .prop('disabled', lock);
    }

    // Show/hide fields based on intention
    $('#intencion').on('change', function() {
        const intencion = $(this).val();
        $('#alquilar-fields').hide();
        $('#comprar-fields').hide();
        $('#vender-fields').hide();
        if (intencion === 'Alquilar') {
            $('#alquilar-fields').show();
        } else if (intencion === 'Comprar') {
            $('#comprar-fields').show();
        } else if (intencion === 'Vender') {
            $('#vender-fields').show();
        }
    });

    // UTM parameter handling
    const url_string = window.location.href;
    const url = new URL(url_string);
    const utm = url.searchParams.get('utm');
    if (typeof utm === 'string') {
        if (utm.startsWith('alquilar')) {
            $("#intencion").val("Alquilar").change();
        } else if (utm.startsWith('comprar')) {
            $("#intencion").val("Comprar").change();
        } else if (utm.startsWith('vender')) {
            $("#intencion").val("Vender").change();
        }
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
                case 'duracion': this.placeholder = 'Duración'; break;
            }
        }
    });

    // Form submission with validation (button click)
    $('#carros-submit-btn').on('click', function(e) {
        e.preventDefault();
        submitForm();
    });

    // Form submission with validation (Enter key or form submit)
    $('#electric-cars-form').on('submit', function(e) {
        e.preventDefault();
        submitForm();
    });

    // Centralized submission logic
    function submitForm() {
        let isValid = true;
        let errorMessage = '';
        $('.form-control').removeClass('error');

        const nombre = $('#nombre').val().trim();
        if (!nombre || !/^[a-zA-Z\s]+$/.test(nombre)) {
            $('#nombre').addClass('error');
            errorMessage += 'Nombre es requerido y solo debe contener letras.\n\n';
            isValid = false;
        }

        const correo = $('#correo').val().trim();
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!correo || !emailRegex.test(correo)) {
            $('#correo').addClass('error');
            errorMessage += 'Correo electrónico es requerido y debe ser válido.\n\n';
            isValid = false;
        }

        if (!isValid) {
            showPopup(errorMessage, false);
            lockForm(true);
            setTimeout(() => lockForm(false), 3000);
            return;
        }

        // Add hidden input for form source
        if ($('#electric-cars-form input[name="form_source"]').length === 0) {
            $('#electric-cars-form').append('<input type="hidden" name="form_source" value="electric-cars-form">');
        }

        const formData = $('#electric-cars-form').serialize();
        console.log('Sending:', formData);
        lockForm(true);
        $.ajax({
            url: 'send-contact.php',
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                console.log('Response:', response);
                if (response.status === 'success') {
                    showPopup(response.message, true);
                    $('#electric-cars-form')[0].reset();
                    $('#alquilar-fields').hide();
                    $('#comprar-fields').hide();
                    $('#vender-fields').hide();
                    setTimeout(() => lockForm(false), 3000);
                } else {
                    showPopup(response.message, false);
                    lockForm(false);
                }
            },
            error: function(xhr) {
                console.log('AJAX Error:', xhr.status, xhr.responseText);
                showPopup('Error en el servidor: ' + xhr.responseJSON.message, false);
                lockForm(false);
            }
        });
    }

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

    $('#duracion').on('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length > 3) this.value = this.value.slice(0, 3);
        if (this.value > 999) this.value = 999;
    });

    $('#comentarios').on('input', function() {
        if (this.value.length > 200) this.value = this.value.slice(0, 200);
    });
});