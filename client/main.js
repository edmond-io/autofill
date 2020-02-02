$(function () {
    let origin = window.location.origin;
    let socket = io.connect(origin);

    // web socket
    socket.on('log_message', function (obj) {
        // write log to panel
        let clz = obj["class"] === undefined ? null : obj["class"];
        let msg = obj["data"];

        let time = $("<div>").addClass("chip time").text(new Date().toTimeString().split(' ')[0]);
        let span = $("<span>").addClass(clz).html(msg);

        $('#messages').append($('<li>').append(time).append(span));
      if ($('#scroll')[0].checked) {
            window.scrollTo(0, document.body.scrollHeight);
      }

      // enable the submit button
      $('#run').removeAttr('disabled');

    }).on('toast', function (obj) {
        // show toast
        if (!obj || !obj.data)
            return;

        let clz = obj["class"] === undefined || obj["class"] == null ? "" : obj["class"];
        M.toast({
            html: obj.data,
            classes: clz
        });

      // enable the submit button
      $('#run').removeAttr('disabled');
    }).on('preview', function (obj) {
        if (!obj || !obj.data)
            return;

        // let iframe = $("#preview").removeClass("hidden")[0];
        // iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(obj.data);
    });

    // subscribe click action to fill project/activity
    $("#panel").on("click", "a[data-project], a[data-activity]", function () {
        if ($(this).attr("data-project")) {
            $("#project").val($(this).attr("data-project"))[0].focus();
            $("#form").submit();
        }
        if ($(this).attr("data-activity")) {
            $("#activity").val($(this).attr("data-activity"))[0].focus();
            $("#form").submit();
        }
    });

    // set default values
    let date = new Date();
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
        M.Toast.dismissAll();

      $('#run').attr('disabled', 'disabled');

        let data = {};
        let x = $("#password").val();
        data.user = $("#username").val();
        data.project = $("#project").val();
        data.activity = $("#activity").val();
        data.month = $("#month").val();
        data.session = Base64.e(encodeURIComponent(data.user + x));

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
