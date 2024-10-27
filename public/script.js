
// const apiUrl = "http://10.2.3.55:7039";
// const apiUrl_Admin = "http://10.2.3.55:6049";
const apiUrl = "https://userdevapi.certs365.io";
const apiUrl_Admin = "https://adminapidev.certs365.io";


var canvas;
let textObjects = [];
let shapeObjects = [];
let activeTextIndex = -1;
let activerShapeIndex = -1;
let undoStack = [];
let redoStack = [];
var selectedShape = null;



$(document).ready(function () {
  var isDataUnsaved = true;
  // fetchFonts();
  var canvasHeight = window.innerHeight * 0.8;
  var canvasWidth = window.innerWidth * 0.6;
  canvas = new fabric.Canvas("canvas");
  setCanvasSize(canvasWidth, canvasHeight);

// Listen for shape selection
canvas.on('mouse:down', function (event) {
  if (event.target) {
    selectedShape = event.target;
    showEditOptions(selectedShape,canvas); // Show edit button when shape is selected
  } else {
    hideEditOptions(); // Hide the button when no shape is selected
  }
});



// Function to show edit options
function showEditOptions(shape,canvas) {
  var editOptions = document.getElementById('colorPickers');
  editOptions.style.display = 'block';

  // // Position the color picker div relative to the shape
  // var shapeCoords = shape.getBoundingRect();
  // editOptions.style.top = (shapeCoords.top + 50) + 'px'; // Adjust top to be above the shape
  // editOptions.style.left = (shapeCoords.left + shapeCoords.width + 90) + 'px'; // To the right

  // Set the current colors and styles in the inputs
  document.getElementById('borderColor').value = shape.stroke;
  document.getElementById('bgColor').value = shape.fill;
  document.getElementById('borderWidth').value = shape.strokeWidth || 1; // Default width if not set
  document.getElementById('borderRadius').value = shape.rx || 0; // Default radius if not set
  document.getElementById('borderStyle').value = shape.strokeDashArray ? 'dashed' : 'solid'; // Example logic for style

  // Handle color change events
  document.getElementById('borderColor').oninput = function () {
    shape.set('stroke', this.value);
    canvas.setActiveObject(shape)
    canvas.renderAll();
    
  };

  document.getElementById('bgColor').oninput = function () {
    shape.set('fill', this.value);
    canvas.setActiveObject(shape)
    canvas.renderAll();
  };

  document.getElementById('borderWidth').oninput = function () {
    const widthInPixels = parseInt(this.value); // Convert the input value to an integer
    if (!isNaN(widthInPixels) && widthInPixels >= 0) { // Check if it's a valid number and non-negative
        shape.set('strokeWidth', widthInPixels); // Set the stroke width in pixels
        canvas.renderAll(); // Re-render the canvas to apply changes
    }
};


  document.getElementById('borderRadius').oninput = function () {
    shape.set('rx', this.value); // For rounded corners (use 'ry' for y-axis radius if needed)
    shape.set('ry', this.value); // Use this for full rounded corners
    canvas.renderAll();
  };

  document.getElementById('borderStyle').onchange = function () {
    if (this.value === 'dashed') {
      shape.set('strokeDashArray', [5, 5]); // Example for dashed style
    } else if (this.value === 'dotted') {
      shape.set('strokeDashArray', [1, 2]); // Example for dotted style
    } else {
      shape.set('strokeDashArray', null); // Solid style
    }
    canvas.renderAll();
  };
  saveState()
}

document.getElementById('bringToFront').onclick = function () {
  if (selectedShape) {
    canvas.bringToFront(selectedShape);  // Bring the selected shape to the front
    canvas.discardActiveObject();
  // Ensure the shape remains selected
    canvas.requestRenderAll();  // Request immediate re-rendering of the canvas
  }
};

document.getElementById('sendToBack').onclick = function () {
  if (selectedShape) {
    console.log(canvas.sendToBack(selectedShape))
    canvas.sendToBack(selectedShape);  // Send the selected shape to the back
    canvas.discardActiveObject();

    canvas.requestRenderAll();  // Request immediate re-rendering of the canvas
  }
};

document.getElementById('deleteObject').onclick = function () {
  if (selectedShape) {
    canvas.remove(selectedShape); // Remove the selected shape from the canvas
    selectedShape = null; // Clear the selection
    hideEditOptions(); // Hide the edit options as there's no object selected
    canvas.renderAll(); // Refresh the canvas
    saveState(); // Save the state for undo functionality
  }
};



// Function to hide edit options
function hideEditOptions() {
  var editOptions = document.getElementById('colorPickers');
  editOptions.style.display = 'none';
}

  // Add a rectangle
  $("#addSquare").click(function () {
    var rect = new fabric.Rect({
      left: 300,
      top: 100,
      fill: "transparent",  // Transparent fill
    stroke: "black", 
      width: 100,
      height: 100,
    });
    canvas.add(rect);
    canvas.renderAll();
  });

  // Add a circle
  $("#addCircle").click(function () {
    var circle = new fabric.Circle({
      left: 350,
      top: 150,
      fill: "transparent",  // Transparent fill
    stroke: "black", 
      radius: 50,
    });
    canvas.add(circle);
    canvas.renderAll();
  });

  $("#addFlower").click(function () {
    // Create the center of the flower
    var center = new fabric.Circle({
      left: 150,
      top: 150,
      fill: "yellow",      // Center color
      stroke: "black",
      strokeWidth: 2,
      radius: 20,          // Size of the flower center
    });
  
    // Create the petals
    var petal1 = new fabric.Circle({
      left: 150,
      top: 100,            // Position relative to the center
      fill: "transparent", // Transparent fill for the petal
      stroke: "black",     // Border color
      strokeWidth: 2,
      radius: 30,          // Size of the petal
    });
    
    var petal2 = new fabric.Circle({
      left: 200,
      top: 130,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      radius: 30,
    });
  
    var petal3 = new fabric.Circle({
      left: 150,
      top: 200,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      radius: 30,
    });
  
    var petal4 = new fabric.Circle({
      left: 100,
      top: 130,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      radius: 30,
    });
  
    // Add the center and petals to the canvas
    canvas.add(center, petal1, petal2, petal3, petal4);
    canvas.renderAll();
  });

  $("#addStar").click(function () {
    // Define the star path (a simple 5-point star)
    var starPath = `
      M 75 10 
      L 100 100 
      L 200 100 
      L 110 150 
      L 140 240 
      L 75 190 
      L 10 240 
      L 40 150 
      L -50 100 
      L 50 100 
      Z
    `;
  
    // Create the star using the path
    var star = new fabric.Path(starPath, {
      left: 150,          // Position on the canvas
      top: 150,
      fill: "transparent", // Transparent fill for the star
      stroke: "black",     // Border color
      strokeWidth: 2,
      scaleX: 1,          // Scale factor for width
      scaleY: 1           // Scale factor for height
    });
  
    // Add the star to the canvas
    canvas.add(star);
    canvas.renderAll();
  });

 $("#addHeart").click(function () {
  var heartPath = `
    M 50 30 
    C 20 0, 0 20, 50 50 
    C 100 20, 80 0, 50 30 
    Z
  `;
  var heart = new fabric.Path(heartPath, {
    left: 150,
    top: 150,
    fill: "pink",  // Transparent fill
    stroke: "pink",      // Black border
    strokeWidth: 2,
  });
  canvas.add(heart);
  canvas.renderAll();
});

  
  
  

  // Add a triangle
  $("#addTriangle").click(function () {
    var triangle = new fabric.Triangle({
      left: 300,
      top: 200,
      fill: "transparent",  // Transparent fill
    stroke: "black", 
      width: 100,
      height: 100,
    });
    canvas.add(triangle);
    canvas.renderAll();
  });

  // Add a line
  $("#addLine").click(function () {
    var line = new fabric.Line([50, 100, 200, 200], {
      left: 300,
      top: 100,
      stroke: "black",
      strokeWidth: 5,
    });
    canvas.add(line);
    canvas.renderAll();
  });

  // add arrow
  $("#addArrow").click(function () {
    // Create an arrow shape using fabric.Path
    var arrow = new fabric.Path(
      "M4.5 0H0.5C0.223858 0 0 0.223858 0 0.5V4.5C0 4.70223 0.121821 4.88455 0.308658 4.96194C0.495495 5.03933 0.710554 4.99655 0.853553 4.85355L2.5 3.20711L14.1464 14.8536L14.8536 14.1464L3.20711 2.5L4.85355 0.853553C4.99655 0.710554 5.03933 0.495495 4.96194 0.308658C4.88455 0.121821 4.70223 0 4.5 0Z",
      {
        left: 300, // Position on canvas (x-axis)
        top: 100, // Position on canvas (y-axis)
        fill: "#000000", // Fill color of the path
        strokeWidth: 0, // Stroke width (if any)
      }
    );

    // Add the arrow to the canvas
    canvas.add(arrow);
    canvas.renderAll();
  });

  $("#addTextBtn").click(function () {
    var left = canvas.width / 2;
    var top = canvas.height / 2;
    var text = new fabric.Textbox("Default Text", {
      left: left,
      top: top,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#000",
      shadow: {
        color: "#000",
        offsetX: 0,
        offsetY: 0,
        blur: 0,
      },
      editable: true,
      textAlign: "center",
      backgroundColor: "transparent",
    });
    textObjects.push(text);
    canvas.add(text);
    canvas.setActiveObject(text);
    activeShapeIndex = textObjects.length - 1;
    updateTextEditorValues(text);
    $("#textEditor").show();
    canvas.renderAll();
  });

  // // Handle font hover (preview)
  // $('#fontSelect').on('mouseover', 'option', function () {
  //   if (activeText) {
  //     var fontPreview = $(this).val();
  //     activeText.set('fontFamily', fontPreview); // Temporarily apply font on hover
  //     canvas.renderAll();
  //   }
  // });

  // // Revert to the previously selected font on mouseleave
  // $('#fontSelect').on('mouseleave', function () {
  //   if (activeText) {
  //     activeText.set('fontFamily', previousFont); // Revert to previous font if not clicked
  //     canvas.renderAll();
  //   }
  // });

  // // Handle font selection (apply the font permanently)
  // $('#fontSelect').change(function () {
  //   if (activeText) {
  //     var selectedFont = $(this).val();
  //     previousFont = selectedFont; // Update previousFont to the new selected font
  //     activeText.set('fontFamily', selectedFont); // Apply font permanently on selection
  //     canvas.renderAll();
  //   }
  // });

  $("#addImageBtn").click(function () {
    $("#imageInput").click();
  });

  $("#addBgBtn").click(function () {
    $("#bgInput").click();
  });

  $("#addRectBtn").click(function () {
    var left = canvas.width / 2;
    var top = canvas.height / 2;
    var rect = new fabric.Rect({
      left: left,
      top: top,
      width: 100,
      height: 50,
      fill: "#ff0000",
      strokeWidth: 0,
      stroke: "#000",
    });

    shapeObjects.push(rect);
    canvas.add(rect);
    canvas.setActiveObject(rect);
    activeShapeIndex = shapeObjects.length - 1;
    updateShapeEditorValues(rect);
    $("#rectControls").show();
    canvas.renderAll();
  });

  function closeSidebar(event) {
    const sidebar = event.target.closest('.sidebar, .sidebar-div-templates, .sidebar-div-images, .sidebar-div-shapes, .sidebar-div-background');
    if (sidebar) {
      sidebar.classList.remove('active-sidebar');
    }
  }
  // add bg image
  // $("#addBackgroundImageBtn").click(function () {
  //   $("#bgImageInput").click(); // Trigger the file input click
  // });

  // $('#bgImageInput').change(function(event) {
  //   var file = event.target.files[0];
  //   if (file) {
  //     var reader = new FileReader();
  //     reader.onload = function(e) {
  //       var img = new Image();
  //       img.onload = function() {
  //         canvas.backgroundColor = null;
  //         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  //         setCanvasSize(img.width, img.height);
  //         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
  //           // scaleX: canvas.width / img.width,
  //           // scaleY: canvas.height / img.height
  //         });
  //       };
  //       img.src = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   };
  // });
  // $("#bgImageInput").change(function (event) {
  //   var file = event.target.files[0];
  //   if (file) {
  //     var reader = new FileReader();
  //     reader.onload = function (e) {
  //       fabric.Image.fromURL(e.target.result, function (img) {
  //         // img.scaleToWidth(canvas.width);
  //         // img.scaleToHeight(canvas.height);
  //         setCanvasSize(img.width, img.height);

  //         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
  //           scaleX: canvas.width / img.width,
  //           scaleY: canvas.height / img.height,
  //         });
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // });

  // background image dropdown
  $("#addFromDevice").click(function (event) {
    $("#bgImageInput1").click();
  });
  $("#bgImageInput1").change(function (event) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        fabric.Image.fromURL(e.target.result, function (img) {
          // img.scaleToWidth(canvas.width);
          // img.scaleToHeight(canvas.height);
          // setCanvasSize(img.width, img.height);

          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          });
        });
      };
      reader.readAsDataURL(file);
    }
  });

  var targetId = "";

  // badges 
  $(".dropdown-content-badge").on(
    "click", "> div", function (event) {
      var target = event.target;
      var url = $(target).attr("src");
      fabric.Image.fromURL(
        url,
        function (img) {
          img.set({
            left: 300,
            top: 100,
            angle: 0,
            // padding: 10,
            cornersize: 10,
            hasRotatingPoint: false,
          });
          img.scaleToWidth(100);
          img.scaleToHeight(100);
          canvas.add(img);
          canvas.renderAll();
        }
      );
    }
  );

  $(".dropdown-content-bg").on(
    "click",
    "> div",
    function (event) {
      var target = event.target;
      targetId = target.id;
      updateSaveButtonVisibility();
      console.log(target, "target");
      var designFields = target.dataset.designFields;
  
      if (designFields) {
        var designFieldsObj = JSON.parse(designFields);
  
        canvas.loadFromJSON(designFieldsObj, function () {
          canvas.forEachObject(function (obj) {
            if (obj.type === "textbox") {
              textObjects.push(obj);
              obj.on("selected", function () {
                activeTextIndex = textObjects.indexOf(obj);
                updateTextEditorValues(obj);
                $("#textEditor").show();
              });
            }
          });
  
          // Set the template background dimensions to match the canvas
          var templateWidth = canvas.width;
          var templateHeight = canvas.height;
  
          // Apply canvas dimensions to each object in designFields
          designFieldsObj.backgroundImage.width = templateWidth;
          designFieldsObj.backgroundImage.height = templateHeight;
  
          canvas.renderAll();
  
          // Set canvas size and alert user
          setCanvasSize(templateWidth, templateHeight);
          showAlert("Success", "Template loaded and sized successfully!", "OK");
        });
  
      } else if (target.tagName === "IMG") {
        fabric.Image.fromURL(target.src, function (img) {
          // Set background image dimensions to match canvas size
          img.set({
            originX: 'center',
            originY: 'center',
            left: canvas.width / 2,
            top: canvas.height / 2,
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
          });
  
          canvas.setBackgroundImage(
            img,
            canvas.renderAll.bind(canvas)
          );
        });
      }
    }
  );
  
  
  

  $("#exportBtn").click(function () {
    var exportFormat = $("#exportFormat").val();

    var imageData;
    switch (exportFormat) {
      case "png":
        imageData = canvas.toDataURL({
          format: "png",
        });
        saveAs(imageData, "canvas_image.png");
        break;
      case "webp":
        imageData = canvas.toDataURL({
          format: "webp",
          quality: 0.8,
        });
        saveAs(imageData, "canvas_image.webp");
        break;
      case "s3": // s3 upload
        uploadCanvasToS3();
        break;
    }

    setCanvasSize(canvas.originalWidth, canvas.originalHeight);
  });

  // Function to handle uploading and updating state
  async function uploadCanvasToS3() {
 
    // Convert the Fabric.js canvas to a data URL
    const dataURL = canvas.toDataURL({
      format: "png",
    });

    // Convert data URL to a Blob
    const blob = dataURLToBlob(dataURL);

    // Create a FormData object and append the Blob
    const fd = new FormData();
    const date = new Date().getTime();
    const filename = `${fileUrl.split('/').pop()}${date}.png`;
    fd.append("file", blob, filename);


    try {
      const response = await fetch(
        `${apiUrl_Admin}/api/upload`,
        {
          // const response = await fetch(`${apiUrl}/api/upload`, {
          method: "POST",
          body: fd,
        }
      );

      if (response.ok) {

        const data = await response.json();

        const fileUrl = data.fileUrl;
        sessionStorage.setItem("customTemplate", fileUrl);
        sessionStorage.setItem("cerf", "true");
        const tab = sessionStorage.getItem("tab") || 0;
        window.location.href = `/certificate?tab=${tab}`;
      } else {
        console.error("Failed to upload image:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  // Utility function to convert data URL to Blob
  function dataURLToBlob(dataURL) {
    var byteString = atob(dataURL.split(",")[1]);
    var mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

$("#addExport").click(async function () {
  try {
    showLoader()
    
    // Call saveChanges to handle saving logic
    await saveChanges();
    
    // After save is complete, proceed with the upload
    await uploadCanvasToS3();
  } catch (error) {
    console.error("Error in save or upload process:", error);
  }finally{
    hideLoader()
  }
});

  // back button
  $(".back").click(function () {
    window.location.href = `/dashboard`;
  });

  // $("#addExporttab1").click(function () {
  //   uploadCanvasToS3(1);
  // });

  // $("#addTemplate").click(function () {
  //   var templateData = canvas.toJSON();
  //   console.log(templateData); //clg
  //   console.log(typeof(templateData)); //clg

  //   // Save the temp in LS
  //   var templateNumber = localStorage.getItem('templateNumber') || 0;
  //   templateNumber++;
  //   localStorage.setItem('templateNumber', templateNumber);
  //   localStorage.setItem(`template${templateNumber}`, JSON.stringify(templateData));
  //   alert('Template made successfully!');

  //   // Add the image of made template in the dropdown
  //   var templateNumber = localStorage.getItem('templateNumber');
  //   templateNumber = parseInt(templateNumber) || 0;
  //   templateNumber++;
  //   localStorage.setItem('templateNumber', templateNumber);

  //   var templateId = 'template' + templateNumber;
  //   var templateImg = `<div id="${templateId}"><img id="${templateId}" src="${canvas.toDataURL()}" width="80" height="80" /></div>`;
  //   $('.dropdown-content-bg').append(templateImg);

  // });

  //add template to s3 vua api
  let fileUrl = ""; // gets image url from uploadtos3 func, this will be used in below func. 

  $("#addTemplate").click(async function () {
    showLoader();

    // Get the email
    var storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
    var userEmail;
    if (storedUser && storedUser.JWTToken) {
        userEmail = storedUser.email.toLowerCase();
    }

    var templateData = canvas.toJSON();

    // Convert canvas to data URL and Blob
    const dataURL = canvas.toDataURL({  // Use dataURL instead of dataUrl
        format: "png",
    });

   
    const blob = dataURLToBlob(dataURL); // Correctly reference dataURL here
    const fd = new FormData();
    const date = new Date().getTime();
    const filename = `${fileUrl.split('/').pop()}${date}.png`;
    fd.append("file", blob, filename);
   

    try {
        // Upload image
        const uploadResponse = await fetch(
            `${apiUrl_Admin}/api/upload`,
            {
                method: "POST",
                body: fd,
            }
        );

        if (uploadResponse.ok) {
            const data = await uploadResponse.json();
            fileUrl = data.fileUrl; // Set the new file URL

            // Extract the ID of the present canvas if exists
            var id = targetId ? targetId.split("template")[1] : null;
            updateSaveButtonVisibility();
            if (id) {
                // If `id` exists, update the certificate template
                await updateCertificateTemplate(id, fileUrl, templateData);
                showAlert('Success', 'Template updated successfully!', 'OK');
            } else {
                // If no `id`, add a new certificate template
                const response = await fetch(
                    `${apiUrl}/api/add-certificate-template`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: userEmail,
                            url: fileUrl,
                            designFields: templateData
                        }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    showAlert('Success', 'Template added successfully!', 'OK');
                } else {
                    const errorData = await response.json();
                    console.error("Failed to add template", response.statusText, errorData);
                }
            }
        } else {
            const errorData = await uploadResponse.json();
            console.error("Failed to upload template:", uploadResponse.statusText, errorData);
        }
    } catch (error) {
        console.error("Error uploading template:", error);
    } finally {
        hideLoader();
    }
});


    
   // Function to handle updating the certificate template
async function updateCertificateTemplate(id, fileUrl, templateData) {
  try {
    showLoader()
    const response = await fetch(
      `${apiUrl}/api/update-certificate-template`,
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          url: fileUrl,
          designFields: templateData
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      showAlert('Success', 'Template updated successfully!', 'OK');
      isDataUnsaved = false;
      return data;
    } else {
      console.error("Failed to save existing template", response.statusText);
    }
  } catch (error) {
    console.error("Error saving existing template:", error);
  }finally{
    hideLoader()
  }
}

// Main click handler
$("#addinexistingTemplate").click(async function () {
  showLoader()
  
  var templateData = canvas.toJSON();
  
  // Image URL, almost the same as upload to S3
  // Convert data URL to a Blob
  const dataURL = canvas.toDataURL({
    format: "png",
  });
  const blob = dataURLToBlob(dataURL);
  const fd = new FormData();
  const date = new Date().getTime();
  const filename = `${fileUrl.split('/').pop()}${date}.png`;
  fd.append("file", blob, filename);

  try {
    const uploadResponse = await fetch(
      `${apiUrl_Admin}/api/upload`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (uploadResponse.ok) {
      const data = await uploadResponse.json();
      fileUrl = data.fileUrl;

      // Extract the ID of the present canvas
      var id = targetId.split("template")[1];
      updateSaveButtonVisibility();
      // Call the new function for updating the certificate template
      await updateCertificateTemplate(id, fileUrl, templateData);
    } else {
      console.error("Failed to upload template:", uploadResponse.statusText);
    }
  } catch (error) {
    console.error("Error uploading template:", error);
  }finally{
    hideLoader()
  }
});


// setInterval(function() {
//   var templateData = canvas.toJSON();
//   var id = targetId.split("template")[1];
//   updateCertificateTemplate(id, fileUrl, templateData)
// }, 5000);

  $("#useTemplate").click(function () {
    var templateData = localStorage.getItem("template1");
    let data = JSON.parse(templateData);
    // console.log(JSON.parse(templateData));
    // console.log(data.backgroundImage.width);

    if (templateData) {
      // Clear the current canvas
      canvas.clear();

      // Load the template into the canvas (this is a copy)
      canvas.loadFromJSON(JSON.parse(templateData), function (obj) {
        // const parsedTemplateData = JSON.parse(templateData);
        // canvas.setWidth(parsedTemplateData.BackgroundImage.width);
        // canvas.setHeight(parsedTemplateData.BackgroundImage.height);
        var canvasHeight = window.innerHeight * 0.8;
        var canvasWidth = window.innerWidth * 0.8;
        canvas.renderAll();
        // setCanvasSize(data.backgroundImage.width, data.backgroundImage.height);
        // alert("Template loaded successfully!");
        showAlert('Success', 'Template loaded successfullydd!', 'OK');

      });
    } else {
      // alert("Template not found!");
      showAlert('Warning', 'Template not found', 'OK');
      
    }
  });
    // Function to upload image to the backend
// Function to upload image to the backend
function uploadImageToBackend(file, type) {
  const formData = new FormData();
  formData.append('image', file); // 'image' should match the key used in the multer setup
  formData.append('type', type);
  
  // Retrieve issuerId from local storage
  const userObject = JSON.parse(localStorage.getItem('user'));
  const issuerId = userObject ? userObject.issuerId : null; // Get the issuerId

  if (!issuerId) {
      console.error('Issuer ID not found in local storage.');
      return Promise.reject('Issuer ID not found.'); // Return a rejected promise if issuerId is not found
  }

  formData.append('issuerId', issuerId); // Append issuerId to formData
  showLoader()

  // Return the fetch promise
  return fetch(`${apiUrl}/api/add/certificate/image`, {
      method: 'POST',
      body: formData,
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Return JSON if the response is OK
  })
  .then(data => {
      console.log('Image uploaded successfully:', data);
      // Show success message after successful upload
      showSuccessPopup("Image uploaded successfully!");
      return data; // Return the data if you need it
  })
  .catch(error => {
      console.error('Error uploading image:', error);
      throw error; // Re-throw error to be handled later
  }).finally(()=>{
    hideLoader()
  })
}


  $("#imageInput").change(function (e) {
    var file = e.target.files[0];
    const type="image"

    // Now upload the image to the backend
  uploadImageToBackend(file, type).then(() => {
    showSuccessPopup("Image uploaded successfully!");
    // Only refresh the image list after the upload is successful
    document.getElementById('uploaded-images-tab').click(); // Simulate click to refresh the images list
}).catch((error) => {
    console.error('Failed to upload image:', error);
    // Optionally show an error message
});
});
$("#bgInput").change(function (e) {
  var file = e.target.files[0];
  const type="background"

  // Now upload the image to the backend
  uploadImageToBackend(file, type).then(() => {
    showSuccessPopup("Background uploaded successfully!");
    // Only refresh the image list after the upload is successful
    document.getElementById('uploaded-bg-tab').click(); // Simulate click to refresh the images list
}).catch((error) => {
    console.error('Failed to upload image:', error);
    // Optionally show an error message
});
});

// Function to fetch and display uploaded images
$("#uploaded-images-tab").click(function() {
  // Retrieve issuerId from local storage
  const userObject = JSON.parse(localStorage.getItem('user'));
  const issuerId = userObject ? userObject.issuerId : null;

  if (issuerId) {
    fetch(`${apiUrl}/api/get/certificate/image/${issuerId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        return response.json(); // Parse the JSON response
      })
      .then(images => {
        console.log(images);
        // Get the uploaded images container
        const container = document.getElementById('uploaded-images-container');
        container.innerHTML = ''; // Clear previous images
    
        // Display the fetched images
        images.forEach(image => {
          // Fetch each image as a Base64 string
          fetch(image.imageUrl)
            .then(response => response.blob())
            .then(blob => {
              const reader = new FileReader();
              reader.onloadend = function() {
                const base64data = reader.result; // This is the Base64 string
                const wrapper = document.createElement('div');
                wrapper.className = 'image-wrapper'; // Add the same class for styling
                wrapper.style.display = 'flex'; // Set display style to flex
                wrapper.style.position = 'relative'; // Position relative for absolute positioning of the close icon

                // Create the entire HTML structure for the image and delete button
                wrapper.innerHTML = `
                  <div id="${image.id}" class="grid-box templatefromapi" style="position: relative;">
                    <img id="${image.id}-img" src="${base64data}" width="80" height="80" alt="Uploaded Image"/>
                    <div class="close" style="position: absolute; top: -10px; right: -10px; cursor: pointer;">
                      <img src="./templateAsset/close.png" alt="close" style="width: 16px; height: 16px;" />
                    </div>
                  </div>
                `;

                // Append the wrapper to the container
                container.appendChild(wrapper);

                // Add the click event listener for the delete action
                const deleteIcon = wrapper.querySelector('.close');
                deleteIcon.onclick = function(event) {
                  event.stopPropagation(); // Prevent any click event on the wrapper
                  deleteImage(image.id, "uploaded-images-tab"); // Call delete function with imageId
                };
              };
              reader.readAsDataURL(blob); // Convert blob to Base64
            })
            .catch(error => {
              console.error('Error fetching image as Base64:', error);
            });
        });
    
        // Show the uploaded images container and hide default images container
        document.getElementById('uploaded-images-container').style.display = 'grid';
        document.getElementById('default-images-container').style.display = 'none';
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        showFailurePopup("There was an error fetching your uploaded images.");
      });
  } else {
    // alert('Issuer ID not found.');
  }
});



$("#uploaded-bg-tab").click(function() {
  // Retrieve issuerId from local storage
  const userObject = JSON.parse(localStorage.getItem('user'));
  const issuerId = userObject ? userObject.issuerId : null;

  if (issuerId) {
    fetch(`${apiUrl}/api/get/certificate/background/${issuerId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        return response.json(); // Parse the JSON response
      })
      .then(images => {
        console.log(images);
        // Get the uploaded images container
        const container = document.getElementById('uploaded-bg-container');
        container.innerHTML = ''; // Clear previous images
    
        // Display the fetched images
        images.forEach(image => {
          // Fetch each image as a Base64 string
          fetch(image.imageUrl)
            .then(response => response.blob())
            .then(blob => {
              const reader = new FileReader();
              reader.onloadend = function() {
                const base64data = reader.result; // This is the Base64 string
                const wrapper = document.createElement('div');
                wrapper.className = 'image-wrapper'; // Add the same class for styling
                wrapper.style.display = 'flex'; // Set display style to flex
                wrapper.style.position = 'relative'; // Position relative for absolute positioning of the close icon

                // Create the entire HTML structure for the image and delete button
                wrapper.innerHTML = `
                  <div id="${image.id}" class="grid-box templatefromapi" style="position: relative;">
                    <img id="${image.id}-img" src="${base64data}" width="80" height="80" alt="Uploaded Image"/>
                    <div class="close" style="position: absolute; top: -10px; right: -10px; cursor: pointer;">
                      <img src="./templateAsset/close.png" alt="close" style="width: 16px; height: 16px;" />
                    </div>
                  </div>
                `;

                // Append the wrapper to the container
                container.appendChild(wrapper);

                // Add the click event listener for the delete action
                const deleteIcon = wrapper.querySelector('.close');
                deleteIcon.onclick = function(event) {
                  event.stopPropagation(); // Prevent any click event on the wrapper
                  deleteImage(image.id,"uploaded-bg-tab"); // Call delete function with imageId
                };
              };
              reader.readAsDataURL(blob); // Convert blob to Base64
            })
            .catch(error => {
              console.error('Error fetching image as Base64:', error);
            });
        });
    
        // Show the uploaded images container and hide default images container
        document.getElementById('uploaded-bg-container').style.display = 'grid';
        document.getElementById('default-bg-container').style.display = 'none';
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        showFailurePopup("There was an error fetching your uploaded images.");
      });
  } else {
    // alert('Issuer ID not found.');
  }
});

const deleteImage = (imageId,tabId) => {
  // Retrieve issuerId from local storage
  const userObject = JSON.parse(localStorage.getItem('user'));
  const issuerId = userObject ? userObject.issuerId : null;

  if (!issuerId) {
      // alert('Issuer ID not found.');
      return;
  }

  // Show custom confirmation popup instead of default confirm dialog
  showConfirmationPopup(
    'Are you sure you want to delete this image?', 
    function() {
      showLoader()
        // Proceed with the deletion if the user confirms
        fetch(`${apiUrl}/api/delete/certificate/image/${issuerId}/${imageId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete the image');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            console.log('Image deleted successfully:', data);
            showSuccessPopup('Image deleted successfully!');

            // Optionally, refresh the image list after successful deletion
            document.getElementById(tabId).click(); // Simulate click to refresh the images list
        })
        .catch(error => {
            console.error('Error deleting image:', error);
            showFailurePopup('There was an error deleting the image.'); // Show failure popup
        }).finally(()=>{
          hideLoader()
        })
    },
    function() {
        // Cancel action
        console.log('Deletion canceled.');
    }
  );
};


// Function to display default images when 'Images' tab is clicked
$("#default-images-tab").click(function() {
  // Show the default images container and hide the uploaded images container
  document.getElementById('default-images-container').style.display = 'grid';
  document.getElementById('uploaded-images-container').style.display = 'none';
});
$("#default-bg-tab").click(function() {
  // Show the default images container and hide the uploaded images container
  document.getElementById('default-bg-container').style.display = 'grid';
  document.getElementById('uploaded-bg-container').style.display = 'none';
});



// Function to show a success popup message
function showSuccessPopup(message) {
  // Create a modal element
  const popup = document.createElement('div');
  popup.className = 'popup'; // Add a class for styling
  popup.innerText = message;

  // Style the popup (you can modify these styles as needed)
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '20px';
  popup.style.backgroundColor = 'rgba(0, 128, 0, 0.8)'; // Green background
  popup.style.color = 'white';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '1000';
  popup.style.textAlign = 'center';
  
  // Append the popup to the body
  document.body.appendChild(popup);

  // Automatically remove the popup after 2 seconds
  setTimeout(function () {
      document.body.removeChild(popup);
  }, 2000);
}


function showConfirmationPopup(message, onConfirm, onCancel) {
  // Create a modal element
  const popup = document.createElement('div');
  popup.className = 'popup'; // Add a class for styling
  popup.innerText = message;

  // Style the popup
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '20px';
  popup.style.backgroundColor = '#fff'; // White background
  popup.style.color = 'black';
  popup.style.border = '1px solid #ccc';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '1000';
  popup.style.textAlign = 'center';

  // Create "Confirm" button
  const confirmButton = document.createElement('button');
  confirmButton.innerText = 'Confirm';
  confirmButton.style.margin = '10px';
  confirmButton.style.padding = '10px 20px';
  confirmButton.style.backgroundColor = 'green';
  confirmButton.style.color = 'white';
  confirmButton.style.border = 'none';
  confirmButton.style.borderRadius = '5px';
  confirmButton.style.cursor = 'pointer';

  // Create "Cancel" button
  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';
  cancelButton.style.margin = '10px';
  cancelButton.style.padding = '10px 20px';
  cancelButton.style.backgroundColor = 'red';
  cancelButton.style.color = 'white';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '5px';
  cancelButton.style.cursor = 'pointer';

  // Append buttons to the popup
  popup.appendChild(confirmButton);
  popup.appendChild(cancelButton);

  // Append the popup to the body
  document.body.appendChild(popup);

  // Add click event to "Confirm" button
  confirmButton.addEventListener('click', function() {
      onConfirm(); // Execute the confirm callback
      document.body.removeChild(popup); // Remove popup after confirmation
  });

  // Add click event to "Cancel" button
  cancelButton.addEventListener('click', function() {
      onCancel(); // Execute the cancel callback
      document.body.removeChild(popup); // Remove popup after cancellation
  });
}


function showFailurePopup(message) {
  // Create a modal element
  const popup = document.createElement('div');
  popup.className = 'popup'; // Add a class for styling
  popup.innerText = message;

  // Style the popup (you can modify these styles as needed)
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '20px';
  popup.style.backgroundColor = 'red'; // Green background
  popup.style.color = 'white';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '1000';
  popup.style.textAlign = 'center';
  
  // Append the popup to the body
  document.body.appendChild(popup);

  // Automatically remove the popup after 2 seconds
  setTimeout(function () {
      document.body.removeChild(popup);
  }, 2000);
}

  $("#bgColorPicker").change(function () {
    var newBgColor = $(this).val();
    canvas.setBackgroundColor(newBgColor);
    canvas.renderAll();
  });

  $(".canvasSizeSelect").change(function () {
    var selectedSize = $(this).val();
    switch (selectedSize) {
      case "youtube":
        setCanvasSize(1280, 720);
        break;
      case "facebook":
        setCanvasSize(1200, 630);
        break;
      case "instagram":
        setCanvasSize(1080, 1080);
        break;
      case "twitter":
        setCanvasSize(1024, 512);
        break;
      case "pinterest":
        setCanvasSize(1000, 1500);
        break;
      case "tumblr":
        setCanvasSize(540, 810);
        break;
      case "custom":
        $("#customSizeFields").show();
        break;
    }
  });
  // custom size changes
  var customWidth = null;
  var customHeight = null;
  $("#customWidth").change(function () {
    customWidth = parseInt($("#customWidth").val());
    if (customHeight !== null) {
      setCanvasSize(customWidth, customHeight);
      customWidth = null;
      customHeight = null;
    }
  });
  $("#customHeight").change(function () {
    customHeight = parseInt($("#customHeight").val());
    if (customWidth !== null) {
      setCanvasSize(customWidth, customHeight);
      customWidth = null;
      customHeight = null;
    }
    //   $("#customWidth, #customHeight").change(function () {
    //     var customWidth = parseInt($("#customWidth").val());
    //     var customHeight = parseInt($("#customHeight").val());
    //     setCanvasSize(customWidth, customHeight);
  });

  function setCanvasSize(width, height) {
    $("#canvas-wrapper").css("width", width);
    $("#canvas-wrapper").css("height", height);
    // $("#canvasContainer").css("width", width);
    // $("#canvasContainer").css("height", height);
    $("#canvas").attr("width", width);
    $("#canvas").attr("height", height);
    canvas.setWidth(width);
    canvas.setHeight(height);
    $("#customSizeFields").hide();
    canvas.renderAll();
  }

  canvas.on("mouse:down", function (event) {
    if (event.target && event.target.type === "textbox") {
      activeTextIndex = textObjects.indexOf(event.target);
      $("#textEditor").show();
    } else {
      $("#textEditor").hide();
    }
  });

  $(
    "#rectColorInput, #rectWidthInput, #rectHeightInput, #outlineSizeInput, #outlineColorInput"
  ).change(function () {
    var newRectColor = $("#rectColorInput").val();
    var newRectWidth = parseInt($("#rectWidthInput").val());
    var newRectHeight = parseInt($("#rectHeightInput").val());
    var newOutlineSize = parseInt($("#outlineSizeInput").val());
    var newOutlineColor = $("#outlineColorInput").val();

    if (activeShape) {
      activeShape.set({
        fill: newRectColor,
        width: newRectWidth,
        height: newRectHeight,
        strokeWidth: newOutlineSize,
        stroke: newOutlineColor,
      });
      canvas.renderAll();
    }
  });

  // Text Input Change Handler
  $("#textInput").change(function () {
    var newText = $(this).val();
    // console.log("newText: ", newText);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        text: newText,
      });
      canvas.renderAll();
    }
  });

  // Text Color Change Handler
  $("#colorInput").change(function () {
    var newColor = $(this).val();
    // console.log("newColor: ", newColor);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        fill: newColor,
      });
      canvas.renderAll();
    }
  });

  // Text Shadow Color Change Handler
  // $("#shadowColorInput").change(function () {
  //   var newShadowColor = $(this).val();
  //   console.log("newShadowColor: ", newShadowColor);
  //   var activeText = textObjects[activeTextIndex];

  //   if (activeText) {
  //     activeText.set({
  //       shadow: {
  //         color: newShadowColor,
  //       },
  //     });
  //     canvas.renderAll();
  //   }
  // });

  // Text Shadow Size Change Handler
  $("#shadowSizeInput").change(function () {
    var newShadowSize = parseInt($(this).val());
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        shadow: {
          offsetX: newShadowSize,
          offsetY: newShadowSize,
          blur: newShadowSize,
        },
      });
      canvas.renderAll();
    }
  });

  // Text Font Change Handler
  $("#fontSelect").change(function () {
    var newFont = $(this).val();
    // console.log("newFont: ", newFont);
    var activeText = textObjects[activeTextIndex];
    // console.log(activeText);

    if (activeText) {
      activeText.set({
        fontFamily: newFont,
      });
      canvas.renderAll();
    }
  });

  // Text Size Change Handler
  $("#sizeInput").change(function () {
    var newSize = parseInt($(this).val());
    // console.log("newSize: ", newSize);

    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        fontSize: newSize,
      });
      canvas.renderAll();
    }
  });

  // Text Align Change Handler
  $("#textAlignLeft").click(function () {
    var newTextAlign = "left";
    console.log("newTextAlign: ", newTextAlign);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        textAlign: newTextAlign,
      });
      canvas.renderAll();
    }
  });
  $("#textAlignCenter").click(function () {
    var newTextAlign = "center";
    // console.log("newTextAlign: ", newTextAlign);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        textAlign: newTextAlign,
      });
      canvas.renderAll();
    }
  });
  $("#textAlignRight").click(function () {
    // var newTextAlign = $(this).val();
    var newTextAlign = "right";

    // console.log("newTextAlign: ", newTextAlign);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        textAlign: newTextAlign,
      });
      canvas.renderAll();
    }
  });

  $("#bgColorInput").change(function () {
    var newBgColor = $("#bgColorInput").val() || "transparent";
    // console.log("newBgColor: ", newBgColor);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        backgroundColor: newBgColor,
      });
      canvas.renderAll();
    }
  });

  // $("#deleteBtn").click(function () {
  //   var activeObject = canvas.getActiveObject();
  //   if (activeObject) {
  //     canvas.remove(activeObject);
  //     var index = textObjects.indexOf(activeObject);
  //     if (index !== -1) {
  //       textObjects.splice(index, 1);
  //     }
  //     canvas.discardActiveObject();
  //     canvas.renderAll();
  //   }
  // });

  function updateTextEditorValues(textObject) {
    $("#textInput").val(textObject.text);
    $("#colorInput").val(textObject.fill);
    // $("#shadowColorInput").val(textObject.shadow.color);
    $("#shadowSizeInput").val(textObject.shadow.offsetX);
    $("#bgColorInput").val(textObject.backgroundColor);
    $("#fontSelect").val(textObject.fontFamily);
    $("#sizeInput").val(textObject.fontSize);
    $("#textAlignLeft").val(textObject.textAlign);
    $("#textAlignCenter").val(textObject.textAlign);
    $("#textAlignRight").val(textObject.textAlign);
  }

  function updateShapeEditorValues(shapeObject) {
    $("#rectColorInput").val(shapeObject.fill);
    $("#rectWidthInput").val(shapeObject.width);
    $("#rectHeightInput").val(shapeObject.height);
    $("#outlineSizeInput").val(shapeObject.strokeWidth);
    $("#outlineColorInput").val(shapeObject.stroke);
  }

  $("#canvas-wrapper").resizable({
    resize: function (event, ui) {
      var newWidth = ui.size.width;
      var newHeight = ui.size.height;
      $("#canvas").attr("width", newWidth);
      $("#canvas").attr("height", newHeight);
      canvas.setWidth(newWidth);
      canvas.setHeight(newHeight);
      canvas.renderAll();
    },
  });
  // $("#canvasContainer").resizable({
  //   resize: function (event, ui) {
  //     var newWidth = ui.size.width;
  //     var newHeight = ui.size.height;
  //     $("#canvas").attr("width", newWidth);
  //     $("#canvas").attr("height", newHeight);
  //     canvas.setWidth(newWidth);
  //     canvas.setHeight(newHeight);
  //     canvas.renderAll();
  //   },
  // });

  // for font
  const fontList = [
    "Agency FB",
    "Andalé Mono",
    "Andale Mono",
    "Antique Olive",
    "Arial",
    "Avant Garde",
    "Baskerville",
    "Berlin Sans FB",
    "Book Antiqua",
    "Bookman",
    "Bradley Hand",
    "Broadway",
    "Brush Script MT",
    "Calabri",
    "Candara",
    "Castellar",
    "Century Gothic",
    "Comic Sans MS",
    "Consolas",
    "Constantia",
    "Corbel",
    "Courier",
    "Courier New",
    "Copperplate",
    "Estrangelo Edessa",
    "Elephant",
    "Eurostile",
    "Fixed",
    "Franklin Gothic",
    "Franklin Gothic Medium",
    "Futura",
    "Garamond",
    "Gautami",
    "Geneva",
    "Georgia",
    "Gill Sans",
    "Goudy Old Style",
    "Haettenschweiler",
    "Helvetica",
    "Impact",
    "Inconsolata",
    "Latha",
    "Lucida",
    "Lucida Bright",
    "Lucida Console",
    "Lucida Fax",
    "Lucida Grande",
    "Lucida Handwriting",
    "Lucida Sans",
    "Luminari",
    "Mangal",
    "Matura MT Script Capitals",
    "Microsoft Sans Serif",
    "Monaco",
    "MS Sans Serif",
    "MS Serif",
    "Old English Text MT",
    "Onyx",
    "Optima",
    "Palatino",
    "Palatino Linotype",
    "Papyrus",
    "Perpetua",
    "Playbill",
    "Raavi",
    "Rockwell",
    "Segoe UI",
    "Shruti",
    "Stencil",
    "Sylfaen",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Tunga",
    "Univers",
    "Verdana",
    "Wide Latin",
  ];

  const $selectElement = $("#fontSelect");
  const $selectsizeElement = $("#sizeSelect");

  fontList.forEach((font) => {
    $selectElement.append(
      $("<option>", {
        value: font,
        text: font,
        style: `font-family: ${font};`,
      })
    );
  });

  // for text size
  const sizeList = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48,
    72, 96,
  ];
  $selectsizeElement.change(function () {
    var activeText = textObjects[activeTextIndex];
    if (activeText) {
      var newSize = parseInt($(this).val());
      activeText.set({
        fontSize: newSize,
      });
      canvas.renderAll();
    }
  });
  sizeList.forEach((size) => {
    $selectsizeElement.append(
      $("<option>", {
        value: size,
        text: size,
      })
    );
  });


  // on rleoad, get cerfs.
  (async function () {
    var storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
    var userEmail;
    if (storedUser && storedUser.JWTToken) {
      userEmail = storedUser.email.toLowerCase();
    }
    // console.log(userEmail);
    // get the temp from s3
    try {
        const response = await fetch(
          `${apiUrl}/api/get-certificate-templates`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
          },
            body: JSON.stringify({
              email: userEmail,
            }),
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          // console.log(data);  
          
          if (data.status === "SUCCESS" && data.data.length > 0) {
            // Remove all templates loaded from API
            $(".templatefromapi").remove();
            
            data.data.forEach((template, index) => {
            
                // Create template image in the dropdown using the URL and _id
                createTemplateImage(template);
            });

        } else {
            console.error("No templates found.");
        }

        } else {
          console.error("Can't fetch template", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
  })();

  function createTemplateImage(template) {
    const templateId = 'template' + template._id; // Use _id from the template
    const templateImg = `
        <div id="${templateId}" class="grid-box templatefromapi" style="position: relative;">
            <img id="${templateId}-img" src="${template.url}" width="80" height="80" data-design-fields='${JSON.stringify(template.designFields)}' />
            <div class="close" style="position: absolute; top: -10px; right: -10px; cursor: pointer;">
                <img src="./templateAsset/close.png" alt="close" style="width: 16px; height: 16px;" />
            </div>
        </div>`;
    
    // Append the template image to the dropdown area
    $('#designed').append(templateImg);

    // Attach event listener to the delete icon (inside the .close div)
    $(`#${templateId} .close`).on('click', function() {
        // Prevent any propagation or unintended side effects
        event.stopPropagation();

        // Call the delete API when the close icon is clicked
        deleteTemplateById(template._id);
    });
}



// Function to call the delete API
function deleteTemplateById(certificateId) {
  fetch(`${apiUrl}/api/delete-certificatetemplate`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ certificateId }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'SUCCESS') {
      // Remove the template element from the DOM
      $(`#template${certificateId}`).remove();
    } else {
      console.error('Error:', data.message);
    }
  })
  .catch(error => {
    console.error('Error deleting template:', error);
  });
}


  // $(window).on('beforeunload', function(event) {
  //   if (isDataUnsaved) {
  //       var message = "You have unsaved changes. Do you really want to leave?";
  //       event.preventDefault(); 
  //       event.returnValue = message; 
  //       return message; 
  //   }
  // });

  // Show the modal dialog instead of the default prompt


  canvas.on("object:added", function () {
    
    saveState();
  });
  
  canvas.on("object:modified", function () {
   
    saveState();
  });
  
  canvas.on("object:removed", function () {
    
    saveState();
  });
  
  

  function saveState() {
    const currentState = JSON.stringify(canvas.toJSON());
  
    // Prevent duplicate states from being pushed
    if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== currentState) {
      undoStack.push(currentState);
      redoStack = []; // Clear redo stack when a new action is performed
    }
  }
  
  function undo() {
    if (undoStack.length > 1) { // Need at least one previous state to undo
      // Push current state to redo stack before undoing
      redoStack.push(JSON.stringify(canvas.toJSON()));
  
      // Remove the last state from undoStack
      const lastState = undoStack.pop();
  
      // Get the previous state
      const previousState = undoStack[undoStack.length - 1];
  
      // Clear the canvas
      canvas.clear();
  
      // Load the previous state, ensuring the background image is handled correctly
      canvas.loadFromJSON(previousState, function () {
        canvas.renderAll();
  
        // Handle the background image separately (if any)
        if (canvas.backgroundImage) {
          fabric.Image.fromURL(canvas.backgroundImage.src, function (img) {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height
            });
          });
        }
      });
    }
  }
  
  function redo() {
    if (redoStack.length > 0) {
      // Push current state to undoStack before redoing
      undoStack.push(JSON.stringify(canvas.toJSON()));
  
      // Get the next state from redoStack
      const nextState = redoStack.pop();
  
      // Clear the canvas
      canvas.clear();
  
      // Load the next state, ensuring the background image is handled correctly
      canvas.loadFromJSON(nextState, function () {
        canvas.renderAll();
  
        // Handle the background image separately (if any)
        if (canvas.backgroundImage) {
          fabric.Image.fromURL(canvas.backgroundImage.src, function (img) {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height
            });
          });
        }
      });
    }
  }
  
  

  
  function deleteSelectedObject() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      saveState(); // Save the state after deleting
      canvas.renderAll();
    }
  }
  

  function showUnsavedChangesModal() {
    $('#unsavedChangesModal').show();

    
    $('#saveButton').off('click').on('click', function(event) {
        // event.preventDefault();
        saveChanges();
        $('#unsavedChangesModal').hide(); 
        isDataUnsaved = false; 

    });

    $('#leaveButton').off('click').on('click', function() {
      $('#unsavedChangesModal').hide(); // Hide the modal
      isDataUnsaved = false; // Reset the unsaved changes flag
      // window.location.href = 'your-desired-url'; // Replace with the URL to navigate to
  });
  }
// Function to update save button visibility
function updateSaveButtonVisibility() {
  const saveButton = document.getElementById("addinexistingTemplate");
  if (targetId) {
    console.log(targetId,"id")
      saveButton.style.display = "flex"; // Show the button if id exists
  } else {
      saveButton.style.display = "none"; // Hide the button if no id
  }
}


  function saveChanges() {
    if(targetId.length > 0){
      $("#addinexistingTemplate").click();
    }else{
      $("#addTemplate").click();
    }
  }



  // guide lines code
  canvas.on('object:moving', function (e) {
    const obj = e.target;
    clearGuidelines(); // Clear previous guidelines

    const tolerance = 10; // Adjust for how close objects should be to snap
    const snapRange = 5; // How far objects need to be to automatically snap

    // Get the center of the canvas
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    // Loop through all objects to find nearby ones
    canvas.getObjects().forEach(function(target) {
        if (target !== obj) {
            // Get target object edges (left, right, top, bottom)
            const targetLeft = target.left;
            const targetRight = target.left + target.width * target.scaleX;
            const targetTop = target.top;
            const targetBottom = target.top + target.height * target.scaleY;

            // Get the moving object edges
            const objRight = obj.left + obj.width * obj.scaleX;
            const objBottom = obj.top + obj.height * obj.scaleY;

            // Get the center of the target object
            const targetCenterX = targetLeft + (target.width * target.scaleX) / 2;
            const targetCenterY = targetTop + (target.height * target.scaleY) / 2;

            // Check for vertical alignment (left and right)
            if (Math.abs(obj.left - targetLeft) < tolerance) {
                drawGuideline(targetLeft, 0, targetLeft, canvas.height, 'red'); // Draw guideline
                if (Math.abs(obj.left - targetLeft) < snapRange) {
                    obj.left = targetLeft; // Snap to the left
                }
            }
            if (Math.abs(objRight - targetRight) < tolerance) {
                drawGuideline(targetRight, 0, targetRight, canvas.height, 'red'); // Draw guideline
                if (Math.abs(objRight - targetRight) < snapRange) {
                    obj.left = targetRight - obj.width * obj.scaleX; // Snap to the right
                }
            }

            // Check for horizontal alignment (top and bottom)
            if (Math.abs(obj.top - targetTop) < tolerance) {
                drawGuideline(0, targetTop, canvas.width, targetTop, 'blue'); // Draw guideline
                if (Math.abs(obj.top - targetTop) < snapRange) {
                    obj.top = targetTop; // Snap to the top
                }
            }
            if (Math.abs(objBottom - targetBottom) < tolerance) {
                drawGuideline(0, targetBottom, canvas.width, targetBottom, 'blue'); // Draw guideline
                if (Math.abs(objBottom - targetBottom) < snapRange) {
                    obj.top = targetBottom - obj.height * obj.scaleY; // Snap to the bottom
                }
            }

            // Check for center alignment (both vertical and horizontal)
            if (Math.abs(obj.left + (obj.width * obj.scaleX) / 2 - targetCenterX) < tolerance) {
                drawGuideline(targetCenterX, 0, targetCenterX, canvas.height, 'green'); // Draw guideline
                if (Math.abs(obj.left + (obj.width * obj.scaleX) / 2 - targetCenterX) < snapRange) {
                    obj.left = targetCenterX - (obj.width * obj.scaleX) / 2; // Snap to center horizontally
                }
            }
            if (Math.abs(obj.top + (obj.height * obj.scaleY) / 2 - targetCenterY) < tolerance) {
                drawGuideline(0, targetCenterY, canvas.width, targetCenterY, 'yellow'); // Draw guideline
                if (Math.abs(obj.top + (obj.height * obj.scaleY) / 2 - targetCenterY) < snapRange) {
                    obj.top = targetCenterY - (obj.height * obj.scaleY) / 2; // Snap to center vertically
                }
            }
        }
    });

    // Check for canvas center alignment
    if (Math.abs(obj.left + (obj.width * obj.scaleX) / 2 - canvasCenterX) < tolerance) {
        drawGuideline(canvasCenterX, 0, canvasCenterX, canvas.height, 'green'); // Draw guideline
        if (Math.abs(obj.left + (obj.width * obj.scaleX) / 2 - canvasCenterX) < snapRange) {
            obj.left = canvasCenterX - (obj.width * obj.scaleX) / 2; // Snap to canvas center horizontally
        }
    }
    if (Math.abs(obj.top + (obj.height * obj.scaleY) / 2 - canvasCenterY) < tolerance) {
        drawGuideline(0, canvasCenterY, canvas.width, canvasCenterY, 'yellow'); // Draw guideline
        if (Math.abs(obj.top + (obj.height * obj.scaleY) / 2 - canvasCenterY) < snapRange) {
            obj.top = canvasCenterY - (obj.height * obj.scaleY) / 2; // Snap to canvas center vertically
        }
    }

    canvas.renderAll(); // Render the canvas with new object positions
});

canvas.on('object:modified', function() {
    clearGuidelines(); // Clear guidelines after the object has been moved
});

// Clear all guidelines
function clearGuidelines() {
    const guidelines = canvas.getObjects().filter(obj => obj.type === 'line' && !obj.selectable);
    guidelines.forEach(line => canvas.remove(line));
}

// Function to draw guidelines from one object to the edges of the canvas (or nearby object)
function drawGuideline(x1, y1, x2, y2, color) {
    const line = new fabric.Line([x1, y1, x2, y2], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
    });
    canvas.add(line);
    return line;
}

function showAlert(header, body, buttonText) {
  $("#alertModalLabel").text(header);
  $("#alertModalBody").text(body);
  $("#alertModalButton").text(buttonText);
  $("#alertModal").modal("show");
}

   // Save the initial state of the canvas
   saveState();

   // Keyboard event handling for undo, redo, and delete
   $(document).keydown(function (e) {
     if ((e.ctrlKey || e.metaKey) && e.key === "z") {
       e.preventDefault();
       undo();
     } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
       e.preventDefault();
       redo();
     }
 
     if (e.key === "Delete") {
       deleteSelectedObject();
     }
   });



});
  


canvas.on("object:selected", function (e) {
  var activeObject = e.target;
  if (activeObject) {
    canvas.bringToFront(activeObject);
    canvas.renderAll();
    activeObject.bringForward();

    if (activeObject.type === "textbox") {
      // Check if the activeObject is part of textObjects
      if (!textObjects.includes(activeObject)) {
        textObjects.push(activeObject); // Add to textObjects if not already included
      }
      activeTextIndex = textObjects.indexOf(activeObject); // Set the active text index

      // Update text editor values for the selected text object
      updateTextEditorValues(activeObject);
      $("#textEditor").show();
    } else {
      updateShapeEditorValues(activeObject);
      $("#shapeEditor").show();
    }
  } else {
    $("#textEditor").hide();
    $("#shapeEditor").hide();
  }
});

canvas.on("selection:cleared", function (e) {
  var lastSelectedObject = canvas._objects[canvas._objects.length - 1];
  if (lastSelectedObject) {
    canvas.bringToFront(lastSelectedObject);
    canvas.renderAll();
  }
});


function showLoader() {
  document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}



