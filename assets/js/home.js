/* Home page motion (M1–M11) and the scope builder (M10).
   Reused from portfolio-preview.html. All scrubbed effects read scroll position; without
   the .motion class (prefers-reduced-motion) nothing here runs except the builder. */
(function(){
  var html=document.documentElement, motion=html.classList.contains('motion');
  function $(s,r){return (r||document).querySelector(s);} function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  function clamp(v,a,b){a=a===undefined?0:a;b=b===undefined?1:b;return Math.min(b,Math.max(a,v));}
  function lerp(a,b,t){return a+(b-a)*t;}
  function easeOut(t){return 1-Math.pow(1-t,3);}
  function easeInOut(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function easeBack(t){var c1=1.2,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);}
  function mix(a,b,t){return 'rgb('+Math.round(lerp(a[0],b[0],t))+','+Math.round(lerp(a[1],b[1],t))+','+Math.round(lerp(a[2],b[2],t))+')';}
  function view(el){var r=el.getBoundingClientRect();return clamp((innerHeight-r.top)/(innerHeight+r.height));}
  function pin(el){var r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,(r.height-innerHeight)));}

  /* Fit the hero stage (circle, logo, chips) into the space between the label row and the name, at any window size */
  var stageEl=$('#stage'),heroStageEl=$('.hero-stage'),metaEl=$('.hero-meta'),nameEl=$('.wordmark'),heroEl=$('#hero');
  function fitHero(){
    if(!stageEl||!heroStageEl||!metaEl||!nameEl) return;
    var small=innerWidth<761, h0=heroEl.getBoundingClientRect().top;
    var fs=parseFloat(getComputedStyle(nameEl).fontSize), lh=parseFloat(getComputedStyle(nameEl).lineHeight)||fs*1.04;
    var top=metaEl.getBoundingClientRect().bottom-h0;
    var nameInk=nameEl.getBoundingClientRect().top-h0+(lh-fs*1.21)/2+fs*.24;      /* first-line cap/ascender top */
    var space=nameInk-top-(small?40:56);
    var k=Math.max(.45,Math.min(small?.62:1,space/430));
    stageEl.style.setProperty('--k',k);
    heroStageEl.style.top=(top+(small?20:28)+space/2)+'px';
  }
  fitHero(); setTimeout(fitHero,900);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fitHero);}

  if(!motion) return;

  /* ---------- M4 word reveal setup ---------- */
  var words=[];
  (function walk(node){Array.prototype.slice.call(node.childNodes).forEach(function(n){
    if(n.nodeType===3){var parts=n.textContent.split(/(\s+)/),frag=document.createDocumentFragment();
      parts.forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){frag.appendChild(document.createTextNode(t));}else{var s=document.createElement('span');s.textContent=t;frag.appendChild(s);words.push(s);}});
      n.parentNode.replaceChild(frag,n);
    }else if(n.nodeType===1&&!n.classList.contains('ichip')){walk(n);}
  });})($('#claim'));

  var wipe=$('#wipe'),stage=$('#stage'),circle=$('#circle'),props=$('#props'),hero=$('#hero'),statement=$('#statement'),wipeOut=$('#wipeOut'),nav=$('#nav'),sub=$('.statement .sub');
  var plates=$$('#plates .plate'),propEls=$$('.prop'),moves=$('.moves');
  var work=$('#work'),ow=$('#ow'),cards=$$('#cards .card');
  var caps=$('#caps'),capEls=$$('#capRow > *');
  var arc=$('#arc'),steps=$$('.step'),ring=$('#ring');
  var about=$('#about'),shots=$$('#collage .shot, #collage .plate');
  var fly=$('#logoFly'),heroLogo=$('#heroLogo'),navLogo=$('#navLogo'),ASPECT=474/1136,DOCK_H=30;
  var rp=[-11,8,-6,12],rf=[-2.5,2,-1.5,3],xf=[-70,60,-50,80],speeds=[-240,170,-110];
  var shotSpeed=[0,-14,18,14,-10,12],plateRot=[-2,1.5,-1.5];

  function update(){
    var vw=innerWidth,sH=stage.clientHeight,small=vw<761;
    /* M3 circle wipe, hero → statement */
    var p=pin(wipe);
    var cw=circle.offsetWidth;
    var cx=vw/2,cy=heroStageEl.offsetTop;
    var need=2*Math.hypot(Math.max(cx,vw-cx),Math.max(cy,sH-cy))*1.03/cw;
    var t=clamp((p-.04)/.5),s=1+(need-1)*easeInOut(t);
    circle.style.transform='scale('+s+')';circle.style.background=mix([48,48,48],[245,245,247],clamp(t*1.15));
    var h=clamp(p/.26);hero.style.opacity=1-h;hero.style.transform='translateY('+(-h*40)+'px)';hero.style.visibility=h>=1?'hidden':'visible';
    var pr=clamp(p/.35);props.style.opacity=1-clamp((p-.12)/.2);props.style.transform='translateY('+(-pr*160)+'px)';
    statement.style.opacity=clamp((p-.42)/.08);
    statement.style.pointerEvents=p>.42&&p<.9?'auto':'none';
    /* M4 word reveal */
    var q=clamp((p-.5)/.3),n=words.length;
    words.forEach(function(w,i){var wp=clamp((q*(n+5)-i)/5);w.style.color=mix([122,122,122],[29,29,31],wp);});
    sub.style.opacity=.35+.65*clamp((q-.7)/.3);
    /* reverse wipe back to dark */
    var u=clamp((p-.88)/.12),need2=2*Math.hypot(vw/2,sH)*1.04/100;
    wipeOut.style.transform='scale('+(need2*easeInOut(u))+')';
    nav.classList.toggle('show-name',p>.3||small);

    /* Logo flight: hero circle → left of the nav bar, and back on the way up */
    if(fly&&heroLogo&&navLogo){
      var d=easeInOut(clamp((p-.02)/.2));
      nav.style.setProperty('--fly',d);
      var a=heroLogo.getBoundingClientRect(),b=navLogo.getBoundingClientRect();
      var lh=lerp(a.height,DOCK_H,d),lw=lh*ASPECT;
      var lx=lerp(a.left+(a.width-a.height*ASPECT)/2,b.left,d),ly=lerp(a.top,b.top+(b.height-DOCK_H)/2,d);
      var dpr=window.devicePixelRatio||1,px=function(v){return Math.round(v*dpr)/dpr;};  /* snap to device pixels: no blur */
      fly.style.width=px(lw)+'px';fly.style.height=px(lh)+'px';fly.style.left=px(lx)+'px';fly.style.top=px(ly)+'px';
    }

    /* M5 plates fan out, M6 props */
    var qm=view(moves),f=easeBack(clamp((qm-.2)/.36));
    var step=plates.length>1?plates[1].offsetTop-plates[0].offsetTop:0,xs=small?.3:1;
    plates.forEach(function(el,i){
      var off=-(i-1.5)*step*(1-f),x=xf[i]*xs*f,rot=lerp(rp[i],rf[i],f);
      el.style.transform='translate('+x+'px,'+off+'px) rotate('+rot+'deg)';
    });
    propEls.forEach(function(el,i){el.style.transform='translateY('+((qm-.5)*speeds[i])+'px)';});

    /* M7 outline word, M8 card fill-up */
    var qw=view(work),a=easeOut(clamp(qw/.34));
    ow.style.transform='translateX('+lerp(-8,0,a)+'vw) scale('+lerp(.6,1,a)+')';
    cards.forEach(function(c,i){
      var ff=small?1:easeOut(clamp((qw-.27-i*.06)/.14));
      c.querySelector('.fill').style.setProperty('--f',ff);
      var ph=c.querySelector('.ph');ph.style.opacity=.25+.75*ff;ph.style.transform='translateY('+((1-ff)*16)+'px)';
    });

    /* M9 capabilities rise */
    var qc=view(caps);
    capEls.forEach(function(el,i){var g=easeOut(clamp((qc-.2-i*.05)/.2));el.style.transform='translateY('+((1-g)*32)+'px)';el.style.opacity=.2+.8*g;});

    /* M11 arc wheel (desktop and tablet only; phones get a vertical list) */
    if(!small){
      var pa=pin(arc);
      var pw=300,R=Math.min(900,vw*.7),deg=function(x){return x*180/Math.PI;};
      var stepDeg=deg(pw*1.1/R),topY=sH*.33,cxA=vw/2,cyA=topY+R;
      var rot=lerp(1.5*stepDeg,-1.5*stepDeg,easeInOut(clamp((pa-.06)/.88)));
      ring.style.width=ring.style.height=(2*R)+'px';ring.style.left=(cxA-R)+'px';ring.style.top=(cyA-R)+'px';
      steps.forEach(function(el,i){
        var ang=(i-1.5)*stepDeg+rot,rad=ang*Math.PI/180;
        var x=cxA+R*Math.sin(rad),y=cyA-R*Math.cos(rad);
        el.style.setProperty('--pw',pw+'px');
        el.style.transform='translate('+x+'px,'+y+'px) translate(-50%,0) rotate('+ang+'deg)';
        el.style.opacity=clamp(1-Math.abs(ang)/(stepDeg*2.1),.1,1);
        el.classList.toggle('active',Math.abs(ang)<stepDeg*.5);
      });
    }else{
      steps.forEach(function(el){el.style.transform='';el.style.opacity='';el.classList.add('active');});
    }

    /* M6 about collage drift */
    var qa=view(about);
    shots.forEach(function(el,i){
      var y=(qa-.5)*shotSpeed[i]*2;
      if(el.classList.contains('plate')){el.style.transform=small?'':'translateY('+y+'px) rotate('+plateRot[i-3]+'deg)';}
      else{el.style.transform='translateY('+y+'px)';}
    });
  }

  var tick=false;
  function onScroll(){if(!tick){tick=true;requestAnimationFrame(function(){update();tick=false;});}}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',function(){fitHero();onScroll();});
  /* follow the hero entrance animation (M2) for its first moments so the logo rides with it */
  var t0=performance.now();(function follow(){update();if(performance.now()-t0<1500)requestAnimationFrame(follow);})();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(update);}
  addEventListener('load',update);
})();
