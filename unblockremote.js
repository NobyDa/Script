var body = $response.body;
body = '\/*\n@supported 0425065B15F9\n*\/\n' + body;

$done(body);
