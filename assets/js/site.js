/* Shared behaviour for every page: mobile menu, wordmark-in-nav, footer wordmark draw (M12). */
(function(){
  var html=document.documentElement;
  var nav=document.getElementById('nav'), toggle=document.getElementById('navToggle');
  if(toggle){
    toggle.addEventListener('click',function(){
      var open=!nav.classList.contains('open');
      nav.classList.toggle('open',open);
      toggle.setAttribute('aria-expanded',open);
    });
    nav.querySelectorAll('.nav-links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');});});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
  }
  /* Pages other than Home show the name in the bar from the start. */
  if(nav&&(!document.body.classList.contains('home')||!html.classList.contains('motion'))){nav.classList.add('show-name');}

  if(!html.classList.contains('motion')) return;
  var fw=document.getElementById('fw'), foot=document.getElementById('foot');
  if(!fw||!foot) return;
  function clamp(v){return Math.min(1,Math.max(0,v));}
  function easeOut(t){return 1-Math.pow(1-t,3);}
  var tick=false;
  function draw(){
    /* q = share of the footer that has entered the viewport; the stroke draws across as it comes in */
    var r=foot.getBoundingClientRect(), q=clamp((innerHeight-r.top)/Math.min(r.height,innerHeight));
    fw.style.setProperty('--c',(100*(1-easeOut(clamp((q-.35)/.6))))+'%');
    tick=false;
  }
  fw.style.setProperty('--c','100%');
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(draw);}},{passive:true});
  addEventListener('resize',draw);
  draw();
})();
