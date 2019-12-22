/*
^https://app.bilibili.com/x/resource/show/tab\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliTab.js
^https://app.bilibili.com/x/v2/feed/index\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliFeed.js
^https://app.bilibili.com/x/v2/account/mine\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliAccount.js
^https://app.bilibili.com/x/v2/view\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliViewRelate.js
^https://app.bilibili.com/x/v2/rank url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliRank.js
^https://api.bilibili.com/x/v2/reply/main\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliReply.js
^https://app.bilibili.com/x/v2/show/popular/index\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliHot.js

mitm = ap*.bilibili.com

by onewayticket255
*/

let blacklist=['共青团中央','广东共青团','浙江共青团','山东共青团','安徽共青团','河南共青团','央视频','徐大sao','翔翔大作战','徐大虾咯','科技美学','敬汉卿','NathanRich火锅大王','千户长生']

let body = $response.body
body=JSON.parse(body)
body['data'].forEach((element, index)=> {
   if(blacklist.includes(element['right_desc_1'])||element["card_type"] !== "small_cover_v5"){ 
         body['data'].splice(index,1)  
    }
})
body=JSON.stringify(body)
$done({body})