/* Scope builder (M10): picks drop into slots; "Send my brief" opens a prefilled email. Used on Home and Contact. */
(function(){
  var motion=document.documentElement.classList.contains('motion');
  function $(s,r){return (r||document).querySelector(s);} function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  var picked=[],bchips=$$('.bchip'),slots=$$('.slot'),bstatus=$('#bstatus'),bcount=$('#bcount'),bsend=$('#bsend');
  var email=bsend?bsend.getAttribute('data-email'):'';
  function abbr(k){return k.split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();}
  function mailto(){
    var subject='Project brief: '+picked.join(', ');
    var body='Hi Aswin,\n\nI\'d like help with: '+picked.join(', ')+'.\n\nAbout the project:\n\n';
    return 'mailto:'+email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  }
  function renderB(popIdx){
    bchips.forEach(function(b){b.setAttribute('aria-pressed',picked.indexOf(b.dataset.k)>-1);});
    slots.forEach(function(s,i){var k=picked[i];s.classList.toggle('on',!!k);s.textContent=k?abbr(k):String(i+1);s.setAttribute('aria-label',k?('Slot '+(i+1)+', '+k+'. Remove'):('Slot '+(i+1)+', empty'));s.classList.remove('pop');if(i===popIdx&&motion){void s.offsetWidth;s.classList.add('pop');}});
    bcount.textContent=picked.length+' of 4 picked';
    bstatus.textContent=picked.length?picked.join(' · '):'Nothing picked yet.';
    if(picked.length){bsend.removeAttribute('aria-disabled');bsend.setAttribute('href',mailto());}
    else{bsend.setAttribute('aria-disabled','true');bsend.removeAttribute('href');}
  }
  bchips.forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.k,i=picked.indexOf(k);if(i>-1){picked.splice(i,1);renderB(-1);}else if(picked.length<4){picked.push(k);renderB(picked.length-1);}else{bstatus.textContent='Four is the limit. Remove one from your brief to swap it.';}});});
  slots.forEach(function(s,i){s.addEventListener('click',function(){if(picked[i]){picked.splice(i,1);renderB(-1);}});});
  if(bsend) renderB(-1);

})();
