$(document).ready(function (e) {
    var goodImage = false;

    $("#uploadimage").on('submit', (function (e) {
        e.preventDefault();
        $("#message").empty();
        $('#loading').show();

        var inputFile = $('#file')[0].files[0];
        var mimeType = inputFile.type;

        var formData = new FormData();

        var canvas = $('#canvas').get(0);
        var dataURI = canvas.toDataURL(mimeType, 1.0);

        var image_blob = (function () {
            /* Convert base64 url to binary data */
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }

            return new Blob([new Uint8Array(array)], { name: 'priskhit', type: mimeType });
        })();

        formData.append('images', inputFile);
        formData.append('images', image_blob);

        if (goodImage) {
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
                    var response = JSON.parse(JSON.stringify(data));
                    $('#loading').hide();
                    $("#message").html("Uploaded Successfully.");
                },
                error: function () {
                    $('#loading').hide();
                    $("#message").html("Server not responding. Try again later.");
                }
            });
        } else {
            $('#loading').hide();
            $("#message").html("Cannot upload the image. Try again.");
        }
    }));

    $("#file").change(function () {
        $("#message").empty();
        var file = this.files[0];
        if (file.size > 10000000) {
            goodImage = false;
            $("#message").html("Cannot upload the image. Try again.");
            return;
        }

        var image = new Image();
        image.file = file;
        image.onload = loadImage;

        var reader = new FileReader();
        reader.onload = loadRender(image);
        reader.readAsDataURL(this.files[0]);
    });

    function loadRender(image) {
        return function (e) {
            image.src = e.target.result;
        }
    };

    function loadImage() {
        var height = this.height;
        var width = this.width;

        if (height != 1024 && width != 1024) {
            $("#message").html("Image dimensions should be 1024 x 1024 only. Choose another image.");
            return;
        }

        var canvas = $("#canvas").get(0);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, 200, 200);
        $('#image_preview').append(canvas);
        goodImage = true;
    }
});