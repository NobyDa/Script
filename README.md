## 26.11.2019 更新
0. 使得本地，远程均可引用脚本；
1. 增加unblockremote.js，以简化 Quantumult 1.0.3 配置设备ID 流程，以达到最快使用远程（解锁）脚本； 
2. unblockremote.js 最开始是在联萌群看见，原作者暂无出处，欢迎提醒更正。
3. 亲测教程有效； 

### fork 本仓库
`fork` https://github.com/limbopro/Script ；

### 修改 unblockremote.js

1.进入 `fork` 后的`仓库`，找到并修改 `unblockremote.js` 脚本文件； 2.填写你的`设备ID`；（`设备ID`在哪？进入QuantumltX，点击右下角三菱按钮，点击右上角 `...` 更多按钮，滑至底部`关于`，即可找到设备ID）；

```
var body = $response.body;
body = '\/*\n@supported 你的QuantumultX设备ID填这里\n*\/\n' + body;
$done(body);
```

### 使用WorkingCopy同步 fork 到本地
1. 修改好 `unblockremote.js` 脚本文件后；
2. 使用`WorkingCopy`App 将 fork 后的仓库同步到 `我的iPhone` - `Quantumult X` - `Scripts` - `NobyDa` 下；
3. 不会使用`WorkingCopy`App? 参考示例：https://limbopro.xyz/archives/workingcopy.html#01.11.2019QX-1.0.2

## 配置 rewrite_local

编辑QuantumultX 配置文件 ，找到 [rewrite_local]，并在 [rewrite_local] 添加：

```
^https:\/\/(raw.githubusercontent|\w+\.github)\.(com|io)\/.*\.js$ url script-response-body NobyDa/unblockremote.js
```

添加后效果：

```
[rewrite_local]
^https:\/\/(raw.githubusercontent|\w+\.github)\.(com|io)\/.*\.js$ url script-response-body NobyDa/unblockremote.js
```

### 配置 hostname

编辑QuantumultX 配置文件 ，找到 `hostname =`，并在 `hostname =` 后面添加：`raw.githubusercontent.com, *.github.io,`

效果如下：

```
hostname = raw.githubusercontent.com, *.github.io, vsco.co, *.my10api.com, *googlevideo.com, api.termius.com, api*.tiktokv.com, api*.musical.ly, api*.amemv.com, aweme*.snssdk.com, api.weibo.cn, mapi.weibo.com, *.uve.weibo.com, mp.weixin.qq.com, api.bilibili.com, app.bilibili.com, *.zhihu.com, aweme*.snssdk.com, *.kuwo.cn, ios.xiaoxiaoapps.com, api*.tiktokv.com, *.musical.ly, *.amemv.com, mjappaz.yefu365.com, p.du.163.com, getuserinfo.321mh.com, getuserinfo-globalapi.zymk.cn, api-163.biliapi.net, ios.fuliapps.com, vsco.co, api.vnision.com, *.my10api.com, bd.4008109966.net, sp.kaola.com, r.inews.qq.com, apple.fuliapps.com, newdrugs.dxy.cn, bdapp.4008109966.net, app101.avictown.cc, api.hlo.xyz, api.ijo.xyz, www.luqijianggushi.com, account.wps.cn, u.kanghuayun.com, api.gyrosco.pe, api1.dobenge.cn, api.mvmtv.com, mitaoapp.yeduapp.com, origin-prod-phoenix.jibjab.com, www.3ivf.com, pay.guoing.com, p.doras.api.vcinema.cn, api.termius.com, mjappaz.yefu365.com, viva.v21xy.com, dida365.com, ticktick.com
```

### 引用远程JS.conf

1.复制`https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/Js.conf`链接（或者你fork后的JS.conf也行）， 2.进入Quantumult X，点击右下角`三菱按钮`，找到`Rewrite`模块-点击` 引用`，粘贴刚刚复制的链接；

### 开玩

最后，进入 `Quantumult X` App，点击右下角`三菱按钮`，找到`Rewrite`模块，开启按钮，`MitM`模块，开启按钮；

更多或帮助关注频道：https://t.me/limboprossr ；

以上。

## Quantumult X related Description：

* **Script remote resources and subscriptions only apply to QX v1.0.0(120). If the version is higher than v1.0.2 (136), you need to point to the local script path yourself.**

* Because the latest version 1.0.2 has limited the "remote resource" of the script, there will be an error in adding the subscription.

### The difference between the versions :

* Store version QX1.0.0 (120) JS function is unlimited, but does not support v2, does not support AlwaysOn

* Store version QX1.0.1 (130) restricts keywords for script VIP types, but supports v2 and supports AlwaysOn

* Store version QX1.0.2 (136) Relaxed certain keyword restrictions, but limited script remote references (script subscriptions), support for v2 and support for http and support AlwaysOn

* **It is currently not possible to get QX1.0.0 (120) via sniffing packet capture because the dev has withdrawn**

---

### Disclaimer：

* **Any unlocking and decryption analysis scripts involved in the Script project released by NobyDa are only used for resource sharing and learning research. Legality, accuracy, completeness, and validity cannot be guaranteed. Please judge according to the situation itself.**

* Any user who uses the script indirectly, Including but not limited to building a VPS or spreading if a certain behavior violates the country and laws or relevant regulations, **NobyDa is not responsible for any privacy leak or other consequences caused by it.**

* **Do not use any content of the Script project for commercial or illegal purposes，otherwise, all consequences are at your own risk.**

* If any unit or individual believes that a script of the project may be suspected of infringing its rights, it shall promptly notify and **provide proof of identity, proof of ownership,** we will delete the relevant script after receiving the certification file.

* **NobyDa is not responsible for any scripting issues, including but not limited to any loss or damage caused by any script error.**

* You must completely remove the above from your computer or mobile phone within **24 hours** of downloading.

* Anyone who views this project in any way or any script that uses the Script project directly or indirectly should read this statement carefully. And NobyDa reserves the right to change or supplement this disclaimer at any time. **Once you use and reproduce any related scripts or rules of the Script project, you are deemed to have accepted this disclaimer.**

