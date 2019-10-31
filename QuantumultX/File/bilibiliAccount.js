let body = $response.body
body=JSON.parse(body)
body['data']['sections'].splice(2,1)
body=JSON.stringify(body)
$done({body}
/**
 * @supported 9E1BBA07
 */
