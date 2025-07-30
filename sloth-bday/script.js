(function(){
    // Optional debug panel: add ?debug=1 to URL
    var params = new URLSearchParams(location.search);
    var DEBUG = params.get('debug') === '1';
    var debugPane;
    function log(){ if(DEBUG){ console.log.apply(console, arguments); debugPane.textContent += Array.prototype.join.call(arguments,' ') + '\n'; } }
    if (DEBUG) {
      debugPane = document.createElement('pre');
      debugPane.style.cssText = 'position:fixed;bottom:8px;left:8px;right:8px;max-height:40vh;overflow:auto;background:rgba(0,0,0,.5);color:#fff;padding:8px;border-radius:8px;z-index:9999;font-size:12px';
      debugPane.textContent = '[debug] ready\n';
      document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(debugPane); });
    }
  
    document.addEventListener('DOMContentLoaded', function(){
      var overlay      = document.getElementById('startOverlay');
      var startBtn     = document.getElementById('startBtn');
      var countdown    = document.getElementById('countdown');
      var music        = document.getElementById('bg-music');
      var gift         = document.getElementById('gift');        // SVG gift
      var popup        = document.getElementById('popup');
      var closeBtn     = document.getElementById('close');
      var typewriter   = document.getElementById('typewriter');
      var confettiBtn  = document.getElementById('confettiBtn');
      var moreNiceBtn  = document.getElementById('moreNice');
      var downloadCard = document.getElementById('downloadCard');
      var slothSVG     = document.getElementById('slothSVG');
  
      log('DOM', !!overlay, !!startBtn, !!countdown, !!music, !!gift, !!popup, !!closeBtn, !!typewriter);
  
      // Safety: countdown should never intercept taps
      if (countdown) countdown.style.pointerEvents = 'none';
  
      /* ---------- Typewriter ---------- */
      if (typewriter) {
        var lines = [
          "你最棒！你這個臭樹懶🦥",
          "今天只准開心，不准難過",
          "樹懶趴～Soda Pop～🎵",
          "你粗中有細、健談、溫文有禮、成熟穩重、心思縝密、和藹可親 ❤️"
        ];
        var idx = 0;
        (function loopType(){
          var txt = lines[idx], k = 0;
          typewriter.textContent = "";
          var timer = setInterval(function(){
            typewriter.textContent = txt.slice(0, ++k);
            if (k >= txt.length){ clearInterval(timer); setTimeout(function(){ idx=(idx+1)%lines.length; loopType(); }, 1200); }
          }, 40);
        })();
      }
  
      /* ---------- Start flow: countdown → music → hide overlay → confetti → sloth blow ---------- */
      function startSequence(){
        runCountdown(3).then(function(){
          try { music && music.play && music.play(); } catch(e) { log('music error', e); }
          if (overlay) overlay.style.display = 'none';
          boomConfetti(120);
          blowOnce();
        });
      }
      if (startBtn) {
        startBtn.addEventListener('click', startSequence);
        startBtn.addEventListener('touchend', function(e){ e.preventDefault(); startSequence(); }, {passive:true});
        startBtn.addEventListener('keydown', function(e){ if (e.key==='Enter' || e.key===' ') startSequence(); });
        // Mobile browsers often require any user gesture before audio is allowed
        window.addEventListener('click', function(){
          if (overlay && overlay.style.display === 'none' && music && music.paused) { try { music.play(); } catch(e){} }
        });
      }
  
      // Big centered 3 → 2 → 1 → 🎉
      function runCountdown(n){
        return new Promise(async function(res){
          if(!countdown){ return res(); }
          for (var k=n; k>=1; k--){
            countdown.classList.add('show');
            countdown.innerHTML = '<span class="num">'+k+'</span>';
            await wait(800);
          }
          countdown.innerHTML = '<span class="num">🎉</span>';
          await wait(400);
          countdown.classList.remove('show');
          countdown.innerHTML = '';
          res();
        });
      }
      function wait(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  
      /* ---------- Gift open + popup ---------- */
      if (gift) {
        gift.addEventListener('click', function(){
          if (!gift.classList.contains('open')) {
            gift.classList.add('open');
            gift.setAttribute('aria-expanded', 'true');
          }
          if (popup) popup.style.display = 'block';
          boomConfetti(80);
        });
        gift.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' ') gift.click();
        });
      }
  
      // Close popup also closes gift lid
      function closePopupAndGift(){
        if (popup) popup.style.display = 'none';
        if (gift){
          gift.classList.remove('open');
          gift.setAttribute('aria-expanded', 'false');
        }
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', closePopupAndGift);
      }
      if (popup){
        // click on backdrop to close
        popup.addEventListener('click', function(e){ if (e.target === popup) closePopupAndGift(); });
      }
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closePopupAndGift(); });
  
      /* ---------- Extra compliments ---------- */
      if (moreNiceBtn) {
        moreNiceBtn.addEventListener('click', function(){
          var extras = [
            "今天的願望：所有煩惱都被吹走🕯️",
            "我看到的是超讚的你",
            "你最棒了，真的",
            "來抱一個ㄏㄏ"
          ];
          alert(extras[Math.floor(Math.random()*extras.length)]);
        });
      }
  
      /* ---------- Download share card (canvas) ---------- */
      if (downloadCard) {
        downloadCard.addEventListener('click', function(e){
          e.preventDefault();
          var w=1080, h=1350;
          var c=document.createElement('canvas'); c.width=w; c.height=h;
          var ctx=c.getContext('2d');
          ctx.fillStyle='#81D8D0'; ctx.fillRect(0,0,w,h);
          ctx.fillStyle='#F6FEFE'; ctx.fillRect(0,0,w,220);
          ctx.fillStyle='#0b4d4a';
          ctx.font='bold 80px "Noto Sans TC", "Quicksand", sans-serif';
          ctx.fillText('樹懶 生日快樂', 40, 120);
          // simple sloth head
          var cx=w/2, cy=430, r=170;
          ctx.strokeStyle='#2b3c44'; ctx.lineWidth=8;
          ctx.fillStyle='#FAFEFE'; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill(); ctx.stroke();
          ctx.fillStyle='#838a90';
          ctx.beginPath(); ctx.ellipse(cx - r*0.5, cy, r*0.45, r*0.32, 0, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(cx + r*0.5, cy, r*0.45, r*0.32, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle='#24313f';
          ctx.beginPath(); ctx.arc(cx - r*0.35, cy, r*0.12, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + r*0.35, cy, r*0.12, 0, Math.PI*2); ctx.fill();
          ctx.lineWidth=8; ctx.strokeStyle='#24313f';
          ctx.beginPath(); ctx.arc(cx, cy+r*0.18, r*0.35, Math.PI*0.2, Math.PI*0.8); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx, cy+r*0.28); ctx.lineTo(cx, cy+r*0.12); ctx.stroke();
  
          ctx.fillStyle='#142d37'; ctx.font='48px "Noto Sans TC", "Quicksand", sans-serif';
          var traits=['粗中有細','健談','溫文有禮','成熟穩重','心思縝密','和藹可親'];
          var y=740; for(var i=0;i<traits.length;i++){ ctx.fillText('• '+traits[i], 120, y); y+=90; }
          ctx.font='36px "Noto Sans TC", "Quicksand", sans-serif';
          ctx.fillText('from 914 — 你最棒！今天只准開心', 40, h-80);
  
          var url=c.toDataURL('image/png'); var a=document.createElement('a');
          a.href=url; a.download='sloth-card.png'; a.click();
        });
      }
  
      /* ---------- Sloth blow / relight ---------- */
      function blowOnce(){
        if (!slothSVG) return;
        slothSVG.classList.remove('relight');
        slothSVG.classList.add('blow');
        setTimeout(function(){
          slothSVG.classList.remove('blow');
          slothSVG.classList.add('relight');
        }, 1100);
      }
  
      /* ---------- Confetti ---------- */
      if (confettiBtn) confettiBtn.addEventListener('click', function(){ boomConfetti(80); });
      function boomConfetti(count){
        count = count || 60;
        for (var i=0; i<count; i++){
          (function(i){ setTimeout(spawnConfetti, i*6); })(i);
        }
      }
      function spawnConfetti(){
        var div=document.createElement('div');
        var size=Math.random()*8+6;
        var left=Math.random()*100;
        var rot=(Math.random()*90-45)+'deg';
        var hues=[165,180,190,200,210]; var hue=hues[Math.floor(Math.random()*hues.length)];
        div.style.cssText='position:fixed;top:-10px;left:'+left+'vw;width:'+size+'px;height:'+(size*0.45)+'px;'+
          'background:hsl('+hue+',60%,70%);transform:rotate('+rot+');opacity:.95;border-radius:2px;z-index:9;pointer-events:none;'+
          'box-shadow:0 1px 3px rgba(0,0,0,.15)';
        document.body.appendChild(div);
        var endY=100+Math.random()*20, drift=(Math.random()*10-5), duration=2500+Math.random()*1200;
        var start=performance.now();
        requestAnimationFrame(function fall(t){
          var p=Math.min(1,(t-start)/duration);
          div.style.top='calc('+(p*endY)+'vh)'; 
          div.style.left='calc('+(left+drift*Math.sin(p*6))+'vw)';
          div.style.transform='rotate('+rot+') translateY('+(p*2)+'px)';
          div.style.opacity=(1-p).toFixed(2);
          if(p<1) requestAnimationFrame(fall); else div.remove();
        });
      }
  
      log('init done');
    });
  })();
  