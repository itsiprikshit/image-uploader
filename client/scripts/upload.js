$(document).ready(function (e) {
    $("#uploadimage").on('submit', (function (e) {
        e.preventDefault();
        $("#message").empty();
        $('#loading').show();
        console.log(this);
        $.ajax({
            url: "http://localhost:8012/upload/images",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                $('#loading').hide();
                $("#message").html("Uploaded Successfully.");
            }
        });
    }));

    $("#file").change(function () {
        var file = this.files[0];
        var imagefile = file.type;

        var reader = new FileReader();
        reader.onload = imageIsLoaded;
        reader.readAsDataURL(this.files[0]);
    });

    function imageIsLoaded(e) {
        $('#image_preview').css("display", "block");
        $('#previewing').attr('src', e.target.result);
        $('#previewing').attr('width', 250);
        $('#previewing').attr('height', 250);
    };
});