/******************************

Sub-Store外置流量查询脚本

该脚本基于Sub-Store, 可解决APP使用Sub-Store链接后, 没有流量通知的问题. 使用前需确认您的机场订阅是否支持流量信息. (注:节点名流量信息暂不支持)
Sub-Store订阅管理器: https://github.com/Peng-YM/Sub-Store

测试兼容: QuantumultX, Surge, Loon. 
使用方法: 打开Sub-Store => 订阅 => 编辑 => 节点操作+ => 脚本操作 => 填入脚本链接或粘贴脚本 => 保存

您的APP更新Sub-Store订阅链接时, 将自动发送流量通知.

脚本链接: https://raw.githubusercontent.com/NobyDa/Script/master/Sub-store-parser/DataQuery.js

******************************/

function operator(proxies) {
  try {
    if ($request.headers["User-Agent"].match(/Quantumult|Surge|Loon|Decar/) && !$.raw_Name) {
      const rawInfo = $.read('subs');
      const readName = $.read('collections');
      const subtag = $request.url.match(/download\/(collection\/)?([\w-_]*)/)[2];
      if ($request.url.match(/\/collection\//)) { //collection subscription.
        const isOpen = readName[subtag].process.map(o => o.type).indexOf("Script Operator") != -1;
        for (var i = 0; i < readName[subtag].subscriptions.length; i++) {
          $.raw_Name = readName[subtag].subscriptions[i];
          if (!isOpen) break; //prevent queries in certain cases.
          AllSubs(rawInfo[$.raw_Name].url, $.raw_Name);
        }
      } else { //single subscription.
        $.raw_Name = rawInfo[subtag].name;
        AllSubs(rawInfo[subtag].url, $.raw_Name);
      }
    }
  } catch (err) {
    $.error(`\n🔹 订阅昵称:「 ${$.raw_Name||'未知'} 」\n🔺 查询失败:「 ${err.message||err} 」`);
  } finally {
    return proxies;
  }
}

async function AllSubs(subsUrl, subsName) {
  try { //reference to https://github.com/KOP-XIAO/QuantumultX/blob/master/Scripts/resource-parser.js
    var resp = await $.http.get(subsUrl);
    var sinfo = JSON.stringify(resp.headers || '').replace(/ /g, "").toLowerCase();
    if (sinfo.indexOf("total=") == -1 || sinfo.indexOf("download=") == -1) throw new Error('该订阅不包含流量信息');
    var total = (parseFloat(sinfo.split("total=")[1].split(",")[0]) / (1024 ** 3)).toFixed(0);
    var usd = ((parseFloat(sinfo.indexOf("upload") != -1 ? sinfo.split("upload=")[1].split(",")[0] : "0") + parseFloat(sinfo.split("download=")[1].split(",")[0])) / (1024 ** 3)).toFixed(2);
    var left = ((parseFloat(sinfo.split("total=")[1].split(",")[0]) / (1024 ** 3)) - ((parseFloat(sinfo.indexOf("upload") != -1 ? sinfo.split("upload=")[1].split(",")[0] : "0") + parseFloat(sinfo.split("download=")[1].split(",")[0])) / (1024 ** 3))).toFixed(2);
    if (sinfo.indexOf("expire=") != -1) {
      var epr = new Date(parseFloat(sinfo.split("expire=")[1].split(",")[0]) * 1000);
      var year = epr.getFullYear();
      var mth = epr.getMonth() + 1 < 10 ? '0' + (epr.getMonth() + 1) : (epr.getMonth() + 1);
      var day = epr.getDate() < 10 ? "0" + (epr.getDate()) : epr.getDate();
      var epr = `🔹 过期时间:「 ${year}-${mth}-${day} 」`;
    } else {
      var epr = "";
    }
    $.notify(`🔹 订阅昵称:「 ${subsName} 」`, epr, `🔸 已用流量:「 ${usd} GB 」\n🔸 剩余流量:「 ${left} GB 」`);
  } catch (er) {
    $.error(`\n🔹 订阅昵称:「 ${subsName} 」\n🔺 查询失败:「 ${er.message||er} 」`);
  }
}