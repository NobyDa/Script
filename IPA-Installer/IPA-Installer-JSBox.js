/*
 * IPA-installer JSBox script. This script is not available stand alone, checkout the demo from TG channel @NobyDa
 * 
 * Modified from https://github.com/axelburks/JSBox/blob/master/IPA%20Installer.js by @NobyDa
 */

var port_number = 8070
var plist_url = `itms-services://?action=download-manifest&url=https://nobyda.app/install%3Fclient%3Djsbox%26url%3Dhttp%253A%252F%252F127.0.0.1%253A${port_number}%252Fdownload%253Fpath%253D%25252Fapp.ipa`

$app.strings = {
  "en": {
    "starterror": "Not support running in this way",
    "ftypeerror": " is not ipa file",
    "installtitle": "Installing...",
    "installmsg": "\n\nYou can check on Homescreen.\nPlease tap \"Done\" button after finished",
    "inerrtitle": "IPA file import error",
    "inerrmsg": "Please rerun the script"
  },
  "zh-Hans": {
    "starterror": "不支持此方式运行！",
    "ftypeerror": " 非 ipa 文件！",
    "installtitle": "正在安装…",
    "installmsg": "\n\n可前往桌面查看安装进度\n完成后请点击\"Done\"按钮",
    "inerrtitle": "IPA文件导入失败",
    "inerrmsg": "请重新运行此脚本"
  }
}

// 从应用内启动
if ($app.env == $env.app) {
  $drive.open({
    handler: function(data) {
      fileCheck(data)
    }
  })
}
// 从 Action Entension 启动
else if ($app.env == $env.action) {
  fileCheck($context.data)
}

else {
  $ui.error($l10n("starterror"))
  delayClose(2)
}


function startServer(port) {
  $http.startServer({
    port: port,
    path: "",
    handler: function(result) {
      console.info(result.url)
    }
  })
}

function fileCheck(data) {
  if (data && data.fileName) {
    var fileName = data.fileName;
    if (fileName.indexOf(".ipa") == -1) {
      $ui.error(fileName + $l10n("ftypeerror"))
      delayClose(2)
    } else {
      install(fileName, data);
    }
  }
}

function install(fileName, file) {
  var result = $file.write({
    data: file,
    path: "app.ipa"
  })
  if (result) {
    startServer(port_number)
    $location.startUpdates({
      handler: function(resp) {
        console.info(resp.lat + " " + resp.lng + " " + resp.alt)
      }
    })
    var preResult = $app.openURL(plist_url);
    if (preResult) {
      $ui.alert({
        title: $l10n("installtitle"),
        message: "\n" + fileName + $l10n("installmsg"),
        actions: [{
          title: "Cancel",
          style: "Cancel",
          handler: function() {
            $http.stopServer()
            $file.delete("app.ipa")
            delayClose(0.2)
          }
        },
        {
          title: "Done",
          handler: function() {
            $http.stopServer()
            $file.delete("app.ipa")
            delayClose(0.2)
          }
        }]
      })
    } else {
      $ui.alert({
        title: "Open itms-services scheme failed",
        message: "Please rerun the script or restart device",
        actions: [
        {
          title: "OK",
          handler: function() {
            delayClose(0.2)
          }
        }]
      })
    }
  } else {
    $ui.alert({
      title: $l10n("inerrtitle"),
      message: $l10n("inerrmsg"),
      actions: [{
        title: "OK",
        style: "Cancel",
        handler: function() {
          delayClose(0.2)
        }
      }]
    })
  }
}

function delayClose(time) {
    $location.stopUpdates()
    $thread.main({
      delay: time,
      handler: function() {
        if ($app.env == $env.action || $app.env == $env.safari) {
          $context.close()
        }
        $app.close()
      }
    })
}
