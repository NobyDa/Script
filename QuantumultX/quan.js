/*
@supported 5C25720A399C
*/

var body = $response.body;
body = '\/*\n@supported 5C25720A399C\n*\/\n' + body;

$done(body);
