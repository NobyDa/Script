/*
哔哩哔哩漫画, 积分商城自动抢购脚本

脚本作者：@NobyDa
更新时间：2024/06/01
平台兼容：Surge, QuantumultX, Loon

*************************
【 抢购脚本注意事项 】:
*************************

该脚本需要使用签到脚本获取Cookie后方可使用.
默认兑换积分商城中的"【超特惠】限量-0点秒杀", 兑换数量为用户积分可兑换的最大值 (可于BoxJs内修改)
默认执行时间为：每周日、每周一的凌晨 0:00:00 - 0:01:59 之间每秒执行一次

BoxJs订阅地址: https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json

*************************
【 Surge & Loon 脚本配置 】:
*************************

[Script]
cron "0-59 0 0 * * 0-1" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/ExchangePoints.js, wake-system=1, timeout=60

*************************
【 QX 1.0.10+ 脚本配置 】 :
*************************

[task_local]
0-59 0 0 * * 0-1 * * * https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/ExchangePoints.js, tag=哔哩哔哩漫画抢券, enabled=true

*/

// 新建一个实例对象, 把兼容函数定义到$中, 以便统一调用
let $ = new nobyda();

// 读取Surge脚本参数并转成对象
let args = argsList(typeof $argument == "string" && $argument || '');

// 读取兑换商品名, 默认兑换积分商城中的"【超特惠】限量-0点秒杀"
let productName = args.ProductName || $.read('BM_ProductName') || '【超特惠】限量-0点秒杀';

// 读取兑换数量, 默认兑换最大值
let productNum = parseInt(args.ProductNum) || $.read('BM_ProductNum');

// 读取循环抢购次数, 默认100次
let exchangeNum = args.ExchangeNum || $.read('BM_ExchangeNum') || '100';

// 读取哔哩哔哩漫画签到脚本所使用的Cookie
let cookie = $.read('CookieBM');

// 预留的空对象, 便于函数之间读取数据
let user = {};

(async function() { // 立即运行的匿名异步函数
	// 使用await关键字声明, 表示以同步方式执行异步函数, 可以简单理解为顺序执行
	await Promise.all([ //该方法用于将多个实例包装成一个新的实例, 可以简单理解为同时调用函数, 以进一步提高执行速度
		GetUserPoint(), //查询积分函数
		ListProduct() //查询商品函数
	]);
	await ExchangeProduct(); //上面的查询都完成后, 则执行抢购
	$.done(); //抢购完成后调用Surge、QX内部特有的函数, 用于退出脚本执行
})();

function GetUserPoint() {
	const pointUrl = { //查询积分接口
		url: 'https://manga.bilibili.com/twirp/pointshop.v1.Pointshop/GetUserPoint',
		headers: { //请求头
			'Cookie': cookie //用户鉴权Cookie
		}
	}
	return new Promise((resolve) => { //主函数返回Promise实例对象, 以便后续调用时可以实现顺序执行异步函数
		$.post(pointUrl, (error, resp, data) => { //使用post请求查询, 再使用回调函数处理返回的结果
			try { //使用try方法捕获可能出现的代码异常
				if (error) {
					throw new Error(error); //如果请求失败, 例如无法联网, 则抛出一个异常
				} else {
					const body = JSON.parse(data); //解析响应体json并转化为对象
					if (body.code == 0 && body.data) { //如果响应体为预期格式
						user.point = parseInt(body.data.point); //把查询的积分赋值到全局变量user中
						console.log(`\n当前积分: ${body.data.point}`); //打印日志
					} else { //否则抛出一个异常
						throw new Error(body.msg || data);
					}
				}
			} catch (e) { //接住try代码块中抛出的异常, 并打印日志
				console.log(`\n查询积分: 失败\n出现错误: ${e.message}`);
			} finally { //finally语句在try和catch之后无论有无异常都会执行
				resolve(); //异步操作成功时调用, 将Promise对象的状态标记为"成功", 表示已完成查询积分
			}
		})
	})
}

function ListProduct() {
	const listUrl = { //查询商品接口
		url: 'https://manga.bilibili.com/twirp/pointshop.v1.Pointshop/ListProduct',
		headers: {}
	}
	return new Promise((resolve) => { //主函数返回Promise实例对象, 以便后续调用时可以实现顺序执行异步函数
		$.post(listUrl, (error, resp, data) => { //使用post请求查询, 再使用回调函数处理返回的结果
			try { //使用try方法捕获可能出现的代码异常
				if (error) {
					throw new Error(error); //如果请求失败, 例如无法联网, 则抛出一个异常
				} else {
					const body = JSON.parse(data); //解析响应体json并转化为对象
					if (body.code == 0 && body.data.length >= 1) { //如果接口正常返回商品信息
						// 按全局变量所填写的商品名进行过滤, 并把商品信息赋值到全局变量user中
						user.list = body.data.filter(t => t.title == productName).pop();
						if (!user.list) {
							throw new Error('请检查商品名'); //如果填错商品名则抛出一个异常
						} else { //否则打印日志
							console.log(`\n查询商品: ${productName}\n商品库存: ${user.list.remain_amount}`)
						}
					} else { //否则抛出一个异常
						throw new Error('无商品列表');
					}
				}
			} catch (e) { //接住try代码块中抛出的异常并打印日志
				console.log(`\n查询商品: ${productName}\n出现错误: ${e.message}`);
			} finally { //finally语句在try和catch之后无论有无异常都会执行
				resolve(); //异步操作成功时调用, 将Promise对象的状态标记为"成功", 表示已完成查询商品
			}
		})
	})
}

function ExchangeProduct() {
	return new Promise(async (resolve) => { //主函数返回Promise实例对象, 以便后续调用时可以实现顺序执行异步函数, 该实例函数带有async关键字, 表示里面有异步操作, 例如可使用await得到异步结果
		if (user.list && user.list.remain_amount && user.point >= 100) { //如果商品有库存并且用户积分大于100则进行抢购
			//兑换商品数量(用户积分 除与 商品单价得到兑换数量), 并转成整数; 默认兑换最大数量
			const num = parseInt(productNum || (user.point / user.list.real_cost));
			const exchangeUrl = {
				url: 'https://manga.bilibili.com/twirp/pointshop.v1.Pointshop/Exchange', //兑换商品接口
				headers: { //请求头
					'Content-Type': 'application/json', //声明请求体数据格式
					'Cookie': cookie //用户鉴权Cookie
				},
				body: JSON.stringify({ //请求体转成字符串类型
					product_id: user.list.id, //兑换的商品id
					product_num: num, //兑换的商品数量
					point: num * user.list.real_cost //消耗的积分总数 (兑换数量乘单价得到积分总数)
				})
			};
			for (let i = 0; i < parseInt(exchangeNum); i++) { //根据全局变量定义的次数, 暴力循环抢购
				// 循环内调用另一个抢购函数, 并传入请求、第几次循环、兑换数量等参数, 
				// 使用await关键字声明, 表示需要等待每一次的执行结果
				const run = await startExchange(exchangeUrl, i, num);
				if (run) {
					break; //如果函数返回布尔值true, 则跳出循环, 脚本结束
				}
			}
		} else { //商品无库存或用户积分小于100等情况, 则不执行抢购, 脚本结束
			console.log(`\n抢购终止: 不具备兑换条件`); //打印日志
		}
		resolve(); //将主函数的Promise对象状态标记为"成功", 表示已完成抢购任务
	})
}

function startExchange(url, item, amount) {
	return new Promise((resolve) => { //主函数返回Promise实例对象, 以便后续调用时可以实现顺序执行异步函数
		$.post(url, (error, resp, data) => { //使用post请求查询, 再使用回调函数处理返回的结果
			try { //使用try方法捕获可能出现的代码异常
				if (error) {
					throw new Error(error); //如果请求失败, 例如无法联网, 则抛出一个异常
				} else {
					const body = JSON.parse(data); //解析响应体json并转化为对象
					if (body.code == 0) { //如果抢购成功, 则输出日志和通知
						console.log(`\n抢购成功: 第${item+1}次\n抢购数量: ${amount}\n消耗积分: ${amount * user.list.real_cost}`);
						$.notify('哔哩哔哩漫画抢券', '', `"${productName}"抢购成功, 数量: ${amount}, 消耗积分: ${amount * user.list.real_cost}`);
						resolve(true); //将Promise对象的状态标记为"成功", 然后返回一个布尔值true用于跳出循环
					} else {
						throw new Error(body.msg || '未知'); //抢购失败则抛出异常
					}
				}
			} catch (e) { //接住try代码块中抛出的异常并打印日志
				console.log(`\n抢购失败: 第${item+1}次\n失败原因: ${e.message}`);
				resolve(); //将Promise对象的状态标记为"成功", 但不返回任何值, 表示继续循环抢购
			}
		})
	})
}

function argsList(data) {
    return Array.from(
        data.split("&")
            .map((i) => i.split("="))
            .map(([k, v]) => [k, decodeURIComponent(v)])
    )
        .reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {})
}

function nobyda() {
	const isSurge = typeof $httpClient != "undefined";
	const isQuanX = typeof $task != "undefined";
	const isNode = typeof require == "function";
	const node = (() => {
		if (isNode) {
			const request = require('request');
			return {
				request
			}
		} else {
			return null;
		}
	})()
	const adapterStatus = (response) => {
		if (response) {
			if (response.status) {
				response["statusCode"] = response.status
			} else if (response.statusCode) {
				response["status"] = response.statusCode
			}
		}
		return response
	}
	this.read = (key) => {
		if (isQuanX) return $prefs.valueForKey(key)
		if (isSurge) return $persistentStore.read(key)
	}
	this.notify = (title, subtitle, message) => {
		if (isQuanX) $notify(title, subtitle, message)
		if (isSurge) $notification.post(title, subtitle, message)
		if (isNode) console.log(`${title}\n${subtitle}\n${message}`)
	}
	this.post = (options, callback) => {
		options.headers['User-Agent'] = 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_6_1 like Mac OS X) AppleWebKit/609.3.5.0.2 (KHTML, like Gecko) Mobile/17G80 BiliApp/822 mobi_app/ios_comic channel/AppStore BiliComic/822'
		if (isQuanX) {
			if (typeof options == "string") options = {
				url: options
			}
			options["method"] = "POST"
			$task.fetch(options).then(response => {
				callback(null, adapterStatus(response), response.body)
			}, reason => callback(reason.error, null, null))
		}
		if (isSurge) {
			options.headers['X-Surge-Skip-Scripting'] = false
			$httpClient.post(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
		if (isNode) {
			node.request.post(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
	}
	this.done = () => {
		if (isQuanX || isSurge) {
			$done()
		}
	}
};