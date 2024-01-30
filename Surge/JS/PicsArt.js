/*
PicsArt 解锁高级功能
数据来自 @chxm1023

***************************
QuantumultX:

[rewrite_local]
^https:\/\/api\.(picsart|meiease)\.c(n|om)\/shop\/subscription\/(validate|apple\/purchases) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/PicsArt.js

[mitm]
hostname = api.picsart.c*, api.meiease.c*

***************************
Surge4 or Loon:

[Script]
http-response ^https:\/\/api\.(picsart|meiease)\.c(n|om)\/shop\/subscription\/(validate|apple\/purchases) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/PicsArt.js

[MITM]
hostname = api.picsart.c*, api.meiease.c*

**************************/

$done({
    body: JSON.stringify({
        "status": "success",
        "response": [
            {
                "status": "SUBSCRIPTION_PURCHASED",
                "order_id": "490001314520000",
                "original_order_id": "490001314520000",
                "is_trial": true,
                "plan_meta": {
                    "storage_limit_in_mb": 20480,
                    "frequency": "yearly",
                    "scope_id": "full",
                    "id": "com.picsart.editor.subscription_yearly",
                    "product_id": "subscription_yearly",
                    "level": 2000,
                    "auto_renew_product_id": "com.picsart.editor.subscription_yearly",
                    "type": "renewable",
                    "tier_id": "gold_old",
                    "permissions": [
                        "premium_tools_standard",
                        "premium_tools_ai"
                    ],
                    "description": "china"
                },
                "limitation": {
                    "max_count": 5,
                    "limits_exceeded": false
                },
                "reason": "ok",
                "subscription_id": "com.picsart.editor.subscription_yearly",
                "is_eligible_for_introductory": false,
                "purchase_date": 1687020148000,
                "expire_date": 4092599349000
            }
        ]
    })
});