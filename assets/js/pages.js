/* Inner pages: reveal blocks on enter (M9), word reveal on the insight statement (M4), slide lightbox. */
(function(){
  var html=document.documentElement, motion=html.classList.contains('motion');
  function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s));}

  /* lightbox: works with or without motion */
  var box=document.getElementById('lightbox');
  if(box&&box.showModal){
    var img=box.querySelector('img'),cap=box.querySelector('p');
    $$('[data-full]').forEach(function(b){b.addEventListener('click',function(){
      img.src=b.getAttribute('data-full');img.alt=b.getAttribute('data-alt')||'';cap.textContent=b.getAttribute('data-caption')||'';box.showModal();
    });});
    box.addEventListener('click',function(e){if(e.target===box||e.target.closest('.close'))box.close();});
  }

  if(!motion) return;
  /* M9: rise and fade in once, 120ms stagger within a group */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px'});
  $$('.rv').forEach(function(el){
    var sib=el.parentElement?Array.prototype.indexOf.call(el.parentElement.children,el):0;
    el.style.transitionDelay=Math.min(sib,5)*120+'ms';io.observe(el);
  });

  /* M4: insight words go from muted to ink as they cross the middle of the viewport */
  var st=document.querySelector('.insight-statement');
  if(st){
    var words=[];
    st.childNodes.forEach&&Array.prototype.slice.call(st.childNodes).forEach(function(n){
      if(n.nodeType!==3)return;var f=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));}else{var s=document.createElement('span');s.textContent=t;f.appendChild(s);words.push(s);}});
      n.parentNode.replaceChild(f,n);
    });
    var from=[110,110,115],to=[29,29,31];
    function mix(t){return 'rgb('+from.map(function(a,i){return Math.round(a+(to[i]-a)*t);}).join(',')+')';}
    var tick=false;
    function upd(){var r=st.getBoundingClientRect(),q=Math.min(1,Math.max(0,(innerHeight*.8-r.top)/(innerHeight*.5))),n=words.length;
      words.forEach(function(w,i){var p=Math.min(1,Math.max(0,(q*(n+4)-i)/4));w.style.color=mix(p);});tick=false;}
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});upd();
  }
})();
