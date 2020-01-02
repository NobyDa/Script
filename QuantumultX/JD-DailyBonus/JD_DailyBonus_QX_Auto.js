/*
JingDong bonus six in one. 

Description :
Please put this script in your local path
Daily bonus script will be performed every day at 9 am. You can modify the execution time.
Fill in your cookie at the following KEY. Or use another script to get cookies

If reprinted, please indicate the source. My TG channel @NobyDa
Update 2019.12.26 19:57 Beta v50

[task_local]
0 9 * * * JD_DailyBonus_QX_Auto.js

*/

var KEY = $prefs.valueForKey("CookieJD");

function JingDongBean() {
  var JDBUrl = {
    url: 'https://api.m.jd.com/client.action?functionId=signBeanIndex&appid=ld',
    method: "GET",
    headers: {
      "Cookie": KEY,
    }
  };

  $task.fetch(JDBUrl).then(response => {
    var cc = JSON.parse(response.body)
    if (cc.code != 0) {
      console.log("Cookie error response: \n" + response.body)
      $notify("京东系列签到", "", "Cookie失效 请重新开启Cookie脚本获取 ‼️")
    } else {
      if (response.body.match(/跳转至拼图/)) {
        var JDBean = "京东商城-京豆: 签到失败, 原因: 需要拼图验证 ⚠️" + "\n"
        JingDongSteel(JDBean)
      } else {
        if (cc.data.status == 1) {
          console.log("京东商城-京豆签到成功response: \n" + response.body)
          if (response.body.match(/dailyAward/)) {
            if (cc.data.dailyAward.beanAward.beanCount) {
              var JDBean = "京东商城-京豆: 签到成功, 明细: " + cc.data.dailyAward.beanAward.beanCount + "京豆 🐶" + "\n"
              JingDongSteel(JDBean)
            } else {
              var JDBean = "京东商城-京豆: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
              JingDongSteel(JDBean)
            }
          } else {
            if (response.body.match(/continuityAward/)) {
              if (cc.data.continuityAward.beanAward.beanCount) {
                var JDBean = "京东商城-京豆: 签到成功, 明细: " + cc.data.continuityAward.beanAward.beanCount + "京豆 🐶" + "\n"
                JingDongSteel(JDBean)
              } else {
                var JDBean = "京东商城-京豆: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
                JingDongSteel(JDBean)
              }
            } else {
              if (response.body.match(/新人签到/)) {
                var regex = /beanCount\":\"(\d+)\".+今天/;
                var quantity = regex.exec(response.body)[1];
                var JDBean = "京东商城-京豆: 签到成功, 明细: " + quantity + "京豆 🐶" + "\n"
                JingDongSteel(JDBean)
              } else {
                var JDBean = "京东商城-京豆: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
                JingDongSteel(JDBean)
              }
            }
          }
        } else {
          console.log("京东商城-京豆签到失败response: \n" + response.body)
          if (response.body.match(/(已签到|新人签到)/)) {
            var JDBean = "京东商城-京豆: 签到失败, 原因: 已签过 ⚠️" + "\n"
            JingDongSteel(JDBean)
          } else {
            var JDBean = "京东商城-京豆: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
            JingDongSteel(JDBean)
          }
        }
      }
    }
  }, reason => {
    $notify("京东商城-京豆-请求失败原因:", "", reason.error);
    var JDBean = "京东商城-京豆: 签到接口请求失败 ‼️‼️" + "\n"
    JingDongSteel(JDBean)
  });
}

function JingDongSteel(JDBean) {
  setTimeout(function() {
    //因该签到活动已结束
    JingRongBean(JDBean, null)
  }, 700)
}

function JingRongBean(JDBean, JDSteel) {
  var login = {
    url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRecords',
    method: "POST",
    body: "reqData=%7B%22bizLine%22%3A2%7D",
    headers: {
      "Cookie": KEY,
      "Referer": "https://jddx.jd.com/m/money/index.html?from=sign",
    }
  };
  var JRBUrl = {
    url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRewardGift',
    method: "POST",
    headers: {
      "Cookie": KEY,
      "Referer": "https://jddx.jd.com/m/jddnew/money/index.html",
    }
  };
  setTimeout(function() {
    $task.fetch(login).then(response => {
      setTimeout(function() {
        var cc = JSON.parse(response.body)
        if (cc.resultData.resultCode == "00000") {
          console.log("京东金融-京豆登录成功response: \n" + response.body)
          $task.fetch(JRBUrl).then(response => {
            var c = JSON.parse(response.body)
            if (c.resultData.resultCode == "00000") {
              console.log("京东金融-京豆签到成功response: \n" + response.body)
              if (c.resultData.data.rewardAmount != "0") {
                var JRBean = "京东金融-京豆: 签到成功, 明细: " + c.resultData.data.rewardAmount + "京豆 🐶" + "\n"
                JingRongSteel(JDBean, JDSteel, JRBean)
              } else {
                var JRBean = "京东金融-京豆: 签到成功, 明细: 无奖励 🐶" + "\n"
                JingRongSteel(JDBean, JDSteel, JRBean)
              }
            } else {
              console.log("京东金融-京豆签到失败response: \n" + response.body)
              if (response.body.match(/发放失败/)) {
                var JRBean = "京东金融-京豆: 签到失败, 原因: 已签过 ⚠️" + "\n"
                JingRongSteel(JDBean, JDSteel, JRBean)
              } else {
                if (c.resultData.resultCode != "00000") {
                  var JRBean = "京东金融-京豆: 签到失败, 原因: 已签过 ⚠️" + "\n"
                  JingRongSteel(JDBean, JDSteel, JRBean)
                } else {
                  var JRBean = "京东金融-京豆: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
                  JingRongSteel(JDBean, JDSteel, JRBean)
                }
              }
            }
          }, reason => {
            $notify("京东金融-京豆-签到请求失败原因:", "", reason.error)
            var JRBean = "京东金融-京豆: 签到接口请求失败 ‼️‼️" + "\n"
            JingRongSteel(JDBean, JDSteel, JRBean)
          });
        } else {
          console.log("京东金融-京豆登录失败response: \n" + response.body)
          var JRBean = "京东金融-京豆: 接口登录失败 ‼️‼️" + "\n"
          JingRongSteel(JDBean, JDSteel, JRBean)
        }
      }, 700)
    }, reason => {
      $notify("京东金融-京豆-登录请求失败原因:", "", reason.error)
      var JRBean = "京东金融-京豆: 登录接口请求失败 ‼️‼️" + "\n"
      JingRongSteel(JDBean, JDSteel, JRBean)
    });
  }, 700)
}

function JingRongSteel(JDBean, JDSteel, JRBean) {
  setTimeout(function() {
    var JRSUrl = {
      url: 'https://ms.jr.jd.com/gw/generic/gry/h5/m/signIn',
      method: "POST",
      body: "reqData=%7B%22channelSource%22%3A%22JRAPP%22%2C%22riskDeviceParam%22%3A%22%7B%7D%22%7D",
      headers: {
        "Cookie": KEY,
      }
    };

    $task.fetch(JRSUrl).then(response => {
      var cc = JSON.parse(response.body)
      if (cc.resultData.resBusiCode == "0") {
        console.log("京东金融-钢镚签到成功response: \n" + response.body)
        if (cc.resultData.resBusiData.actualTotalRewardsValue) {
          var leng = "" + cc.resultData.resBusiData.actualTotalRewardsValue
          if (leng.length == 1) {
            var JRSteel = "京东金融-钢镚: 签到成功, 明细: " + "0.0" + cc.resultData.resBusiData.actualTotalRewardsValue + "钢镚 💰" + "\n"
            JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
          } else {
            var JRSteel = "京东金融-钢镚: 签到成功, 明细: " + "0." + cc.resultData.resBusiData.actualTotalRewardsValue + "钢镚 💰" + "\n"
            JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
          }
        } else {
          var JRSteel = "京东金融-钢镚: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
          JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
        }
      } else {
        console.log("京东金融-钢镚签到失败response: \n" + response.body)
        if (response.body.match(/已经领取/)) {
          var JRSteel = "京东金融-钢镚: 签到失败, 原因: 已签过 ⚠️" + "\n"
          JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
        } else {
          if (response.body.match(/未实名/)) {
            var JRSteel = "京东金融-钢镚: 签到失败, 原因: 账号未实名 ⚠️" + "\n"
            JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
          } else {
          var JRSteel = "京东金融-钢镚: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
          JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
          }
        }
      }
    }, reason => {
      var JRSteel = "京东金融-钢镚: 签到接口请求失败 ‼️‼️" + "\n"
      $notify("京东金融-钢镚-请求失败原因:", "", reason.error)
      JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
    });
  }, 700)
}

function JingDongShake(JDBean, JDSteel, JRBean, JRSteel) {
  setTimeout(function() {
    var JDSh = {
      url: 'https://api.m.jd.com/client.action?appid=vip_h5&functionId=vvipclub_shaking',
      method: "GET",
      headers: {
        "Cookie": KEY,
      }
    };

    $task.fetch(JDSh).then(response => {
      var cc = JSON.parse(response.body)
      if (response.body.match(/prize/)) {
        console.log("京东商城-摇一摇签到成功response: \n" + response.body)
        if (cc.data.prizeBean) {
          var JDShake = "京东商城-摇摇: 签到成功, 明细: " + cc.data.prizeBean.count + "京豆 🐶"
          JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
        } else {
          if (cc.data.prizeCoupon) {
            var JDShake = "京东商城-摇摇: 获得满" + cc.data.prizeCoupon.quota + "减" + cc.data.prizeCoupon.discount + "优惠券→ " + cc.data.prizeCoupon.limitStr
            JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
          } else {
            var JDShake = "京东商城-摇摇: 需修正‼️日志发至TG:@NobyDa_bot"
            JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
          }
        }
      } else {
        console.log("京东商城-摇一摇签到失败response: \n" + response.body)
        if (response.body.match(/true/)) {
          var JDShake = "京东商城-摇摇: 签到成功, 明细: 无奖励 🐶"
          JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
        } else {
          var JDShake = "京东商城-摇摇: 签到失败, 原因: 已摇过 ⚠️"
          JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
        }
      }
    }, reason => {
      var JDShake = "京东商城-摇摇: 签到接口请求失败 ‼️‼️"
      $notify("京东商城-摇一摇-请求失败原因:", "", reason.error)
      JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
    });
  }, 700)
}

function JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake) {
  setTimeout(function() {
    var JRDSUrl = {
      url: 'https://nu.jr.jd.com/gw/generic/jrm/h5/m/process?',
      method: "POST",
      body: "reqData=%7B%22actCode%22%3A%22FBBFEC496C%22%2C%22type%22%3A3%2C%22riskDeviceParam%22%3A%22%22%7D",
      headers: {
        "Cookie": KEY,
      }
    };

    $task.fetch(JRDSUrl).then(response => {
      var cc = JSON.parse(response.body)
      if (response.body.match(/京豆X/)) {
        console.log("京东金融-双签签到成功response: \n" + response.body)
        if (cc.resultData.data.businessData.businessData.awardListVo[0].count) {
          var JRDSign = "京东金融-双签: 签到成功, 明细: " + cc.resultData.data.businessData.businessData.awardListVo[0].count + "京豆 🐶" + "\n"
          notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
        } else {
          var JRDSign = "京东金融-双签: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
          notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
        }
      } else {
        console.log("京东金融-双签签到失败response: \n" + response.body)
        if (response.body.match(/已领取/)) {
          var JRDSign = "京东金融-双签: 签到失败, 原因: 已签过 ⚠️" + "\n"
          notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
        } else {
          if (response.body.match(/不存在/)) {
            var JRDSign = "京东金融-双签: 签到失败, 原因: 活动已结束 ⚠️" + "\n"
            notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
          } else {
            if (response.body.match(/未在/)) {
              var JRDSign = "京东金融-双签: 签到失败, 原因: 未在京东签到 ⚠️" + "\n"
              notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
            } else {
              if (cc.resultData.data.businessData.businessCode == "000sq" && cc.resultData.data.businessData.businessMsg == "成功") {
                var JRDSign = "京东金融-双签: 签到成功, 明细: 无奖励 🐶" + "\n"
                notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
              } else {
                var JRDSign = "京东金融-双签: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
                notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
              }
            }
          }
        }
      }
    }, reason => {
      var JRDSign = "京东金融-双签: 签到接口请求失败 ‼️‼️" + "\n"
      $notify("京东金融-双签-请求失败原因:", "", reason.error)
      notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
    });
  }, 700)
}

function notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign) {
  //var date = new Date()
  //var month = date.getMonth() + 1
  //var integrate = JDBean + JRBean + JDSteel + JRSteel + JRDSign + JDShake
  //$notify("京东商城&京东金融", month + "月" + date.getDate() + "日 签到状态:", integrate)
  $notify(JRDSign, JDBean, JRBean + JRSteel + JDShake)
}

JingDongBean()