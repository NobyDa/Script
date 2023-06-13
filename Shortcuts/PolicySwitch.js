/*
捷径策略切换脚本, 该脚本需与捷径配合使用.

脚本兼容: Surge4.7, QuanX1.0.22(545+), Loon2.1.10(290+)
捷径地址: https://www.icloud.com/shortcuts/0f5b9a825cad47488a78ff2876b822dd

脚本配置:
-----------Surge------------
[Script]
捷径策略切换 = type=http-request,pattern=^http:\/\/nobyda\.policy,requires-body=1,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Shortcuts/PolicySwitch.js

--------QuantumuitX---------
[rewrite_local]
^http:\/\/nobyda\.policy url script-analyze-echo-response https://raw.githubusercontent.com/NobyDa/Script/master/Shortcuts/PolicySwitch.js

------------Loon------------
[Script]
http-request ^http:\/\/nobyda\.policy script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Shortcuts/PolicySwitch.js, requires-body=true, tag=捷径策略切换

----------------------------
*/

const $ = new nobyda();
const url = $request.url;
const body = JSON.parse($request.body || '{}');

(async function SwitchPoliy() {
	let res = {};
	if (/\/getGroup$/.test(url))
		res.group = await $.getGroup();
	if (/\/getPolicy$/.test(url))
		res.policy = await $.getPolicy(body.group);
	if (/\/setPolicy$/.test(url))
		res.success = await $.setPolicy(body.group, body.policy);
	$.done(res);
})()

function nobyda() {
	const isLoon = typeof($loon) !== "undefined";
	const isQuanX = typeof($configuration) !== 'undefined';
	const isSurge = typeof($httpAPI) !== 'undefined';
	const m = `不支持您的APP版本, 请等待APP更新 ⚠️`;
	this.getGroup = () => {
		if (isSurge) {
			return new Promise((resolve) => {
				$httpAPI("GET", "v1/policies", {}, (b) => resolve(b['policy-groups']))
			})
		}
		if (isLoon) {
			const getName = JSON.parse($config.getConfig());
			return getName['all_policy_groups'];
		}
		if (isQuanX) {
			return new Promise((resolve) => {
				$configuration.sendMessage({
					action: "get_customized_policy"
				}).then(b => {
					if (b.ret) {
						resolve(Object.keys(b.ret).filter(s => b.ret[s].type == "static"));
					} else resolve();
				}, () => resolve());
			})
		}
		return m;
	}
	this.getPolicy = (groupName) => {
		if (isSurge) {
			return new Promise((resolve) => {
				$httpAPI("GET", "v1/policy_groups", {}, (b) => {
					resolve(b[groupName].map(g => g.name))
				})
			})
		}
		if (isLoon) {
			return new Promise((resolve) => {
				$config.getSubPolicys(groupName, (b) => {
					const get = JSON.parse(b || '[]').map(n => n.name);
					resolve(get)
				})
			})
		}
		if (isQuanX) {
			return new Promise((resolve) => {
				$configuration.sendMessage({
					action: "get_customized_policy",
					content: groupName
				}).then(b => {
					if (b.ret && b.ret[groupName]) {
						resolve(b.ret[groupName].candidates);
					} else resolve();
				}, () => resolve());
			})
		}
		return m;
	}
	this.setPolicy = (group, policy) => {
		if (isSurge) {
			return new Promise((resolve) => {
				$httpAPI("POST", "v1/policy_groups/select", {
					group_name: group,
					policy: policy
				}, (b) => resolve(!b.error))
			})
		}
		if (isLoon) {
			const set = $config.setSelectPolicy(group, policy);
			return set;
		}
		if (isQuanX) {
			return new Promise((resolve) => {
				$configuration.sendMessage({
					action: "set_policy_state",
					content: {
						[group]: policy
					}
				}).then((b) => resolve(!b.error), () => resolve());
			})
		}
		return m;
	}
	this.done = (body) => {
		const e = {
			response: {
				body: JSON.stringify(body)
			}
		};
		$done(typeof($task) != "undefined" ? e.response : e);
	}
}