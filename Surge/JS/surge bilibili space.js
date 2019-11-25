/*
 * @supported 0C02A0BCC5B7 819366A72B49
 */


let url = $request.url
let regex = /vmid=(\d*)/
let vmid= regex.exec(url)
let mid = vmid[1]
let api = `https://space.bilibili.com/ajax/member/getSubmitVideos?mid=${mid}&pagesize=10&order=stow`
$httpClient.get(api, (error, response, body) => {
    if (error) $done({})
    else {
      console.log(body)
      body=JSON.parse(body)
      let info=""
      body['data']['vlist'].forEach((element, index)=> {
          index++
          let scheme=`bilibili://av/${element['aid']}`
          info+=index+": "+element['title']+"\n"+scheme+"\n"
      })     
      $notification.post('收藏排行前10','长按进入', info)  
      $done({})
    }
  })
