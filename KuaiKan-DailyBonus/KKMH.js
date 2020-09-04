/*
快看漫画签到脚本

更新时间: 2020.9.4
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
    }, (error, response, data) => {
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
          $.msg($.name, rep ? '今天已签过！' : pop, `${rep?``:text+', '}现有${score}积分, ${kkb}KK币\n${title} 🎉`, imgUrl)
          $.setdata(JSON.stringify(date.getDate()), "@KKMH.DATE")
          $.setdata(uid ? uid[1] : '', "@KKMH.UID")
        } else {
          $.log(`${$.name} 失败${Details}`)
          if (cc.code == 401) {
            $.msg($.name, '', 'Cookie失效 ⚠️', imgUrl)
          } else {
            $.msg($.name, '', cc.message || '未知错误 ⚠️', imgUrl)
          }
        }
      } catch (err) {
        $.logErr(err)
        $.msg($.name, '', `错误, 已输出日志 ⚠️`, imgUrl)
      } finally {
        resolve()
      }
    })
  })
}

function GetCookie() {
  const RA = $.getdata("@KKMH.COOKIE")
  const TM = $.getdata("@KKMH.TIME")
  if (JSON.stringify($request.headers).match(/session=/)) {
    if (RA != $request.headers['Cookie']) {
      if ($.setdata($request.headers['Cookie'], "@KKMH.COOKIE")) {
        $.setdata(JSON.stringify(Date.now()), "@KKMH.TIME")
        if (!TM || TM && (Date.now() - TM) / 1000 >= 21600) {
          $.msg(`${RA?`更新`:`首次写入`}${$.name}Cookie成功 🎉`, "", "", imgUrl)
        } else if (RA.match(/uid=\d+/)[0] == $request.headers['Cookie'].match(/uid=\d+/)[0]) {
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
//Compatible code from https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,s){class e{constructor(t){this.env=t}send(t,s="GET"){t="string"==typeof t?{url:t}:t;let e=this.get;return"POST"===s&&(e=this.post),new Promise((s,i)=>{e.call(this,t,(t,e,o)=>{t?i(t):s(e)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,s){this.name=t,this.http=new e(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,s=null){try{return JSON.parse(t)}catch{return s}}toStr(t,s=null){try{return JSON.stringify(t)}catch{return s}}getjson(t,s){let e=s;const i=this.getdata(t);if(i)try{e=JSON.parse(this.getdata(t))}catch{}return e}setjson(t,s){try{return this.setdata(JSON.stringify(t),s)}catch{return!1}}getScript(t){return new Promise(s=>{this.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};this.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=this.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isMute||(this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)));let a=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];a.push(s),e&&a.push(e),i&&a.push(i),console.log(a.join("\n")),this.logs=this.logs.concat(a)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}