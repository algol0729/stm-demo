/**
 * @PROJECT_NAME SuperCounter<br>
 * @User Algol<br>
 * @Date 2020年12月21日 10:45 <br>
 * @Description
 */
;
(function (STM, $) {
    STM = STM || {};
    //--------------------------------------监听屏幕输入硬件密码函数-----------------------//
    var scope, pwdEle, pinPadKeyDownHandler, doSubmit, doCancel;

    pinPadKeyDownHandler = function (e) {
        var keyCode = e.keyCode;
        console.log('keyCode:' + keyCode);
        // if((keyCode >= 48 && keyCode<= 57) )
        if ((keyCode >= 48 && keyCode <= 57) || keyCode == 42) {

            var value = String.fromCharCode(42);
            pwdEle.value = pwdEle.value ? pwdEle.value + value : value;
        } else if (keyCode == 13) //确定按钮，相当于回车
        {

            //STM.device.cancelPinPadRequest();
            document.removeEventListener("keydown", pinPadKeyDownHandler);
            if (doSubmit) {
                doSubmit.apply(scope, []);
            }

        } else if (keyCode == 8) //清除或删除按钮，相当于BS或者DEL
        {

            pwdEle.value = pwdEle.value.substring(0, pwdEle.value.length - 1);
        } else if (keyCode == 24) {

            STM.device.cancelPinPadRequest();
            document.removeEventListener("keydown", pinPadKeyDownHandler);
            if (doCancel)
                doCancel.apply(scope, []);
        }

        e.preventDefault();
    };

    STM.device = {
        //------------------------------------1.发卡机模块--------------------------//
        //todo 天津农商银行  0废卡箱 1号卡箱 2号卡箱 3号卡箱
        /**
         * @description 打开设备
         * @param fn
         */
        openCardDispenser: function (fn) {
            fox.device.call("CardDispenser", "OpenDev", {}, fn);
        },
        /**
         * @description 关闭设备
         * @param fn
         */
        closeCardDispenser: function (fn) {
            fox.device.call("CardDispenser", "CloseDev", {}, fn);
        },
        /**
         * @description 获取设备状态
         * @param fn
         */
        getDeviceStatusByCardDispenser: function (fn) {
            var param = {
                iTimeOut: 0
            };
            fox.device.call("CardDispenser", "GetDeviceStatus", param, fn);
        },
        /**
         * @description 复位设备
         * @param fn
         */
        resetDispenser: function (fn) {
            var param = {
                iOptionType: 1, //lOptionType复位方式：0 如果通道有卡，则将卡退出；1 如果通道有卡，则将卡放入废卡箱；2 如果通道中有卡，不做任何操作
                iTimeOut: 30000
            };
            fox.device.call("CardDispenser", "ResetDevice", param, fn);
        },
        /**
         * @description 发卡
         * @param fn
         */
        dispenseCard: function (num, fn) {
            //num 为卡箱号 1 或 2
            var param = {
                iCardUnit: num,
                iTimeOut: 30000
            };
            fox.bus.put('public', 'getCardBoxNum', num); //缓存发卡箱号    吞卡的时候用
            fox.device.call("CardDispenser", "DispenseCard", param, fn);
        },

        /**
         * @description 吞卡
         * @param fn
         */
        retainCardDispenser: function (fn) {
            this.setSIU(1, 0, function () {});
            var param = {
                iCardUnit: 0,
                iTimeOut: 30000
            };
            //吞卡箱吞到哪个箱子里 start
            // STM.ext.GetLocalValue('retainCardBox', 'retainCardBoxNo', function (retainCardBoxNo) {
            //     if (!!retainCardBoxNo) {
            //         //正常废卡箱是0  //todo 社保卡箱是7。只有一个废卡箱
            //         param.iCardUnit = retainCardBoxNo;
            //     }
            //     console.log('吞卡上传的数据是：' + JSON.stringify(param));
            // })
            fox.device.call("CardDispenser", "RetainCard", param, fn);
        },
        /**
         * @description 弹出用户插入的卡
         */
        ejectCardDispenser: function (fn) {
            this.setSIU(1, 0, function () {});
            var param = {
                iTimeOut: 0
            };

            fox.device.call("CardDispenser", "EjectCard", param, fn);

        },
        /**
         * @description 设置卡箱数量
         * @param fn
         */
        setCardUnitInfo: function (num1, num2, fn) {
            var param = {
                iCardUnit: num1,
                iCardNumber: num2,
                iTimeOut: 30000
            };
            fox.device.call("CardDispenser", "SetCardUnitInfo", param, fn);
        },
        /**
         * @description 获取卡箱信息
         * @param fn
         */
        GetCardUnitInfoByCardDispenser: function (fn) {
            var callback = function (data) {
                // alert(JSON.stringify(data))
                if (data.success) {
                    //Info长度为100，存放卡箱信息，格式：//卡箱1状态-卡箱1数量|卡箱2状态-卡箱2数量|废卡箱1状态-废卡箱1数量|废卡箱2状态-废卡箱2数量|
                    //发卡箱状态1正常   2卡少   0卡箱空你 3卡箱被移走   4卡箱故障
                    //废卡箱状态1正常   2快满   3满       4故障

                    if (data.success) {
                        var result = data.result;
                        var box;
                        if (result['__retvalue'] == 1) {
                            var pInfo = result.pInfo;
                            var pInfoArray = pInfo.split("|");
                            //todo 待测试
                            box = {
                                retValue: 1,
                                fCardBox1: pInfoArray[0].split("-")[1],
                                cardBox1: pInfoArray[1].split("-")[1],
                                cardBox2: pInfoArray[2].split("-")[1],
                            }
                        } else {
                            box = {
                                retValue: result['__retvalue'],
                                pInfo: result.pInfo
                            }
                        }

                    }
                    if (typeof fn === 'function')
                        fn({
                            box: box
                        })
                } else {
                    if (typeof fn === 'function')
                        fn({
                            box: undefined
                        });
                }
            }
            var param = {
                iTimeOut: 300000
            };
            fox.device.call("CardDispenser", "GetCardUnitInfo", param, callback);
        },
        //查询是否有卡
        GetCardPosition: function (fn) {
            var param = {
                iTimeOut: 30000
            };

            fox.device.call("CardDispenser", "GetCardPosition", param, fn)

        },

        //--------------------------------------2.读卡器模块-----------------------------------------------//

        /**
         * @description 打开设备
         * @param fn
         */
        openCardReader: function (fn) {
            fox.device.call("CardReader", "OpenDev", {}, fn);
        },
        /**
         * @description 关闭设备
         * @param fn
         */
        closeCardReader: function (fn) {
            fox.device.call("CardReader", "CloseDev", {}, fn);
        },
        /**
         * @description 弹出用户插入的卡
         */
        ejectCardReader: function (fn) {
            this.setSIU(1, 0, function () {});
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CardReader", "EjectCard", param, fn);
        },
        /**
         * 读卡器吞卡
         * @param {*} fn 
         */
        RetainCardReader:function(fn){
            this.setSIU(1,0,function(){});
            //0 废卡箱
            var param =
                {
                    iCardUnit:0,
                    iTimeOut:30000
                };
            fox.device.call("CardReader", "RetainCard",param, fn);
        },
        /**
         * @description 读取机箱的卡磁条
         * @param fn  传入的回调函数
         */
        readCardReader: function (fn) {
            this.setSIU(1, 4, function () {});
            var callback = function (data) {
                fox.layer.closeAll();
                // alert(JSON.stringify(data))
                if (data.success) {
                    var result = data.result;
                    var pInfo = result.pValue;
                    var args = {

                    };
                    args.state = result['__retvalue'];
                    if (args.state == '1') {
                        var _args = pInfo.split("|");
                        if (pInfo.indexOf("I|") == 0) {
                            args.type = "I";
                            args.cardId = _args[1];
                            args.cardNo = _args[2];
                            args.listNum = _args[3];
                            args.track2 = _args[4];
                            args.eMoney = _args[5];
                            args.trade = _args[6];
                            args.balance = _args[7];
                        } else if (pInfo.indexOf("C|") == 0) {
                            args.type = "C";
                            args.track2 = _args[1];
                            args.eMoney = _args[2];
                            if (args.track2.indexOf("=") != -1) {
                                args.cardNo = args.track2.split("=")[0];
                            } else {
                                args.cardNo = "";
                            }
                        }
                        //wbyf615 2020/11/11 14:40 读卡成功判空 start
                        if (args.cardNo == '') {
                            args.state = '4'; //读卡返回成功，但是账号为空
                            console.log('读卡返回成功，但是账号为空');
                        }
                        //wbyf615 2020/11/11 读卡成功判空 end
                    }
                    if (typeof fn === 'function')
                        fn(args);
                } else {
                    fn(data);
                }
            };

            //lTrackType：  1 TRACK1 磁道1
            //				2 TRACK2 磁道2
            //				3 TRACK3 磁道3
            //				4 TRACK1|TRACK2 磁道1和磁道2
            //				5 TRACK2|TRACK3 磁道2和磁道3
            //				6 TRACK1|TRACK3 磁道1和磁道3
            //				7 TRACK1| TRACK2|TRACK3 磁道1、磁道2、磁道3
            //				8 TRACK2|CHIP    读磁道2或IC卡 根据插入的IC卡还是磁卡来返回数据
            //              pInfo为长度1000的wchar_t的数组
            //              pInfo格式信息包括：如果是IC卡：主账号|余额上限|单笔消费限额|二磁道数据|ARQC|ARQC元数据|应用标识符|ATC|卡有效期|发卡行数据|TV结果|卡序列号|55域数据|
            //                   其他表示成功,返回对应的卡号信息
            var param = {
                iType: 8,
                iTimeOut: 30000
            };
            fox.device.call("CardReader", "ReadCard", param, callback);
        },
        /**
         * @description 获取ARQC数据
         */
        GetARQC: function (fn) {
            var param = {
                pInfo: '600.50',
                iTimeOut: 30000
            }
            fox.device.call("CardReader", "GetARQC", param, fn);
        },
        /**
         * @description VerifyWriteScript
         */
        VerifyWriteScript: function (hostData, fn) {
            var param = {
                hostData: hostData,
                iTimeOut: 30000
            }
            fox.device.call("CardReader", "VerifyWriteScript", param, fn);
        },

        /**
         * @description 获取设备状态
         * @param fn
         */

        getDeviceStatusByCardReader: function (fn) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("CardReader", "GetDeviceStatus", param, fn);
        },
        /**
         * @description 取消操作
         * @param fn
         */
        cancelInsertCardReader: function (fn) {
            this.setSIU(1, 0, function () {})
            fox.device.call("CardReader", "CancelInsert", {}, fn);
        },
        /**
         * @description 复位设备
         * @param fn
         */
        resetCardReader: function (fn) {
            var param = {
                iAction: 1, //lOptionType   0 如果卡槽中有卡，则将卡退出；1 如果卡槽中有卡，则将卡吞入
                iTimeOut: 30000
            };
            fox.device.call("CardReader", "ResetDevice", param, fn);
        },
        /**
         * @description 获取卡的位置
         * @param fn
         */
        GetCardPositionByCardReader: function (fn) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("CardReader", "GetCardPosition", param, fn);
        },

        //-----------------------------------------3.身份证读取模块---------------------------------------//
        /**
         * @description 打开设备
         * @param fn
         */
        openIdentifyCard: function (fn) {
            fox.device.call("IdentityCard", "OpenDev", {}, fn);
        },
        /**
         * @description 关闭设备
         * @param fn
         */
        closeIdentifyCard: function (fn) {
            fox.device.call("IdentityCard", "CloseDev", {}, fn);
        },
        /**
         * @description 读取身份证ID卡
         * @param fn 传入的回调函数
         */
        readIDCard: function (fn) {
            //打开读身份证指示灯
            this.setSIU(0, 4, function () {});

            var callback = function (data) {
                fox.layer.closeAll();
                STM.device.setSIU(0, 0, function () {});
                if (data.success) {
                    //pInfo格式信息包括：名字|性别|名族|出生日期|地址|身份证号|办证机关|有效期开始|有效期结束|头像本地路径|正面头像路径|反面头像路径。
                    //            例如："张三|男|汉|19010101|A市B区C街D号|100101190101011234|A市公安局B分局|20080731|20180731|C:\head.jpg|c:\01.jpg|c:\02.jpg"

                    var user;
                    if(data.result['__retvalue']=="1"){
                        var result = data.result;
                    var pInfo = result.pInfo;
                    var pInfoArray = pInfo.split("|");
                   
                    user = {
                        name: pInfoArray[0],
                        sex: pInfoArray[1],
                        nation: pInfoArray[2],
                        birthday: pInfoArray[3],
                        address: pInfoArray[4],
                        id: pInfoArray[5],
                        accreditation_agencies: pInfoArray[6],
                        validity_start: pInfoArray[7],
                        validity_end: pInfoArray[8] == "长期" ? "99991231" : pInfoArray[8],
                        // head_picture_path:pInfoArray[9],
                        head_picture_path: result.pHead,
                        // front_head_picture_path:pInfoArray[10],
                        front_head_picture_path: result.pFront,
                        // back_head_picture_path:pInfoArray[11]
                        back_head_picture_path: result.pBack,
                    }

                    }else if(data.result['__retvalue']=="11"){
                        user={
                            cancle:"1"
                        }
                    }else if(data.result['__retvalue']=="3"){
                        user={
                            cancle:"3"
                        }
                    }
                    if (typeof fn === 'function') {
                        fn({
                            user: user
                        })
                    }
                } else {
                    if (typeof fn === 'function')
                        fn({
                            user: undefined
                        });
                }
            }
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("IdentityCard", "ReadIdenCard", param, callback);
        },

        /**
         * @description 退出身份证
         * @param fn
         */
        ejectIdentifyCard: function (fn) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("IdentityCard", "EjectIdenCard", param, fn);
        },
        /**
         * @description 获取身份证位置
         * @param fn
         */
        getIdentifyCardPosition: function (fn) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("IdentityCard", "GetCardPosition", param, fn);
        },

        /**
         * @description 复位设备
         * @param fn
         */
        resetIdentifyCard: function (fn) {

            var param = {
                iTimeOut: 0
            };
            fox.device.call("IdentityCard", "ResetDevice", param, fn);
        },
        /**
         * @description 获取设备状态
         * @param fn
         */
        getIdentifyCardStatus: function (fn) {
            var param = {
                lTimeOut: 0
            };
            fox.device.call("IdentityCard", "GetDeviceStatus", param, fn);
        },


        /**
         * @description 取消操作
         * @param fn
         */
        cancelIdentifyCard: function (fn) {
            this.setSIU(0, 0, function () {});
            fox.device.call("IdentityCard", "CancelInsert", {}, fn);
        },
        //--------------------------------------------4.密码键盘模块--------------------------------------------//
        /**
         * @description 打开设备
         * @param fn
         */
        openPinPad: function (fn) {
            fox.device.call("PIN", "OpenDev", {}, fn);
        },
        /**
         * @description 关闭设备
         * @param fn
         */
        closePinPad: function (fn) {
            fox.device.call("PIN", "CloseDev", {}, fn);
        },
        DoXOR: function (pPartA, pPartB, fn) {
            ////两个分量做异或
            //参数，输入：pPartA分量一  pPartB分量二，
            //pOut 异或结果
            var params = {
                data1: pPartA,
                data2: pPartB
            }
            console.log(JSON.stringify(params));
            fox.device.call("PIN", "XORData", params, fn);
        },

        xfsLoadKey: function (pKeyName, protectKeyName, iKeyType, pKeyValue, fn) {
            // [pKeyName]  密钥类型名称，MMMK代表明文主密钥，MMK代表密文主密钥，PIN代表工作密钥。
            // [protectKeyName] 保护密钥名称。
            // [iKeyType]  1代表明文主密钥，2代表密文主密钥，3代表工作密钥,4.MAC秘钥。
            // [pKeyValue] 密钥内容
            // [pCheckValue]  输出参数，指定将要加载的密钥值
            // [pCheckLen]  输出参数，指定将要加载的密钥值长度
            // [pErrInfo] 输出参数，返回处理结果成功或失败信息
            // [pErrLen] 输出参数，返回处理结果信息的字符长度
            var params = {
                pKeyName: pKeyName,
                protectKeyName: protectKeyName,
                iKeyType: iKeyType,
                pKeyValue: pKeyValue,
            };

            fox.device.call("PIN", "XfsLoadKey", params, fn);
        },
        /**
         * @description 调取密码键盘
         * @param fn  传入的回调函数
         */
        // [bEncy]（预留字段）。
        // [sFormat]（预留字段）。
        // [sPadding]指定填充字符.范围0x00到0x0F
        // [pKeyName]指定用来第一次加密已格式化PIN的密钥,如果不要求加密,此值为空。如果这指定了一个两倍长度的密钥,将进行3倍DES加密。
        // [sLen]输入密码长度
        // [pCardNO]客户数据（ASCII字符串）
        // [sAutoEnter]自动结束。可以输入true和false。
        // [iTimeOut]设置超时时间。
        // [Value]输出参数，密文块（发送给银行系统安全模块的数据）
        // [pValueLen]输出参数，密文块数据长度
        // [pErrInfo]输出参数，返回处理结果成功或失败信息
        // [pErrLen]输出参数，返回处理结果信息的字符长度
        /**
         * @description 在document级别上拦截windows事件
         * @param scope_ 实例,回掉函数中的this将指向scope对应的实例
         * @param pwdId 密码输入框的id
         * @Param doSubmitFn 密码键盘确定按钮点击过后的回掉函数
         * @param doCancelFn 密码键盘取消按钮点击过后的回掉函数
         * */
        XfsStartPin: function (cardNO, scope_, pwdId, doSubmitFn, doCancelFn) {
            this.setSIU(4, 4, function () {});
            scope = scope_;
            pwdEle = document.querySelector("#" + pwdId);
            console.log(pwdEle);
            doCancel = doCancelFn;
            document.removeEventListener("keydown", pinPadKeyDownHandler);
            document.addEventListener("keydown", pinPadKeyDownHandler);
            var callback = function (data) {
                STM.device.setSIU(4, 0, function () {})
                document.removeEventListener("keydown", pinPadKeyDownHandler);
                if (data.success) {

                    var retValue = data.result['__retvalue'];
                    var value = data.result.Value;
                    var errInfo = data.result.ErrorInfo
                    EncyValue = {
                        "retValue": data.result['__retvalue'],
                        "value": data.result.Value
                    };
                    if (!EncyValue)
                        return;
                    if (doSubmitFn && typeof doSubmitFn == 'function')
                        doSubmitFn(EncyValue);
                } else {
                    doSubmitFn(undefined);
                }
            };
            var param = {
                bEncy: 1,
                sFormat: 1,
                sPadding: 0,
                pKeyName: "PIN",
                sLen: 6,
                pCardNO: cardNO,
                sAutoEnter: 0,
                iTimeOut: 30000
            };
            console.log("param.pKeyName:" + JSON.stringify(param));
            fox.device.call("PIN", "XfsStartPin", param, callback);
        },
        /**
         *从注册表获取密码键盘秘钥类型
         */
        GetMode: function (fn) {
            fox.device.call("PIN", "GetMode", {}, fn);
        },
        /**
         * @description 复位设备
         * @param fn
         */
        resetPinPad: function (fn) {
            var param = {
                lTimeOut: 30000
            };
            fox.device.call("PIN", "ResetDevice", param, fn);
        },
        /**
         * 获取设备状态
         * @param {*} fn 
         */
        getPinPadStatus: function (fn) {
            var param = {
                lTimeOut: 30000
            };
            fox.device.call("PIN", "GetDeviceStatus", param, fn);
        },
        /**
         * @description 取消操作
         * @param fn
         */
        cancelPinPadRequest: function (fn) {
            this.setSIU(4, 0, function () {})
            fox.device.call("PIN", "CancelPin", {}, fn);
        },
        /**
         * 取消页面监听
         * @param {*} id 
         */
        removeList: function (id) {
            pwdEle = document.querySelector("#" + id);
            document.removeEventListener("keydown", pinPadKeyDownHandler);
        },

        GetEncyData: function (fn) {
            fox.device.call("PIN", "GetEncyData", {}, fn)
        },

        PinCrypt: function (lMode, lpsKey, lAlgorithm, lpCryptData, fn) {
            //加密解密数据
            //参数，输入：lMode、lpsKey、lAlgorithm、lpCryptData、，
            //输出：Value、pValueLen、ErrorInfo、pErrLen
            //lMode 类型0加密  1解密
            //lpsKey 密钥名称
            //lAlgorithm 算法名:
            // 				0	WFS_PIN_CRYPTDESECB电子编码书
            // 				1	WFS_PIN_CRYPTDESCBC    连续密码块
            // 				2	WFS_PIN_CRYPTDESCFB   密码反馈
            // 				3	WFS_PIN_CRYPTRSA       RSA加密
            // 				4	WFS_PIN_CRYPTECMA      ECMA加密
            // 				5	WFS_PIN_CRYPTDESMAC   计算MAC(国密或DES计算MAC)
            // 				6	WFS_PIN_CRYPTTRIDESECB  三倍DES(电子编码书)
            // 				7	WFS_PIN_CRYPTTRIDESCBC  三倍DES(连续密码块)
            // 				8	WFS_PIN_CRYPTTRIDESCFB  三倍DES(密码反馈)
            // 				9	WFS_PIN_CRYPTTRIDESMAC
            // 				10	WFS_PIN_CRYPTMAAMAC   MAC计算使用ISO 8731-2 [Ref. 33]中定义的消息认证算法
            //lpCryptData原始数据
            //Value 运算后的值
            //pValueLen 运算后值的长度
            var params = {
                iMode: lMode,
                sKeyName: lpsKey,
                iAlgorithm: lAlgorithm,
                sData: lpCryptData,
                iDataType: 1, //1 数据格式ascii  其他是BCD
                iTimeOut: 3000
            }

            fox.device.call("PIN", "PinCrypt", params, fn)

        },
        GetEncMode: function (fn) {
            //获取密码键盘是国密加密还是DES加密。
            //参数，输入：无，输出：lMode
            fox.device.call("PIN", "GetEncMode", {}, fn);
        },
        //--------------------------------------------5.凭条打印模块---------------------------------------------//
        /**
         * @description 打开设备
         * @param fn
         */
        openIReceipt: function (fn) {
            fox.device.call("Receipt", "OpenDev", {}, fn);
        },
        /**
         * @description 关闭设备
         * @param fn
         */
        closeIReceipt: function (fn) {
            fox.device.call("Receipt", "CloseDev", {}, fn);
        },
        /**
         * @description 获取凭条纸量
         * @param fn
         */
        GetPaperStatus: function (fn) {
            fox.device.call("Receipt", "GetPaperStatus", {}, fn);
        },
        /**
         * @description 获取设备状态
         * @param fn
         */
        getDeviceStatusByIReceipt: function (fn) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("Receipt", "GetDeviceStatus", param, fn);
        },
        /**
         *@description 打印一行数据
         *@param pData 需要打印的数据
         *@param offx打印起始位置左边距
         *@param offy预留
         *@param nsizeX字体宽度
         *@param nsizeY字体高度
         *@param nStyle:(0 - 正常字体, 1 - 加粗字体, 4 - 下划线)
         *@param fn 回掉函数
         * @example:
         */
        dataPrint: function (pData, offx, offy, nsizeX, nsizeY, nStyle, fn) {
            this.setSIU(2, 4, function () {});
            var param = {
                pData: pData,
                iOffX: offx,
                iOffY: offy,
                iSizeX: nsizeX,
                iSizeY: nsizeY,
                iStyle: nStyle,
                iTimeOut: 30000
            };

            fox.device.call("Receipt", "DataPrint", param, function (data) {
                STM.device.setSIU(2, 0, function () {});
                fn(data);
            });
        },

        /**
         * @description 打印黑白图片
         * @param pPic 图片路径
         * */
        PicPrint: function (pPic, fn) {
            var param = {
                pPic: pPic
            };

            fox.device.call("Receipt", "PicPrint", param, fn);
        },
        /**
         * @description 切纸
         * */
        paperCutting: function (fn) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("Receipt", "PaperCutting", param, fn);
        },

        /**
         * @description 复位设备
         * @param fn
         */
        resetIReceipt: function (fn) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("Receipt", "ResetDevice", param, fn);
        },
        /**
         *@description 打印文本文件
         *@param pFile 文本文件路径
         * */
        TxtPrint: function (pFile, fn) {
            alert("pFile:" + pFile);
            var param = {
                pFile: pFile,
                lTimeOut: 0
            };
            fox.device.call("Receipt", "TxtPrint", param, fn);
        },
        //-------------------------------------6.指纹仪模块-----------------------------------//
        /**
         * @description 打开指纹仪
         * */
        openFinger: function (fn) {
            fox.device.call("Finger", "OpenDev", {}, fn);
        },
        //指纹重置
        resetFinger: function (fn) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("Finger", "ResetDevice", param, fn);
        },
        closeFinger: function (fn) {
            fox.device.call("Finger", "CloseDev", {}, fn);
        },
        /**
         * 获取指纹仪状态
         * @param {*} fn 
         */
        GetDeviceStatusByFinger: function (fn) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("Finger", "GetDeviceStatus", param, fn);
        },
        /**
         * 获取指纹数据
         * @param {*} fn 
         */
        mxGetImage: function (fn) {
            this.setSIU(6, 4, function () {})
            var param = {
                tellerInfo: '',
                iTimeOut: 30000
            };
            fox.device.call("Finger", "GetFeatureData", param, function (data) {
                STM.device.setSIU(6, 0, function () {})
                fn(data);
            });
        },
        CancelReadFinger: function (fn) {

            fox.device.call("Finger", "CancelRead", {}, fn);

        },
        mxGetMBBase64: function (fn) {
            var param = {
                lTimeout: 60000
            };
            fox.device.call("Finger", "GetFingerModel", param, fn);
        },
        compareBaseFinger: function (pModel, fn) {
            var param = {
                lTimeout: 30000,
                pModel: pModel,

            };
            fox.device.call("Finger", "CompareFinger", param, fn);
        },
        //----------------------------------------7.Tools 一些工具------------------------------、、
        ToolsDigest: function (data, algorithm, isXOR, fn) {
            var param = {
                data: data,
                algorithm: algorithm,
                isXOR: isXOR
            }
            fox.device.call("Tools", "Digest", param, fn);
        },
        Base64Encode: function (asc_data, fn) {
            var param = {
                asc_data: asc_data,
            }
            fox.device.call("Tools", "Base64Encode", param, fn);
        },
        BCDToBase64: function (asc_data, fn) {
            var param = {
                asc_data: asc_data
            }
            fox.device.call("Tools", "BCDToBase64", param, fn);
        },
        Base64ToBCD: function (base64, fn) {
            var param = {
                base64: base64
            }
            fox.device.call("Tools", "Base64ToBCD", param, fn);
        },
        //--------------------------------------8. 指示灯模块--------------------------------------//
        /**
         * @description 打开设备
         * @param fn
         */
        openSIU: function (fn) {
            fox.device.call("SIU", "OpenDev", {}, fn);
        },
        /**
         * @description 关闭设备
         * @param fn
         */
        closeSIU: function (fn) {
            fox.device.call("SIU", "CloseDev", {}, fn);
        },
        /**
         * @description 获取设备状态
         * @param fn
         */
        getDeviceStatusBySIU: function (fn) {
            var param = {
                lTimeout: 3000
            };
            fox.device.call("SIU", "GetDeviceStatus", param, fn);
        },
        /**
         * @description 复位设备
         * @param fn
         */
        resetSiu: function (fn) {
            var param = {
                lTimeout: 3000
            };
            fox.device.call("SIU", "ResetDevice", param, fn);
        },
        /**
         * @description 设置灯
         * @param fn
         */
        setSIU: function (iLight, iStatus, fn) {
            /*iLight:
            0---身份证|WFS_SIU_SCANNER
            1---电动磁卡读卡器|WFS_SIU_CARDUNIT
            2---凭条|WFS_SIU_RECEIPTPRINTER
            3---Ukey|WFS_SIU_ENVDISPENSER
            4---密码键盘|WFS_SIU_PINPAD
            5---存折打印机|WFS_SIU_PASSBOOKPRINTER
            6---指纹指示灯|14
            7---激光打印机指示灯|WFS_SIU_NOTESDISPENSER
            8---非接|13
            9---票据扫描|WFS_SIU_BILLACCEPTOR
            10--票据发售|WFS_SIU_COINDISPENSER

            iStatus:
            0---关灯
            1---慢闪
            2---中闪
            3---快闪
            4---常亮*/
            var param = {
                iLight: iLight,
                iStatus: iStatus,
                iTimeOut: 3000
            };
            fox.device.call("SIU", "SetGuidLight", param, fn);
        },
        /**
         * @description 获取门状态
         * @param fn
         */
        getDoorStatus: function (lType,fn) {
            //参数，输入：lType 门类型
            //  0      前门
            //	1      后门
            //	2      侧门
            //	3      操作员开关
            //	4      人接近

            //输入：  lTimeout   超时时间
            var param = {
                iType: lType,
                iTimeOut: 0
            };
            fox.device.call("SIU", "GetDoorStatus", param, fn);
        },
        //--------------------------------------------9.Ukey模块-------------------------//
        /**
         * @description 打开设备
         * @param fn
         */
        openUkey: function (fn) {
            fox.device.call("Ukey", "OpenDev", {}, fn);
        },
        /**
         * @description 关闭设备
         * @param fn
         */
        closeUkey: function (fn) {
            fox.device.call("Ukey", "CloseDev", {}, fn);
        },
        /**
         * @description 获取设备状态
         * @param fn
         */
        getDeviceStatusByUkey: function (fn) {
            var param = {
                lTimeout: 0
            };
            fox.device.call("Ukey", "GetDeviceStatus", param, fn);
        },
        /**
         * @description 复位设备
         * @param fn
         */
        resetUkey: function (fn) {

            var param = {
                lOptionType: 1, //lOptionType复位方式：0 如果通道有卡，则将卡退出；1 如果通道有卡，则将卡放入废卡箱；2 如果通道中有卡，不做任何操作
                lTimeout: 0
            };
            fox.device.call("Ukey", "ResetDevice", param, fn);
        },


        /**
         * @description 读u盾
         */
        readUkey: function (fn) {
            var callback = function (data) {
                var info = "";
                if (data.success) {
                    var result = data.result;
                    var pInfo = result.Info;
                    var retValue = result.__retvalue;
                    info = {
                        msg: pInfo,
                        retValue: retValue
                    }
                    if (typeof fn === 'function')
                        fn({
                            info: info
                        })
                } else {
                    fn(info)
                }
            }
            var param = {
                lTimeOut: 30000
            };
            fox.device.call("Ukey", "ReadQRDATA", param, callback);
        },


        /**
         * @description 发盾口有无u盾
         */
        GetHaveCardUkey: function (fn) {
            // CR_NOCARD				8          //无卡
            // CR_HAVECARD				9          //有卡

            var callback = function (data) {
                var state = "";
                if (data.success) {
                    state = result['__retvalue'];
                    if (typeof fn === 'function') {
                        fn(state);
                    }
                } else {
                    fn(state);
                }
            };

            var param = {
                lTimeOut: 30000
            };
            fox.device.call("Ukey", "GetHaveCard", param, callback);
        },
        /**
         * @description 弹出用户插入的卡
         */
        ejectUkey: function (fn) {
            var param = {
                lTimeOut: 30000
            };
            fox.device.call("Ukey", "EjectIdenCard", param, fn);
        },
        /**
         * @description 吞卡
         * @param fn
         */
        retainUkey: function (fn) {
            var param = {
                lTimeOut: 30000
            };
            fox.device.call("Ukey", "RetainCard", param, fn);
        },
        /**
         * @description 获取卡箱信息
         * @param fn
         */
        GetCardUnitInfoByUkey: function (fn) {
            var callback = function (data) {
                if (data.success) {
                    //Info长度为100，存放卡箱信息，格式：//卡箱1状态-卡箱1数量|卡箱2状态-卡箱2数量|废卡箱1状态-废卡箱1数量|废卡箱2状态-废卡箱2数量|
                    //发卡箱状态1正常   2卡少   0卡箱空你 3卡箱被移走   4卡箱故障
                    //废卡箱状态1正常   2快满   3满       4故障
                    var box;
                    if (data.success) {
                        var result = data.result;
                        var pInfo = result.Info;
                        var retValue = result.__retvalue;
                        var pInfoArray = pInfo.split("|");
                        box = {
                            cardBox1: pInfoArray[0].split("-")[0],
                            cardBox2: pInfoArray[1].split("-")[0],
                            fCardBox1: pInfoArray[2].split("-")[0],
                            fCardBox2: pInfoArray[3].split("-")[0],
                            retValue: retValue,
                        }

                    }
                    if (typeof fn === 'function')
                        fn({
                            box: box
                        })
                } else {
                    if (typeof fn === 'function')
                        fn({
                            box: undefined
                        });
                }
            }
            var param = {
                lTimeOut: 30000
            };
            fox.device.call("Ukey", "GetCardUnitInfo", param, callback);
        },
        /**
         * @description 清空回收箱
         * @param fn
         */
        zeroUkeyRetainNum: function (fn) {
            var param = {
                lTimeOut: 0
            };
            fox.device.call("Ukey", "ZeroRetainNum", param, fn);
        },
        /**
         * @description 发卡
         * @param fn
         */
        dispenseUkey: function (num, fn) {
            var param = {
                CardUnit: num, //卡箱号  1  2
                lTimeOut: 30000
            };
            fox.device.call("Ukey", "DispenseCard", param, fn);
        },
        /**
         * @description 设置卡箱数量
         * @param fn
         */
        setUkeyUnitInfo: function (num1, num2, fn) {
            var param = {
                CardUnit: num1,
                lCardNumber: num2,
                lTimeOut: 0
            };
            fox.device.call("Ukey", "SetCardUnitInfo", param, fn);
        },


        //-------------------------------------普通摄像头调用----------------------------------//
        // /**
        //  * @description 启动摄像头
        //  * */
        // OpenCamera:function(cusNo,fn){
        //     var params={
        //         pCustomerNo:cusNo
        //     }
        //     fox.device.call("Camera", "VideoTapeStart",params, fn)
        // },
        // /**
        //  * @description 关闭摄像头
        //  * */
        // CloseCamera:function(fn){
        //     fox.device.call("Camera", "VideoTapeStop",{}, fn)
        // },
        // /*
        //  *
        //  <DeviceInterface FuncName="TakePicture" RetType="int">
        //  <Args>
        //  <FunctionArg Type="wchar_t*" Name="pPicPath"/>
        //  <FunctionArg Type="wchar_t*" Name="pBase64Data" Len="9999999" IsOutArg="true"/>
        //  <FunctionArg Type="int*" Name="lBase64Len" Len="9999999" IsOutArg="true"/>
        //  <FunctionArg Type="wchar_t*" Name="ErrorInfo" Len="4096" IsOutArg="true"/>
        //  <FunctionArg Type="int*" Name="pErrLen" Len="4096" IsOutArg="true"/>
        //  </Args>
        //  </DeviceInterface>
        //  * */
        // TakePicture:function(fn){
        //     var param =
        //         {
        //             // pPicPath :''
        //             pPicPath :'D:\\pic.jpg'
        //         };
        //     fox.device.call("Camera", "TakePicture",param, fn)
        // },
        // /*
        //  *
        //  <DeviceInterface FuncName="DisplayVideo" RetType="int">
        //  <Args>
        //  <FunctionArg Type="int" Name="lType"/>
        //  <FunctionArg Type="int" Name="wX"/>
        //  <FunctionArg Type="int" Name="wY"/>
        //  <FunctionArg Type="int" Name="wWidth"/>
        //  <FunctionArg Type="int" Name="wHeight"/>
        //  <FunctionArg Type="wchar_t*" Name="ErrorInfo" Len="4096" IsOutArg="true"/>
        //  <FunctionArg Type="int*" Name="pErrLen" Len="4096" IsOutArg="true"/>
        //  </Args>
        //  </DeviceInterface>
        //  * */
        // DisplayVideo:function(num,fn){
        //     //num 1打开 2暂停 3继续 4销毁
        //     var param =
        //         {
        //             lType:num,
        //             wX:window.innerWidth/2-200,
        //             wY:window.innerHeight/2-200,
        //             wWidth:400,
        //             wHeight:400
        //         };
        //     fox.device.call("Camera", "DisplayVideo",param, fn)
        // },

        //--------------------------------------10.双目摄像头模块---------------------------------------//
        TakePictureDouble: function (fn) {
            var param = {
                // pPicPath :''
                pPicPath: 'D:\\pic.jpg'
            };
            fox.device.call("DoubleCamera", "TakePicture", param, fn)
        },
        //双目摄像头
        DisplayVideoDouble: function (num, fn) {
            //num 1打开 2暂停 3继续 4销毁
            var param = {
                iType: num,
                wX: window.innerWidth / 2 - 200,
                wY: window.innerHeight / 2 - 200,
                wWidth: 400,
                wHeight: 400
            };
            fox.device.call("DoubleCamera", "DisplayVideo", param, fn)
        },
        /**
         * @description 双目启动摄像头
         * */
        OpenCameraDouble: function (fn) {
            var params = {}
            fox.device.call("DoubleCamera", "OpenDev", params, fn)
        },
        /**
         * @description 双目重置摄像头
         * */
        ResetCameraDouble: function (fn) {
            var params = {
                iTimeOut: 30000
            }
            fox.device.call("DoubleCamera", "ResetDevice", params, fn)
        },
        /**
         * @description 双目关闭摄像头
         * */
        CloseCameraDouble: function (fn) {
            fox.device.call("DoubleCamera", "CloseDev", {}, fn)
        },
       /*  Localoption: function (data1, data2, fn) {
            var param = {
                pType: data1,
                pKey: data2,
                pPath: "C:\\ZZAgent\\etc\\devstatus.ini"
            };
            fox.device.call("localoption", "GetInFormation", param, fn)
        }, */

        //读取本地文件
        GetFileData: function (filename, fnc) {
            var param = {
                pPath: "D:\\XJFileData\\" + filename
            };
            fox.device.call("localoption", "GetFileData", param, fnc);
        },
        SetFileData: function (filename, data, fnc) {
            // alert("fileName:"+filename+"  data:"+data);
            var param = {
                pPath: "D:\\XJFileData\\",
                pFileName: filename,
                Value: data
            };
            fox.device.call("localoption", "SetFileData", param, fnc);
        },



        //----------------------------11.对私/对公(现金)模块开始--------------------------------------
        /**
         * 钞箱信息查询
         * 返回格式: 箱号|现金面额|最大存放量|已使用量|钞箱状态(1满2即将满3即将空4空)
         * @param fnc
         */
        CashAcceptBoxInfo: function (fnc) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CashAccept", "GetCashUnitInfo", param, fnc);
        },
        /**
         * 钞箱信息查询 单存单取箱获取朝向信息的方法
         * 返回格式: 箱号|现金面额|最大存放量|已使用量|钞箱状态(1满2即将满3即将空4空)
         * @param fnc
         */
        CashAcceptBoxInfoSingle: function (fnc) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CashAccept", "GetCashUnitInfoSingle", param, fnc);
        },
        /**
         * 获取设备状态
         * @param fnc
         */
        CashAcceptGetStatus: function (fnc) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CashAccept", "GetStatus", param, fnc);
        },
        /**
         * 点钞
         * @param fnc
         */
        CashAcceptUnitCount: function (fnc) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CashAccept", "CashUnitCount", param, fnc);
        },
        /**
         * 加钞
         * @param fnc
         */
        /* CashAcceptAddCashSingle: function (usNumber, ulValues, ulCount, fnc) {
            var param = {
                iTimeOut: 30000,
                usNumber: usNumber, //钞箱号
                ulValues: ulValues, //面额
                ulType: '2', //钞箱类型  1 循环箱  2  单存箱
                ulCount: ulCount //数量

            }
            fox.device.call("CashAccept", "AddCashSingle", param, fnc);
        }, */
        /**
         * 加钞
         * @param fnc
         */
        CashAcceptAddCash: function (usNumber, ulValues, ulCount, ulType, fnc) {
            var param = {
                iTimeOut: 30000,
                usNumber: usNumber, //钞箱号
                ulValues: ulValues, //面额
                ulType: ulType, //钞箱类型  1 循环箱  2  单存箱
                ulCount: ulCount //数量

            }
            fox.device.call("CashAccept", "AddCashSingle", param, fnc);
        },
        /**
         * 清机
         * @param fnc
         */
        CashAcceptClearMachine: function (fnc) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CashAccept", "ClearMachine", param, fnc);
        },
        /**
         * 现金存入模块 打开设备
         * @param fnc
         * @constructor
         */
        CashAcceptOpenDev: function (fnc) {
            fox.device.call("CashAccept", "OpenDev", {}, fnc);
        },
        /**
         * 关闭设备
         * @param fnc
         * @constructor
         */
        CashAcceptCloseDev: function (fnc) {
            fox.device.call("CashAccept", "CloseDev", {}, fnc);
        },
        /**
         * 重置设备
         * @param num
         * @param fnc
         * @constructor
         */
        CashAcceptResetDevice: function (fnc) {
            var param = {
                usNumber: 0,
                iTimeOut: 30000
            }
            fox.device.call("CashAccept", "ResetDevice", param, fnc);
        },
        /**
         *  打开闸门
         * @param num
         * @param fnc
         * @constructor
         */
        CashAcceptOpenShutter: function (fnc) {
            var param = {
                iPostion: 0,
                iTimeOut: 30000,
            }
            fox.device.call("CashAccept", "OpenShutter", param, fnc);
        },
        /**
         * 关闭闸门
         * @param num
         * @param fnc
         * @constructor
         */
        CashAcceptCloseShutter: function (fnc) {
            var param = {
                iPostion: 0,
                iTimeOut: 30000,
            }
            fox.device.call("CashAccept", "CloseShutter", param, fnc);
        },
        /**
         * 开始存钱
         * @param {1是循环箱 0 是固定单存单取箱} bUseRecycleUnits 
         * @param {*} fnc 
         */
        CashAcceptCashInStart: function (bUseRecycleUnits,fnc) { //todo  待优化
            var param = {
                iTellerID: 0, //如果用强存的话  该值为 1 bUseRecycleUnits为 0
                iOutputPosition: 0,
                iInputPosition: 0,
                iTimeOut: 30000,
                bUseRecycleUnits: bUseRecycleUnits, //是循环箱还是固定箱子  1是循环箱   0 是固定单存单取箱
            }
            console.log('cashInStart上传数据：' + JSON.stringify(param));
            fox.device.call("CashAccept", "CashInStart", param, fnc);
        },
        /**
         * 设置存款是否拒钞
         * @param fnc
         * @constructor
         */
        SetNoteTypes: function (obj, fnc) {
            var param = {
                iTimeOut: 30000,
                ulValue100: Number(obj.ulValue100), //拒钞额度  有就传对应额度，没有传 0
                ulValue50: Number(obj.ulValue50), //拒钞额度  有就传对应额度，没有传 0
                ulValue20: Number(obj.ulValue20), //拒钞额度  有就传对应额度，没有传 0
                ulValue10: Number(obj.ulValue10), //拒钞额度  有就传对应额度，没有传 0
                ulValue5: Number(obj.ulValue5), //拒钞额度  有就传对应额度，没有传 0
                ulValue1: Number(obj.ulValue1), //拒钞额度  有就传对应额度，没有传 0
            }
            fox.device.call("CashAccept", "SetNoteTypes", param, fnc);
        },
        /**
         * 存款限额
         * @param amount
         * @param fnc
         * @constructor
         */
        CashAcceptCashInLimit: function (amount, fnc) {
            var param = {
                amount: amount,
                iTimeOut: 30000
            }
            fox.device.call("CashAccept", "CashInLimit", param, fnc);
        },
        CashInTimer: null,
        CashInTimerOpen: function () {
            var timerLastMsg = '';
            var iTimeOut = 60000;
            if (!!fox.bus.get('cashInTimeOut')) {
                iTimeOut = Number(fox.bus.get('cashInTimeOut')) * 1000;
            }
            var timerLast = (iTimeOut) / 1000;
            STM.device.CashInTimer = setInterval(function () {
                timerLast = timerLast - 1;
                timerLastMsg = '超时倒计时：' + timerLast;
                fox.bus.put('timerLastMsg', timerLastMsg);
                if (timerLast == 0) {
                    //fox.bus.remove('timerLastMsg');
                    //clearInterval(STM.device.CashInTimer);
                    //STM.device.CashInTimer = null;
                    STM.device.CashInTimerClose();
                }
            }, 1000);
        },
        CashInTimerClose: function () {
            clearInterval(STM.device.CashInTimer);
            STM.device.CashInTimer = null;
            fox.bus.remove('timerLastMsg');
        },
        /**
         * 存钱
         * @param fnc
         * @constructor
         */
        CashAcceptCashIn: function (fnc) {
            var param = {
                iTimeOut: 60000,
            }
            if (!!fox.bus.get('cashInTimeOut')) {
                param.iTimeOut = Number(fox.bus.get('cashInTimeOut')) * 1000;
            }
            STM.device.CashInTimerOpen();
            var callBackCashAcceptCashIn = function (data) {
                //setTimeout(function(){
                //    clearInterval(STM.device.CashInTimer);
                //    STM.device.CashInTimer = null;
                //    fox.bus.remove('timerLastMsg');
                STM.device.CashInTimerClose();
                fnc(data);
                //},70000);
            }
            fox.device.call("CashAccept", "CashIn", param, callBackCashAcceptCashIn);
        },
        /**
         * 结束存钱
         * @param fnc
         * @constructor
         */
        CashAcceptCashInEnd: function (fnc) {
            var param = {
                iTimeOut: 30000,
            }
            fox.device.call("CashAccept", "CashInEnd", param, fnc);
        },
        /**
         * 存钱状态(获取上一笔存款结果)(iStatus-状态,iCashInCount-只有张数)
         * @param fnc
         * @constructor
         */
        CashAcceptGetCashInStatus: function (fnc) {
            var param = {
                iTimeOut: 30000,
            }
            fox.device.call("CashAccept", "GetCashInStatus", param, fnc);
        },
        /**
         * 取消存款
         * @param {*} fnc 
         */
        CashAcceptCashInRollback: function (fnc) {
            var param = {
                iTimeOut: 300000,
            }
            fox.device.call("CashAccept", "CashInRollback", param, fnc);
        },
        //todo  暂时未知
        CashAcceptGetCapabilities: function (fnc) {
            var param = {
                iTimeOut: 30000,
            }
            fox.device.call("CashAccept", "GetCapabilities", param, fnc);
        },
        //获取钞箱详细信息
        GetCashUnitInfodetails: function (fnc) {
            var param = {
                iTimeOut: 30000,
            }
            fox.device.call("CashAccept", "GetCashUnitInfodetails", param, fnc);
        },
        //---------------------------------------12.现金取出模块(待完善)-----------------------------//
        /**
         * 取出模块-打开设备
         * @param fnc
         * @constructor
         */
        CashDispenserOpenDev: function (fnc) {
            fox.device.call("CashDispenser", "OpenDev", {}, fnc);
        },
        /**
         *   关闭设备
         * @param fnc
         * @constructor
         */
        CashDispenserCloseDev: function (fnc) {
            fox.device.call("CashDispenser", "CloseDev", {}, fnc);
        },
        /**
         * 重置设备
         * @param fnc
         * @constructor
         */
        CashDispenserResetDevice: function (fnc) {

            var param = {
                usNumber: 0,
                iTimeOut: 30000,
            }

            fox.device.call("CashDispenser", "ResetDevice", param, fnc);
        },
        /**
         * 清机
         * @param fnc
         */
        CashDispenserClearMachine: function (fnc) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CashDispenser", "ClearMachine", param, fnc);
        },
        /**
         * 钞箱信息查询
         * 返回格式: 箱号|现金面额|最大存放量|已使用量|钞箱状态(1满2即将满3即将空4空)
         * @param fnc
         */
        CashDispenserBoxInfo: function (fnc) {
            var param = {
                iTimeOut: 30000,
            }
            fox.device.call("CashDispenser", "GetCashUnitInfo", param, fnc);
        },
        /**
         * 获取设备状态
         * 只返回了设备状态
         * @param fnc
         */
        CashDispenserGetStatus: function (fnc) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CashDispenser", "GetStatus", param, fnc);
        },
        /**
         * 取款获取钞口信息
         * @param fnc
         * @constructor
         */
        CashGetBanknoteMouth: function (fnc) {
            var param = {
                iTimeOut: 30000
            }
            fox.device.call("CashDispenser", "GetBanknoteMouth", param, fnc);
        },
        /**
         * 设置取款配额
         *
         *
         */
        GetCashNum: function (money, fnc) {
            var param = {
                iTimeOut: 30000,
                iAmount: money,
            }
            fox.device.call("CashDispenser", "GetCashNum", param, fnc);
        },
        /**
         * 打开闸门
         * @param fnc
         * @constructor
         */
        CashDispenserOpenShutter: function (fnc) {

            var param = {
                iPostion: 0,
                iTimeOut: 3000,
            }

            fox.device.call("CashDispenser", "OpenShutter", param, fnc);
        },
        /**
         * 关闭闸门
         * @param fnc
         * @constructor
         */
        CashDispenserCloseShutter: function (fnc) {

            var param = {
                iPostion: 0,
                iTimeOut: 3000,
            }

            fox.device.call("CashDispenser", "CloseShutter", param, fnc);
        },
        /**
         * 取款
         * @param money
         * @param fnc
         * @constructor
         */
        CashDispenserCashDispense: function (money, fnc) {

            var param = {
                iPosition: 0,
                iAmount: money,
                iPresent: true,
                iTimeOut: 300000, //默认5分钟
            }
            //if(!!fox.bus.get('cashDispenseTimeOut')){
            //    param.iTimeOut = Number(fox.bus.get('cashDispenseTimeOut'))*1000;
            //}
            //var timerLast = (param.iTimeOut)/1000;
            //var timerLastMsg = '';
            //var timerCashDispense = setInterval(function(){
            //    timerLast = timerLast-1;
            //    timerLastMsg = '超时倒计时：'+timerLast;
            //    fox.bus.put('timerLastMsg',timerLastMsg);
            //    if(timerLast == 0){
            //        fox.bus.remove('timerLastMsg');
            //        clearInterval(timerCashDispense);
            //    }
            //},1000);
            var callBackCashDispense = function (data) {
                //setTimeout(function(){
                //clearInterval(timerCashDispense);
                //fox.bus.remove('timerLastMsg');
                fnc(data);
                //},70000);
            }
            fox.device.call("CashDispenser", "CashDispense", param, callBackCashDispense);
        },
        /**
         * 取钞获取上一笔信息(异常时调用)  格式//箱号|数量@吐钞总额
         * @constructor
         */
        GetLastTransaction: function () {
            var param = {
                iTimeOut: 30000,
            }

            fox.device.call("CashDispenser", "GetLastTransaction", param, fnc);
        },
        //----------------------------对私/对公(现金)模块结束--------------------------------------

        //----------------------------13.非接模块开始--------------------------------------
        /**
         * 打开非接设备
         * @param fnc
         * @constructor
         */
        ContactOpenDev: function (fnc) {
            fox.device.call("ContactlessReader", "OpenDev", {}, fnc);
        },
        ContactResetDev: function (fnc) {
            var param = {
                iTimeOut: 30000,
            }
            fox.device.call("ContactlessReader", "ResetDevice", param, fnc);
        },
        /**
        /**
         * 关闭非接设备
         * @param fnc
         * @constructor
         */
        ContactCloseDev: function (fnc) {
            fox.device.call("ContactlessReader", "CloseDev", {}, fnc);
        },
        /**
         * 非接设备读卡
         * @param fnc
         * @constructor
         */
        ContactReadCard: function (fnc) {
            this.setSIU(8, 4, function () {})
            var param = {
                iTrackType: 0, //dll没用用到此参数
                iTimeOut: 30000,
            }
            fox.device.call("ContactlessReader", "ReadCard", param, function (data) {
                STM.device.setSIU(8, 0, function () {});
                fnc(data);
            });
        },
        /**
         * 退卡
         * @param fnc
         * @constructor
         */
        ContactEjectCard: function (fnc) {
            var param = {
                iTimeOut: 3000,
            }
            fox.device.call("ContactlessReader", "EjectCard", param, fnc);
        },
        /**
         * 获取设备状态
         * @param fnc
         * @constructor
         */
        ContactGetDeviceStatus: function (fnc) {
            var param = {
                iTimeOut: 3000,
            }
            fox.device.call("ContactlessReader", "GetDeviceStatus", param, fnc);
        },
        /**
         * 取消操作
         * @param fnc
         * @constructor
         */
        ContactCancelInsert: function (fnc) {
            var param = {}
            fox.device.call("ContactlessReader", "CancelInsert", param, fnc);
        },
        //----------------------------13.非接模块结束------------------------------------//

        //---------------------------------14.票据模块开始------------------------------------------//
        /**
         * 票据模块打开
         * @param fnc
         * @constructor
         */
        BillOpenDev: function (fnc) {
            fox.device.call("BillScanner", "OpenDev", {}, fnc);
        },
        /**
         * 票据模块关闭
         * @param fnc
         * @constructor
         */
        BillCloseDev: function (fnc) {
            fox.device.call("BillScanner", "CloseDev", {}, fnc);
        },
        /**
         * 退出票据
         * @param fnc
         * @constructor
         */
        BillEjecetMedia: function (fnc) {
            this.setSIU(9, 0, function () {})
            var param = {
                iControl: 1,
                iTimeOut: 3000,
            }
            fox.device.call("BillScanner", "EjecetMedia", param, fnc);
        },
        /**
         * 回收 压箱票据
         * @param fnc
         * @constructor
         */
        BilltunMedia: function (fnc) {
            this.setSIU(9, 0, function () {})
            var param = {
                iControl: 2,
                iTimeOut: 3000,
            }
            fox.device.call("BillScanner", "EjecetMedia", param, fnc);
        },
        /**
         * 复位票据模块
         * @param fnc
         * @constructor
         */
        BillResetDevice: function (fnc) {
            var param = {
                iTimeOut: 3000
            }
            fox.device.call("BillScanner", "ResetDevice", param, fnc);
        },
        /**
         *  BIll取消读模块
         * @param fnc
         * @constructor
         */
        BillCancelInsert: function (fnc) {
            this.setSIU(9, 0, function () {})
            var param = {}
            fox.device.call("BillScanner", "CancelInsert", param, fnc);
        },
        /**
         * 读取票据模块
         * @param iScanMode：1存单，2转账支票，3现金支票 fnc
         * @constructor
         */
        BillScan: function (iScanMode, fn) {
            this.setSIU(9, 4, function () {})
            var fnc = function (data) {
                fox.layer.closeAll();
                if (data.success) {
                    var bill;
                    var result = data.result;
                    var a = result['__retvalue'];

                    bill = {
                        pFrontData: result.pFrontData, //票据正面影响base64
                        pBackData: result.pBackData, //票据背面影响base64
                        pValue: result.pValue, //票号,账号数据
                        result: a
                    }
                    if (typeof fn === 'function') {
                        fn({
                            bill: bill
                        })
                    }
                } else {
                    if (typeof fn === 'function')
                        fn({
                            bill: undefined
                        });
                }
            }
            var param = {
                iScanMode: Number(iScanMode),
                iTimeOut: 30000,
            }
            fox.device.call("BillScanner", "BillScan", param, fnc);
        },
        /**
         * 获取票据模块状态
         * @param fnc
         * @constructor
         */
        BillGetDeviceStatus: function (fnc) {
            var param = {
                iTimeOut: 3000,
            }
            //statusInfo 8|0   0 扫描仪有票 1没有票  5 票据在入口
            fox.device.call("BillScanner", "GetDeviceStatus", param, fnc);
        },
        //---------------------------------14.票据模块结束----------------------------------------//

        //---------------------------------15.票据售卖模块开始----------------------------------------//
        /**
         * 票据售卖 打开
         * @param fnc
         * @constructor
         */
        BillSellerOpenDev: function (fnc) {
            fox.device.call("BillSeller", "OpenDev", {}, fnc);
        },
        /**
         * 票据售卖 关闭
         * @param fnc
         * @constructor
         */
        BillSellerCloseDev: function (fnc) {
            fox.device.call("BillSeller", "CloseDev", {}, fnc);
        },
        /**
         * 票据售卖 重置
         * @param fnc
         * @constructor
         */
        BillSellerResetDevice: function (fnc) {
            var param = {
                iTimeOut: 3000
            };
            fox.device.call("BillSeller", "ResetDevice", param, fnc);
        },
        /**
         * 票据售卖模块 退票
         * @param fnc
         * @constructor
         */
        BillSellerEjecetMedia: function (fnc) {
            this.setSIU(10, 0, function () {})
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("BillSeller", "EjecetMedia", param, fnc);
        },
        /**
         * 票据售卖 获取状态
         * @param fnc
         * @constructor
         */
        BillSellerGetDeviceStatus: function (fnc) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("BillSeller", "GetDeviceStatus", param, fnc);
        },
        /**
         * 票据售卖 获取售卖模块所有状态
         * @param fnc
         * @constructor
         */
        BillSellerGetDeviceStatusAll: function (fnc) {
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("BillSeller", "GetDeviceStatusAll", param, fnc);
        },
        /**
         *  票据售卖 打印
         * @param data
         * @param fnc
         * @constructor
         */
        BillSellerPrintData: function (imgName, data, fnc) {
            var param = {
                iSlotNum: 1, //纸槽编号
                iCheckCount: 1, //打印的票据张数
                pchCheckStartNo: "0000023", //打印票据的票号
                pchTwoDimCodePicDir: imgName, //需打印图片的路径
                iTwoDimCodePicXPos: 148, //图片在票据上打印位置的 x坐标   单位:毫米
                iTwoDimCodePicYPos: 37, //图片在票据上打印位置的 y坐标   单位:毫米
                iCheckWidth: 193, //票据的宽度
                iCheckHeight: 88, //票据的高度
                iAdjX: 0, //固定值
                iAdjY: 0, //固定值
                iType: 1, //票据类别  1:存单
                iMagCodeX: 10, //暂未使用
                iMagCodeY: 40, //暂未使用
                pchMagCodeList: '12312331', //暂未使用
                pchContent: data, //具体的打印位置和待打印的数据
                iTimeOut: 30000
            };
            fox.device.call("BillSeller", "PrintData", param, fnc);
        },
        /**
         * 票据售卖 扫描票据
         * @param fnc
         * @constructor
         */
        BillSellerReadMagic: function (fnc) {
            this.setSIU(10, 4, function () {})
            var param = {
                iTimeOut: 30000
            };
            fox.device.call("BillSeller", "ReadMagic", param, fnc);
        },

        //---------------------------------15.票据售卖模块结束----------------------------------------//
        //---------------------------------16.存折模块开始-------------------------------------------//
        //取消读存折
        CancelReadPassBook: function (fn) {
            this.setSIU(5, 0, function () {})
            var param = {};
            fox.device.call("PassBookPrinter", "CancelRead", param, fn)
        },
        //打开存折模块
        OpenPassBook: function (fn) {
            var param = {

            };
            fox.device.call("PassBookPrinter", "OpenDev", param, fn)
        },
        //关闭存折模块
        ClosePassBook: function (fn) {
            var param = {

            };
            fox.device.call("PassBookPrinter", "CloseDev", param, fn)
        },
        //获取状态存折模块
        GetStatusPassBook: function (fn) {
            var param = {
                iTimeOut: 3000
            };
            fox.device.call("PassBookPrinter", "GetDeviceStatus", param, fn)
        },
        //读磁道然后退存折
        ReadPassBookTrack: function (fn) {
            this.setSIU(5, 4, function () {})
            var fnc = function (data) {
                fox.layer.closeAll();
                STM.device.setSIU(5, 0, function () {});
                console.log('存折读出来的东西：' + JSON.stringify(data));
                if (data.success) {
                    var book;
                    var result = data.result;
                    var a = result['__retvalue'];

                    book = {
                        cardNo: result.pTrack, //存折账号
                        result: a
                    }
                    if (typeof fn === 'function') {  
                        fn({
                            book: book
                        })
                    }
                } else {
                    if (typeof fn === 'function')
                        fn({
                            book: undefined
                        });
                }
            }

            var param = {
                iTimeOut: 30000
            };
            fox.device.call("PassBookPrinter", "ReadPassBookTrack", param, fnc)
        },
        //发送打印内容
        SendPassBookData: function (pData, fn) {
            this.setSIU(5, 4, function () {});
            var param = {
                pData: pData,
            };
            fox.device.call("PassBookPrinter", "SendPassBookData", param, fn)
        },
        //打印并退存折
        PrintAndEject: function (num, fn) {
            var param = {
                iStartLine: num,
                iTimeOut: 30000
            };
            fox.device.call("PassBookPrinter", "PrintAndEject", param, function (data) {
                STM.device.setSIU(5, 0, function () {});
                fn(data)
            })
        },
        //复位存折
        ResetPassBook: function (fn) {
            var param = {
                iTimeOut: 3000
            };
            fox.device.call("PassBookPrinter", "ResetDevice", param, fn)
        },
        //退存折
        EjecetPassBook: function (fn) {
            this.setSIU(5, 0, function () {});
            var param = {
                iTimeOut: 3000
            };
            fox.device.call("PassBookPrinter", "EjecetMedia", param, fn)
        },
        /**
         * 
         * @param {打印数据} fieldsValue 
         * @param {存折类型  1.储蓄存折、2.结算存折、3.登记簿} type 
         * @param {回调函数} fn 
         */

        FormPrintPassBook: function (fieldsValue, type, fn) {
            var param = {
                formName: 'PassBook_Yusys',
                mediaName: 'PassbookMedia_Yusys',
                fieldsValue: fieldsValue,
                iOffsetX: 0,
                iOffsetY: 0,

            };
            if (type == 2) {
                param.formName = "PassBook_Yusys2";
                param.mediaName = "PassbookMedia_Yusys2";
            } else if (type == 3) {
                param.formName = "PassBook_Yusys3";
                param.mediaName = "PassbookMedia_Yusys3";
            }
            fox.device.call("PassBookPrinter", "FormPrint", param, fn);
        },
        //--------------------------------16.存折模块结束----------------------------//
        //--------------------------------17.手写板模块-------------------------------//
        /**
         * 写字板打开
         * @param fnc
         */
        writeOpenDev: function (fnc) {
            fox.device.call("WriteBoard", "OpenDev", {}, fnc);
        },
        /**
         * 写字板关闭
         * @param fnc
         */
        writeCloseDev: function (fnc) {
            fox.device.call("WriteBoard", "CloseDev", {}, fnc);
        },
        /**
         * 重置写字板
         * @param fnc
         */
        writeResetDevice: function (fnc) {
            fox.device.call("WriteBoard", "ResetDevice", {}, fnc);
        },
        /**
         * 打开写字板窗体
         * @param fnc
         */
        writeOpenDisplay: function (fnc) {
            var param = {
                iwAction: 0,
                iwWidth: 650,
                iwHeight: 330,
                iwX: 315,
                iwY: 315,
                iTimeOut: 30000
            };
            fox.device.call("WriteBoard", "OpenDisplay", param, fnc);
        },
        /**
         * 销毁签字版窗体
         * @param fnc
         */
        writeDestroyDisplay: function (fnc) {
            var param = {
                iwAction: 1,
                iwWidth: 650,
                iwHeight: 330,
                iwX: 315,
                iwY: 315,
                iTimeOut: 30000
            };
            fox.device.call("WriteBoard", "DestroyDisplay", param, fnc);
        },
        /**
         * 清空窗体
         * @param fnc
         */
        writeEraseDisplay: function (fnc) {
            var param = {
                iwAction: 4,
                iwWidth: 650,
                iwHeight: 330,
                iwX: 315,
                iwY: 315,
                iTimeOut: 30000
            };
            fox.device.call("WriteBoard", "EraseDisplay", param, fnc);
        },
        /**
         * 获取图片
         * @param fnc
         */
        writeGetSignPhoto: function (fnc, name) {
            var param = {
                lpstrPath: "D://sign.png",
                picPath: "D://signTrack.txt",
                iTimeOut: 30000
            };
            fox.device.call("WriteBoard", "getSignPhoto", param, fnc);
        },

        //------------------------18.回单打印模块-------------------------------//
        //打开回单
        openHd: function (fn) {
            var param = {};
            fox.device.call("ReceiptPrinting", "OpenDev", param, fn);
        },
        //关闭回单
        closeHd: function (fn) {
            var param = {};
            fox.device.call("ReceiptPrinting", "CloseDev", param, fn);
        },
        //获取回单状态
        getHdStatus: function (fn) {
            var param = {
                iTimeOut: '30000'
            };
            fox.device.call("ReceiptPrinting", "GetDeviceStatus", param, fn);
        },
        //回单打印
        printHd: function (pData, fn) {
            this.setSIU(7, 4, function () {})
            var param = {
                pData: pData,
                iTimeOut: '30000'
            };
            fox.device.call("ReceiptPrinting", "DataPrint", param, fn);
        },
        //回单重置
        retHd: function (fn) {
            var param = {
                iTimeOut: '30000'
            };
            fox.device.call("ReceiptPrinting", "ResetDevice", param, fn);
        },
        //获取纸槽状态
        GetCapabilityHd: function (fn) {
            var param = {
                iTimeOut: '30000'
            };
            fox.device.call("ReceiptPrinting", "GetCapability", param, fn);
        },
        //取消操作
        cancelHd: function (fn) {
            this.setSIU(7, 0, function () {})
            var param = {};
            fox.device.call("ReceiptPrinting", "CancelInsert", param, fn);
        },
        //出纸
        ControlMediaHd: function (fn) {
            var param = {
                iTimeOut: '30000'
            };
            fox.device.call("ReceiptPrinting", "ControlMedia", param, function (data) {
                STM.device.setSIU(7, 0, function () {})
                fn(data)
            });
        },
        //获取纸箱状态
        GetPaperStatusHd: function (fn) {
            var param = {
                iTimeOut: '30000'
            };
            fox.device.call("ReceiptPrinting", "GetPaperStatus", param, fn);
        },
        // --------------------------------------模块API接口结束--------------------------------------------------//
        //设备初始化操作
        init: function () {
            this.initDeviceCallback();
        },
        // 8. 关闭设备操作
        close: function () {

        },
        //9. 退出设备
        exit: function () {
            this.ejectCardDispenserReader();
            // this.ejectCardDispenser();
            this.ejectCardReader();
            this.ejectIdentifyCard();
            //this.close();
        },
        //10.注册系统响应方法
        registDeviceEvent: function (ev, callback) {
            //对设备类型进行扩展，防止重复
            var extEv = 'stm.device.' + ev;
            fox.eventproxy.once(extEv, callback);
        },
        //11.初始化设备事件回调函数
        initDeviceCallback: function () {
            //现金取款的过程事件
            window.SUBDISPENSEOK = function (data) {};
            //现金取款的结束事件
            window.presented = function (data) {};
            //现金存款的吸收钞票吸入的事件
            window.cashInInserted = function (data) {};
            //票据取走事件
            window.billTakes = function (data) {};
            console.log('initDeviceCallback');
            window.__externalEventHandler = function (str) {
                console.log("receive event : " + str);
                var deviceEventJo = JSON.parse(str);
                if (deviceEventJo.deviceType == 'CardReader' && deviceEventJo.eventName == 'Inserted') {
                    fox.util.lodmod("正在读取银行卡,请稍后...");
                } else if (deviceEventJo.deviceType == 'Identity' && deviceEventJo.eventName == 'Inserted') {
                    fox.util.lodmod("正在读取身份证,请稍后...");
                } else if (deviceEventJo.deviceType == 'BillScanner' && deviceEventJo.eventName == 'Inserted') {
                    console.log("正在读取票据,请稍后...");
                    fox.util.lodmod("正在读取票据,请稍后...");
                } else if (deviceEventJo.deviceType == 'PassBookPrinter' && deviceEventJo.eventName == 'Inserted') {
                    fox.util.lodmod("正在读取存折信息,请稍后...");
                } else if (deviceEventJo.deviceType == 'BillScanner' && deviceEventJo.eventName == 'Removed') {
                    console.log('票已取走');
                    billTakes(deviceEventJo);
                    console.log(fox.bus.get('public', "corporate", "remove"));
                    fox.bus.remove("delaySwallow");
                    console.log("delaySwallow2:" + fox.bus.get("delaySwallow"));
                    if (fox.bus.get('public', "corporate", "remove") == '1') {
                        var msg1 = fox.bus.get("public", "Msg");
                        fox.layer.closeAll();
                        var msg = {
                            index: msg1.source == "CS0010" ? 1 : 2,
                            source: msg1.source,
                            target: 'bill',
                            tradeCode: msg1.tradeCode,
                        }
                        fox.bus.remove('public', "corporate", "remove");
                        fox.router.sendMessage(msg1.source, "submit", msg);
                    }
                } else if (deviceEventJo.deviceType == 'CashDispenser' && deviceEventJo.eventName == 'SUBDISPENSEOK') {
                    console.log('现金取款的过程事件');
                    window.external.XianjinLog('现金取款的过程事件');
                    SUBDISPENSEOK(deviceEventJo);
                } else if (deviceEventJo.deviceType == 'CashDispenser' && deviceEventJo.eventName == 'presented') {
                    console.log('现金取款的结束事件');
                    window.external.XianjinLog('现金取款的结束事件');
                    presented(deviceEventJo);
                } else if (deviceEventJo.deviceType == 'CashAccept' && deviceEventJo.eventName == 'inserted') {
                    console.log('现金存款吸收到钱的事件');
                    window.external.XianjinLog('现金存款吸收到钱的事件');
                    cashInInserted(deviceEventJo);
                } else if (deviceEventJo.deviceType == 'CashDispenser' && deviceEventJo.eventName == 'taken') {
                    console.log('钱已取走');
                    window.external.XianjinLog('钱已取走');
                }
                //非接获取信息太快 弹框探出前就已关闭
                // else if(deviceEventJo.deviceType=='ContactlessReader'&&deviceEventJo.eventName=='Inserted'){
                //     fox.util.lodmod("正在读取卡信息,请稍后...",function(){},"margin-left:0rem");
                // }
                // if(deviceEventJo.eventName=='Removed'){
                //     fox.layer.closeAll();
                // }
                console.log(JSON.stringify(deviceEventJo))
                var extEv = 'stm.device.' + deviceEventJo.deviceType;
                fox.eventproxy.emit(extEv, deviceEventJo);
            };
            window.external.RegistDeviceEventCallback("__externalEventHandler");
        },
    };
    STM.device.init();
    // btop.hui.WinShell.load();

})(window.STM);