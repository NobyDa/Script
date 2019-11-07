var obj = JSON.parse($response.body);
 obj={
 "point": {},
 "user": {
  "status": "",
  "point": 168168,
  "audio_used_time": 0,
  "mvp_count": 477,
  "continuous_reading_count": 1,
  "updated_at": 1572729413,
  "doc_trans_block": false,
  "id": "5adb1b2ea4387f000be7ccb3",
  "be_liked_count": 0,
  "daily_comment_count": 0,
  "reading_page_count": 447,
  "type": "registered",
  "email": "",
  "username": "***8888",
  "daily_share_count": 0,
  "translation_count": 553,
  "biz": {
   "xy_vip_expire": 1999999999572020700,
   "platform_name": "caiyun",
   "phone_num": "15735012326",
   "name": "***2326",
   "grade": "积雨云",
   "is_xy_vip": true,
   "last_acted_at": 1569311538.545543,
   "platform_id": "",
   "score": 2000,
   "avatar": "https://images.unsplash.com/photo-1570328738505-305ad03ccc9f?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=lee-luis-CpPbh112yk0-unsplash.jpg",
   "_id": "5adb1b2ea4387f000be7ccb3",
   "is_xy_auto_renewal": false
  },
  "audio_remaining_time": null,
  "daily_sentence_count": 0,
  "created_at": 1524308783,
  "free_download_count": 6,
  "avatar_url": "https://caiyunapp.com/imgs/webtrs/default.png",
  "reading_time_this_week": 45701,
  "_id": "5adb1b2ea4387f000be7ccb3"
 },
 "rc": 0
};
$done({body: JSON.stringify(obj)});
//

