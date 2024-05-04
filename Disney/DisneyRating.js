/*********************************
Disney+ 显示IMDb评分 / 烂番茄评分 / 豆瓣评分

脚本作者: @NobyDa 
脚本兼容: Surge、QuantumultX、Loon
系统兼容: iOS14+
更新时间: 2024/05/04
脚本参考: https://github.com/yichahucha/surge/blob/master/nf_rating.js

Surge模块: 
https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Module/DisneyRating.sgmodule

QuantumultX重写引用: 
https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/DisneyRating.snippet

*********************************/

const $tool = new Tool();
const consoleLog = false;
let obj = $response.body;
let IMDbApikeys = IMDbApikeyList();
let IMDbApikey = $tool.read("ImdbApikeyCacheKey");
if (!IMDbApikey) {
    updateIMDbApikey();
}

const requestRatings = async () => {
    if (consoleLog) console.log("Disney Original Body:\n" + obj);
    obj = JSON.parse(obj);
    const sliced = obj?.data?.page?.actions?.[0]?.internalTitle?.split(' - ');
    let title = sliced?.[0] || obj?.data?.page?.visuals?.title;
    if (title) {
        title = title.replace(/.+?:\s|\s?\(.+?\)\s?/g,'');
    } else {
        throw 'NO TITLE';
    }
    const year = obj?.data?.page?.visuals?.metastringParts?.releaseYearRange?.startYear;
    const type = (sliced?.[1]?.startsWith('s') && 'series') || (sliced?.[1] == 'movie' && 'movie');
    const IMDb = await requestIMDbRating(title, year, type);
    const Douban = await requestDoubanRating(IMDb.id);
    const IMDbrating = IMDb.msg.rating;
    const tomatoes = IMDb.msg.tomatoes;
    const country = IMDb.msg.country;
    // const awards = IMDb.msg.awards;
    const doubanRating = Douban.rating;
    // const message = `${awards.length > 0 ? awards + "\n" : ""}${country}\n${IMDbrating}\n${doubanRating}${tomatoes.length > 0 ? "\n" + tomatoes + "\n" : "\n"}`;
    return { country, tomatoes, IMDbrating, doubanRating };
}

requestRatings()
    .then(data => {
        if (obj?.data?.page?.visuals) {
            obj.data.page.visuals.promoLabel = {
                promoLabelType: "generic",
                header: `${data.country}${data.tomatoes ? `\n${data.tomatoes}` : ``}`,
                subheader: `${data.IMDbrating}${data.doubanRating ? `\n${data.doubanRating}` : ``}`
            }
        }
        if (consoleLog) console.log("Disney Modified Body:\n" + JSON.stringify(obj));
    })
    .catch(error => console.log(`ERROR: ${error}`))
    .finally(() => $done({ body: typeof obj == 'object' ? JSON.stringify(obj) : obj }));

function requestDoubanRating(imdbId) {
    return new Promise(function (resolve, reject) {
        const url = `https://www.douban.com/search?cat=1002&q=${imdbId}`;
        if (consoleLog) console.log("Disney Douban Rating URL:\n" + url);
        $tool.get(url, function (error, response, data) {
            if (!error) {
                if (consoleLog) console.log("Disney Douban Rating Data:\n" + data);
                if (response.status == 200) {
                    const rating = get_douban_rating_message(data);
                    resolve({ rating });
                } else {
                    resolve({});
                }
            } else {
                console.log("Disney Douban Rating Error: " + error);
                resolve({});
            }
        });
    });
}

function requestIMDbRating(title, year, type) {
    return new Promise(function (resolve, reject) {
        let url = "https://www.omdbapi.com/?t=" + encodeURIComponent(title) + "&apikey=" + IMDbApikey;
        if (year) url += "&y=" + year;
        if (type) url += "&type=" + type;
        if (consoleLog) console.log("Disney IMDb Rating URL:\n" + url);
        $tool.get(url, function (error, response, data) {
            if (!error) {
                if (consoleLog) console.log("Disney IMDb Rating Data:\n" + data);
                if (response.status == 200) {
                    const obj = JSON.parse(data);
                    if (obj.Response == "True") {
                        const id = obj.imdbID;
                        const msg = get_IMDb_message(obj);
                        resolve({ id, msg });
                    } else {
                        reject(`Title [${title}] IMDb data not found`);
                    }
                } else if (response.status == 401) {
                    if (IMDbApikeys.length > 1) {
                        updateIMDbApikey();
                        requestIMDbRating(title, year, type);
                    } else {
                        reject(`IMDb Key invalid`);
                    }
                } else {
                    reject(`Unknown status: ${response.status}, Data: ${data}`);
                }
            } else {
                reject(`IMDB data response failed: ${error}`);
            }
        });
    });
}

function updateIMDbApikey() {
    if (IMDbApikey) IMDbApikeys.splice(IMDbApikeys.indexOf(IMDbApikey), 1);
    const index = Math.floor(Math.random() * IMDbApikeys.length);
    IMDbApikey = IMDbApikeys[index];
    $tool.write(IMDbApikey, "ImdbApikeyCacheKey");
}

function get_IMDb_message(data) {
    let rating_message = "IMDb:  ⭐️ N/A";
    let tomatoes_message = "";
    let country_message = "";
    let ratings = data.Ratings;
    let awards_message = "";
    if (data.Awards && data.Awards != "N/A") {
        awards_message = "🏆 " + data.Awards;
    }
    if (ratings.length > 0) {
        const imdb_source = ratings[0]["Source"];
        if (imdb_source == "Internet Movie Database") {
            const imdb_votes = data.imdbVotes;
            const imdb_rating = ratings[0]["Value"];
            rating_message = "IMDb:  ⭐️ " + imdb_rating + "   " + imdb_votes;
            if (data.Type == "movie") {
                if (ratings.length > 1) {
                    const source = ratings[1]["Source"];
                    if (source == "Rotten Tomatoes") {
                        const tomatoes = ratings[1]["Value"];
                        tomatoes_message = "Tomatoes:  🍅 " + tomatoes;
                    }
                }
            }
        }
    }
    country_message = get_country_message(data.Country);
    return { rating: rating_message, tomatoes: tomatoes_message, country: country_message, awards: awards_message }
}

function get_douban_rating_message(data) {
    const s = data.replace(/\n| |&#\d{2}/g, '')
        .match(/\[(\u7535\u5f71|\u7535\u89c6\u5267)\].+?subject-cast\">.+?<\/span>/g);
    const average = s ? s[0].split(/">(\d\.\d)</)[1] || '' : '';
    const numRaters = s ? s[0].split(/(\d+)\u4eba\u8bc4\u4ef7/)[1] || '' : '';
    const rating_message = `Douban:  ⭐️ ${average ? average + "/10" : "N/A"}   ${!numRaters ? "" : parseFloat(numRaters).toLocaleString()}`;
    return average && rating_message;
}

function get_country_message(data) {
    const country = data;
    const countrys = country.split(", ");
    let emoji_country = "";
    countrys.forEach(item => {
        emoji_country += countryEmoji(item) + " " + item + ", ";
    });
    return emoji_country.slice(0, -2);
}

// function errorTip() {
//     return { noData: "⭐️ N/A", error: "❌ N/A" }
// }

function IMDbApikeyList() {
    const apikeys = [
        "f75e0253", "d8bb2d6b",
        "ae64ce8d", "7218d678",
        "b2650e38", "8c4a29ab",
        "9bd135c2", "953dbabe",
        "1a66ef12", "3e7ea721",
        "457fc4ff", "d2131426",
        "9cc1a9b7", "e53c2c11",
        "f6dfce0e", "b9db622f",
        "e6bde2b9", "d324dbab",
        "d7904fa3", "aeaf88b9",
        "4e89234e",];
    return apikeys;
}

function countryEmoji(name) { const emojiMap = { "Chequered": "🏁", "Triangular": "🚩", "Crossed": "🎌", "Black": "🏴", "White": "🏳", "Rainbow": "🏳️‍🌈", "Pirate": "🏴‍☠️", "Ascension Island": "🇦🇨", "Andorra": "🇦🇩", "United Arab Emirates": "🇦🇪", "Afghanistan": "🇦🇫", "Antigua & Barbuda": "🇦🇬", "Anguilla": "🇦🇮", "Albania": "🇦🇱", "Armenia": "🇦🇲", "Angola": "🇦🇴", "Antarctica": "🇦🇶", "Argentina": "🇦🇷", "American Samoa": "🇦🇸", "Austria": "🇦🇹", "Australia": "🇦🇺", "Aruba": "🇦🇼", "Åland Islands": "🇦🇽", "Azerbaijan": "🇦🇿", "Bosnia & Herzegovina": "🇧🇦", "Barbados": "🇧🇧", "Bangladesh": "🇧🇩", "Belgium": "🇧🇪", "Burkina Faso": "🇧🇫", "Bulgaria": "🇧🇬", "Bahrain": "🇧🇭", "Burundi": "🇧🇮", "Benin": "🇧🇯", "St. Barthélemy": "🇧🇱", "Bermuda": "🇧🇲", "Brunei": "🇧🇳", "Bolivia": "🇧🇴", "Caribbean Netherlands": "🇧🇶", "Brazil": "🇧🇷", "Bahamas": "🇧🇸", "Bhutan": "🇧🇹", "Bouvet Island": "🇧🇻", "Botswana": "🇧🇼", "Belarus": "🇧🇾", "Belize": "🇧🇿", "Canada": "🇨🇦", "Cocos (Keeling) Islands": "🇨🇨", "Congo - Kinshasa": "🇨🇩", "Congo": "🇨🇩", "Central African Republic": "🇨🇫", "Congo - Brazzaville": "🇨🇬", "Switzerland": "🇨🇭", "Côte d’Ivoire": "🇨🇮", "Cook Islands": "🇨🇰", "Chile": "🇨🇱", "Cameroon": "🇨🇲", "China": "🇨🇳", "Colombia": "🇨🇴", "Clipperton Island": "🇨🇵", "Costa Rica": "🇨🇷", "Cuba": "🇨🇺", "Cape Verde": "🇨🇻", "Curaçao": "🇨🇼", "Christmas Island": "🇨🇽", "Cyprus": "🇨🇾", "Czechia": "🇨🇿", "Czech Republic": "🇨🇿", "Germany": "🇩🇪", "Diego Garcia": "🇩🇬", "Djibouti": "🇩🇯", "Denmark": "🇩🇰", "Dominica": "🇩🇲", "Dominican Republic": "🇩🇴", "Algeria": "🇩🇿", "Ceuta & Melilla": "🇪🇦", "Ecuador": "🇪🇨", "Estonia": "🇪🇪", "Egypt": "🇪🇬", "Western Sahara": "🇪🇭", "Eritrea": "🇪🇷", "Spain": "🇪🇸", "Ethiopia": "🇪🇹", "European Union": "🇪🇺", "Finland": "🇫🇮", "Fiji": "🇫🇯", "Falkland Islands": "🇫🇰", "Micronesia": "🇫🇲", "Faroe Islands": "🇫🇴", "France": "🇫🇷", "Gabon": "🇬🇦", "United Kingdom": "🇬🇧", "UK": "🇬🇧", "Grenada": "🇬🇩", "Georgia": "🇬🇪", "French Guiana": "🇬🇫", "Guernsey": "🇬🇬", "Ghana": "🇬🇭", "Gibraltar": "🇬🇮", "Greenland": "🇬🇱", "Gambia": "🇬🇲", "Guinea": "🇬🇳", "Guadeloupe": "🇬🇵", "Equatorial Guinea": "🇬🇶", "Greece": "🇬🇷", "South Georgia & South Sandwich Is lands": "🇬🇸", "Guatemala": "🇬🇹", "Guam": "🇬🇺", "Guinea-Bissau": "🇬🇼", "Guyana": "🇬🇾", "Hong Kong SAR China": "🇭🇰", "Hong Kong": "🇭🇰", "Heard & McDonald Islands": "🇭🇲", "Honduras": "🇭🇳", "Croatia": "🇭🇷", "Haiti": "🇭🇹", "Hungary": "🇭🇺", "Canary Islands": "🇮🇨", "Indonesia": "🇮🇩", "Ireland": "🇮🇪", "Israel": "🇮🇱", "Isle of Man": "🇮🇲", "India": "🇮🇳", "British Indian Ocean Territory": "🇮🇴", "Iraq": "🇮🇶", "Iran": "🇮🇷", "Iceland": "🇮🇸", "Italy": "🇮🇹", "Jersey": "🇯🇪", "Jamaica": "🇯🇲", "Jordan": "🇯🇴", "Japan": "🇯🇵", "Kenya": "🇰🇪", "Kyrgyzstan": "🇰🇬", "Cambodia": "🇰🇭", "Kiribati": "🇰🇮", "Comoros": "🇰🇲", "St. Kitts & Nevis": "🇰🇳", "North Korea": "🇰🇵", "South Korea": "🇰🇷", "Kuwait": "🇰🇼", "Cayman Islands": "🇰🇾", "Kazakhstan": "🇰🇿", "Laos": "🇱🇦", "Lebanon": "🇱🇧", "St. Lucia": "🇱🇨", "Liechtenstein": "🇱🇮", "Sri Lanka": "🇱🇰", "Liberia": "🇱🇷", "Lesotho": "🇱🇸", "Lithuania": "🇱🇹", "Luxembourg": "🇱🇺", "Latvia": "🇱🇻", "Libya": "🇱🇾", "Morocco": "🇲🇦", "Monaco": "🇲🇨", "Moldova": "🇲🇩", "Montenegro": "🇲🇪", "St. Martin": "🇲🇫", "Madagascar": "🇲🇬", "Marshall Islands": "🇲🇭", "North Macedonia": "🇲🇰", "Mali": "🇲🇱", "Myanmar (Burma)": "🇲🇲", "Mongolia": "🇲🇳", "Macau Sar China": "🇲🇴", "Northern Mariana Islands": "🇲🇵", "Martinique": "🇲🇶", "Mauritania": "🇲🇷", "Montserrat": "🇲🇸", "Malta": "🇲🇹", "Mauritius": "🇲🇺", "Maldives": "🇲🇻", "Malawi": "🇲🇼", "Mexico": "🇲🇽", "Malaysia": "🇲🇾", "Mozambique": "🇲🇿", "Namibia": "🇳🇦", "New Caledonia": "🇳🇨", "Niger": "🇳🇪", "Norfolk Island": "🇳🇫", "Nigeria": "🇳🇬", "Nicaragua": "🇳🇮", "Netherlands": "🇳🇱", "Norway": "🇳🇴", "Nepal": "🇳🇵", "Nauru": "🇳🇷", "Niue": "🇳🇺", "New Zealand": "🇳🇿", "Oman": "🇴🇲", "Panama": "🇵🇦", "Peru": "🇵🇪", "French Polynesia": "🇵🇫", "Papua New Guinea": "🇵🇬", "Philippines": "🇵🇭", "Pakistan": "🇵🇰", "Poland": "🇵🇱", "St. Pierre & Miquelon": "🇵🇲", "Pitcairn Islands": "🇵🇳", "Puerto Rico": "🇵🇷", "Palestinian Territories": "🇵🇸", "Portugal": "🇵🇹", "Palau": "🇵🇼", "Paraguay": "🇵🇾", "Qatar": "🇶🇦", "Réunion": "🇷🇪", "Romania": "🇷🇴", "Serbia": "🇷🇸", "Russia": "🇷🇺", "Rwanda": "🇷🇼", "Saudi Arabia": "🇸🇦", "Solomon Islands": "🇸🇧", "Seychelles": "🇸🇨", "Sudan": "🇸🇩", "Sweden": "🇸🇪", "Singapore": "🇸🇬", "St. Helena": "🇸🇭", "Slovenia": "🇸🇮", "Svalbard & Jan Mayen": "🇸🇯", "Slovakia": "🇸🇰", "Sierra Leone": "🇸🇱", "San Marino": "🇸🇲", "Senegal": "🇸🇳", "Somalia": "🇸🇴", "Suriname": "🇸🇷", "South Sudan": "🇸🇸", "São Tomé & Príncipe": "🇸🇹", "El Salvador": "🇸🇻", "Sint Maarten": "🇸🇽", "Syria": "🇸🇾", "Swaziland": "🇸🇿", "Tristan Da Cunha": "🇹🇦", "Turks & Caicos Islands": "🇹🇨", "Chad": "🇹🇩", "French Southern Territories": "🇹🇫", "Togo": "🇹🇬", "Thailand": "🇹🇭", "Tajikistan": "🇹🇯", "Tokelau": "🇹🇰", "Timor-Leste": "🇹🇱", "Turkmenistan": "🇹🇲", "Tunisia": "🇹🇳", "Tonga": "🇹🇴", "Turkey": "🇹🇷", "Trinidad & Tobago": "🇹🇹", "Tuvalu": "🇹🇻", "Taiwan": "🇨🇳", "Tanzania": "🇹🇿", "Ukraine": "🇺🇦", "Uganda": "🇺🇬", "U.S. Outlying Islands": "🇺🇲", "United Nations": "🇺🇳", "United States": "🇺🇸", "USA": "🇺🇸", "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿", "Vatican City": "🇻🇦", "St. Vincent & Grenadines": "🇻🇨", "Venezuela": "🇻🇪", "British Virgin Islands": "🇻🇬", "U.S. Virgin Islands": "🇻🇮", "Vietnam": "🇻🇳", "Vanuatu": "🇻🇺", "Wallis & Futuna": "🇼🇫", "Samoa": "🇼🇸", "Kosovo": "🇽🇰", "Yemen": "🇾🇪", "Mayotte": "🇾🇹", "South Africa": "🇿🇦", "Zambia": "🇿🇲", "Zimbabwe": "🇿🇼", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", }; return emojiMap[name] ? emojiMap[name] : emojiMap["Chequered"] }

function Tool() {
    _node = (() => {
        if (typeof require == "function") {
            const request = require('request')
            return ({ request })
        } else {
            return (null)
        }
    })()
    _isSurge = typeof $httpClient != "undefined"
    _isQuanX = typeof $task != "undefined"
    this.isSurge = _isSurge
    this.isQuanX = _isQuanX
    this.isResponse = typeof $response != "undefined"
    this.notify = (title, subtitle, message) => {
        if (_isQuanX) $notify(title, subtitle, message)
        if (_isSurge) $notification.post(title, subtitle, message)
        if (_node) console.log(JSON.stringify({ title, subtitle, message }));
    }
    this.write = (value, key) => {
        if (_isQuanX) return $prefs.setValueForKey(value, key)
        if (_isSurge) return $persistentStore.write(value, key)
    }
    this.read = (key) => {
        if (_isQuanX) return $prefs.valueForKey(key)
        if (_isSurge) return $persistentStore.read(key)
    }
    this.get = (options, callback) => {
        if (_isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => { callback(null, _status(response), response.body) }, reason => callback(reason.error, null, null))
        }
        if (_isSurge) $httpClient.get(options, (error, response, body) => { callback(error, _status(response), body) })
        if (_node) _node.request(options, (error, response, body) => { callback(error, _status(response), body) })
    }
    this.post = (options, callback) => {
        if (_isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => { callback(null, _status(response), response.body) }, reason => callback(reason.error, null, null))
        }
        if (_isSurge) $httpClient.post(options, (error, response, body) => { callback(error, _status(response), body) })
        if (_node) _node.request.post(options, (error, response, body) => { callback(error, _status(response), body) })
    }
    _status = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
}
