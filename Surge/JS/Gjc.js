if ($response.body) {
    var body = $response.body

    function replaceAll(body, find, replace) {
        return body.replace(new RegExp(find, 'g'), replace);
    }

    var key = ['华为', '余承东', 'vmail', '%E5%8D%8E%E4%B8%BA', '荣耀', '鸿蒙', '任正非', 'emui', 'HUAWEI'];

    key.forEach(function(k) {
        body = replaceAll(body, k, '');
    });

    $done({
        body
    });
} else {
    $done({});
}
