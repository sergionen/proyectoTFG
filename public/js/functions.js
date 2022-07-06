
$(document).ready(function () {
    $(function () {
        $('a').each(function () {
            if ($(this).prop('href') == window.location.href) {
                $(this).addClass('active');
                $(this).parents('li').addClass('active');
            }
        });
    });

    //Modal for delete account
    $('#DeleteAccountModal').on('shown.bs.modal', function () {
        $('#acceptModalBtn').trigger('focus');
    });

    $('.loading').hide();
    $('#uploadBtn').on('click', function() {
        console.log('Pressed button');
        $('.loading').show(400);
        $('#uploadBtn').addClass('disabled');
    });

    $(function () {
        console.log("var: " + $('[data-toggle="popover"]').data("content"));
        $('[data-toggle="popover"]').popover({
            html: true,
            content: $('[data-toggle="popover"]').data("content"),
            placement: 'bottom'
        });
    });

});

