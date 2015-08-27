$(function () {
    var user = {},
        flg = {};
    init();
    $('#login').click(function () {
        initub();
        $('#logmsk').fadeIn();
        ub(0)
    });
    $("#email").keyup(function () {
        var len = $('#email').val().length;
        if (len > 13 || len == 0) {
            $('#email').css('background', 'rgb(237, 69, 69)');
            blsp();
           
            flg.email = 1
        } else {
            $('#email').css('background', 'rgb(255, 255, 255)');
            flg.email = 0;
            tcheck()
        }
    });
    $("#password").keyup(function () {
        var len = $('#password').val().length;
        if (len > 10 || len == 0) {
            $('#password').css('background', 'rgb(237, 69, 69)');
                        $('#password').css('color', 'black');

            blsp();
           
            flg.password = 1
        } else {
            $('#password').css('background', 'rgb(255, 255, 255)');
            flg.password = 0;
            tcheck()
        }
    });

    function tcheck() {
        if (flg.email == 0 && flg.password == 0) {
            $('#signupb').css('opacity', '1').css('cursor', 'pointer')
        } else {
            blsp()
        }
    }

    function init() {
        flg.logt = 0
    }


});