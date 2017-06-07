/*链接启动入口*/
var ws;
var ws_user_ID;
$('#WS-Connect').on('click', function(e) {
    e.preventDefault();
    list_connect_flag = 0;
    /*输入空值判断*/
    if ($("#WS-UserId").val().replace(/(^\s*)|(\s*$)/g, '') == (null || '')) {
        $("#WS-UserId").val('');
        ws_user_ID = "";
        message.add("请输入您的用户ID！", "error");
        return 0;
    }
    $('#setupModal').modal('hide');
    var host = $("#WS-Host-name").val();
    var port = $("#WS-Host-port").val();
    if (host == '') {
        host = 'big7lion.win';
    } else {
        host = host;
    }
    if (port == '') {
        port = "19910";
    }

    /*初始登录对象信息*/
    var id_init_obj = {
        'user_ID': $("#WS-UserId").val().replace(/(^\s*)|(\s*$)/g, ''),
        'user_command': "Login In",
        'user_platform': GetBrowswrInfo()
    };

    /*获取浏览器版本信息*/
    function GetBrowswrInfo() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        var m = ua.match(re);
        Sys.browser = m[1].replace(/version/, "safari");
        Sys.ver = m[2];
        return Sys.browser + ":" + Sys.ver;
    }

    console.log(JSON.stringify(id_init_obj));
    /*初始化链接*/
    if (ws != null) {
        ws.close();
    }
    delete ws;
    ws = new ReconnectingWebSocket("ws://" + host + ":" + port);
    ws.maxReconnectAttempts = 5;
    ws_user_ID = $("#WS-UserId").val().replace(/(^\s*)|(\s*$)/g, '');
    ws.onopen = function() {
        ws.send(JSON.stringify(id_init_obj));
        message.add("成功连接服务器！ 开始同步...", "success");
        $.get("sql_service.php?user_ID=" + ws_user_ID, function(res) {
            get_parese(res);
        });
    };

    ws.onerror = function() {
        message.add("服务器链接中断！请检查网络或联系管理员～", "warning");
    }

    /*解析信息*/
    ws.onmessage = function(e) {
        //解析json
        var response = JSON.parse(e.data);
        console.log(response);
        //判断服务端返回值
        list_refresh(response);
        if (response.user_ID == ws_user_ID) {
            sync_refresh(response);
        }
    };
});
/*！链接启动入口！*/

function get_parese(res) {
    res = JSON.parse(res);
    // console.log(res);
    if (res == null) {
        message.add("暂无已存参数", "error");
        return;
    }
    if (res[0][0] == ws_user_ID) {
        P_show_Anim.update(res[0][1]);
        P_slider.slider('setValue', res[0][1]);
        I_show_Anim.update(res[0][2]);
        I_slider.slider('setValue', res[0][2]);
        D_show_Anim.update(res[0][3]);
        D_slider.slider('setValue', res[0][3]);
        var aim_temp_store = parseFloat(res[0][4]) / 10;
        aim_temp_store = aim_temp_store.toFixed(1);
        Aim_temp_Anim.update(aim_temp_store);
        Aim_temp_slider.slider('setValue', aim_temp_store);
        PWM_cyc_show_Anim.update(res[0][5]);
        PWM_cyc_slider.slider('setValue', res[0][5]);
        read_cyc_show_Anim.update(res[0][6]);
        read_cyc_slider.slider('setValue', res[0][6]);
        if (res[0][7]) {
            $("#DB-set-btn").addClass('btn-primary');
            $("#DB-set-btn").button('complete');
        } else {
            $("#DB-set-btn").addClass('btn-default');
            $("#DB-set-btn").button('reset');
        }
        btn_clicked_flag = res[0][7];
        $("input:radio[name='options']").parent('label').removeClass('active');
        if (res[0][8] == "option-close") {
            $("#option-close").prop('checked', 'checked').parent('label').addClass('active');
        } else if (res[0][8] == "option-heat") {
            $("#option-heat").prop('checked', 'checked').parent('label').addClass('active');
        } else if (res[0][8] == "option-PWM") {
            $("#option-PWM").prop('checked', 'checked').parent('label').addClass('active');
        }
    }
    message.add("数据同步更新成功", "success");
}

/*用户名选取*/
$("body").on('click', 'td', function(e) {
    var state = $(e.target).parent().children("td").eq(0).text(); /*.children("td").eq(2).text();*/
    $("#WS-UserId").val('');
    $("#WS-UserId").val(state);
    ws_user_ID = state;
    $('#ListModal').modal('hide');
    setTimeout(function() {
        $('#setupModal').modal({
            keyboard: true
        });
    }, 300);
});

$("#List-fresh").click(function() {
    var apply_command = {
        'user_command': 'List fresh'
    };
    ws.send(JSON.stringify(apply_command));
});

$("#List-cancel").click(function() {
    $('#ListModal').modal('hide');
    setTimeout(function() {
        $('#setupModal').modal({
            keyboard: true
        });
    }, 300);
});

/*断开测试链*/
$("#ListModal").on('hide.bs.modal', function() {
    if (list_connect_flag) {
        list_connect_flag = 0;
        ws.close();
        delete ws;
        ws = null;
    }
})

/*表格添加函数*/
function List_add(cnt, ID, platform, time) {
    var state_tr = $("<tr></tr>");
    var state_th = $("<th scope=\"row\"></th>");
    var state_td = "<td>" + ID + "</td>";
    state_td += "<td>" + platform + "</td>";
    state_td += "<td>" + time + "</td>";
    state_tr.append(state_th.append(cnt));
    state_tr.append(state_td);
    $("#List-tbody").append(state_tr);
    return "success";
}

/*根据是否为测试链接来进行获取命令*/
var list_connect_flag = 0;
$("#ListOutAliveCilent_btn").click(function() {
    var apply_command = {
        'user_command': 'List fresh'
    };
    var host = $("#WS-Host-name").val();
    var port = $("#WS-Host-port").val();
    if (host == '') {
        host = 'big7lion.win';
    } else {
        host = host;
    }
    if (port == '') {
        port = "19910";
    }
    if (ws == null) {
        list_connect_flag = 1;
        ws = new ReconnectingWebSocket("ws://" + host + ":" + port);
        ws.maxReconnectAttempts = 5;
        ws_user_ID = "";
        ws.onopen = function() {
            ws.send(JSON.stringify(apply_command));
        };
        ws.onerror = function() {
            message.add("无法获取客户端列表！请检查网络或联系管理员～", "warning");
        }
        ws.onmessage = function(e) {
            //解析json
            var response = JSON.parse(e.data);
            console.log(response);
            //判断服务端返回值
            list_refresh(response);
        }
    };
})

function list_refresh(data) {
    if (data.user_command === "List fresh") {
        $("#List-tbody").children().remove();
        if (data.user_num === 0) {
            List_add('null', '', '', '');
            message.add("当前无在线客户端，请打开桌面端或手动输入新ID", "error");
            return;
        }
        var cnt = 1;
        var ID_cnt = 0;
        var client_cnt = 0;
        for (; ID_cnt < data.list_store.length; ID_cnt++) {
            for (client_cnt = 0; client_cnt < data.list_store[ID_cnt].list_num; client_cnt++) {
                List_add(cnt, data.list_store[ID_cnt].list_ID, data.list_store[ID_cnt].list_platform[client_cnt], data.list_store[ID_cnt].list_logintime[client_cnt]);
                cnt++;
            }
        }
    }
}

function sync_refresh(data) {
    if (data.user_command == "setting sync") {
        switch (data.command_code) {
            case "P-sync":
                {
                    P_show_Anim.update(data.user_data);
                    P_slider.slider('setValue', data.user_data);
                    break;
                }
            case "I-sync":
                {
                    I_show_Anim.update(data.user_data);
                    I_slider.slider('setValue', data.user_data);
                    break;
                }
            case "D-sync":
                {
                    D_show_Anim.update(data.user_data);
                    D_slider.slider('setValue', data.user_data);
                    break;
                }
            case "Aim-temp-sync":
                {
                    Aim_temp_Anim.update(data.user_data);
                    Aim_temp_slider.slider('setValue', data.user_data);
                    break;
                }
            case "PWM-cyc-sync":
                {
                    PWM_cyc_show_Anim.update(data.user_data);
                    PWM_cyc_slider.slider('setValue', data.user_data);
                    break;
                }
            case "read-cyc-sync":
                {
                    read_cyc_show_Anim.update(data.user_data);
                    read_cyc_slider.slider('setValue', data.user_data);
                    break;
                }
            case "alive-temp":
                {
                    var ChartDisLength = 20;
                    myChart.data.datasets[0].data.push(parseFloat(data.user_data) / 10);
                    myChart.data.datasets[1].data.push($("#Aim-temp-range").val());
                    var date_time = new Date();
                    myChart.data.labels.push(date_time.getHours() + ':' + date_time.getMinutes() + ':' +
                        date_time.getSeconds());
                    if (myChart.data.datasets[0].data.length > ChartDisLength) {
                        myChart.data.datasets[0].data = myChart.data.datasets[0].data.slice(-ChartDisLength);
                        myChart.data.datasets[1].data = myChart.data.datasets[1].data.slice(-ChartDisLength);
                        myChart.data.labels = myChart.data.labels.slice(-ChartDisLength);
                    }
                    myChart.update();
                    alive_temp_show_Anim.update(parseFloat(data.user_data) / 10);
                    break;
                }
            case "option-sync":
                {
                    $("input:radio[name='options']").parent('label').removeClass('active');
                    if (data.user_data == "option-close") {
                        $("#option-close").prop('checked', 'checked').parent('label').addClass('active');
                    } else if (data.user_data == "option-heat") {
                        $("#option-heat").prop('checked', 'checked').parent('label').addClass('active');
                    } else if (data.user_data == "option-PWM") {
                        $("#option-PWM").prop('checked', 'checked').parent('label').addClass('active');
                    }
                    break;
                }
            case "DB-sync":
                {
                    $("#DB-set-btn").removeClass('btn-default btn-primary');
                    if (data.user_data) {
                        $("#DB-set-btn").addClass('btn-primary');
                        $("#DB-set-btn").button('complete');
                    } else {
                        $("#DB-set-btn").addClass('btn-default');
                        $("#DB-set-btn").button('reset');
                    }
                    btn_clicked_flag = data.user_data;
                    break;
                }
        }
    }
}

function check_connect(message_flag) {
    if (ws == null) {
        if (message_flag) {
            message.add("尚未连接到服务器～", "error");
        }
        return false;
    } else
        return true;
}
