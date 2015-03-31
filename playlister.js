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


		qwest.get('https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyAnaVQcV3CqZF3a4L-ql1lf5VpVx6pC-KQ&playlistId=PLArvEia7B_Fyn_GeKqv4s1iBwuYL1Mem-&part=snippet,contentDetails&maxResults=50'+pagestring)
			.then(function(resp){
				var data = JSON.parse(resp);
				var ids = data.items.map(function(item){ return item.snippet.resourceId.videoId; });
	
				App.videoIds = App.videoIds.concat(ids);
				App.dataReady = true;
				if(data.nextPageToken) return App.fetchPlaylist(data.nextPageToken);
			});
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
		if(!App.dataReady) return window.setTimeout(App.makePlayers, 100)
		var counter = 3;
		console.log('making players');
		App.playerEls.forEach(function(el, i){

			App.players.push(new Player(el, App.popId()));
			App.players[i].on('ready', function(){
				console.log('ready triggered')
				counter--;
				console.log(counter);
				App.players[i].off('ready');
				if(counter === 0) App.startPlayer();
			});
		});
	},
	startPlayer: function(){
		App.players[0].play();
		window.setTimeout(App.advancePlayer, 2000);
	},
	advancePlayer: function(){
		if(!App.players[1].videoReady) return window.setTimeout(App.advancePlayer, 100);
		console.log('advancing players');

		App.players[1].play();
		App.players[0].stop(App.popId());
		App.players.push(App.players.shift());
		window.setTimeout(App.advancePlayer, 2000);
	},
	popId: function(){
		var index = Math.floor( Math.random() * App.videoIds.length);
		var id = App.videoIds[index];
		App.playedIds.push(id);
		App.videoIds.splice(index, 1);

		return id;
	}
};

var Player = function(el, first){
	console.log("creating player object")
	var self = this;
	this.events = {};
	this.el = el;
	this.yt = new YT.Player(el, {height: 390, width: 640});
	this.videoReady = false;
	this.yt.addEventListener('onReady', function loader(e){
		console.log('video on ready called');
		self.queue(e.target);
	});
	this.yt.addEventListener('onError', function(){
		self.load(App.popId());
	});
};

Player.prototype.queue = function(player){
	var self = this;
	player.mute();

	this.yt.addEventListener('onStateChange', function queuer(e){
		if(e.data !== 1) return;
		self.yt.removeEventListener('onStateChange', 'queuer');
		e.target.pauseVideo();
		
		var duration,
			start;
		
		duration = e.target.getDuration();
		start = start = Math.floor(Math.random() * (duration - 5)) + 2;
		e.target.seekTo(start, true);
		self.videoReady = true;
		self.trigger('ready');
	});

	player.playVideo();
};

Player.prototype.load = function(id){
	console.log("loading video")
	var self = this;
	this.videoReady = false;
	this.yt.cueVideoById({videoId: id});
	this.yt.addEventListener('onStateChange', function bufferer(e){
		if(e.data !== 5) return
		self.queue(e.target);
	})
};

Player.prototype.play = function(){
	console.log("player.play called")
	this.yt.playVideo();
	this.el.setAttribute('class', 'player playing');
};

Player.prototype.stop = function(id){
	var self = this;
	this.el.setAttribute('class', 'player loading');
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