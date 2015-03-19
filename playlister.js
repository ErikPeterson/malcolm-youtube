var onYouTubeIframeAPIReady = function(){
  
};

(function(window,document, $){
  var tag = document.ceateElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}(window, document, jQuery));
