let obj = JSON.parse($response.body);
let url = $request.url;

const ylm = '/api/public/?service=Live.checkLive';
const xml = '/api/public//?service=Live.roomCharge';
const cs = '/lg/video/loadVideoFees.do';

if (url.indexOf(ylm) != -1) {
obj.data.info[0].type = "0";
}
if (url.indexOf(xml) != -1) {
obj.data.code = 0;
}
if (url.indexOf(cs) != -1) {
obj.body.videoModel.fees = 1;
}
$done({body: JSON.stringify(obj)});