window.GUIDE = {
  days: {
    evening: [
      {start:'18:00',end:'18:30',title:'入住文庙商圈',tag:'先放行李',description:'选文庙广场 / 庙街附近的双床房；与前台确认次日退房、行李寄存和最晚取件时间。到得晚就整体顺延。',transport:'已在德阳：从当前位置按酒店实际地址叫车。房间及价格尚未预订。',place:'starway'},
      {start:'18:30',end:'20:00',title:'干锅晚饭，或逛老城小吃',tag:'二选一',description:'勇记干锅居可先问双人份、糯香或少辣；也可在文庙商圈吃热面、豆花，留点肚子给次日的小吃。',transport:'酒店与店铺距离取决于实际所选门店；高德核对营业状态，晚到建议电话确认。',place:'yongji'},
      {start:'20:00',end:'21:00',title:'文庙广场附近散步',tag:'随时回酒店',description:'看老城、买水和次日早餐；11 月 16 日是周一，文庙内部通常闭馆，次日上午再进去。',transport:'步行只走明亮、有人流的路段，回酒店前确认两人手机电量。',place:'wenmiao'}
    ]
  },
  routes: {
    classic:{name:'经典市区线',short:'文庙 · 石刻 · 东湖山',badge:'推荐',summary:'第一次来德阳：一座古建、一段石刻，再去湖边慢走。',note:'适合想拍照、散步且不想跨城的两人；全程可按体力打车。',stops:['wenmiao','stone','eastlake','station'],events:[
      {start:'08:00',end:'08:50',title:'早餐、退房并寄存行李',tag:'文庙商圈',description:'可以试一碗油茶或热面；退房寄存后，确认下午取行李的最晚时间，证件和充电宝随身。',transport:'酒店 → 文庙：视酒店位置步行或短途打车，09:00 前抵达。',place:'wenmiao'},
      {start:'09:00',end:'10:20',title:'德阳文庙 · 红墙与古建筑',tag:'游览约 80 分钟',description:'从万仞宫墙、棂星门到泮池和大成殿；两人轮流拍照，想听故事可使用馆方语音导览。周二常规 09:00 开门。',transport:'入口及开放以当天现场为准；免费，17:00 停止入场。',place:'wenmiao'},
      {start:'10:20',end:'11:10',title:'老城小吃与补水',tag:'可选 1—2 样',description:'城隍庙街找王凉粉、伤心春卷；更想吃片粉可改去庆云街肖记。两人分食，避免之后午饭吃不下。',transport:'从文庙步行前往；摊位、排队和营业状态以当天为准。',place:'wang'},
      {start:'11:10',end:'11:40',title:'前往石刻公园',tag:'步行 / 短途打车',description:'选一个离当前位置合适的入口；步行约 20—30 分钟，或叫车约 5—10 分钟，时间随入口变化。',transport:'从小吃街出发，雨天或不想走路可打车；到达稍晚就从石刻游览中调整。',place:'stone'},
      {start:'11:40',end:'12:40',title:'石刻公园 · 近看雕刻长廊',tag:'游览约 60 分钟',description:'按入口挑选一段石刻艺术墙，看人物浮雕、龙柱和廊道；它是现代城市艺术作品，不是古代遗址。',transport:'园区较长，建议单向挑重点走，不必折返走完全程。',place:'stone'},
      {start:'12:40',end:'13:20',title:'午饭：就近吃一顿热的',tag:'石刻附近',description:'在石刻出口附近选豆花、面食或家常菜。肖记在庆云街，离石刻出口有一段路；若上午已吃过，不必再绕回。',transport:'先在当前出口搜索营业中的餐馆，按实际排队调整；吃得慢可压缩下午散步。',place:'xiao'},
      {start:'13:20',end:'13:45',title:'打车去东湖山公园',tag:'预计 15—25 分钟',description:'目的地选东湖山公园合适入口，约 ¥15—30 / 车；费用和时间以叫车页面为准。',transport:'遇到堵车、雨天或叫车慢，弹性预留 10—15 分钟。',place:'eastlake'},
      {start:'13:45',end:'15:15',title:'东湖山 · 水岸与树影',tag:'慢走约 90 分钟',description:'选湖边、观鱼塘或水杉林一段散步，累了找座位休息；11 月中旬红叶与水位不保证。',transport:'不同出口距离相差较大，准备离开前先确认打车上车点。',place:'eastlake'},
      {start:'15:15',end:'16:00',title:'可看钟鼓楼，再回酒店取行李',tag:'钟鼓楼可跳过',description:'体力充足且出口顺路时拍钟鼓楼外景；若导航显示绕路较多，直接返回酒店。取包后检查证件、充电线与随身物品。',transport:'东湖山 → 酒店商圈打车约 15—25 分钟，费用及入口以实时导航为准。',place:'bell'},
      {start:'16:00',end:'17:00',title:'晚饭与出发缓冲',tag:'按车次倒推',description:'早班车建议 17:10—17:25 从文庙商圈出发；晚班车可以吃得从容一些，但仍要预留打车、安检与候车。',transport:'酒店商圈 → 德阳站打车估计 20—30 分钟，建议开车前 30—45 分钟到站。',place:'station'}
    ]},
    waterfront:{name:'旌湖慢走线',short:'文庙 · 石刻 · 旌湖',badge:'备选 01',summary:'保留老城与石刻，把东湖山换成彩虹桥、旌湖绿道。',note:'更偏水岸和轻松聊天；可从石刻附近按当前出口选接驳方式。',stops:['wenmiao','stone','jinghu','station'],events:[
      {start:'08:00',end:'08:50',title:'早餐、退房并寄存行李',tag:'文庙商圈',description:'退房时确认下午取件时间，身份证和充电设备随身。',transport:'酒店 → 文庙按实际位置步行或打车。',place:'wenmiao'},
      {start:'09:00',end:'10:20',title:'德阳文庙',tag:'古建筑 / 拍照',description:'看红墙、泮池、礼乐亭和大成殿；官方语音导览可自由选择。',transport:'周二常规开放，临时调整以馆方公告为准。',place:'wenmiao'},
      {start:'10:20',end:'11:10',title:'城隍庙街小吃',tag:'分着吃',description:'王凉粉与伤心春卷挑喜欢的；想吃片粉可去庆云街肖记，辣度提前说明。',transport:'依实际出发点步行，店铺售罄或搬迁时就近换店。',place:'wang'},
      {start:'11:10',end:'11:40',title:'去石刻公园',tag:'步行 / 打车',description:'导航到合适入口，步行约 20—30 分钟，或短途打车。',transport:'以当前店铺和入口距离为准。',place:'stone'},
      {start:'11:40',end:'12:35',title:'石刻公园',tag:'游览约 55 分钟',description:'看长廊、浮雕和石柱，不必走完全部艺术墙。',transport:'离开前看园区出口，避免带着步行路线绕回。',place:'stone'},
      {start:'12:35',end:'13:20',title:'午饭与休息',tag:'就近热食',description:'找豆花、面或两人家常菜，时间不够可把咖啡换为外带。',transport:'以实际出口附近餐馆为准。',place:'stone'},
      {start:'13:20',end:'13:45',title:'前往旌湖彩虹桥 / 旌湖客厅',tag:'按出口导航',description:'选择彩虹桥东侧、旌湖客厅或一处便利的滨水入口，打车或步行。',transport:'高德确认当前位置；时间为估算，不指定一个固定上车点。',place:'jinghu'},
      {start:'13:45',end:'15:15',title:'旌湖绿道慢走',tag:'替代东湖山',description:'沿水岸走一小段，在观景平台坐坐、拍桥与城市；游船可咨询，班次与价格未核实。',transport:'优先平坦明亮路段，雨天不靠近湿滑岸边。',place:'jinghu'},
      {start:'15:15',end:'16:00',title:'回酒店取行李',tag:'提前整理',description:'到酒店取包，检查身份证、充电器及各自车票。',transport:'按实际滨水出口叫车，预留等待时间。',place:'starway'},
      {start:'16:00',end:'17:00',title:'晚饭、休息与出发缓冲',tag:'按车次倒推',description:'早班 G969 建议 17:10—17:25 从文庙商圈出发；晚班可多留休息时间。',transport:'去德阳站打车估计 20—30 分钟，再留 30—45 分钟到站安检。',place:'station'}
    ]},
    museum:{name:'三星堆专程线',short:'广汉博物馆 · 市区返程',badge:'备选 02',summary:'把整天重点改成古蜀文明，适合更想看博物馆的两人。',note:'需先预约 17 日门票，并接受跨城往返车费；不再叠加文庙、石刻和东湖山。',stops:['sanxingdui','station'],events:[
      {start:'08:00',end:'08:45',title:'早餐、退房并寄存行李',tag:'文庙商圈',description:'带身份证、充电宝；酒店寄存行李，并确认下午能按时取回。',transport:'前一晚先落实 17 日实名门票及往返叫车方案。',place:'starway'},
      {start:'08:45',end:'10:00',title:'打车前往三星堆博物馆',tag:'跨城 / 提前出发',description:'从德阳市区去广汉，先在叫车软件查看实际价格及路况；预留约 45—75 分钟，遇堵再增加。',transport:'目的地为「三星堆博物馆」，不是「三星堆站」。两人共乘费用按叫车页确认。',place:'sanxingdui'},
      {start:'10:00',end:'13:00',title:'三星堆博物馆',tag:'至少预留 3 小时',description:'按预约时段入馆，重点看青铜大面具、青铜神树和古蜀展陈；展品、展厅可能临时调整。',transport:'普通票及预约均以官方小程序为准；无票时改回市区路线。',place:'sanxingdui'},
      {start:'13:00',end:'13:45',title:'博物馆附近午餐',tag:'先吃再返程',description:'挑就近营业的面食或简餐；不要把广汉城区餐馆默认当作步行可达。',transport:'以场馆出口及地图上的营业信息为准。',place:'sanxingdui'},
      {start:'13:45',end:'15:00',title:'打车返回德阳市区',tag:'预留 45—75 分钟',description:'回原酒店寄存处取行李；叫不到车、下雨或拥堵时立即提前离馆。',transport:'建议先查看返程叫车需求与报价，不将跨城公交作为保底。',place:'starway'},
      {start:'15:00',end:'15:30',title:'取行李与整理',tag:'返回酒店',description:'核对两人的身份证、车票、充电器和接站安排。',transport:'酒店寄存、取件时间以实际预订为准。',place:'starway'},
      {start:'15:30',end:'16:40',title:'提前晚饭，等待出发',tag:'为返程留余量',description:'在酒店商圈吃饭或外带，早班 G969 计划 17:10—17:25 离开商圈；晚班可再休息。',transport:'酒店 → 德阳站打车约 20—30 分钟，到站预留 30—45 分钟进站。',place:'station'}
    ]}
  },
  galleries: {
    wenmiao:[
      {url:'https://dimg04.c-ctrip.com/images/0104l12000874eooy4F13_W_640_10000.jpg?proc=autoorient',alt:'德阳文庙万仞宫墙',label:'万仞宫墙 · 携程',source:'https://you.ctrip.com/sight/deyang462/127962.html'},
      {url:'https://dimg04.c-ctrip.com/images/01035120008s001pxD976_W_1024_0_Q90.jpg?proc=autoorient',alt:'德阳文庙石桥与池水',label:'池桥一角 · 携程游记',source:'https://you.ctrip.com/travels/deyang462/4020228.html'},
      {url:'https://newbbs-fd.zol-img.com.cn/t_s1200x5000/g7/M00/0C/0F/ChMkK2Zb1G2IDYPHABHoIvqAToQAAe0uwMSBaIAEeg6079.jpg',alt:'德阳文庙入口与庭院',label:'入口与庭院 · 中关村在线',source:'https://bbs.zol.com.cn/dcbbs/d17_81167.html'}
    ],
    stone:[
      {url:'https://imgcdn.scol.com.cn/NEWS_B94BBD70D9EAFE3EB5005CCC3CD2AF12.JPG',alt:'德阳石刻公园人物浮雕',label:'艺术墙 · 四川在线',source:'https://sichuan.scol.com.cn/ggxw/202108/58245371.html'},
      {url:'https://k.sinaimg.cn/n/sinakd20116/425/w700h525/20220712/1aab-f7ab58f68d99a8bdef212025f7783673.jpg/w700d1q75cms.jpg',alt:'德阳石刻艺术长廊与石柱',label:'石柱长廊 · 新浪新闻',source:'https://k.sina.com.cn/article_1417305894_547a5f26001016t9f.html'},
      {url:'https://k.sinaimg.cn/n/sinakd20116/425/w700h525/20220712/22ac-24f562629d8d9832caeabc8bcdb6a92d.jpg/w700d1q75cms.jpg',alt:'德阳石刻公园浮雕墙',label:'浮雕近景 · 新浪新闻',source:'https://k.sina.com.cn/article_1417305894_547a5f26001016t9f.html'}
    ],
    eastlake:[
      {url:'https://p3.itc.cn/q_70/images01/20210630/0d8259bfa8ab4bf8839b14ed00db6916.jpeg',alt:'东湖山公园湖边步道',label:'湖边步道 · 搜狐',source:'https://www.sohu.com/a/474834502_120645599'},
      {url:'https://x0.ifengimg.com/res/2024/FF3EEC8F83BA38EBA5534A96020D45F43E6B8190_size186_w1000_h562.jpg',alt:'东湖山公园秋冬水杉林，颜色随季节变化',label:'水杉林往年秋景 · 凤凰网',source:'https://baby.ifeng.com/c/8fl4lLnOHdn'},
      {url:'https://images.china.cn/site1000/2024-12/30/117636741_a39aafe2-34b8-494c-a035-665db639ae4c.jpeg',alt:'东湖山公园往年水杉林景观',label:'往年 12 月树色 · 中国网',source:'https://photo.china.com.cn/2024-12/30/content_117636741.shtml'}
    ],
    bell:[{url:'https://dimg04.c-ctrip.com/images/0101d1200092m33oi2501_W_750_0.jpg?proc=autoorient',alt:'德阳钟鼓楼与台阶',label:'钟鼓楼外观 · 携程',source:'https://gs.ctrip.com/html5/you/sight/deyang462/69289663.html'}],
    jinghu:[
      {url:'https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1404/01/c5/32689642_32689642_1396337895906.jpg',alt:'旌湖桥梁和城市的历史夜景',label:'旌湖夜景旧照 · 太平洋摄影',source:'https://dp.pconline.com.cn/dphoto/list_3290109.html'},
      {url:'https://www.dytyzx.gov.cn/uploads/images/20220824/2a5d6263899b993b73460053a4e80aeb.jpg',alt:'旌湖两岸绿道历史图片',label:'绿道参考 · 德阳市委统战部',source:'https://www.dytyzx.gov.cn/shows/14/690.html'}
    ],
    sanxingdui:[
      {url:'https://imagepphcloud.thepaper.cn/pph/image/261/611/829.jpg',alt:'三星堆博物馆新馆建筑与周围景观的航拍图',label:'新馆航拍 · 澎湃新闻',source:'https://www.thepaper.cn/newsDetail_forward_23880607'},
      {url:'https://imgcdn.scol.com.cn/media/2025/10/07/203623156206.jpg',alt:'三星堆博物馆青铜人像展陈',label:'青铜展陈 · 四川在线 / 唐茜',source:'https://sichuan.scol.com.cn/ggxw/202510/83132664.html'},
      {url:'https://imgcdn.scol.com.cn/NEWS_A6163A0EAC8E5A33BC3726B5B8D7BB6D.JPG',alt:'三星堆青铜面具展示历史图片',label:'青铜面具 · 四川在线',source:'https://sichuan.scol.com.cn/ggxw/202202/58416237.html'}
    ],
    station:[
      {url:'https://n.sinaimg.cn/sinacn20122/747/w1080h467/20190201/d37b-hsmkfyn4857411.png',alt:'德阳站红色站房与站前广场的旧照',label:'站房与广场旧照 · 新浪新闻',source:'https://k.sina.com.cn/article_1951876790_745746b600100gwa7.html'},
      {url:'https://n.sinaimg.cn/sinakd20260205s/80/w960h720/20260205/3e59-b9ea5c62b87c798ed53f2e4a97cb5025.png',alt:'德阳站候车厅安检通道，2026 年春运期间',label:'安检区 · 西南商报 / 新浪',source:'https://finance.sina.com.cn/wm/2026-02-05/doc-inhkuimf5817102.shtml'}
    ]
  },
  foodGroups:[
    {id:'breakfast',label:'早餐暖胃',intro:'先吃热的，再慢慢出门。',items:[
      {name:'谢婆婆油茶',kind:'早餐店候选',where:'城隍庙街 46 号，上午营业可能售罄',desc:'米香油茶加馓子、花生和黄豆，咸香暖胃；可先问是否加花生。',img:'https://q5.itc.cn/images01/20260829/eb6be9de37ca42e89bf7192632608174.jpeg',source:'https://www.sohu.com/a/1066200081_701119',map:'谢婆婆油茶 德阳城隍庙街'},
      {name:'什邡米粉',img:'https://p2.itc.cn/images01/20230428/088d31c2e72e4ceeb47a49b79951e8d9.jpeg',imageSource:'https://www.sohu.com/a/671277383_478015',imageCaption:'什邡米粉 · 德阳风味报道配图，仅供参考',kind:'德阳地区风味',where:'在市区搜索附近营业门店',desc:'骨汤、米粉搭配肉臊或浇头，想吃热乎的可以作为早餐；具体做法看店家。',source:'https://cbgc.scol.com.cn/home/6821244',map:'德阳 什邡米粉'},
      {name:'粉子醪糟',img:'https://imagepphcloud.thepaper.cn/pph/image/274/244/919.jpg',imageSource:'https://m.thepaper.cn/newsDetail_forward_24942445',imageCaption:'醪糟粉子 · 澎湃新闻，图片署名视觉中国；四川风味参考',kind:'甜口热食',where:'早餐店或小吃店询问',desc:'糯米醪糟搭配软糯粉子，适合想吃甜暖口的人；口味和供货以店内为准。',source:'https://m.maigoo.com/top/426730.html',map:'德阳 粉子醪糟'}
    ]},
    {id:'snack',label:'街巷小吃',intro:'两人分着吃，更有余地尝别的。',items:[
      {name:'肖记片粉',kind:'庆云街老店',where:'庆云街 6 号，营业时间先电话确认',desc:'红薯淀粉与蔬菜汁制成的片粉，软滑微韧；红油、花生和香菜可提前说明。',place:'xiao',img:'https://q0.itc.cn/q_70/images01/20260829/579106ff537f4a35ad8d4bf65d4f693d.png',source:'https://www.sohu.com/a/1066200081_701119',map:'德阳老号肖记片粉 庆云街'},
      {name:'王凉粉',kind:'城隍庙街',where:'城隍庙街 140 号，营业状态待确认',desc:'先点一份豌豆凉粉分享，天气凉可以询问是否有热凉粉。',place:'wang',img:'https://q6.itc.cn/q_70/images01/20260829/6d329c1ef20d4308b59ac03d3092aff4.png',source:'https://www.sohu.com/a/1066200081_701119',map:'德阳 王凉粉 城隍庙街'},
      {name:'伤心春卷',kind:'老城街头',where:'王凉粉附近；具体摊位请现场找',desc:'薄皮卷蔬菜、豆干和花生，糖醋麻辣或香甜味；不吃辣请提前说。',place:'spring',img:'https://q8.itc.cn/images01/20260829/8170665d591f48118a2452ccdf32ffe5.jpeg',source:'https://www.sohu.com/a/1066200081_701119',map:'德阳 伤心春卷 城隍庙街'},
      {name:'蒋饼子凉面锅盔',kind:'街边小吃候选',where:'米市坝巷 28 号，热门口味可能售罄',desc:'酥锅盔夹凉面，主食感较强；两人可以先分一个。',img:'https://q0.itc.cn/q_70/images01/20260829/1c4fe78b8b404904b5d91bdecbd6011f.png',source:'https://www.sohu.com/a/1066200081_701119',map:'蒋饼子 米市坝巷 德阳'}
    ]},
    {id:'meal',label:'一顿正餐',intro:'按辣度和份量选，不必把几家都吃完。',items:[
      {name:'勇记糯香干锅',kind:'德阳干锅',where:'龙山街 9 号新洋洋百货 2 层',desc:'可先问双人小份，鸭掌、猪蹄或拼锅按菜单挑；糯香和辣度需点单确认。',place:'yongji',img:'https://q1.itc.cn/q_70/images03/20260317/3508cfac99a3434cbe9a2dcaecc21e28.jpeg',source:'https://m.sohu.com/a/997787130_121106884',map:'勇记干锅居 德阳店'},
      {name:'黄许哑巴兔',kind:'特色辣菜',where:'市区可找门店，不必专程去黄许',desc:'兔肉和青红椒、花椒风味浓烈，偏麻辣；不能吃辣或不吃兔肉可跳过。',img:'https://q6.itc.cn/q_70/images03/20260317/7f7e8568b6aa496ebcef29e537239adf.jpeg',source:'https://m.sohu.com/a/997787130_121106884',map:'德阳 哑巴兔'},
      {name:'三丁一体菜',kind:'家常川菜候选',where:'绵远街一段 259 号',desc:'可看馋嘴牛肉、家常菜和炭烤五花，点单先问份量、辣度与当天营业情况。',img:'https://q2.itc.cn/q_70/images03/20260317/d6f973aff7c642ca91fabd3ba4d967a9.jpeg',imageSource:'https://m.sohu.com/a/997787130_121106884',source:'https://www.amap.com/place/B0FFHEJXZZ',map:'三丁一体菜 绵远街店 德阳'},
      {name:'连山回锅肉',img:'https://q3.itc.cn/q_70/images03/20250725/7a2615de3b8a46708775a8a229956d5a.jpeg',imageSource:'https://www.sohu.com/a/917300870_121106884',imageCaption:'连山回锅肉 · 唐焕云摄 / 搜狐报道',kind:'德阳地区风味',where:'可在德阳市区搜索附近门店',desc:'广汉连山特色厚切回锅肉，适合两人搭配一份清淡蔬菜；不用为它专门绕远。',source:'https://www.amap.com/ranking/deyang/food',map:'德阳 连山回锅肉'}
    ]},
    {id:'gifts',label:'带走的味道',intro:'打包前确认保质、密封与乘车携带要求。',items:[
      {name:'孝泉果汁牛肉',img:'https://q8.itc.cn/q_70/images03/20250725/75d370982377432896e9db185d92988c.jpeg',imageSource:'https://www.sohu.com/a/917300870_121106884',imageCaption:'孝泉裹汁牛肉 · 唐焕云摄 / 搜狐报道',kind:'地方特产',where:'德阳市区特产店可搜索',desc:'孝泉传统牛肉制品，可问是否真空包装以及常温保存条件。',source:'https://www.scit.cn/operation/get/1/file/20241203/20241203103202_3892.pdf',map:'德阳 孝泉果汁牛肉'},
      {name:'广汉缠丝兔',img:'https://q9.itc.cn/q_70/images03/20250725/e5de0a09adbd4c95872500de9d14e157.jpeg',imageSource:'https://www.sohu.com/a/917300870_121106884',imageCaption:'广汉缠丝兔 · 唐焕云摄 / 搜狐报道',kind:'地方特产',where:'市区特产店 / 广汉门店',desc:'风味兔肉适合作伴手礼；有冷链要求的产品不建议长时间常温携带。',source:'https://www.hunan.gov.cn/zqt/zcsd/202504/33641786/files/1cb140306d134f4a9a80b1ff50ed35e5.pdf',map:'德阳 广汉缠丝兔'},
      {name:'罗江豆鸡',img:'https://q1.itc.cn/q_70/images03/20260126/c130463622be4225807dae54f1a23daa.jpeg',imageSource:'https://m.sohu.com/a/980024334_121106884',imageCaption:'罗江豆鸡制作与风味 · 德阳老字号报道配图',kind:'豆制品',where:'市区特产店可搜索',desc:'豆制品口感紧实，买小包装便于两人各自带走；看清生产日期及储存方式。',source:'https://www.scit.cn/operation/get/1/file/20241203/20241203103202_3892.pdf',map:'德阳 罗江豆鸡'},
      {name:'中江挂面',kind:'地方风味',where:'特产店或超市按需购买',desc:'手工空心挂面易保存但易碎，注意包装与行李空间。',img:'https://q7.itc.cn/q_70/images03/20250725/fd1cc2ecd877476da315ce5f8297e09c.jpeg',imageSource:'https://www.sohu.com/a/917300870_121106884',imageCaption:'中江挂面 · 唐焕云摄 / 搜狐报道，食用方式参考',source:'https://cbgc.scol.com.cn/home/6821244',map:'德阳 中江挂面 特产店'},
      {name:'什邡板鸭',kind:'地方风味',where:'特产店或超市按需购买',desc:'腌卤风味可作伴手礼，选购前核实配料、密封和储存要求。',img:'https://q9.itc.cn/q_70/images03/20250725/b5b748abc4cf4968a61c3adc56ae5dcb.jpeg',imageSource:'https://www.sohu.com/a/917300870_121106884',imageCaption:'什邡板鸭 · 唐焕云摄 / 搜狐报道',source:'https://www.sohu.com/a/671277383_478015',map:'德阳 什邡板鸭 特产店'}
    ]}
  ],
  hotels:[
    {name:'星程酒店',branch:'德阳文庙店',address:'长江西路一段 99 号',feature:'先看这家：庙街觅食、次日去文庙和取行李都方便。',img:'https://ak-d.tripcdn.com/images/1mc0512000db5a19022FA_R_960_660_R5_D.jpg',source:'https://www.trip.com/hotels/deyang-hotel-detail-1901992/jingcheng-jiayuan-hotel/',book:'https://hotels.ctrip.com/hotels/1901992.html',phone:'0838-6532222'},
    {name:'汉瑞至友酒店',branch:'文庙广场高铁站店',address:'泰山北路一段 42 号',feature:'位置备选：靠近文庙商圈；双床若超预算再换附近。',img:'https://ak-d.tripcdn.com/images/1mc0212000totx7ax0F5A_R_960_660_R5_D.jpg',source:'https://www.trip.com/hotels/deyang-hotel-detail-125222116/zyonder-hotel/',book:'https://hotels.ctrip.com/hotels/125222116.html',phone:'0838-5908888'},
    {name:'全季酒店',branch:'德阳文庙广场店',address:'长江西路二段 31 号',feature:'品牌备选：比较同日双床、取消规则及寄存服务。',img:'https://ak-d.tripcdn.com/images/0202v12000ntizg3f1850_R_960_660_R5_D.jpg',source:'https://jp.trip.com/hotels/deyang-hotel-detail-131325526/ji-hotel/',book:'https://hotels.ctrip.com/hotels/131325526.html',phone:''}
  ]
};
