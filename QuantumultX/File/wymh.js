var body = $response.body;
var url = $request.url;
const path = '/getUserProfile';
let obj = JSON.parse(body)
if (url.indexOf(path) != -1) {
	obj["resCode"] = 0;
	obj["data"]["money"] = 6666;
	obj["data"]["hongbao"] = 6666;
	obj["data"]["realVipType"] = 1;
	obj["data"]["score"] = 6666;
        obj["data"]["userType"] = 1;
        obj["data"]["level"] = "VIP8";
        obj["data"]["yuepiao"] = 6666;
        obj["data"]["to"] = 3042979200721;
        obj["data"]["from"] = 1546272000721;
	body = JSON.stringify(obj);
   
 }

$done({body});

 // From Meeta, revise by NobyDa
