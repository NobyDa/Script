var body = $response.body;
body = '\/*\n@supported 41EDDD0E8AA5\n*\/\n' + body;

$done(body);
