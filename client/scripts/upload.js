$(document).ready(function (e) {

    let IMAGE = false;

    $("#uploadimage").on('submit', (function (e) {
        e.preventDefault();
        $("#message").empty();
        $('#loading').show();

        if (!IMAGE) {
            $('#loading').hide();
            $("#message").html("Cannot upload the image. Try again.");
            return;
        }

        let inputFile = $('#file')[0].files[0];
        let mimeType = inputFile.type;

        let formData = new FormData();

        let canvasData = $('canvas');
        let imagesArray = [];

        canvasData.each((i, canvas) => {
            let dataURI = canvas.toDataURL(mimeType, 1.0);

            let imageBlob = (function () {
                /* Convert base64 url to binary data */
                let binary = atob(dataURI.split(',')[1]);
                let array = [];
                for (let i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }

                return new Blob([new Uint8Array(array)], { type: mimeType });
            })();

            let imageObj = {
                blob: imageBlob,
                id: canvas.id
            }

            imagesArray.push(imageObj);
        })

        imagesArray.forEach((image) => {
            formData.append('images', image.blob, image.id + '-' + inputFile.name);
        });

        //formData.append('images', inputFile);  APPEND ORIGINAL FILE
        sendPostRequestToServer(formData);
    }));

    function sendPostRequestToServer(formData) {
        $.ajax({
            url: "http://localhost:8012/upload/images",
            type: "POST",
            data: formData,
            contentType: false,
            cache: false,
            mimeType: "multipart/form-data",
            async: true,
            processData: false,
            success: function (data) {
                let response = JSON.parse(data);
                $('#loading').hide();
                $('#container').empty();
                $("#message").html("Uploaded Successfully !!!");

                console.log(response);
                let uploadedImages = [];
                response.data.files.forEach((imageSrc) => {
                    let image = new Image();
                    image.src = "/" + imageSrc;
                    uploadedImages.push(image);
                })

                uploadedImages.forEach((image) => {
                    console.log(image);
                    $("#uploaded-images").append(image);
                })
            },
            error: function () {
                $('#loading').hide();
                $("#message").html("Server not responding. Try again later.");
            }
        });
    }

    $("#file").change(function () {
        IMAGE = false;
        $("#message").empty();
        $("#image-preview").empty();
        let file = this.files[0];
        if (file.size > 10000000) {
            goodImage = false;
            $("#message").html("Image size is too large. It should be less than 10Mb. Try again.");
            return;
        }

        let image = new Image();
        image.file = file;
        image.onload = loadImage;

        let reader = new FileReader();
        reader.onload = loadRender(image);
        reader.readAsDataURL(this.files[0]);
    });

    function loadRender(image) {
        return function (e) {
            image.src = e.target.result;
        }
    };

    function loadImage() {
        let height = this.height;
        let width = this.width;

        if (height != 1024 && width != 1024) {
            $("#message").html("Image dimensions should be 1024 x 1024 only. Choose another image.");
            return;
        }

        let horizontalCanvas = createCanvas(this, 'horizontal-canvas', 755, 450);
        let verticalCanvas = createCanvas(this, 'vertical-canvas', 365, 450);
        let horizontalSmall = createCanvas(this, 'horizontal-small-canvas', 365, 212);
        let gallery = createCanvas(this, 'gallery-canvas', 380, 380);
        $('#image-preview').append(horizontalCanvas);
        $('#image-preview').append(verticalCanvas);
        $('#image-preview').append(horizontalSmall);
        $('#image-preview').append(gallery);
        IMAGE = true;
    }

    function createCanvas(imageRef, id, width, height) {
        let canvas = document.createElement('canvas');
        canvas.height = height;
        canvas.width = width;
        canvas.id = id;
        let ctx = canvas.getContext("2d");
        // ctx.drawImage(imageRef, 0, 0, width * 1.3, height * 1.3, 0, 0, width, height);   //NOT SO STRETCHED IMAGES
        ctx.drawImage(imageRef, 0, 0, width, height);   //STRETCHED IMAGES WITHIN THE CANVAS OF GIVEN DIMENSIONS
        return canvas;
    }
});