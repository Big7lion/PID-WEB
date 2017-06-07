var P_slider = $("#P-range").slider({
    'min': -100,
    'max': 100,
    'step': 1,
    'value': 0
});
$("#P-range").on('slideStop', function(slideEvt) {
    P_show_Anim.update(slideEvt.value);
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'P-sync',
            'user_data': slideEvt.value
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送P参数设定", "normal");
    }
});
var I_slider = $("#I-range").slider({
    'min': -100,
    'max': 100,
    'step': 1,
    'value': 0
});
$("#I-range").on('slideStop', function(slideEvt) {
    I_show_Anim.update(slideEvt.value);
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'I-sync',
            'user_data': slideEvt.value
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送I参数设定", "normal");
    }
});
var D_slider = $("#D-range").slider({
    'min': -100,
    'max': 100,
    'step': 1,
    'value': 0
});
$("#D-range").on('slideStop', function(slideEvt) {
    D_show_Anim.update(slideEvt.value);
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'D-sync',
            'user_data': slideEvt.value
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送D参数设定", "normal");
    }
});
var Aim_temp_slider = $("#Aim-temp-range").slider({
    'min': 0,
    'max': 100,
    'step': 0.1,
    'value': 30
});
$("#Aim-temp-range").on('slideStop', function(slideEvt) {
    Aim_temp_Anim.update(slideEvt.value);
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'Aim-temp-sync',
            'user_data': slideEvt.value
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送 目标温度 设定", "normal");
    }
});
var PWM_cyc_slider = $("#PWM-cyc-range").slider({
    'min': 100,
    'max': 5000,
    'step': 100,
    'value': 500
});
$("#PWM-cyc-range").on('slideStop', function(slideEvt) {
    PWM_cyc_show_Anim.update(slideEvt.value);
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'PWM-cyc-sync',
            'user_data': slideEvt.value
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送PWM周期参数设定", "normal");
    }
});
var read_cyc_slider = $("#read-cyc-range").slider({
    'min': 100,
    'max': 2000,
    'step': 100,
    'value': 200
});
$("#read-cyc-range").on('slideStop', function(slideEvt) {
    read_cyc_show_Anim.update(slideEvt.value);
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'read-cyc-sync',
            'user_data': slideEvt.value
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送温度读取周期设定", "normal");
    }
});

$("#Read-PID-btn").on('click', function() {
    $.get("sql_service.php?user_ID=" + ws_user_ID, function(res) {
        get_parese(res);
    });
});

$("#Set-AimTemp-btn").on('click', function() {
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'Set-AimTemp',
            'user_data': 1
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送目标温度设定", "normal");
    }
});

$("#Set-PID-btn").on('click', function() {
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'Set-PID',
            'user_data': 1
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送PID设定", "normal");
    }
});

$("#Set-PIDcyc-btn").on('click', function() {
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'Set-PIDcyc',
            'user_data': 1
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送PWM周期设定", "normal");
    }
});

$("#Set-Readcyc-btn").on('click', function() {
    if (check_connect(1)) {
        var send_object = {
            'user_ID': ws_user_ID,
            'user_command': "setting sync",
            'command_code': 'Set-Readcyc',
            'user_data': 1
        }
        ws.send(JSON.stringify(send_object));
        message.add("已发送读取设定", "normal");
    }
});


var Aim_temp_Anim = new CountUp("Aim-temp-show", 0, 30.0, 1);
Aim_temp_Anim.start();
// Aim_temp_Anim.update(12.8);
var P_show_Anim = new CountUp("P-show", -50, 0);
P_show_Anim.start();
var I_show_Anim = new CountUp("I-show", 100, 0);
I_show_Anim.start();
var D_show_Anim = new CountUp("D-show", 50, 0);
D_show_Anim.start();
var PWM_cyc_show_Anim = new CountUp("PWM-cyc-show", 0, 500);
PWM_cyc_show_Anim.start();
var read_cyc_show_Anim = new CountUp("read-cyc-show", 999, 200);
read_cyc_show_Anim.start();
var alive_temp_show_Anim = new CountUp("alive-temp-show", 0, 10.0, 1);
alive_temp_show_Anim.start();

$("input:radio[name='options']").change(function() {
    var $selectedvalue = $("input[name='options']:checked").attr("id");
    var which_mode;
    var func_code;
    if ($selectedvalue == "option-PWM") {
        which_mode = 'PWM控温';
        func_code = 'option-PWM';
    } else if ($selectedvalue == "option-heat") {
        which_mode = '加热';
        func_code = 'option-heat'
    } else if ($selectedvalue == "option-close") {
        which_mode = '关闭';
        func_code = 'option-close'
    }
    var send_object = {
        'user_ID': ws_user_ID,
        'user_command': "setting sync",
        'command_code': 'option-sync',
        'user_data': func_code
    }
    ws.send(JSON.stringify(send_object));
    message.add("更改为 " + which_mode + " 模式", "normal");
});

var btn_clicked_flag = 0;
$('#DB-set-btn').on('click', function() {
    var clicked_state;
    if (btn_clicked_flag == 0) {
        $(this).removeClass('btn-default');
        $(this).addClass('btn-primary');
        $(this).button('complete');
        btn_clicked_flag = 1;
        clicked_state = "开";
    } else {
        $(this).removeClass('btn-primary');
        $(this).addClass('btn-default');
        $(this).button('reset');
        btn_clicked_flag = 0;
        clicked_state = "关";
    }
    var send_object = {
        'user_ID': ws_user_ID,
        'user_command': "setting sync",
        'command_code': 'DB-sync',
        'user_data': btn_clicked_flag
    }
    ws.send(JSON.stringify(send_object));
    message.add("数据库： " + clicked_state, "normal");
});

var ctxF = document.getElementById("alive-temp-chart").getContext("2d");
var chart_data = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Live Tempetature curve',
            data: [30],
            backgroundColor: 'rgba(49, 176, 273, 0.2)',
            borderColor: 'rgba(38,154,188,1)',
            borderWidth: 1
        }, {
            label: 'Aim Tempetature',
            data: [60],
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderColor: 'rgba(255,64,64,1)',
            borderWidth: 5
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
};
var myChart = new Chart(ctxF, chart_data);