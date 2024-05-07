/*
Surge规则自动生成脚本
更新时间：2024/05/07

需按照博客内教程配合使用：
https://nobyda.github.io/2024/02/24/Surge_Rule_Storage

*/

const args = argsList(typeof $argument == "string" && $argument || 'region=debug');
/*
When matching whitelist rules, skip generating suffix domain. Three ways to write:
Domain: example.com
Domain suffix: .example.com
Domain keyword: .example.
*/
args.whitelist = args.whitelist || `[".mwcname.com", ".akadns.", ".akamai.", ".cloud.", ".cdn.", ".yun."]`;
args.key = args.key || 'Rule-Storage';

(async () => {
    const host = $request.hostname.toLowerCase();
    const inHost = $request.listenPort == 6152 && !$request.sourcePort && !$request.processPath && /^[a-z0-9]{10}\.[a-z]+$/.test(host); //Prevent benchmark
    if (['127.0.0.1', '0.0.0.0'].filter((v) => [...($request.dnsResult || {}).v4Addresses || []].includes(v)).length) {
        // DNS poisoning
        args.matched = false;
        args.region = 'global';
    }
    if (!/\d$|:/.test(host) && host.includes('.') && !inHost) {
        const data = JSON.parse($persistentStore.read(args.key) || '{}');
        const saved_rules = $persistentStore.read(`${args.key}-${args.region}`);
        if (!evalRules(host, saved_rules)) {
            data[args.region] = saveDecision(host, data[args.region]);
            if (data[args.region][host].quantity >= (args.quantity || 10)) {
                data.eTLD = await eTLD(data.eTLD);
                const suffix = shortenDomain(host, data.eTLD.public_suffix);
                const domain = evalRules(host, JSON.parse(args.whitelist)) ? host : suffix;
                const text = [...formatRules(saved_rules), ...formatRules(domain)].join('\n');
                delete data[args.region][host];
                $persistentStore.write(text, `${args.key}-${args.region}`)
            }
        }
        return $persistentStore.write(JSON.stringify(data), args.key)
    }
})().catch((e) => $notification.post(args.key, ``, e.message || e))
    .finally(() => $done({ matched: Boolean(args.matched) }));

function saveDecision(host_name, content = {}) {
    for (const i in content) {
        if (Date.now() - content[i].update_time > 86400000 * (args.cacheDays || 30)) {
            delete content[i];
        }
    }
    if (content[host_name]) {
        if (Date.now() - content[host_name].update_time > ((args.interval || 30) * 1000)) {
            content[host_name].update_time = Date.now();
            content[host_name].quantity++;
        }
    } else {
        content[host_name] = { update_time: Date.now(), quantity: 1 }
    }
    return content
}

function evalRules(host_name, rule_list) {
    const host_suffix = host_name.split('.').reverse();
    rule_list = typeof rule_list == 'object' ? rule_list : formatRules(rule_list, 1);
    for (const i in rule_list) {
        if (rule_list[i].startsWith('.') && !rule_list[i].endsWith('.')) {
            const rule_host_suffix = rule_list[i].split('.').reverse().filter((v) => v);
            if (rule_host_suffix.filter((v, i) => host_suffix[i] === v).length === rule_host_suffix.length) {
                return true
            }
        } else if (rule_list[i].startsWith('.') && rule_list[i].endsWith('.')) {
            if (host_name.includes(rule_list[i].slice(1, -1))) {
                return true
            }
        } else if (rule_list[i] === host_name) {
            return true
        }
    }
    return false
}

function formatRules(list, type) {
    return (list || '').replace(/\r|\ |(\/\/|#|;).*/g, '').split('\n').map((v) => {
        if (v.startsWith('DOMAIN,')) { return type ? v.split(",")[1] : v }
        if (v.startsWith('DOMAIN-SUFFIX,')) { return type ? `.${v.split(",")[1]}` : v }
        if (v.startsWith('.')) { return type ? v : `DOMAIN-SUFFIX,${v.slice(1)}` }
        if (v.includes('.')) { return type ? v : `DOMAIN,${v}` }
    }).filter((v) => v);
}

async function eTLD(content = {}) {
    if (!content.update_time || (Date.now() - content.update_time > 86400000 * 30)) {
        await new Promise(resolve => {
            $httpClient.get({
                url: 'https://publicsuffix.org/list/public_suffix_list.dat'
            }, (error, resp, body) => {
                if (resp.status == 200 && !error && body) {
                    content.update_time = Date.now();
                    content.public_suffix = body.replace(/\r|.*(\/\/|#|;).*|\n(\!|\*\.)/g, '\n').split('\n').filter((t) => t);
                    resolve()
                } else if (content.update_time) {
                    console.log(`Update eTLD list failed: ${error}`);
                    resolve()
                } else {
                    throw new Error(`Download eTLD list failed: ${error}`)
                }
            })
        })
    }
    return content
}

/*
Shorten multi level domain: non-eTLD, full eTLD, second level domain will return original
Basic logic: www.abc.com -> .abc.com
*/
function shortenDomain(host_name, eTLD_list) {
    return host_name.split('.').reverse().reduce((t, v, i, c) => {
        if (t === host_name || c.length == 2) { return host_name }
        if (t.startsWith('.')) { return t }
        const host_suffix = v + (t && `.${t}` || '');
        for (const ix in eTLD_list) {
            if (eTLD_list[ix] === host_suffix) {
                return host_suffix
            }
        }
        return !i && host_name || `.${host_suffix}`
    }, '')
}

function argsList(data) {
    return Array.from(
        data.split("&")
            .map((i) => i.split("="))
            .map(([k, v]) => [k, decodeURIComponent(v)])
    )
        .reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {})
}