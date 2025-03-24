$(document).ready(function() {
    // Custom popup function
    function showPopup(message, isSuccess) {
const formattedMessage = message.replace(/\n/g, '<br>');
    const popup = $('<div class="tm-popup"></div>').html(formattedMessage) 
            .css({
                position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
                padding: '10px', background: isSuccess ? '#d4edda' : '#f8d7da',
                color: isSuccess ? '#155724' : '#721c24', borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)', zIndex: 1000, maxWidth: '100%'
            });
        $('body').append(popup);
        setTimeout(() => popup.fadeOut(500, () => popup.remove()), 3000);
    }

    // Lock/unlock form
    function lockForm(lock) {
        $('#contact-form input, #contact-form textarea, #contact-form button')
            .prop('disabled', lock);
    }

    // Clear placeholder on focus
    $('.form-control').on('focus', function() {
        if (this.placeholder.startsWith('Ingresa') || this.placeholder.startsWith('Escribe')) {
            this.placeholder = '';
        }
    }).on('blur', function() {
        if (!this.value) {
            switch(this.id) {
                case 'nombre': this.placeholder = 'Ingresa tu nombre'; break;
                case 'correo': this.placeholder = 'Ingresa tu correo electrónico'; break;
                case 'ciudad': this.placeholder = 'Ingresa tu ciudad'; break;
                case 'provincia': this.placeholder = 'Ingresa tu provincia'; break;
                case 'telefono': this.placeholder = 'Ingresa tu teléfono'; break;
                case 'mensaje': this.placeholder = 'Escribe tu mensaje (máximo 200 caracteres)'; break;
            }
        }
    });

    // Form submission
    $('#contact-form').on('submit', function(e) {
        e.preventDefault(); // Always prevent default to handle manually
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
        if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            $('#correo').addClass('error');
            errorMessage += 'Correo electrónico es requerido y debe ser válido.\n\n';
            isValid = false;
        }

        const ciudad = $('#ciudad').val().trim();
        if (!ciudad) {
            $('#ciudad').addClass('error');
            errorMessage += 'Ciudad es requerida.\n\n';
            isValid = false;
        }

        const provincia = $('#provincia').val().trim();
        if (!provincia) {
            $('#provincia').addClass('error');
            errorMessage += 'Provincia es requerida.\n\n';
            isValid = false;
        }

        const telefono = $('#telefono').val().trim();
        if (!telefono || !/^\d+$/.test(telefono)) {
            $('#telefono').addClass('error');
            errorMessage += 'Teléfono es requerido y solo debe contener números.\n\n';
            isValid = false;
        }

        const mensaje = $('#mensaje').val().trim();
        if (!mensaje) {
            $('#mensaje').addClass('error');
            errorMessage += 'Mensaje es requerido.\n\n';
            isValid = false;
        }

        if (!isValid) {
            showPopup(errorMessage, false);
            lockForm(true); // Lock form on error
            setTimeout(() => lockForm(false), 3000); // Unlock after 3s
            return;
        }

        // Lock form during submission
        lockForm(true);

        // Simulate AJAX submission (replace with actual backend call)
        $.ajax({
            url: $(this).attr('action'), // Use form's action (e.g., send-contact.php)
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                showPopup('Mensaje enviado con éxito', true);
                $('#contact-form')[0].reset(); // Reset form
                lockForm(true); // Keep locked after success
            },
            error: function() {
                showPopup('Error al enviar el mensaje. Intenta de nuevo.', false);
                lockForm(false); // Unlock on error
            }
        });
    });

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

    $('#ciudad, #provincia').on('input', function() {
        if (this.value.length > 70) this.value = this.value.slice(0, 70);
    });

    $('#mensaje').on('input', function() {
        if (this.value.length > 200) this.value = this.value.slice(0, 200);
    });
});