$(document).ready(function () {
  // Init
  $('.image-section').hide();
  $('.loader').hide();
  $('#result').hide();
  $('#predicted-class').hide();

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

  function renderPredictedClass(classLabel) {
    var predictedData;
    switch (classLabel) {
        case 'Glioma Tumor Detected':
            predictedData = "<strong>Glioma Tumor Detected:</strong> Glioma is a common type of brain tumor originating from glial cells in the brain or spine. It can manifest with various symptoms including headaches, seizures, and cognitive impairments. Diagnostic tests such as <a href='https://www.mayoclinic.org/tests-procedures/mri/about/pac-20384768' target='_blank'>MRI</a> and <a href='https://www.mayoclinic.org/tests-procedures/ct-scan/about/pac-20393675' target='_blank'>CT scans</a> are crucial for accurate diagnosis. Treatment options depend on factors such as tumor grade and location, and may include <a href='https://www.cancer.org/cancer/brain-spinal-cord-tumors-children/treating/surgery.html' target='_blank'>surgery</a>, <a href='https://www.cancer.org/cancer/brain-spinal-cord-tumors-children/treating/radiation.html' target='_blank'>radiation therapy</a>, and <a href='https://www.cancer.org/cancer/brain-spinal-cord-tumors-children/treating/chemotherapy.html' target='_blank'>chemotherapy</a>.";
            break;
        case 'Pituitary Tumor Detected':
            predictedData = "<strong>Pituitary Tumor Detected:</strong> Pituitary tumors develop in the pituitary gland, affecting hormone production and leading to symptoms like vision changes, headaches, and hormonal imbalances. Diagnosis often involves hormonal tests, imaging studies, and sometimes a biopsy. Treatment varies based on tumor size, hormone levels, and symptoms, and may include <a href='https://www.mayoclinic.org/diseases-conditions/pituitary-tumors/diagnosis-treatment/drc-20353179' target='_blank'>medication</a>, <a href='https://www.mayoclinic.org/diseases-conditions/pituitary-tumors/diagnosis-treatment/drc-20353179' target='_blank'>surgery</a>, or <a href='https://www.mayoclinic.org/diseases-conditions/pituitary-tumors/diagnosis-treatment/drc-20353179' target='_blank'>radiation therapy</a>.";
            break;
        case 'No Tumor Detected':
            predictedData = "<strong>No Tumor Detected:</strong> The absence of a brain tumor suggests that symptoms may be attributed to other causes such as migraines, infections, or vascular issues. Comprehensive diagnostic evaluation, including neurological exams and imaging studies, is essential to identify the underlying condition accurately. Treatment depends on the diagnosis and may involve <a href='https://www.mayoclinic.org/diseases-conditions/migraine-headache/diagnosis-treatment/drc-20360207' target='_blank'>medications</a>, lifestyle changes, or other interventions.";
            break;
        case 'Meningioma Tumor Detected':
            predictedData = "<strong>Meningioma Tumor Detected:</strong> Meningiomas are usually slow-growing tumors arising from the meninges, the protective layers surrounding the brain and spinal cord. Symptoms may include headaches, seizures, or focal neurological deficits. Diagnosis typically involves imaging studies such as <a href='https://www.mayoclinic.org/tests-procedures/mri/about/pac-20384768' target='_blank'>MRI</a> or <a href='https://www.mayoclinic.org/tests-procedures/ct-scan/about/pac-20393675' target='_blank'>CT scans</a>. Treatment options vary based on tumor size, location, and symptoms, and may include <a href='https://www.mayoclinic.org/diseases-conditions/meningioma/diagnosis-treatment/drc-20355600' target='_blank'>observation</a>, <a href='https://www.mayoclinic.org/diseases-conditions/meningioma/diagnosis-treatment/drc-20355600' target='_blank'>surgery</a>, or <a href='https://www.mayoclinic.org/diseases-conditions/meningioma/diagnosis-treatment/drc-20355600' target='_blank'>radiation therapy</a>.";
            break;
        default:
            predictedData = "<strong>Unknown Class Detected:</strong> The predicted class label does not match any known categories. Further evaluation, including consultation with a medical professional and additional diagnostic tests, may be necessary to determine the nature of the detected anomaly.";
    }
    $('#predicted-info').html(predictedData); // Update predicted class information
    $('#predicted-class').show(); // Show predicted class section
}



  // Predict
  $('#btn-predict').click(function () {
      var form_data = new FormData($('#upload-file')[0]);

      // Show loading animation
      $(this).hide();
      //display none
      $('.loader').show();

      // Make prediction by calling api /predict
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