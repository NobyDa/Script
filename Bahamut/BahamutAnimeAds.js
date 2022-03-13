/************************

动画疯，屏蔽播放广告脚本 (黑屏25秒自动播放)
由于动画疯强制验证观看广告时间，无法实现真正意义上的跳过广告。

Surge(4.11+)模块：
https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Module/BahamutAnimeAds.sgmodule

QX(1.0.27+)用户请自行搭配KOP-XIAO资源解析器重写引用Surge模块。

************************/

let [req, rsp] = [$request, JSON.parse($response.body || '{}')];

runs().catch((err) => {
  console.log(`[BahamutAnime] ERROR: ${err.message||err}`)
}).finally(() => $done({
  body: JSON.stringify(rsp)
}));

async function runs() {
  if (req.url.includes('token.php') && rsp.ad) {
    rsp.ad.minor = [];
    rsp.ad.major = [];
  }
  if (req.url.includes('m3u8.php') && rsp.message) {
    await adURL('');
    await new Promise(r => setTimeout(r, 25000));
    await adURL('end');
    rsp = await playURL();
  }
}

function adURL(str) {
  return new Promise((res) => {
    get({
      url: `https://api.gamer.com.tw/mobile_app/anime/v1/stat_ad.php?ad=${str}&schedule=0&sn=${req.url.split(/sn=(\d+)/)[1]}`,
      headers: req.headers
    }, (err, resp, data) => res())
  })
}

function playURL() {
  return new Promise((res) => {
    get({
      url: req.url,
      headers: req.headers
    }, (err, resp, data) => res(JSON.parse(data || '{}')))
  })
}

function get(options, callback) {
  if (typeof $task != "undefined") {
    $task.fetch(options).then(response => {
      response["status"] = response.statusCode
      callback(null, response, response.body)
    }, reason => callback(reason.error, null, null))
  }
  if (typeof $httpClient != "undefined") {
    $httpClient.get(options, callback)
  }
}