/*************************

京东多合一签到脚本

更新时间: 2020.7.04 14:50 v1.18
有效接口: 24+
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
   注2: 双账号用户抓取"账号1"Cookie后, 请勿点击退出账号(可能会导致Cookie失效), 需清除浏览器资料或更换浏览器登录"账号2"抓取.
   注3: 如果复制的Cookie开头为"Cookie: "请把它删除后填入.
   注4: 如果使用QX,Surge,Loon并获取Cookie后, 再重复填写以上选项, 则签到优先读取以上Cookie.

*************************
【 QX, Surge, Loon 说明 】 :
*************************

初次使用时, app配置文件添加脚本配置,并启用Mitm后, Safari浏览器打开登录 https://bean.m.jd.com ,点击签到并且出现签到日历后, 如果通知获得cookie成功, 则可以使用此签到脚本。 注: 请勿在京东APP内获取!!!

由于cookie的有效性(经测试网页Cookie有效周期最长31天)，如果脚本后续弹出cookie无效的通知，则需要重复上述步骤。 
签到脚本将在每天的凌晨0:05执行, 您可以修改执行时间。 因部分接口京豆限量领取, 建议调整为凌晨签到。

*************************
【 配置双京东账号签到说明 】 : 
*************************

正确配置QX、Surge、Loon后, 并使用此脚本获取"账号1"Cookie成功后, 请勿点击退出账号(可能会导致Cookie失效), 需清除浏览器资料或更换浏览器登录"账号2"获取即可.

注: 获取"账号1"或"账号2"的Cookie后, 后续仅可更新该"账号1"或"账号2"的Cookie.
如需写入其他账号,您可开启脚本内"DeleteCookie"选项以清除Cookie
*************************
【Surge 4.2+ 脚本配置】:
*************************

[Script]
京东多合一签到 = type=cron,cronexp=5 0 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

获取京东Cookie = type=http-request,pattern=https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBean,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

[MITM]
hostname = api.m.jd.com

*************************
【Loon 2.1+ 脚本配置】:
*************************

[Script]
cron "5 0 * * *" tag=京东多合一签到, script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

http-request https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBean tag=获取京东Cookie, script-path=https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js

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

var stop = 0; //自定义延迟签到,单位毫秒. 默认并发无延迟. (延迟作用于每个签到接口, 如填入延迟则切换顺序签到. Surge用户请注意在UI界面调整脚本超时)

var DeleteCookie = false; //是否清除Cookie, true则开启

var out = 6000; //接口超时退出, 用于可能发生的网络不稳定. 建议不少于3000毫秒, 0则关闭.

var $nobyda = nobyda();

let acData = {
  // 京东商城-超市
  JDGStore: 'body=%7B%22isQueryNative%22%3Atrue%2C%22topNavStyle%22%3A%222%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22h5ToNative%22%3Atrue%2C%22innerLink%22%3A%22%22%2C%22activityId%22%3A%22aNCM6yrzD6qp1Vvh5YTzeJtk7cM%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FaNCM6yrzD6qp1Vvh5YTzeJtk7cM%5C%2Findex.html%22%7D%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22switchValue%22%3Atrue%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FaNCM6yrzD6qp1Vvh5YTzeJtk7cM%5C%2Findex.html%22%2C%22addressId%22%3A%22%22%2C%22posLng%22%3A%220.000000%22%2C%22posLat%22%3A%220.000000%22%2C%22dogeVersion%22%3A%220.59.9%22%2C%22fromWebView%22%3Atrue%2C%22statusBarHeight%22%3A40%2C%22to%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FaNCM6yrzD6qp1Vvh5YTzeJtk7cM%5C%2Findex.html%22%7D&client=apple&clientVersion=9.0.2&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=abea765e8e609d506e5e22490821d83a&st=1593683372532&sv=110',
  // 京东商城-宠物
  JDPet: 'body=%7B%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_3_0%22%7D%2C%22topNavStyle%22%3A%222%22%2C%22babelChannel%22%3A%22%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22innerLink%22%3A%22%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22activityId%22%3A%2237ta5sh5ocrMZF3Fz5UMJbTsL42%22%2C%22clickUrl%22%3Anull%2C%22addressId%22%3A%22%22%2C%22posLat%22%3A%220.000000%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22statusBarHeight%22%3A40%2C%22posLng%22%3A%220.000000%22%2C%22dogeVersion%22%3A%220.59.9%22%7D&client=apple&clientVersion=9.0.2&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=04739359fa831f7616479c9ed6ae58d5&st=1593684182560&sv=101',
  // 京东商城-图书
  JDBook: 'body=%7B%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_0_0%22%7D%2C%22topNavStyle%22%3A%222%22%2C%22babelChannel%22%3A%22%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22innerLink%22%3A%22%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22activityId%22%3A%223SC6rw5iBg66qrXPGmZMqFDwcyXi%22%2C%22posLat%22%3A%220.000000%22%2C%22addressId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22statusBarHeight%22%3A40%2C%22posLng%22%3A%220.000000%22%2C%22dogeVersion%22%3A%220.59.9%22%7D&client=apple&clientVersion=9.0.4&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=9938647483497bc122a6babd0a34fbd8&st=1593752788349&sv=112',
  // 京东拍拍-二手
  JDShand: 'body=%7B%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_3_0%22%7D%2C%22topNavStyle%22%3A%222%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22innerExtId%22%3A%22%22%2C%22innerLink%22%3A%22%22%2C%22activityId%22%3A%223S28janPLYmtFxypu37AYAGgivfp%22%2C%22addressId%22%3A%22%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3S28janPLYmtFxypu37AYAGgivfp%5C%2Findex.html%22%7D%2C%22innerAnchor%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F3S28janPLYmtFxypu37AYAGgivfp%5C%2Findex.html%22%2C%22posLng%22%3A%220.000000%22%2C%22posLat%22%3A%220.000000%22%2C%22dogeVersion%22%3A%220.59.9%22%2C%22statusBarHeight%22%3A40%7D&client=apple&clientVersion=9.0.2&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=ae5e70a90c3dc194cd5c675d7ef92d75&st=1593697003455&sv=102',
  // 京东商城-美妆
  JDMakeup: 'body=%7B%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_0_0%22%7D%2C%22topNavStyle%22%3A%222%22%2C%22babelChannel%22%3A%22%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22innerLink%22%3A%22%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22activityId%22%3A%222smCxzLNuam5L14zNJHYu43ovbAP%22%2C%22posLat%22%3A%220.000000%22%2C%22addressId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22statusBarHeight%22%3A40%2C%22posLng%22%3A%220.000000%22%2C%22dogeVersion%22%3A%220.59.9%22%7D&client=apple&clientVersion=9.0.4&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=1f22324b66b51737d9763149dc00f324&st=1593749353121&sv=111',
  // 京东商城-清洁
  JDClean: 'body=%7B%22isQueryNative%22%3Atrue%2C%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_3_0%22%7D%2C%22topNavStyle%22%3A%222%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22h5ToNative%22%3Atrue%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F2Tjm6ay1ZbZ3v7UbriTj6kHy9dn6%5C%2Findex.html%22%7D%2C%22activityId%22%3A%222Tjm6ay1ZbZ3v7UbriTj6kHy9dn6%22%2C%22switchValue%22%3Atrue%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F2Tjm6ay1ZbZ3v7UbriTj6kHy9dn6%5C%2Findex.html%22%2C%22addressId%22%3A%22%22%2C%22posLat%22%3A%220.000000%22%2C%22posLng%22%3A%220.000000%22%2C%22statusBarHeight%22%3A40%2C%22dogeVersion%22%3A%220.59.9%22%2C%22fromWebView%22%3Atrue%2C%22needLogin%22%3A%220%22%2C%22to%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2F2Tjm6ay1ZbZ3v7UbriTj6kHy9dn6%5C%2Findex.html%22%7D&client=apple&clientVersion=9.0.2&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=2bbc045826b756dea31597649c886d41&st=1593697945075&sv=122',
  // 京东商城-女装
  JDWomen: 'body=%7B%22scheme%22%3A%22shjump%22%2C%22functionID%22%3A%22virtual%22%2C%22noAnimate%22%3Afalse%2C%22dogeVersion%22%3A%220.59.9%22%2C%22posLng%22%3A%220.000000%22%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FDpSh7ma8JV7QAxSE2gJNro8Q2h9%5C%2Findex.html%3FcollectionId%3D289%22%2C%22jumpSign%22%3A%22com.jump.jdapp%22%2C%22fromWebView%22%3Atrue%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FDpSh7ma8JV7QAxSE2gJNro8Q2h9%5C%2Findex.html%3FcollectionId%3D289%22%7D%2C%22category%22%3A%22jump%22%2C%22activityId%22%3A%22DpSh7ma8JV7QAxSE2gJNro8Q2h9%22%2C%22h5ToNative%22%3Atrue%2C%22topNavHeight%22%3A100%2C%22switchValue%22%3Atrue%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22isQueryNative%22%3Atrue%2C%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_0_0%22%7D%2C%22collectionId%22%3A%22289%22%2C%22to%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FDpSh7ma8JV7QAxSE2gJNro8Q2h9%5C%2Findex.html%3FcollectionId%3D289%22%2C%22statusBarHeight%22%3A40%2C%22pageTitleHeight%22%3A88%2C%22des%22%3A%22guanzhu%22%2C%22addressId%22%3A%22%22%2C%22posLat%22%3A%220.000000%22%2C%22topNavStyle%22%3A%222%22%7D&client=apple&clientVersion=9.0.4&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=152e76636b868a0071d40f381de26c05&st=1593751709041&sv=100',
  // 京东商城-个护
  JDCare: 'body=%7B%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_3_0%22%7D%2C%22topNavStyle%22%3A%222%22%2C%22babelChannel%22%3A%22%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22innerLink%22%3A%22%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22activityId%22%3A%22NJ1kd1PJWhwvhtim73VPsD1HwY3%22%2C%22posLat%22%3A%220.000000%22%2C%22addressId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22statusBarHeight%22%3A40%2C%22posLng%22%3A%220.000000%22%2C%22dogeVersion%22%3A%220.59.9%22%7D&client=apple&clientVersion=9.0.2&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=9680f61affcbdaaff474e890a9e7fdd9&st=1593697430213&sv=122',
  // 京东商城-美食
  JDFood: 'body=%7B%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_0_0%22%7D%2C%22topNavStyle%22%3A%222%22%2C%22babelChannel%22%3A%22%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22innerLink%22%3A%22%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22activityId%22%3A%224PzvVmLSBq5K63oq4oxKcDtFtzJo%22%2C%22posLat%22%3A%220.000000%22%2C%22addressId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22statusBarHeight%22%3A40%2C%22posLng%22%3A%220.000000%22%2C%22dogeVersion%22%3A%220.59.9%22%7D&client=apple&clientVersion=9.0.4&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=67781770ec3bb2150e1a2dfc207718dd&st=1593749153302&sv=110',
  // 京东商城-珠宝
  JDJewels: 'body=%7B%22scheme%22%3A%22shjump%22%2C%22functionID%22%3A%22virtual%22%2C%22noAnimate%22%3Afalse%2C%22dogeVersion%22%3A%220.59.9%22%2C%22posLng%22%3A%220.000000%22%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FzHUHpTHNTaztSRfNBFNVZscyFZU%5C%2Findex.html%3FcollectionId%3D117%22%2C%22jumpSign%22%3A%22com.jump.jdapp%22%2C%22fromWebView%22%3Atrue%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FzHUHpTHNTaztSRfNBFNVZscyFZU%5C%2Findex.html%3FcollectionId%3D117%22%7D%2C%22category%22%3A%22jump%22%2C%22activityId%22%3A%22zHUHpTHNTaztSRfNBFNVZscyFZU%22%2C%22h5ToNative%22%3Atrue%2C%22topNavHeight%22%3A100%2C%22switchValue%22%3Atrue%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22isQueryNative%22%3Atrue%2C%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_0_0%22%7D%2C%22collectionId%22%3A%22117%22%2C%22to%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FzHUHpTHNTaztSRfNBFNVZscyFZU%5C%2Findex.html%3FcollectionId%3D117%22%2C%22statusBarHeight%22%3A40%2C%22pageTitleHeight%22%3A88%2C%22des%22%3A%22guanzhu%22%2C%22addressId%22%3A%22%22%2C%22posLat%22%3A%220.000000%22%2C%22topNavStyle%22%3A%222%22%7D&client=apple&clientVersion=9.0.4&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=6c49e9f774395f111135017ef279722f&st=1593752364577&sv=121',
  // 京东商城-菜场
  JDVege: 'body=%7B%22isQueryNative%22%3Atrue%2C%22userInterest%22%3A%7B%22plusNew%22%3A%220_0_0%22%2C%22payment%22%3A%220_0_0%22%2C%22whiteNote%22%3A%220_0_0%22%2C%22plusRenew%22%3A%223_3_0%22%7D%2C%22topNavStyle%22%3A%222%22%2C%22topNavHeight%22%3A100%2C%22pageTitleHeight%22%3A88%2C%22h5ToNative%22%3Atrue%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidI2CE30119RkVFM0EyMEItODZBQS00Mg%3D%3D6tX3LDLuxnSY5HYWImtbQKddNiOd9i7CROuz6BOB9X5fYIXP1r%5C%2FodO2X2vGHzjFvayTedeGZRZR6whQf%22%2C%22shshshfpb%22%3A%22svDp7OIdxQdbYg6u3CBYu8be7uke7WsUOLNd45SpMLQgfVs2z6eSliuVTxdw5xW1sRqsEwEnNlJs8Jmbq7OIdWg%3D%3D%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FWcu2LVCFMkBP3HraRvb7pgSpt64%5C%2Findex.html%22%7D%2C%22activityId%22%3A%22Wcu2LVCFMkBP3HraRvb7pgSpt64%22%2C%22switchValue%22%3Atrue%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FWcu2LVCFMkBP3HraRvb7pgSpt64%5C%2Findex.html%22%2C%22addressId%22%3A%22%22%2C%22posLat%22%3A%220.000000%22%2C%22posLng%22%3A%220.000000%22%2C%22statusBarHeight%22%3A40%2C%22dogeVersion%22%3A%220.59.9%22%2C%22fromWebView%22%3Atrue%2C%22to%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FWcu2LVCFMkBP3HraRvb7pgSpt64%5C%2Findex.html%22%7D&client=apple&clientVersion=9.0.2&openudid=f8061cc8ce898a30665aa157d4249e990bd1f1a7&sign=c278e3b1317e8903b864e5f8e3027b43&st=1593698210034&sv=102'
};

async function all() {
  await JingDongSpeedUp(stop); //京东天天加速
  if (stop == 0) {
    await Promise.all([
      JingDongBean(stop), //京东京豆
      JingRongBean(stop), //金融京豆
      JingRongDoll(stop), //金融抓娃娃
      JingRongSteel(stop), //金融钢镚
      JingDongTurn(stop), //京东转盘
      JDUserSignPre(stop, 'JDGStore', '京东商城-超市'), //京东超市
      // JingDongClocks(stop), //京东钟表馆
      JDUserSignPre(stop, 'JDPet', '京东商城-宠物'), //京东宠物馆
      JDFlashSale(stop), //京东闪购
      // JDRawFresh(stop), //京东生鲜
      JDOverseas(stop), //京东国际
      JDUserSignPre(stop, 'JDBook', '京东商城-图书'), //京东图书
      JDUserSignPre(stop, 'JDShand', '京东拍拍-二手'), //京东拍拍二手
      JDUserSignPre(stop, 'JDMakeup', '京东商城-美妆'), //京东美妆馆
      JDUserSignPre(stop, 'JDWomen', '京东商城-女装'), //京东女装馆
      JDUserSignPre(stop, 'JDVege', '京东商城-菜场'), //京东菜场
      JingDongCash(stop), //京东现金红包
      JDUserSignPre(stop, 'JDFood', '京东商城-美食'), //京东美食馆
      // JingRSeeAds(stop), //金融看广告
      // JingRongGame(stop), //金融游戏大厅
      // JingDongLive(stop), //京东智能生活馆
      JDUserSignPre(stop, 'JDClean', '京东商城-清洁'), //京东清洁馆
      JDUserSignPre(stop, 'JDCare', '京东商城-个护'), //京东个人护理馆
      JDUserSignPre(stop, 'JDJewels', '京东商城-珠宝'), //京东珠宝馆
      // JDMagicCube(stop), //京东小魔方
      // JingDongFish(stop), //京东小京鱼
      JingDongPrize(stop), //京东抽大奖
      JingDongSubsidy(stop), //京东金贴
      JingDongShake(stop) //京东摇一摇
    ])
  } else {
    await JingDongBean(stop); //京东京豆
    await JingRongBean(stop); //金融京豆
    await JingRongDoll(stop); //金融抓娃娃
    await JingRongSteel(stop); //金融钢镚
    await JingDongTurn(stop); //京东转盘
    await JDUserSignPre(stop, 'JDGStore', '京东商城-超市'); //京东超市
    // await JingDongClocks(stop); //京东钟表馆
    await JDUserSignPre(stop, 'JDPet', '京东商城-宠物'); //京东宠物馆
    await JDFlashSale(stop); //京东闪购
    // await JDRawFresh(stop); //京东生鲜
    await JDOverseas(stop); //京东国际
    await JDUserSignPre(stop, 'JDBook', '京东商城-图书'); //京东图书
    await JDUserSignPre(stop, 'JDShand', '京东拍拍-二手'); //京东拍拍二手
    await JDUserSignPre(stop, 'JDMakeup', '京东商城-美妆'); //京东美妆馆
    await JDUserSignPre(stop, 'JDWomen', '京东商城-女装'); //京东女装馆
    await JDUserSignPre(stop, 'JDVege', '京东商城-菜场'); //京东菜场
    await JingDongCash(stop); //京东现金红包
    await JDUserSignPre(stop, 'JDFood', '京东商城-美食'); //京东美食馆
    // await JingRSeeAds(stop); //金融看广告
    // await JingRongGame(stop); //金融游戏大厅
    // await JingDongLive(stop); //京东智能生活馆
    await JDUserSignPre(stop, 'JDClean', '京东商城-清洁'); //京东清洁馆
    await JDUserSignPre(stop, 'JDCare', '京东商城-个护'); //京东个人护理馆
    await JDUserSignPre(stop, 'JDJewels', '京东商城-珠宝'); //京东珠宝馆
    // await JDMagicCube(stop); //京东小魔方
    // await JingDongFish(stop); //京东小京鱼
    await JingDongPrize(stop); //京东抽大奖
    await JingDongSubsidy(stop); //京东金贴
    await JingDongShake(stop) //京东摇一摇
  }
  await JRDoubleSign(stop); //金融双签
  await Promise.all([
    TotalSteel(), //总钢镚查询
    TotalCash(), //总红包查询
    TotalBean() //总京豆查询
  ])
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
      var Cash = merge.JDCash.TCash ? merge.JDCash.TCash + "红包" : ""
      var Steel = merge.JRSteel.TSteel ? merge.JRSteel.TSteel + "钢镚" + (Cash ? ", " : "") : ""
      var beans = merge.JDShake.Qbear ? merge.JDShake.Qbear + "京豆" + (Steel || Cash ? ", " : "" ) : ""
      var bsc = beans ? "\n" : Steel ? "\n" : Cash ? "\n" : "获取失败\n"
      var Tbean = bean ? bean + "京豆" + (steel || merge.JDCash.Cash ? ", " : "") : ""
      var TSteel = steel ? steel + "钢镚" + (merge.JDCash.Cash ? ", " : "") : ""
      var TCash = merge.JDCash.Cash ? merge.JDCash.Cash + "红包" : ""
      var Tbsc = Tbean ? "\n" : TSteel ? "\n" : TCash ? "\n" : "获取失败\n"
      var Ts = success ? "成功" + success + "个" + (fail ? ", " : "") : ""
      var Tf = fail ? "失败" + fail + "个" : success ? "" : "获取失败"
      var one = "【签到概览】:  " + Ts + Tf + "\n"
      var two = "【签到总计】:  " + Tbean + TSteel + TCash + Tbsc
      var three = "【账号总计】:  " + beans + Steel + Cash + bsc
      var four = "【左滑 '查看' 以显示签到详情】\n"
      var DName = merge.JDShake.nickname ? merge.JDShake.nickname : "获取失败"
      var Name = add ? DualAccount ? "【签到号一】:  " + DName + "\n" : "【签到号二】:  " + DName + "\n" : ""
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
      if (DualAccount) {
        double();
      } else {
        $nobyda.time();
        $nobyda.done();
      }
      resolve()
    } catch (eor) {
      $nobyda.notify("通知模块 " + eor.name + "‼️", JSON.stringify(eor), eor.message)
      resolve()
    }
  });
}

function ReadCookie() {
  initial()
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
      $nobyda.done()
      return
    }
    $nobyda.notify("脚本终止", "", '未关闭脚本内"DeleteCookie"选项 ‼️')
    $nobyda.done()
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
    $nobyda.done()
  }
}

function double() {
  initial()
  add = true
  DualAccount = false
  if ($nobyda.isJSBox) {
    if (DualKey || $file.exists("shared://JD_Cookie2.txt")) {
      KEY = DualKey ? DualKey : $file.read("shared://JD_Cookie2.txt").string
      all()
    } else {
      $nobyda.time();
    }
  } else if (DualKey || $nobyda.read("CookieJD2")) {
    KEY = DualKey ? DualKey : $nobyda.read("CookieJD2")
    all()
  } else {
    $nobyda.time();
    $nobyda.done();
  }
}

function JingDongBean(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDBUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=signBeanIndex&appid=ld',
        headers: {
          Cookie: KEY,
        }
      };
      $nobyda.get(JDBUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDBean.notify = "京东商城-京豆: 签到接口请求失败 ‼️‼️"
            merge.JDBean.fail = 1
          } else {
            const cc = JSON.parse(data)
            const Details = LogDetails ? "response:\n" + data : '';
            if (cc.code == 3) {
              console.log("\n" + "京东商城-京豆Cookie失效 " + Details)
              merge.JDBean.notify = "京东商城-京豆: 失败, 原因: Cookie失效‼️"
              merge.JDBean.fail = 1
            } else {
              if (data.match(/跳转至拼图/)) {
                merge.JDBean.notify = "京东商城-京豆: 失败, 原因: 需要拼图验证 ⚠️"
                merge.JDBean.fail = 1
              } else {
                if (data.match(/\"status\":\"?1\"?/)) {
                  console.log("\n" + "京东商城-京豆签到成功 " + Details)
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
                  console.log("\n" + "京东商城-京豆签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-京豆" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongTurn(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDTUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=lotteryDraw&body=%7B%22actId%22%3A%22jgpqtzjhvaoym%22%2C%22appSource%22%3A%22jdhome%22%2C%22lotteryCode%22%3A%224wwzdq7wkqx2usx4g5i2nu5ho4auto4qxylblkxacm7jqdsltsepmgpn3b2hgyd7hiawzpccizuck%22%7D&appid=ld',
        headers: {
          Cookie: KEY,
        }
      };
      $nobyda.get(JDTUrl, async function(error, response, data) {
        try {
          if (error) {
            merge.JDTurn.notify += merge.JDTurn.notify ? "\n京东商城-转盘: 签到接口请求失败 ‼️‼️ (多次)" : "京东商城-转盘: 签到接口请求失败 ‼️‼️"
            merge.JDTurn.fail += 1
          } else {
            const cc = JSON.parse(data)
            const Details = LogDetails ? "response:\n" + data : '';
            if (cc.code == 3) {
              console.log("\n" + "京东转盘Cookie失效 " + Details)
              merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: Cookie失效‼️"
              merge.JDTurn.fail = 1
            } else {
              if (data.match(/(\"T216\"|活动结束)/)) {
                merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 活动结束 ⚠️"
                merge.JDTurn.fail = 1
              } else {
                if (data.match(/(京豆|\"910582\")/)) {
                  console.log("\n" + "京东商城-转盘签到成功 " + Details)
                  merge.JDTurn.notify += merge.JDTurn.notify ? "\n京东商城-转盘: 成功, 明细: " + cc.data.prizeSendNumber + "京豆 🐶 (多次)" : "京东商城-转盘: 成功, 明细: " + cc.data.prizeSendNumber + "京豆 🐶"
                  merge.JDTurn.success += 1
                  merge.JDTurn.bean += Number(cc.data.prizeSendNumber)
                  if (cc.data.chances != "0") {
                    await JingDongTurn(2000)
                  }
                } else {
                  console.log("\n" + "京东商城-转盘签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-转盘" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingRongBean(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const login = {
        url: 'https://ms.jr.jd.com/gw/generic/zc/h5/m/signRecords',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
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
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/\"login\":true/)) {
              console.log("\n" + "京东金融-京豆登录成功 " + Details)
              await JRBeanCheckin(200)
            } else {
              console.log("\n" + "京东金融-京豆登录失败 " + Details)
              if (data.match(/\"login\":false/)) {
                merge.JRBean.notify = "京东金融-京豆: 失败, 原因: Cookie失效‼️"
                merge.JRBean.fail = 1
              } else {
                merge.JRBean.notify = "京东金融-京豆: 登录接口需修正 ‼️‼️"
                merge.JRBean.fail = 1
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东金融-京豆登录" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
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
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/\"resultCode\":\"00000\"/)) {
              console.log("\n" + "京东金融-京豆签到成功 " + Details)
              if (c.resultData.data.rewardAmount != "0") {
                merge.JRBean.notify = "京东金融-京豆: 成功, 明细: " + c.resultData.data.rewardAmount + "京豆 🐶"
                merge.JRBean.success = 1
                merge.JRBean.bean = c.resultData.data.rewardAmount
              } else {
                merge.JRBean.notify = "京东金融-京豆: 成功, 明细: 无奖励 🐶"
                merge.JRBean.success = 1
              }
            } else {
              console.log("\n" + "京东金融-京豆签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东金融-京豆" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingRongSteel(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JRSUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/gry/h5/m/signIn',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
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
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/\"resBusiCode\":0/)) {
              console.log("\n" + "京东金融-钢镚签到成功 " + Details)
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
              console.log("\n" + "京东金融-钢镚签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东金融-钢镚" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JRDoubleSign(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JRDSUrl = {
        url: 'https://nu.jr.jd.com/gw/generic/jrm/h5/m/process?',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "reqData=%7B%22actCode%22%3A%22FBBFEC496C%22%2C%22type%22%3A3%2C%22riskDeviceParam%22%3A%22%22%7D"
      };
      $nobyda.post(JRDSUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JRDSign.notify = "京东金融-双签: 签到接口请求失败 ‼️‼️"
            merge.JRDSign.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/\"resultCode\":0/)) {
              if (data.match(/\"count\":\d+/)) {
                console.log("\n" + "京东金融-双签签到成功 " + Details)
                merge.JRDSign.bean = data.match(/\"count\":(\d+)/)[1]
                merge.JRDSign.notify = "京东金融-双签: 成功, 明细: " + merge.JRDSign.bean + "京豆 🐶"
                merge.JRDSign.success = 1
              } else {
                console.log("\n" + "京东金融-双签签到失败 " + Details)
                merge.JRDSign.fail = 1
                if (data.match(/已领取/)) {
                  merge.JRDSign.notify = "京东金融-双签: 失败, 原因: 已签过 ⚠️"
                } else if (data.match(/未在/)) {
                  merge.JRDSign.notify = "京东金融-双签: 失败, 原因: 未在京东签到 ⚠️"
                } else {
                  merge.JRDSign.notify = "京东金融-双签: 失败, 原因: 无奖励 🐶"
                }
              }
            } else {
              console.log("\n" + "京东金融-双签签到失败 " + Details)
              merge.JRDSign.fail = 1
              if (data.match(/(\"resultCode\":3|请先登录)/)) {
                merge.JRDSign.notify = "京东金融-双签: 失败, 原因: Cookie失效‼️"
              } else {
                merge.JRDSign.notify = "京东金融-双签: 失败, 原因: 未知 ⚠️"
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东金融-双签" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongShake(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDSh = {
        url: 'https://api.m.jd.com/client.action?appid=vip_h5&functionId=vvipclub_shaking',
        headers: {
          Cookie: KEY,
        }
      };
      $nobyda.get(JDSh, async function(error, response, data) {
        try {
          if (error) {
            merge.JDShake.notify += merge.JDShake.notify ? "\n京东商城-摇摇: 签到接口请求失败 ‼️‼️ (多次)\n" + error : "京东商城-摇摇: 签到接口请求失败 ‼️‼️\n" + error
            merge.JDShake.fail += 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/prize/)) {
              console.log("\n" + "京东商城-摇一摇签到成功 " + Details)
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
              console.log("\n" + "京东商城-摇一摇签到失败 " + Details)
              if (data.match(/true/)) {
                merge.JDShake.notify += merge.JDShake.notify ? "\n京东商城-摇摇: 成功, 明细: 无奖励 🐶 (多次)" : "京东商城-摇摇: 成功, 明细: 无奖励 🐶"
                merge.JDShake.success += 1
                if (cc.data.luckyBox.freeTimes != 0) {
                  await JingDongShake(s)
                }
              } else {
                if (data.match(/(无免费|8000005|9000005)/)) {
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-摇摇" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDUserSignPre(s, key, title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const JDUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=qryAppBabelFloors',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: acData[key]
      };
      $nobyda.post(JDUrl, function(error, response, data) {
        try {
          if (error) {
            merge[key].notify = `${title}: 签到活动获取失败 ‼️‼️`
            merge[key].fail = 1
          } else {
            if (data.match(/enActK/)) { // 含有签到活动数据
              const od = JSON.parse(data);
              let params = (od.floatLayerList || []).filter(o=>o.params && o.params.match(/enActK/)).map(o=>o.params).pop();
              if(!params){ // 第一处找到签到所需数据
                // floatLayerList未找到签到所需数据，从floorList中查找
                params = (od.floorList || []).filter(o=>o.template=='signIn' && o.signInfos && o.signInfos.params && o.signInfos.params.match(/enActK/))
                    .map(o=>o.signInfos.params).pop();
              }
              if(params){
                resolve({params: params}); // 执行签到处理
                return;
              }
            }
            merge[key].notify = `${title}: 失败, 原因: 不含活动数据 ⚠️`
            merge[key].fail = 1
          }
          reject()
        } catch (eor) {
          $nobyda.notify(`${title}${eor.name} ‼️`, JSON.stringify(eor), eor.message)
          reject()
        }
      })
    }, s)
    if (out) setTimeout(reject, out + s)
  }).then(data=>{
    return JDUserSign(s, key, title, encodeURIComponent(JSON.stringify(data)));
  });
}

function JDUserSign(s, key, title, body) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: `body=${body}&client=wh5`
      };
      $nobyda.post(JDUrl, function(error, response, data) {
        try {
          if (error) {
            merge[key].notify = `${title}: 签到接口请求失败 ‼️‼️`
            merge[key].fail = 1
          } else {
            const Details = LogDetails ? `response:\n${data}` : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log(`\n${title}签到成功${Details}`)
              if (data.match(/(\"text\":\"\d+京豆\")/)) {
                let beanQuantity = cc.awardList[0].text.match(/\d+/)
                merge[key].notify = `${title}: 成功, 明细: ${beanQuantity}京豆 🐶`
                merge[key].bean = beanQuantity
                merge[key].success = 1
              } else {
                merge[key].notify = `${title}: 成功, 明细: 无京豆 🐶`
                merge[key].success = 1
              }
            } else {
              console.log(`\n${title}签到失败 ${Details}`)
              if (data.match(/(已签到|已领取)/)) {
                merge[key].notify = `${title}: 失败, 原因: 已签过 ⚠️`
                merge[key].fail = 1
              } else {
                if (data.match(/(不存在|已结束)/)) {
                  merge[key].notify = `${title}: 失败, 原因: 活动已结束 ⚠️`
                  merge[key].fail = 1
                } else {
                  if (cc.code == 3) {
                    merge[key].notify = `${title}: 失败, 原因: Cookie失效‼️`
                    merge[key].fail = 1
                  } else {
                    merge[key].notify = `${title}: 失败, 原因: 未知 ⚠️`
                    merge[key].fail = 1
                  }
                }
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify(`${title}${eor.name} ‼️`, JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDGroceryStore(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDGSUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22caA6%2B%2FTo6Jfe%2FAKYm8gLQEchLXtYeB53heY9YzuzsZoaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22signId%5C%22%3A%5C%22hEr1TO1FjXgaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&screen=750%2A1334&client=wh5&clientVersion=1.0.0&sid=0ac0caddd8a12bf58ea7a912a5c637cw&uuid=1fce88cd05c42fe2b054e846f11bdf33f016d676&area=19_1617_3643_8208"
      };
      $nobyda.post(JDGSUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDGStore.notify = "京东商城-超市: 签到接口请求失败 ‼️‼️"
            merge.JDGStore.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-超市签到成功 " + Details)
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
              console.log("\n" + "京东商城-超市签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-超市" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongClocks(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDCUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
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
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-钟表签到成功 " + Details)
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
              console.log("\n" + "京东商城-钟表签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-钟表" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongPet(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDPETUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%226DiDTHMDvpNyoP9JUaEkki%2FsREOeEAl8M8REPQ%2F2eA4aZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22signId%5C%22%3A%5C%22Nk2fZhdgf5UaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };
      $nobyda.post(JDPETUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDPet.notify = "京东商城-宠物: 签到接口请求失败 ‼️‼️"
            merge.JDPet.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-宠物签到成功 " + Details)
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
              console.log("\n" + "京东商城-宠物签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-宠物" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDFlashSale(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDPETUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=partitionJdSgin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%7D&client=apple&clientVersion=8.4.6&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=141ab5f9af92126bb46d50f3e8af758a&st=1579305780511&sv=102"
      };
      $nobyda.post(JDPETUrl, async function(error, response, data) {
        try {
          if (error) {
            merge.JDFSale.notify = "京东商城-闪购: 签到接口请求失败 ‼️‼️"
            merge.JDFSale.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (cc.result.code == 0) {
              console.log("\n" + "京东商城-闪购签到成功 " + Details)
              if (data.match(/(\"count\":\d+)/)) {
                merge.JDFSale.notify = "京东商城-闪购: 成功, 明细: " + cc.result.count + "京豆 🐶"
                merge.JDFSale.bean = cc.result.count
                merge.JDFSale.success = 1
              } else {
                merge.JDFSale.notify = "京东商城-闪购: 成功, 明细: 无京豆 🐶"
                merge.JDFSale.success = 1
              }
            } else {
              console.log("\n" + "京东商城-闪购签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-闪购" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function FlashSaleDivide(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const Url = {
        url: 'https://api.m.jd.com/client.action?functionId=partitionJdShare',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%7D&client=apple&clientVersion=8.5.0&d_brand=apple&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=958ba0e805094b4b0f6216e86190ab51&st=1582042405636&sv=120&wifiBssid=unknown"
      };
      $nobyda.post(Url, function(error, response, data) {
        try {
          if (error) {
            merge.JDFSale.notify = "京东闪购-瓜分: 签到接口请求失败 ‼️‼️"
            merge.JDFSale.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (cc.result.code == 0) {
              console.log("\n" + "京东闪购-瓜分签到成功 " + Details)
              if (data.match(/(\"jdBeanNum\":\d+)/)) {
                merge.JDFSale.notify = "京东闪购-瓜分: 成功, 明细: " + cc.result.jdBeanNum + "京豆 🐶"
                merge.JDFSale.bean = cc.result.jdBeanNum
                merge.JDFSale.success = 1
              } else {
                merge.JDFSale.notify = "京东闪购-瓜分: 成功, 明细: 无京豆 🐶"
                merge.JDFSale.success = 1
              }
            } else {
              console.log("\n" + "京东闪购-瓜分签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东闪购-瓜分" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongBook(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDBookUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22:%22%7B%5C%22enActK%5C%22:%5C%229wKIMMJjQLbQFeZ6KQv0JUceKLqlvgXn6rbDSKENcQfkauEjd2zVcD17WlO1lXfFcRRfojzJNzK5%5C%5Cnv2OW2JAQGhOC%2FuFwv2wvFk0xY4qnbBXmTh4uRj8Sya0mdQG8nKiTGmbP5%2BHKCzc%3D%5C%22,%5C%22isFloatLayer%5C%22:false,%5C%22ruleSrv%5C%22:%5C%22%5C%22,%5C%22signId%5C%22:%5C%22ET7Lb%2BykM2UaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };
      $nobyda.post(JDBookUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDBook.notify = "京东商城-图书: 签到接口请求失败 ‼️‼️"
            merge.JDBook.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-图书签到成功 " + Details)
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
              console.log("\n" + "京东商城-图书签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-图书" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDSecondhand(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDSDUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22:%22%7B%5C%22enActK%5C%22:%5C%229wKIMMJjQLbQFeZ6KQv0JRQuvrekjNWBHq5yWQKMup94QBKDKesTcH7ksLGiyVVTcRRfojzJNzK5%5C%5Cnv2OW2JAQGhOC%2FuFwv2wvFk0xY4qnbBXmTh4uRj8SybdH8Zsb1z7oGmbP5%2BHKCzc%3D%5C%22,%5C%22isFloatLayer%5C%22:false,%5C%22ruleSrv%5C%22:%5C%22%5C%22,%5C%22signId%5C%22:%5C%22lHKyVOs4tWsaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };
      $nobyda.post(JDSDUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDShand.notify = "京东拍拍-二手: 签到接口请求失败 ‼️‼️"
            merge.JDShand.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东拍拍-二手签到成功 " + Details)
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
              console.log("\n" + "京东拍拍-二手签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东拍拍-二手" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDMakeup(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDMUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22:%22%7B%5C%22enActK%5C%22:%5C%229wKIMMJjQLbQFeZ6KQv0JT%2BxE%2FTNYGQEgDXiqz5pSGMrb6ALRrMY7z3jK9%2BNn5UfcRRfojzJNzK5%5C%5Cnv2OW2JAQGhOC%2FuFwv2wvFk0xY4qnbBXmTh4uRj8SyYEPRFBaTGhiGmbP5%2BHKCzc%3D%5C%22,%5C%22isFloatLayer%5C%22:false,%5C%22ruleSrv%5C%22:%5C%22%5C%22,%5C%22signId%5C%22:%5C%2260EAB6I6mFYaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };
      $nobyda.post(JDMUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDMakeup.notify = "京东商城-美妆: 签到接口请求失败 ‼️‼️"
            merge.JDMakeup.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-美妆签到成功 " + Details)
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
              console.log("\n" + "京东商城-美妆签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-美妆" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongClean(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDCUUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22:%22%7B%5C%22enActK%5C%22:%5C%22IISGsnFe2550fXuQWRicon9OfD8xWRUZV5JGjHFrlFgaZs%2Fn4coLNw%3D%3D%5C%22,%5C%22isFloatLayer%5C%22:false,%5C%22ruleSrv%5C%22:%5C%22%5C%22,%5C%22signId%5C%22:%5C%22sbfLCAyDwfEaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };
      $nobyda.post(JDCUUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDClean.notify = "京东商城-清洁: 签到接口请求失败 ‼️‼️"
            merge.JDClean.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-清洁签到成功 " + Details)
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
              console.log("\n" + "京东商城-清洁签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-清洁" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongWomen(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDMUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22url%22%3A%22%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22OQmfgxmylrMM6EurCHg9lEjL1ShNb2dVjEja9MceBPgaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200002492_28085975_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22YE5T0wVaiL8aZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&build=167057&client=apple&clientVersion=8.5.0&d_brand=apple&d_model=iPhone8%2C2&networklibtype=JDNetworkBaseAF&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&osVersion=13.3.1&scope=11&screen=1242%2A2208&sign=7329899a26d8a8c3046b882d6df2b329&st=1581083524405&sv=101&uuid=coW0lj7vbXVin6h7ON%2BtMNFQqYBqMahr"
      };
      $nobyda.post(JDMUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDWomen.notify = "京东商城-女装: 签到接口请求失败 ‼️‼️"
            merge.JDWomen.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-女装签到成功 " + Details)
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
              console.log("\n" + "京东商城-女装签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-女装" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongCash(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDCAUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=ccSignInNew',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22monitorSource%22%3A%22cc_sign_ios_index_config%22%7D&client=apple&clientVersion=8.5.0&d_brand=apple&d_model=iPhone8%2C2&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&scope=11&screen=1242%2A2208&sign=1cce8f76d53fc6093b45a466e93044da&st=1581084035269&sv=102"
      };
      $nobyda.post(JDCAUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDCash.notify = "京东现金-红包: 签到接口请求失败 ‼️‼️"
            merge.JDCash.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (cc.busiCode == "0") {
              console.log("\n" + "京东现金-红包签到成功 " + Details)
              if (cc.result.signResult.signData.amount) {
                merge.JDCash.notify = "京东现金-红包: 成功, 明细: " + cc.result.signResult.signData.amount + "红包 🧧"
                merge.JDCash.Cash = cc.result.signResult.signData.amount
                merge.JDCash.success = 1
              } else {
                merge.JDCash.notify = "京东现金-红包: 成功, 明细: 无红包 🧧"
                merge.JDCash.success = 1
              }
            } else {
              console.log("\n" + "京东现金-红包签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东现金-红包" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDPersonalCare(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDPCUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22:%22%7B%5C%22enActK%5C%22:%5C%22zNPKFJJ4Ub4z%2FCNSRNQQvbBx8k2lmYuOGRf1jJ2o94EaZs%2Fn4coLNw%3D%3D%5C%22,%5C%22isFloatLayer%5C%22:false,%5C%22ruleSrv%5C%22:%5C%22%5C%22,%5C%22signId%5C%22:%5C%22UG57%2FRURhvQaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };
      $nobyda.post(JDPCUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDCare.notify = "京东商城-个护: 签到接口请求失败 ‼️‼️"
            merge.JDCare.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-个护签到成功 " + Details)
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
              console.log("\n" + "京东商城-个护签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-个护" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingRSeeAds(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JRAdsUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/jrm/h5/m/sendAdGb',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "reqData=%7B%22clientType%22%3A%22ios%22%2C%22actKey%22%3A%22176696%22%2C%22userDeviceInfo%22%3A%7B%22adId%22%3A9999999%7D%2C%22deviceInfoParam%22%3A%7B%22macAddress%22%3A%2202%3A00%3A00%3A00%3A00%3A00%22%2C%22channelInfo%22%3A%22appstore%22%2C%22IPAddress1%22%3A%22%22%2C%22OpenUDID%22%3A%22%22%2C%22clientVersion%22%3A%225.3.30%22%2C%22terminalType%22%3A%2202%22%2C%22osVersion%22%3A%22%22%2C%22appId%22%3A%22com.jd.jinrong%22%2C%22deviceType%22%3A%22iPhone8%2C2%22%2C%22networkType%22%3A%22%22%2C%22startNo%22%3A212%2C%22UUID%22%3A%22%22%2C%22IPAddress%22%3A%22%22%2C%22deviceId%22%3A%22%22%2C%22IDFA%22%3A%22%22%2C%22resolution%22%3A%22%22%2C%22osPlatform%22%3A%22iOS%22%7D%2C%22bussource%22%3A%22%22%7D"
      };
      $nobyda.post(JRAdsUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JRSeeAds.notify = "京东金融-广告: 签到接口请求失败 ‼️‼️"
            merge.JRSeeAds.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/(\"canGetGb\":true)/)) {
              console.log("\n" + "京东金融-广告签到成功 " + Details)
              if (data.match(/(\"volumn\"|\"volume\")/)) {
                merge.JRSeeAds.notify = "京东金融-广告: 成功, 明细: " + cc.resultData.data.volumn + "京豆 🐶"
                merge.JRSeeAds.bean = cc.resultData.data.volumn
                merge.JRSeeAds.success = 1
              } else {
                merge.JRSeeAds.notify = "京东金融-广告: 成功, 明细: 无京豆 🐶"
                merge.JRSeeAds.success = 1
              }
            } else {
              console.log("\n" + "京东金融-广告签到失败 " + Details)
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
                  } else {
                    merge.JRSeeAds.notify = "京东金融-广告: 失败, 原因: 未开始 ⚠️"
                    merge.JRSeeAds.fail = 1
                  }
                }
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东金融-广告" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingRongGame(s) {
  return new Promise(resolve => {
    setTimeout(() => {
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
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/(未登录)/)) {
              console.log("\n" + "京东金融-游戏登录失败 " + Details)
              merge.JRGame.notify = "京东游戏-登录: 失败, 原因: Cookie失效‼️"
              merge.JRGame.fail = 1
            } else if (data.match(/(成功)/)) {
              console.log("\n" + "京东金融-游戏登录成功 " + Details)
              await JRGameCheckin(0)
            } else {
              merge.JRGame.notify = "京东游戏-登录: 失败, 原因: 未知 ⚠️"
              merge.JRGame.fail = 1
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东游戏-登录" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
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
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/(\"code\":200)/)) {
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东金融-游戏" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongLive(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDLUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FKcfFqWvhb5hHtaQkS4SD1UU6RcQ%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.luck4ever.net%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000042554_%26utm_term%3D8d1fbab27551485f8f9b1939aee1ffd0%22%7D%2C%22url%22%3A%22https%3A%5C%2F%5C%2Fpro.m.jd.com%5C%2Fmall%5C%2Factive%5C%2FKcfFqWvhb5hHtaQkS4SD1UU6RcQ%5C%2Findex.html%3Fcu%3Dtrue%26utm_source%3Dwww.luck4ever.net%26utm_medium%3Dtuiguang%26utm_campaign%3Dt_1000042554_%26utm_term%3D8d1fbab27551485f8f9b1939aee1ffd0%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22isDhQnCJUnjlNPoFf5Do0JM9l54aZ0%5C%2FeHe0aBgdJgcQaZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Atrue%2C%5C%22ruleSrv%5C%22%3A%5C%2200007152_29653514_t0%5C%22%2C%5C%22signId%5C%22%3A%5C%22ZYsm01V6Gr4aZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&client=apple&clientVersion=8.5.0&d_brand=apple&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=c7ecee5b465f5edd7ed2e2189fad2335&st=1581317924210&sv=120"
      };
      $nobyda.post(JDLUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDLive.notify = "京东智能-生活: 签到接口请求失败 ‼️‼️"
            merge.JDLive.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东智能-生活签到成功 " + Details)
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
              console.log("\n" + "京东智能-生活签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东智能-生活" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDMagicCube(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDMCUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=getNewsInteractionLotteryInfo&appid=smfe',
        headers: {
          Cookie: KEY,
        }
      };
      $nobyda.get(JDMCUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDCube.notify = "京东商城-魔方: 签到接口请求失败 ‼️‼️"
            merge.JDCube.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/(\"name\":)/)) {
              console.log("\n" + "京东商城-魔方签到成功 " + Details)
              if (data.match(/(\"name\":\"京豆\")/)) {
                merge.JDCube.notify = "京东商城-魔方: 成功, 明细: " + cc.result.lotteryInfo.quantity + "京豆 🐶"
                merge.JDCube.bean = cc.result.lotteryInfo.quantity
                merge.JDCube.success = 1
              } else {
                merge.JDCube.notify = "京东商城-魔方: 成功, 明细: " + cc.result.lotteryInfo.name + " 🎉"
                merge.JDCube.success = 1
              }
            } else {
              console.log("\n" + "京东商城-魔方签到失败 " + Details)
              if (data.match(/(一闪而过|已签到|已领取)/)) {
                merge.JDCube.notify = "京东商城-魔方: 失败, 原因: 无机会 ⚠️"
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-魔方" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongPrize(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDkey = {
        url: 'https://api.m.jd.com/client.action?functionId=vvipscdp_raffleAct_index&client=apple&clientVersion=8.1.0&appid=member_benefit_m',
        headers: {
          Cookie: KEY,
          Referer: "https://jdmall.m.jd.com/beansForPrizes",
        }
      };
      $nobyda.get(JDkey, async function(error, response, data) {
        try {
          if (error) {
            merge.JDPrize.notify = "京东商城-大奖: 查询接口请求失败 ‼️‼️"
            merge.JDPrize.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/\"raffleActKey\":\"[a-zA-z0-9]{3,}\"/)) {
              const cc = JSON.parse(data)
              merge.JDPrize.key = cc.data.floorInfoList[0].detail.raffleActKey
              console.log("\n" + "京东商城-大奖查询KEY成功 " + Details)
              if (merge.JDPrize.key) {
                await JDPrizeCheckin(s)
              } else {
                merge.JDPrize.notify = "京东商城-大奖: 失败, 原因: 无奖池 ⚠️"
                merge.JDPrize.fail = 1
              }
            } else {
              console.log("\n" + "京东商城-大奖查询KEY失败 " + Details)
              if (data.match(/(未登录|\"101\")/)) {
                merge.JDPrize.notify = "京东大奖-登录: 失败, 原因: Cookie失效‼️"
                merge.JDPrize.fail = 1
              } else {
                merge.JDPrize.notify = "京东大奖-登录: 失败, 原因: 未知 ⚠️"
                merge.JDPrize.fail = 1
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-大奖查询KEY" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDPrizeCheckin(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDPUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=vvipscdp_raffleAct_lotteryDraw&body=%7B%22raffleActKey%22%3A%22' + merge.JDPrize.key + '%22%2C%22drawType%22%3A0%2C%22riskInformation%22%3A%7B%7D%7D&client=apple&clientVersion=8.1.0&appid=member_benefit_m',
        headers: {
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
            const Details = LogDetails ? "response:\n" + data : '';
            const c = JSON.parse(data)
            if (data.match(/\"success\":true/)) {
              console.log("\n" + "京东商城-大奖签到成功 " + Details)
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
              console.log("\n" + "京东商城-大奖签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-大奖签到" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongFood(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDMUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22riskParam%22%3A%7B%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22childActivityUrl%22%3A%22-1%22%7D%2C%22url%22%3A%22%22%2C%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22ISAK2dGRGwUvAxydM0b9JME8vHPZx5%2Bbqq%2BeDZx%2ByQ0aZs%5C%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200635175_34403692_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22AB2OpCHnazsaZs%5C%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22geo%22%3A%7B%22lng%22%3A%220.000000%22%2C%22lat%22%3A%220.000000%22%7D%7D&build=167237&client=apple&clientVersion=9.0.0&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&partner=apple&rfs=0000&scope=11&sign=b04cd14d9f34a0c5c0cdd47dd16c0d78&st=1590843050471&sv=101"
      };
      $nobyda.post(JDMUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDFood.notify = "京东商城-美食: 签到接口请求失败 ‼️‼️"
            merge.JDFood.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-美食签到成功 " + Details)
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
              console.log("\n" + "京东商城-美食签到失败 " + Details)
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
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-美食" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongJewels(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JewelsUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22nnpwpEXNlz8SHkPPXlGwF%2FlW70GyWhRm%2BKc12m3aC7saZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%22%5C%22%2C%5C%22signId%5C%22%3A%5C%22XzS3bsc7deYaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };
      $nobyda.post(JewelsUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDJewels.notify = "京东商城-珠宝: 签到接口请求失败 ‼️‼️"
            merge.JDJewels.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-珠宝签到成功 " + Details)
              if (data.match(/(\"text\":\"\d+京豆\")/)) {
                beanQuantity = cc.awardList[0].text.match(/\d+/)
                merge.JDJewels.notify = "京东商城-珠宝: 成功, 明细: " + beanQuantity + "京豆 🐶"
                merge.JDJewels.bean = beanQuantity
                merge.JDJewels.success = 1
              } else {
                merge.JDJewels.notify = "京东商城-珠宝: 成功, 明细: 无京豆 🐶"
                merge.JDJewels.success = 1
              }
            } else {
              console.log("\n" + "京东商城-珠宝签到失败 " + Details)
              if (data.match(/(已签到|已领取)/)) {
                merge.JDJewels.notify = "京东商城-珠宝: 失败, 原因: 已签过 ⚠️"
                merge.JDJewels.fail = 1
              } else {
                if (data.match(/(不存在|已结束|未开始)/)) {
                  merge.JDJewels.notify = "京东商城-珠宝: 失败, 原因: 活动已结束 ⚠️"
                  merge.JDJewels.fail = 1
                } else {
                  if (cc.code == 3) {
                    merge.JDJewels.notify = "京东商城-珠宝: 失败, 原因: Cookie失效‼️"
                    merge.JDJewels.fail = 1
                  } else if (cc.code == "600") {
                    merge.JDJewels.notify = "京东商城-珠宝: 失败, 原因: 认证失败 ⚠️"
                    merge.JDJewels.fail = 1
                  } else {
                    merge.JDJewels.notify = "京东商城-珠宝: 失败, 原因: 未知 ⚠️"
                    merge.JDJewels.fail = 1
                  }
                }
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-珠宝" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDRawFresh(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const FreshUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22hxDQlh9sKWg4cXt%2B8jAzLGw1gCEzpKZCtT0JUj%2FMKdgaZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%22%5C%22%2C%5C%22signId%5C%22%3A%5C%22PhxqYqd4RYcaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22riskParam%22%3A%7B%22platform%22%3A%223%22%2C%22orgType%22%3A%222%22%2C%22openId%22%3A%22-1%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22eid%22%3A%22%22%2C%22fp%22%3A%22%22%2C%22shshshfp%22%3A%22%22%2C%22shshshfpa%22%3A%22%22%2C%22shshshfpb%22%3A%22%22%2C%22childActivityUrl%22%3A%22%22%7D%2C%22mitemAddrId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%22%22%2C%22lat%22%3A%22%22%7D%2C%22addressId%22%3A%22%22%2C%22posLng%22%3A%22%22%2C%22posLat%22%3A%22%22%2C%22focus%22%3A%22%22%2C%22innerAnchor%22%3A%22%22%2C%22cv%22%3A%222.0%22%7D&client=wh5"
      };
      $nobyda.post(FreshUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDFresh.notify = "京东商城-生鲜: 签到接口请求失败 ‼️‼️"
            merge.JDFresh.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-生鲜签到成功 " + Details)
              if (data.match(/(\"text\":\"\d+京豆\")/)) {
                beanQuantity = cc.awardList[0].text.match(/\d+/)
                merge.JDFresh.notify = "京东商城-生鲜: 成功, 明细: " + beanQuantity + "京豆 🐶"
                merge.JDFresh.bean = beanQuantity
                merge.JDFresh.success = 1
              } else {
                merge.JDFresh.notify = "京东商城-生鲜: 成功, 明细: 无京豆 🐶"
                merge.JDFresh.success = 1
              }
            } else {
              console.log("\n" + "京东商城-生鲜签到失败 " + Details)
              if (data.match(/(已签到|已领取)/)) {
                merge.JDFresh.notify = "京东商城-生鲜: 失败, 原因: 已签过 ⚠️"
                merge.JDFresh.fail = 1
              } else {
                if (data.match(/(不存在|已结束|未开始)/)) {
                  merge.JDFresh.notify = "京东商城-生鲜: 失败, 原因: 活动已结束 ⚠️"
                  merge.JDFresh.fail = 1
                } else {
                  if (cc.code == 3) {
                    merge.JDFresh.notify = "京东商城-生鲜: 失败, 原因: Cookie失效‼️"
                    merge.JDFresh.fail = 1
                  } else if (cc.code == "600") {
                    merge.JDFresh.notify = "京东商城-生鲜: 失败, 原因: 认证失败 ⚠️"
                    merge.JDFresh.fail = 1
                  } else {
                    merge.JDFresh.notify = "京东商城-生鲜: 失败, 原因: 未知 ⚠️"
                    merge.JDFresh.fail = 1
                  }
                }
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-生鲜" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JdVegeMarket(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDVegeUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22:%22%7B%5C%22enActK%5C%22:%5C%229wKIMMJjQLbQFeZ6KQv0JbEX2oKhjh9BKL%2FwFlYdmeykrSc7efz3pYRcGhj8xJE3cRRfojzJNzK5%5C%5Cnv2OW2JAQGhOC%2FuFwv2wvFk0xY4qnbBXmTh4uRj8SyYb2DKr5q0sOGmbP5%2BHKCzc%3D%5C%22,%5C%22isFloatLayer%5C%22:true,%5C%22ruleSrv%5C%22:%5C%22%5C%22,%5C%22signId%5C%22:%5C%22VqLPnZPisRAaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%7D&client=wh5"
      };
      $nobyda.post(JDVegeUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDVege.notify = "京东商城-菜场: 签到接口请求失败 ‼️‼️"
            merge.JDVege.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-菜场签到成功 " + Details)
              if (data.match(/(\"text\":\"\d+京豆\")/)) {
                beanQuantity = cc.awardList[0].text.match(/\d+/)
                merge.JDVege.notify = "京东商城-菜场: 成功, 明细: " + beanQuantity + "京豆 🐶"
                merge.JDVege.bean = beanQuantity
                merge.JDVege.success = 1
              } else {
                merge.JDVege.notify = "京东商城-菜场: 成功, 明细: 无京豆 🐶"
                merge.JDVege.success = 1
              }
            } else {
              console.log("\n" + "京东商城-菜场签到失败 " + Details)
              if (data.match(/(已签到|已领取)/)) {
                merge.JDVege.notify = "京东商城-菜场: 失败, 原因: 已签过 ⚠️"
                merge.JDVege.fail = 1
              } else {
                if (data.match(/(不存在|已结束|未开始)/)) {
                  merge.JDVege.notify = "京东商城-菜场: 失败, 原因: 活动已结束 ⚠️"
                  merge.JDVege.fail = 1
                } else {
                  if (cc.code == 3) {
                    merge.JDVege.notify = "京东商城-菜场: 失败, 原因: Cookie失效‼️"
                    merge.JDVege.fail = 1
                  } else if (cc.code == "600") {
                    merge.JDVege.notify = "京东商城-菜场: 失败, 原因: 认证失败 ⚠️"
                    merge.JDVege.fail = 1
                  } else {
                    merge.JDVege.notify = "京东商城-菜场: 失败, 原因: 未知 ⚠️"
                    merge.JDVege.fail = 1
                  }
                }
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-菜场" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongFish(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDFishUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%22params%22%3A%22%7B%5C%22enActK%5C%22%3A%5C%22qJchoLWs7bvxQOMSpqSZ99X3StEgXQdxoR%2BHEL6%2Fl2saZs%2Fn4coLNw%3D%3D%5C%22%2C%5C%22isFloatLayer%5C%22%3Afalse%2C%5C%22ruleSrv%5C%22%3A%5C%2200675834_34279597_t1%5C%22%2C%5C%22signId%5C%22%3A%5C%22ErIXJCowWtEaZs%2Fn4coLNw%3D%3D%5C%22%7D%22%2C%22riskParam%22%3A%7B%22platform%22%3A%223%22%2C%22orgType%22%3A%222%22%2C%22openId%22%3A%22-1%22%2C%22pageClickKey%22%3A%22Babel_Sign%22%2C%22eid%22%3A%22%22%2C%22fp%22%3A%22%22%2C%22shshshfp%22%3A%22%22%2C%22shshshfpa%22%3A%22%22%2C%22shshshfpb%22%3A%22%22%2C%22childActivityUrl%22%3A%22https%3A%2F%2Fpro.m.jd.com%2Fmall%2Factive%2F2MeRtH9jYA9kY88GmgYr6njmcijM%2Findex.html%22%7D%2C%22mitemAddrId%22%3A%22%22%2C%22geo%22%3A%7B%22lng%22%3A%22%22%2C%22lat%22%3A%22%22%7D%2C%22addressId%22%3A%22%22%2C%22posLng%22%3A%22%22%2C%22posLat%22%3A%22%22%2C%22focus%22%3A%22%22%2C%22innerAnchor%22%3A%22%22%2C%22cv%22%3A%222.0%22%2C%22_mkjdcn%22%3A%22%22%7D&client=wh5"
      };
      $nobyda.post(JDFishUrl, function(error, response, data) {
        try {
          if (error) {
            merge.JDFish.notify = "京东商城-京鱼: 签到接口请求失败 ‼️‼️"
            merge.JDFish.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/签到成功/)) {
              console.log("\n" + "京东商城-京鱼签到成功 " + Details)
              if (data.match(/(\"text\":\"\d+京豆\")/)) {
                beanQuantity = cc.awardList[0].text.match(/\d+/)
                merge.JDFish.notify = "京东商城-京鱼: 成功, 明细: " + beanQuantity + "京豆 🐶"
                merge.JDFish.bean = beanQuantity
                merge.JDFish.success = 1
              } else {
                merge.JDFish.notify = "京东商城-京鱼: 成功, 明细: 无京豆 🐶"
                merge.JDFish.success = 1
              }
            } else {
              console.log("\n" + "京东商城-京鱼签到失败 " + Details)
              if (data.match(/(已签到|已领取)/)) {
                merge.JDFish.notify = "京东商城-京鱼: 失败, 原因: 已签过 ⚠️"
                merge.JDFish.fail = 1
              } else {
                if (data.match(/(不存在|已结束|未开始)/)) {
                  merge.JDFish.notify = "京东商城-京鱼: 失败, 原因: 活动已结束 ⚠️"
                  merge.JDFish.fail = 1
                } else {
                  if (cc.code == 3) {
                    merge.JDFish.notify = "京东商城-京鱼: 失败, 原因: Cookie失效‼️"
                    merge.JDFish.fail = 1
                  } else if (cc.code == "600") {
                    merge.JDFish.notify = "京东商城-京鱼: 失败, 原因: 认证失败 ⚠️"
                    merge.JDFish.fail = 1
                  } else {
                    merge.JDFish.notify = "京东商城-京鱼: 失败, 原因: 未知 ⚠️"
                    merge.JDFish.fail = 1
                  }
                }
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-京鱼" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongSpeedUp(s, id) {
  return new Promise(resolve => {
    setTimeout(() => {
      const GameUrl = {
        url: 'https://api.m.jd.com/?appid=memberTaskCenter&functionId=flyTask_' + (id ? 'start&body=%7B%22source%22%3A%22game%22%2C%22source_id%22%3A' + id + '%7D' : 'state&body=%7B%22source%22%3A%22game%22%7D'),
        headers: {
          Referer: 'https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html',
          Cookie: KEY
        }
      };
      $nobyda.get(GameUrl, async function(error, response, data) {
        try {
          if (error) {
            merge.SpeedUp.notify = "京东天天-加速: 签到接口请求失败 ‼️‼️"
            merge.SpeedUp.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            var cc = JSON.parse(data)
            if (!id) {
              var status = merge.SpeedUp.success ? "本次" : ""
              console.log("\n" + "天天加速-查询" + status + "任务中 " + Details)
            } else {
              console.log("\n" + "天天加速-开始本次任务 " + Details)
            }
            if (cc.message == "not login") {
              merge.SpeedUp.fail = 1
              merge.SpeedUp.notify = "京东天天-加速: 失败, 原因: Cookie失效‼️"
              console.log("\n天天加速-Cookie失效")
            } else if (cc.message == "success") {
              if (cc.data.task_status == 0 && cc.data.source_id) {
                const taskID = cc.data.source_id
                await JingDongSpeedUp(s, taskID)
              } else if (cc.data.task_status == 1) {
                if (!merge.SpeedUp.notify) merge.SpeedUp.fail = 1;
                if (!merge.SpeedUp.notify) merge.SpeedUp.notify = "京东天天-加速: 失败, 原因: 加速中 ⚠️";
                const EndTime = cc.data.end_time ? cc.data.end_time : ""
                console.log("\n天天加速-目前结束时间: \n" + EndTime)
                var step1 = await JDQueryTask(s)
                var step2 = await JDReceiveTask(s, step1)
                var step3 = await JDQueryTaskID(s, step2)
                var step4 = await JDUseProps(s, step3)
              } else if (cc.data.task_status == 2) {
                if (data.match(/\"beans_num\":\d+/)) {
                  merge.SpeedUp.notify = "京东天天-加速: 成功, 明细: " + data.match(/\"beans_num\":(\d+)/)[1] + "京豆 🐶"
                  merge.SpeedUp.bean = data.match(/\"beans_num\":(\d+)/)[1]
                } else {
                  merge.SpeedUp.notify = "京东天天-加速: 成功, 明细: 无京豆 🐶"
                }
                merge.SpeedUp.success = 1
                console.log("\n天天加速-领取上次奖励成功")
                await JingDongSpeedUp(s, null)
              } else {
                merge.SpeedUp.fail = 1
                merge.SpeedUp.notify = "京东天天-加速: 失败, 原因: 未知 ⚠️"
                console.log("\n" + "天天加速-判断状态码失败")
              }
            } else {
              merge.SpeedUp.fail = 1
              merge.SpeedUp.notify = "京东天天-加速: 失败, 原因: 未知 ⚠️"
              console.log("\n" + "天天加速-判断状态失败")
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东天天-加速" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDQueryTask(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      var TaskID = "";
      const QueryUrl = {
        url: 'https://api.m.jd.com/?appid=memberTaskCenter&functionId=energyProp_list&body=%7B%22source%22%3A%22game%22%7D',
        headers: {
          Referer: 'https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html',
          Cookie: KEY
        }
      };
      $nobyda.get(QueryUrl, async function(error, response, data) {
        try {
          if (error) {
            console.log("\n京东天天-加速: 查询道具请求失败 ‼️‼️")
          } else {
            const cc = JSON.parse(data)
            const Details = LogDetails ? "response:\n" + data : '';
            if (cc.message == "success" && cc.data.length > 0) {
              for (var i = 0; i < cc.data.length; i++) {
                if (cc.data[i].thaw_time == 0) {
                  TaskID += cc.data[i].id + ",";
                }
              }
              if (TaskID.length > 0) {
                TaskID = TaskID.substr(0, TaskID.length - 1).split(",")
                console.log("\n天天加速-查询到" + TaskID.length + "个有效道具" + Details)
              } else {
                console.log("\n天天加速-暂无有效道具" + Details)
              }
            } else {
              console.log("\n天天加速-查询无道具" + Details)
            }
          }
          resolve(TaskID)
        } catch (eor) {
          $nobyda.notify("天天加速-查询道具" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve(TaskID)
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDReceiveTask(s, CID) {
  return new Promise(resolve => {
    var NumTask = 0
    if (CID) {
      setTimeout(() => {
        var count = 0
        for (var i = 0; i < CID.length; i++) {
          const TUrl = {
            url: 'https://api.m.jd.com/?appid=memberTaskCenter&functionId=energyProp_gain&body=%7B%22source%22%3A%22game%22%2C%22energy_id%22%3A' + CID[i] + '%7D',
            headers: {
              Referer: 'https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html',
              Cookie: KEY
            }
          };
          $nobyda.get(TUrl, function(error, response, data) {
            try {
              count += 1
              if (error) {
                console.log("\n天天加速-领取道具请求失败 ‼️‼️")
              } else {
                const cc = JSON.parse(data)
                const Details = LogDetails ? "response:\n" + data : '';
                console.log("\n天天加速-尝试领取第" + count + "个道具" + Details)
                if (cc.message == 'success') {
                  NumTask += 1
                }
              }
              if (CID.length == count) {
                console.log("\n天天加速-已成功领取" + NumTask + "个道具")
                resolve(NumTask)
              }
            } catch (eor) {
              $nobyda.notify("天天加速-领取道具" + eor.name + "‼️", JSON.stringify(eor), eor.message)
              resolve(NumTask)
            }
          })
        }
      }, s)
      if (out) setTimeout(resolve, out + s)
    } else {
      resolve(NumTask)
    }
  });
}

function JDQueryTaskID(s, EID) {
  return new Promise(resolve => {
    var TaskCID = ""
    if (EID) {
      setTimeout(() => {
        const EUrl = {
          url: 'https://api.m.jd.com/?appid=memberTaskCenter&functionId=energyProp_usalbeList&body=%7B%22source%22%3A%22game%22%7D',
          headers: {
            Referer: 'https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html',
            Cookie: KEY
          }
        };
        $nobyda.get(EUrl, function(error, response, data) {
          try {
            if (error) {
              console.log("\n天天加速-查询道具ID请求失败 ‼️‼️")
            } else {
              const cc = JSON.parse(data)
              const Details = LogDetails ? "response:\n" + data : '';
              if (cc.data.length > 0) {
                for (var i = 0; i < cc.data.length; i++) {
                  if (cc.data[i].id) {
                    TaskCID += cc.data[i].id + ",";
                  }
                }
                if (TaskCID.length > 0) {
                  TaskCID = TaskCID.substr(0, TaskCID.length - 1).split(",")
                  console.log("\n天天加速-查询成功" + TaskCID.length + "个道具ID" + Details)
                } else {
                  console.log("\n天天加速-暂无有效道具ID" + Details)
                }
              } else {
                console.log("\n天天加速-查询无道具ID" + Details)
              }
            }
            resolve(TaskCID)
          } catch (eor) {
            $nobyda.notify("天天加速-道具ID" + eor.name + "‼️", JSON.stringify(eor), eor.message)
            resolve(TaskCID)
          }
        })
      }, s + 200)
      if (out) setTimeout(resolve, out + s)
    } else {
      resolve(TaskCID)
    }
  });
}

function JDUseProps(s, PropID) {
  return new Promise(resolve => {
    if (PropID) {
      setTimeout(() => {
        var PropCount = 0
        var PropNumTask = 0
        for (var i = 0; i < PropID.length; i++) {
          const PropUrl = {
            url: 'https://api.m.jd.com/?appid=memberTaskCenter&functionId=energyProp_use&body=%7B%22source%22%3A%22game%22%2C%22energy_id%22%3A%22' + PropID[i] + '%22%7D',
            headers: {
              Referer: 'https://h5.m.jd.com/babelDiy/Zeus/6yCQo2eDJPbyPXrC3eMCtMWZ9ey/index.html',
              Cookie: KEY
            }
          };
          $nobyda.get(PropUrl, function(error, response, data) {
            try {
              PropCount += 1
              if (error) {
                console.log("\n天天加速-使用道具请求失败 ‼️‼️")
              } else {
                const cc = JSON.parse(data)
                const Details = LogDetails ? "response:\n" + data : '';
                console.log("\n天天加速-尝试使用第" + PropCount + "个道具" + Details)
                if (cc.message == 'success' && cc.success == true) {
                  PropNumTask += 1
                }
              }
              if (PropID.length == PropCount) {
                console.log("\n天天加速-已成功使用" + PropNumTask + "个道具")
                resolve()
              }
            } catch (eor) {
              $nobyda.notify("天天加速-使用道具" + eor.name + "‼️", JSON.stringify(eor), eor.message)
              resolve()
            }
          })
        }
      }, s)
      if (out) setTimeout(resolve, out + s)
    } else {
      resolve()
    }
  });
}

function JingDongSubsidy(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const subsidyUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/uc/h5/m/signIn7',
        headers: {
          Referer: "https://active.jd.com/forever/cashback/index",
          Cookie: KEY
        }
      };
      $nobyda.get(subsidyUrl, function(error, response, data) {
        try {
          if (error) {
            merge.subsidy.notify = "京东商城-金贴: 签到接口请求失败 ‼️‼️"
            merge.subsidy.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/\"msg\":\"操作成功\"/)) {
              console.log("\n" + "京东商城-金贴签到成功 " + Details)
              merge.subsidy.success = 1
              if (data.match(/\"thisAmountStr\":\".+?\"/)) {
                var Quantity = data.match(/\"thisAmountStr\":\"(.+?)\"/)[1]
                merge.subsidy.notify = "京东商城-金贴: 成功, 明细: " + Quantity + "金贴 💰"
              } else {
                merge.subsidy.notify = "京东商城-金贴: 成功, 明细: 无金贴 💰"
              }
            } else {
              console.log("\n" + "京东商城-金贴签到失败 " + Details)
              merge.subsidy.fail = 1
              if (data.match(/已存在/)) {
                merge.subsidy.notify = "京东商城-金贴: 失败, 原因: 已签过 ⚠️"
              } else if (data.match(/请先登录/)) {
                merge.subsidy.notify = "京东商城-金贴: 失败, 原因: Cookie失效‼️"
              } else {
                merge.subsidy.notify = "京东商城-金贴: 失败, 原因: 未知 ⚠️"
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-金贴" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingRongDoll(s, type, num) {
  return new Promise(resolve => {
    setTimeout(() => {
      const DollUrl = {
        url: "https://nu.jr.jd.com/gw/generic/jrm/h5/m/process",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY
        },
        body: "reqData=%7B%22actCode%22%3A%22890418F764%22%2C%22type%22%3A" + (type ? type : "3") + "%7D"
      };
      $nobyda.post(DollUrl, async function(error, response, data) {
        try {
          if (error) {
            merge.JRDoll.notify = "京东金融-娃娃: " + (type ? "签到" : "领取") + "接口请求失败 ‼️‼️"
            merge.JRDoll.fail = 1
          } else {
            var cc = JSON.parse(data)
            const Details = LogDetails ? "response:\n" + data : '';
            if (cc.resultCode == 0) {
              if (cc.resultData.data.businessData != null) {
                console.log("\n" + "京东金融-娃娃登录成功 " + Details)
                if (cc.resultData.data.businessData.pickStatus == 2) {
                  if (data.match(/\"rewardPrice\":\"?(\d+)/)) {
                    var JRDoll_bean = data.match(/\"rewardPrice\":\"?(\d+)/)[1]
                    await JingRongDoll(s, "4", JRDoll_bean)
                  } else {
                    merge.JRDoll.success = 1
                    merge.JRDoll.notify = "京东金融-娃娃: 成功, 明细: 无京豆 🐶"
                  }
                } else {
                  console.log("\n" + "京东金融-娃娃签到失败 " + Details)
                  merge.JRDoll.notify = "京东金融-娃娃: 失败, 原因: 已签过 ⚠️";
                  merge.JRDoll.fail = 1
                }
              } else if (cc.resultData.data.businessCode == 200) {
                console.log("\n" + "京东金融-娃娃签到成功 " + Details)
                merge.JRDoll.bean = num ? num : 0
                merge.JRDoll.success = num ? 1 : 0
                merge.JRDoll.notify = "京东金融-娃娃: 成功, 明细: " + (num ? num + "京豆 🐶" : "无京豆 🐶")
              } else {
                console.log("\n" + "京东金融-娃娃签到异常 " + Details)
                merge.JRDoll.fail = 1;
                merge.JRDoll.notify = "京东金融-娃娃: 失败, 原因: 领取异常 ⚠️";
              }
            } else if (cc.resultCode == 3) {
              console.log("\n" + "京东金融-娃娃签到失败 " + Details)
              merge.JRDoll.notify = "京东金融-娃娃: 失败, 原因: Cookie失效‼️"
              merge.JRDoll.fail = 1;
            } else {
              console.log("\n" + "京东金融-娃娃判断失败 " + Details)
              merge.JRDoll.notify = "京东金融-娃娃: 失败, 原因: 未知 ⚠️"
              merge.JRDoll.fail = 1;
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东金融-娃娃" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDOverseas(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const OverseasUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=checkin',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: KEY,
        },
        body: "body=%7B%7D&build=167237&client=apple&clientVersion=9.0.0&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&partner=apple&scope=11&sign=e27f8b904040a0e3c99b87fc27e09c87&st=1591730990449&sv=101"
      };
      $nobyda.post(OverseasUrl, function(error, response, data) {
        try {
          if (error) {
            merge.Overseas.notify = "京东商城-国际: 签到接口请求失败 ‼️‼️"
            merge.Overseas.fail = 1
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            if (data.match(/\"type\":\d+?,/)) {
              console.log("\n" + "京东商城-国际签到成功 " + Details)
              merge.Overseas.success = 1
              if (data.match(/\"jdBeanAmount\":[1-9]+/)) {
                merge.Overseas.bean = data.match(/\"jdBeanAmount\":(\d+)/)[1]
                merge.Overseas.notify = "京东商城-国际: 成功, 明细: " + merge.Overseas.bean + "京豆 🐶"
              } else {
                merge.Overseas.notify = "京东商城-国际: 成功, 明细: 无京豆 🐶"
              }
            } else {
              console.log("\n" + "京东商城-国际签到失败 " + Details)
              merge.Overseas.fail = 1
              if (data.match(/(\"code\":\"13\"|重复签到)/)) {
                merge.Overseas.notify = "京东商城-国际: 失败, 原因: 已签过 ⚠️"
              } else if (data.match(/\"code\":\"-1\"/)) {
                merge.Overseas.notify = "京东商城-国际: 失败, 原因: Cookie失效‼️"
              } else {
                merge.Overseas.notify = "京东商城-国际: 失败, 原因: 未知 ⚠️"
              }
            }
          }
          resolve()
        } catch (eor) {
          $nobyda.notify("京东商城-国际" + eor.name + "‼️", JSON.stringify(eor), eor.message)
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function TotalSteel() {
  return new Promise(resolve => {
    const SteelUrl = {
      url: 'https://coin.jd.com/m/gb/getBaseInfo.html',
      headers: {
        Cookie: KEY,
      }
    };
    $nobyda.get(SteelUrl, function(error, response, data) {
      try {
        if (!error) {
          const Details = LogDetails ? "response:\n" + data : '';
          if (data.match(/(\"gbBalance\":\d+)/)) {
            console.log("\n" + "京东-总钢镚查询成功 " + Details)
            const cc = JSON.parse(data)
            merge.JRSteel.TSteel = cc.gbBalance
          } else {
            console.log("\n" + "京东-总钢镚查询失败 " + Details)
          }
        } else {
          console.log("\n" + "京东-总钢镚查询请求失败 ")
        }
        resolve()
      } catch (eor) {
        $nobyda.notify("钢镚接口" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  });
}

function TotalBean() {
  return new Promise(resolve => {
    const BeanUrl = {
      url: 'https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2',
      headers: {
        Cookie: KEY,
        Referer: "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2"
      }
    };
    $nobyda.post(BeanUrl, function(error, response, data) {
      try {
        if (!error) {
          const Details = LogDetails ? "response:\n" + data : '';
          const cc = JSON.parse(data)
          if (cc.base.jdNum != 0) {
            console.log("\n" + "京东-总京豆查询成功 " + Details)
            merge.JDShake.Qbear = cc.base.jdNum
          } else {
            console.log("\n" + "京东-总京豆查询失败 " + Details)
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
        resolve()
      } catch (eor) {
        $nobyda.notify("京豆接口" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  });
}

function TotalCash() {
  return new Promise(resolve => {
    const CashUrl = {
      url: 'https://api.m.jd.com/client.action?functionId=myhongbao_balance',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: KEY,
      },
      body: "body=%7B%22fp%22%3A%22-1%22%2C%22appToken%22%3A%22apphongbao_token%22%2C%22childActivityUrl%22%3A%22-1%22%2C%22country%22%3A%22cn%22%2C%22openId%22%3A%22-1%22%2C%22childActivityId%22%3A%22-1%22%2C%22applicantErp%22%3A%22-1%22%2C%22platformId%22%3A%22appHongBao%22%2C%22isRvc%22%3A%22-1%22%2C%22orgType%22%3A%222%22%2C%22activityType%22%3A%221%22%2C%22shshshfpb%22%3A%22-1%22%2C%22platformToken%22%3A%22apphongbao_token%22%2C%22organization%22%3A%22JD%22%2C%22pageClickKey%22%3A%22-1%22%2C%22platform%22%3A%221%22%2C%22eid%22%3A%22-1%22%2C%22appId%22%3A%22appHongBao%22%2C%22childActiveName%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22extend%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22activityArea%22%3A%22-1%22%2C%22childActivityTime%22%3A%22-1%22%7D&client=apple&clientVersion=8.5.0&d_brand=apple&networklibtype=JDNetworkBaseAF&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=fdc04c3ab0ee9148f947d24fb087b55d&st=1581245397648&sv=120"
    };
    $nobyda.post(CashUrl, function(error, response, data) {
      try {
        if (!error) {
          const Details = LogDetails ? "response:\n" + data : '';
          if (data.match(/(\"totalBalance\":\d+)/)) {
            console.log("\n" + "京东-总红包查询成功 " + Details)
            const cc = JSON.parse(data)
            merge.JDCash.TCash = cc.totalBalance
          } else {
            console.log("\n" + "京东-总红包查询失败 " + Details)
          }
        } else {
          console.log("\n" + "京东-总红包查询请求失败 ")
        }
        resolve()
      } catch (eor) {
        $nobyda.notify("红包接口" + eor.name + "‼️", JSON.stringify(eor), eor.message)
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  });
}

function initial() {
  merge = {
    SpeedUp: {},
    JDBean: {},
    JDTurn: {},
    JRBean: {},
    JRDoll: {},
    JRDSign: {},
    JDGStore: {},
    JDClocks: {},
    JDPet: {},
    JDFSale: {},
    JDBook: {},
    JDShand: {},
    JDMakeup: {},
    Overseas: {},
    JDWomen: {},
    JRGame: {},
    JRSeeAds: {},
    JDLive: {},
    JDCare: {},
    JDFood: {},
    JDClean: {},
    JDVege: {},
    JDFresh: {},
    JDJewels: {},
    JDFish: {},
    JDCube: {},
    JDPrize: {},
    JRSteel: {},
    subsidy: {},
    JDCash: {},
    JDShake: {}
  }
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
}

function GetCookie() {
  try {
    if ($request.headers && $request.url.match(/api\.m\.jd\.com.*=signBean/)) {
      var CV = $request.headers['Cookie']
      if (CV.match(/(pt_key=.+?pt_pin=|pt_pin=.+?pt_key=)/)) {
        var CookieValue = CV.match(/pt_key=.+?;/) + CV.match(/pt_pin=.+?;/)
        var CK1 = $nobyda.read("CookieJD")
        var CK2 = $nobyda.read("CookieJD2")
        var AccountOne = CK1 ? CK1.match(/pt_pin=.+?;/) ? CK1.match(/pt_pin=(.+?);/)[1] : null : null
        var AccountTwo = CK2 ? CK2.match(/pt_pin=.+?;/) ? CK2.match(/pt_pin=(.+?);/)[1] : null : null
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
          $nobyda.done()
          return
        }
      } else {
        $nobyda.notify("写入京东Cookie失败", "", "请查看脚本内说明, 登录网页获取 ‼️")
        $nobyda.done()
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
    $nobyda.write("", "CookieJD")
    $nobyda.write("", "CookieJD2")
    $nobyda.notify("写入京东Cookie失败", "", '已尝试清空历史Cookie, 请重试 ⚠️')
    console.log(JSON.stringify(eor) + "\n" + eor + "\n" + JSON.stringify($request.headers))
  }
  $nobyda.done()
}
// Modified from yichahucha
function nobyda() {
  const start = Date.now()
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
  const isNode = typeof require == "function" && !isJSBox;
  const node = (() => {
    if (isNode) {
      const request = require('request');
      return ({
        request
      })
    } else {
      return (null)
    }
  })()
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message)
    if (isNode) log(title + subtitle + message)
    if (isJSBox) $push.schedule({
      title: title,
      body: subtitle ? subtitle + "\n" + message : message
    })
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
      if (typeof options == "string") options = {
        url: options
      }
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
      if (typeof options == "string") options = {
        url: options
      }
      options["header"] = options["headers"]
      options["handler"] = function(resp) {
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
      if (typeof options == "string") options = {
        url: options
      }
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
      if (typeof options == "string") options = {
        url: options
      }
      options["header"] = options["headers"]
      options["handler"] = function(resp) {
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
  const time = () => {
    const end = ((Date.now() - start) / 1000).toFixed(2)
    return console.log('\n签到用时: ' + end + ' 秒')
  }
  const done = (value = {}) => {
    if (isQuanX) isRequest ? $done(value) : null
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    isRequest,
    isJSBox,
    isNode,
    notify,
    write,
    read,
    get,
    post,
    log,
    time,
    done
  }
};
ReadCookie();