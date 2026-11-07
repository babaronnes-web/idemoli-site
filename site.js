// Dışarıdan (Instagram, mesaj, arama) gelen her ziyaret ana sayfanın en üstünden başlasın
(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';
var inside=document.referrer&&document.referrer.indexOf(location.origin)===0;
var top=function(){try{window.scrollTo({top:0,left:0,behavior:'instant'})}catch(e){window.scrollTo(0,0)}};
if(location.hash&&!inside){history.replaceState(null,'',location.pathname+location.search);top();window.addEventListener('load',top)}
else if(!location.hash){top();window.addEventListener('load',top)}}catch(e){}})();
// Menüde bulunulan bölümü vurgula (tıklayınca ve kaydırırken)
(function(){var links=[].slice.call(document.querySelectorAll('.top nav a[href^="#"]'));if(!links.length)return;
function set(k){links.forEach(function(a){var on=a.dataset.k===k;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');if(on&&a.scrollIntoView&&a.parentNode.scrollWidth>a.parentNode.clientWidth)a.parentNode.scrollTo({left:a.offsetLeft-12,behavior:'smooth'})})}
links.forEach(function(a){a.addEventListener('click',function(){set(a.dataset.k)})});
var secs=links.map(function(a){return document.getElementById(a.dataset.k)}).filter(Boolean);
function spy(){var y=window.scrollY+130,cur=null;secs.forEach(function(s){if(s.offsetTop<=y)cur=s.id});if(window.innerHeight+window.scrollY>=document.body.scrollHeight-4)cur=secs[secs.length-1].id;if(window.scrollY<200)cur='home';set(cur)}
window.addEventListener('scroll',function(){clearTimeout(spy.t);spy.t=setTimeout(spy,60)},{passive:true});if(location.hash.length>1)set(location.hash.slice(1));else spy()})();

// Demo videoları: sekmeler; görünen video görünür olunca sessiz oynar, görünmezken durur
(function(){var tabs=[].slice.call(document.querySelectorAll('.dtabs [role=tab]'));if(!tabs.length)return;
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,vis=false;
function cur(){var t=tabs.filter(function(x){return x.getAttribute('aria-selected')==='true'})[0];return document.getElementById(t.getAttribute('aria-controls')).querySelector('video')}
function play(){var v=cur();if(rm||!vis)return;var p=v.play();if(p&&p.catch)p.catch(function(){})}
function sel(t,focus){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;var pn=document.getElementById(x.getAttribute('aria-controls'));pn.hidden=!on;var v=pn.querySelector('video');if(!on)v.pause();else if(v.dataset.src&&!v.getAttribute('src')){v.src=v.dataset.src;v.preload='metadata'}});if(focus)t.focus();play()}
tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});t.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();sel(tabs[(i+d+tabs.length)%tabs.length],true)}})});
if('IntersectionObserver' in window)new IntersectionObserver(function(e){e.forEach(function(x){vis=x.isIntersecting;if(vis)play();else cur().pause()})},{threshold:.3}).observe(document.getElementById('demo'))})();
