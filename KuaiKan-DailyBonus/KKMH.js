/*
快看漫画签到脚本

更新时间: 2022.06.18
脚本兼容: QuantumultX, Surge4, Loon, Node.js
电报频道: @NobyDa
问题反馈: @NobyDa_bot

获取Cookie说明：
打开快看漫画App后(AppStore中国区)，点击"我的", 如通知成功获取cookie, 则可以使用此签到脚本.
获取Cookie后, 请将Cookie脚本禁用并移除主机名，以免产生不必要的MITM.
脚本将在每天上午9:00执行, 您可以修改执行时间。

如果使用Node.js, 需自行安装got与tough-cookie模块. 例: npm install got tough-cookie -g

Node.js用户抓取Cookie说明：
开启抓包, 打开快看漫画App后(AppStore中国区)，点击"我的" 返回抓包app搜索关键字 passport/user 复制请求头Cookie填入以下cookie处的单引号内即可
*/

var cookie = ''

var barkKey = ''; //Bark APP 通知推送key

/*********************
QuantumultX 远程脚本配置:
**********************
[task_local]
0 9 * * * https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js, tag=快看漫画, img-url=https://ftp.bmp.ovh/imgs/2020/09/a3345da5e9094363.png, enabled=true

[rewrite_local]
# 获取Cookie
^https:\/\/api\.kkmh\.com\/v\d\/passport\/user url script-request-header https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js

[mitm] 
hostname= api.kkmh.com

**********************
Surge 4.2.0+ 脚本配置:
**********************
[Script]
快看漫画签到 = type=cron,cronexp=0 9 * * *,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js

快看漫画获取Cookie = type=http-request,pattern=^https:\/\/api\.kkmh\.com\/v\d\/passport\/user,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js

[MITM] 
hostname= api.kkmh.com

************************
Loon 2.1.0+ 脚本配置:
************************

[Script]
# 快看漫画签到
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js

# 获取Cookie
http-request ^https:\/\/api\.kkmh\.com\/v\d\/passport\/user script-path=https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js

[Mitm] 
hostname= api.kkmh.com

*/
var LogDetails = false; //响应日志
var $ = new Env('快看漫画');
var date = new Date()
var imgUrl = {
  'open-url': 'kuaikan://',
  'media-url': 'https://ftp.bmp.ovh/imgs/2020/09/16da56c186ffa6a2.png'
};

(async () => {
  if (typeof $request != "undefined") {
    GetCookie()
  } else if (cookie || $.getdata("@KKMH.COOKIE")) {
    if (cookie) $.setdata(cookie, "@KKMH.COOKIE");
    LogDetails = $.getdata("@KKMH.LOG") === "true" || LogDetails
    await Checkin();
  } else {
    $.msg($.name, "", "签到终止, 未获取Cookie ⚠️", imgUrl);
  }
})().finally(() => {
  $.done();
})

function Checkin() {
  return new Promise(resolve => {
    $.get({
      url: 'https://h5.kuaikanmanhua.com/v2/checkin/task_center/checkin',
      headers: {
        'Cookie': cookie || $.getdata("@KKMH.COOKIE"),
        'User-Agent': 'Kuaikan/5.75.0/575000(iPhone;Scale/3.00) (iPhone; CPU)',
        'X-Device': '0'
      }
    }, async (error, response, data) => {
      try {
        if (error) throw new Error(error)
        const cc = JSON.parse(data)
        const Details = LogDetails ? data ? `response:\n${data}` : '' : ''
        if (cc.code == 200) {
          $.log(`${$.name} 成功${Details}`)
          const pop = cc.data.check_in_home_info.pop_title
          const text = cc.data.check_in_home_info.check_in_bubble_text
          const title = cc.data.check_in_home_info.check_in_title
          const score = cc.data.check_in_home_info.user_score
          const kkb = cc.data.check_in_home_info.user_kkb
          const uid = $.getdata("@KKMH.COOKIE") ? $.getdata("@KKMH.COOKIE").match(/uid=(\d+)/) : ''
          const rep = $.getdata("@KKMH.DATE") == date.getDate() && (uid ? uid[1] : '') == $.getdata("@KKMH.UID")
          const gift = await GiftPack(title);
          $.subtitle = rep ? '今天已签过！' : pop;
          $.msgBody = `${rep?``:text+', '}现有${$.score||score}积分, ${$.kkb||kkb}KK币\n${gift||title} 🎉`;
          $.setdata(JSON.stringify(date.getDate()), "@KKMH.DATE")
          $.setdata(uid ? uid[1] : '', "@KKMH.UID")
        } else {
          $.log(`${$.name} 失败${Details}`)
          if (cc.code == 401) {
            $.msgBody = 'Cookie失效 ⚠️';
          } else {
            $.msgBody = cc.message || '未知错误 ⚠️';
          }
        }
      } catch (err) {
        $.logErr(err)
        $.msgBody = `错误, 已输出日志 ⚠️`;
      } finally {
        $.msg($.name, $.subtitle || '', $.msgBody, imgUrl);
        if (barkKey) {
          await BarkNotify($, barkKey, $.name, $.msgBody);
        }
        resolve()
      }
    })
  })
}

function GiftPack(type) {
  return new Promise(resolve => {
    if (!type.match(/今(日|天)可领/)) return resolve();
    $.get({
      url: 'https://h5.kuaikanmanhua.com/v1/checkin/api/check/open_gift_bag',
      headers: {
        'Cookie': cookie || $.getdata("@KKMH.COOKIE"),
        'User-Agent': 'Kuaikan/5.75.0/575000(iPhone;Scale/3.00) (iPhone; CPU)',
        'X-Device': '0'
      }
    }, (error, response, data) => {
      try {
        if (error) throw new Error(error)
        const cc = JSON.parse(data)
        const Details = LogDetails ? data ? `response:\n${data}` : '' : ''
        if (cc.code == 200 && cc.data) {
          $.log(`${$.name} 成功${Details}`)
          $.kkb = cc.data.giftBagKkb ? cc.data.giftBagKkb + cc.data.kkb : cc.data.kkb
          $.score = cc.data.score;
          $.gifts = `领取连签礼包成功`;
          if (cc.data.giftBagScore) $.gifts += `, +${cc.data.giftBagScore}积分`;
          if (cc.data.giftBagKkb) $.gifts += `, +${cc.data.giftBagKkb}KK币`;
          if (cc.data.giftBagSupplement) $.gifts += `, +1 补签胶囊`;
          if (cc.data.giftBagCardCoupon) $.gifts += `, +1 ${cc.data.cardCoupon.title}`;
          if (cc.data.giftBagYouzanCoupon) $.gifts += `, +1 ${cc.data.youzanCoupon.title}`;
        } else {
          $.log(`${$.name} 失败${Details}`)
          $.gifts = `领取连签礼包失败, ${cc.message || '未知错误'}`
        }
      } catch (err) {
        $.logErr(err)
        $.gifts = `领取连签礼包错误, 已输出日志`
      } finally {
        resolve($.gifts)
      }
    })
  })
}

function GetCookie() {
  const RA = $.getdata("@KKMH.COOKIE")
  const TM = $.getdata("@KKMH.TIME")
  const CK = $request.headers['Cookie'] || $request.headers['cookie'];
  if (JSON.stringify($request.headers).match(/session=/) && CK) {
    if (RA != CK) {
      if ($.setdata(CK, "@KKMH.COOKIE")) {
        $.setdata(JSON.stringify(Date.now()), "@KKMH.TIME")
        if (!TM || TM && (Date.now() - TM) / 1000 >= 21600) {
          $.msg(`${RA?`更新`:`首次写入`}${$.name}Cookie成功 🎉`, "", "", imgUrl)
        } else if (RA.match(/uid=\d+/)[0] == CK.match(/uid=\d+/)[0]) {
          $.log(`\n更新${$.name}Cookie成功! 🎉\n检测到频繁通知, 已转为输出日志`)
        } else {
          $.msg(`更新${$.name}Cookie成功 🎉`, "", "", imgUrl)
        }
      } else {
        $.msg(`${RA?`更新`:`首次写入`}${$.name}Cookie失败‼️`, "", "", imgUrl)
      }
    } else {
      $.log(`${$.name}-Cookie相同, 跳过写入 ⚠️`)
    }
  } else {
    $.log(`${$.name}-请求不含Cookie, 跳过写入 ‼️`)
  }
}

//Bark APP notify
async function BarkNotify(c,k,t,b){for(let i=0;i<3;i++){console.log(`🔷Bark notify >> Start push (${i+1})`);const s=await new Promise((n)=>{c.post({url:'https://api.day.app/push',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:t,body:b,device_key:k,ext_params:{group:t}})},(e,r,d)=>r&&r.status==200?n(1):n(d||e))});if(s===1){console.log('✅Push success!');break}else{console.log(`❌Push failed! >> ${s.message||s}`)}}}

//Compatible code from https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}