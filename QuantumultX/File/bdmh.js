var body = $response.body;
var obj = JSON.parse(body);

obj.data.user_info.isvip = "1";
obj.data.user_info.is_pay = "1";
obj.data.user_info.egold = "66666";
obj.data.user_info.vip_days = "66666";
obj.data.user_info.vip_start_time = "1502969604";
obj.data.user_info.vip_overtime = "2066-06-06 06:00:00";
obj.data.user_info.name = "脚本禁止牟利,TG频道@NobyDa";
obj.data.user_info.avatar = "https://p1.music.126.net/1jOx2v1wy36uXNh9lXR1Fg==/109951163188414241.jpg?param=180y180";

body = JSON.stringify(obj); 
$done({body});