/*
抖音去广告, 去水印. 改自https://github.com/Choler/Surge/blob/master/Script/douyin.js

***************************
Surge 4.2+ :

[Script]
抖音去广告&水印req = type=http-request,pattern=^https?:\/\/.+?\.amemv\.com\/aweme\/v\d\/(feed|aweme\/post|follow\/feed|nearby\/feed|search\/item|general\/search\/single|hot\/search\/video\/list)\/,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Aweme.js

抖音去广告&水印res = type=http-response,pattern=^https?:\/\/.+?\.amemv\.com\/aweme\/v\d\/(feed|aweme\/post|follow\/feed|nearby\/feed|search\/item|general\/search\/single|hot\/search\/video\/list)\/,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Aweme.js

[MITM]
hostname = *.amemv.com

***************************
***************************
QuantumultX 1.0.10+ :

[rewrite_local]
^https?:\/\/.+?\.amemv\.com\/aweme\/v\d\/(feed|aweme\/post|follow\/feed|nearby\/feed|search\/item|general\/search\/single|hot\/search\/video\/list)\/ url script-request-header https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Aweme.js

^https?:\/\/.+?\.amemv\.com\/aweme\/v\d\/(feed|aweme\/post|follow\/feed|nearby\/feed|search\/item|general\/search\/single|hot\/search\/video\/list)\/ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Aweme.js

[mitm]
hostname = *.amemv.com
***************************
*/

const path1 = "/feed/"; // 推荐
const path2 = "/aweme/post/"; //作品
const path3 = "/follow/feed/"; // 关注
const path4 = "/nearby/feed/"; // 同城
const path5 = "/search/item/"; // 视频
const path6 = "/general/search/"; // 综合
const path7 = "/hot/search/video/"; // 热搜

try {
  if (typeof $response != "undefined") {
    if ($request.url.indexOf(path1) != -1) {
      feed();
    } else if ($request.url.indexOf(path2) != -1) {
      post();
    } else if ($request.url.indexOf(path3) != -1) {
      follow();
    } else if ($request.url.indexOf(path4) != -1) {
      nearby();
    } else if ($request.url.indexOf(path5) != -1) {
      item();
    } else if ($request.url.indexOf(path6) != -1) {
      search();
    } else if ($request.url.indexOf(path7) != -1) {
      hot();
    } else {
      $done({});
    }
  } else {
    $done({
      url: $request.url.replace(/\/v\d\//, "/v1/")
    });
  }
} catch {
  $done({});
}

function feed() {
  let obj = JSON.parse($response.body);
  let arr = obj.aweme_list;
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i].is_ads != false) {
      arr.splice(i, 1);
    }
    let play = arr[i].video.play_addr.url_list;
    arr[i].video.download_addr.url_list = play;
    let download = arr[i].video.download_addr;
    arr[i].video.download_suffix_logo_addr = download;
    arr[i].status.reviewed = 1;
    arr[i].video_control.allow_download = true;
    arr[i].author.room_id = 0;
    arr[i].video.misc_download_addrs = {};
  }
  $done({
    body: JSON.stringify(obj)
  });
}

function post() {
  let obj = JSON.parse($response.body);
  let arr = obj.aweme_list;
  if (arr != null) {
    for (var i = arr.length - 1; i >= 0; i--) {
      arr[i].status.reviewed = 1;
      arr[i].video_control.allow_download = true;
      let play = arr[i].video.play_addr.url_list;
      arr[i].video.download_addr.url_list = play;
      let download = arr[i].video.download_addr;
      arr[i].video.download_suffix_logo_addr = download;
    }
  }
  $done({
    body: JSON.stringify(obj)
  });
}

function follow() {
  let obj = JSON.parse($response.body);
  let arr = obj.data;
  for (var i = arr.length - 1; i >= 0; i--) {
    arr[i].aweme.status.reviewed = 1;
    arr[i].aweme.video_control.allow_download = true;
    let play = arr[i].aweme.video.play_addr.url_list;
    arr[i].aweme.video.download_addr.url_list = play;
    let download = arr[i].aweme.video.download_addr;
    arr[i].aweme.video.download_suffix_logo_addr = download;
  }
  $done({
    body: JSON.stringify(obj)
  });
}

function nearby() {
  let obj = JSON.parse($response.body);
  if (obj.aweme_list) {
    for (var i = obj.aweme_list.length - 1; i >= 0; i--) {
      if (obj.aweme_list[i].video) {
        if (obj.aweme_list[i].status.reviewed != 1) {
          obj.aweme_list[i].status.reviewed = 1;
          obj.aweme_list[i].video_control.allow_download = true;
        }
        if (obj.aweme_list[i].video.download_addr) {
          let play = obj.aweme_list[i].video.play_addr.url_list;
          obj.aweme_list[i].video.download_addr.url_list = play;
        }
        if (obj.aweme_list[i].video.download_suffix_logo_addr) {
          let download = obj.aweme_list[i].video.download_addr;
          obj.aweme_list[i].video.download_suffix_logo_addr = download;
        }
      } else {
        obj.aweme_list.splice(i, 1);
      }
    }
  }
  $done({
    body: JSON.stringify(obj)
  });
}

function item() {
  let obj = JSON.parse($response.body);
  if (obj.aweme_list) {
    for (var i = obj.aweme_list.length - 1; i >= 0; i--) {
      if (obj.aweme_list[i].video) {
        if (obj.aweme_list[i].status.reviewed != 1) {
          obj.aweme_list[i].status.reviewed = 1;
          obj.aweme_list[i].video_control.allow_download = true;
        }
        if (obj.aweme_list[i].video.download_addr) {
          let play = obj.aweme_list[i].video.play_addr.url_list;
          obj.aweme_list[i].video.download_addr.url_list = play;
        }
        if (obj.aweme_list[i].video.download_suffix_logo_addr) {
          let download = obj.aweme_list[i].video.download_addr;
          obj.aweme_list[i].video.download_suffix_logo_addr = download;
        }
      }
    }
  }
  $done({
    body: JSON.stringify(obj)
  });
}

function search() {
  let obj = JSON.parse($response.body);
  let arr = obj.data;
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i].type == 1) {
      if (arr[i].aweme_info.is_ads) {
        arr.splice(i, 1);
      }
      if (arr[i].aweme_info.video) {
        let play = arr[i].aweme_info.video.play_addr.url_list;
        arr[i].aweme_info.video.download_addr.url_list = play;
        let download = arr[i].aweme_info.video.download_addr;
        arr[i].aweme_info.video.download_suffix_logo_addr = download;
        arr[i].aweme_info.status.reviewed = 1;
        arr[i].aweme_info.video_control.allow_download = true;
      }
    }
  }
  $done({
    body: JSON.stringify(obj)
  });
}

function hot() {
  let obj = JSON.parse($response.body);
  if (obj.aweme_list) {
    for (var i = obj.aweme_list.length - 1; i >= 0; i--) {
      if (obj.aweme_list[i].video.download_addr) {
        let play = obj.aweme_list[i].video.play_addr.url_list;
        obj.aweme_list[i].video.download_addr.url_list = play;
      }
      if (obj.aweme_list[i].video.download_suffix_logo_addr) {
        let download = obj.aweme_list[i].video.download_addr;
        obj.aweme_list[i].video.download_suffix_logo_addr = download;
      }
      if (obj.aweme_list[i].video.misc_download_addrs) {
        obj.aweme_list[i].video.misc_download_addrs = {};
      }
    }
  }
  $done({
    body: JSON.stringify(obj)
  });
}