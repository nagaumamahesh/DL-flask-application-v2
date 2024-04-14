$(document).ready(function () {
  // Init
  $('.image-section').hide();
  $('.loader').hide();
  $('#result').hide();

  // Upload Preview
  function readURL(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
              $('#imagePreview').hide();
              $('#imagePreview').fadeIn(650);
          }
          reader.readAsDataURL(input.files[0]);
      }
  }
  $("#imageUpload").change(function () {
      $('.image-section').show();
      $('#btn-predict').show();
      $('#result').text('');
      $('#result').hide();
      readURL(this);
  });

  // Predict
  $('#btn-predict').click(function () {
      var form_data = new FormData($('#upload-file')[0]);

      // Show loading animation
      $(this).hide();
      $('.loader').show();

      // Make prediction by calling api /predict
    //   $.ajax({
    //       type: 'POST',
    //       url: '/predict',
    //       data: form_data,
    //       contentType: false,
    //       cache: false,
    //       processData: false,
    //       async: true,
    //       success: function (data) {
    //           // Get and display the result
    //           $('.loader').hide();
    //           $('#result').fadeIn(600);
    //           $('#result').text(' Result:  ' + data);
    //           console.log('Success!');
    //       },
    //   });

    $.ajax({
        type: 'POST',
        url: '/predict',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        async: true,
        success: function (data, textStatus, xhr) {
            // Get and display the result
            $('.loader').hide();
            $('#result').fadeIn(600);
            var predictionResult = xhr.getResponseHeader('X-Prediction-Result');

            $('#result').text(' Result: ' + predictionResult);
            // console.log(data)
            
            var blob = new Blob([data], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'report.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            renderPredictedClass(predictionResult); // Call function to render predicted class section
            console.log('Wonderful');
        },
    });

    
  });

});