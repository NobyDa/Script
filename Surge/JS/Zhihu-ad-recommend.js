/*
Remove Zhihu ads

Regex: ^https://api.zhihu.com/topstory/recommend
*/

let body = $response.body
body=JSON.parse(body)
body['data'].forEach((element, index)=> {
    if(element['card_type']=='slot_event_card'||element.hasOwnProperty('ad')){      
       body['data'].splice(index,1)  
    }
})
body=JSON.stringify(body)
$done({body})

// by onewayticket255