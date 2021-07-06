/*
MIX 解锁特权 (需恢复购买)

***************************
QuantumultX:

[rewrite_local]
https?:\/\/bmall\.camera360\.com\/api\/mix\/recovery url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/MIX.js

[mitm]
hostname = bmall.camera360.com

***************************
Surge4 or Loon:

[Script]
http-response https?:\/\/bmall\.camera360\.com\/api\/mix\/recovery requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/MIX.js

[MITM]
hostname = bmall.camera360.com

**************************/

if ($response.body) {
    $done({
        body: JSON.stringify({
            "status": 200,
            "data": {
                "errorCode": 0,
                "orderList": [{
                    "quantity": "1",
                    "purchase_date_ms": "1537703444000",
                    "expires_date": "2028-06-06 06:06:06 Etc\/GMT",
                    "expires_date_pst": "2028-06-06 06:06:06 America\/Los_Angeles",
                    "is_in_intro_offer_period": "false",
                    "transaction_id": "200000535242800",
                    "is_trial_period": "true",
                    "original_transaction_id": "200000535242800",
                    "purchase_date": "2018-09-23 11:50:44 Etc\/GMT",
                    "product_id": "com.vstudio.MIX.subscription.auto.year",
                    "original_purchase_date_pst": "2018-09-23 04:50:44 America\/Los_Angeles",
                    "original_purchase_date_ms": "1537703444000",
                    "web_order_line_item_id": "200000140095730",
                    "expires_date_ms": "1843855566000",
                    "purchase_date_pst": "2018-09-23 04:50:44 America\/Los_Angeles",
                    "original_purchase_date": "2018-09-23 11:50:44 Etc\/GMT"
                }, {
                    "quantity": "1",
                    "purchase_date_ms": "1538401707000",
                    "expires_date": "2028-06-06 06:06:06 Etc\/GMT",
                    "expires_date_pst": "2028-06-06 06:06:06 America\/Los_Angeles",
                    "is_in_intro_offer_period": "false",
                    "transaction_id": "200000539102583",
                    "is_trial_period": "false",
                    "original_transaction_id": "200000535242800",
                    "purchase_date": "2018-10-01 13:48:27 Etc\/GMT",
                    "product_id": "com.vstudio.MIX.subscription.auto.year",
                    "original_purchase_date_pst": "2018-09-23 04:50:44 America\/Los_Angeles",
                    "original_purchase_date_ms": "1537703444000",
                    "web_order_line_item_id": "200000140095731",
                    "expires_date_ms": "1843855566000",
                    "purchase_date_pst": "2018-10-01 06:48:27 America\/Los_Angeles",
                    "original_purchase_date": "2018-09-23 11:50:44 Etc\/GMT"
                }, {
                    "product_id": "com.vstudio.MIX.Font.ruizigongfangcanlandaheijianonedotzero",
                    "quantity": "1",
                    "transaction_id": "200000577197848",
                    "purchase_date_ms": "1546314438000",
                    "original_purchase_date_pst": "2018-12-31 19:47:18 America\/Los_Angeles",
                    "purchase_date_pst": "2018-12-31 19:47:18 America\/Los_Angeles",
                    "original_purchase_date_ms": "1546314438000",
                    "is_trial_period": "false",
                    "original_purchase_date": "2019-01-01 03:47:18 Etc\/GMT",
                    "original_transaction_id": "200000577197848",
                    "purchase_date": "2019-01-01 03:47:18 Etc\/GMT"
                }],
                "autoBindingUserId": "043c8b571a3cd6c06e06db5f",
                "pendingRenewalInfo": [{
                    "product_id": "com.vstudio.MIX.subscription.auto.year",
                    "original_transaction_id": "200000535242800",
                    "auto_renew_product_id": "com.vstudio.MIX.subscription.auto.year",
                    "auto_renew_status": "0"
                }]
            },
            "message": "ok",
            "exetime": "1555653929373-1555653933781",
            "serverTime": 1555653933.7815001
        })
    });
} else {
    $done({})
}