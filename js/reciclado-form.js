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
        $('#reciclado-form input, #reciclado-form textarea, #reciclado-form select, #reciclado-form button')
            .prop('disabled', lock);
    }

    // Clear placeholder on focus
    $('.form-control').on('focus', function() {
        if (this.placeholder.startsWith('Nombre') || this.placeholder.startsWith('E-mail') || 
            this.placeholder.startsWith('Provincia') || this.placeholder.startsWith('Teléfono') || 
            this.placeholder.startsWith('Comentarios')) {
            this.placeholder = '';
        }
    }).on('blur', function() {
        if (!this.value) {
            switch(this.id) {
                case 'nombre': this.placeholder = 'Nombre *'; break;
                case 'correo': this.placeholder = 'E-mail *'; break;
				case 'direccion': this.placeholder = 'Dirección *'; break;
                case 'provincia': this.placeholder = 'Provincia *'; break;
                case 'telefono': this.placeholder = 'Teléfono'; break;
                case 'comentarios': this.placeholder = 'Comentarios adicionales (máx. 200 caracteres)'; break;
            }
        }
    });

    // Form submission
    $('#reciclado-form').on('submit', function(e) {
        e.preventDefault();
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
const direccion = $('#direccion').val().trim();
if (!direccion) {
    $('#direccion').addClass('error');
    errorMessage += 'Dirección es requerida.\n\n';
    isValid = false;
}
        if (!isValid) {
            showPopup(errorMessage, false);
            lockForm(true);
            setTimeout(() => lockForm(false), 3000);
            return;
        }

        lockForm(true);
        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    showPopup(response.message, true);
                    $('#reciclado-form')[0].reset();
                    lockForm(true);
                } else {
                    showPopup(response.message, false);
                    lockForm(false);
                }
            },
            error: function() {
                showPopup('Error de conexión con el servidor. Intenta de nuevo.', false);
                lockForm(false);
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

$('#direccion').on('input', function() {
    if (this.value.length > 70) this.value = this.value.slice(0, 70);
});

    $('#provincia').on('input', function() {
        if (this.value.length > 70) this.value = this.value.slice(0, 70);
    });

    $('#comentarios').on('input', function() {
        if (this.value.length > 200) this.value = this.value.slice(0, 200);
    });
});