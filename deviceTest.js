var _that = this;
var vm = new Vue({
    el: "#deviceTest",
    data: {
        FL1: "",
        FL2: "",
        suilifht: "",
        suiiStatus: "",
        suilType: "",
        suilifhts: [{
            value: "0",
            label: "身份证"
        }, {
            value: "1",
            label: "电动磁卡读卡器"
        }, {
            value: "2",
            label: "凭条"
        }, {
            value: "3",
            label: "Ukey"
        }, {
            value: "4",
            label: "密码键盘"
        }, {
            value: "5",
            label: "存折打印机"
        }, {
            value: "6",
            label: "指纹指示灯"
        }, {
            value: "7",
            label: "激光打印机指示灯"
        }, {
            value: "8",
            label: "非接"
        }, {
            value: "9",
            label: "票据扫描"
        }, {
            value: "10",
            label: "票据发售"
        }],
        suiiStatuss: [{
            value: "0",
            label: "关灯"
        }, {
            value: "1",
            label: "慢闪"
        }, {
            value: "2",
            label: "中闪"
        }, {
            value: "3",
            label: "快闪"
        }, {
            value: "4",
            label: "常亮"
        }],
        ukeyNum: "",
        doubleNum: "",
        doubleNums: [{
            value: "1",
            label: "1打开"
        }, {
            value: "2",
            label: "2暂停"
        }, {
            value: "3",
            label: "3继续"
        }, {
            value: "4",
            label: "4销毁"
        }],

    },
    methods: {
        FAopen: function () {
            console.log('发卡打开设备');
            STM.device.openCardDispenser(function (data) {
                console.log('发卡打开设备返回：' + JSON.stringify(data));
            })
        },
        FAreset: function () {
            console.log('发卡重置设备');
            STM.device.resetDispenser(function (data) {
                console.log('发卡重置设备返回：' + JSON.stringify(data));
            })
        },
        FAgetStatus: function () {
            console.log('发卡获取设备状态');
            STM.device.getDeviceStatusByCardDispenser(function (data) {
                console.log('发卡获取设备状态返回：' + JSON.stringify(data));
            })
        },
        FAdispenseCard: function () {
            console.log('发卡发卡');
            // 卡箱号1 或2，
            STM.device.dispenseCard(1, function (data) {
                console.log('发卡发卡返回：' + JSON.stringify(data));
            })
        },
        FAtunka: function () {
            console.log('发卡吞卡');
            // 卡箱号1 或2，
            STM.device.retainCardDispenser(function (data) {
                console.log('发卡吞卡返回：' + JSON.stringify(data));
            })
        },
        FAtuka: function () {
            console.log('发卡吐卡');
            STM.device.ejectCardDispenser(function (data) {
                console.log('发卡吐卡返回：' + JSON.stringify(data));
            })
        },
        FAsetnum: function () {
            console.log('发卡设置卡箱数量');
            STM.device.ejectCardDispenser(1, 20, function (data) {
                console.log('发卡设置卡箱数量返回：' + JSON.stringify(data));
            })
        },
        FAgetXxinx: function () {
            console.log('发卡获取卡箱信息');
            STM.device.GetCardUnitInfoByCardDispenser(function (data) {
                console.log('发卡获取卡箱信息返回：' + JSON.stringify(data));
            })
        },
        FAisCardfunction() {
            console.log('发卡获取卡箱信息');
            STM.device.GetCardUnitInfoByCardDispenser(function (data) {
                console.log('发卡获取卡箱信息返回：' + JSON.stringify(data));
            })
        },
        FAisCard: function () {
            console.log('发卡机获取卡的位置(卡口)');
            STM.device.GetCardPosition(function (data) {
                console.log('发卡机获取卡的位置(卡口)返回：' + JSON.stringify(data));
            })
        },
        DUopen: function () {
            console.log('读卡器打开设备');
            STM.device.openCardReader(function (data) {
                console.log('读卡器打开设备返回：' + JSON.stringify(data));
            })
        },
        DUresetfunction: function () {
            console.log('读卡器复位设备');
            STM.device.resetCardReader(function (data) {
                console.log('读卡器复位设备返回：' + JSON.stringify(data));
            })
        },
        DUStutas: function () {
            console.log('读卡器获取设备状态');
            STM.device.getDeviceStatusByCardReader(function (data) {
                console.log('读卡器获取设备状态返回：' + JSON.stringify(data));
            })
        },
        DUreadCard: function () {
            console.log('读卡器读卡');
            STM.device.readCardReader(function (data) {
                console.log('读卡器读卡返回：' + JSON.stringify(data));
            })
        },
        DUgetARQC: function () {
            console.log('读卡器获取ARQC');
            STM.device.GetARQC(function (data) {
                console.log('读卡器获取ARQC返回：' + JSON.stringify(data));
            })
        },
        DUejectCardReader: function () {
            console.log('读卡器退卡');
            STM.device.ejectCardReader(function (data) {
                console.log('读卡器退卡返回：' + JSON.stringify(data));
            })
        },
        DURetainCardReader: function () {
            console.log('读卡器吞卡');
            STM.device.RetainCardReader(function (data) {
                console.log('读卡器吞卡返回：' + JSON.stringify(data));
            })
        },
        DUcancle: function () {
            console.log('读卡器取消');
            STM.device.cancelInsertCardReader(function (data) {
                console.log('读卡器取消返回：' + JSON.stringify(data));
            })
        },
        DUweizhi: function () {
            console.log('读卡器卡口情况');
            STM.device.GetCardPositionByCardReader(function (data) {
                console.log('读卡器卡口情况返回：' + JSON.stringify(data));
            })
        },
        SHopen: function () {
            console.log('身份证打卡设备');
            STM.device.openIdentifyCard(function (data) {
                console.log('身份证打卡设备返回：' + JSON.stringify(data));
            })
        },
        SHreset: function () {
            console.log('身份证复位设备');
            STM.device.resetIdentifyCard(function (data) {
                console.log('身份证复位设备返回：' + JSON.stringify(data));
            })
        },
        SHread: function () {
            console.log('身份证读卡');
            STM.device.readIDCard(function (data) {
                console.log('身份证读卡返回：' + JSON.stringify(data));
            })
        },
        SHtui: function () {
            console.log('身份证退卡');
            STM.device.ejectIdentifyCard(function (data) {
                console.log('身份证退卡返回：' + JSON.stringify(data));
            })
        },
        SHweiz: function () {
            console.log('身份证位置');
            STM.device.getIdentifyCardPosition(function (data) {
                console.log('身份证位置返回：' + JSON.stringify(data));
            })
        },
        SHStatus: function () {
            console.log('身份证设备状态');
            STM.device.getIdentifyCardStatus(function (data) {
                console.log('身份证设备返回：' + JSON.stringify(data));
            })
        },
        SHcancel: function () {
            console.log('身份证取消读卡');
            STM.device.cancelIdentifyCard(function (data) {
                console.log('身份证取消读卡返回：' + JSON.stringify(data));
            })
        },
        PINopen: function () {
            console.log('m密码键盘打开设备');
            STM.device.openPinPad(function (data) {
                console.log('m密码键盘打开设备返回：' + JSON.stringify(data));
            })
        },
        PINreset: function () {
            console.log('m密码键盘重置设备');
            STM.device.resetPinPad(function (data) {
                console.log('m密码键盘重置设备返回：' + JSON.stringify(data));
            })
        },
        PINXOR: function () {
            console.log('密码键盘异或');
            var num1 = this.FL1;
            var num2 = this.FL2;
            STM.device.DoXOR(num1, num2, function (data) {
                console.log('密码键盘异或返回：' + JSON.stringify(data));
            })
        },
        PINMMMK: function () {
            var pKeyValue = "333333333333333333333333333"
            console.log('密码键盘明文主密钥注入');
            STM.device.xfsLoadKey("MMMK", "", 1, pKeyValue, function (data) {
                console.log('密码键盘明文主密钥注入返回：' + JSON.stringify(data));
            })
        },
        PINMMK: function () {
            var pKeyValue = ""
            console.log('密码键盘注入密文主密钥');
            STM.device.xfsLoadKey("MMK", "MMMK", 2, pKeyValue, function (data) {
                console.log('密码键盘注入密文主密钥返回：' + JSON.stringify(data));
            })
        },
        PINPIN: function () {
            var pKeyValue = ""
            console.log('密码键盘注入工作密钥');
            STM.device.xfsLoadKey("PIN", "MMK", 2, pKeyValue, function (data) {
                console.log('密码键盘注入工作密钥返回：' + JSON.stringify(data));
            })
        },
        PINgetBlock: function () {
            var cardNO = ""
            console.log('密码键盘获取密钥块');
            STM.device.XfsStartPin(cardNO, _that, "password", function (data) {
                console.log('密码键盘获取密钥块返回：' + JSON.stringify(data));
            })
        },
        PINStatus: function () {
            console.log('密码键盘获取设备状态');
            STM.device.getPinPadStatus(function (data) {
                console.log('密码键盘获取设备状态返回：' + JSON.stringify(data));
            })
        },
        PINcancel: function () {
            console.log('密码键盘取消操作');
            STM.device.cancelPinPadRequest(function (data) {
                console.log('密码键盘取消操作返回：' + JSON.stringify(data));
            })
        },
        Popen: function () {
            console.log('凭条打开设备');
            STM.device.openIReceipt(function (data) {
                console.log('凭条打开设备返回：' + JSON.stringify(data));
            })
        },
        Preset: function () {
            console.log('凭条复位设备');
            STM.device.resetIReceipt(function (data) {
                console.log('凭条复位设备返回：' + JSON.stringify(data));
            })
        },
        PStatus: function () {
            console.log('凭条复设备状态');
            STM.device.getDeviceStatusByIReceipt(function (data) {
                console.log('凭条复设备状态返回：' + JSON.stringify(data));
            })
        },
        PprintText: function () {
            var pData = "" +
                "\r\n办理网点：123" +
                "\r\n交易时间：3123" +
                "\r\n交易名称：1231" +
                "\r\n流 水 号：123123" +
                "\r\n账    号：12312" +
                "\r\n签约业务：3123123" +
                "\r\n姓    名：12123123" +
                "\r\n交易状态：123113"
            console.log('凭条打印一行数据' + pData);
            STM.device.dataPrint(pData, 0, 0, 0, 0, 0, function (data) {
                console.log('凭条打印一行数据返回：' + JSON.stringify(data));
            })
        },
        PprintImg: function () {
            var pData = ""
            console.log('凭条打印图片路径' + pData);
            STM.device.PicPrint(pData, function (data) {
                console.log('凭条打印图片返回：' + JSON.stringify(data));
            })
        },
        Pcut: function () {
            console.log('凭条切纸');
            STM.device.paperCutting(function (data) {
                console.log('凭条切纸返回：' + JSON.stringify(data));
            })
        },
        PgetPage: function () {
            console.log('凭条获取纸量');
            STM.device.GetPaperStatus(function (data) {
                console.log('凭条获取纸量返回：' + JSON.stringify(data));
            })
        },
        FinOpen: function () {
            console.log('指纹仪打开设备');
            STM.device.openFinger(function (data) {
                console.log('指纹仪打开设备返回' + JSON.stringify(data));
            })
        },
        Finreset: function () {
            console.log('指纹仪重置设备');
            STM.device.resetFinger(function (data) {
                console.log('指纹仪重置设备返回' + JSON.stringify(data));
            })
        },
        FinStatus: function () {
            console.log('指纹仪设备状态');
            STM.device.GetDeviceStatusByFinger(function (data) {
                console.log('指纹仪设备状态返回' + JSON.stringify(data));
            })
        },
        FinData: function () {
            console.log('指纹仪指纹特征');
            STM.device.mxGetImage(function (data) {
                console.log('指纹仪指纹特征返回' + JSON.stringify(data));
            })
        },
        Fincancel: function () {
            console.log('指纹仪取消操作');
            STM.device.CancelReadFinger(function (data) {
                console.log('指纹仪取消操作返回' + JSON.stringify(data));
            })
        },
        SIUopen: function () {
            console.log('指示灯打开设备');
            STM.device.openSIU(function (data) {
                console.log('指示灯打开设备返回' + JSON.stringify(data));
            })
        },
        SIUStatus: function () {
            console.log('指示灯设备状态');
            STM.device.getDeviceStatusBySIU(function (data) {
                console.log('指示灯设备状态返回' + JSON.stringify(data));
            })
        },
        SIUreset: function () {
            console.log('指示灯设备重置');
            STM.device.resetSiu(function (data) {
                console.log('指示灯设备重置返回' + JSON.stringify(data));
            })
        },
        SIUset: function () {
            var that = this;
            console.log('指示灯设置');
            STM.device.setSIU(that.suilifht, that.suiiStatus, function (data) {
                console.log('指示灯设置返回' + JSON.stringify(data));
            })
        },
        // SIUDoorStatus:function(){
        //     var that = this;
        //     console.log('指示灯门状态');
        //     STM.device.setSIU(that.suilifht,that.suiiStatus,function (data) {
        //         console.log('指示灯设置返回' + JSON.stringify(data));
        //     })
        // },
        UKopen: function () {
            console.log('UK打开设备');
            STM.device.openUkey(function (data) {
                console.log('UK打开设备返回' + JSON.stringify(data));
            })
        },
        UKreset: function () {
            console.log('UKf复位设备');
            STM.device.resetUkey(function (data) {
                console.log('UK复位设备返回' + JSON.stringify(data));
            })
        },
        UKStatus: function () {
            console.log('UK设备状态');
            STM.device.getDeviceStatusByUkey(function (data) {
                console.log('UK设备状态返回' + JSON.stringify(data));
            })
        },
        UKsend: function () {
            console.log('UK发盾');
            STM.device.dispenseUkey(1, function (data) {
                console.log('UK发盾返回' + JSON.stringify(data));
            })
        },
        UKread: function () {
            console.log('UK读盾');
            STM.device.readUkey(1, function (data) {
                console.log('UK读盾返回' + JSON.stringify(data));
            })
        },
        UKtu: function () {
            console.log('UK退盾');
            STM.device.ejectUkey(function (data) {
                console.log('UKUK退盾返回' + JSON.stringify(data));
            })
        },
        UKtun: function () {
            console.log('UK吞盾');
            STM.device.retainUkey(function (data) {
                console.log('UK吞盾返回' + JSON.stringify(data));
            })
        },
        UKisHave: function () {
            console.log('发盾口有无u盾');
            STM.device.GetHaveCardUkey(function (data) {
                console.log('发盾口有无u盾返回' + JSON.stringify(data));
            })
        },
        UKgetInfo: function () {
            console.log('U盾获取盾箱信息');
            STM.device.GetCardUnitInfoByUkey(function (data) {
                console.log('U盾获取盾箱信息返回' + JSON.stringify(data));
            })
        },
        UKclear: function () {
            console.log('U盾清空回收箱');
            STM.device.zeroUkeyRetainNum(function (data) {
                console.log('U盾清空回收箱返回' + JSON.stringify(data));
            })
        },
        UKsetNum: function () {
            var that = this;
            console.log('U盾设置盾箱（盾数量）');
            STM.device.setUkeyUnitInfo(1, that.ukeyNum, function (data) {
                console.log('U盾设置盾箱（盾数量）返回' + JSON.stringify(data));
            })
        },
        DBopen: function () {
            console.log('双目打开设备');
            STM.device.OpenCameraDouble(function (data) {
                console.log('双目打开设备返回' + JSON.stringify(data));
            })
        },
        DBreset: function () {
            console.log('双目重置摄像头');
            STM.device.ResetCameraDouble(function (data) {
                console.log('双目重置摄像头返回' + JSON.stringify(data));
            })
        },
        DBZHIX: function () {
            var that = this;
            console.log('双目执行');
            STM.device.DisplayVideoDouble(that.doubleNum, function (data) {
                console.log('双目执行返回' + JSON.stringify(data));
            })
        },
        writerto: function () {
            console.log('写入D:\\XJFileData\\test1.text');
            var datas = "sadfasldkfadflkasd啊打发打发手动阀";
            STM.device.SetFileData("test1.text", datas, function (data) {
                console.log('写入D:\\XJFileData\\test1.text返回' + JSON.stringify(data));
            })
        },
        readfrom: function () {
            console.log('读取D:\\XJFileData\\test1.text');
            var datas = "sadfasldkfadflkasd啊打发打发手动阀";
            STM.device.GetFileData("test1.text", function (data) {
                console.log('读取D:\\XJFileData\\test1.text返回' + JSON.stringify(data));
            })
        },
        CZopen: function () {
            console.log('存折打开设备');
            STM.device.OpenPassBook(function (data) {
                console.log('存折打开设备返回' + JSON.stringify(data));
            })
        },
        CZreset: function () {
            console.log('复位存折');
            STM.device.ResetPassBook(function (data) {
                console.log('复位存折返回' + JSON.stringify(data));
            })
        },
        CZStatus: function () {
            console.log('存折设备状态');
            STM.device.GetStatusPassBook(function (data) {
                console.log('存折设备状态返回' + JSON.stringify(data));
            })
        },
        CZread: function () {
            console.log('存折读折后退折');
            STM.device.ReadPassBookTrack(function (data) {
                console.log('存折读折后退折返回' + JSON.stringify(data));
            })
        },
        CZtui: function () {
            console.log('存折退折');
            STM.device.EjecetPassBook(function (data) {
                console.log('存折退折返回' + JSON.stringify(data));
            })
        },
        CZform: function () {
            console.log('存折表单打印');
            var datas = "Date[" + startLine + "]=" + arr[index].tradeDate + "\\0Zhay[" + startLine + "]=" + arr[index].digestDetail + "\\0yue[" + startLine + "]=" + happenMoneyD + "\\0din[" + startLine + "]=" + happenMoneyC + "\\0QXR[" + startLine + "]=¥" + arr[index].interest + "\\0RMB[" + startLine + "]=" + arr[index].operateBranch + "\\0llv[" + startLine + "]=" + arr[index].tradeTeller + "\\0\\0";;
            STM.device.FormPrintPassBook(datas, 1, function (data) {
                console.log('存折表单打印返回' + JSON.stringify(data));
            })
        },
        speekText: function () {
            console.log('文本语音');
            STM.ext.SpeechText("您好,我是小Y", 100, function (data) {
                console.log('文本语音返回' + JSON.stringify(data));
            })
        },
        SetLocal: function () {
            console.log('保存本地数据');
            STM.ext.SetLocalValue("TESTS", "key", "本地数据", function (data) {
                console.log('保存本地数据返回' + JSON.stringify(data));
            })
        },
        GetLocal: function () {
            console.log('获取本地数据');
            STM.ext.GetLocalValue("TESTS", "key", function (data) {
                console.log('获取本地数据返回' + JSON.stringify(data));
            })
        },
        getMac: function () {
            console.log('获取本机MAC');
            STM.ext.GetMac("TESTS", "key", function (data) {
                console.log('获取本机MAC返回' + JSON.stringify(data));
            })
        },
        getIP: function () {
            console.log('获取本机IP');
            STM.ext.GetIP("TESTS", "key", function (data) {
                console.log('获取本机IP返回' + JSON.stringify(data));
            })
        },
        uploadFile: function () {
            console.log('上传文件');
            var args = {
                address: 'http://10.16.80.79:9091', //上传地址
                remoteSavePath: 'log/agentLog', //bips端存放目录，相对bips根目录
                remoteFileName: 'log.zip', //bips端存放文件名称
                uploadFilePath: 'Logs', //本地待上传文件名称，支持单个文件和目录打包上传
                localPathFormat: 'relative', //本地路径格式，'relative'—相对外壳路径，’absolute’—绝对路径
                timeOut: 60000 //超时时间，以毫秒为单位
            };
            STM.ext.uploadLog(args, function (data) {
                console.log('上传文件返回' + JSON.stringify(data));
            })
        },
        downloadFile: function () {
            console.log('下载文件');
            var args = {
                address: 'http://127.0.0.1:9191', //下载地址
                remotePath: 'log/Device.log', //bips端文件路径
                localSavePath: 'C:\\BankItWork\\Device.log', //本地保存路径
                localPathFormat: 'absolute', //本地路径格式，'relative'—相对外壳路径，’absolute’—绝对路径
                timeOut: 60000 //超时时间，以毫秒为单位
            };
            STM.ext.downloadFile(args, function (data) {
                console.log('下载文件返回' + JSON.stringify(data));
            })
        },
        delFile:function(){
            console.log('删除文件');
            var args={}
            STM.ext.delFile(args, function (data) {
                console.log('删除文件返回' + JSON.stringify(data));
            })
        },
        delFolder:function(){
            console.log('删除文件夹');
            var args={}
            STM.ext.delFolder(args, function (data) {
                console.log('删除文件夹返回' + JSON.stringify(data));
            })
        },
        IsExists:function(){
            console.log('文件是否为空');
            var args={}
            STM.ext.IsExists(args, function (data) {
                console.log('文件是否为空返回' + JSON.stringify(data));
            })
        },
        setSysTime:function(){
            console.log('设置时间');
            var args={setSysTime:"20210510 11:11:11"}
            STM.ext.IsExists(args, function (data) {
                console.log('设置时间返回' + JSON.stringify(data));
            })
        },
        PJSopen:function(){
            console.log('票据受理打开设备');
            STM.device.BillOpenDev(function (data) {
                console.log('票据受理打开设备返回' + JSON.stringify(data));
            })
        }, 
        PJSreset:function(){
            console.log('票据受理复位设备');
            STM.device.BillResetDevice(function (data) {
                console.log('票据受理复位设备返回' + JSON.stringify(data));
            })
        },
        PJSread:function(){
            console.log('票据受理读票');
            // 1存单，2转账支票，3现金支票
            STM.device.BillScan(1,function (data) {
                console.log('票据受理读票返回' + JSON.stringify(data));
            })
        }, 
        PJScancel:function(){
            console.log('票据受理取消读票');
            STM.device.BillCancelInsert(function (data) {
                console.log('票据受理取消读票返回' + JSON.stringify(data));
            })
        },
        PJStun:function(){
            console.log('票据受理吞票');
            STM.device.BilltunMedia(function (data) {
                console.log('票据受理吞票返回' + JSON.stringify(data));
            })
        }, 
        PJStui:function(){
            console.log('票据受理吐票');
            STM.device.BillEjecetMedia(function (data) {
                console.log('票据受理吐票返回' + JSON.stringify(data));
            })
        },
        PJSStatus:function(){
            console.log('票据受理设备状态');
            STM.device.BillGetDeviceStatus(function (data) {
                console.log('票据受理设备状态返回' + JSON.stringify(data));
            })
        },
        PJMopen:function(){
            console.log('票据售卖打开设备');
            STM.device.BillSellerOpenDev(function (data) {
                console.log('票据售卖打开设备返回' + JSON.stringify(data));
            })
        },
        PJMreset:function(){
            console.log('票据售卖复位设备');
            STM.device.BillSellerResetDevice(function (data) {
                console.log('票据售卖复位设备返回' + JSON.stringify(data));
            })
        },
        PJMtui:function(){
            console.log('票据售卖吐票');
            STM.device.BillSellerEjecetMedia(function (data) {
                console.log('票据售卖吐票返回' + JSON.stringify(data));
            })
        }, 
        PJMStatus:function(){
            console.log('票据售卖设备状态');
            STM.device.BillSellerGetDeviceStatus(function (data) {
                console.log('票据售卖设备状态返回' + JSON.stringify(data));
            })
        },
        PJMprint:function(){
            console.log('票据售卖打印');
            var imgName=""
            var datas=""
            STM.device.BillSellerPrintData(imgName, datas,function (data) {
                console.log('票据售卖打印返回' + JSON.stringify(data));
            })
        },
        PJMread:function(){
            console.log('票据售卖扫描');
            STM.device.BillSellerReadMagic(function (data) {
                console.log('票据售卖扫描返回' + JSON.stringify(data));
            })
        },

        
    },
})