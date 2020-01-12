/*

TieBa Daily bonus

The script is made by @wechatu

Description :
When TieBa app is opened, click "My", If notification gets cookie success, you can use the check in script. because script will automatically judgment whether the cookie is updated, so you dont need to disable it manually.

script will be performed every day at 9 am. You can modify the execution time.
Note that the following config is only a local script configuration, please put both scripts into Quantumult X/Script, and the cookie script only works for TieBa apps in china apple store

[rewrite_local] 
# Get TieBa cookie. 【QX TF188+】:
https?:\/\/c\.tieba\.baidu\.com\/c\/s\/login url script-request-header TieBa_GetCookie_QX.js

# MITM = c.tieba.baidu.com

[task_local]
0 9 * * * TieBa_DailyBonus_QX.js

*/
var cookieVal = $prefs.valueForKey("CookieTB");
var useParallel = 0; //0自动切换,1串行,2并行(当贴吧数量大于30个以后,并行可能会导致QX崩溃,所以您可以自动切换)
var singleNotifyCount = 20; //想签到几个汇总到一个通知里,这里就填几个(比如我有13个要签到的,这里填了5,就会分三次消息通知过去)
var process = {
    total: 0,
    result: [
        // {
        //     bar:'',
        //     level:0,
        //     exp:0,
        //     errorCode:0,
        //     errorMsg:''
        // }
    ]
};
var url_fetch_sign = {
    url: "https://tieba.baidu.com/mo/q/newmoindex",
    headers: {
        "Content-Type": "application/octet-stream",
        Referer: "https://tieba.baidu.com/index/tbwise/forum",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366"
    }
};
var url_fetch_add = {
    url: "https://tieba.baidu.com/sign/add",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14B100 UCBrowser/10.7.5.650 Mobile"
    },
    body: ""
};

function signTieBa() {
    if (!cookieVal) {
        $notify("贴吧签到", "签到失败", "未获取到cookie");
        return;
    }
    $task.fetch(url_fetch_sign).then(response => {
        // $notify("贴吧签到", "贴吧列表", response.body);
        var body = JSON.parse(response.body);
        var isSuccessResponse = body && body.no == 0 && body.error == "success" && body.data.tbs;
        if (!isSuccessResponse) {
            $notify("贴吧签到", "签到失败", (body && body.error) ? body.error : "接口数据获取失败");
            return;
        }
        process.total = body.data.like_forum.length;
        if (body.data.like_forum && body.data.like_forum.length > 0) {
            if (useParallel == 1 || (useParallel == 0 && body.data.like_forum.length >= 30)) {
                signBars(body.data.like_forum, body.data.tbs, 0);
            } else {
            for (const bar of body.data.like_forum) {
                    signBar(bar, body.data.tbs);
                }
            }
        } else {
            $notify("贴吧签到", "签到失败", "请确认您有关注的贴吧");
            return;
        }
    }, reason => {
        $notify("贴吧签到", "签到失败", "未获取到签到列表");
    });
}

function signBar(bar, tbs) {
    if (bar.is_sign == 1) { //已签到的,直接不请求接口了
        process.result.push({
            bar: `${bar.forum_name}`,
            level: bar.user_level,
            exp: bar.user_exp,
            errorCode: 9999,
            errorMsg: "已签到"
        });
        checkIsAllProcessed();
    } else {
        url_fetch_add.body = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
        $task.fetch(url_fetch_add).then(response => {
            try {
                var addResult = JSON.parse(response.body);
                if (addResult.no == 0) {
                    process.result.push({
                        bar: bar.forum_name,
                        errorCode: 0,
                        errorMsg: `获得${addResult.data.uinfo.cont_sign_num}积分,第${addResult.data.uinfo.user_sign_rank}个签到`
                    });
                } else {
                    process.result.push({
                        bar: bar.forum_name,
                        errorCode: addResult.no,
                        errorMsg: addResult.error
                    });
                }
            } catch (e) {
                $notify("贴吧签到", "贴吧签到数据处理异常", JSON.stringify(e));
            }
            checkIsAllProcessed();
        }, reason => {
            process.result.push({
                bar: bar.forum_name,
                errorCode: 999,
                errorMsg: '接口错误'
            });
            checkIsAllProcessed();
        });
    }
}

function signBars(bars, tbs, index) {
    //$notify("贴吧签到", `进度${index}/${bars.length}`, "");
    if (index >= bars.length) {
        //$notify("贴吧签到", "签到已满", `${process.result.length}`);
        checkIsAllProcessed();
    } else {
        var bar = bars[index];
        if (bar.is_sign == 1) { //已签到的,直接不请求接口了
            process.result.push({
                bar: `${bar.forum_name}`,
                level: bar.user_level,
                exp: bar.user_exp,
                errorCode: 9999,
                errorMsg: "已签到"
            });
            signBars(bars, tbs, ++index);
        } else {
            url_fetch_add.body = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
            $task.fetch(url_fetch_add).then(response => {
                try {
                    var addResult = JSON.parse(response.body);
                    if (addResult.no == 0) {
                        process.result.push({
                            bar: bar.forum_name,
                            errorCode: 0,
                            errorMsg: `获得${addResult.data.uinfo.cont_sign_num}积分,第${addResult.data.uinfo.user_sign_rank}个签到`
                        });
                    } else {
                        process.result.push({
                            bar: bar.forum_name,
                            errorCode: addResult.no,
                            errorMsg: addResult.error
                        });
                    }
                } catch (e) {
                    $notify("贴吧签到", "贴吧签到数据处理异常", JSON.stringify(e));
                }
                signBars(bars, tbs, ++index)
            }, reason => {
                process.result.push({
                    bar: bar.forum_name,
                    errorCode: 999,
                    errorMsg: '接口错误'
                });
                signBars(bars, tbs, ++index);
            });
        }
    }
}

function checkIsAllProcessed() {
    //$notify("贴吧签到", `最终进度${process.result.length}/${process.total}`, "");
    if (process.result.length != process.total) return;
    for (var i = 0; i < Math.ceil(process.total / singleNotifyCount); i++) {
        var notify = "";
        var spliceArr = process.result.splice(0, singleNotifyCount);
        var notifySuccessCount = 0;
        for (const res of spliceArr) {
            if (res.errorCode == 0 || res.errorCode == 9999) {
                notifySuccessCount++;
            }
            if (res.errorCode == 9999) {
                notify += `【${res.bar}】已经签到，当前等级${res.level},经验${res.exp}
`;
            } else {
                notify += `【${res.bar}】${res.errorCode==0?'签到成功':'签到失败'}，${res.errorCode==0?res.errorMsg:('原因：'+res.errorMsg)}
`;
            }
        }
        $notify("贴吧签到", `签到${spliceArr.length}个,成功${notifySuccessCount}个`, notify);
    }
}

signTieBa()