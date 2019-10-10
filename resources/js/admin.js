/* globals L10N */
$(function() {
    $('.panel-heading').on('click', function() {
        const panel = $(this).parents('.panel');
        const others = $(this).parents('.accordion').find('.open').not(panel);

        others.removeClass('open init');

        panel.toggleClass('open');
        panel.find('.panel-body').slideToggle();

        others.find('.panel-body').slideUp('fast');
    });

    $('.reset-btn').on('click', function() {
        const msg = L10N.really_delete;
        const really = confirm(msg);
        const data = {'type': 'reset'};
        const elem = $(this);
        elem.addClass('saving');
        if (really) {
            $.ajax({
                'url': '../api/admin.php',
                'data': data,
                'dataType': 'json',
                'type': 'post',
                'success': function(resp) {
                    elem.removeClass('saving');
                    elem.addClass(resp);

                    setTimeout(function() {
                        elem.removeClass('error success');

                        window.location.reload();
                    }, 4000);
                }
            });
        }
    });

    $('.save-btn').on('click', function(e) {
        e.preventDefault();
        const elem = $(this);
        elem.addClass('saving');
        const data = 'type=config&' + $('form').serialize();
        $.ajax({
            'url': '../api/admin.php',
            'data': data,
            'dataType': 'json',
            'type': 'post',
            'success': function(resp) {
                elem.removeClass('saving');
                elem.addClass(resp);

                setTimeout(function() {
                    elem.removeClass('error success');

                    if (resp === 'success') {
                        window.location.reload();
                    }
                }, 4000);
            }
        });
    });

    $('#checkVersion a').on('click', function (ev) {
        ev.preventDefault();

        $(this).html('<i class="fa fa-circle-o-notch fa-spin fa-fw"></i>');

        $.ajax({
            url: '../api/checkVersion.php',
            method: 'GET',
            success: (data) => {
                let message = 'Error';
                $('#checkVersion').empty();
                console.log('data', data)
                if (!data.updateAvailable) {
                    message = L10N.using_latest_version;
                } else if ((/^\d+\.\d+\.\d+$/u).test(data.availableVersion)) {
                    message = L10N.update_available;
                } else {
                    message = L10N.test_update_available;
                }

                const textElement = $('<p>');
                textElement.text(message);
                textElement.append('<br />');
                textElement.append(L10N.current_version + ': ');
                textElement.append(data.currentVersion);
                textElement.append('<br />');
                textElement.append(L10N.available_version + ': ');
                textElement.append(data.availableVersion);
                textElement.appendTo('#checkVersion');
            }
        });
    });
});
