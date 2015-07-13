$(document).ready(function() {
    var max_fields = 5; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap"); //Fields wrapper
    var add_button = $(".add_field_button"); //Add button ID
    var x = 0; //initlal text box count
    $(add_button).click(function(e) { //on add input button click
        e.preventDefault();
        if (x == 0) {
            $(wrapper).append('<button type="submit" class="btn btn-danger boxForAds" id="updateBox" onClick="javascript:updateAds()">Update the code</button>');
        }
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div class="boxForAds"><input type="text" class="form-control" placeholder="Sub ID" name="mytext[]"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
        }
    });
    $(wrapper).on("click", ".remove_field", function(e) { //user click on remove text
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
        if (x == 0) {
            $('#updateBox').remove();
        }
    })
    var max_fieldsBanners = 5; //maximum input boxes allowed
    var wrapperBanners = $(".input_fields_wrap_banners"); //Fields wrapper
    var add_buttonBanners = $(".add_field_button_banners"); //Add button ID
    var y = 0; //initlal text box count
    $(add_buttonBanners).click(function(e) { //on add input button click
        e.preventDefault();
        if (y == 0) {
            $(wrapperBanners).append('<button type="submit" class="btn btn-danger boxForBanners" id="updateBoxBanners" onClick="javascript:updateBanners()">Update the code</button>');
        }
        if (y < max_fieldsBanners) { //max input box allowed
            y++; //text box increment
            $(wrapperBanners).append('<div class="boxForBanners"><input type="text" class="form-control" placeholder="Sub ID" name="mytext[]"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
        }
    });
    $(wrapperBanners).on("click", ".remove_field", function(e) { //user click on remove text
        e.preventDefault();
        $(this).parent('div').remove();
        y--;
        if (y == 0) {
            $('#updateBoxBanners').remove();
        }
    })
});

function updateBanners() {
    alert("update html code");
   // $('.boxForBanners').remove();

}

function updateAds() {
    alert("update html code");
 //   $('.boxForAds').remove();

}