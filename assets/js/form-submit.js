$(document).ready(function () {
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        var form = $(this)[0];
        var $form = $(this);
        var submitBtn = $form.find('button[type="submit"]');
        var originalBtnHtml = submitBtn.html();

        // Show loader
        submitBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...').prop('disabled', true);

        var formData = new FormData(form);

        fetch($form.attr('action'), {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    Swal.fire({
                        text: response.message,
                        icon: 'success',
                        timer: 5000,
                        showConfirmButton: false,
                        toast: true,
                        position: "top-end",
                    });
                    form.reset();
                } else {
                    Swal.fire({
                        text: response.message,
                        icon: 'error',
                        timer: 5000,
                        showConfirmButton: false,
                        toast: true,
                        position: "top-end",
                    });
                }
            })
            .catch(() => {
                Swal.fire({
                    text: 'Something went wrong. Please try again later.',
                    icon: 'error',
                    timer: 5000,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
            })
            .finally(() => {
                submitBtn.html(originalBtnHtml).prop('disabled', false);
            });
    });
});