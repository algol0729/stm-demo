/**
 * Created by algol on 2016/6/8.
 */
;(function (NS) {
    NS = NS || {};
    var ext =
    {
        /**
         * @description 语音
         * @param text 要语音的文本值
         * @param volume 音量(0-100)
         * @param fn 回掉函数
         * */
        SpeechText: function(text , volume, fn)
        {
            var args = {text: text, volume: volume};
            fox.device.callDynamicExt("VoiceExts", "SpeechText", args,fn);
        },
        HtmlToImage: function(html, imgWidth, imgHeight, callbackfn)
        {
            var args = {html: html, imgWidth: imgWidth, imgHeight: imgHeight};
            fox.device.callDynamicExt("WebViewExt", "HtmlToImage", args, callbackfn);
        },

        PrintImgBase64: function(imgBase64, top, left, printer, callbackfn)
        {
            var args = {imgBase64 : imgBase64, top : top, left : left, printer : printer};
            fox.device.callDynamicExt("PrintExt", "PrintImgBase64", args, callbackfn);
        },
        PrintBase64toPdf: function(imgBase64, callbackfn,pdfPath)
        {
            var args = {imgBase64 : imgBase64,pdfPath:pdfPath};
            fox.device.callDynamicExt("PrintExt", "base64topdf", args, callbackfn);
        },

        PrintBase64toImg: function(imgBase64,imgPath, callbackfn)
        {
            var args = {imgBase64 : imgBase64,imgPath:imgPath};
            fox.device.callDynamicExt("PrintExt", "base64toimg", args, callbackfn);
        },

        PrintPdf: function(path,landscape,callbackfn)
        {
            var args = {path : path,landscape:landscape};
            fox.device.callDynamicExt("PrintExt", "PrintPDF", args, callbackfn);
        },

        SetLocalValue: function(Section, Key, Value, callbackfn)
        {
            if(typeof(Value)=="object") Value=JSON.stringify(Value);
            var args = {Section : Section, Key : Key, Value : Value};
            fox.device.callDynamicExt("LocalInIExt", "SetValue", args, callbackfn);
        },

        GetLocalValue: function(Section, Key, callbackfn)
        {
            var args = {Section : Section, Key : Key};
            var callback = function(data)
            {
                var value = data.result.value;
                callbackfn(value);
            };
            fox.device.callDynamicExt("LocalInIExt", "GetValue", args, callback);
        },
        GetMac:function(callbackfn)
        {
            var args = {};
            var callback = function(data)
            {
                var value = data.result.msg;
                console.log("mac:"+value);
                callbackfn(value);
            };
            fox.device.callDynamicExt("MacHelperExt","GetMac",args,callback);
        },
        GetIP:function (fn) {

            var callback=function(data){
                console.log(JSON.stringify(data));
                var value = data ;
                fn(value);
            }
            fox.device.callDynamicExt("IPHelperExt","GetIP",{},callback);
        },
        //取最小的文件
        getLastedFile:function(fn){
            var path = "D:\\FSN\\FSNdir\\"+new Date().Format('yyyyMMdd');
            var param = {
                path:path//需要对比文件的目录    返回的东西是一个路径
            }
            console.log('查询最小文件上送路径：'+JSON.stringify(param));
            fox.device.callDynamicExt("XianjinExt", "GetLastedFile", param, fn);
        },
        //callComm:function(action, args, hasCover,coverText, callback) {
        //  var args = {
        //                 address: 'http://14.1.76.22:9191',	//上传地址
        //                 remoteSavePath: 'log/agentLog',		//bips端存放目录，相对bips根目录
        //                 remoteFileName: 'log.zip',	//bips端存放文件名称
        //                 uploadFilePath: 'Logs',		//本地待上传文件名称，支持单个文件和目录打包上传
        //                 localPathFormat:'relative',		//本地路径格式，'relative'—相对外壳路径，’absolute’—绝对路径
        //                 timeOut:60000				//超时时间，以毫秒为单位
        //             };
        uploadLog:function (args,fn,hasCover,coverText) {
            console.log("uploadLog");
            hasCover = false;
            coverText = !!coverText?coverText:"文件上传中";
            var callback=function(data){
                console.log(JSON.stringify(data));
                var value = data ;
                fn&&fn(value);
            }
            fox.device.callComm("upload",args,hasCover,coverText,callback);
        },
        // var args= {
        //     address: 'http://127.0.0.1:9191', //下载地址
        //     remotePath: 'log/Device.log',  //bips端文件路径
        //     localSavePath: 'C:\\BankItWork\\Device.log', //本地保存路径
        //     localPathFormat:'absolute',  //本地路径格式，'relative'—相对外壳路径，’absolute’—绝对路径
        //     timeOut:60000    //超时时间，以毫秒为单位
        // };
        downloadFile:function (args,fn,hasCover,coverText) {
            console.log("downloadFile");
            hasCover = false;
            coverText = !!coverText?coverText:"文件下载中";
            var callback=function(data){
                console.log(JSON.stringify(data));
                var value = data ;
                fn&&fn(value);
            }
            fox.device.callComm("download",args,hasCover,coverText,callback);
        },
        delFile:function(args, callbackfn)
        {
            var args = args?args:{};
            var callback = function(data)
            {
                // var value = data.result.msg;
                console.log("delFile:"+JSON.stringify(data));
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("FileExt","DeleteFile",args,callback);
        },
        //删除文件夹
        delFolder:function(args, callbackfn)
        {
            //{      路径    绝对相对
            //    path: 'Logs/resFile',
            //        absolute: false //是否为绝对路径    false相对   true绝对
            //}
            var args = args?args:{};
            var callback = function(data)
            {
                // var value = data.result.msg;
                console.log("delFolder:"+JSON.stringify(data));
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("FileExt","DeleteFolder",args,callback);
        },
        //文件判空
        IsExists:function(args, callbackfn){
            var args = args?args:{};
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("FileExt","IsExists",args,callback);
        },
        /**
         * 获取压感信息
         * @param fnc
         */
        fileExt:function(args,callbackfn){
            var args = args?args:{};
            var callback = function(data)
            {
                console.log(data);
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("FileExt", "readFile",args,callback);
        },
        //关闭服务
        monitorClose:function(args, callbackfn){
            var args = args?args:{};
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("MonitorAndSystemTime","monitorclose",args,callback);
        },
        //启动服务
        monitorStart:function(args, callbackfn){
            var args = args?args:{};
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("MonitorAndSystemTime","monitorstart",args,callback);
        },
        //设置时间
        setSysTime:function(args, callbackfn){
            var args = args?args:{};
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("MonitorAndSystemTime","setSysTime",args,callback);
        },
        //------------------------------社保卡模块---------------------------//
        /**
         * 进卡 异步
         * @param args
         * @param callbackfn
         */
        startCard:function(ip, callbackfn){
            var args = {
                strip:ip,
                HopperSelection:1,
                PrintRibbon:0,
                EmbossSupplies:0
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","startCard",args,callback);
        },
        /**
         * 获得耗材状态
         * @param args
         * @param callbackfn
         */
        getConsumeStatus:function(ip, callbackfn){
            var args = {
                strip:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","GetConsumablesStatus",args,callback);
        },
        /**
         *  进栈  异步
         * @param args
         * @param callbackfn
         */
        parkSmartCard:function(strip, callbackfn){
            var args = {
                strip:strip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","parkSmartCard",args,callback);
        },
        /**
         * 二次读卡进栈
         * @param strip
         * @param callbackfn
         */
        parkSmartCard2:function(strip, callbackfn){
            var args = {
                strip:strip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","parkSmartCard2",args,callback);
        },

        /**
         * 上电
         * @param args  strip ： 制卡机IP  contactFlag  true -接触式
         * @param callbackfn
         * @constructor
         */
        SCardRese:function(ip, callbackfn){
            var args = {
                strip:ip,
                contactFlag:true
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","SCardRese",args,callback);
        },
        SCardTransmit:function(args, callbackfn){
            var args = args?args:{};
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","SCardTransmit",args,callback);
        },
        /**
         * 下电
         * @param args
         * @param callbackfn
         * @constructor
         */
        SCardDisconnect:function(ip, callbackfn){
            var args = {
                strip:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","SCardDisconnect",args,callback);
        },
        /**
         * 出栈  异步
         * @param args
         * @param callbackfn
         * @constructor
         */
        UnParkSmartCard:function(ip, callbackfn){
            var args = {
                strip:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","UnParkSmartCard",args,callback);
        },
        /**
         * 预打印  打印图片之前调用
          * @param args
         * @param callbackfn
         * @constructor
         */
        PrePrint:function(callbackfn){

            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","PrePrint",{},callback);
        },
        /**
         * 预打印  打印之文字前调用
         * @param args
         * @param callbackfn
         * @constructor
         */
        PrePrintM:function(callbackfn){

            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","PrePrintM",{},callback);
        },
        /**
         * 打印图片
         * @param islast：后面是否还有打印项，即除了PostPrint前最后一项图片或文字需要传入false，其余传true
         X：打印照片的左上角X轴，单位为毫米
         Y：打印照片的左上角Y轴，单位为毫米
         Weight：打印照片的宽度，单位为像素
         Height：打印照片的高度，单位为像素
         Rotate：旋转角度 如30，90，180   图片180
         Path：照片的路径
         * @param callbackfn
         * @constructor
         */
        PrintImage:function(Path, callbackfn){
            var args = {
                path:Path
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","PrintImage",args,callback);
        },
        /**
         * 打印文本
         * @param X：打印文字的左上角X轴，单位为毫米
         Y：打印文字的左上角Y轴，单位为毫米
         Fontname：使用的字体名称
         Size：字号大小
         Attribute：文字属性
         Color：文字颜色（使用标准的Web颜色代码）
         Text：需要打印的文本
         TransBkColor：背景色
         Rotate：旋转方式，取值0-7。参数含义：RotateNoneFlipNone = 0, Rotate90FlipNone  = 1, Rotate180FlipNone = 2, Rotate270FlipNone = 3, RotateNoneFlipX = 4, Rotate90FlipX = 5, Rotate180FlipX = 6, Rotate270FlipX = 7
         iwidth：打印文本的宽度，以像素为单位，如果是0则是默认宽度
         islast：后面是否还有打印项，即除了PostPrint前最后一项图片或文字需要传入false，其余传true

         * @param callbackfn
         * @constructor
         */
        PrintText:function(obj, callbackfn){
            var args = {
                x:obj.X,
                y:obj.Y,
                Fontname:obj.Fontname,
                text:obj.Text,
                islast:obj.islast
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","PrintText",args,callback);
        },
        /**
         * 提交打印任务，数据提交完成后打印  异步
         * @param args
         * @param callbackfn
         * @constructor
         */
        PostPrint:function(callbackfn){
            var args = {};
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","PostPrint",args,callback);
        },
        /**
         * 出卡   异步
         * @param args
         * @param callbackfn
         * @constructor
         */
        EndJob:function(callbackfn){
            var args ={};
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","EndJob",args,callback);
        },
        /**
         * 吞卡
         * @param args
         * @param callbackfn
         * @constructor
         */
        CancelJob:function(ip, callbackfn){
            var args = {
                strip:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","CancelJob",args,callback);
        },
        /**
         * 获取设备序列号
         * @param args
         * @param callbackfn
         * @constructor
         */
        GetSerialNumber:function(ip, callbackfn){
            var args = {
                strip:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","GetSerialNumber",args,callback);
        },
        /**
         * 获取设备状态
         * @param args
         * @param callbackfn
         * @constructor
         */
        GetPrinterStatus:function(ip, callbackfn){
            var args = {
                strip:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","GetPrinterStatus",args,callback);
        },
        /**
         * 获取设备活动状态
         * @param args
         * @param callbackfn
         * @constructor
         */
        GetActionState:function(ip, callbackfn){
            var args = {
                strip:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","GetActionState",args,callback);
        },
        /**
         * 控制设备重启/关机
         * @param action 1 重启 3 关机
         * @param callbackfn
         * @constructor
         */
        SetPowerState:function(obj, callbackfn){
            var args = {
                strip:obj.ip,
                action:obj.action
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","SetPowerState",args,callback);
        },
        /**
         * 社保卡写卡
         * @param printerIP:制卡机IP地址
         pData: IC个人化数据
         dataLen:个人化数据的长度

         * @param callbackfn
         * @constructor
         */
        ProcessSmartCard:function(obj, callbackfn){
            var args = {
                strip:obj.ip,
                pData:obj.pData,
                dataLen:obj.dataLen
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","ProcessSmartCard",args,callback);
        },
        /**
         * 社保IC卡读卡
         * @param obj
         * @param callbackfn
         */
        cardRead:function(ip, callbackfn){
            var args = {
                strip:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","cardRead",args,callback);
        },
        /**
         * 社保IC卡写卡
         * @param obj
         * @param callbackfn
         */
        cardWrite:function(ip,callbackfn){
            var args = {
                cardWriteData:ip
            };
            var callback = function(data)
            {
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("SocialSecurityCardDispenser","cardWrite",args,callback);
        },
        //-------------------------------------------社保卡模块------------------------------------//
        /**
         *复制冠字号ini文件
         * @param fnc
         */
        copyFile:function(args,callbackfn){
            var args = args?args:{
                oldPath:'',//原存储文件路径   C:/FSN/FSNInfo
                dirPath:'',//新存放路径       D:/CopyFSN/日期
                fileName:'',//存放文件名字    /流水号
            };
            var callback = function(data)
            {
                console.log(data);
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("FileExt", "copyFile",args,callback);
        },
        /**
         * 读取冠字号ini文件
         * @param fnc
         */
        readIniFile:function(args,callbackfn){
            var args = args?args:{
                fileName:'',//存放文件名字 就是流水号
                dirPath:'D:\\CopyFSN\\'+new Date().format('yyyyMMdd'),//路径
                flag:'',//0 只读流水号文件  1只读取消存款取消文件   2流水号文件+取消文件
            };
            if(args.flag == '1'){
                args.fileName = args.fileName+'cancel.ini';
            }else if(args.flag == '0'){
                args.fileName = args.fileName+'.ini';
            }
            var callback = function(data)
            {
                console.log(data);
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("FileExt", "readIniFile",args,callback);
        },
        // var args= {
        //     address: 'http://127.0.0.1:9191', //下载地址
        //     remotePath: 'log/Device.log',  //bips端文件路径
        //     localSavePath: 'C:\\BankItWork\\Device.log', //本地保存路径
        //     localPathFormat:'absolute',  //本地路径格式，'relative'—相对外壳路径，’absolute’—绝对路径
        //     timeOut:60000    //超时时间，以毫秒为单位
        // };
        /**
         * 服务器文件下载
         * @param args
         * @param fn
         * @param hasCover
         * @param coverText
         */
        downloadFileSys:function (args,fn,hasCover,coverText) {
            console.log("downloadSys");
            hasCover = false;
            coverText = !!coverText?coverText:"文件下载中";
            var callback=function(data){
                console.log("文件下载返回:"+JSON.stringify(data));
                var value = data;
                fn&&fn(value);
            }
            fox.device.callCommSys("download",args,hasCover,coverText,callback);
        },
        /**
         AUTHOR:wbyf615
         DATE:2020/10/12
         TIME:9:14
         ID:灰度发布
         STEP:start
         **/
        //  获取壳子路径
        getShellConfigInfo:function(callbackfn){
            var args = {

            };
            console.log('获取壳子信息上传数据：'+JSON.stringify(args));
            var callback = function(data)
            {
                console.log('获取壳子信息返回数据：'+JSON.stringify(data));
                callbackfn&&callbackfn(data);
            };
            fox.device.callDynamicExt("ShellConfigInfo", "getShellConfigWebId",args,callback);
        }
        /**
         AUTHOR:wbyf615
         DATE:2020/10/12
         TIME:9:16
         ID:灰度发布
         STEP:end
         **/
    };
    NS.ext = ext;
})(window.STM);