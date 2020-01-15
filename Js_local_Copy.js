hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com, mp.weixin.qq.com, api.bilibili.com, app.bilibili.com, *.zhihu.com, aweme*.snssdk.com, *.kuwo.cn, ios.xiaoxiaoapps.com, api*.tiktokv.com, *.musical.ly, *.amemv.com, p.du.163.com, getuserinfo.321mh.com, getuserinfo-globalapi.zymk.cn, ios.fuliapps.com, vsco.co, api.vnision.com, *.my10api.com, sp.kaola.com, r.inews.qq.com, apple.fuliapps.com, newdrugs.dxy.cn, app101.avictown.cc, api.hlo.xyz, api.ijo.xyz, www.luqijianggushi.com, account.wps.cn, u.kanghuayun.com, api.gyrosco.pe, api1.dobenge.cn, api.mvmtv.com, mitaoapp.yeduapp.com, origin-prod-phoenix.jibjab.com, www.3ivf.com, pay.guoing.com, api.termius.com, api.bjxkhc.com, viva.v21xy.com, dida365.com, ticktick.com, biz.caiyunapp.com, api.gotokeep.com, ap*.intsig.net, mp.bybutter.com, api.vuevideo.net, api.picsart.c*, api.meiease.c*, splice.oracle.*.com, ios.xiangjiaoapps.com, apple.xiangjiaoapps.com,  spclient.wg.spotify.com, avatar-nct.nixcdn.com,  spclient.wg.spotify.com, oa.zalo.me, vsco.co, api.gyrosco.pe, origin-prod-phoenix.jibjab.com, api.termius.com, api.picsart.c*, api.meiease.c*, api.unfold.app, viva-asia1.vvbrd.com, graph.nhaccuatui.com, api.memrise.com , buy.itunes.apple.com, api.sync.me, pool.elsanow.io, lambda.us-east-1.amazonaws.com, api.mondlylanguages.com, api.busuu.com, owa.videoshowiosglobalserver.com:0, accounts.elevateapp.net, purchases.ws.pho.to, api-intl.mr.meitu.com, bmall.camera360.com, api.tv.zing.vn, api.calm.com, www.calm.com, api.global.mp3.zing.vn, apimboom2.globaldelight.net, photos.adobe.io, license.pdfexpert.com, subs.platforms.team, apic.musixmatch.com, api.getmimo.com, api.revenuecat.com, engbright.com, api.lingokids.com, www.peacefulsoundsapp.com, duolingo-leaderboards-prod.duolingo.com, commerce-i18n-api.faceu.mobi, mobile-api.adguard.com, api.blinkist.com, api.sololearn.com, api-kinemaster-assetstore.nexstreaming.com, api.pushover.net, ap*.intsig.net, api.overhq.com, receipt-validator.herewetest.com, lcs-mobile-cops.adobe.io, education.github.com, backend.getdrafts.com, ssl-api.itranslateapp.com, sk.ulysses.app, dayone.me, license.enpass.io, mp.bybutter.com, *.grammarly.com, splice.oracle.*.com, api.keepkeep.com, planner5d.com, secure.istreamer.com, vipapi.jxedt.com, pan.baidu.com, api.interpreter.caiyunai.com, pocketlists.com, vira.llsapp.com, book.haitunwallet.com, mubu.com, app.xunjiepdf.com, raw.githubusercontent.com, *.github.io,  api.tophub.today, api.rr.tv, duuuuuumiaow.yiyongcad.com, api.lennou.com, api.gkocr.com, mjapp.whetyy.com, api.m.jd.com, seining.com, api.bilibili.com, music.163.com, c.tieba.baidu.com, ios.prod.ftl.netflix. *.iqiyi.com, *.smzdm.com, *.v2ex.com, www.52pojie.cn, api.bjxkhc.com, *.bilibili.com, trade-acs.m.taobao.com, amdc.m.taobao.com, *.feng.com, *.video.qq.com, *.acfun.cn, *.zmz2019.com, mobwsa.ximalaya.com, *.rr.tv, www.flyertea.com, *.weixinjia.net, wapside.189.cn, mjapp.anlujia.com



##NobyDa

# 去微博应用内广告 (By yichahucha)
^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|\!/photos/pic_recommend_status) url script-response-body Xirou/NobyDa/QuantumultX/File/wb_ad.js
^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) url script-response-body Xirou/NobyDa/QuantumultX/File/wb_launch.js

# 去微信公众号广告 (By Choler)
^https?:\/\/mp\.weixin\.qq\.com\/mp\/getappmsgad url script-response-body Xirou/NobyDa/QuantumultX/File/Wechat.js

# 知乎去广告 (By onewayticket255)
^https://api.zhihu.com/moments\?(action|feed_type) url script-response-body Xirou/NobyDa/Surge/JS/Zhihu-ad-feed.js
^https://api.zhihu.com/topstory/recommend url script-response-body Xirou/NobyDa/Surge/JS/Zhihu-ad-recommend.js
^https://api.zhihu.com/.*/questions url script-response-body Xirou/NobyDa/Surge/JS/Zhihu-ad-answer.js
^https://api.zhihu.com/market/header url script-response-body Xirou/NobyDa/Surge/JS/Zhihu-ad-market.js

# 哔哩哔哩动画去广告 (By onewayticket255)
;^https://app.bilibili.com/x/resource/show/tab\?access_key url script-response-body NobyDa/QuantumultX/File/bilibiliTab.js
;^https://app.bilibili.com/x/v2/feed/index\?access_key url script-response-body NobyDa/QuantumultX/File/bilibiliFeed.js
;^https://app.bilibili.com/x/v2/account/mine\?access_key url script-response-body NobyDa/QuantumultX/File/bilibiliAccount.js
;^https://app.bilibili.com/x/v2/view\?access_key url script-response-body NobyDa/QuantumultX/File/bilibiliViewRelate.js
;^https://app.bilibili.com/x/v2/rank url script-response-body NobyDa/QuantumultX/File/bilibiliRank.js
;^https://api.bilibili.com/x/v2/reply/main\?access_key url script-response-body NobyDa/QuantumultX/File/bilibiliReply.js
;^https://app.bilibili.com/x/v2/show/popular/index\?access_key url script-response-body NobyDa/QuantumultX/File/bilibiliHot.js

# 抖音去广告去水印 (By Choler)
^https://aweme-eagle(.*)\.snssdk\.com\/aweme/.+/(feed|aweme/post|follow/feed)/ url script-response-body Xirou/NobyDa/Surge/JS/Aweme.js

# 酷我音乐SVIP (By yxiaocai)
^https?:\/\/vip1\.kuwo\.cn\/(vip\/v2\/user\/vip|vip\/spi/mservice) url script-response-body Xirou/NobyDa/Surge/JS/Kuwo.js
^https?:\/\/musicpay\.kuwo\.cn\/music\.pay\?uid\=\d+ url 302 http://musicpay.kuwo.cn/music.pay?uid=1

# 小小影视Vip (By Meeta)
https:\/\/ios\.xiaoxiaoapps\.com\/(vod\/reqplay\/|ucp/index|getGlobalData) url script-response-body Xirou/NobyDa/QuantumultX/File/xxys.js

# tiktok封区解锁去水印
(.*video_id=\w{32})(.*watermark=)(.*) url 302 $1
(?<=(carrier|account|sys)_region=)CN url 307 KR
(?<=version_code=)\d{1,}.\d{1}\.\d{1} url 307 8.0.0

# 爱美剧Vip (by huihui）(官网：app.meiju2018.com)
;^https?:\/\/api.bjxkhc.com\/index\.php\/app\/ios\/(vod\/show|(user|vod|topic|type)\/index) url script-response-body Xirou/NobyDa/QuantumultX/File/aimeiju.js
# 广告
^https?://api.bjxkhc.com/index.php/app/ios/ads/index url reject-dict
^https?://api.bjxkhc.com/index.php/app/ios/ver/index_ios$ url reject
^https?://api.bjxkhc.com/index.php/app/ios/pay/ok$ url reject-dict

# 网易蜗牛读书VIP (By yxiaocai and JO2EY)
^https?://p\.du\.163\.com/readtime/info.json url reject
^https?:\/\/p\.du\.163\.com\/gain\/readtime\/info\.json url script-response-body Xirou/NobyDa/QuantumultX/File/wnyd.js

# 看漫画极速版vip (By HoGer)
^https?:\/\/getuserinfo\.321mh\.com\/app_api\/v5\/getuserinfo\/ url script-response-body Xirou/NobyDa/QuantumultX/File/kmh.js

# 知音漫客VIP (By mieqq)
^https://getuserinfo-globalapi.zymk.cn/app_api/v5/(getuserinfo|coin_account|getuserinfo_ticket|getcomicinfo)/ url script-response-body Xirou/NobyDa/QuantumultX/File/Zymh.js

# 网易漫画去开屏广告
^https://api-163.biliapi.net/cover url reject-img

# 哔哩哔哩番剧开启1080P+
^https?:\/\/api\.bilibili\.com\/pgc\/player\/api\/playurl url script-response-body Xirou/NobyDa/QuantumultX/File/bilifj.js

# VSCO滤镜VIP
^https?:\/\/vsco\.co\/api\/subscriptions\/2.1\/user-subscriptions\/ url script-response-body Xirou/NobyDa/QuantumultX/File/vsco.js

# 大片-视频编辑器 VIP
^https?:\/\/api\.vnision\.com\/v1\/(users\/|banners) url script-response-body Xirou/NobyDa/QuantumultX/File/dapian.js

# 91短视频
^https?:\/\/.+\.(my10api|(.*91.*))\.(com|tips|app|xyz)(:\d{2,5})?\/api.php$ url script-response-body Xirou/NobyDa/QuantumultX/File/91.js

# 布丁漫畫（蜜桃漫画）VIP (app已黄)
#^https?:\/\/(bd|bdapp|mitaoapp)\.(4008109966|yeduapp)\.(net|com)\/\/index\.php\/api\/User\/userLogin url script-response-body Xirou/NobyDa/QuantumultX/File/bdmh.js

# 网易考拉 去广告 (By Choler)
^https://sp\.kaola\.com/api/openad$ url script-response-body Xirou/NobyDa/QuantumultX/File/wykaola.js

# 腾讯新闻 去广告 (By Choler)
^https://r\.inews\.qq.com\/get(QQNewsUnreadList|RecommendList) url script-response-body Xirou/NobyDa/Surge/JS/QQNews.js

# 香蕉视频VIP (By Meeta)
^https?:\/\/(ios|apple)\.(fuli|xiangjiao)apps\.com\/(ucp\/index|getGlobalData|vod\/reqplay\/) url script-response-body Xirou/NobyDa/QuantumultX/File/xjsp.js

# 用药助手解锁专业版 (By Primovist)
^https?:\/\/(i|newdrugs)\.dxy\.cn\/(snsapi\/username\/|app\/user\/(pro\/stat\?|init\?timestamp=)) url script-response-body Xirou/NobyDa/Surge/JS/yyzs.js

# 优乐美, 小米粒, 彩色直播三合一 解锁收费房
^https?:\/\/(.+)\.(\w{2,3})(:?\d*)\/(api\/public\/\?service=Live\.checkLive$|public\/\/\?service=Live\.roomCharge$|lg\/video\/loadVideoFees\.do$) url script-response-body Xirou/NobyDa/Surge/JS/zhibo.js

# 陆琪讲故事
^https:\/\/www\.luqijianggushi\.com\/api\/v2\/user\/get url script-response-body Xirou/NobyDa/Surge/JS/luqi.js

# WPS (By eHpo)
^https://account.wps.cn/api/users/ url script-response-body Xirou/NobyDa/Surge/JS/Wps.js

# Gyroscope 解锁 pro (By Maasea)
^https:\/\/api\.gyrosco\.pe\/v1\/account\/$ url script-response-body Xirou/NobyDa/Surge/JS/gyroscope.js

# 水印精灵 vip (By Alex0510)
^https:\/\/api1\.dobenge\.cn\/api\/user\/getuserinfo url script-response-body Xirou/NobyDa/Surge/JS/syjl.js

# 大千视界
^https:\/\/api\.mvmtv\.com\/index\.php.*(c=user.*a=info|a=addr.*vid=.*) url script-response-body Xirou/NobyDa/Surge/JS/dqsj.js

# JibJab解锁pro
^https:\/\/origin-prod-phoenix\.jibjab\.com\/v1\/user url script-response-body Xirou/NobyDa/Surge/JS/jibjab.js

# 南瓜电影4.7.3版 解锁VIP
^https:\/\/(p\.doras\.api\.vcinema\.cn|pay\.guoing\.com)\/(v5\.0\/user\/\d+$|d\/user\/get_user_info) url script-response-body Xirou/NobyDa/Surge/JS/ngdy.js

# Termius 解锁本地pro  (By Maasea)
https:\/\/api\.termius\.com\/api\/v3\/bulk\/account\/ url script-response-body Xirou/NobyDa/Surge/JS/Termius.js

# 小影 解锁Vip (By @hiepkimcdtk55)
^https:\/\/viva\.v21xy\.com\/api\/rest\/u\/vip url script-response-body Xirou/NobyDa/Surge/JS/vivavideo.js

# 滴答清单 pro
^https:\/\/(ticktick|dida365)\.com\/api\/v2\/user\/status url script-response-body Xirou/NobyDa/QuantumultX/File/DiDaQingDan.js

# 彩云天气 Vip
^https:\/\/biz\.caiyunapp\.com\/v2\/user\?app_name\=weather url script-response-body Xirou/NobyDa/QuantumultX/File/ColorWeather.js

# Keep 解锁私人课程和动作库 (QX存在bug 该脚本可能无法生效)
^https:\/\/api\.gotokeep\.com\/(.+\/subject|.+\/dynamic) url script-response-body Xirou/NobyDa/Surge/JS/Keep.js

# 扫描全能王 pro
^https:\/\/(api|api-cs)\.intsig\.net\/purchase\/cs\/query_property\? url script-response-body Xirou/NobyDa/Surge/JS/CamScanner.js

# VUE pro
^https:\/\/api\.vuevideo\.net\/api\/v1\/(users\/.+\/profile|subtitle\/prepare) url script-response-body Xirou/NobyDa/Surge/JS/VUE.js

# NiChi 解锁素材
^https?:\/\/mp\.bybutter\.com\/mood\/(official-templates|privileges) url script-response-body Xirou/NobyDa/Surge/JS/NiChi.js

# PicsArt美易 pro
^https:\/\/api\.(picsart|meiease)\.c(n|om)\/users\/show\/me\.json url script-response-body Xirou/NobyDa/Surge/JS/PicsArt.js

# Splice 视频编辑器 pro
^https:\/\/splice\.oracle\.\w+\.com\/devices\/me url script-response-body Xirou/NobyDa/Surge/JS/Splice.js

# 动画疯 去广告
https:\/\/api\.gamer\.com\.tw\/mobile_app\/anime\/(v3\/token\.php|v1\/video\.php) url script-request-header Xirou/NobyDa/Surge/JS/Bahamut.js
https:\/\/api\.gamer\.com\.tw\/mobile_app\/anime\/(v3\/token\.php|v1\/video\.php) url script-response-body Xirou/NobyDa/Surge/JS/Bahamut.js



#越南老哥langkhach270389


# vsco
^https?:\/\/vsco\.co\/api\/subscriptions\/2.1\/user-subscriptions\/ url script-response-body Xirou/langkhach/vsco.js

# gyroscope
^https:\/\/api\.gyrosco\.pe\/v1\/account\/$ url script-response-body Xirou/langkhach/Gyroscope.vip.js

# Termius 
https:\/\/api\.termius\.com\/api\/v3\/bulk\/account\/ url script-response-body Xirou/langkhach/Terminus.js

# PicsArt
^https:\/\/api\.(picsart|meiease)\.c(n|om)\/users\/show\/me\.json url script-response-body Xirou/langkhach/picsArt.vip.js

#Vivavideo
^https:\/\/viva-asia1\.vvbrd\.com\/api\/rest\/u\/vip* url script-response-body Xirou/langkhach/vivavideo.vip.js

#Undfold
^https:\/\/api\.unfold\.app\/v1\/ios\/receipts$ url script-response-body Xirou/langkhach/Unfold.vip.js

#Nhaccuatui
^https:\/\/graph\.nhaccuatui\.com\/.*\/users\/info* url script-response-body Xirou/langkhach/nhaccuatui.js

#Memrise
^https:\/\/api\.memrise\.com\/.+\/(me\/$|dashboard\/$|leaderboards\/following\/) url script-response-body Xirou/langkhach/memrise.vip.js

# Jibjab
^https:\/\/origin-prod-phoenix\.jibjab\.com\/v1\/user$ url script-response-body Xirou/langkhach/jibjab.vip.js

#buyhack
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body Xirou/langkhach/verify_receipt.js

#sync
^https:\/\/api\.sync\.me\/api\/purchases\/(report_purchases|get_purchases)  url script-response-body Xirou/langkhach/syn.me.js

#elsaresponse
^https:\/\/pool\.elsanow\.io\/user\/api\/v1\/purchase$ url script-response-body Xirou/langkhach/elsa-response.js

#elsarewrite
^https:\/\/pool\.elsanow\.io\/content\/api\/v1\/modules\/download$  url request-header (\r\n)x-session-token:.+(\r\n) request-header $1x-session-token: F3S0w0bysBQFdbjtxpFurrFv2ItBBcBkVQxUddQW+9vjt2JXM751ksqq5GAWpkl+kk9nhig9BGh9JhYHQaokmendY6zLZDscHiRkZD2HrdJclKVCLordAARJhYIrf5C+5OSK6ax2TA45CKi8S09FEtYXN4noXO7gt42NT6WPIv6DKhdIwVxQuIAMLU5abmpMTDlyWeI4ulBWcOQbuZWWZg==

#drops
^https:\/\/lambda\.us-east-1\.amazonaws\.com/.*/functions\/prod-4-syncPurchases\/invocations$ url script-response-body Xirou/langkhach/drops.js

#mondly
^https:\/\/api\.mondlylanguages\.com\/v1\/ios\/user\/sync$ url script-response-body Xirou/langkhach/mondly.vip.js

#busuu
^https:\/\/api\.busuu\.com\/users\/me* url script-response-body langkhach/Xirou/busuu.vip.js

#Videoshow
^https:\/\/owa\.videoshowiosglobalserver\.com\/.*\/iosPayClient url script-response-body Xirou/langkhach/videoshow.vip.js

#elevate
^https:\/\/accounts\.elevateapp\.net\/api\/users\?user%5Bauthentication_token* url script-response-body Xirou/langkhach/elevate.vip.js

#beautyplus
^https:\/\/api-intl\.mr\.meitu\.com/.*/subs_offer_elg$ url script-response-body Xirou/langkhach/beautyplusvip.js

#camera360
^https:\/\/bmall\.camera360\.com\/api\/(iap\/check-receipt$|mix\/getinfo$) url script-response-body Xirou/langkhach/camera360.vip.js

#zingtv
^https?:\/\/api\.tv\.zing\.vn\/.*/user* url script-response-body Xirou/langkhach/zingtvvipv1.js

#calm
^https:\/\/api\.calm\.com\/me$ url script-response-body Xirou/langkhach/calm.vip.js

#remove_manage
^https:\/\/www\.calm\.com\/mobile\/manage-subscription\?token=*  url reject-img

#lightroom
^https:\/\/photos\.adobe\.io\/v2\/accounts* url script-response-body Xirou/langkhach/Lightroom.js

#Pdfexpert
^https:\/\/license\.pdfexpert\.com\/api\/1\.0\/pdfexpert6\/subscription\/(refresh$|check$) url script-response-body Xirou/langkhach/Pdfexpert.vip.js

#productive&sleepzy
^https:\/\/subs\.platforms\.team\/apple\/verifyTransaction$ url script-response-body Xirou/langkhach/productive.js

#Musixmatch
^https:\/\/apic\.musixmatch\.com\/ws\/.*\/config\.get url script-response-body Xirou/langkhach/musixmatch.miao.js

#boom
^https:\/\/apimboom2\.globaldelight\.net\/itunesreceipt_v2\.php$ url 302 https://raw.githubusercontent.com/langkhach270389/Scripting/master/boom.vip.rsp

#mimo
^https:\/\/api\.getmimo\.com\/v1\/subscriptions$ url script-response-body langkhach/mimo.vip.js

#mojo&noto
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/[a-zA-Z0-9_-]*$) url script-response-body Xirou/langkhach/revenuecat.js

#Bright
^https:\/\/engbright\.com\/app-portal\/apple\/receipt$ url 302 https://raw.githubusercontent.com/langkhach270389/Scripting/master/Bright.rsp

#lingokids
^https:\/\/api\.lingokids\.com\/v1\/renovate_session$ url script-response-body Xirou/langkhach/lingokids.vip.js

#musicalm
^https:\/\/www\.peacefulsoundsapp\.com\/api\/v1\/init$ url script-response-body Xirou/langkhach/musicalm.js

#duolingo
^https:\/\/duolingo-leaderboards-prod\.duolingo\.com\/leaderboards* url script-response-body Xirou/langkhach/duolingo.js

#ulike
^https:\/\/commerce-i18n-api\.faceu\.mobi\/commerce\/v1\/subscription\/user_info$ url script-response-body Xirou/langkhach/ulike.js

#adguardpremium
^https:\/\/mobile-api\.adguard\.com\/api\/1\.0\/ios_validate_receipt$ url 302 https://raw.githubusercontent.com/langkhach270389/Scripting/master/Adguard.rsp

#zingmp3
^https:\/\/api\.global\.mp3\.zing\.vn\/1\.0\/getUserInfo\?data=* url script-response-body Xirou/langkhach/zingmp3.js

#Blinkist
^https:\/\/api\.blinkist\.com\/v4\/(me$|me.json$|me\/access$) url script-response-body Xirou/langkhach/blinkist.js

#sololearn 
^https:\/\/api\.sololearn\.com\/(Profile\/GetProfile$|authenticateDevice$) url script-response-body Xirou/langkhach/sololearn.js

 #kinemaster
^https:\/\/api-kinemaster-assetstore\.nexstreaming\.com\/.*\/product\/verifyReceipt$ url script-response-body Xirou/langkhach/kinemaster.js

#pushover
^https:\/\/api\.pushover\.net\/1\/messages\.json* url script-response-body Xirou/langkhach/pushover.js

#CamScanner
^https:\/\/(api|api-cs)\.intsig\.net\/purchase\/cs\/query_property\? url script-response-body Xirou/langkhach/CamScaner.js

#over
^https:\/\/api\.overhq\.com\/(user\/token\/refresh$|subscription\/verifyReceipt$) url script-response-body Xirou/langkhach/over.vip.js


#speak&translate
^https:\/\/receipt-validator\.herewetest\.com\/apple\/verifyTransaction$ url script-response-body Xirou/langkhach/speak&translate.js

#document
^https:\/\/license\.pdfexpert\.com\/api\/.*\/documents\/subscription\/(refresh$|check$) url script-response-body Xirou/langkhach/documents.js

#workingcopy
^https:\/\/education\.github\.com\/api\/user$ url script-response-body Xirou/langkhach/workingcopy.js

#draft
^https:\/\/backend\.getdrafts\.com\/api\/.*\/verification* url script-response-body Xirou/langkhach/draft.js

#phothop&PSexpress
^https:\/\/lcs-mobile-cops\.adobe\.io\/mobile_profile url script-response-body Xirou/langkhach/photoshop.js

#itranslate&lingo&voice&converse
^https:\/\/ssl-api\.itranslateapp\.com\/.*\/subscriptions\/.*\/ios$ url script-response-body Xirou/langkhach/itranslate.js

#ulysses
^https:\/\/sk\.ulysses\.app\/api\/v1\/user_offers$ url request-header (\r\n)If-None-Match:.+(\r\n) request-header $1 

^https:\/\/sk\.ulysses\.app\/api\/v1\/itunes_receipt_verify$ url script-response-body Xirou/langkhach/ulysses.js

#pre_dayone
;^https:\/\/dayone\.me\/api\/users$ url request-header (\r\n)If-None-Match:.+(\r\n) request-header $1 

#dayone
^https:\/\/dayone\.me\/api\/(users|v2\/users\/account-status)$ url script-response-body Xirou/langkhach/dayone.js

#endel
^https:\/\/api-production\.endel\.io\/.*\/user$ url script-response-body Xirou/langkhach/endel.js

#nichi
^https?:\/\/mp\.bybutter\.com\/mood\/(official-templates|privileges) url script-response-body Xirou/Xirou/langkhach/nichi.js

#grammarly
^https:\/\/subscription\.grammarly\.com\/api\/v1$ url script-response-body Xirou/Xirou/langkhach/grammarly.js

#splice
^https:\/\/splice\.oracle\.\w+\.com\/devices\/me url script-response-body Xirou/langkhach/splice.js

#planner5d
^https:\/\/planner5d\.com\/api\/sets url script-response-body Xirou/langkhach/planner5d.js

#playerxtreme
;^https:\/\/secure\.istreamer\.com\/backend$ url request-header (\r\n)If-None-Match:.+(\r\n) request-header $1 

^https:\/\/secure\.istreamer\.com\/backend$ url script-response-body Xirou/langkhach/playerxtreme.js



##大雄脚本组

# 哔哩哔哩动画 精简去广告 (By @Kaya)
^https:\/\/app\.bilibili\.com\/(search\/resource|x\/(resource\/show\/tab|v2\/(view|rank|feed|reply\/main|account\/mine))) url script-response-body Xirou/Script/Bilibili.js
# 解锁B站大会员-圈X规则
https:\/\/api\.bilibili\.com\/pgc\/player\/api\/playurl url 302 http://api.bili.best:22333/geturl/
https:\/\/api.bilibili.com\/pgc\/view\/app\/season url 302 http://api.bili.best:22333/season/
#哔哩哔哩个人排行榜
^https:\/\/app\.bilibili\.com\/x\/v2\/space\?access_key url script-response-body Xirou/Script/bilibili_space_qx.js
#哔哩哔哩番剧解锁
^https:\/\/api\.bilibili\.com\/pgc\/view\/app\/season url script-response-body Xirou/Script/bilibili_season_qx.js
^https:\/\/api\.bilibili\.com\/pgc\/player\/api\/playurl url script-response-body Xirou/Script/bilibili_playurl_qx.js

# 驾校一点通 (by @superuv)
^https:\/\/vipapi\.jxedt\.com\/vip\/check url script-response-body Xirou/Script/jxydt.js

# 彩云小译   (by @superuv)
^https:\/\/api\.interpreter\.caiyunai\.com\/v1\/user url script-response-body Xirou/Script/cyxy.js

#Bear(未测试)
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body Xirou/Script/bear.js


#Pocket list (by @superuv)
^https:\/\/pocketlists\.com\/api\/v1\/pocketlists.me.get url script-response-body Xirou/Script/pock.js

#海豚记账 (by @superuv)
https:\/\/book\.haitunwallet\.com\/app\/vip\/status url script-response-body Xirou/Script/HTJZ.js

#幕布 (by @superuv)
https:\/\/mubu\.com\/api\/app\/user\/info url script-response-body Xirou/Script/mb.js

#智能证件照相机 (by @superuv)
^https:\/\/app\.xunjiepdf\.com\/api\/v4\/virtualactregister url script-response-body Xirou/Script/znzj.js

#今日热榜(by @superuv)
https:\/\/api\.tophub\.today\/account\/sync url script-response-body Xirou/Script/jrrb.js
#修复新版(已失效,20分钟内就被封堵了)
^https:\/\/api.tophub.today(\/my)?\/(filters|alerts) url request-header (\r\n)User-Agent:.+(\r\n)  request-header $1User-Agent: TophubApp/1.0 (Linux; U; iOS 4.4.4; Scale/3.00) AppleWebKit/601.6.17$2

#猫咪翻译(by @superuv)
http:\/\/miaow\.yiyongcad\.com\/api\/v4\/memprofile url script-response-body Xirou/Script/mmfy.js

#微商助手(by @superuv)
https:\/\/api\.lennou\.com\/user\/info url script-response-body Xirou/Script/wszs.js

#gk扫描仪(by @superuv)
^https:\/\/api\.gkocr\.com\/api\/userlogin1.php url script-response-body Xirou/Script/smy.js

#流利说.阅读 (by@火羽&@singee)
^https?:\/\/vira\.llsapp\.com\/api\/v2\/readings\/(accessible|limitation) url script-response-body Xirou/Script/llyd.js

#爱美剧
#ads
^http(s)://mjapp.anlujia.com/index.php/app/ios/ads/index url reject-dict
^http(s)://mjapp.anlujia.com/index.php/app/ios/ver/index_ios$ url reject
^http(s)://mjapp.anlujia.com/index.php/app/ios/pay/ok$ url reject-dict
#VIP&ads
^http(s)://mjapp.anlujia.com/index.php/app/ios/(vod/show|(user|vod|topic|type)/index) url script-response-body Xirou/Script/aimeiju.js

#云盘解析（Made by Meeta)
^https?:\/\/pan\.baidu\.com\/s\/ url script-response-body Xirou/Meeta/Surge/Scripting/yun_analyze.js

#人人视频 (by@george Jiang)
^https:\/\/api\.rr\.tv(\/user\/privilege\/list|\/ad\/getAll) url script-response-body Xirou/Script/rrtv.js

#abaenglish (未测试)
^https:\/\/api\.revenuecat\.com\/v1\/(receipts|\d{1,})$ url script-response-body Xirou/Script/abaenglish.vip.js

#远程引用订阅Js并添加ID(QX1.03)放本地
;^https:\/\/(raw.githubusercontent|\w+\.github)\.(com|io)\/.*\.js$ url script-response-body Xirou/Script/quanx.js


#以下为仅QX1.05+可用


#京东历史比价
^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body Xirou/yichahucha/jd_price.js

#淘宝历史价格
^https?://amdc\.m\.taobao\.com/amdc/mobileDispatch url script-response-body Xirou/yichahucha/tb_price.js
^https://trade-acs\.m\.taobao\.com/gw/mtop\.taobao\.detail\.getdetail url script-response-body Xirou/yichahucha/tb_price.js

#Netflix获取评分(by yichahucha)
^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D url request-header languages=(.+?)&(.+)&path=%5B%22videos%22%2C%(\d+)%22%2C%22summary%22%5D request-header languages=en-US&$2&path=%5B%22videos%22%2C%$3%22%2C%22summary%22%5D&path=%5B%22videos%22%2C%$3%22%2C%22details%22%5D
^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D url script-response-body Xirou/yichahucha/nf_rating.js

#以下为Cookie获取 成功后可以注释掉
#京东签到获取cookie
https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBeanIndex url script-request-header Xirou/NobyDa/QuantumultX/JD-DailyBonus/JD_GetCookie_QX_Auto.js

#微博超话签到获取cookie
;https:\/\/weibo\.com\/p\/aj\/general\/button\?ajwvr=6&api=http:\/\/i\.huati\.weibo\.com\/aj\/super\/checkin url script-request-header Xirou/sazs34/all_in/all_in_cookie.js
# 此处用于强制手机浏览器访问电脑端超话页面,用完后可以注释掉
;^https?://weibo\.com/p/[0-9] url request-header (\r\n)User-Agent:.+(\r\n) request-header $1User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15

#网易云签到获取cookie(by chavyleung)
^https?:\/\/music\.163\.com url script-request-header Xirou/sazs34/all_in/all_in_cookie.js

#爱奇艺获取cookie
https:\/\/passport\.iqiyi\.com\/apis\/user\/info\.action.*authcookie url script-request-header Xirou/sazs34/all_in/all_in_cookie.js

#贴吧签到获取cookie
https?:\/\/c\.tieba\.baidu\.com\/c\/s\/login url script-request-header Xirou/sazs34/all_in/all_in_cookie.js

#什么值得买获取cookie
^https:\/\/www\.smzdm\.com\/?.? url script-request-header Xirou/chavyleung/smzdm/quanx/smzdm.cookie.js

#52破解论坛获取Cookie
https:\/\/www\.52pojie\.cn\/home\.php\?mod=space url script-request-header Xirou/sazs34/all_in/all_in_cookie.js

#V2ex获取cookie
^https:\/\/www\.v2ex\.com\/mission\/daily url script-request-header Xirou/sazs34/all_in/all_in_cookie.js

#Bilibili获取Cookie
^https:\/\/(www|live)\.bilibili\.com\/?.? url script-request-header Xirou/chavyleung/bilibili/bilibili.cookie.js

#威锋获取cookie
^https:\/\/(www\.)?feng\.com\/?.? url script-request-header Xirou/chavyleung/feng/feng.cookie.js

#腾讯视频获取cookie
^https:\/\/vip\.video\.qq\.com\/?.? url script-request-header Xirou/chavyleung/videoqq/videoqq.cookie.js

#Acfun视频cookie获取
^https:\/\/api\-new\.app\.acfun\.cn\/rest\/app\/user\/personalInfo url script-request-header Xirou/chavyleung/acfun/acfun.cookie.js

#人人字幕组获取cookie
^https?:\/\/(www\.)?zmz2019\.com\/?.? url script-request-header Xirou/chavyleung/zimuzu/zimuzu.cookie.js

#喜马拉雅获取cookie
^https?:\/\/.*\/mobile\-user\/homePage\/.* url script-request-header Xirou/chavyleung/ximalaya/ximalaya.cookie.js

#人人视频获取Cookie
^https:\/\/api\.rr\.tv\/user\/profile url script-request-header Xirou/chavyleung/rrtv/rrtv.cookie.js

#飞客茶馆获取cookie
^https:\/\/www\.flyertea\.com\/source\/plugin\/mobile\/mobile\.php\?module=getdata&.* url script-request-header Xirou/chavyleung/flyertea/flyertea.cookie.js

#顺丰速运获取cookie
^https:\/\/sf\-integral\-sign\-in\.weixinjia\.net\/app\/init url script-request-header Xirou/chavyleung/sfexpress/sfexpress.cookie.js

#电信营业厅获取cookie
https:\/\/wapside\.189\.cn:9001\/api\/home\/sign url script-request-header Xirou/sazs34/all_in/all_in_cookie.js
