let obj = JSON.parse($response.body);
obj["subscriber"]["subscriptions"]= {
      "revenuecat.pro.yearly": {
        "is_sandbox": false,
        "period_type": "active",
        "billing_issues_detected_at": null,
        "unsubscribe_detected_at": null,
        "expires_date": "2099-12-01T03:51:32Z",
        "original_purchase_date": "2019-10-31T02:51:33Z",
        "purchase_date": "2019-10-31T02:51:32Z",
        "store": "app_store"
      }
    };
obj["subscriber"]["entitlements"]= {
      "pro": {
        "expires_date": "2099-12-01T03:51:32Z",
        "product_identifier": "revenuecat.pro.yearly",
        "purchase_date": "2019-10-31T02:51:32Z"
      }
    };
$done({body: JSON.stringify(obj)});
