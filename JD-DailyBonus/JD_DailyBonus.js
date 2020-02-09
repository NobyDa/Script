/*
JingDong bonus seventeen in one

Description :
When using for the first time. Need to manually log in to the https://bean.m.jd.com checkin to get cookie. If notification gets cookie success, you can use the check in script.
Due to the validity of cookie, if the script pops up a notification of cookie invalidation in the future, you need to repeat the above steps.

Daily bonus script will be performed every day at 0:05 a.m. You can modify the execution time.
If reprinted, please indicate the source. My TG channel @NobyDa

Update 2020.2.8 22:30 v60
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

# Get JingDong cookie.
http-request https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBean(Index|GroupStageIndex) max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js
~~~~~~~~~~~~~~~~
QX 1.0.5 :
[task_local]
5 0 * * * JD_DailyBonus.js

[rewrite_local]
# Get JingDong cookie. QX 1.0.5(188+):
https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBean(Index|GroupStageIndex) url script-request-header JD_DailyBonus.js
~~~~~~~~~~~~~~~~
QX or Surge MITM = api.m.jd.com
~~~~~~~~~~~~~~~~
*/

var log = true; //是否开启日志, false则关闭
var $nobyda = nobyda();
var KEY = $nobyda.read("CookieJD");

var merge = {
  JDBean:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JDTurn:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JRBean:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JRSteel: {success:0,fail:0,bean:0,steel:0,notify:''},
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
  JDCube:  {success:0,fail:0,bean:0,steel:0,notify:''},
  JDCash:  {success:0,fail:0,bean:0,steel:0,notify:'',QCash:0},
  JDShake: {success:0,fail:0,bean:0,steel:0,notify:'',Qbear:''}
}

if ($nobyda.isRequest) {
  GetCookie()
  $nobyda.end()
} else {
  all()
  $nobyda.end()
}

async function all() {//签到模块相互独立,您可注释某一行以禁用某个接口.
  await JingDongBean(); //京东京豆
  await JingRongBean(); //金融京豆
  await JingRongSteel(); //金融钢镚
  await JingDongTurn(); //京东转盘
  await JRDoubleSign(); //金融双签
  await JDGroceryStore(); //京东超市
  await JingDongClocks(); //京东钟表馆
  await JingDongPet(); //京东宠物馆
  await JDFlashSale(); //京东闪购
  await JingDongBook(); //京东图书
  await JDSecondhand(); //京东拍拍二手
  await JingDMakeup(); //京东美妆馆
  await JingDongWomen(); //京东女装馆
  await JingDongCash(); //京东现金红包
  await JingDongShoes(); //京东鞋靴馆
  await JDMagicCube(); //京东小魔方
  await JingDongShake(); //京东摇一摇
  await notify(); //通知模块
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
      var JDbeans = merge.JDShake.Qbear ? merge.JDShake.Qbear + "个\n" : "获取失败, 非首次签到\n"
      var one = "【京东签到】:  成功" + success + "个, 失败: " + fail + "个\n"
      var two = "【签到总计】:  " + bean + "京豆, " + steel + "钢镚, " + merge.JDCash.QCash + "红包\n"
      var three = "【当前京豆】:  " + JDbeans
      var four = "【左滑 '查看' 以显示签到详情】\n"
      $nobyda.notify("", "", one + two + three + four + notify);
      resolve('done')
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDongBean() {

  return new Promise(resolve => {
    try {
      const JDBUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=signBeanIndex&appid=ld',
        headers: {
          Cookie: KEY,
        }
      };

      $nobyda.get(JDBUrl, function(error, response, data) {
        if (error) {
          merge.JDBean.notify = "京东商城-京豆: 签到接口请求失败 ‼️‼️"
          merge.JDBean.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (cc.code == 3) {
            if (log) console.log("京东商城-京豆Cookie失效response: \n" + data)
            merge.JDBean.notify = "京东商城-京豆: 失败, 原因: Cookie失效‼️"
            merge.JDBean.fail = 1
          } else {
            if (data.match(/跳转至拼图/)) {
              merge.JDBean.notify = "京东商城-京豆: 失败, 原因: 需要拼图验证 ⚠️"
              merge.JDBean.fail = 1
            } else {
              if (cc.data.status == 1) {
                if (log) console.log("京东商城-京豆签到成功response: \n" + data)
                if (data.match(/dailyAward/)) {
                  if (cc.data.dailyAward.beanAward.beanCount) {
                    merge.JDBean.notify = "京东商城-京豆: 成功, 明细: " + cc.data.dailyAward.beanAward.beanCount + "京豆 🐶"
                    merge.JDBean.bean = cc.data.dailyAward.beanAward.beanCount
                    merge.JDBean.success = 1
                  } else {
                    merge.JDBean.notify = "京东商城-京豆: 成功, 明细: 显示接口待更新 ⚠️"
                    merge.JDBean.success = 1
                  }
                } else {
                  if (data.match(/continuityAward/)) {
                    if (cc.data.continuityAward.beanAward.beanCount) {
                      merge.JDBean.notify = "京东商城-京豆: 成功, 明细: " + cc.data.continuityAward.beanAward.beanCount + "京豆 🐶"
                      merge.JDBean.bean = cc.data.continuityAward.beanAward.beanCount
                      merge.JDBean.success = 1
                    } else {
                      merge.JDBean.notify = "京东商城-京豆: 成功, 明细: 显示接口待更新 ⚠️"
                      merge.JDBean.success = 1
                    }
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
                if (log) console.log("京东商城-京豆签到失败response: \n" + data)
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDongTurn() {

  return new Promise(resolve => {
    try {
      const JDTUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=lotteryDraw&body=%7B%22actId%22%3A%22jgpqtzjhvaoym%22%2C%22appSource%22%3A%22jdhome%22%2C%22lotteryCode%22%3A%224wwzdq7wkqx2usx4g5i2nu5ho4auto4qxylblkxacm7jqdsltsepmgpn3b2hgyd7hiawzpccizuck%22%7D&appid=ld',
        headers: {
          Cookie: KEY,
        }
      };

      $nobyda.get(JDTUrl, function(error, response, data) {
        if (error) {
          merge.JDTurn.notify = "京东商城-转盘: 签到接口请求失败 ‼️‼️"
          merge.JDTurn.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (cc.code == 3) {
            if (log) console.log("京东转盘Cookie失效response: \n" + data)
            merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: Cookie失效‼️"
            merge.JDTurn.fail = 1
          } else {
            if (data.match(/(\"T216\"|活动结束)/)) {
              merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 活动结束 ⚠️"
              merge.JDTurn.fail = 1
            } else {
              if (data.match(/(京豆|\"910582\")/)) {
                if (log) console.log("京东商城-转盘签到成功response: \n" + data)
                if (cc.data.prizeSendNumber) {
                  merge.JDTurn.notify = "京东商城-转盘: 成功, 明细: " + cc.data.prizeSendNumber + "京豆 🐶"
                  merge.JDTurn.success = 1
                  merge.JDTurn.bean = cc.data.prizeSendNumber
                } else {
                  merge.JDTurn.notify = "京东商城-转盘: 成功, 明细: 显示接口待更新 ⚠️"
                  merge.JDTurn.success = 1
                }
              } else {
                if (log) console.log("京东商城-转盘签到失败response: \n" + data)
                if (data.match(/chances\":\"1\".+未中奖/)) {
                  setTimeout(function() {
                    JingDongTurn()
                  }, 2000)
                } else if (data.match(/chances\":\"0\".+未中奖/)) {
                  merge.JDTurn.notify = "京东商城-转盘: 成功, 状态: 未中奖 🐶"
                  merge.JDTurn.success = 1
                } else if (data.match(/(T215|次数为0)/)) {
                  merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 已转过 ⚠️"
                  merge.JDTurn.fail = 1
                } else if (data.match(/(T210|密码)/)) {
                  merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 无支付密码 ⚠️"
                  merge.JDTurn.fail = 1
                } else {
                  merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 未知 ⚠️"
                  merge.JDTurn.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingRongBean() {

  return new Promise(resolve => {
    try {
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
      $nobyda.post(login, function(error, response, data) {
        if (error) {
          merge.JRBean.notify = "京东金融-京豆: 登录接口请求失败 ‼️‼️"
          merge.JRBean.fail = 1
          resolve('done')
        } else {
          setTimeout(function() {
            if (data.match(/\"login\":true/)) {
              if (log) console.log("京东金融-京豆登录成功response: \n" + data)
              $nobyda.post(JRBUrl, function(error, response, data) {
                if (error) {
                  merge.JRBean.notify = "京东金融-京豆: 签到接口请求失败 ‼️‼️"
                  merge.JRBean.fail = 1
                } else {
                  const c = JSON.parse(data)
                  if (data.match(/\"resultCode\":\"00000\"/)) {
                    if (log) console.log("京东金融-京豆签到成功response: \n" + data)
                    if (c.resultData.data.rewardAmount != "0") {
                      merge.JRBean.notify = "京东金融-京豆: 成功, 明细: " + c.resultData.data.rewardAmount + "京豆 🐶"
                      merge.JRBean.success = 1
                      merge.JRBean.bean = c.resultData.data.rewardAmount
                    } else {
                      merge.JRBean.notify = "京东金融-京豆: 成功, 明细: 无奖励 🐶"
                      merge.JRBean.success = 1
                    }
                  } else {
                    if (log) console.log("京东金融-京豆签到失败response: \n" + data)
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
              })
            } else {
              if (log) console.log("京东金融-京豆登录失败response: \n" + data)
              if (data.match(/\"login\":false/)) {
                merge.JRBean.notify = "京东金融-京豆: 失败, 原因: Cookie失效‼️"
                merge.JRBean.fail = 1
              } else {
                merge.JRBean.notify = "京东金融-京豆: 登录接口需修正 ‼️‼️"
                merge.JRBean.fail = 1
              }
            }
          }, 200)
        }
        resolve('done')
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingRongSteel() {

  return new Promise(resolve => {
    try {
      const JRSUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/gry/h5/m/signIn',
        headers: {
          Cookie: KEY,
        },
        body: "reqData=%7B%22channelSource%22%3A%22JRAPP%22%2C%22riskDeviceParam%22%3A%22%7B%7D%22%7D"
      };

      $nobyda.post(JRSUrl, function(error, response, data) {
        if (error) {
          merge.JRSteel.notify = "京东金融-钢镚: 签到接口请求失败 ‼️‼️"
          merge.JRSteel.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/\"resBusiCode\":0/)) {
            if (log) console.log("京东金融-钢镚签到成功response: \n" + data)
            if (cc.resultData.resBusiData.actualTotalRewardsValue) {
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
              merge.JRSteel.notify = "京东金融-钢镚: 成功, 明细: 显示接口待更新 ⚠️"
              merge.JRSteel.success = 1
            }
          } else {
            if (log) console.log("京东金融-钢镚签到失败response: \n" + data)
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}


function JRDoubleSign() {

  return new Promise(resolve => {
    try {
      const JRDSUrl = {
        url: 'https://nu.jr.jd.com/gw/generic/jrm/h5/m/process?',
        headers: {
          Cookie: KEY,
        },
        body: "reqData=%7B%22actCode%22%3A%22FBBFEC496C%22%2C%22type%22%3A3%2C%22riskDeviceParam%22%3A%22%22%7D"
      };

      $nobyda.post(JRDSUrl, function(error, response, data) {
        if (error) {
          merge.JRDSign.notify = "京东金融-双签: 签到接口请求失败 ‼️‼️"
          merge.JRDSign.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/京豆X/)) {
            if (log) console.log("京东金融-双签签到成功response: \n" + data)
            if (cc.resultData.data.businessData.businessData.awardListVo[0].count) {
              merge.JRDSign.notify = "京东金融-双签: 成功, 明细: " + cc.resultData.data.businessData.businessData.awardListVo[0].count + "京豆 🐶"
              merge.JRDSign.bean = cc.resultData.data.businessData.businessData.awardListVo[0].count
              merge.JRDSign.success = 1
            } else {
              merge.JRDSign.notify = "京东金融-双签: 成功, 明细: 显示接口待更新 ⚠️"
              merge.JRDSign.success = 1
            }
          } else {
            if (log) console.log("京东金融-双签签到失败response: \n" + data)
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}


function JingDongShake() {

  return new Promise(resolve => {
    try {
      const JDSh = {
        url: 'https://api.m.jd.com/client.action?appid=vip_h5&functionId=vvipclub_shaking',
        headers: {
          Cookie: KEY,
        }
      };

      $nobyda.get(JDSh, function(error, response, data) {
        if (error) {
          merge.JDShake.notify = "京东商城-摇摇: 签到接口请求失败 ‼️‼️\n" + error
          merge.JDShake.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/prize/)) {
            if (log) console.log("京东商城-摇一摇签到成功response: \n" + data)
            if (cc.data.prizeBean) {
              merge.JDShake.notify = "京东商城-摇摇: 成功, 明细: " + cc.data.prizeBean.count + "京豆 🐶"
              merge.JDShake.bean = cc.data.prizeBean.count
              merge.JDShake.success = 1
            } else {
              if (cc.data.prizeCoupon) {
                merge.JDShake.notify = "京东商城-摇摇: 获得满" + cc.data.prizeCoupon.quota + "减" + cc.data.prizeCoupon.discount + "优惠券→ " + cc.data.prizeCoupon.limitStr
                merge.JDShake.success = 1
              } else {
                merge.JDShake.notify = "京东商城-摇摇: 失败, 原因: 未知 ⚠️"
                merge.JDShake.fail = 1
              }
            }
          } else {
            if (log) console.log("京东商城-摇一摇签到失败response: \n" + data)
            if (data.match(/true/)) {
              merge.JDShake.notify = "京东商城-摇摇: 成功, 明细: 无奖励 🐶"
              merge.JDShake.success = 1
            } else {
              if (data.match(/(无免费|8000005)/)) {
                merge.JDShake.notify = "京东商城-摇摇: 失败, 原因: 已摇过 ⚠️"
                merge.JDShake.fail = 1
              } else if (data.match(/(未登录|101)/)) {
                merge.JDShake.notify = "京东商城-摇摇: 失败, 原因: Cookie失效‼️"
                merge.JDShake.fail = 1
              } else {
                merge.JDShake.notify = "京东商城-摇摇: 失败, 原因: 未知 ⚠️"
                merge.JDShake.fail = 1
              }
            }
          }
          if (data.match(/totalBeanCount/)) {
            if (cc.data.luckyBox.totalBeanCount) {
              merge.JDShake.Qbear = cc.data.luckyBox.totalBeanCount
            }
          }
        }
        resolve('done')
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JDGroceryStore() {

  return new Promise(resolve => {
    try {
      const JDGSUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22caA6%2B%2FTo6Jfe%2FAKYm8gLQEchLXtYeB53heY9YzuzsZoaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22signId%5C%22%3A%5C%22hEr1TO1FjXgaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&screen=750%2A1334&client=wh5&clientVersion=1.0.0&sid=0ac0caddd8a12bf58ea7a912a5c637cw&uuid=1fce88cd05c42fe2b054e846f11bdf33f016d676&area=19_1617_3643_8208"
      };

      $nobyda.post(JDGSUrl, function(error, response, data) {
        if (error) {
          merge.JDGStore.notify = "京东商城-超市: 签到接口请求失败 ‼️‼️"
          merge.JDGStore.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            if (log) console.log("京东商城-超市签到成功response: \n" + data)
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
            if (log) console.log("京东商城-超市签到失败response: \n" + data)
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDongClocks() {

  return new Promise(resolve => {
    try {
      const JDCUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22LW67%2FHBJP72aMSByZLRaRqJGukOFKx9r4F87VrKBmogaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Atrue%2C%5C%22signId%5C%22%3A%5C%22g2kYL2MvMgkaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };

      $nobyda.post(JDCUrl, function(error, response, data) {
        if (error) {
          merge.JDClocks.notify = "京东商城-钟表: 签到接口请求失败 ‼️‼️"
          merge.JDClocks.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            if (log) console.log("京东商城-钟表签到成功response: \n" + data)
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
            if (log) console.log("京东商城-钟表签到失败response: \n" + data)
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDongPet() {

  return new Promise(resolve => {
    try {
      const JDPETUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%226DiDTHMDvpNyoP9JUaEkki%2FsREOeEAl8M8REPQ%2F2eA4aZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22signId%5C%22%3A%5C%22Nk2fZhdgf5UaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };

      $nobyda.post(JDPETUrl, function(error, response, data) {
        if (error) {
          merge.JDPet.notify = "京东商城-宠物: 签到接口请求失败 ‼️‼️"
          merge.JDPet.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            if (log) console.log("京东商城-宠物签到成功response: \n" + data)
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
            if (log) console.log("京东商城-宠物签到失败response: \n" + data)
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JDFlashSale() {

  return new Promise(resolve => {
    try {
      const JDPETUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=partitionJdSgin',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%7D&client=apple&clientVersion=8.4.6&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=141ab5f9af92126bb46d50f3e8af758a&st=1579305780511&sv=102"
      };

      $nobyda.post(JDPETUrl, function(error, response, data) {
        if (error) {
          merge.JDFSale.notify = "京东商城-闪购: 签到接口请求失败 ‼️‼️"
          merge.JDFSale.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (cc.result.code == 0) {
            if (log) console.log("京东商城-闪购签到成功response: \n" + data)
            if (data.match(/(\"count\":\d+)/)) {
              merge.JDFSale.notify = "京东商城-闪购: 成功, 明细: " + cc.result.count + "京豆 🐶"
              merge.JDFSale.bean = cc.result.count
              merge.JDFSale.success = 1
            } else {
              merge.JDFSale.notify = "京东商城-闪购: 成功, 明细: 无京豆 🐶"
              merge.JDFSale.success = 1
            }
          } else {
            if (log) console.log("京东商城-闪购签到失败response: \n" + data)
            if (data.match(/(已签到|已领取|\"2005\")/)) {
              merge.JDFSale.notify = "京东商城-闪购: 失败, 原因: 已签过 ⚠️"
              merge.JDFSale.fail = 1
            } else {
              if (data.match(/(不存在|已结束|\"2008\")/)) {
                merge.JDFSale.notify = "京东商城-闪购: 失败, 原因: 活动已结束 ⚠️"
                merge.JDFSale.fail = 1
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDongBook() {

  return new Promise(resolve => {
    try {
      const JDBookUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3SC6rw5iBg66qrXPGmZMqFDwcyXi%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.linkstars.com%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000089893_157_0_184__cc59020469361878%26utm_term%3De04e88b40a3c4e24898da7fcee54a609%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3SC6rw5iBg66qrXPGmZMqFDwcyXi%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.linkstars.com%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000089893_157_0_184__cc59020469361878%26utm_term%3De04e88b40a3c4e24898da7fcee54a609%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22ziJpxomssJzA0Lnt9V%2BVYoW5AbqAOQ6XiMQuejSm7msaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200416621_28128239_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22jw9BKb%5C%2Fb%2BfEaZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.4.6&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=c1d6bdbb17d0d3f8199557265c6db92c&st=1579305128990&sv=121"
      };

      $nobyda.post(JDBookUrl, function(error, response, data) {
        if (error) {
          merge.JDBook.notify = "京东商城-图书: 签到接口请求失败 ‼️‼️"
          merge.JDBook.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            if (log) console.log("京东商城-图书签到成功response: \n" + data)
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
            if (log) console.log("京东商城-图书签到失败response: \n" + data)
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
                } else if (cc.code == "600"){
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JDSecondhand() {

  return new Promise(resolve => {
    try {
      const JDSDUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3S28janPLYmtFxypu37AYAGgivfp%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.linkstars.com%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000089893_157_0_184__cc59020469361878%26utm_term%3Dd802691049c9473897298c4de3159179%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3S28janPLYmtFxypu37AYAGgivfp%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.linkstars.com%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000089893_157_0_184__cc59020469361878%26utm_term%3Dd802691049c9473897298c4de3159179%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%221aXiBKmxyz6XLsyntfp11AP4x7fjsFotKNTTk2Y39%2BUaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200124860_28262902_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%226CR%5C%2FQvgfF5EaZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.4.6&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=56a228e0edada1283ba0f971c41633af&st=1579306801665&sv=121"
      };

      $nobyda.post(JDSDUrl, function(error, response, data) {
        if (error) {
          merge.JDShand.notify = "京东拍拍-二手: 签到接口请求失败 ‼️‼️"
          merge.JDShand.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            if (log) console.log("京东拍拍-二手签到成功response: \n" + data)
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
            if (log) console.log("京东拍拍-二手签到失败response: \n" + data)
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
                } else if (cc.code == "600"){
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDMakeup() {

  return new Promise(resolve => {
    try {
      const JDMUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22url%22%3A%22%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22BrrbMFwDMOFxMQzzIJNfYEoNLQhhUfcDeTnHobclnXIaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200138455_29326119_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22QrWSYkHHb9EaZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.5.0&d_brand=apple&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=c097f212b640b012dde453e38b170181&st=1581083231607&sv=120"
      };

      $nobyda.post(JDMUrl, function(error, response, data) {
        if (error) {
          merge.JDMakeup.notify = "京东商城-美妆: 签到接口请求失败 ‼️‼️"
          merge.JDMakeup.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            if (log) console.log("京东商城-美妆签到成功response: \n" + data)
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
            if (log) console.log("京东商城-美妆签到失败response: \n" + data)
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
                } else if (cc.code == "600"){
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDongWomen() {

  return new Promise(resolve => {
    try {
      const JDMUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22url%22%3A%22%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22OQmfgxmylrMM6EurCHg9lEjL1ShNb2dVjEja9MceBPgaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200002492_28085975_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22YE5T0wVaiL8aZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&build=167057&client=apple&clientVersion=8.5.0&d_brand=apple&d_model=iPhone8%2C2&networklibtype=JDNetworkBaseAF&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&osVersion=13.3.1&scope=11&screen=1242%2A2208&sign=7329899a26d8a8c3046b882d6df2b329&st=1581083524405&sv=101&uuid=coW0lj7vbXVin6h7ON%2BtMNFQqYBqMahr"
      };

      $nobyda.post(JDMUrl, function(error, response, data) {
        if (error) {
          merge.JDWomen.notify = "京东商城-女装: 签到接口请求失败 ‼️‼️"
          merge.JDWomen.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            if (log) console.log("京东商城-女装签到成功response: \n" + data)
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
            if (log) console.log("京东商城-女装签到失败response: \n" + data)
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
                } else if (cc.code == "600"){
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDongCash() {

  return new Promise(resolve => {
    try {
      const JDCAUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=ccSignInNew',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22monitorSource%22%3A%22cc_sign_ios_index_config%22%7D&client=apple&clientVersion=8.5.0&d_brand=apple&d_model=iPhone8%2C2&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&scope=11&screen=1242%2A2208&sign=1cce8f76d53fc6093b45a466e93044da&st=1581084035269&sv=102"
      };

      $nobyda.post(JDCAUrl, function(error, response, data) {
        if (error) {
          merge.JDCash.notify = "京东现金-红包: 签到接口请求失败 ‼️‼️"
          merge.JDCash.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (cc.busiCode == "0") {
            if (log) console.log("京东现金-红包签到成功response: \n" + data)
            if (cc.result.signResult.signData.amount) {
              merge.JDCash.notify = "京东现金-红包: 成功, 明细: " + cc.result.signResult.signData.amount + "红包 🧧"
              merge.JDCash.QCash = cc.result.signResult.signData.amount
              merge.JDCash.success = 1
            } else {
              merge.JDCash.notify = "京东现金-红包: 成功, 明细: 无红包 🧧"
              merge.JDCash.success = 1
            }
          } else {
            if (log) console.log("京东现金-红包签到失败response: \n" + data)
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JingDongShoes() {

  return new Promise(resolve => {
    try {
      const JDSSUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%227Ive90vKJQaMEzWlhMgIwIih1KqMPXNQdPbewzqrg2MaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Atrue%2C%5C%22ruleSrv%5C%22%3A%5C%2200116882_29523722_t0%5C%22%2C%5C%22signId%5C%22%3A%5C%22SeWbLe9ma04aZs%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22riskParam%22%3A%7B%22platform%22%3A%223%22%2C%22orgType%22%3A%222%22%2C%22openId%22%3A%22-1%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22eid%22%3A%22%22%2C%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22b3fccfafc270b38e0bddfdc0e455b48f%22%2C%22shshshfpa%22%3A%22%22%2C%22shshshfpb%22%3A%22%22%2C%22childActivityUrl%22%3A%22%22%7D%2C%22siteClient%22%3A%22apple%22%2C%22mitemAddrId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%220%22%2C%22lat%22%3A%220%22%7D%2C%22addressId%22%3A%22%22%2C%22posLng%22%3A%22%22%2C%22posLat%22%3A%22%22%2C%22focus%22%3A%22%22%2C%22innerAnchor%22%3A%22%22%2C%22cv%22%3A%222.0%22%7D&client=wh5"
      };

      $nobyda.post(JDSSUrl, function(error, response, data) {
        if (error) {
          merge.JDShoes.notify = "京东商城-鞋靴: 签到接口请求失败 ‼️‼️"
          merge.JDShoes.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/签到成功/)) {
            if (log) console.log("京东商城-鞋靴签到成功response: \n" + data)
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
            if (log) console.log("京东商城-鞋靴签到失败response: \n" + data)
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
                } else if (cc.code == "600"){
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
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function JDMagicCube() {

  return new Promise(resolve => {
    try {
      const JDMCUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=getNewsInteractionLotteryInfo&appid=smfe',
        headers: {
          Cookie: KEY,
        }
      };

      $nobyda.get(JDMCUrl, function(error, response, data) {
        if (error) {
          merge.JDCube.notify = "京东商城-魔方: 签到接口请求失败 ‼️‼️"
          merge.JDCube.fail = 1
        } else {
          const cc = JSON.parse(data)
          if (data.match(/(\"name\":)/)) {
            if (log) console.log("京东商城-魔方签到成功response: \n" + data)
            if (data.match(/(\"name\":\"京豆\")/)) {
              merge.JDCube.notify = "京东商城-魔方: 成功, 明细: " + cc.result.lotteryInfo.quantity + "京豆 🐶"
              merge.JDCube.bean = cc.result.lotteryInfo.quantity
              merge.JDCube.success = 1
            } else {
              merge.JDCube.notify = "京东商城-魔方: 成功, 明细: " + cc.result.lotteryInfo.name + " 🎉"
              merge.JDCube.success = 1
            }
          } else {
            if (log) console.log("京东商城-魔方签到失败response: \n" + data)
            if (data.match(/(一闪而过|已签到|已领取)/)) {
              merge.JDCube.notify = "京东商城-魔方: 失败, 原因: 已签过 ⚠️"
              merge.JDCube.fail = 1
            } else {
              if (data.match(/(不存在|已结束)/)) {
                merge.JDCube.notify = "京东商城-魔方: 失败, 原因: 活动已结束 ⚠️"
                merge.JDCube.fail = 1
              } else {
                if (data.match(/(\"code\":3)/)) {
                  merge.JDCube.notify = "京东商城-魔方: 失败, 原因: Cookie失效‼️"
                  merge.JDCube.fail = 1
                } else {
                  merge.JDCube.notify = "京东商城-魔方: 失败, 原因: 未知 ⚠️"
                  merge.JDCube.fail = 1
                }
              }
            }
          }
        }
        resolve('done')
      })
    } catch (eor) {
      $nobyda.notify(eor.name, JSON.stringify(eor), eor.message)
      resolve('done')
    }
  });
}

function GetCookie() {
  var CookieName = "京东";
  if ($request.headers) {
    var CookieKey = "CookieJD";
    var CookieValue = $request.headers['Cookie'];
    if ($nobyda.read(CookieKey) != (undefined || null)) {
      if ($nobyda.read(CookieKey) != CookieValue) {
        var cookie = $nobyda.write(CookieValue, CookieKey);
        if (!cookie) {
          $nobyda.notify("更新" + CookieName + "Cookie失败‼️", "", "");
        } else {
          $nobyda.notify("更新" + CookieName + "Cookie成功 🎉", "", "");
        }
      }
    } else {
      var cookie = $nobyda.write(CookieValue, CookieKey);
      if (!cookie) {
        $nobyda.notify("首次写入" + CookieName + "Cookie失败‼️", "", "");
      } else {
        $nobyda.notify("首次写入" + CookieName + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    $nobyda.notify("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
  }
}

function nobyda() {
    const isRequest = typeof $request != "undefined"
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
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};