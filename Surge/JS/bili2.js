let headers = $request.headers;
headers['Host'] = 'bili.miao.best';
$done({headers});

let url = $request.url.replace(/.+playurl/, "https:\/\/bili\.miao\.best\/geturl\/maom\/")
$done({url});