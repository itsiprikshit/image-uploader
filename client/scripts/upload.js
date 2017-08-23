$(document).ready(function (e) {
    var goodImage = false;
    var thumbnail = null;
    $("#uploadimage").on('submit', (function (e) {
        e.preventDefault();
        $("#message").empty();
        $('#loading').show();
        var formData = new FormData(this);
        if (goodImage) {
            $.ajax({
                url: "http://localhost:8012/upload/images",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
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
        image.classList.add("obj");
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

        this.height = 200;
        this.width = 200;
        $('#image_preview').append(this);
        thumbnail = this;
        goodImage = true;
    }

    function createMultipleImages(image) {
        var myImage = new Image(365, 212);
        myImage.src = image.src;
        thumbnail = myImage;
        document.body.appendChild(myImage);
    }
});