var body = $response.body;
body = '\/*\n@supported 你的QuantumultX设备ID填这里\n*\/\n' + body;
$done(body);
