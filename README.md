### Difference between Quantumult X versions :

* Store version QX1.0.0 (120) JS function is unlimited, but does not support v2, does not support AlwaysOn

* Store version QX1.0.1 (130) restricts keywords for script VIP types, but supports v2 and supports AlwaysOn

* Store version QX1.0.2 (136) Relaxed certain keyword restrictions, but limited script remote references (script subscriptions), support for v2 and support for http and support AlwaysOn

* Store version QX1.0.3 (155) Removed keyword restrictions and restored script remote references. However, the content in the remote script needs to be annotated with the device ID before it can be executed.

* Store version QX1.0.4 (164) This version completely limits remote script resources, meaning that all scripts can only point to local paths.

* Store version QX1.0.5 (192) Remote script resources are unavailable, but "task" script functionality is added.

* Store version QX1.0.6 (212) Supports rewrite of HTTP request body, and replay of HTTP request

* Store version QX1.0.7 (240) Supports TLS 1.3 for TLS based proxy protocols, and new external proxy protocol trojan.

QX1.0.3 add device ID, a simple example:

```ini
/**
 * @supported 23AD6B11CD4B
 */

let obj = JSON.parse($response.body)
obj["example"] = 0;
$done({body:JSON.stringify(obj)})
```
The above random generated device ID can be found at the bottom of Quantumult X additional menu, and it may change after system restore.

---

## File related instructions：

### Surge：

* **[AdRule.list](https://raw.githubusercontent.com/NobyDa/Script/master/Surge/AdRule.list) （More than 8000 ad rules， integrate [lhie1](https://github.com/lhie1/Rules) and [ConnersHua](https://github.com/ConnersHua/Profiles) and added some advertising rules)**

* **[AdRuleTest.list](https://raw.githubusercontent.com/NobyDa/Script/master/Surge/AdRuleTest.list) （More than 1300 ad rules，This rule is modified from [Scomper](https://github.com/scomper/Surge). Because the original author stopped maintenance, so take over the optimization and delete some normal rules, only for testing**)

* **[AdRuleRegex.list](https://raw.githubusercontent.com/NobyDa/Script/master/Surge/AdRuleRegex.list) （More than 700 ad rewrite rules, integrate [lhie1](https://github.com/lhie1/Rules)、[ConnersHua](https://github.com/ConnersHua/Profiles)、[onewayticket255](https://github.com/onewayticket255/Surge-Script) and [Choler](https://github.com/Choler/Surge/tree/master/Ruleset).  You need to manually add the hostname of the second line in the file to Surge config file. and open MITM and trust the certificate)**

* **[Download.list](https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Download.list) (Integrate some BT, Thunder, download shunt rules)**

* **Because [ConnersHua](https://github.com/ConnersHua/Profiles) ad rules are already included in this rule, you don't need to repeatedly add.**

### Quantumult X：

* **[AdRule.list](https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/AdRule.list) （More than 7000 ad rules, This rule is modified from [lhie1](https://github.com/lhie1/Rules)，and delete [ConnersHua](https://github.com/ConnersHua/Profiles) duplicate)**

* **[AdRuleTest.list](https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/AdRuleTest.list)（More than 1300 ad rules，This rule is modified from [Scomper](https://github.com/scomper/Surge). Because the original author stopped maintenance, so take over the optimization and delete some normal rules, only for testing**)

* **[Rewrite_lhie1.conf](https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/Rewrite_lhie1.conf)（More than 400 ad rewrite rules, integrate [lhie1](https://github.com/lhie1/Rules)、[onewayticket255](https://github.com/onewayticket255/Surge-Script)、[Choler](https://github.com/Choler/Surge/tree/master/Ruleset), and delete [ConnersHua](https://github.com/ConnersHua/Profiles) duplicate，you need to open MITM and trust the certificate)**

* **[Js.conf](https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/Js.conf) (Script subscription of Quantumult X TF version, the Store version is temporarily unavailable, this subscription is no longer compatible with QX1.0.0)**

* **[Js_local_WorkingCopy.conf](https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/Js_local_WorkingCopy.conf) (Local script subscriptions that need to work with Working Copy apps, this subscription can solve the problem that remote subscription cannot be made above QX 1.0.4)**

* **[Js_local_WorkingCopy_Cookie.conf](https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/Js_local_WorkingCopy_Cookie.conf) (This local subscription is used to resolve the cookie acquisition of QX task scripts, only available for QX 1.0.5 (188+) and above, you can disable it manually after use to avoid meaningless MITM.)**

* **Note !!! Note !!! Note !!! Unlike the Surge rule, the Quantumult X rule does not include the [ConnersHua](https://github.com/ConnersHua/Profiles) ad rules, you can add it yourself.**

### Rule remarks :

* **Most of these are Chinese advertising rules. overseas users may not applicable**
* **These rules only include ads. Please choose REJECT for the policy**
* **Self-use only, Update depend on mood, if you have any questions, please submit a Issues or pull request.**

---

## Disclaimer：

* **Any unlocking and decryption analysis scripts involved in the Script project released by NobyDa are only used for resource sharing and learning research. Legality, accuracy, completeness, and validity cannot be guaranteed. Please judge according to the situation itself.**

* Any user who uses the script indirectly, Including but not limited to building a VPS or spreading if a certain behavior violates the country and laws or relevant regulations, **NobyDa is not responsible for any privacy leak or other consequences caused by it.**

* **Do not use any content of the Script project for commercial or illegal purposes，otherwise, all consequences are at your own risk.**

* If any unit or individual believes that a script of the project may be suspected of infringing its rights, it shall promptly notify and **provide proof of identity, proof of ownership,** we will delete the relevant script after receiving the certification file.

* **NobyDa is not responsible for any scripting issues, including but not limited to any loss or damage caused by any script error.**

* You must completely remove the above from your computer or mobile phone within **24 hours** of downloading.

* Anyone who views this project in any way or any script that uses the Script project directly or indirectly should read this statement carefully. And NobyDa reserves the right to change or supplement this disclaimer at any time. **Once you use and reproduce any related scripts or rules of the Script project, you are deemed to have accepted this disclaimer.**

### Special thanks：
* [@sazs34](https://github.com/sazs34)
* [@lhie1](https://github.com/lhie1)
* [@Scomper](https://github.com/scomper)
* [@onewayticket255](https://github.com/onewayticket255)
* [@Choler](https://github.com/Choler)
* [@ConnersHua](https://github.com/ConnersHua)

