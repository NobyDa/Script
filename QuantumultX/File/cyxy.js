var obj = JSON.parse($response.body);
 obj={
  "point": {},
  "user": {
    "username": "*",
    "status": "",
    "total_video_addition_remain": 0,
    "point": 11380,
    "vip_take_effect": 2,
    "mvp_count": 676,
    "vip_type": "svip",
    "updated_at": 1607043897,
    "member_type": "svip",
    "addition_quota": {
      "video_translate": [],
      "doc_download": []
    },
    "total_video_translate_remain": 2700.0,
    "reading_page_count": 3046,
    "has_audio_permission": true,
    "biz": {
      "xy_vip_expire": 2007864135.0690739155,
      "vip_expired_at": 2007864135.0690739155,
      "auto_renewal_type": "month",
      "svip_expired_at": 2006654535.0690739155,
      "is_login": true,
      "is_xy_vip": true,
      "platform_name": "caiyun",
      "xy_svip_expire": 2006654535.0690739155,
      "score": 2000,
      "is_xy_auto_renewal": true,
      "last_acted_at": 1574918310.343832016,
      "phone_num": "15735012326",
      "xy_vip_type": "s&v",
      "vip_type": "s&v",
      "is_phone_verified": true,
      "device_id": "867068024975202",
      "name": "*",
      "gender": "",
      "created_at": 1524308781.9459939003,
      "is_auto_renewal": true,
      "hasBeenInvited": false,
      "platform_id": "",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJ1c2VyX2lkIjoiNWFkYjFiMmVhNDM4N2YwMDBiZTdjY2IzIiwic3ZpcF9leHBpcmVkX2F0IjowLCJ2aXBfZXhwaXJlZF9hdCI6MH0.JqlZpb-T0eSOlPA3z69XSpat_YtMa6mUgOtLOzANgqI",
      "avatar": "https:\/\/caiyunapp.com\/imgs\/webtrs\/default.png",
      "is_vip": true,
      "_id": "5adb1b2ea4387f000be7ccb3"
    },
    "daily_comment_count": 0,
    "continuous_reading_count": 8,
    "id": "5adb1b2ea4387f000be7ccb3",
    "official_account_following_count": 5,
    "total_doc_addition_remain": 0,
    "be_liked_count": 3,
    "vip_download_word_count": 77262,
    "svip_take_effect": 0,
    "daily_share_count": 0,
    "daily_sentence_count": 0,
    "created_at": 1524308783,
    "total_doc_translate_remain": 847958.0,
    "page_favorite_count": -2,
    "free_download_count": 1.0,
    "avatar_url": "https:\/\/caiyunapp.com\/imgs\/webtrs\/default.png",
    "reading_time_this_week": 0,
    "has_doc_permission": true,
    "translation_count": 813,
    "doc_trans_block": false,
    "remain_user_quota": null,
    "_id": "5adb1b2ea4387f000be7ccb3",
    "type": "member",
    "email": "",
    "user_quota": {
      "video_translate": {
        "remain": 2700.0,
        "quota": 2700.0
      },
      "update_time": 1607443200,
      "doc_download": {
        "remain": 847958.0,
        "quota": 1000000.0
      }
    }
  },
  "rc": 0
};
$done({body: JSON.stringify(obj)});
//