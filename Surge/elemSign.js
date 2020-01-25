const cookieName = '饿了么'
 const cookieKey = 'cookie_elem'
 const chavy = init()
 var cookieVal = chavy.getdata(cookieKey)
 // var regx=/(USERID=)(\d+)(;)/;
 // cookieVal.replace(regx,'$2');
 var endurl='/sign_in'
 sign()

 function sign() {
   const timestamp = Date.parse(new Date())
   let url = { url: `https://h5.ele.me/restapi/member/v2/users/`, headers: { Cookie: cookieVal } }
   url.headers['Origin']='https://tb.ele.me';
   url.url+=cookieVal;
   url.url+=endurl;
   chavy.log(url.url);
   chavy.post(url, (error, response, data) => {
     chavy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data)
     const title = `${cookieName}`
     let subTitle = ''
     let detail = ''
     chavy.log(response);
     if (response == 200) {
       subTitle = '签到结果: 成功'
       // else subTitle = '签到结果: 成功 (重复签到)'
       // detail = `人人钻: ${result.data.userinfo.point}, 登录天数: ${result.data.usercount.cont_login} -> ${result.data.upgrade_day}`
       // chavy.msg(title, subTitle, detail)
     } else {
       subTitle = '签到结果: 重复'
       chavy.msg(title, subTitle, detail)
     }
   })
   chavy.done()
 }

 function init() {
   isSurge = () => {
     return undefined === this.$httpClient ? false : true
   }
   isQuanX = () => {
     return undefined === this.$task ? false : true
   }
   getdata = (key) => {
     if (isSurge()) return $persistentStore.read(key)
     if (isQuanX()) return $prefs.valueForKey(key)
   }
   setdata = (key, val) => {
     if (isSurge()) return $persistentStore.write(key, val)
     if (isQuanX()) return $prefs.setValueForKey(key, val)
   }
   msg = (title, subtitle, body) => {
     if (isSurge()) $notification.post(title, subtitle, body)
     if (isQuanX()) $notify(title, subtitle, body)
   }
   log = (message) => console.log(message)
   get = (url, cb) => {
     if (isSurge()) {
       $httpClient.get(url, cb)
     }
     if (isQuanX()) {
       url.method = 'GET'
       $task.fetch(url).then((resp) => cb(null, {}, resp.body))
     }
   }
   post = (url, cb) => {
     if (isSurge()) {
       $httpClient.post(url, cb)
     }
     if (isQuanX()) {
       url.method = 'POST'
       $task.fetch(url).then((resp) => cb(null, resp.statusCode, resp.body))
     }
   }
   done = (value = {}) => {
     $done(value)
   }
   return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
 }
