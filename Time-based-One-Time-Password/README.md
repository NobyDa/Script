## Desc

A time-based one-time password algorithm(TOTP), implemented entirely 100% in Javascript. 

This script complies with [RFC6238](https://datatracker.ietf.org/doc/html/rfc6238) specification and can be run in Surge, QuantumultX, Loon, Shadowrocket.



## Usage

```javascript
const key = 'YOURCLIENTTOKEN'; //TOTP key
const totp = TOTP(key); //Return a six-digit one-time password.

console.log(totp); //Print log
```



## Acknowledgements

This script is adapted from https://jsfiddle.net/russau/rbyjk774 and uses Brian Turek's [jsSHA](https://github.com/caligatio/jsSHA/).

