if ($response.body) {
    var body = $response.body

    function replaceAll(body, find, replace) {
        return body.replace(new RegExp(find, 'g'), replace);
    }

    var key = ['华为', '荣耀', '鸿蒙', '任正非', 'HUAWEI'];

    key.forEach(function(k) {
        body = replaceAll(body, k, 'XXX');
    });

    $done({
        body
    });
} else {
    $done({});
}