# 慢慢同行 · 德阳两人旅行手记 / Deyang Weekend Field Guide

[中文](#zh) · [English](#en) · [在线路书 / Open guide](https://yusheng266186-beep.github.io/deyang-trek-guide/)

<a id="zh"></a>

## 中文

一份为 2026 年 11 月 16–17 日设计的双人手机路书。以德阳市区为中心，提供三套路书、地点地图、预算和行前清单。行程中的日期和票价是这次计划的参考快照。

| 路线 | 适合的节奏 | 可导入日历 |
| --- | --- | --- |
| 经典市区 | 以文庙、市区餐饮和德阳站返程为主，留出机动时间。 | [市区 ICS](assets/deyang-calendar.ics) |
| 旌湖慢走 | 用散步和休息安排在地体验，减少赶点。 | [旌湖 ICS](assets/deyang-calendar-waterfront.ics) |
| 三星堆专程 | 为广汉往返、预约窗口和参观另留时间与交通预算。 | [三星堆 ICS](assets/deyang-calendar-museum.ics) |

### 怎么使用

1. 在首页选路线。对照住宿点全季酒店（德阳文庙广场店）和德阳站返程，倒推取行李、跨城交通和出发时间。
2. 在「地点地图」筛选景点、美食、住宿与车站。数字聚合可放大查看，「包含广汉」将三星堆一起放入视野。虚线标记表示大致范围，缺少可靠坐标的条目可从清单搜索。
3. 下载 [地点 GPX](assets/deyang-trek-places.gpx)，导入 TREK 的 **Places**。行程日历从上表任选一份。GPX 提供地点标记，ICS 提供计划时段，实际预订和车票提醒由各自服务管理。
4. 微信里可以在卡片中查看跳转引导，先从右上角选择「在浏览器打开」，再尝试打开高德 App。网页地图路线和复制链接可作为备选。分享链接可回到同一条路线、参考车次和地点。预算、收藏、清单和减少动效设置保存在当前浏览器。

### 地图与离线

地图默认使用高德道路底图，支持手动切换 OpenStreetMap / Protomaps 备用底图。切换会同步转换标记坐标。地点入口、跨城时间、开放、营业和预约情况以当日导航和官方信息为准。酒店、美食资料的补充查阅日期为 2026 年 11 月 16 日，图片来源随内容标注。

联网打开且离线缓存安装成功后，可离线查看已缓存的文字、基础界面和地点包。底图、天气以及外部图片通常依赖网络。微信和 Android 浏览器上的地图唤起受客户端及手机设置影响。

### 本地运行与维护

在仓库根目录运行：

~~~bash
python3 -m http.server 8080
~~~

从 <http://localhost:8080/> 预览。更新 <code>trip-data.js</code> 或 <code>content-v2.js</code> 后运行 <code>node generate-assets.mjs</code> 重建 GPX 与三份 ICS。检查三条路线、地点切换、分享恢复和离线首访后的缓存行为。仓库是独立静态网站，可通过 GitHub Pages 发布。

<a id="en"></a>

## English

A mobile companion for a two-person trip to Deyang on November 16–17, 2026. The guide combines three adjusted itineraries with a map, a budget, and a checklist. Schedules and prices are planning snapshots from that trip.

| Route | Best for | Calendar |
| --- | --- | --- |
| Central Deyang | A flexible city route around the Confucian Temple, local food, and the railway station. | [City ICS](assets/deyang-calendar.ics) |
| Jinghu waterfront | Slower walks and time to rest between stops. | [Waterfront ICS](assets/deyang-calendar-waterfront.ics) |
| Sanxingdui visit | A separate visit with booking, travel to Guanghan, and time at the museum accounted for. | [Museum ICS](assets/deyang-calendar-museum.ics) |

### Use the guide

1. Select an itinerary and work backward from your confirmed departure time, allowing for luggage pickup and travel across town.
2. Filter the map by sights, food, hotel, or station. Expand clusters or locate places from the list. Include Guanghan to show Sanxingdui alongside Deyang. Dashed markers indicate approximate areas. Listings with uncertain coordinates stay in the searchable list.
3. Import the [GPX place pack](assets/deyang-trek-places.gpx) into **Places** in TREK. Choose one ICS above for proposed time slots. Confirm reservations and tickets with the relevant provider.
4. On WeChat, follow the card guidance to open the link in a browser and then in Amap where available. Web map links and copying remain available. A share link carries route, reference train, and selected place. Budget, favorites, checklists, and motion preferences stay in the current browser.

### Map, offline use, and development

Amap is the default base map. The OpenStreetMap / Protomaps fallback uses a different coordinate system, and markers are converted when switching. After a successful online visit has installed the browser cache, the cached text, basic interface, and place pack can be used offline. Map tiles, weather, and most externally hosted images depend on network access. Confirm hours, entrances, bookings, and transit with current sources.

Run <code>python3 -m http.server 8080</code> in the repository root for local preview. <code>trip-data.js</code> and <code>content-v2.js</code> hold the route and place content. <code>node generate-assets.mjs</code> rebuilds the GPX and three calendar files. Check all routes, map switching, share-link restoration, and offline reopening before publishing.

## 许可与来源 / License and credits

项目原创网页、交互和导出脚本采用 [MIT](LICENSE)。行程内容及其 GPX/ICS 数据、路线和景点资料、照片和地图资源各自保留原有权利或服务条款。随仓库分发的 Leaflet、MarkerCluster 和 Protomaps 许可文本见 [assets/vendor](assets/vendor/)。

The project's original web, interaction, and export code is under [MIT](LICENSE). Itinerary content and derived GPX/ICS data, photos, place information, and map services retain their respective rights or terms. License texts for the bundled Leaflet, MarkerCluster, and Protomaps components are in [assets/vendor](assets/vendor/).
