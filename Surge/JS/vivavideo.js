/*
小影 解锁高级功能 

***************************
QuantumultX:

[rewrite_local]
^https:\/\/api-use\.intsvs\.com\/api\/rest\/u\/vipVerifyReceipt url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/vivavideo.js

[mitm]
hostname = api-use.intsvs.com

***************************
Surge4 or Loon:

[Script]
http-response ^https:\/\/api-use\.intsvs\.com\/api\/rest\/u\/vipVerifyReceipt requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/vivavideo.js

[MITM]
hostname = api-use.intsvs.com

**************************/

var obj = JSON.parse($response.body);
obj = {
  "autoRenewProductId": "premium_platinum_yearly",
  "iosDeviceProductVo": {
    "premiumVipWeekly": 3,
    "premiumGoldMonthly": 3,
    "premiumPlatinumMonthly": 3,
    "premiumGoldYearly": 3,
    "premiumPlatinumYearly": 2,
    "premiumPlatinumHalfYearly": 3,
    "premiumVipYearly": 3
  },
  "isTrialPeriod": true,
  "endTime": 4081109070000,
  "platform": 2,
  "vipType": "premium_platinum_yearly",
  "duidDgest": "DIIe86X35",
  "autoRenewStatus": 1,
  "startTime": 1556241871000,
  "systemDate": 1556965441014
};

$done({body: JSON.stringify(obj)});