$(document).ready(function () {
    $('.submit').click(function () {
        $('#form').submit();
    });
    var x = 1;
    $(".add-form").click(function () {
        x++;
        var append = '' +
            '<div class="w3-container w3-light-grey item first-form">' +
            '<div class="w3-container">' +
            '<p>' + x + '.</p>' +
            '</div>' +
            '<p class="file-upload">' +
            '<input class="w3-input" type="file" class="browse" name="file[]" onchange="" />' +
            '</p>' +
            '<p>' +
            '<input class="w3-input" type="text" name="name[]" placeholder="Name">' +
            '</p>' +
            '<textarea maxlength="150" class="w3-input" type="text" name="desc[]" placeholder="Description"></textarea>';

        $(".main-form").append(append);

    });
});