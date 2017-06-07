<?php

//引入MeepoPS
require_once 'MeepoPS/index.php';

//使用文本协议传输的Api类
$webSocket = new \MeepoPS\Api\Websocket('0.0.0.0', '19910');

//启动的子进程数量. 通常为CPU核心数
$webSocket->childProcessCount = 1;

//设置MeepoPS实例名称
$webSocket->instanceName = 'MeepoPS-webSocket';

//设置回调函数 - 这是所有应用的业务代码入口
$webSocket->callbackStartInstance = 'callbackStartInstance';
$webSocket->callbackConnect = 'callbackConnect';
$webSocket->callbackNewData = 'callbackNewData';
$webSocket->callbackSendBufferEmpty = 'callbackSendBufferEmpty';
$webSocket->callbackInstanceStop = 'callbackInstanceStop';
$webSocket->callbackWSDisconnect = 'clientListClose';

//启动MeepoPS
\MeepoPS\runMeepoPS();

// 初始化一个存储对象
class platform_store_modal{
    var $user_ID;
    var $user_num;
    var $user_store = array();
}

class List_store_modal{
    var $list_ID;
    var $list_num;
    var $list_platform = array();
    var $list_logintime = array();
}

class client_store_modal{
    var $client_store;
    var $user_platform;
    var $user_logintime;
}

class command_modal{
    var $user_ID;
    var $user_command;
    var $user_data;
}

$store_arr = array();


//以下为回调函数, 业务相关.
function callbackStartInstance($instance)
{
    echo $instance->instanceName . '成功启动' . "\n";
}

function callbackConnect($connect)
{
    var_dump('收到新链接. UniqueId=' . $connect->id . "\n");
}

function callbackNewData($connect, $data)
{
    global $store_arr;
    //$connect->send($data);
    $jack_json = json_decode($data);
    var_dump('UniqueId= ' . $connect->id ."\n");
    $func_return_code = check_ID_exit($jack_json->user_ID);
    /*登录的数据存储*/
    if($jack_json->user_command == "Login In"){
        if($func_return_code!=-1){
            $store_arr[$func_return_code]->user_store[] = new client_store_modal();
            $store_arr[$func_return_code]->user_num = sizeof($store_arr[$func_return_code]->user_store);
            $store_arr[$func_return_code]->user_store[$store_arr[$func_return_code]->user_num-1]->client_store = $connect;
            $store_arr[$func_return_code]->user_store[$store_arr[$func_return_code]->user_num-1]->user_platform = $jack_json->user_platform;
            $store_arr[$func_return_code]->user_store[$store_arr[$func_return_code]->user_num-1]->user_logintime = date("Y/m/d  H:i:s");
        }
        else
        {
            $cooks = new platform_store_modal();
            $cooks->user_store[] = new client_store_modal();
            $cooks->user_num = sizeof($cooks->user_store);
            $cooks->user_ID = $jack_json->user_ID;
            $cooks->user_store[$cooks->user_num-1]->client_store = $connect;
            $cooks->user_store[$cooks->user_num-1]->user_platform = $jack_json->user_platform;
            $cooks->user_store[$cooks->user_num-1]->user_logintime = date("Y/m/d  H:i:s");
            $store_arr[]=$cooks;
        }
    }

    /*用户列表获取*/
    elseif($jack_json->user_command == "List fresh")
    {
        $origin_size = sizeof($store_arr);
        if($origin_size!=0){
            $list_soul = array();
            $cnt = 0;
            for(;$cnt<$origin_size;$cnt++)
            {
                $list_soul[] = new List_store_modal();
                $list_soul[$cnt]->list_ID = $store_arr[$cnt]->user_ID;
                $list_soul[$cnt]->list_num = $store_arr[$cnt]->user_num;
                $cnt2 = 0;
                for(;$cnt2<$list_soul[$cnt]->list_num;$cnt2++)
                {
                    $list_soul[$cnt]->list_platform[] = $store_arr[$cnt]->user_store[$cnt2]->user_platform;
                    $list_soul[$cnt]->list_logintime[] = $store_arr[$cnt]->user_store[$cnt2]->user_logintime;
                }
            }
            $list_mate = new class{};
            $list_mate->user_command = "List fresh";
            $list_mate->list_store = array();
            $list_mate->list_store = $list_soul;
            $connect->send(json_encode($list_mate));
        }else{
            $list_soul = new class{};
            $list_soul->user_command = "List fresh";
            $list_soul->user_num = 0;
            $connect->send(json_encode($list_soul));
        }
        // var_dump($list_soul);
    }

    /*数据处理转播*/
    elseif($jack_json->user_command == "setting sync")
    {
        foreach($connect->instance->clientList as $client){
            //同步扔，收到啥客户端处理
            if($connect->id != $client->id){
                $client->send($data);
            }
        }
    }

}

function callbackSendBufferEmpty($connect)
{
    var_dump('用户' . $connect->id . "的待发送队列已经为空\n");
}

function callbackInstanceStop($instance)
{
    $jack_send = new command_modal();
    $jack_send->user_command = "servser stop";
    foreach($connect->instance->clientList as $client){
        $client->send(json_encode($jack_send));
    }
}

function clientListClose($connect)
{
    global $store_arr;
    var_dump('UniqueId=' . $connect->id . '断开了' . "\n");
    $cnt=0;
    /*遍历查找断开的端口是哪个*/
    for(;$cnt<sizeof($store_arr);$cnt++)
    {
        $cnt2 = 0;
        for(;$cnt2<sizeof($store_arr[$cnt]->user_store);$cnt2++)
        {
            if($store_arr[$cnt]->user_store[$cnt2]->client_store->id == $connect->id)
            {
                array_splice($store_arr[$cnt]->user_store,$cnt2,1);
                $store_arr[$cnt]->user_num = sizeof($store_arr[$cnt]->user_store);
            }
        }
        /*该ID为空则清除该ID内容*/
        if(sizeof($store_arr[$cnt]->user_store) == 0)
        {
            array_splice($store_arr,$cnt,1);
        }
    }
    // var_dump($store_arr);
}


/*检查该ID是否存在*/
function check_ID_exit($ID){
    global $store_arr;
    $cnt = 0;
    for(;$cnt<sizeof($store_arr);$cnt++)
    {
        if($ID == $store_arr[$cnt]->user_ID)
            return $cnt;
    }
    return -1;
}