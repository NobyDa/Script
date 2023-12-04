# IPA-installer pythonista script. This script is not available stand alone, checkout the demo from TG channel @NobyDa
#
# Modified from https://github.com/axelburks/Pythonista/blob/master/IPA%20Installer.py by @NobyDa

import os, appex, console, shutil, http.server, webbrowser, time
from os import path
from threading import Thread

port_number = 8090
plist_url = f'itms-services://?action=download-manifest&url=https://nobyda.app/install%3Fclient%3Dpythonista%26url%3Dhttp%253A%252F%252F127.0.0.1%253A{port_number}%252Fipa%252Fapp.ipa'
save_dir = path.expanduser('./ipa')
if not path.exists(save_dir):
	os.makedirs(save_dir)
	
httpd = None
def startServer(port):
    Handler = http.server.SimpleHTTPRequestHandler
    
    global httpd
    httpd = http.server.HTTPServer(("", port), Handler)
    
    print("Start server at port", port)
    httpd.serve_forever()

def start(port):
    thread = Thread(target=startServer, args=[port])
    thread.start()
    
    startTime = int(time.time())
    while not httpd:
        if int(time.time()) > startTime + 60:
            print("Time out")
            break
    return httpd

def stop():
    if httpd:
        httpd.shutdown()

def main():
	if appex.is_running_extension():
		get_path = appex.get_file_path()
		file_name = path.basename(get_path)
		file_ext = path.splitext(file_name)[-1]
		if file_ext == '.ipa':
			dstpath = path.join(save_dir, 'app.ipa')
			try:
				shutil.copy(get_path, dstpath)
				
			except Exception as eer:
				print(eer)
				console.hud_alert('导入失败!','error',1)
			start(port_number)
			if httpd:
				webbrowser.open(plist_url)
			try:
				finish = console.alert(file_name, '\n正在安装...请返回桌面查看进度...\n\n安装完成后请返回点击已完成','已完成', hide_cancel_button=False)
				if finish == 1:
					stop()
					shutil.rmtree('./ipa')
					print("Server stopped")
			except:
				stop()
				shutil.rmtree('./ipa')
				print("Cancelled")
				appex.finish()
		else:
			console.hud_alert('非 ipa 文件无法导入安装', 'error', 2)
		appex.finish()
	else:
		console.hud_alert('请在分享扩展中打开本脚本','error',2)

if __name__ == '__main__':
	main()