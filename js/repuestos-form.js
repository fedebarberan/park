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
        $('#repuestos-form input, #repuestos-form textarea, #repuestos-form button')
            .prop('disabled', lock);
    }

    // Clear placeholder on focus
    $('.form-control').on('focus', function() {
        if (this.placeholder.startsWith('Comentarios')) {
            this.placeholder = '';
        }
    }).on('blur', function() {
        if (!this.value) {
            if (this.id === 'comentarios') {
                this.placeholder = 'Comentarios adicionales (máx. 200 caracteres)';
            }
        }
    });

    // Form submission
    $('#repuestos-form').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        let errorMessage = '';

        $('.form-control').removeClass('error');

        // No validation for checkboxes (optional)
        // Only validate if at least one is checked if you want that later

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
                    $('#repuestos-form')[0].reset();
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
    $('#comentarios').on('input', function() {
        if (this.value.length > 200) this.value = this.value.slice(0, 200);
    });
});