import fs from 'node:fs';
import vm from 'node:vm';
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('trip-data.js','utf8'),sandbox);
const places=sandbox.window.TRIP.places.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
const e=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const points=places.map(p=>`  <wpt lat="${p.lat}" lon="${p.lon}">\n    <name>${e(p.title)}</name>\n    <desc>${e(`${p.category}｜${p.address}｜${p.hours}｜${p.price}。${p.intro}`)}</desc>\n    <cmt>${e(`${p.tip} 坐标仅供参考，实际入口请用高德确认。`)}</cmt>\n    <link href="${e(p.source)}"><text>${e(p.sourceLabel)}</text></link>\n    <type>${e(p.type)}</type>\n  </wpt>`).join('\n');
const gpx=`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="德阳慢慢玩·TREK地点包" xmlns="http://www.topografix.com/GPX/1/1">\n  <metadata><name>德阳慢慢玩 · 已定位的地点</name><desc>WGS-84 地点，仅供参考；不含时间表、预订或实际导航轨迹。请在高德核对入口。</desc></metadata>\n${points}\n</gpx>\n`;
fs.writeFileSync('assets/deyang-trek-places.gpx',gpx);
const events=[
 ['20261116','180000','183000','入住文庙商圈（候选，未预订）','确认双床房价格、退房及寄存；实际以酒店订单为准。'],
 ['20261116','183000','200000','德阳晚饭：干锅或老城小吃','勇记干锅或文庙商圈小吃，营业时间先确认。'],
 ['20261117','080000','085000','早餐、退房与寄存行李','核对酒店取件时间，带好随身物品。'],
 ['20261117','090000','103000','德阳文庙：古建筑与拍照','文庙街133号；常规09:00开放，17:00停止入场。'],
 ['20261117','103000','110000','城隍庙街：凉粉或春卷','分着尝小吃，店铺营业状态需核对。'],
 ['20261117','110000','112500','步行或打车前往石刻公园','步行约20—30分钟；具体以导航为准。'],
 ['20261117','112500','121000','德阳石刻公园','石刻艺术墙、浮雕和长廊。'],
 ['20261117','121000','130000','午餐：片粉、豆花或面','先查肖记片粉是否营业，可根据实际位置就近用餐。'],
 ['20261117','130000','132500','打车去东湖山公园','车程约15—25分钟，车费仅为估算。'],
 ['20261117','132500','150000','东湖山公园：湖边散步','园区开放状态以当天公告为准。'],
 ['20261117','150000','160000','可选钟鼓楼外景，返回酒店取行李','看出口位置和体力决定是否前往。'],
 ['20261117','160000','170000','晚饭与返程前准备','两人可选同车次分别到自贡和泸州，实际车次以12306为准。']
];
const esc=s=>String(s).replaceAll('\\','\\\\').replaceAll(';','\\;').replaceAll(',','\\,').replaceAll('\n','\\n');
function fold(line){let out='',n=0;for(const ch of line){const b=Buffer.byteLength(ch);if(n+b>73){out+='\r\n ';n=1;}out+=ch;n+=b;}return out;}
const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Deyang Guide//Itinerary//ZH','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:德阳慢慢玩（建议安排）','BEGIN:VTIMEZONE','TZID:Asia/Shanghai','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:+0800','TZOFFSETTO:+0800','TZNAME:CST','END:STANDARD','END:VTIMEZONE'];
events.forEach((a,i)=>{const [day,start,end,title,desc]=a;lines.push('BEGIN:VEVENT',`UID:deyang-guide-${day}-${i}@deyang-guide`,`DTSTAMP:20261115T140000Z`,`DTSTART;TZID=Asia/Shanghai:${day}T${start}`,`DTEND;TZID=Asia/Shanghai:${day}T${end}`,`SUMMARY:${esc(title)}`,`DESCRIPTION:${esc(desc+' 仅为建议行程，不代表预订成功。')}`,'END:VEVENT');});
lines.push('END:VCALENDAR');fs.writeFileSync('assets/deyang-calendar.ics',lines.map(fold).join('\r\n')+'\r\n');
console.log(`Generated ${places.length} GPX waypoints and ${events.length} calendar suggestions.`);
