let user = '/app_api/v5/getuserinfo/';
let coin = '/app_api/v5/coin_account/';
let ticket = '/app_api/v5/getuserinfo_ticket/';

let url = $request.url;
let body = JSON.parse($response.body);

if (url.indexOf(user) != -1) {
	body.data.coins = 999;
	body.data.isvip = 1;
	body.data.recommend = 999;
	body.data.Cticket = 999;
	body.data.Cgold = 999;
} else if (url.indexOf(coin) != -1) {
	body.data.coins = 999;
	body.data.golds = 999;
} else if (url.indexOf(ticket) != -1) {
	body.data.Cticket = 999;	
} else {
//    $done({});
}

body = JSON.stringify(body);

$done({body});

// By mieqq
