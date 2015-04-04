/*! qwest 1.5.9 (https://github.com/pyrsmk/qwest) */
!function(a,b,c){"undefined"!=typeof module&&module.exports?module.exports=c:"function"==typeof define&&define.amd?define(c):a[b]=c}(this,"qwest",function(){var win=window,doc=document,before,defaultXdrResponseType="json",limit=null,requests=0,request_stack=[],getXHR=function(){return win.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")},xhr2=""===getXHR().responseType,qwest=function(method,url,data,options,before){method=method.toUpperCase(),data=data||null,options=options||{};var nativeResponseParsing=!1,crossOrigin,xhr,xdr=!1,timeoutInterval,aborted=!1,retries=0,headers={},mimeTypes={text:"*/*",xml:"text/xml",json:"application/json",post:"application/x-www-form-urlencoded"},accept={text:"*/*",xml:"application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1",json:"application/json; q=1.0, text/*; q=0.8, */*; q=0.1"},contentType="Content-Type",vars="",i,j,serialized,then_stack=[],catch_stack=[],complete_stack=[],response,success,error,func,promises={then:function(a){return options.async?then_stack.push(a):success&&a.call(xhr,response),promises},"catch":function(a){return options.async?catch_stack.push(a):error&&a.call(xhr,response),promises},complete:function(a){return options.async?complete_stack.push(a):a.call(xhr),promises}},promises_limit={then:function(a){return request_stack[request_stack.length-1].then.push(a),promises_limit},"catch":function(a){return request_stack[request_stack.length-1]["catch"].push(a),promises_limit},complete:function(a){return request_stack[request_stack.length-1].complete.push(a),promises_limit}},handleResponse=function(){if(!aborted){var i,req,p,responseType;if(--requests,clearInterval(timeoutInterval),request_stack.length){for(req=request_stack.shift(),p=qwest(req.method,req.url,req.data,req.options,req.before),i=0;func=req.then[i];++i)p.then(func);for(i=0;func=req["catch"][i];++i)p["catch"](func);for(i=0;func=req.complete[i];++i)p.complete(func)}try{if("status"in xhr&&!/^2|1223/.test(xhr.status))throw xhr.status+" ("+xhr.statusText+")";var responseText="responseText",responseXML="responseXML",parseError="parseError";if(nativeResponseParsing&&"response"in xhr&&null!==xhr.response)response=xhr.response;else if("document"==options.responseType){var frame=doc.createElement("iframe");frame.style.display="none",doc.body.appendChild(frame),frame.contentDocument.open(),frame.contentDocument.write(xhr.response),frame.contentDocument.close(),response=frame.contentDocument,doc.body.removeChild(frame)}else{if(responseType=options.responseType,"auto"==responseType)if(xdr)responseType=defaultXdrResponseType;else switch(xhr.getResponseHeader(contentType)){case mimeTypes.json:responseType="json";break;case mimeTypes.xml:responseType="xml";break;default:responseType="text"}switch(responseType){case"json":try{response="JSON"in win?JSON.parse(xhr[responseText]):eval("("+xhr[responseText]+")")}catch(e){throw"Error while parsing JSON body : "+e}break;case"xml":try{win.DOMParser?response=(new DOMParser).parseFromString(xhr[responseText],"text/xml"):(response=new ActiveXObject("Microsoft.XMLDOM"),response.async="false",response.loadXML(xhr[responseText]))}catch(e){response=void 0}if(!response||!response.documentElement||response.getElementsByTagName("parsererror").length)throw"Invalid XML";break;default:response=xhr[responseText]}}if(success=!0,p=response,options.async)for(i=0;func=then_stack[i];++i)p=func.call(xhr,p)}catch(e){if(error=!0,options.async)for(i=0;func=catch_stack[i];++i)func.call(xhr,e,url)}if(options.async)for(i=0;func=complete_stack[i];++i)func.call(xhr)}},buildData=function(a,b){var c,d=[],e=encodeURIComponent;if("object"==typeof a&&null!=a){for(c in a)if(a.hasOwnProperty(c)){var f=buildData(a[c],b?b+"["+c+"]":c);""!==f&&(d=d.concat(f))}}else null!=a&&null!=b&&d.push(e(b)+"="+e(a));return d.join("&")};switch(++requests,options.async="async"in options?!!options.async:!0,options.cache="cache"in options?!!options.cache:"GET"!=method,options.dataType="dataType"in options?options.dataType.toLowerCase():"post",options.responseType="responseType"in options?options.responseType.toLowerCase():"auto",options.user=options.user||"",options.password=options.password||"",options.withCredentials=!!options.withCredentials,options.timeout="timeout"in options?parseInt(options.timeout,10):3e3,options.retries="retries"in options?parseInt(options.retries,10):3,i=url.match(/\/\/(.+?)\//),crossOrigin=i&&i[1]?i[1]!=location.host:!1,"ArrayBuffer"in win&&data instanceof ArrayBuffer?options.dataType="arraybuffer":"Blob"in win&&data instanceof Blob?options.dataType="blob":"Document"in win&&data instanceof Document?options.dataType="document":"FormData"in win&&data instanceof FormData&&(options.dataType="formdata"),options.dataType){case"json":data=JSON.stringify(data);break;case"post":data=buildData(data)}if(options.headers){var format=function(a,b,c){return b+c.toUpperCase()};for(i in options.headers)headers[i.replace(/(^|-)([^-])/g,format)]=options.headers[i]}if(headers[contentType]||"GET"==method||options.dataType in mimeTypes&&mimeTypes[options.dataType]&&(headers[contentType]=mimeTypes[options.dataType]),headers.Accept||(headers.Accept=options.responseType in accept?accept[options.responseType]:"*/*"),crossOrigin||headers["X-Requested-With"]||(headers["X-Requested-With"]="XMLHttpRequest"),"GET"==method&&(vars+=data),options.cache||(vars&&(vars+="&"),vars+="__t="+ +new Date),vars&&(url+=(/\?/.test(url)?"&":"?")+vars),limit&&requests==limit)return request_stack.push({method:method,url:url,data:data,options:options,before:before,then:[],"catch":[],complete:[]}),promises_limit;var send=function(){if(xhr=getXHR(),crossOrigin&&("withCredentials"in xhr||!win.XDomainRequest||(xhr=new XDomainRequest,xdr=!0,"GET"!=method&&"POST"!=method&&(method="POST"))),xdr?xhr.open(method,url):(xhr.open(method,url,options.async,options.user,options.password),xhr2&&options.async&&(xhr.withCredentials=options.withCredentials)),!xdr)for(var a in headers)xhr.setRequestHeader(a,headers[a]);if(xhr2&&"document"!=options.responseType)try{xhr.responseType=options.responseType,nativeResponseParsing=xhr.responseType==options.responseType}catch(b){}xhr2||xdr?xhr.onload=handleResponse:xhr.onreadystatechange=function(){4==xhr.readyState&&handleResponse()},"auto"!==options.responseType&&"overrideMimeType"in xhr&&xhr.overrideMimeType(mimeTypes[options.responseType]),before&&before.call(xhr),xdr?setTimeout(function(){xhr.send("GET"!=method?data:null)},0):xhr.send("GET"!=method?data:null)},timeout=function(){timeoutInterval=setTimeout(function(){if(aborted=!0,xhr.abort(),options.retries&&++retries==options.retries){if(aborted=!1,error=!0,response="Timeout ("+url+")",options.async)for(i=0;func=catch_stack[i];++i)func.call(xhr,response)}else aborted=!1,timeout(),send()},options.timeout)};return timeout(),send(),promises},create=function(a){return function(b,c,d){var e=before;return before=null,qwest(a,b,c,d,e)}},obj={before:function(a){return before=a,obj},get:create("GET"),post:create("POST"),put:create("PUT"),"delete":create("DELETE"),xhr2:xhr2,limit:function(a){limit=a},setDefaultXdrResponseType:function(a){defaultXdrResponseType=a.toLowerCase()}};return obj}());
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function(e,t){typeof module!="undefined"?module.exports=t():typeof define=="function"&&typeof define.amd=="object"?define(t):this[e]=t()}("domready",function(){var e=[],t,n=document,r=n.documentElement.doScroll,i="DOMContentLoaded",s=(r?/^loaded|^c/:/^loaded|^i|^c/).test(n.readyState);return s||n.addEventListener(i,t=function(){n.removeEventListener(i,t),s=1;while(t=e.shift())t()}),function(t){s?t():e.push(t)}})


/*!
 * Playlister Erik Sälgström Peterson - License GPLv2
 */

var App = {
	dataReady: false,
	videoIds: [],
	playedIds: [],
	players: [],
	init: function(){
			App.playerEls = Array.prototype.slice.call(document.querySelectorAll('.player'));
			App.startPlayerDL();
			App.fetchPlaylist();
	},
	fetchPlaylist: function(page){
		var pagestring = page ? '&pageToken=' + page : '';


		// qwest.get('https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyAnaVQcV3CqZF3a4L-ql1lf5VpVx6pC-KQ&playlistId=PLArvEia7B_Fyn_GeKqv4s1iBwuYL1Mem-&part=snippet,contentDetails&maxResults=50'+pagestring)
		// 	.then(function(resp){
		// 		var data = JSON.parse(resp);
		// 		var ids = data.items.map(function(item){ return item.snippet.resourceId.videoId; });
	
		// 		App.videoIds = App.videoIds.concat(ids);
		// 		if(data.nextPageToken) return App.fetchPlaylist(data.nextPageToken);
		// 		App.dataReady = true;
		// 		console.log(App.videoIds);
		// 	});

		App.videoIds = ["vCp1SjqiE7E","sAVG7rOwiro","xPFjYvZzjEI","kEXZryVOL7Q","CRGBC_EwUCQ","m3Cwqh7sCUM","ACoM-MQ6d0I","bwGz8UFRjeM","0XAI6g-NFkA","d8ZX_PgsdXA","bPDIwMLGqds","1q0OoD2yego","GEOB9eVkRT0","DzsHXX5u2v0","j_L2z0WUqSE","HbZSMZAUCrs","bOYwa2V4mlQ","FnI9OqvuodY","kw7lJ025xYA","o4d8k5U12-k","FPKEC3Hz-tY","v-_SRdkLOJU","bnYEWTaPsC4","U3JEtHZQpaM","CNc0ozETp7U","h309jv-FDro","rkxlvWi3KXc","7Ei8TejYHFs","8egR8xtzvcU","lSRmaMo6d40","s_64FvOnVfY","gn_2__EHjLI","ZRSI2qMz6C0","EiRnJ9ft4WE","ub2QswEBuUI","cdxr3PpErjg","TcX-CBrF9m4","Od06OFzHJJM","Wr4HaaekU6Y","mR-aBIQOCew","yoeLAq_3oKA","gNIXffiELsg","J8bknQjTqKw","sMG6cBm4ROA","c9w1s54isnM","_nh9DJAw2EA","FWQMJPgBm2Q","861B_axO500","P7tdNWzZ004","sh6du1X_sAA","RiRvTnC90jA","7NfSK8fG0K4","9TxzwbV7y6E","dHy5YjdV87k","ZR7tRS0CZ1c","whnS1uokkxU","pZQIb5xAFoQ","jM3gfwqIqDs","9mz7Cdgt1PU","hxfoOsRQGkM","mX1KCfHNmHo","-YYBCNQnYNM","zMk0zt9o87Q","ZJHcIN-KGFQ","oAhvy__nxkk","FeDrfuJXW6Y","WD0LMeUyYVM","MbCHZwQBPR8","DAVaUtB2lUQ","Mj_VnC5grFE","rSl76NfnJkY","VNXXFyCuroY","OZzoIqle1eI","7sPG0m0kHsY","5gQ7VR3FpV4","PNUbXFuEqvs","A_uK2a7sXZo","8TdIVp9r6Zw","UCoCcCvFbZ8","bkqH3eLOsXI","eBdSo-RkYvw","bA-DEYrrLH0","Gc3Gm-3-UkY","KXCiduEnDIY","-EDenXPeARU","POe0Rz2uxBI","5pNtjOYkAbA","FM8OVyPJILQ","bkNu_1TM2R8","jm2cbiN1wTs","94KzmB2bI7s","A-oxWXLhVRk","AKxrB6Vv9o8","ouAUo9jVtAU","lv7HZBKkKow","SYMvOxIsES4","h8DdqWicbeI","vA4Y4kSzGNE","h4eD7TlTNCU","svDl8BwRt4I","99xwiXAJnzQ","UBq1R6BzNBg","ehPjfpY4jcs","q6eIqNpdvlw","BKES8LNvIFs","70uP7oz6y_w","I62EQ5xbDZg","vfuO87nnENc","rrCiRmegR40","0g4UBeaG5fs","8wM5dDvQRI8","EGfxeCtE33c","gE9Omyg6gIE","7GQJCmZF2eQ","nqM_NArVYbc","WBSM2JvFqKM","_akyfMp9ln8","UPhIlT0H0CI","Mk94qHh-eTg","wJLjv19GJrc","pzKTVdzRebQ","TSwQOf4V3fE","90cj4NX87Yk","KdV1MhJtEjM","OBmhoGRDuOE","3csi-2Hrzhg","kWadDtIFPNs","sY6z2hLgYuY","afqDyRROHiQ","1tBOmG0QMbA","GAwoq5Ksb94","XHSU8TZKQ2M","f1aae4AZ080","6FridXUHwYw","TPDQPVxdWik","mqd-aFZ3yqY","-8YpoP7yRE8","hyTw_2qZwYo","dEXYHJ5ZjM8","eHfO8pmaXMg","4EsWHZwwz20","epTxTn7ZfnI","hXeWKsKOI5Y","Hd8SSpqwLtY","RmB1tH6ANiU","1l2CcH0vHDc","MZANi-5a_jU","_xXhTkBpr6E","QLTuKkj3XpY","xir670oorIo","XdKlmyfp5_w","NBG-Dvq9ypM","JJ-J2YD2hSU","rrN2lgRjcrg","CpQ6pqyNw2I","EM4HfNpxSOo","fbk1Kmki5sg","N8gxND1kX6k","4akYMtKfsYE","QwTr0dw2FbQ","BW_JNXwO7dE","-5ICoZOED0g","pHuvs9Qqa5o","aJV5mH3YY70","vWGzRnxGig4","qw0_CFg6paY","hWumOPH2uMY","k6GSMDU5sk4","hZUZqkPMXX8","kBhKSj3qI_0","jTwDF3hUq18","54acHHUqObM","QhZjHmK3Gew","edLA_YHP7Y8","-c-tqai7br0","IfuyaMYapkY","7IPceA0ILAg","GIWapF93q6w","eU4gzQ1iJAU","AZkPC2p8rDg","1Fg11nIIK4w","gKCawALGeXw","vHnZsouY3U8","HyzCauRk6Iw","5diKdBZ8EOI","qsBwVKtvrpg","ZzDrheWDhGw","RocLdMyUG-4","yUKWG11humE","aFsNz5VMyC8","xWRRAw6xzos","LnbavAYULUU","1QW32aiAmPM","2r2a3ryCBYw","0rtB4oNlhqo","GAovNxb_ayE","3b69l1at84A","qgTiERP8bTM","Lf-Y7V2HSzE","f2vWqsLPP4Q","gO5gPdJxe_o","9pG-aENEhpI","9ePQkEvS7ZA","gmh6o0_XeFg","RVw4Q51pX2s","GxlS1ZDxhi4","qERJqp_F4-s","pWQFPxgqwqw","KLVnBQSIKlc","45w_lgWH8wQ","OYoaLzobQmk","iPZpubaiZPo","AsQLwwwcth0","qjjHKDn12qI","MefTPoeVQ3w","4S00XN-0kWg","MD-dVXIcVng","05Io6lop3mk","I4jUMWFKPTY","ahJYUVDY5ek","HiqyQlaZIuc","Ao9cVhwPg84","yKW4F0Nu-UY","9va0KPrVExs","VsyBzIeF1zI","gjTaxhqfA0I","hrSu5pBxqfc","NPuLhxfKoRU","LTglday5zak","dBsnfUieAqs","qhcSEH_rs4Y","3JAqrRnKFHo","52YP4CLNVHs","TJj7t2mrpxc","9wTGKpq3Ugk","SKZO6BfQf5g","OxGjbHzxQSI","xA2kL2yjyio","4C2QjywWz3U","XKDngz4egiY","OgOMUpnJfyw","LaTDjjaAwKM","rWKEFXhE0sU","czISLzICp9s","9R4Bkwh9h9c","abOwl9lqfRI","jdPm8JF-ifw","XDsr0mNI3bA","H5M-yzsFDRA","WYF9v2lchxo","CtHJOTjQFLE","muFYAF0M46I","p7StkhRvBIo","_9y0EiXi31A","NEI0eOLcIgc","nkOD1o9hCUg","1cLWKDhBYxo","4xEhJbeho7Q","AcotvBHvz9A","z_GUNEn0Ay4","K-0JRR3F6Wc","JiPQ5HdkICI","nRE8ghM_Fog","rACReNJZHCg","ymWJo3LTNbU","RgSVBZ8gZe4","XwUn64d5Ddk","BYHKBcmx6ZE","7oNdk4N9pSI","h184w7J-wRQ","CfiPnrnAZd0","pifVOztuiys","2VqPhN07r2Q","x0jh26fr8Xg","RSQEuWRmc_o","OUxZRVZWf2s","27efgfFoiCY","zo4ffFteZ3E","t9gjfBnqNQE","Lh6esIKTwOQ","lmPQdYExPlA","saNgbeEe9Tc","LZnkgw2tlFA","2pXyJ7P0B0k","WxcOkTe9NXM","ku7AADIo9to","b3bFi7ooyfY","o06S5_AP7ZU","OdsOmBGAI_U","dNJiU5i_g_g","cUSgC1dkeUA","HsUxKe8F7bg","aejQEAXlT3k","NloOmE1gzW4","7AYCQhlmph4","IhlKHgORrgM","_ZV5140OykE","IRQLRO3dIp8","4sFBojOUSHA","4i3zR4G35Eg","bS-npjjPiUo","VoUYRdNCOcE","yJbVdHj3HIU","6fNnSO5G6hM","r4eqDYkxtBw","sFygJZHTZWQ","8ROaTfBILM8","Pzoo8kXNB_Y","RIb72ok14wE","Tl70Sr3cbsM","IEgKSc_V71Y","lkqtQ61k58E","3MvEmUX-NzM"];
		App.dataReady = true;
	},
	startPlayerDL: function(){
		var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		window.onYouTubeIframeAPIReady = function(){
			App.makePlayers();
		};

	},
	makePlayers: function(){
		if(!App.dataReady) return window.setTimeout(App.makePlayers, 500)
		var counter = App.playerEls.length;

		App.playerEls.forEach(function(el, i){
			console.log(i);
			App.players.push(new Player(el, App.popId(), i));
			
			App.players[i].on('ready', function(){
				counter--;
				console.log(counter);
				App.players[i].off('ready');
				if(counter === 0) App.startPlayer();
			});

		});

	},
	startPlayer: function(){
		document.getElementsByClassName('container')[0].setAttribute('class', 'container');
		App.players[0].play();
		window.setTimeout(App.advancePlayer, 3500);
	},
	advancePlayer: function(){
		console.log("PLAYER ADVANCING");
		if(!App.players[1].videoReady){ 
			App.moveToBack(App.players[1]);
			return this.timeout = window.setTimeout(App.advancePlayer, 500);
		}

		App.players[1].play();
		App.players[0].stop(App.popId());
		App.players.push(App.players.shift());
		console.log("Videos Remaining: " + App.videoIds.length );
		this.timeout = window.setTimeout(App.advancePlayer, 3500);
	},
	popId: function(){
		if(App.videoIds.length === 0){
			App.videoIds = App.playedIds;
			App.playedIds = [];
		}
		var index = Math.floor( Math.random() * App.videoIds.length);
		var id = App.videoIds[index];
		App.playedIds.push(id);
		App.videoIds.splice(index, 1);

		return id;
	},
	removeId: function(id){
		App.playedIds.indexOf(id) !== -1 ? App.playedIds.splice(App.playedIds.indexOf(id), 1) : App.videoIds.splice(App.videoIds.indexOf(id))
	},
	moveToBack: function(player){
		var index = this.players.indexOf(player);
		if(index == -1) return;
		this.players.push(this.players.splice(index, 1)[0]);
	}
};

var Player = function(el, first, id){
	var self = this;
	this._id = id;
	this.playing = false;
	this.queueing = false;
	this.events = {};
	this.yt = new YT.Player(el, {height: 390, width: 640});
	this.el = this.yt.c;
	this.videoReady = false;
	this.currentId = first;
	console.log(first);

	this.yt.addEventListener('onReady', function loader(e){
		self.addEvents();
		self.load(first);
	});

	this.yt.addEventListener('onError', function(e){
		console.log(self._id, ': error');
		if(e.data == 2) App.removeId(self.currentId);
		if(this.playing){ 
			window.clearTimeout(App.timeout);
			return App.advancePlayer();
		}
		App.moveToBack(self);
		self.load(App.popId());
	});
};

Player.prototype.addEvents = function(){
	var self = this;

	this.yt.addEventListener('onStateChange', function bufferer(e){
		if(e.data !== 5) return;
		console.log(self._id, ': queue');
		self.queue(e.target);
	});

	this.yt.addEventListener('onStateChange', function queuer(e){
		if(e.data !== 1 || self.playing === true) return;

		var duration = e.target.getDuration(),
			start = Math.floor(Math.random() * (duration - 5)) + 2;

		self.queueing = true;
		e.target.seekTo(start, true);
		console.log(self._id,': seek');
	});

	this.yt.addEventListener('onStateChange', function waiter(e){
		if(e.data !== 1 || self.playing === true || !self.queueing) return;
		e.target.pauseVideo();
		self.queueing = false;
		self.videoReady = true;
		self.trigger('ready');
		console.log(self._id, ': pause');

	});
};

Player.prototype.queue = function(player){
	var self = this;
	player.mute();
	player.playVideo();
};


Player.prototype.load = function(id){
	var self = this;
	this.playing = false;
	this.currentId = id;
	this.videoReady = false;
	this.yt.cueVideoById({videoId: id});
};

Player.prototype.play = function(){
	console.log(this._id, ': play');
	this.playing = true;
	this.yt.playVideo();
	this.el.setAttribute('class', 'player playing');
};

Player.prototype.stop = function(id){
	var self = this;
	this.el.setAttribute('class', 'player loading');
	console.log(this._id, ': stop');
	window.setTimeout(function(){
		self.yt.stopVideo();
		self.load(id);
	}, 500);
};

Player.prototype.off = function(event, fn){
	if(!this.events[event]) return;
	if(!fn) return this.events[event] = [];
	this.events[event].some(function(e,i){
		if(e.fn === fn){
			this.events[event].splice(i, 1);
			return true;
		}
		return false;
	});
};

Player.prototype.on = function(event, fn, self){
	this.events[event] = this.events[event] || [];
	this.events[event].push({fn: fn, self: self});
};

Player.prototype.trigger = function(event){
	var self = this;
	if(!this.events[event]) return;
	this.events[event].forEach(function(e){
		var context = e.self || self;
		e.fn.call(self);
	});
};


domready(function(){App.init();});