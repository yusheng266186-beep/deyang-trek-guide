import fs from 'node:fs';
import vm from 'node:vm';
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('trip-data.js','utf8'),sandbox);
vm.runInNewContext(fs.readFileSync('content-v2.js','utf8'),sandbox);
const trip=sandbox.window.TRIP,guide=sandbox.window.GUIDE;
const places=trip.places.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
const xml=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const points=places.map(p=>`  <wpt lat="${p.lat}" lon="${p.lon}">\n    <name>${xml(p.title)}</name>\n    <cmt>${xml(`${p.tip} 坐标仅供参考，实际入口请用高德确认。`)}</cmt>\n    <desc>${xml(`${p.category}｜${p.address}｜${p.hours}｜${p.price}。${p.intro}`)}</desc>\n    <link href="${xml(p.source)}"><text>${xml(p.sourceLabel)}</text></link>\n    <type>${xml(p.type)}</type>\n  </wpt>`).join('\n');
fs.writeFileSync('assets/deyang-trek-places.gpx',`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="德阳慢慢同行·TREK地点包" xmlns="http://www.topografix.com/GPX/1/1">\n  <metadata><name>德阳慢慢同行 · 已定位的地点</name><desc>WGS-84 地点，仅供参考；不含时间表、预订或实际导航轨迹。请在高德核对入口。</desc></metadata>\n${points}\n</gpx>\n`);
const esc=s=>String(s).replaceAll('\\','\\\\').replaceAll(';','\\;').replaceAll(',','\\,').replaceAll('\n','\\n');
function fold(line){let out='',n=0;for(const ch of line){const b=Buffer.byteLength(ch);if(n+b>73){const spaces=(out.match(/ +$/)||[''])[0];if(spaces)out=out.slice(0,-spaces.length);out+='\r\n '+spaces;n=1+spaces.length;}out+=ch;n+=b;}return out;}
function makeCalendar(routeId,path){
 const route=guide.routes[routeId],events=[...guide.days.evening.map(e=>({...e,day:'20261116'})),...route.events.map(e=>({...e,day:'20261117'}))];
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Deyang Guide//Itinerary//ZH','CALSCALE:GREGORIAN','METHOD:PUBLISH',`X-WR-CALNAME:${esc('德阳慢慢同行 · '+route.name+'（建议）')}`,'BEGIN:VTIMEZONE','TZID:Asia/Shanghai','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:+0800','TZOFFSETTO:+0800','TZNAME:CST','END:STANDARD','END:VTIMEZONE'];
 events.forEach((e,i)=>{const tm=t=>t.replace(':','')+'00';const details=`${e.description} 衔接：${e.transport} 仅为建议，不代表预订成功；返程以实际车票为准。`;lines.push('BEGIN:VEVENT',`UID:deyang-${routeId}-${e.day}-${i}@deyang-guide`,`DTSTAMP:20261115T143500Z`,`DTSTART;TZID=Asia/Shanghai:${e.day}T${tm(e.start)}`,`DTEND;TZID=Asia/Shanghai:${e.day}T${tm(e.end)}`,`SUMMARY:${esc(e.title)}`,`DESCRIPTION:${esc(details)}`,'END:VEVENT');});
 lines.push('END:VCALENDAR');fs.writeFileSync(path,lines.map(fold).join('\r\n')+'\r\n');return events.length;
}
const counts=[makeCalendar('classic','assets/deyang-calendar.ics'),makeCalendar('waterfront','assets/deyang-calendar-waterfront.ics'),makeCalendar('museum','assets/deyang-calendar-museum.ics')];
console.log(`Generated ${places.length} GPX waypoints and route calendars (${counts.join(', ')} suggested events).`);
