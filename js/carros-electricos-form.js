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

    // Show/hide alquiler fields
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

    // Clear placeholder on focus
    $('.form-control').on('focus', function() {
        if (this.placeholder.startsWith('Ingresa') || this.placeholder.startsWith('Comentarios')) {
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

    // Form submission
    $('#electric-cars-form').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        let errorMessage = '';

        $('.form-control').removeClass('error');

//        const intencion = $('#intencion').val();
//        if (!intencion) {
//            $('#intencion').addClass('error');
//            errorMessage += 'Selecciona una intención.\n';
 //           isValid = false;
//        }

    // Skip duracion validation to make it optional even for Alquilar
//
//        if (intencion === 'Alquilar') {
//            const duracion = $('#duracion').val().trim();
//            if (!duracion || duracion > 999) {
//                $('#duracion').addClass('error');
//                errorMessage += 'Duración es requerida y debe ser menor a 99.\n';
//                isValid = false;
//            }
//        }

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
                    $('#electric-cars-form')[0].reset();
                    $('#alquilar-fields').hide();
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