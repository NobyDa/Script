/*
JingDong bonus six in one

Description :
When using for the first time. Need to manually log in to the https://bean.m.jd.com checkin to get cookie. When Surge pops up to get a successful notification, you can disable the HTTP request script.
Due to the validity of cookie, if the script pops up a notification of cookie invalidation in the future, you need to repeat the above steps.

Daily bonus script will be performed every day at 9 am. You can modify the execution time.
If reprinted, please indicate the source. My TG channel @NobyDa

Update 2020.1.9 15:57 v53
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JD-DailyBonus/JD_DailyBonus.js
http-request https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBeanIndex max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JD-DailyBonus/JD_GetCookie.js
~~~~~~~~~~~~~~~~
QX 1.0.5 :
[task_local]
0 9 * * * JD_DailyBonus_QX_Auto.js

[rewrite_local]
# Get JingDong cookie. 【QX TF188+】:
https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBeanIndex url script-request-header JD_GetCookie_QX_Auto.js
~~~~~~~~~~~~~~~~
QX or Surge MITM = api.m.jd.com
~~~~~~~~~~~~~~~~
*/
const $nobyda = (() => {
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) return ""
        if (isSurge) return $done()
    }
    return { isQuanX, isSurge, notify, write, read, get, post, end }
})();

const log = true;
const KEY = $nobyda.read("CookieJD");

function JingDongBean() {
  const JDBUrl = {
    url: 'https://api.m.jd.com/client.action?functionId=signBeanIndex&appid=ld',
    headers: {
      Cookie: KEY,
    }
  };

  $nobyda.get(JDBUrl, function(error, response, data) {
    if (error) {
      const JDBean = "京东商城-京豆: 签到接口请求失败 ‼️‼️" + "\n"
      JingDongTurn(JDBean)
    } else {
      const cc = JSON.parse(data)
      if (cc.code == 3) {
        if (log) console.log("京东商城-京豆Cookie失效response: \n" + data)
          const JDBean = "京东商城-京豆: 签到失败, 原因: Cookie失效‼️" + "\n"
          JingDongTurn(JDBean)
      } else {
        if (data.match(/跳转至拼图/)) {
          const JDBean = "京东商城-京豆: 签到失败, 原因: 需要拼图验证 ⚠️" + "\n"
          JingDongTurn(JDBean)
        } else {
          if (cc.data.status == 1) {
            if (log) console.log("京东商城-京豆签到成功response: \n" + data)
            if (data.match(/dailyAward/)) {
              if (cc.data.dailyAward.beanAward.beanCount) {
                const JDBean = "京东商城-京豆: 签到成功, 明细: " + cc.data.dailyAward.beanAward.beanCount + "京豆 🐶" + "\n"
                JingDongTurn(JDBean)
              } else {
                const JDBean = "京东商城-京豆: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
                JingDongTurn(JDBean)
              }
            } else {
              if (data.match(/continuityAward/)) {
                if (cc.data.continuityAward.beanAward.beanCount) {
                  const JDBean = "京东商城-京豆: 签到成功, 明细: " + cc.data.continuityAward.beanAward.beanCount + "京豆 🐶" + "\n"
                  JingDongTurn(JDBean)
                } else {
                  const JDBean = "京东商城-京豆: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
                  JingDongTurn(JDBean)
                }
              } else {
                if (data.match(/新人签到/)) {
                  const regex = /beanCount\":\"(\d+)\".+今天/;
                  const quantity = regex.exec(data)[1];
                  const JDBean = "京东商城-京豆: 签到成功, 明细: " + quantity + "京豆 🐶" + "\n"
                  JingDongTurn(JDBean)
                } else {
                  const JDBean = "京东商城-京豆: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
                  JingDongTurn(JDBean)
                }
              }
            }
          } else {
            if (log) console.log("京东商城-京豆签到失败response: \n" + data)
            if (data.match(/(已签到|新人签到)/)) {
              const JDBean = "京东商城-京豆: 签到失败, 原因: 已签过 ⚠️" + "\n"
              JingDongTurn(JDBean)
            } else {
              const JDBean = "京东商城-京豆: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
              JingDongTurn(JDBean)
            }
          }
        }
      }
    }
  })
}

function JingDongTurn(JDBean) {
  setTimeout(function() {
    const JDTUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=lotteryDraw&body=%7B%22actId%22%3A%22jgpqtzjhvaoym%22%2C%22appSource%22%3A%22jdhome%22%2C%22lotteryCode%22%3A%224wwzdq7wkqx2usx4g5i2nu5ho4auto4qxylblkxacm7jqdsltsepmgpn3b2hgyd7hiawzpccizuck%22%7D&appid=ld',
      headers: {
        Cookie: KEY,
      }
    };

    $nobyda.get(JDTUrl, function(error, response, data) {
      if (error) {
        const JDturn = "京东商城-转盘: 签到接口请求失败 ‼️‼️" + "\n"
        JingRongBean(JDBean, JDturn)
      } else {
        const cc = JSON.parse(data)
        if (cc.code == 3) {
          if (log) console.log("京东转盘Cookie失效response: \n" + data)
          const JDturn = "京东商城-转盘: 签到失败, 原因: Cookie失效‼️" + "\n"
          JingRongBean(JDBean, JDturn)
        } else {
          if (data.match(/(\"T216\"|活动结束)/)) {
            const JDturn = "京东商城-转盘: 签到失败, 原因: 活动结束 ⚠️" + "\n"
            JingRongBean(JDBean, JDturn)
          } else {
            if (data.match(/(京豆|\"910582\")/)) {
              if (log) console.log("京东商城-转盘签到成功response: \n" + data)
              if (cc.data.prizeSendNumber) {
                const JDturn = "京东商城-转盘: 签到成功, 明细: " + cc.data.prizeSendNumber + "京豆 🐶" + "\n"
                JingRongBean(JDBean, JDturn)
              } else {
                const JDturn = "京东商城-转盘: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
                JingRongBean(JDBean, JDturn)
              }
            } else {
              if (log) console.log("京东商城-转盘签到失败response: \n" + data)
              if (data.match(/chances\":\"1\".+未中奖/)) {
                setTimeout(function() {
                  JingDongTurn(JDBean)
                }, 2000)
              } else if (data.match(/chances\":\"0\".+未中奖/)) {
                const JDturn = "京东商城-转盘: 运气稍差, 状态: 未中奖 🐶" + "\n"
                JingRongBean(JDBean, JDturn)
              } else if (data.match(/(T215|次数为0)/)) {
                const JDturn = "京东商城-转盘: 签到失败, 原因: 无机会 ⚠️" + "\n"
                JingRongBean(JDBean, JDturn)
              } else if (data.match(/(T210|密码)/)) {
                const JDturn = "京东商城-转盘: 签到失败, 原因: 无支付密码 ⚠️" + "\n"
                JingRongBean(JDBean, JDturn)
              } else {
                const JDturn = "京东商城-转盘: 签到失败, 原因: 未知 ⚠️" + "\n"
                JingRongBean(JDBean, JDturn)
              }
            }
          }
        }
      }
    })
  }, 200)
}

function JingRongBean(JDBean, JDturn) {
  const login = {
    url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRecords',
    headers: {
      Cookie: KEY,
      Referer: "https://jddx.jd.com/m/money/index.html?from=sign",
    },
    body: "reqData=%7B%22bizLine%22%3A2%7D"
  };

  const JRBUrl = {
    url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRewardGift',
    headers: {
      Cookie: KEY,
      Referer: "https://jddx.jd.com/m/jddnew/money/index.html",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "reqData=%7B%22bizLine%22%3A2%2C%22signDate%22%3A%221%22%2C%22deviceInfo%22%3A%7B%22os%22%3A%22iOS%22%7D%2C%22clientType%22%3A%22sms%22%2C%22clientVersion%22%3A%2211.0%22%7D"
  };
  setTimeout(function() {
    $nobyda.post(login, function(error, response, data) {
      if (error) {
        const JRBean = "京东金融-京豆: 登录接口请求失败 ‼️‼️" + "\n"
        JingRongSteel(JDBean, JDturn, JRBean)
      } else {
        setTimeout(function() {
          if (data.match(/\"login\":true/)) {
            if (log) console.log("京东金融-京豆登录成功response: \n" + data)
            $nobyda.post(JRBUrl, function(error, response, data) {
              if (error) {
                const JRBean = "京东金融-京豆: 签到接口请求失败 ‼️‼️" + "\n"
                JingRongSteel(JDBean, JDturn, JRBean)
              } else {
                const c = JSON.parse(data)
                if (data.match(/\"resultCode\":\"00000\"/)) {
                  if (log) console.log("京东金融-京豆签到成功response: \n" + data)
                  if (c.resultData.data.rewardAmount != "0") {
                    const JRBean = "京东金融-京豆: 签到成功, 明细: " + c.resultData.data.rewardAmount + "京豆 🐶" + "\n"
                    JingRongSteel(JDBean, JDturn, JRBean)
                  } else {
                    const JRBean = "京东金融-京豆: 签到成功, 明细: 无奖励 🐶" + "\n"
                    JingRongSteel(JDBean, JDturn, JRBean)
                  }
                } else {
                  if (log) console.log("京东金融-京豆签到失败response: \n" + data)
                  if (data.match(/(发放失败|70111)/)) {
                    const JRBean = "京东金融-京豆: 签到失败, 原因: 已签过 ⚠️" + "\n"
                    JingRongSteel(JDBean, JDturn, JRBean)
                  } else {
                    if (data.match(/(\"resultCode\":3|请先登录)/)) {
                      const JRBean = "京东金融-京豆: 签到失败, 原因: Cookie失效‼️" + "\n"
                      JingRongSteel(JDBean, JDturn, JRBean)
                    } else {
                      const JRBean = "京东金融-京豆: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
                      JingRongSteel(JDBean, JDturn, JRBean)
                    }
                  }
                }
              }
            })
          } else {
            if (log) console.log("京东金融-京豆登录失败response: \n" + data)
            if (data.match(/\"login\":false/)) {
              const JRBean = "京东金融-京豆: 登录失败, 原因: Cookie失效‼️" + "\n"
              JingRongSteel(JDBean, JDturn, JRBean)
            } else {
              const JRBean = "京东金融-京豆: 登录接口需修正 ‼️‼️" + "\n"
              JingRongSteel(JDBean, JDturn, JRBean)
            }
          }
        }, 200)
      }
    })
  }, 200)
}

function JingRongSteel(JDBean, JDturn, JRBean) {
  setTimeout(function() {
    const JRSUrl = {
      url: 'https://ms.jr.jd.com/gw/generic/gry/h5/m/signIn',
      headers: {
        Cookie: KEY,
      },
      body: "reqData=%7B%22channelSource%22%3A%22JRAPP%22%2C%22riskDeviceParam%22%3A%22%7B%7D%22%7D"
    };

    $nobyda.post(JRSUrl, function(error, response, data) {
      if (error) {
        const JRSteel = "京东金融-钢镚: 签到接口请求失败 ‼️‼️" + "\n"
        JingDongShake(JDBean, JDturn, JRBean, JRSteel)
      } else {
        const cc = JSON.parse(data)
        if (data.match(/\"resBusiCode\":0/)) {
          if (log) console.log("京东金融-钢镚签到成功response: \n" + data)
          if (cc.resultData.resBusiData.actualTotalRewardsValue) {
            const leng = "" + cc.resultData.resBusiData.actualTotalRewardsValue
            if (leng.length == 1) {
              const JRSteel = "京东金融-钢镚: 签到成功, 明细: " + "0.0" + cc.resultData.resBusiData.actualTotalRewardsValue + "钢镚 💰" + "\n"
              JingDongShake(JDBean, JDturn, JRBean, JRSteel)
            } else {
              const JRSteel = "京东金融-钢镚: 签到成功, 明细: " + "0." + cc.resultData.resBusiData.actualTotalRewardsValue + "钢镚 💰" + "\n"
              JingDongShake(JDBean, JDturn, JRBean, JRSteel)
            }
          } else {
            const JRSteel = "京东金融-钢镚: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
            JingDongShake(JDBean, JDturn, JRBean, JRSteel)
          }
        } else {
          if (log) console.log("京东金融-钢镚签到失败response: \n" + data)
          if (data.match(/(已经领取|\"resBusiCode\":15)/)) {
            const JRSteel = "京东金融-钢镚: 签到失败, 原因: 已签过 ⚠️" + "\n"
            JingDongShake(JDBean, JDturn, JRBean, JRSteel)
          } else {
            if (data.match(/未实名/)) {
              const JRSteel = "京东金融-钢镚: 签到失败, 原因: 账号未实名 ⚠️" + "\n"
              JingDongShake(JDBean, JDturn, JRBean, JRSteel)
            } else {
              if (data.match(/(\"resultCode\":3|请先登录)/)) {
                const JRSteel = "京东金融-钢镚: 签到失败, 原因: Cookie失效‼️" + "\n"
                JingDongShake(JDBean, JDturn, JRBean, JRSteel)
              } else {
                const JRSteel = "京东金融-钢镚: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
                JingDongShake(JDBean, JDturn, JRBean, JRSteel)
              }
            }
          }
        }
      }
    })
  }, 200)
}

function JingDongShake(JDBean, JDturn, JRBean, JRSteel) {
  setTimeout(function() {
    const JDSh = {
      url: 'https://api.m.jd.com/client.action?appid=vip_h5&functionId=vvipclub_shaking',
      headers: {
        Cookie: KEY,
      }
    };

    $nobyda.get(JDSh, function(error, response, data) {
      if (error) {
        const JDShake = "京东商城-摇摇: 签到接口请求失败 ‼️‼️\n" + error
        JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake)
      } else {
        const cc = JSON.parse(data)
        if (data.match(/prize/)) {
          if (log) console.log("京东商城-摇一摇签到成功response: \n" + data)
          if (cc.data.prizeBean) {
            const JDShake = "京东商城-摇摇: 签到成功, 明细: " + cc.data.prizeBean.count + "京豆 🐶"
            JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake)
          } else {
            if (cc.data.prizeCoupon) {
              const JDShake = "京东商城-摇摇: 获得满" + cc.data.prizeCoupon.quota + "减" + cc.data.prizeCoupon.discount + "优惠券→ " + cc.data.prizeCoupon.limitStr
              JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake)
            } else {
              const JDShake = "京东商城-摇摇: 需修正‼️日志发至TG:@NobyDa_bot"
              JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake)
            }
          }
        } else {
          if (log) console.log("京东商城-摇一摇签到失败response: \n" + data)
          if (data.match(/true/)) {
            const JDShake = "京东商城-摇摇: 签到成功, 明细: 无奖励 🐶"
            JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake)
          } else {
            if (data.match(/(无免费|8000005)/)) {
              const JDShake = "京东商城-摇摇: 签到失败, 原因: 已摇过 ⚠️"
              JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake)
            } else if (data.match(/(未登录|101)/)) {
              const JDShake = "京东商城-摇摇: 签到失败, 原因: Cookie失效‼️"
              JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake)
            } else {
              const JDShake = "京东商城-摇摇: 需修正‼️日志发至TG:@NobyDa_bot"
              JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake)
            }
          }
        }
      }
    })
  }, 200)
}

function JRDoubleSign(JDBean, JDturn, JRBean, JRSteel, JDShake) {
  setTimeout(function() {
    const JRDSUrl = {
      url: 'https://nu.jr.jd.com/gw/generic/jrm/h5/m/process?',
      headers: {
        Cookie: KEY,
      },
      body: "reqData=%7B%22actCode%22%3A%22FBBFEC496C%22%2C%22type%22%3A3%2C%22riskDeviceParam%22%3A%22%22%7D"
    };

    $nobyda.post(JRDSUrl, function(error, response, data) {
      if (error) {
        const JRDSign = "京东金融-双签: 签到接口请求失败 ‼️‼️" + "\n"
        notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
      } else {
        const cc = JSON.parse(data)
        if (data.match(/京豆X/)) {
          if (log) console.log("京东金融-双签签到成功response: \n" + data)
          if (cc.resultData.data.businessData.businessData.awardListVo[0].count) {
            const JRDSign = "京东金融-双签: 签到成功, 明细: " + cc.resultData.data.businessData.businessData.awardListVo[0].count + "京豆 🐶" + "\n"
            notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
          } else {
            const JRDSign = "京东金融-双签: 签到成功, 明细: 显示接口待更新 ⚠️" + "\n"
            notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
          }
        } else {
          if (log) console.log("京东金融-双签签到失败response: \n" + data)
          if (data.match(/已领取/)) {
            const JRDSign = "京东金融-双签: 签到失败, 原因: 已签过 ⚠️" + "\n"
            notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
          } else {
            if (data.match(/不存在/)) {
              const JRDSign = "京东金融-双签: 签到失败, 原因: 活动已结束 ⚠️" + "\n"
              notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
            } else {
              if (data.match(/未在/)) {
                const JRDSign = "京东金融-双签: 签到失败, 原因: 未在京东签到 ⚠️" + "\n"
                notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
              } else {
                if (data.match(/(\"resultCode\":3|请先登录)/)) {
                  const JRDSign = "京东金融-双签: 签到失败, 原因: Cookie失效‼️" + "\n"
                  notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
                } else if (cc.resultData.data.businessData.businessCode == "000sq" && cc.resultData.data.businessData.businessMsg == "成功") {
                  const JRDSign = "京东金融-双签: 签到成功, 明细: 无奖励 🐶" + "\n"
                  notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
                } else {
                  const JRDSign = "京东金融-双签: 需修正‼️日志发至TG:@NobyDa_bot" + "\n"
                  notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign)
                }
              }
            }
          }
        }
      }
    })
  }, 500)
}

function notice(JDBean, JDturn, JRBean, JRSteel, JDShake, JRDSign) {
  $nobyda.notify(JRDSign, JDBean, JRBean + JDturn + JRSteel + JDShake)
  $nobyda.end()
}

JingDongBean()