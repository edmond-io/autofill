$(function () {
    let origin = window.location.origin;
    let socket = io.connect(origin);
    let date = new Date();

    // web socket
    socket.on('log_message', function (obj) {
        let clz = obj["class"] === undefined ? null : obj["class"];
        let msg = obj["data"];

        let time = $("<div>").addClass("chip time").text(date.toTimeString().split(' ')[0]);
        let span = $("<span>").addClass(clz).text(msg);

        $('#messages').append($('<li>').append(time).append(span));
        if ($("#scroll")[0].checked)
            window.scrollTo(0, document.body.scrollHeight);
    });

    // set default values
    let defaultMonth = date.getMonth() + 1;
    if (date.getDate() <= 14)
        defaultMonth = defaultMonth - 1;

    $("#username").val("");
    $("#password").val("");
    $("#project").val("");
    $("#activity").val("");
    $("#month").val(defaultMonth == 0 ? 12 : defaultMonth);

    // form submit event handler
    $("#form").submit(function (e) {
        e.preventDefault();

        let data = {};
        let x = $("#password").val();
        data.user = $("#username").val();
        data.project = $("#project").val();
        data.activity = $("#activity").val();
        data.month = $("#month").val();
        data.session = window.btoa(encodeURIComponent(data.user + x));

        if ($("#password").hasClass("masked")) {
            data.session = x;
        }

        socket.emit("user", data.user);

        $.ajax({
            url: '/run',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (msg) {
                $("#password").val(data.session).addClass("masked");
            }
        });

        $("#messages").empty()
    });

    // get version and change log
    $.getJSON(origin + "/changelog", function (json) {
        if (json["success"]) {
            console.log(json)
            $("#changelog .modal-content").prepend(json.data);
            $("#appVersion").html("v" + json.version);
        }
    });
    $('.modal').modal();
    $('select').formSelect();
});