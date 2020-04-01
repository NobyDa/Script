/*************************

京东多合一签到脚本

更新时间: 2020.4.2 0:30 v0.92
有效接口: 20+
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
电报频道: @NobyDa 
问题反馈: @NobyDa_bot 
如果转载: 请注明出处

*************************
【 JSbox, Node.js 说明 】 :
*************************

开启抓包app后, Safari浏览器登录 https://bean.m.jd.com 点击签到并且出现签到日历后, 返回抓包app搜索关键字 functionId=signBean 复制请求头Cookie填入以下Key处的单引号内即可 */

var Key = ''; //单引号内自行填写您抓取的Cookie

var DualKey = ''; //如需双账号签到,此处单引号内填写抓取的"账号2"Cookie, 否则请勿填写

/* 注1: 以上选项仅针对于JsBox或Node.js, 如果使用QX,Surge,Loon, 请使用脚本获取Cookie.
   注2: 双账号用户抓取"账号1"Cookie后,请勿点击退出账号,请清除浏览器资料或更换浏览器登录"账号2"抓取.
   注3: 如果复制的Cookie开头为"Cookie: "请把它删除后填入.
   注4: 如果使用QX,Surge,Loon并获取Cookie后, 再重复填写以上选项, 则签到优先读取以上Cookie.

*************************
【 QX, Surge, Loon 说明 】 :
*************************

初次使用时, app配置文件添加脚本配置,并启用Mitm后, Safari浏览器打开登录 https://bean.m.jd.com ,点击签到并且出现签到日历后, 如果通知获得cookie成功, 则可以使用此签到脚本。 注: 请勿在京东APP内获取!!!

由于cookie的有效性(经测试网页Cookie有效周期最长31天)，如果脚本后续弹出cookie无效的通知，则需要重复上述步骤。 签到脚本将在每天的凌晨0:05执行, 您可以修改执行时间。 因部分接口京豆限量领取, 建议调整为凌晨签到。

*************************
【 配置双京东账号签到说明 】 : 
*************************

正确配置QX、Surge、Loon后, 并使用此脚本获取"账号1"Cookie成功后, 请勿点击退出账号,并清除浏览器资料或更换浏览器登录"账号2"获取即可.

注: 获取"账号1"或"账号2"的Cookie后, 后续仅可更新该"账号1"或"账号2"的Cookie.
如需写入其他账号,您可开启脚本内"DeleteCookie"选项以清除Cookie

*************************
【Surge, Loon2.1+ 脚本配置】:
*************************

[Script]
# 京东多合一签到
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

# 获取京东Cookie.
http-request https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBean max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

[MITM]
hostname = api.m.jd.com

*************************
【 QX 1.0.5+ 脚本配置 】 :
*************************

[task_local]
# 京东多合一签到
# 注意此为本地路径, 请根据实际情况自行调整
5 0 * * * JD_DailyBonus.js

[rewrite_local]
# 获取京东Cookie. 
# 注意此为本地路径, 请根据实际情况自行调整.
https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBean url script-request-header JD_DailyBonus.js

[mitm]
hostname = api.m.jd.com

*************************/

var LogDetails = false; //是否开启响应日志, true则开启

var stop = 0; //自定义延迟签到,单位毫秒. 该延迟作用于每个签到接口,如填入延迟则切换为顺序签到. 默认无延迟且为并发签到.

var DeleteCookie = false; //是否清除Cookie, true则开启

var $nobyda = nobyda();
var start = ReadCookie();
async function all() {

  if (stop == 0) {
    await Promise.all([
    JingDongBean(stop), //京东京豆
    JingRongBean(stop), //金融京豆
    JingRongSteel(stop), //金融钢镚
    JingDongTurn(stop), //京东转盘
    JDGroceryStore(stop), //京东超市
    JingDongClocks(stop), //京东钟表馆
    JingDongPet(stop), //京东宠物馆
    JDFlashSale(stop), //京东闪购
    //JingDongBook(stop), //京东图书
    JDSecondhand(stop), //京东拍拍二手
    JingDMakeup(stop), //京东美妆馆
    JingDongWomen(stop), //京东女装馆
    JingDongCash(stop), //京东现金红包
    //JingDongShoes(stop), //京东鞋靴馆
    JingDongFood(stop), //京东美食馆
    JingRSeeAds(stop), //金融看广告
    JingRongGame(stop), //金融游戏大厅
    JingDongLive(stop), //京东智能生活馆
    JingDongClean(stop), //京东清洁馆
    JDPersonalCare(stop), //京东个人护理馆
    JingDongPrize(stop), //京东抽大奖
    JingDongShake(stop) //京东摇一摇
    ])
  } else {
    await JingDongBean(stop); //京东京豆
    await JingRongBean(stop); //金融京豆
    await JingRongSteel(stop); //金融钢镚
    await JingDongTurn(stop); //京东转盘
    await JingDongShake(stop); //京东摇一摇
    await JingDongPrize(stop); //京东抽大奖
    await JDFlashSale(stop); //京东闪购
    await JDGroceryStore(stop); //京东超市
    await JingDongClocks(stop); //京东钟表馆
    await JingDongPet(stop); //京东宠物馆
    //await JingDongBook(stop); //京东图书
    await JDSecondhand(stop); //京东拍拍二手
    await JingDMakeup(stop); //京东美妆馆
    await JingDongWomen(stop); //京东女装馆
    await JingDongCash(stop); //京东现金红包
    //await JingDongShoes(stop); //京东鞋靴馆
    await JingDongFood(stop); //京东美食馆
    await JingRSeeAds(stop); //金融看广告
    await JingRongGame(stop); //金融游戏大厅
    await JingDongLive(stop); //京东智能生活馆
    await JingDongClean(stop); //京东清洁馆
    await JDPersonalCare(stop); //京东个人护理馆
  }

  await JRDoubleSign(stop); //金融双签

  await Promise.all([
  TotalSteel(), //总钢镚查询
  TotalCash(), //总红包查询
  TotalBean() //总京豆查询
  ])
  await notify(); //通知模块
}

var merge = {
  JDBean:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JDTurn:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JRBean:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JRDSign: {success:0,fail:0,bean:0,steel:0,notify:''},
  JDGStore:{success:0,fail:0,bean:0,steel:0,notify:''},
  JDClocks:{success:0,fail:0,bean:0,steel:0,notify:''},
  JDPet:   {success:0,fail:0,bean:0,steel:0,notify:''},
  JDFSale: {success:0,fail:0,bean:0,steel:0,notify:''},
  JDBook:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JDShand: {success:0,fail:0,bean:0,steel:0,notify:''},
  JDMakeup:{success:0,fail:0,bean:0,steel:0,notify:''},
  JDWomen: {success:0,fail:0,bean:0,steel:0,notify:''},
  JDShoes: {success:0,fail:0,bean:0,steel:0,notify:''},
  JRGame:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JRSeeAds:{success:0,fail:0,bean:0,steel:0,notify:''},
  JDLive:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JDCare:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JDFood:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JDClean: {success:0,fail:0,bean:0,steel:0,notify:''},
  JDPrize: {success:0,fail:0,bean:0,steel:0,notify:'',key:0},
  JRSteel: {success:0,fail:0,bean:0,steel:0,notify:'',TSteel:0},
  JDCash:  {success:0,fail:0,bean:0,steel:0,notify:'',Cash:0,TCash:0},
  JDShake: {success:0,fail:0,bean:0,steel:0,notify:'',Qbear:0,nackname:''}
}

function notify() {

  return new Promise(resolve => {
    try {
      var bean = 0;
      var steel = 0;
      var success = 0;
      var fail = 0;
      var notify = '';
      for (var i in merge) {
        bean += Number(merge[i].bean)
        steel += Number(merge[i].steel)
        success += Number(merge[i].success)
        fail += Number(merge[i].fail)
        notify += merge[i].notify ? "\n" + merge[i].notify : ""
      }
      var beans = merge.JDShake.Qbear ? merge.JDShake.Qbear + "京豆, " : ""
      var Steel = merge.JRSteel.TSteel ? merge.JRSteel.TSteel + "钢镚, " : ""
      var Cash = merge.JDCash.TCash ? merge.JDCash.TCash + "红包" : ""
      var bsc = beans ? "\n" : Steel ? "\n" : Cash ? "\n" : "获取失败\n"
      var Tbean = bean ? bean + "京豆, " : ""
      var TSteel = steel ? steel + "钢镚, " : ""
      var TCash = merge.JDCash.Cash ? merge.JDCash.Cash + "红包" : ""
      var Tbsc = Tbean ? "\n" : TSteel ? "\n" : TCash ? "\n" : "获取失败\n"
      var Ts = success != 0 ? "成功" + success + "个, " : ""
      var Tf = fail != 0 ? "失败" + fail + "个" : ""
      var one = "【签到概览】:  " + Ts + Tf + "\n"
      var two = "【签到总计】:  " + Tbean + TSteel + TCash + Tbsc
      var three = "【账号总计】:  " + beans + Steel + Cash + bsc
      var four = "【左滑 '查看' 以显示签到详情】\n"
      var DName = merge.JDShake.nickname?merge.JDShake.nickname:"获取失败"
      var Name = add?DualAccount?"【签到号一】:  "+DName+"\n":"【签到号二】:  "+DName+"\n":""
      console.log("\n" + Name + one + two + three + four + notify)
      if ($nobyda.isJSBox) {
        if (add && DualAccount) {
          Shortcut = Name + one + two + three + "\n"
        } else if (!add && DualAccount) { 
          $intents.finish(Name + one + two + three + four + notify)
        } else if (typeof Shortcut != "undefined") {
          $intents.finish(Shortcut + Name + one + two + three) 
        } 
      }
      if (!$nobyda.isNode) $nobyda.notify("", "", Name + one + two + three + four + notify);
      if (DualAccount) double()
      resolve('done')
    } catch (eor) {
      $nobyda.notify("通知模块 " + eor.name + "‼️", JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function ReadCookie() {

  $nobyda.done()
  DualAccount = true;

  if (DeleteCookie) {
    if ($nobyda.isJSBox) {
      if ($file.exists("shared://JD_Cookie.txt")) {
        if ($file.exists("shared://JD_Cookie2.txt")) {
          $file.delete("shared://JD_Cookie2.txt")
        }
        $file.delete("shared://JD_Cookie.txt")
        $nobyda.notify("京东Cookie清除成功 !", "", '请手动关闭脚本内"DeleteCookie"选项')
        return
      }
    } else if ($nobyda.read("CookieJD")) {
      $nobyda.write("", "CookieJD")
      $nobyda.write("", "CookieJD2")
      $nobyda.notify("京东Cookie清除成功 !", "", '请手动关闭脚本内"DeleteCookie"选项')
      return
    }
    $nobyda.notify("脚本终止", "", '未关闭脚本内"DeleteCookie"选项 ‼️')
    return
  } else if ($nobyda.isRequest) {
    GetCookie()
    return
  }

  if ($nobyda.isJSBox) {
    add = DualKey || $file.exists("shared://JD_Cookie2.txt") ? true : false
    if (DualKey) {
      $file.write({
        data: $data({
          string: DualKey
        }),
        path: "shared://JD_Cookie2.txt"
      })
    }
    if (Key) {
      $file.write({
        data: $data({
          string: Key
        }),
        path: "shared://JD_Cookie.txt"
      })
      KEY = Key
      all()
    } else if ($file.exists("shared://JD_Cookie.txt")) {
      KEY = $file.read("shared://JD_Cookie.txt").string
      all()
    } else {
      $nobyda.notify("京东签到", "", "脚本终止, 未填写Cookie ‼️")
    }
  } else if (Key || $nobyda.read("CookieJD")) {
    add = DualKey || $nobyda.read("CookieJD2") ? true : false
    KEY = Key ? Key : $nobyda.read("CookieJD")
    all()
  } else {
    $nobyda.notify("京东签到", "", "脚本终止, 未获取Cookie ‼️")
  }
}

function double() {
  add = true
  DualAccount = false

  for (var i in merge) {
    merge[i].success = 0;
    merge[i].fail = 0;
    merge[i].bean = 0;
    merge[i].steel = 0;
    merge[i].notify = '';
    merge[i].key = 0;
    merge[i].TSteel = 0;
    merge[i].Cash = 0;
    merge[i].TCash = 0;
    merge[i].Qbear = 0;
    merge[i].nickname = '';
  }

  if ($nobyda.isJSBox) {
    if (DualKey || $file.exists("shared://JD_Cookie2.txt")) {
      KEY = DualKey ? DualKey : $file.read("shared://JD_Cookie2.txt").string
      all()
    }
  } else if (DualKey || $nobyda.read("CookieJD2")) {
    KEY = DualKey ? DualKey : $nobyda.read("CookieJD2")
    all()
  }
}

function JingDongBean(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDBUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=signBeanIndex&appid=ld',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      }
    };

    $nobyda.get(JDBUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDBean.notify = "京东商城-京豆: 签到接口请求失败 ‼️‼️"
          merge.JDBean.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (cc.code == 3) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-京豆Cookie失效 " + Details)
            merge.JDBean.notify = "京东商城-京豆: 失败, 原因: Cookie失效‼️"
            merge.JDBean.fail = 1
          } else {
            if (data.match(/跳转至拼图/)) {
              merge.JDBean.notify = "京东商城-京豆: 失败, 原因: 需要拼图验证 ⚠️"
              merge.JDBean.fail = 1
            } else {
              if (cc.data.status == 1) {
                var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-京豆签到成功 " + Details)
                if (data.match(/dailyAward/)) {
                  merge.JDBean.notify = "京东商城-京豆: 成功, 明细: " + cc.data.dailyAward.beanAward.beanCount + "京豆 🐶"
                  merge.JDBean.bean = cc.data.dailyAward.beanAward.beanCount
                  merge.JDBean.success = 1
                } else {
                  if (data.match(/continuityAward/)) {
                    merge.JDBean.notify = "京东商城-京豆: 成功, 明细: " + cc.data.continuityAward.beanAward.beanCount + "京豆 🐶"
                    merge.JDBean.bean = cc.data.continuityAward.beanAward.beanCount
                    merge.JDBean.success = 1
                  } else {
                    if (data.match(/新人签到/)) {
                      const regex = /beanCount\":\"(\d+)\".+今天/;
                      const quantity = regex.exec(data)[1];
                      merge.JDBean.notify = "京东商城-京豆: 成功, 明细: " + quantity + "京豆 🐶"
                      merge.JDBean.bean = quantity
                      merge.JDBean.success = 1
                    } else {
                      merge.JDBean.notify = "京东商城-京豆: 失败, 原因: 未知 ⚠️"
                      merge.JDBean.fail = 1
                    }
                  }
                }
              } else {
                var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-京豆签到失败 " + Details)
                if (data.match(/(已签到|新人签到)/)) {
                  merge.JDBean.notify = "京东商城-京豆: 失败, 原因: 已签过 ⚠️"
                  merge.JDBean.fail = 1
                } else {
                  merge.JDBean.notify = "京东商城-京豆: 失败, 原因: 未知 ⚠️"
                  merge.JDBean.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-京豆" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongTurn(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDTUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=lotteryDraw&body=%7B%22actId%22%3A%22jgpqtzjhvaoym%22%2C%22appSource%22%3A%22jdhome%22%2C%22lotteryCode%22%3A%224wwzdq7wkqx2usx4g5i2nu5ho4auto4qxylblkxacm7jqdsltsepmgpn3b2hgyd7hiawzpccizuck%22%7D&appid=ld',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      }
    };

    $nobyda.get(JDTUrl, async function(error, response, data) {
      try {
        if (error) {
          merge.JDTurn.notify += merge.JDTurn.notify ? "\n京东商城-转盘: 签到接口请求失败 ‼️‼️ (多次)" : "京东商城-转盘: 签到接口请求失败 ‼️‼️"
          merge.JDTurn.fail += 1
        } else {
          const cc = JSON.parse(data)
          if (cc.code == 3) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东转盘Cookie失效 " + Details)
            merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: Cookie失效‼️"
            merge.JDTurn.fail = 1
          } else {
            if (data.match(/(\"T216\"|活动结束)/)) {
              merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 活动结束 ⚠️"
              merge.JDTurn.fail = 1
            } else {
              if (data.match(/(京豆|\"910582\")/)) {
                var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-转盘签到成功 " + Details)
                merge.JDTurn.notify += merge.JDTurn.notify ? "\n京东商城-转盘: 成功, 明细: " + cc.data.prizeSendNumber + "京豆 🐶 (多次)" : "京东商城-转盘: 成功, 明细: " + cc.data.prizeSendNumber + "京豆 🐶"
                merge.JDTurn.success += 1
                merge.JDTurn.bean += Number(cc.data.prizeSendNumber)
                if (cc.data.chances != "0") {
                  await JingDongTurn(2000)
                }
              } else {
                var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-转盘签到失败 " + Details)
                if (data.match(/未中奖/)) {
                  merge.JDTurn.notify += merge.JDTurn.notify ? "\n京东商城-转盘: 成功, 状态: 未中奖 🐶 (多次)" : "京东商城-转盘: 成功, 状态: 未中奖 🐶"
                  merge.JDTurn.success += 1
                if (cc.data.chances != "0") {
                  await JingDongTurn(2000)
                }
                } else if (data.match(/(T215|次数为0)/)) {
                  merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 已转过 ⚠️"
                  merge.JDTurn.fail = 1
                } else if (data.match(/(T210|密码)/)) {
                  merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 无支付密码 ⚠️"
                  merge.JDTurn.fail = 1
                } else {
                  merge.JDTurn.notify += merge.JDTurn.notify ? "\n京东商城-转盘: 失败, 原因: 未知 ⚠️ (多次)" : "京东商城-转盘: 失败, 原因: 未知 ⚠️"
                  merge.JDTurn.fail += 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-转盘" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingRongBean(s) {

  return new Promise(resolve => { setTimeout(() => {
    const login = {
      url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRecords',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
        Referer: "https://jddx.jd.com/m/money/index.html?from=sign",
      },
      body: "reqData=%7B%22bizLine%22%3A2%7D"
    };

    $nobyda.post(login, async function(error, response, data) {
      try {
        if (error) {
          merge.JRBean.notify = "京东金融-京豆: 登录接口请求失败 ‼️‼️"
          merge.JRBean.fail = 1
        } else {
            if (data.match(/\"login\":true/)) {
              var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-京豆登录成功 " + Details)
              await JRBeanCheckin(200)
            } else {
              var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-京豆登录失败 " + Details)
              if (data.match(/\"login\":false/)) {
                merge.JRBean.notify = "京东金融-京豆: 失败, 原因: Cookie失效‼️"
                merge.JRBean.fail = 1
              } else {
                merge.JRBean.notify = "京东金融-京豆: 登录接口需修正 ‼️‼️"
                merge.JRBean.fail = 1
              }
            }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东金融-京豆登录" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JRBeanCheckin(s) {

  return new Promise(resolve => {
    setTimeout(() => {
      const JRBUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRewardGift',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
          Referer: "https://jddx.jd.com/m/jddnew/money/index.html",
        },
        body: "reqData=%7B%22bizLine%22%3A2%2C%22signDate%22%3A%221%22%2C%22deviceInfo%22%3A%7B%22os%22%3A%22iOS%22%7D%2C%22clientType%22%3A%22sms%22%2C%22clientVersion%22%3A%2211.0%22%7D"
      };

      $nobyda.post(JRBUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JRBean.notify = "京东金融-京豆: 签到接口请求失败 ‼️‼️"
            merge.JRBean.fail = 1
          } else {
            const c = JSON.parse(data)
            if (data.match(/\"resultCode\":\"00000\"/)) {
              var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-京豆签到成功 " + Details)
              if (c.resultData.data.rewardAmount != "0") {
                merge.JRBean.notify = "京东金融-京豆: 成功, 明细: " + c.resultData.data.rewardAmount + "京豆 🐶"
                merge.JRBean.success = 1
                merge.JRBean.bean = c.resultData.data.rewardAmount
              } else {
                merge.JRBean.notify = "京东金融-京豆: 成功, 明细: 无奖励 🐶"
                merge.JRBean.success = 1
              }
            } else {
              var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-京豆签到失败 " + Details)
              if (data.match(/(发放失败|70111)/)) {
                merge.JRBean.notify = "京东金融-京豆: 失败, 原因: 已签过 ⚠️"
                merge.JRBean.fail = 1
              } else {
                if (data.match(/(\"resultCode\":3|请先登录)/)) {
                  merge.JRBean.notify = "京东金融-京豆: 失败, 原因: Cookie失效‼️"
                  merge.JRBean.fail = 1
                } else {
                  merge.JRBean.notify = "京东金融-京豆: 失败, 原因: 未知 ⚠️"
                  merge.JRBean.fail = 1
                }
              }
            }
          }
          resolve('done')
        } catch (eor) {
          $nobyda.notify("京东金融-京豆" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve('done')
        }
      })
    }, s)
  });
}

function JingRongSteel(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JRSUrl = {
      url: 'https://ms.jr.jd.com/gw/generic/gry/h5/m/signIn',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "reqData=%7B%22channelSource%22%3A%22JRAPP%22%2C%22riskDeviceParam%22%3A%22%7B%7D%22%7D"
    };

    $nobyda.post(JRSUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JRSteel.notify = "京东金融-钢镚: 签到接口请求失败 ‼️‼️"
          merge.JRSteel.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/\"resBusiCode\":0/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-钢镚签到成功 " + Details)
              const leng = "" + cc.resultData.resBusiData.actualTotalRewardsValue
              if (leng.length == 1) {
                merge.JRSteel.notify = "京东金融-钢镚: 成功, 明细: " + "0.0" + cc.resultData.resBusiData.actualTotalRewardsValue + "钢镚 💰"
                merge.JRSteel.success = 1
                merge.JRSteel.steel = "0.0" + cc.resultData.resBusiData.actualTotalRewardsValue
              } else {
                merge.JRSteel.notify = "京东金融-钢镚: 成功, 明细: " + "0." + cc.resultData.resBusiData.actualTotalRewardsValue + "钢镚 💰"
                merge.JRSteel.success = 1
                merge.JRSteel.steel = "0." + cc.resultData.resBusiData.actualTotalRewardsValue
              }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-钢镚签到失败 " + Details)
            if (data.match(/(已经领取|\"resBusiCode\":15)/)) {
              merge.JRSteel.notify = "京东金融-钢镚: 失败, 原因: 已签过 ⚠️"
              merge.JRSteel.fail = 1
            } else {
              if (data.match(/未实名/)) {
                merge.JRSteel.notify = "京东金融-钢镚: 失败, 原因: 账号未实名 ⚠️"
                merge.JRSteel.fail = 1
              } else {
                if (data.match(/(\"resultCode\":3|请先登录)/)) {
                  merge.JRSteel.notify = "京东金融-钢镚: 失败, 原因: Cookie失效‼️"
                  merge.JRSteel.fail = 1
                } else {
                  merge.JRSteel.notify = "京东金融-钢镚: 失败, 原因: 未知 ⚠️"
                  merge.JRSteel.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东金融-钢镚" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}


function JRDoubleSign(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JRDSUrl = {
      url: 'https://nu.jr.jd.com/gw/generic/jrm/h5/m/process?',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "reqData=%7B%22actCode%22%3A%22FBBFEC496C%22%2C%22type%22%3A3%2C%22riskDeviceParam%22%3A%22%22%7D"
    };

    $nobyda.post(JRDSUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JRDSign.notify = "京东金融-双签: 签到接口请求失败 ‼️‼️"
          merge.JRDSign.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/京豆X/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-双签签到成功 " + Details)
              merge.JRDSign.notify = "京东金融-双签: 成功, 明细: " + cc.resultData.data.businessData.businessData.awardListVo[0].count + "京豆 🐶"
              merge.JRDSign.bean = cc.resultData.data.businessData.businessData.awardListVo[0].count
              merge.JRDSign.success = 1
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-双签签到失败 " + Details)
            if (data.match(/已领取/)) {
              merge.JRDSign.notify = "京东金融-双签: 失败, 原因: 已签过 ⚠️"
              merge.JRDSign.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JRDSign.notify = "京东金融-双签: 失败, 原因: 活动已结束 ⚠️"
                merge.JRDSign.fail = 1
              } else {
                if (data.match(/未在/)) {
                  merge.JRDSign.notify = "京东金融-双签: 失败, 原因: 未在京东签到 ⚠️"
                  merge.JRDSign.fail = 1
                } else {
                  if (data.match(/(\"resultCode\":3|请先登录)/)) {
                    merge.JRDSign.notify = "京东金融-双签: 失败, 原因: Cookie失效‼️"
                    merge.JRDSign.fail = 1
                  } else if (cc.resultData.data.businessData.businessCode == "000sq" && cc.resultData.data.businessData.businessMsg == "成功") {
                    merge.JRDSign.notify = "京东金融-双签: 成功, 明细: 无奖励 🐶"
                    merge.JRDSign.success = 1
                  } else {
                    merge.JRDSign.notify = "京东金融-双签: 失败, 原因: 未知 ⚠️"
                    merge.JRDSign.fail = 1
                  }
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东金融-双签" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}


function JingDongShake(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDSh = {
      url: 'https://api.m.jd.com/client.action?appid=vip_h5&functionId=vvipclub_shaking',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      }
    };

    $nobyda.get(JDSh, async function(error, response, data) {
      try {
        if (error) {
          merge.JDShake.notify += merge.JDShake.notify ? "\n京东商城-摇摇: 签到接口请求失败 ‼️‼️ (多次)\n" + error : "京东商城-摇摇: 签到接口请求失败 ‼️‼️\n" + error
          merge.JDShake.fail += 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/prize/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-摇一摇签到成功 " + Details)
            if (cc.data.prizeBean) {
              merge.JDShake.notify += merge.JDShake.notify ? "\n京东商城-摇摇: 成功, 明细: " + cc.data.prizeBean.count + "京豆 🐶 (多次)" : "京东商城-摇摇: 成功, 明细: " + cc.data.prizeBean.count + "京豆 🐶"
              merge.JDShake.bean += cc.data.prizeBean.count
              merge.JDShake.success += 1
            } else {
              if (cc.data.prizeCoupon) {
                merge.JDShake.notify += merge.JDShake.notify ? "\n京东商城-摇摇(多次): 获得满" + cc.data.prizeCoupon.quota + "减" + cc.data.prizeCoupon.discount + "优惠券→ " + cc.data.prizeCoupon.limitStr : "京东商城-摇摇: 获得满" + cc.data.prizeCoupon.quota + "减" + cc.data.prizeCoupon.discount + "优惠券→ " + cc.data.prizeCoupon.limitStr
                merge.JDShake.success += 1
              } else {
                merge.JDShake.notify += merge.JDShake.notify ? "\n京东商城-摇摇: 失败, 原因: 未知 ⚠️ (多次)" : "京东商城-摇摇: 失败, 原因: 未知 ⚠️"
                merge.JDShake.fail += 1
              }
            }
            if (cc.data.luckyBox.freeTimes != 0) {
              await JingDongShake(s)
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-摇一摇签到失败 " + Details)
            if (data.match(/true/)) {
              merge.JDShake.notify += merge.JDShake.notify ? "\n京东商城-摇摇: 成功, 明细: 无奖励 🐶 (多次)" : "京东商城-摇摇: 成功, 明细: 无奖励 🐶"
              merge.JDShake.success += 1
              if (cc.data.luckyBox.freeTimes != 0) {
                await JingDongShake(s)
              }
            } else {
              if (data.match(/(无免费|8000005)/)) {
                merge.JDShake.notify = "京东商城-摇摇: 失败, 原因: 已摇过 ⚠️"
                merge.JDShake.fail = 1
              } else if (data.match(/(未登录|101)/)) {
                merge.JDShake.notify = "京东商城-摇摇: 失败, 原因: Cookie失效‼️"
                merge.JDShake.fail = 1
              } else {
                merge.JDShake.notify += merge.JDShake.notify ? "\n京东商城-摇摇: 失败, 原因: 未知 ⚠️ (多次)" : "京东商城-摇摇: 失败, 原因: 未知 ⚠️"
                merge.JDShake.fail += 1
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-摇摇" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JDGroceryStore(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDGSUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22caA6%2B%2FTo6Jfe%2FAKYm8gLQEchLXtYeB53heY9YzuzsZoaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22signId%5C%22%3A%5C%22hEr1TO1FjXgaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&screen=750%2A1334&client=wh5&clientVersion=1.0.0&sid=0ac0caddd8a12bf58ea7a912a5c637cw&uuid=1fce88cd05c42fe2b054e846f11bdf33f016d676&area=19_1617_3643_8208"
    };

    $nobyda.post(JDGSUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDGStore.notify = "京东商城-超市: 签到接口请求失败 ‼️‼️"
          merge.JDGStore.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-超市签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDGStore.notify = "京东商城-超市: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDGStore.bean = beanQuantity
              merge.JDGStore.success = 1
            } else {
              merge.JDGStore.notify = "京东商城-超市: 成功, 明细: 无京豆 🐶"
              merge.JDGStore.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-超市签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDGStore.notify = "京东商城-超市: 失败, 原因: 已签过 ⚠️"
              merge.JDGStore.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDGStore.notify = "京东商城-超市: 失败, 原因: 活动已结束 ⚠️"
                merge.JDGStore.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDGStore.notify = "京东商城-超市: 失败, 原因: Cookie失效‼️"
                  merge.JDGStore.fail = 1
                } else {
                  merge.JDGStore.notify = "京东商城-超市: 失败, 原因: 未知 ⚠️"
                  merge.JDGStore.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-超市" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongClocks(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDCUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22LW67%2FHBJP72aMSByZLRaRqJGukOFKx9r4F87VrKBmogaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Atrue%2C%5C%22signId%5C%22%3A%5C%22g2kYL2MvMgkaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
    };

    $nobyda.post(JDCUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDClocks.notify = "京东商城-钟表: 签到接口请求失败 ‼️‼️"
          merge.JDClocks.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-钟表签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDClocks.notify = "京东商城-钟表: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDClocks.bean = beanQuantity
              merge.JDClocks.success = 1
            } else {
              merge.JDClocks.notify = "京东商城-钟表: 成功, 明细: 无京豆 🐶"
              merge.JDClocks.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-钟表签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDClocks.notify = "京东商城-钟表: 失败, 原因: 已签过 ⚠️"
              merge.JDClocks.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDClocks.notify = "京东商城-钟表: 失败, 原因: 活动已结束 ⚠️"
                merge.JDClocks.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDClocks.notify = "京东商城-钟表: 失败, 原因: Cookie失效‼️"
                  merge.JDClocks.fail = 1
                } else {
                  merge.JDClocks.notify = "京东商城-钟表: 失败, 原因: 未知 ⚠️"
                  merge.JDClocks.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-钟表" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongPet(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDPETUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%226DiDTHMDvpNyoP9JUaEkki%2FsREOeEAl8M8REPQ%2F2eA4aZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22signId%5C%22%3A%5C%22Nk2fZhdgf5UaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
    };

    $nobyda.post(JDPETUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDPet.notify = "京东商城-宠物: 签到接口请求失败 ‼️‼️"
          merge.JDPet.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-宠物签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDPet.notify = "京东商城-宠物: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDPet.bean = beanQuantity
              merge.JDPet.success = 1
            } else {
              merge.JDPet.notify = "京东商城-宠物: 成功, 明细: 无京豆 🐶"
              merge.JDPet.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-宠物签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDPet.notify = "京东商城-宠物: 失败, 原因: 已签过 ⚠️"
              merge.JDPet.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDPet.notify = "京东商城-宠物: 失败, 原因: 活动已结束 ⚠️"
                merge.JDPet.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDPet.notify = "京东商城-宠物: 失败, 原因: Cookie失效‼️"
                  merge.JDPet.fail = 1
                } else {
                  merge.JDPet.notify = "京东商城-宠物: 失败, 原因: 未知 ⚠️"
                  merge.JDPet.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-宠物" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JDFlashSale(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDPETUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=partitionJdSgin',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%7D&client=apple&clientVersion=8.4.6&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=141ab5f9af92126bb46d50f3e8af758a&st=1579305780511&sv=102"
    };

    $nobyda.post(JDPETUrl, async function(error, response, data) {
      try {
        if (error) {
          merge.JDFSale.notify = "京东商城-闪购: 签到接口请求失败 ‼️‼️"
          merge.JDFSale.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (cc.result.code == 0) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-闪购签到成功 " + Details)
            if (data.match(/(\"count\":\d+)/)) {
              merge.JDFSale.notify = "京东商城-闪购: 成功, 明细: " + cc.result.count + "京豆 🐶"
              merge.JDFSale.bean = cc.result.count
              merge.JDFSale.success = 1
            } else {
              merge.JDFSale.notify = "京东商城-闪购: 成功, 明细: 无京豆 🐶"
              merge.JDFSale.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-闪购签到失败 " + Details)
            if (data.match(/(已签到|已领取|\"2005\")/)) {
              merge.JDFSale.notify = "京东商城-闪购: 失败, 原因: 已签过 ⚠️"
              merge.JDFSale.fail = 1
            } else {
              if (data.match(/(不存在|已结束|\"2008\")/)) {
                //merge.JDFSale.notify = "京东商城-闪购: 失败, 原因: 需瓜分 ⚠️"
                //merge.JDFSale.fail = 1
                await FlashSaleDivide(s)
              } else {
                if (data.match(/(\"code\":\"3\"|\"1003\")/)) {
                  merge.JDFSale.notify = "京东商城-闪购: 失败, 原因: Cookie失效‼️"
                  merge.JDFSale.fail = 1
                } else {
                  merge.JDFSale.notify = "京东商城-闪购: 失败, 原因: 未知 ⚠️"
                  merge.JDFSale.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-闪购" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function FlashSaleDivide(s) {

  return new Promise(resolve => { setTimeout(() => {
    const Url = {
      url: 'https://api.m.jd.com/client.action?functionId=partitionJdShare',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%7D&client=apple&clientVersion=8.5.0&d_brand=apple&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=958ba0e805094b4b0f6216e86190ab51&st=1582042405636&sv=120&wifiBssid=unknown"
    };

    $nobyda.post(Url, function(error, response, data) {
      try {
        if (error) {
          merge.JDFSale.notify = "京东闪购-瓜分: 签到接口请求失败 ‼️‼️"
          merge.JDFSale.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (cc.result.code == 0) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东闪购-瓜分签到成功 " + Details)
            if (data.match(/(\"jdBeanNum\":\d+)/)) {
              merge.JDFSale.notify = "京东闪购-瓜分: 成功, 明细: " + cc.result.jdBeanNum + "京豆 🐶"
              merge.JDFSale.bean = cc.result.jdBeanNum
              merge.JDFSale.success = 1
            } else {
              merge.JDFSale.notify = "京东闪购-瓜分: 成功, 明细: 无京豆 🐶"
              merge.JDFSale.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东闪购-瓜分签到失败 " + Details)
            if (data.match(/(已参与|已领取|\"2006\")/)) {
              merge.JDFSale.notify = "京东闪购-瓜分: 失败, 原因: 已瓜分 ⚠️"
              merge.JDFSale.fail = 1
            } else {
              if (data.match(/(不存在|已结束|未开始|\"2008\")/)) {
                merge.JDFSale.notify = "京东闪购-瓜分: 失败, 原因: 活动已结束 ⚠️"
                merge.JDFSale.fail = 1
              } else {
                if (data.match(/(\"code\":\"1003\"|未获取)/)) {
                  merge.JDFSale.notify = "京东闪购-瓜分: 失败, 原因: Cookie失效‼️"
                  merge.JDFSale.fail = 1
                } else {
                  merge.JDFSale.notify = "京东闪购-瓜分: 失败, 原因: 未知 ⚠️"
                  merge.JDFSale.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东闪购-瓜分" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongBook(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDBookUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3SC6rw5iBg66qrXPGmZMqFDwcyXi%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.linkstars.com%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000089893_157_0_184__cc59020469361878%26utm_term%3De04e88b40a3c4e24898da7fcee54a609%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3SC6rw5iBg66qrXPGmZMqFDwcyXi%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.linkstars.com%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000089893_157_0_184__cc59020469361878%26utm_term%3De04e88b40a3c4e24898da7fcee54a609%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22ziJpxomssJzA0Lnt9V%2BVYoW5AbqAOQ6XiMQuejSm7msaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200416621_28128239_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22jw9BKb%5C%2Fb%2BfEaZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.4.6&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=c1d6bdbb17d0d3f8199557265c6db92c&st=1579305128990&sv=121"
    };

    $nobyda.post(JDBookUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDBook.notify = "京东商城-图书: 签到接口请求失败 ‼️‼️"
          merge.JDBook.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-图书签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDBook.notify = "京东商城-图书: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDBook.bean = beanQuantity
              merge.JDBook.success = 1
            } else {
              merge.JDBook.notify = "京东商城-图书: 成功, 明细: 无京豆 🐶"
              merge.JDBook.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-图书签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDBook.notify = "京东商城-图书: 失败, 原因: 已签过 ⚠️"
              merge.JDBook.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDBook.notify = "京东商城-图书: 失败, 原因: 活动已结束 ⚠️"
                merge.JDBook.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDBook.notify = "京东商城-图书: 失败, 原因: Cookie失效‼️"
                  merge.JDBook.fail = 1
                } else if (cc.code == "600") {
                  merge.JDBook.notify = "京东商城-图书: 失败, 原因: 认证失败 ⚠️"
                  merge.JDBook.fail = 1
                } else {
                  merge.JDBook.notify = "京东商城-图书: 失败, 原因: 未知 ⚠️"
                  merge.JDBook.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-图书" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JDSecondhand(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDSDUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3S28janPLYmtFxypu37AYAGgivfp%5C%2Findex.html%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3S28janPLYmtFxypu37AYAGgivfp%5C%2Findex.html%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22HjRtRBMJdzRlhJzUCg9461ejcOQJht%5C%2FIVs0vaXG9bu8aZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200124860_28262902_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22dNjggqEioBYaZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.5.5&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&partner=apple&rfs=0000&scope=11&sign=e3a35ec455319c47b94f3ad95663849c&st=1585154729277&sv=101"
    };

    $nobyda.post(JDSDUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDShand.notify = "京东拍拍-二手: 签到接口请求失败 ‼️‼️"
          merge.JDShand.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东拍拍-二手签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDShand.notify = "京东拍拍-二手: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDShand.bean = beanQuantity
              merge.JDShand.success = 1
            } else {
              merge.JDShand.notify = "京东拍拍-二手: 成功, 明细: 无京豆 🐶"
              merge.JDShand.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东拍拍-二手签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDShand.notify = "京东拍拍-二手: 失败, 原因: 已签过 ⚠️"
              merge.JDShand.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDShand.notify = "京东拍拍-二手: 失败, 原因: 活动已结束 ⚠️"
                merge.JDShand.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDShand.notify = "京东拍拍-二手: 失败, 原因: Cookie失效‼️"
                  merge.JDShand.fail = 1
                } else if (cc.code == "600") {
                  merge.JDShand.notify = "京东拍拍-二手: 失败, 原因: 认证失败 ⚠️"
                  merge.JDShand.fail = 1
                } else {
                  merge.JDShand.notify = "京东拍拍-二手: 失败, 原因: 未知 ⚠️"
                  merge.JDShand.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东拍拍-二手" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDMakeup(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDMUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22url%22%3A%22%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22kxGmaHHlHxb9ayMnCAyH%2BwnZoaFBVYHTRtJqXAL04gcaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200138455_31540104_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22vFp%2BUpqhEVwaZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.5.6&d_brand=apple&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&partner=apple&rfs=0000&scope=11&sign=9d9b898ac868dd334f16d090b49c9d1c&st=1585758305453&sv=100"
    };

    $nobyda.post(JDMUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDMakeup.notify = "京东商城-美妆: 签到接口请求失败 ‼️‼️"
          merge.JDMakeup.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-美妆签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDMakeup.notify = "京东商城-美妆: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDMakeup.bean = beanQuantity
              merge.JDMakeup.success = 1
            } else {
              merge.JDMakeup.notify = "京东商城-美妆: 成功, 明细: 无京豆 🐶"
              merge.JDMakeup.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-美妆签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDMakeup.notify = "京东商城-美妆: 失败, 原因: 已签过 ⚠️"
              merge.JDMakeup.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDMakeup.notify = "京东商城-美妆: 失败, 原因: 活动已结束 ⚠️"
                merge.JDMakeup.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDMakeup.notify = "京东商城-美妆: 失败, 原因: Cookie失效‼️"
                  merge.JDMakeup.fail = 1
                } else if (cc.code == "600") {
                  merge.JDMakeup.notify = "京东商城-美妆: 失败, 原因: 认证失败 ⚠️"
                  merge.JDMakeup.fail = 1
                } else {
                  merge.JDMakeup.notify = "京东商城-美妆: 失败, 原因: 未知 ⚠️"
                  merge.JDMakeup.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-美妆" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongClean(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDCUUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22url%22%3A%22%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%222cmqNZYuemsfWQVJa4YnYJU8xCiV4kM0ReG2X9m%2BzlAaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200561054_31598075_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22nkwlDwBm8jUaZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.5.6&d_brand=apple&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&partner=apple&rfs=0000&scope=11&sign=18dce4732b327ccdc1fa3b7726fbade6&st=1585758524310&sv=121"
    };

    $nobyda.post(JDCUUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDClean.notify = "京东商城-清洁: 签到接口请求失败 ‼️‼️"
          merge.JDClean.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-清洁签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDClean.notify = "京东商城-清洁: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDClean.bean = beanQuantity
              merge.JDClean.success = 1
            } else {
              merge.JDClean.notify = "京东商城-清洁: 成功, 明细: 无京豆 🐶"
              merge.JDClean.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-清洁签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDClean.notify = "京东商城-清洁: 失败, 原因: 已签过 ⚠️"
              merge.JDClean.fail = 1
            } else {
              if (data.match(/(不存在|已结束|未开始)/)) {
                merge.JDClean.notify = "京东商城-清洁: 失败, 原因: 活动已结束 ⚠️"
                merge.JDClean.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDClean.notify = "京东商城-清洁: 失败, 原因: Cookie失效‼️"
                  merge.JDClean.fail = 1
                } else if (cc.code == "600") {
                  merge.JDClean.notify = "京东商城-清洁: 失败, 原因: 认证失败 ⚠️"
                  merge.JDClean.fail = 1
                } else {
                  merge.JDClean.notify = "京东商城-清洁: 失败, 原因: 未知 ⚠️"
                  merge.JDClean.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-清洁" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongWomen(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDMUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22url%22%3A%22%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22OQmfgxmylrMM6EurCHg9lEjL1ShNb2dVjEja9MceBPgaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200002492_28085975_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22YE5T0wVaiL8aZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&build=167057&client=apple&clientVersion=8.5.0&d_brand=apple&d_model=iPhone8%2C2&networklibtype=JDNetworkBaseAF&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&osVersion=13.3.1&scope=11&screen=1242%2A2208&sign=7329899a26d8a8c3046b882d6df2b329&st=1581083524405&sv=101&uuid=coW0lj7vbXVin6h7ON%2BtMNFQqYBqMahr"
    };

    $nobyda.post(JDMUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDWomen.notify = "京东商城-女装: 签到接口请求失败 ‼️‼️"
          merge.JDWomen.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-女装签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDWomen.notify = "京东商城-女装: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDWomen.bean = beanQuantity
              merge.JDWomen.success = 1
            } else {
              merge.JDWomen.notify = "京东商城-女装: 成功, 明细: 无京豆 🐶"
              merge.JDWomen.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-女装签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDWomen.notify = "京东商城-女装: 失败, 原因: 已签过 ⚠️"
              merge.JDWomen.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDWomen.notify = "京东商城-女装: 失败, 原因: 活动已结束 ⚠️"
                merge.JDWomen.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDWomen.notify = "京东商城-女装: 失败, 原因: Cookie失效‼️"
                  merge.JDWomen.fail = 1
                } else if (cc.code == "600") {
                  merge.JDWomen.notify = "京东商城-女装: 失败, 原因: 认证失败 ⚠️"
                  merge.JDWomen.fail = 1
                } else {
                  merge.JDWomen.notify = "京东商城-女装: 失败, 原因: 未知 ⚠️"
                  merge.JDWomen.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-女装" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongCash(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDCAUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=ccSignInNew',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22monitorSource%22%3A%22cc_sign_ios_index_config%22%7D&client=apple&clientVersion=8.5.0&d_brand=apple&d_model=iPhone8%2C2&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&scope=11&screen=1242%2A2208&sign=1cce8f76d53fc6093b45a466e93044da&st=1581084035269&sv=102"
    };

    $nobyda.post(JDCAUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDCash.notify = "京东现金-红包: 签到接口请求失败 ‼️‼️"
          merge.JDCash.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (cc.busiCode == "0") {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东现金-红包签到成功 " + Details)
            if (cc.result.signResult.signData.amount) {
              merge.JDCash.notify = "京东现金-红包: 成功, 明细: " + cc.result.signResult.signData.amount + "红包 🧧"
              merge.JDCash.Cash = cc.result.signResult.signData.amount
              merge.JDCash.success = 1
            } else {
              merge.JDCash.notify = "京东现金-红包: 成功, 明细: 无红包 🧧"
              merge.JDCash.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东现金-红包签到失败 " + Details)
            if (data.match(/(\"busiCode\":\"1002\"|完成签到)/)) {
              merge.JDCash.notify = "京东现金-红包: 失败, 原因: 已签过 ⚠️"
              merge.JDCash.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDCash.notify = "京东现金-红包: 失败, 原因: 活动已结束 ⚠️"
                merge.JDCash.fail = 1
              } else {
                if (data.match(/(\"busiCode\":\"3\"|未登录)/)) {
                  merge.JDCash.notify = "京东现金-红包: 失败, 原因: Cookie失效‼️"
                  merge.JDCash.fail = 1
                } else {
                  merge.JDCash.notify = "京东现金-红包: 失败, 原因: 未知 ⚠️"
                  merge.JDCash.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东现金-红包" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongShoes(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDSSUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%227Ive90vKJQaMEzWlhMgIwIih1KqMPXNQdPbewzqrg2MaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Atrue%2C%5C%22ruleSrv%5C%22%3A%5C%2200116882_29523722_t0%5C%22%2C%5C%22signId%5C%22%3A%5C%22SeWbLe9ma04aZs%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22riskParam%22%3A%7B%22platform%22%3A%223%22%2C%22orgType%22%3A%222%22%2C%22openId%22%3A%22-1%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22eid%22%3A%22%22%2C%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22b3fccfafc270b38e0bddfdc0e455b48f%22%2C%22shshshfpa%22%3A%22%22%2C%22shshshfpb%22%3A%22%22%2C%22childActivityUrl%22%3A%22%22%7D%2C%22siteClient%22%3A%22apple%22%2C%22mitemAddrId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%220%22%2C%22lat%22%3A%220%22%7D%2C%22addressId%22%3A%22%22%2C%22posLng%22%3A%22%22%2C%22posLat%22%3A%22%22%2C%22focus%22%3A%22%22%2C%22innerAnchor%22%3A%22%22%2C%22cv%22%3A%222.0%22%7D&client=wh5"
    };

    $nobyda.post(JDSSUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDShoes.notify = "京东商城-鞋靴: 签到接口请求失败 ‼️‼️"
          merge.JDShoes.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-鞋靴签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDShoes.notify = "京东商城-鞋靴: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDShoes.bean = beanQuantity
              merge.JDShoes.success = 1
            } else {
              merge.JDShoes.notify = "京东商城-鞋靴: 成功, 明细: 无京豆 🐶"
              merge.JDShoes.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-鞋靴签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDShoes.notify = "京东商城-鞋靴: 失败, 原因: 已签过 ⚠️"
              merge.JDShoes.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDShoes.notify = "京东商城-鞋靴: 失败, 原因: 活动已结束 ⚠️"
                merge.JDShoes.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDShoes.notify = "京东商城-鞋靴: 失败, 原因: Cookie失效‼️"
                  merge.JDShoes.fail = 1
                } else if (cc.code == "600") {
                  merge.JDShoes.notify = "京东商城-鞋靴: 失败, 原因: 认证失败 ⚠️"
                  merge.JDShoes.fail = 1
                } else {
                  merge.JDShoes.notify = "京东商城-鞋靴: 失败, 原因: 未知 ⚠️"
                  merge.JDShoes.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-鞋靴" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JDPersonalCare(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDPCUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FNJ1kd1PJWhwvhtim73VPsD1HwY3%5C%2Findex.html%3FcollectionId%3D294%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FNJ1kd1PJWhwvhtim73VPsD1HwY3%5C%2Findex.html%3FcollectionId%3D294%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22T9fTAER%2B0EaJX5kEXrIO5hRPQXWgYDTaDljnh13%5C%2FBv8aZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200167278_31530230_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22Q%2BTbBJ3LWR4aZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.5.6&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&scope=11&sign=6ae0c689b3463149d59e4e09a0a7acd3&st=1585642030591&sv=100"
    };

    $nobyda.post(JDPCUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDCare.notify = "京东商城-个护: 签到接口请求失败 ‼️‼️"
          merge.JDCare.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-个护签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDCare.notify = "京东商城-个护: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDCare.bean = beanQuantity
              merge.JDCare.success = 1
            } else {
              merge.JDCare.notify = "京东商城-个护: 成功, 明细: 无京豆 🐶"
              merge.JDCare.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-个护签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDCare.notify = "京东商城-个护: 失败, 原因: 已签过 ⚠️"
              merge.JDCare.fail = 1
            } else {
              if (data.match(/(不存在|已结束|未开始)/)) {
                merge.JDCare.notify = "京东商城-个护: 失败, 原因: 活动已结束 ⚠️"
                merge.JDCare.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDCare.notify = "京东商城-个护: 失败, 原因: Cookie失效‼️"
                  merge.JDCare.fail = 1
                } else if (cc.code == "600") {
                  merge.JDCare.notify = "京东商城-个护: 失败, 原因: 认证失败 ⚠️"
                  merge.JDCare.fail = 1
                } else {
                  merge.JDCare.notify = "京东商城-个护: 失败, 原因: 未知 ⚠️"
                  merge.JDCare.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-个护" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingRSeeAds(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JRAdsUrl = {
      url: 'https://ms.jr.jd.com/gw/generic/jrm/h5/m/sendAdGb',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "reqData=%7B%22clientType%22%3A%22ios%22%2C%22actKey%22%3A%22176696%22%2C%22userDeviceInfo%22%3A%7B%22adId%22%3A9999999%7D%2C%22deviceInfoParam%22%3A%7B%22macAddress%22%3A%2202%3A00%3A00%3A00%3A00%3A00%22%2C%22channelInfo%22%3A%22appstore%22%2C%22IPAddress1%22%3A%22%22%2C%22OpenUDID%22%3A%22%22%2C%22clientVersion%22%3A%225.3.30%22%2C%22terminalType%22%3A%2202%22%2C%22osVersion%22%3A%22%22%2C%22appId%22%3A%22com.jd.jinrong%22%2C%22deviceType%22%3A%22iPhone8%2C2%22%2C%22networkType%22%3A%22%22%2C%22startNo%22%3A212%2C%22UUID%22%3A%22%22%2C%22IPAddress%22%3A%22%22%2C%22deviceId%22%3A%22%22%2C%22IDFA%22%3A%22%22%2C%22resolution%22%3A%22%22%2C%22osPlatform%22%3A%22iOS%22%7D%2C%22bussource%22%3A%22%22%7D"
    };

    $nobyda.post(JRAdsUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JRSeeAds.notify = "京东金融-广告: 签到接口请求失败 ‼️‼️"
          merge.JRSeeAds.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/(\"canGetGb\":true)/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-广告签到成功 " + Details)
            if (data.match(/(\"volumn\"|\"volume\")/)) {
              merge.JRSeeAds.notify = "京东金融-广告: 成功, 明细: " + cc.resultData.data.volumn + "京豆 🐶"
              merge.JRSeeAds.bean = cc.resultData.data.volumn
              merge.JRSeeAds.success = 1
            } else {
              merge.JRSeeAds.notify = "京东金融-广告: 成功, 明细: 无京豆 🐶"
              merge.JRSeeAds.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-广告签到失败 " + Details)
            if (data.match(/(已经发完|已签到|已领取|\"code\":\"2000\")/)) {
              merge.JRSeeAds.notify = "京东金融-广告: 失败, 原因: 已签过 ⚠️"
              merge.JRSeeAds.fail = 1
            } else {
              if (data.match(/(不存在|已结束|未找到)/)) {
                merge.JRSeeAds.notify = "京东金融-广告: 失败, 原因: 活动已结束 ⚠️"
                merge.JRSeeAds.fail = 1
              } else {
                if (data.match(/(\"resultCode\":3|先登录)/)) {
                  merge.JRSeeAds.notify = "京东金融-广告: 失败, 原因: Cookie失效‼️"
                  merge.JRSeeAds.fail = 1
                } //else {
                  //merge.JRSeeAds.notify = "京东金融-广告: 失败, 原因: 未知 ⚠️"
                  //merge.JRSeeAds.fail = 1
                //}
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东金融-广告" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingRongGame(s) {

  return new Promise(resolve => { setTimeout(() => {


      const JRGamelogin = {
        url: 'https://ylc.m.jd.com/sign/signGiftDays',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "channelId=1"
      };

      $nobyda.post(JRGamelogin, async function(error, response, data) {
        try {
          if (error) {
            merge.JRGame.notify = "京东金融-游戏: 登录接口请求失败 ‼️‼️"
            merge.JRGame.fail = 1
          } else {
            if (data.match(/(未登录)/)) {
              var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-游戏登录失败 " + Details)
              merge.JRGame.notify = "京东游戏-登录: 失败, 原因: Cookie失效‼️"
              merge.JRGame.fail = 1
            } else if (data.match(/(成功)/)) {
              var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东金融-游戏登录成功 " + Details)
              await JRGameCheckin(0)
            } else {
              merge.JRGame.notify = "京东游戏-登录: 失败, 原因: 未知 ⚠️"
              merge.JRGame.fail = 1
            }
          }
          resolve('done')
        } catch (eor) {
          $nobyda.notify("京东游戏-登录" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve('done')
        }
      })
    }, s)
  });
}

function JRGameCheckin(s) {

  return new Promise(resolve => {
    setTimeout(() => {
      const JRGameUrl = {
        url: 'https://ylc.m.jd.com/sign/signDone',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "channelId=1"
      };

      $nobyda.post(JRGameUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JRGame.notify = "京东金融-游戏: 签到接口请求失败 ‼️‼️"
            merge.JRGame.fail = 1
          } else {
            const cc = JSON.parse(data)
            if (data.match(/(\"code\":200)/)) {
              var Details = LogDetails ? "response:\n" + data : '';
              console.log("\n" + "京东金融-游戏签到成功 " + Details)
              if (data.match(/(\"rewardAmount\":\d+)/)) {
                merge.JRGame.notify = "京东金融-游戏: 成功, 明细: " + cc.data.rewardAmount + "京豆 🐶"
                merge.JRGame.bean = cc.data.rewardAmount
                merge.JRGame.success = 1
              } else {
                merge.JRGame.notify = "京东金融-游戏: 成功, 明细: 无京豆 🐶"
                merge.JRGame.success = 1
              }
            } else {
              var Details = LogDetails ? "response:\n" + data : '';
              console.log("\n" + "京东金融-游戏签到失败 " + Details)
              if (data.match(/(用户重复|重复点击|\"code\":301|\"code\":303)/)) {
                merge.JRGame.notify = "京东金融-游戏: 失败, 原因: 已签过 ⚠️"
                merge.JRGame.fail = 1
              } else {
                if (data.match(/(不存在|已结束|未找到)/)) {
                  merge.JRGame.notify = "京东金融-游戏: 失败, 原因: 活动已结束 ⚠️"
                  merge.JRGame.fail = 1
                } else {
                  if (data.match(/(\"code\":202|未登录)/)) {
                    merge.JRGame.notify = "京东金融-游戏: 失败, 原因: Cookie失效‼️"
                    merge.JRGame.fail = 1
                  } else {
                    merge.JRGame.notify = "京东金融-游戏: 失败, 原因: 未知 ⚠️"
                    merge.JRGame.fail = 1
                  }
                }
              }
            }
          }
          resolve('done')
        } catch (eor) {
          $nobyda.notify("京东金融-游戏" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve('done')
        }
      })
    }, s)
  });
}

function JingDongLive(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDLUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FKcfFqWvhb5hHtaQkS4SD1UU6RcQ%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.luck4ever.net%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000042554_%26utm_term%3D8d1fbab27551485f8f9b1939aee1ffd0%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FKcfFqWvhb5hHtaQkS4SD1UU6RcQ%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.luck4ever.net%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000042554_%26utm_term%3D8d1fbab27551485f8f9b1939aee1ffd0%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22isDhQnCJUnjlNPoFf5Do0JM9l54aZ0%5C%2FeHe0aBgdJgcQaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Atrue%2C%5C%22ruleSrv%5C%22%3A%5C%2200007152_29653514_t0%5C%22%2C%5C%22signId%5C%22%3A%5C%22ZYsm01V6Gr4aZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.5.0&d_brand=apple&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=c7ecee5b465f5edd7ed2e2189fad2335&st=1581317924210&sv=120"
    };

    $nobyda.post(JDLUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDLive.notify = "京东智能-生活: 签到接口请求失败 ‼️‼️"
          merge.JDLive.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东智能-生活签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDLive.notify = "京东智能-生活: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDLive.bean = beanQuantity
              merge.JDLive.success = 1
            } else {
              merge.JDLive.notify = "京东智能-生活: 成功, 明细: 无京豆 🐶"
              merge.JDLive.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东智能-生活签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDLive.notify = "京东智能-生活: 失败, 原因: 已签过 ⚠️"
              merge.JDLive.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDLive.notify = "京东智能-生活: 失败, 原因: 活动已结束 ⚠️"
                merge.JDLive.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDLive.notify = "京东智能-生活: 失败, 原因: Cookie失效‼️"
                  merge.JDLive.fail = 1
                } else if (cc.code == "600") {
                  merge.JDLive.notify = "京东智能-生活: 失败, 原因: 认证失败 ⚠️"
                  merge.JDLive.fail = 1
                } else {
                  merge.JDLive.notify = "京东智能-生活: 失败, 原因: 未知 ⚠️"
                  merge.JDLive.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东智能-生活" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JingDongPrize(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDkey = {
      url: 'https://api.m.jd.com/client.action?functionId=vvipscdp_raffleAct_index&client=apple&clientVersion=8.1.0&appid=member_benefit_m',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
        Referer: "https://jdmall.m.jd.com/beansForPrizes",
      }
    };

    $nobyda.get(JDkey, async function(error, response, data) {
      try {
        if (error) {
          merge.JDPrize.notify = "京东商城-大奖: 查询接口请求失败 ‼️‼️"
          merge.JDPrize.fail = 1
        } else {
          if (data.match(/\"raffleActKey\":\"[a-zA-z0-9]{3,}\"/)) {
            const cc = JSON.parse(data)
            merge.JDPrize.key = cc.data.floorInfoList[0].detail.raffleActKey
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-大奖查询KEY成功 " + Details)
            if (merge.JDPrize.key) {
              await JDPrizeCheckin(s)
            } else {
              merge.JDPrize.notify = "京东商城-大奖: 失败, 原因: 无奖池 ⚠️"
              merge.JDPrize.fail = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-大奖查询KEY失败 " + Details)
            if (data.match(/(未登录|\"101\")/)) {
              merge.JDPrize.notify = "京东大奖-登录: 失败, 原因: Cookie失效‼️"
              merge.JDPrize.fail = 1
            } else {
              merge.JDPrize.notify = "京东大奖-登录: 失败, 原因: 未知 ⚠️"
              merge.JDPrize.fail = 1
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-大奖查询KEY" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function JDPrizeCheckin(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDPUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=vvipscdp_raffleAct_lotteryDraw&body=%7B%22raffleActKey%22%3A%22' + merge.JDPrize.key + '%22%2C%22drawType%22%3A0%2C%22riskInformation%22%3A%7B%7D%7D&client=apple&clientVersion=8.1.0&appid=member_benefit_m',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
          Referer: "https://jdmall.m.jd.com/beansForPrizes",
        }
      };
      $nobyda.get(JDPUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDPrize.notify = "京东商城-大奖: 签到接口请求失败 ‼️‼️"
            merge.JDPrize.fail = 1
          } else {
            const c = JSON.parse(data)
            if (data.match(/\"success\":true/)) {
              var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-大奖签到成功 " + Details)
                if (data.match(/\"beanNumber\":\d+/)) {
                  merge.JDPrize.notify = "京东商城-大奖: 成功, 明细: " + c.data.beanNumber + "京豆 🐶"
                  merge.JDPrize.success = 1
                  merge.JDPrize.bean = c.data.beanNumber
                } else if (data.match(/\"couponInfoVo\"/)) {
                  if (data.match(/\"limitStr\"/)) {
                    merge.JDPrize.notify = "京东商城-大奖: 获得满" + c.data.couponInfoVo.quota + "减" + c.data.couponInfoVo.discount + "优惠券→ " + c.data.couponInfoVo.limitStr
                    merge.JDPrize.success = 1
                  } else {
                    merge.JDPrize.notify = "京东商城-大奖: 成功, 明细: 优惠券"
                    merge.JDPrize.success = 1
                  }
                } else if (data.match(/\"pitType\":0/)) {
                  merge.JDPrize.notify = "京东商城-大奖: 成功, 明细: 未中奖 🐶"
                  merge.JDPrize.success = 1
                } else {
                  merge.JDPrize.notify = "京东商城-大奖: 成功, 明细: 未知 🐶"
                  merge.JDPrize.success = 1
                }
            } else {
              var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-大奖签到失败 " + Details)
                if (data.match(/(已用光|7000003)/)) {
                  merge.JDPrize.notify = "京东商城-大奖: 失败, 原因: 已签过 ⚠️"
                  merge.JDPrize.fail = 1
                } else {
                  if (data.match(/(未登录|\"101\")/)) {
                    merge.JDPrize.notify = "京东商城-大奖: 失败, 原因: Cookie失效‼️"
                    merge.JDPrize.fail = 1
                  } else {
                    merge.JDPrize.notify = "京东商城-大奖: 失败, 原因: 未知 ⚠️"
                    merge.JDPrize.fail = 1
                  }
                }
            }
          }
          resolve('done')
        } catch (eor) {
          $nobyda.notify("京东商城-大奖签到" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve('done')
        }
      })
    }, s)
  });
}

function JingDongFood(s) {

  return new Promise(resolve => { setTimeout(() => {
    const JDMUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=userSign',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22FXy4qPoGOckBeTSpyYzozEW3M9mj%2BXDDcciQAT4BCBQaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200149803_31265281_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22Z3x1jBClFqsaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22riskParam%22%3A%7B%22platform%22%3A%223%22%2C%22orgType%22%3A%222%22%2C%22openId%22%3A%22-1%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22b8ff826674dda95c4258d632e7c5845e%22%2C%22shshshfpa%22%3A%22f6ca1cb3-300a-fef7-ce56-11b2dc685988-1582473660%22%2C%22shshshfpb%22%3A%22ao0pyKirmGbxBzmszs2h%2Fsw%3D%3D%22%2C%22childActivityUrl%22%3A%22https%3A%2F%2Fpro.m.jd.com%2Fmall%2Factive%2F43tTmWFv8cBQM6YNtJpq1gCFmCfv%2Findex.html%3FcollectionId%3D249%26un_area%3D20_1806_1810_12325%26lng%3D0%26lat%3D0%22%7D%2C%22siteClient%22%3A%22apple%22%2C%22mitemAddrId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%220%22%2C%22lat%22%3A%220%22%7D%2C%22addressId%22%3A%22%22%2C%22posLng%22%3A%22%22%2C%22posLat%22%3A%22%22%2C%22focus%22%3A%22%22%2C%22innerAnchor%22%3A%22%22%2C%22cv%22%3A%222.0%22%7D&client=wh5"
    };

    $nobyda.post(JDMUrl, function(error, response, data) {
      try {
        if (error) {
          merge.JDFood.notify = "京东商城-美食: 签到接口请求失败 ‼️‼️"
          merge.JDFood.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-美食签到成功 " + Details)
            if (data.match(/(\"text\":\"\d+京豆\")/)) {
              beanQuantity = cc.awardList[0].text.match(/\d+/)
              merge.JDFood.notify = "京东商城-美食: 成功, 明细: " + beanQuantity + "京豆 🐶"
              merge.JDFood.bean = beanQuantity
              merge.JDFood.success = 1
            } else {
              merge.JDFood.notify = "京东商城-美食: 成功, 明细: 无京豆 🐶"
              merge.JDFood.success = 1
            }
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东商城-美食签到失败 " + Details)
            if (data.match(/(已签到|已领取)/)) {
              merge.JDFood.notify = "京东商城-美食: 失败, 原因: 已签过 ⚠️"
              merge.JDFood.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDFood.notify = "京东商城-美食: 失败, 原因: 活动已结束 ⚠️"
                merge.JDFood.fail = 1
              } else {
                if (cc.code == 3) {
                  merge.JDFood.notify = "京东商城-美食: 失败, 原因: Cookie失效‼️"
                  merge.JDFood.fail = 1
                } else if (cc.code == "600") {
                  merge.JDFood.notify = "京东商城-美食: 失败, 原因: 认证失败 ⚠️"
                  merge.JDFood.fail = 1
                } else {
                  merge.JDFood.notify = "京东商城-美食: 失败, 原因: 未知 ⚠️"
                  merge.JDFood.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京东商城-美食" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })}, s)
  });
}

function TotalSteel() {

  return new Promise(resolve => {
    const SteelUrl = {
      url: 'https://coin.jd.com/m/gb/getBaseInfo.html',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      }
    };

    $nobyda.post(SteelUrl, function(error, response, data) {
      try {
        if (!error) {
          if (data.match(/(\"gbBalance\":\d+)/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东-总钢镚查询成功 " + Details)
            const cc = JSON.parse(data)
            merge.JRSteel.TSteel = cc.gbBalance
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东-总钢镚查询失败 " + Details)
          }
        } else {
          console.log("\n" + "京东-总钢镚查询请求失败 ")
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("钢镚接口" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })
  });
}

function TotalBean() {

  return new Promise(resolve => {
    const BeanUrl = {
      url: 'https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
        Referer: "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2"
      }
    };

    $nobyda.post(BeanUrl, function(error, response, data) {
      try {
        if (!error) {
          const cc = JSON.parse(data)
          if (cc.base.jdNum != 0) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东-总京豆查询成功 " + Details)
            merge.JDShake.Qbear = cc.base.jdNum
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东-总京豆查询失败 " + Details)
          }
          if (data.match(/\"nickname\" ?: ?\"(.+?)\",/)) {
            merge.JDShake.nickname = cc.base.nickname
          } else if (data.match(/\"no ?login\.?\"/)) {
            merge.JDShake.nickname = "Cookie失效 ‼️"
          } else {
            merge.JDShake.nickname = '';
          }
        } else {
          console.log("\n" + "京东-总京豆查询请求失败 ")
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("京豆接口" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })
  });
}

function TotalCash() {

  return new Promise(resolve => {
    const CashUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=myhongbao_balance',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", Cookie: KEY,
      },
      body: "body=%7B%22fp%22%3A%22-1%22%2C%22appToken%22%3A%22apphongbao_token%22%2C%22childActivityUrl%22%3A%22-1%22%2C%22country%22%3A%22cn%22%2C%22openId%22%3A%22-1%22%2C%22childActivityId%22%3A%22-1%22%2C%22applicantErp%22%3A%22-1%22%2C%22platformId%22%3A%22appHongBao%22%2C%22isRvc%22%3A%22-1%22%2C%22orgType%22%3A%222%22%2C%22activityType%22%3A%221%22%2C%22shshshfpb%22%3A%22-1%22%2C%22platformToken%22%3A%22apphongbao_token%22%2C%22organization%22%3A%22JD%22%2C%22pageClickKey%22%3A%22-1%22%2C%22platform%22%3A%221%22%2C%22eid%22%3A%22-1%22%2C%22appId%22%3A%22appHongBao%22%2C%22childActiveName%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22extend%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22activityArea%22%3A%22-1%22%2C%22childActivityTime%22%3A%22-1%22%7D&client=apple&clientVersion=8.5.0&d_brand=apple&networklibtype=JDNetworkBaseAF&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=fdc04c3ab0ee9148f947d24fb087b55d&st=1581245397648&sv=120"
    };

    $nobyda.post(CashUrl, function(error, response, data) {
      try {
        if (!error) {
          if (data.match(/(\"totalBalance\":\d+)/)) {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东-总红包查询成功 " + Details)
            const cc = JSON.parse(data)
            merge.JDCash.TCash = cc.totalBalance
          } else {
            var Details = LogDetails ? "response:\n" + data : ''; console.log("\n" + "京东-总红包查询失败 " + Details)
          }
        } else {
          console.log("\n" + "京东-总红包查询请求失败 ")
        }
        resolve('done')
      } catch (eor) {
        $nobyda.notify("红包接口" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve('done')
      }
    })
  });
}

function GetCookie() {
  try {
    if ($request.headers && $request.url.match(/api\.m\.jd\.com.*=signBean/)) {
      var CV = $request.headers['Cookie']
      if (CV.match(/(pt_key=.+?pt_pin=|pt_pin=.+?pt_key=)/)) {
        var CookieValue = CV.match(/pt_key=.+?;/) + CV.match(/pt_pin=.+?;/)
        var AccountOne = $nobyda.read("CookieJD") ? $nobyda.read("CookieJD").match(/pin=(.+?);/)[1] : null
        var AccountTwo = $nobyda.read("CookieJD2") ? $nobyda.read("CookieJD2").match(/pt_pin=(.+?);/)[1] : null
        var UserName = CookieValue.match(/pt_pin=(.+?);/)[1]
        var DecodeName = decodeURIComponent(UserName)

        if (!AccountOne || UserName == AccountOne) {
          var CookieName = " [账号一] ";
          var CookieKey = "CookieJD";
        } else if (!AccountTwo || UserName == AccountTwo) {
          var CookieName = " [账号二] ";
          var CookieKey = "CookieJD2";
        } else {
          $nobyda.notify("更新京东Cookie失败", "非历史写入账号 ‼️", '请开启脚本内"DeleteCookie"以清空Cookie ‼️')
          return
        }
      } else {
        $nobyda.notify("写入京东Cookie失败", "", "请查看脚本内说明, 登录网页获取 ‼️")
        return
      }
      if ($nobyda.read(CookieKey)) {
        if ($nobyda.read(CookieKey) != CookieValue) {
          var cookie = $nobyda.write(CookieValue, CookieKey);
          if (!cookie) {
            $nobyda.notify("用户名: " + DecodeName, "", "更新京东" + CookieName + "Cookie失败 ‼️");
          } else {
            $nobyda.notify("用户名: " + DecodeName, "", "更新京东" + CookieName + "Cookie成功 🎉");
          }
        }
      } else {
        var cookie = $nobyda.write(CookieValue, CookieKey);
        if (!cookie) {
          $nobyda.notify("用户名: " + DecodeName, "", "首次写入京东" + CookieName + "Cookie失败 ‼️");
        } else {
          $nobyda.notify("用户名: " + DecodeName, "", "首次写入京东" + CookieName + "Cookie成功 🎉");
        }
      }
    } else {
      $nobyda.notify("写入京东Cookie失败", "", "请检查匹配URL或配置内脚本类型 ‼️");
    }
  } catch (eor) {
    $nobyda.notify("写入京东Cookie失败", "", "未知错误 ‼️")
    console.log(JSON.stringify(eor) + "\n" + eor + "\n" + JSON.stringify($request.headers))
  }
}

// Modified from yichahucha
function nobyda() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox;
    const node = (() => {
        if (isNode) {
            const request = require('request');
            return ({request})
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (isNode) log(title+subtitle+message)
        if (isJSBox) $push.schedule({title: title, body: subtitle?subtitle+"\n"+message:message})
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
        if (isNode) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data);
                callback(error, adapterStatus(resp.response), body)
            };
            $http.get(options);
        }
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options);
        }
    }
    const log = (message) => console.log(message)
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return { isRequest, isJSBox, isNode, notify, write, read, get, post, log, done }
};