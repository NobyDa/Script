#!name= 🐻 NobyDa签到脚本
#!desc= 包括哔哩漫画、贴吧、快看、爱奇艺，携程旅行、巴哈姆特。部分脚本获取Cookie方法请看脚本注释。注意，该Loon链接目前仅适用于"订阅脚本"，非"插件"。添加脚本订阅后请按需启用脚本。
#!author= NobyDa
#!homepage= https://github.com/NobyDa/Script/tree/master
#!icon= https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png


[Script]
cron "30 8 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Ctrip-DailyBonus/Ctrip.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/ctrip.png, timeout=300, enabled=false, tag=携程旅行 [签到]

http-response ^https:\/\/m\.ctrip\.com\/restapi\/soa2\/\d+\/[a-zA-Z]+Login(?:$|\?) script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Ctrip-DailyBonus/Ctrip.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/ctrip.png, requires-body=true, enabled=false, tag=携程旅行 [Cookie]


cron "10 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/iQIYI-DailyBonus/iQIYI.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/iQIYI.png, timeout=300, enabled=false, tag=爱奇艺 [会员签到]

http-request ^https:\/\/passport\.iqiyi\.com\/apis\/user\/ script-path=https://raw.githubusercontent.com/NobyDa/Script/master/iQIYI-DailyBonus/iQIYI.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/iQIYI.png, enabled=false, tag=爱奇艺 [Cookie]


cron "0 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/Manga.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/manga.png, timeout=300, enabled=false, tag=哔哩漫画 [签到]

http-request ^https:\/\/app\.bilibili\.com\/x\/v2\/account\/myinfo script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/Manga.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/manga.png, enabled=false, tag=哔哩漫画 [Cookie]


cron "40 8 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/BDTieBa-DailyBonus/TieBa.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/tieba.png, timeout=300, enabled=false, tag=百度贴吧 [签到]

http-request ^https?:\/\/(c\.tieba|tiebac)\.baidu\.com\/c\/s\/login script-path=https://raw.githubusercontent.com/NobyDa/Script/master/BDTieBa-DailyBonus/TieBa.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/tieba.png, enabled=false, tag=百度贴吧 [Cookie]


cron "10 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/KuaiKan.png, timeout=300, enabled=false, tag=快看漫画 [签到]

http-request ^https?:\/\/api\.kkmh\.com\/v\d\/passport\/user script-path=https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/KuaiKan.png, enabled=false, tag=快看漫画 [Cookie]


cron "20 8 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Bahamut/BahamutDailyBonus.js, img-url=https://raw.githubusercontent.com/NobyDa/mini/master/Color/bahamutGame.png, timeout=300, enabled=false, tag=巴哈姆特 [签到]


[MITM]
hostname = passport.iqiyi.com, app.bilibili.com, c.tieba.baidu.com, tiebac.baidu.com, api.kkmh.com, m.ctrip.com