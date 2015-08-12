$(document).ready(function() {
    $('.datepicker').datepicker({
      format: 'yyyy-mm-dd'
    })
    $('#uploadBanners').click(function() {});

    // Removes the selections in the geo tracking part etc.
    $('#specificCountriesButton').click(function() {
        $('#countries').prop('disabled', false);
    });
    $('#allCountriesButton').click(function() {
        $('#countries').prop('disabled', true);
        $('#countries').val("");
    });

    $('#CostPerSale').click(function() {
        if ($('input[id="CostPerSale"]:checked').length > 0) {
            $('#monthlyRecurringPayment').prop('disabled', false);
        } else {
            $('#monthlyRecurringPayment').prop('disabled', true);
            $('#monthlyRecurringPayment').prop('checked', false);
        }
    });
    
    document.querySelector('#file').addEventListener('change', handleFileSelect, false);
    selDiv = document.querySelector("#selectedFiles");
    function handleFileSelect(e) {
    
      if(!e.target.files) return;
      
      selDiv.innerHTML = "";
      var files = e.target.files;
      for(var i=0; i<files.length; i++) {
        var f = files[i];
        
        selDiv.innerHTML += f.name + "<br/>";

      }
    
  }

});
