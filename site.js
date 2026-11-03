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

// Test kullanıcısı başvurusu
// Google Formlar bağlantısı: FORM_URL ve alan kimlikleri doldurulunca başvurular Google Formlar'a gider.
(function(){var f=document.getElementById('tform');if(!f)return;
var CFG={FORM_URL:'',EMAIL:'',KIM:'',ANDROID:''};
var msg=document.getElementById('tmsg');
f.addEventListener('submit',function(e){e.preventDefault();
 var mail=f.querySelector('#t-mail'),and=f.querySelector('#t-android'),ok=f.querySelector('#t-onay');
 msg.className='tmsg';
 if(f.website.value){return}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim())){msg.textContent='Geçerli bir e-posta adresi yaz.';msg.classList.add('err');mail.focus();return}
 if(!and.checked){msg.textContent='Kapalı test şimdilik yalnızca Android telefonlarda.';msg.classList.add('err');and.focus();return}
 if(!ok.checked){msg.textContent='Devam etmek için onay kutusunu işaretle.';msg.classList.add('err');ok.focus();return}
 var btn=f.querySelector('button');btn.disabled=true;
 var done=function(){f.reset();btn.disabled=false;msg.textContent='Teşekkürler! Test başladığında Google Play davet bağlantısını bu adrese göndereceğiz.';msg.classList.add('ok')};
 if(!CFG.FORM_URL){var k=f.querySelector('#t-kim'),kt=k.options[k.selectedIndex].text;
  location.href='mailto:iletisim@idemoli.com?subject='+encodeURIComponent('Test kullanıcısı başvurusu')+'&body='+encodeURIComponent('Merhaba,\n\nIdemo li? kapalı testine katılmak istiyorum.\n\nE-posta (Google Play hesabım): '+mail.value.trim()+'\nBen: '+kt+'\nTelefonum: Android\n\nGizlilik politikasını okudum, başvurumun bu amaçla saklanmasını onaylıyorum.');
  btn.disabled=false;msg.textContent='E-posta uygulaman hazır bir mesajla açıldı; göndermen yeterli. Açılmadıysa iletisim@idemoli.com adresine yaz.';msg.classList.add('ok');return}
 var d=new URLSearchParams();d.append(CFG.EMAIL,mail.value.trim());d.append(CFG.KIM,f.querySelector('#t-kim').value);d.append(CFG.ANDROID,'Evet');
 fetch(CFG.FORM_URL,{method:'POST',mode:'no-cors',body:d}).then(done).catch(function(){btn.disabled=false;msg.textContent='Gönderilemedi. İnternet bağlantını kontrol edip tekrar dene ya da iletisim@idemoli.com adresine yaz.';msg.classList.add('err')})});
})();
