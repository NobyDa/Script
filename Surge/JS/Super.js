/*皮皮虾去广告和水印 by Liquor030
如果只需要去广告功能请在[URL Rewrite]中添加
 
# Remove Super's Ad (By Liquor030)
app_name=super&([\S]*)aid=\d+ app_name=super_pro&$1aid=1412 header
 
可大幅改善使用体验，强烈建议添加并禁用该脚本，在需要的时候开启脚本去水印！！
=====================================
Feed: /feed/stream
回复: /comment/cell_reply
评论: /cell/cell_comment
Detail: /cell/detail
用户插眼: /ward/list
用户收藏: /user/favorite
用户评论: /user/cell_coment
用户feed: /user/cell_userfeed
用户发帖: /user/publish_list
===================================
[Script]
http-response ^https?://.*\.snssdk\.com/bds/(feed/stream|comment/cell_reply|cell/cell_comment|cell/detail|ward/list|user/favorite|user/cell_coment|user/cell_userfeed|user/publish_list) requires-body=1,max-size=-1,script-path=https://raw.githubusercontent.com/Liquor030/Sub_Ruleset/master/Script/Super.js
[MITM]
hostname = *.snssdk.com
*/
var body = $response.body.replace(/\":([0-9]{15,})/g, '":"$1str"');
body = JSON.parse(body);
if (body.data.data) {
    obj = body.data.data;
} else if (body.data.replies) {
    obj = body.data.replies;
} else if (body.data.cell_comments) {
    obj = body.data.cell_comments;
} else {
    obj = null;
}

if (obj instanceof Array) {
    if (obj != null) {
        for (var i in obj) {
            if (obj[i].ad_info != null) {
                obj.splice(i, 1);
            }
            if (obj[i].item != null) {
                if (obj[i].item.video != null) {
                    obj[i].item.video.video_download.url_list = obj[i].item.origin_video_download.url_list;
                }
                for (var j in obj[i].item.comments) {
                    if (obj[i].item.comments[j].video != null) {
                        obj[i].item.comments[j].video_download.url_list = obj[i].item.comments[j].video.url_list;
                    }
                }
            }
            if (obj[i].comment_info != null) {
                if (obj[i].comment_info.video != null) {
                    obj[i].comment_info.video_download.url_list = obj[i].comment_info.video.url_list;
                }
            }
        }
    }
} else {
    if (obj.item != null) {
        if (obj.item.video != null) {
            obj.item.video.video_download.url_list = obj.item.origin_video_download.url_list;
        }
        for (var j in obj.item.comments) {
            if (obj.item.comments[j].video != null) {
                obj.item.comments[j].video_download.url_list = obj.item.comments[j].video.url_list;
            }
        }
    }
    if (obj.comment_info != null) {
        if (obj.comment_info.video != null) {
            obj.comment_info.video_download.url_list = obj.comment_info.video.url_list;
        }
    }
}
body = JSON.stringify(body);
body = body.replace(/\":\"([0-9]{15,})str\"/g, '":$1');
body = body.replace(/\"can_download\":false/g, '"can_download":true');
body = body.replace(/tplv-ppx-logo.image/g, '0x0.gif');
body = body.replace(/tplv-ppx-logo/g, '0x0');
$done({
    body
});
