/*
JingDong bonus six in one

Description :
When using for the first time. Need to manually log in to the https://bean.m.jd.com checkin to get cookie. When Surge pops up to get a successful notification, you can disable the HTTP request script.
Due to the validity of cookie, if the script pops up a notification of cookie invalidation in the future, you need to repeat the above steps.

Daily bonus script will be performed every day at 9 am. You can modify the execution time.
If reprinted, please indicate the source. My TG channel @NobyDa

Update 2019.12.26 19:57 Beta v50

[Script]
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JD-DailyBonus/JD_DailyBonus.js
http-request https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBeanIndex max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JD-DailyBonus/JD_GetCookie.js

MITM = api.m.jd.com

*/

function JingDongBean() {
  var JDBUrl = {
    url: 'https://api.m.jd.com/client.action?functionId=signBeanIndex&appid=ld',
    headers: {
      Cookie: $persistentStore.read("CookieJD"),
    }
  };

  $httpClient.get(JDBUrl, function(error, response, data) {
    if (error) {
      $notification.post("京东签到错误‼️‼️", "", error)
      var JDBean = "京东商城-京豆: 签到接口请求失败 ‼️‼️" + "\n"
      JingDongSteel(JDBean)
    } else {
      var cc = JSON.parse(data)
      if (cc.code != 0) {
        console.log("Cookie error response: \n" + data)
        $notification.post("京东系列签到", "", "Cookie失效 请重新开启Cookie脚本获取 ‼️")
      } else {
        if (data.match(/跳转至拼图/)) {
          var JDBean = "京东商城-京豆: 签到失败, 原因: 需要拼图验证 ⚠️" + "\n"
          JingDongSteel(JDBean)
        } else {
          if (cc.data.status == 1) {
            console.log("京东商城-京豆签到成功response: \n" + data)
            if (data.match(/dailyAward/)) {
              if (cc.data.dailyAward.beanAward.beanCount) {
                var JDBean = "京东商城-京豆: 签到成功, 明细: " + cc.data.dailyAward.beanAward.beanCount + "京豆 🐶" + "\n"
                JingDongSteel(JDBean)
              } else {
                var JDBean = "京东商城-京豆: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
                JingDongSteel(JDBean)
              }
            } else {
              if (data.match(/continuityAward/)) {
                if (cc.data.continuityAward.beanAward.beanCount) {
                  var JDBean = "京东商城-京豆: 签到成功, 明细: " + cc.data.continuityAward.beanAward.beanCount + "京豆 🐶" + "\n"
                  JingDongSteel(JDBean)
                } else {
                  var JDBean = "京东商城-京豆: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
                  JingDongSteel(JDBean)
                }
              } else {
                if (data.match(/新人签到/)) {
                  var regex = /beanCount\":\"(\d+)\".+今天/;
                  var quantity = regex.exec(data)[1];
                  var JDBean = "京东商城-京豆: 签到成功, 明细: " + quantity + "京豆 🐶" + "\n"
                  JingDongSteel(JDBean)
                } else {
                  var JDBean = "京东商城-京豆: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
                  JingDongSteel(JDBean)
                }
              }
            }
          } else {
            console.log("京东商城-京豆签到失败response: \n" + data)
            if (data.match(/(已签到|新人签到)/)) {
              var JDBean = "京东商城-京豆: 签到失败, 原因: 已签过 ⚠️" + "\n"
              JingDongSteel(JDBean)
            } else {
              var JDBean = "京东商城-京豆: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
              JingDongSteel(JDBean)
            }
          }
        }
      }
    }
  })
}

function JingDongSteel(JDBean) {
  setTimeout(function() {
    var JDSUrl = {
      url: 'https://lottery.jd.com/award/lottery?actKey=RJn2y2',
      headers: {
        Cookie: $persistentStore.read("CookieJD"),
      }
    };

    $httpClient.get(JDSUrl, function(error, response, data) {
      if (error) {
        var JDSteel = "京东商城-钢镚: 签到接口请求失败 ‼️‼️" + "\n"
        JingRongBean(JDBean, JDSteel)
      } else {
        var cc = JSON.parse(data)
        if (cc.code == "0000") {
          console.log("京东商城-钢镚签到成功response: \n" + data)
          if (cc.data.volumn) {
            var JDSteel = "京东商城-钢镚: 签到成功, 明细: " + cc.data.volumn + "钢镚 💰" + "\n"
            JingRongBean(JDBean, JDSteel)
          } else {
            var JDSteel = "京东商城-钢镚: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
            JingRongBean(JDBean, JDSteel)
          }
        } else {
          console.log("京东商城-钢镚签到失败response: \n" + data)
          if (cc.code == "1000") {
            var JDSteel = "京东商城-钢镚: 签到失败, 原因: 已签过 ⚠️" + "\n"
            JingRongBean(JDBean, JDSteel)
          } else {
            if (cc.code == "3001") {
              var JDSteel = "京东商城-钢镚: 签到失败, 原因: 活动已结束 ⚠️" + "\n"
              JingRongBean(JDBean, JDSteel)
            } else {
              var JDSteel = "京东商城-钢镚: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
              JingRongBean(JDBean, JDSteel)
            }
          }
        }
      }
    })
  }, 700)
}

function JingRongBean(JDBean, JDSteel) {
  var login = {
    url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRecords',
    headers: {
      Cookie: $persistentStore.read("CookieJD"),
      Referer: "https://jddx.jd.com/m/money/index.html?from=sign",
    },
    body: "reqData=%7B%22bizLine%22%3A2%7D"
  };

  var JRBUrl = {
    url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRewardGift',
    headers: {
      Cookie: $persistentStore.read("CookieJD"),
      Referer: "https://jddx.jd.com/m/jddnew/money/index.html",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "reqData=%7B%22bizLine%22%3A2%2C%22signDate%22%3A%221%22%2C%22deviceInfo%22%3A%7B%22os%22%3A%22iOS%22%7D%2C%22clientType%22%3A%22sms%22%2C%22clientVersion%22%3A%2211.0%22%7D"
  };
  setTimeout(function() {
    $httpClient.post(login, function(error, response, data) {
      if (error) {
        var JRBean = "京东金融-京豆: 登录接口请求失败 ‼️‼️" + "\n"
        JingRongSteel(JDBean, JDSteel, JRBean)
      } else {
        setTimeout(function() {
          var cc = JSON.parse(data)
          if (cc.resultData.resultCode == "00000") {
            console.log("京东金融-京豆登录成功response: \n" + data)
            $httpClient.post(JRBUrl, function(error, response, data) {
              if (error) {
                var JRBean = "京东金融-京豆: 签到接口请求失败 ‼️‼️" + "\n"
                JingRongSteel(JDBean, JDSteel, JRBean)
              } else {
                var c = JSON.parse(data)
                if (c.resultData.resultCode == "00000") {
                  console.log("京东金融-京豆签到成功response: \n" + data)
                  if (c.resultData.data.rewardAmount != "0") {
                    var JRBean = "京东金融-京豆: 签到成功, 明细: " + c.resultData.data.rewardAmount + "京豆 🐶" + "\n"
                    JingRongSteel(JDBean, JDSteel, JRBean)
                  } else {
                    var JRBean = "京东金融-京豆: 签到成功, 明细: 无奖励 🐶" + "\n"
                    JingRongSteel(JDBean, JDSteel, JRBean)
                  }
                } else {
                  console.log("京东金融-京豆签到失败response: \n" + data)
                  if (data.match(/发放失败/)) {
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
              }
            })
          } else {
            console.log("京东金融-京豆登录失败response: \n" + data)
            var JRBean = "京东金融-京豆: 接口登录失败 ‼️‼️" + "\n"
            JingRongSteel(JDBean, JDSteel, JRBean)
          }
        }, 700)
      }
    })
  }, 700)
}

function JingRongSteel(JDBean, JDSteel, JRBean) {
  setTimeout(function() {
    var JRSUrl = {
      url: 'https://ms.jr.jd.com/gw/generic/gry/h5/m/signIn',
      headers: {
        Cookie: $persistentStore.read("CookieJD"),
      },
      body: "reqData=%7B%22channelSource%22%3A%22JRAPP%22%2C%22riskDeviceParam%22%3A%22%7B%7D%22%7D"
    };

    $httpClient.post(JRSUrl, function(error, response, data) {
      if (error) {
        var JRSteel = "京东金融-钢镚: 签到接口请求失败 ‼️‼️" + "\n"
        JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
      } else {
        var cc = JSON.parse(data)
        if (cc.resultData.resBusiCode == "0") {
          console.log("京东金融-钢镚签到成功response: \n" + data)
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
          console.log("京东金融-钢镚签到失败response: \n" + data)
          if (data.match(/已经领取/)) {
            var JRSteel = "京东金融-钢镚: 签到失败, 原因: 已签过 ⚠️" + "\n"
            JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
          } else {
            var JRSteel = "京东金融-钢镚: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
            JingDongShake(JDBean, JDSteel, JRBean, JRSteel)
          }
        }
      }
    })
  }, 700)
}

function JingDongShake(JDBean, JDSteel, JRBean, JRSteel) {
  setTimeout(function() {
    var JDSh = {
      url: 'https://api.m.jd.com/client.action?appid=vip_h5&functionId=vvipclub_shaking',
      headers: {
        Cookie: $persistentStore.read("CookieJD"),
      }
    };

    $httpClient.get(JDSh, function(error, response, data) {
      if (error) {
        var JDShake = "京东商城-摇摇: 签到接口请求失败 ‼️‼️"
        JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
      } else {
        var cc = JSON.parse(data)
        if (data.match(/prize/)) {
          console.log("京东商城-摇一摇签到成功response: \n" + data)
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
          console.log("京东商城-摇一摇签到失败response: \n" + data)
          if (data.match(/true/)) {
            var JDShake = "京东商城-摇摇: 签到成功, 明细: 无奖励 🐶"
            JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
          } else {
            var JDShake = "京东商城-摇摇: 签到失败, 原因: 已摇过 ⚠️"
            JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake)
          }
        }
      }
    })
  }, 700)
}

function JRDoubleSign(JDBean, JDSteel, JRBean, JRSteel, JDShake) {
  setTimeout(function() {
    var JRDSUrl = {
      url: 'https://nu.jr.jd.com/gw/generic/jrm/h5/m/process?',
      headers: {
        Cookie: $persistentStore.read("CookieJD"),
      },
      body: "reqData=%7B%22actCode%22%3A%22FBBFEC496C%22%2C%22type%22%3A3%2C%22riskDeviceParam%22%3A%22%22%7D"
    };

    $httpClient.post(JRDSUrl, function(error, response, data) {
      if (error) {
        var JRDSign = "京东金融-双签: 签到接口请求失败 ‼️‼️" + "\n"
        notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
      } else {
        var cc = JSON.parse(data)
        if (data.match(/京豆X/)) {
          console.log("京东金融-双签签到成功response: \n" + data)
          if (cc.resultData.data.businessData.businessData.awardListVo[0].count) {
            var JRDSign = "京东金融-双签: 签到成功, 明细: " + cc.resultData.data.businessData.businessData.awardListVo[0].count + "京豆 🐶" + "\n"
            notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
          } else {
            var JRDSign = "京东金融-双签: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
            notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
          }
        } else {
          console.log("京东金融-双签签到失败response: \n" + data)
          if (data.match(/已领取/)) {
            var JRDSign = "京东金融-双签: 签到失败, 原因: 已签过 ⚠️" + "\n"
            notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
          } else {
            if (data.match(/不存在/)) {
              var JRDSign = "京东金融-双签: 签到失败, 原因: 活动已结束 ⚠️" + "\n"
              notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign)
            } else {
              if (data.match(/未在/)) {
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
      }
    })
  }, 700)
}

function notice(JDBean, JDSteel, JRBean, JRSteel, JDShake, JRDSign) {
  //var date = new Date()
  //var month = date.getMonth() + 1
  //var integrate = JDBean + JRBean + JDSteel + JRSteel + JRDSign + JDShake
  //$notification.post("京东商城&京东金融", month + "月" + date.getDate() + "日 签到状态:", integrate)
  $notification.post(JRDSign, JDBean, JRBean + JDSteel + JRSteel + JDShake)
}

JingDongBean()
$done()