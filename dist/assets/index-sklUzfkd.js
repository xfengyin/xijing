(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const d=[{id:1,title:"小三你好贱",album:"本兮单曲",year:"2011",duration:"3:32",themeColor:"#ff6b9d",emotion:"rebellious",description:"本兮早期代表作，以直接的歌词表达对感情的态度",story:"这首歌写于2011年，是本兮在网络走红时期的代表作之一。歌词直白犀利，表达了对感情中第三者的不屑与批判，展现了她叛逆、不羁的音乐风格。",mood:"叛逆"},{id:2,title:"你在看孤独的风景",album:"本兮单曲",year:"2011",duration:"4:15",themeColor:"#4ecdc4",emotion:"melancholy",description:"忧伤抒情的代表作，唱出孤独与思念",story:"这首抒情慢歌展现了本兮温柔细腻的一面。歌词描绘了一个人看着窗外的风景，思念着远方的人，成为许多粉丝心中的经典情歌。",mood:"忧伤"},{id:3,title:"无语",album:"本兮单曲",year:"2011",duration:"3:28",themeColor:"#ff69b4",emotion:"rebellious",description:"面对感情背叛时的无奈与坚强",story:"《无语》讲述了一段感情结束后的成长。从最初的无语、心痛，到最后学会放手、做回自己，是本兮用音乐记录的青春成长日记。",mood:"叛逆"},{id:4,title:"未成年",album:"《未成年》",year:"2012",duration:"3:45",themeColor:"#ffe66d",emotion:"rebellious",description:"为所有未成年发声，追求自由与梦想",story:"这首歌是本兮为所有未成年人创作的。她用自己的经历告诉大家，未成年不代表幼稚，我们也有自己的想法和追求，青春应该由自己做主。",mood:"青春"},{id:5,title:"怎么办我爱你",album:"本兮单曲",year:"2010",duration:"3:15",themeColor:"#ffb6c1",emotion:"romantic",description:"初恋的甜蜜与忐忑，本兮第一首原创作品",story:"这是本兮在网络发布的第一首原创歌曲，当时她才16岁。歌曲记录了初恋的美好与忐忑，清新的嗓音和真实的情感迅速引起关注，开启了她的音乐之路。",mood:"温柔"},{id:6,title:"奇怪，我不懂得爱",album:"本兮单曲",year:"2011",duration:"3:56",themeColor:"#dda0dd",emotion:"melancholy",description:"从不懂爱到懂得爱的成长历程",story:"这首歌记录了本兮对爱情的理解变化。从最初的'奇怪，我不懂得爱'，到最后'不再奇怪，我懂得了爱'，是一首关于成长的音乐日记。",mood:"迷茫"},{id:7,title:"海海海",album:"本兮单曲",year:"2015",duration:"4:02",themeColor:"#4169e1",emotion:"nostalgic",description:"用大海寄托思念与梦想",story:"《海海海》是本兮后期的作品，展现了她更加成熟的音乐风格。歌词用大海作为意象，寄托了对过去的怀念和对未来的期望。",mood:"思念"},{id:8,title:"我梦见我梦见我",album:"本兮单曲",year:"2016",duration:"3:48",themeColor:"#9370db",emotion:"melancholy",description:"梦境与现实的交织，勇敢做自己的宣言",story:"这是本兮最后发布的歌曲之一。歌词探讨了梦境与现实、理想与自我，表达了即使面对现实的不易，也要勇敢追梦的决心。",mood:"思念"}];class f{constructor(){this.currentSong=null,this.currentSongIndex=0,this.isPlaying=!1,this.currentTime=0,this.duration=212,this.volume=.7,this.isLiked=!1,this.isShuffle=!1,this.repeatMode=0,this.activePanel=null}init(){this.loadSongs(),this.bindEvents(),this.loadSong(0),this.startProgressSimulation()}loadSongs(){const e=document.getElementById("song-list");!e||!d||(e.innerHTML=d.map((s,i)=>`
      <div class="song-item ${i===0?"active":""}" data-index="${i}">
        <span class="song-number">${i+1}</span>
        <div class="song-info">
          <div class="song-name">${s.title}</div>
          <div class="song-album">${s.album||"单曲"}</div>
        </div>
        <span class="song-duration">${s.duration||"3:32"}</span>
      </div>
    `).join(""),e.querySelectorAll(".song-item").forEach(s=>{s.addEventListener("click",()=>{const i=parseInt(s.dataset.index);this.loadSong(i),this.play()})}))}loadSong(e){!d||!d[e]||(this.currentSongIndex=e,this.currentSong=d[e],this.currentTime=0,document.querySelectorAll(".song-item").forEach((s,i)=>{s.classList.toggle("active",i===e)}),document.getElementById("hero-title").textContent=this.currentSong.title,document.getElementById("time-total").textContent=this.currentSong.duration||"3:32",document.getElementById("player-track-name").textContent=this.currentSong.title,document.getElementById("player-track-artist").textContent="本兮",this.updateProgress(0))}play(){var e;this.isPlaying=!0,this.updatePlayButton(),(e=document.getElementById("vinyl-record"))==null||e.classList.add("spinning")}pause(){var e;this.isPlaying=!1,this.updatePlayButton(),(e=document.getElementById("vinyl-record"))==null||e.classList.remove("spinning")}toggle(){this.isPlaying?this.pause():this.play()}updatePlayButton(){const e=document.getElementById("btn-play");e&&(e.textContent=this.isPlaying?"❚❚":"▶")}next(){const e=(this.currentSongIndex+1)%d.length;this.loadSong(e),this.isPlaying&&this.play()}prev(){const e=(this.currentSongIndex-1+d.length)%d.length;this.loadSong(e),this.isPlaying&&this.play()}toggleLike(){this.isLiked=!this.isLiked;const e=document.getElementById("player-like");e&&(e.textContent=this.isLiked?"♥":"♡",e.classList.toggle("liked",this.isLiked))}toggleShuffle(){this.isShuffle=!this.isShuffle;const e=document.getElementById("btn-shuffle");e&&(e.style.color=this.isShuffle?"#ff6b9d":"")}toggleRepeat(){this.repeatMode=(this.repeatMode+1)%3;const e=document.getElementById("btn-repeat");e&&(e.style.color=this.repeatMode>0?"#ff6b9d":"",e.textContent=this.repeatMode===2?"🔂":"🔁")}updateProgress(e){const s=document.getElementById("progress-fill");s&&(s.style.width=`${e}%`);const i=document.getElementById("time-current");if(i){const t=Math.floor(this.currentTime/60),o=Math.floor(this.currentTime%60);i.textContent=`${t}:${o.toString().padStart(2,"0")}`}}startProgressSimulation(){setInterval(()=>{if(this.isPlaying&&this.currentTime<this.duration){this.currentTime+=1;const e=this.currentTime/this.duration*100;this.updateProgress(e),this.currentTime>=this.duration&&(this.repeatMode===2?this.currentTime=0:this.next())}},1e3)}openPanel(e){const s=document.getElementById("panel-overlay"),i=document.getElementById("panel-title"),t=document.getElementById("panel-body");if(!(!s||!i||!t))switch(this.activePanel=e,s.classList.add("active"),e){case"lyrics":i.textContent="歌词",t.innerHTML=`
          <div class="lyrics-container" id="lyrics-container">
            <div class="lyrics-line">♪ ♪ ♪</div>
            <div class="lyrics-line">小三你好贱</div>
            <div class="lyrics-line">本兮</div>
            <div class="lyrics-line"></div>
            <div class="lyrics-line current">我承认我犯贱 我承认我不要脸</div>
            <div class="lyrics-line">不用你指指点点 在一边装可怜</div>
            <div class="lyrics-line">我承认我犯贱 我承认我不要脸</div>
            <div class="lyrics-line">不用你假情假意 在一边装纯洁</div>
            <div class="lyrics-line"></div>
            <div class="lyrics-line">别说你的爱 只是敷衍</div>
            <div class="lyrics-line">别说你的情 都是谎言</div>
            <div class="lyrics-line">我不想再听 你的辩解</div>
            <div class="lyrics-line">就让我们从此 互不相欠</div>
          </div>
        `;break;case"messages":i.textContent="留言墙",t.innerHTML=`
          <div class="message-list">
            <div class="message-item">
              <div class="message-header">
                <span class="message-author">兮饭小忆</span>
                <span class="message-time">3小时前</span>
              </div>
              <div class="message-text">这首歌陪我度过了整个高中时代，现在听到还是会流泪。本兮，你还好吗？</div>
              <div class="message-actions">
                <span class="message-action">♡ 128</span>
                <span class="message-action">💬 回复</span>
              </div>
            </div>
            <div class="message-item">
              <div class="message-header">
                <span class="message-author">音乐旅人</span>
                <span class="message-time">昨天</span>
              </div>
              <div class="message-text">每次听都会想起那个夏天，那些回不去的青春。谢谢你，本兮。</div>
              <div class="message-actions">
                <span class="message-action">♡ 256</span>
                <span class="message-action">💬 回复</span>
              </div>
            </div>
            <div class="message-item">
              <div class="message-header">
                <span class="message-author">追光者</span>
                <span class="message-time">2天前</span>
              </div>
              <div class="message-text">10年了，依然会在深夜单曲循环。你的声音，是青春最美的注脚。</div>
              <div class="message-actions">
                <span class="message-action">♡ 512</span>
                <span class="message-action">💬 回复</span>
              </div>
            </div>
          </div>
          <div class="message-input-area">
            <input type="text" class="message-input" placeholder="写下你想对本兮说的话...">
            <button class="btn-primary" style="padding: 12px 24px; font-size: 14px;">发送</button>
          </div>
        `;break;case"ai":i.textContent="AI音质修复",t.innerHTML=`
          <div style="padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 24px;">✨</div>
            <h3 style="font-size: 24px; margin-bottom: 16px;">AI音质增强</h3>
            <p style="color: #6a6a6a; margin-bottom: 32px;">使用AI技术修复老旧音频，重现录音室音质</p>
            <button class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
              开始修复
            </button>
          </div>
        `;break;case"duet":i.textContent="虚拟对唱",t.innerHTML=`
          <div style="padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 24px;">🎤</div>
            <h3 style="font-size: 24px; margin-bottom: 16px;">虚拟对唱间</h3>
            <p style="color: #6a6a6a; margin-bottom: 32px;">与本兮隔空合唱，创造属于你们的音乐时刻</p>
            <button class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
              进入对唱间
            </button>
          </div>
        `;break;case"live":i.textContent="永恒直播间",t.innerHTML=`
          <div style="padding: 40px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 24px;">📺</div>
            <h3 style="font-size: 24px; margin-bottom: 16px;">24小时直播中</h3>
            <p style="color: #6a6a6a; margin-bottom: 32px;">与万千兮饭一起聆听本兮的音乐</p>
            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
              <button class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
                进入直播间
              </button>
              <button class="btn-secondary" style="width: auto; padding: 16px 32px;">
                🔴 直播中
              </button>
            </div>
          </div>
        `;break;case"timeline":i.textContent="音乐历程",t.innerHTML=`
          <div style="padding: 24px;">
            <div style="border-left: 2px solid #ff6b9d; padding-left: 24px;">
              <div style="margin-bottom: 32px; position: relative;">
                <div style="position: absolute; left: -33px; width: 16px; height: 16px; background: #ff6b9d; border-radius: 50%;"></div>
                <div style="font-size: 14px; color: #ff6b9d; margin-bottom: 4px;">2011</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">出道</div>
                <div style="color: #6a6a6a;">发布首支单曲《小三你好贱》，迅速走红网络</div>
              </div>
              <div style="margin-bottom: 32px; position: relative;">
                <div style="position: absolute; left: -33px; width: 16px; height: 16px; background: #ff6b9d; border-radius: 50%;"></div>
                <div style="font-size: 14px; color: #ff6b9d; margin-bottom: 4px;">2012</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">首张专辑</div>
                <div style="color: #6a6a6a;">发行专辑《run away》，奠定网络歌手地位</div>
              </div>
              <div style="position: relative;">
                <div style="position: absolute; left: -33px; width: 16px; height: 16px; background: #ff6b9d; border-radius: 50%;"></div>
                <div style="font-size: 14px; color: #ff6b9d; margin-bottom: 4px;">2013-2016</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">创作高峰</div>
                <div style="color: #6a6a6a;">创作并发布大量作品，成为90后青春记忆</div>
              </div>
            </div>
          </div>
        `;break}}closePanel(){const e=document.getElementById("panel-overlay");e&&(e.classList.remove("active"),this.activePanel=null)}bindEvents(){var e,s,i,t,o,c,p,g,u,v,y,h;(e=document.getElementById("btn-play"))==null||e.addEventListener("click",()=>this.toggle()),(s=document.getElementById("btn-play-hero"))==null||s.addEventListener("click",()=>this.toggle()),(i=document.getElementById("btn-next"))==null||i.addEventListener("click",()=>this.next()),(t=document.getElementById("btn-prev"))==null||t.addEventListener("click",()=>this.prev()),(o=document.getElementById("player-like"))==null||o.addEventListener("click",()=>this.toggleLike()),(c=document.getElementById("btn-like-hero"))==null||c.addEventListener("click",()=>this.toggleLike()),(p=document.getElementById("btn-shuffle"))==null||p.addEventListener("click",()=>this.toggleShuffle()),(g=document.getElementById("btn-repeat"))==null||g.addEventListener("click",()=>this.toggleRepeat()),(u=document.getElementById("progress-bar"))==null||u.addEventListener("click",n=>{const a=n.currentTarget.getBoundingClientRect(),l=(n.clientX-a.left)/a.width;this.currentTime=Math.floor(this.duration*l),this.updateProgress(l*100)}),(v=document.getElementById("volume-slider"))==null||v.addEventListener("click",n=>{const a=n.currentTarget.getBoundingClientRect(),l=(n.clientX-a.left)/a.width;this.volume=Math.max(0,Math.min(1,l));const m=document.getElementById("volume-fill");m&&(m.style.width=`${this.volume*100}%`)}),document.querySelectorAll(".feature-card").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.feature,l={lyrics:"lyrics",messages:"messages",ai:"ai",duet:"duet",live:"live",timeline:"timeline"};l[a]&&this.openPanel(l[a])})}),document.querySelectorAll(".nav-tab").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".nav-tab").forEach(m=>m.classList.remove("active")),n.classList.add("active");const a=n.dataset.tab,l={home:null,lyrics:"lyrics",messages:"messages",timeline:"timeline"};l[a]?this.openPanel(l[a]):this.closePanel()})}),(y=document.getElementById("panel-close"))==null||y.addEventListener("click",()=>this.closePanel()),(h=document.getElementById("btn-lyrics"))==null||h.addEventListener("click",()=>this.openPanel("lyrics")),document.addEventListener("keydown",n=>{if(n.target.tagName!=="INPUT")switch(n.code){case"Space":n.preventDefault(),this.toggle();break;case"ArrowLeft":n.ctrlKey&&this.prev();break;case"ArrowRight":n.ctrlKey&&this.next();break;case"Escape":this.closePanel();break}})}}window.addEventListener("DOMContentLoaded",()=>{const r=new f;r.init(),console.log("%c兮·境","font-size: 48px; font-weight: bold; background: linear-gradient(135deg, #ff6b9d, #c44569); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"),console.log("%c本兮音乐纪念空间 - 让青春永不散场","font-size: 14px; color: #ff6b9d;"),console.log("%cUI 2.0 - Spotify x QQ音乐风格","font-size: 12px; color: #888;"),window.xijingApp=r});window.addEventListener("error",r=>{console.error("[App Error]",r.error)});window.addEventListener("unhandledrejection",r=>{console.error("[Unhandled Promise Rejection]",r.reason)});
