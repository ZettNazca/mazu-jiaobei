const game=document.querySelector('#game'),throwButton=document.querySelector('#throw'),throwLabel=document.querySelector('#throw-label'),status=document.querySelector('#status'),result=document.querySelector('#result'),motionButton=document.querySelector('#motion');
const outcomes={sheng:{title:'圣筊',description:'所问之事，允准可行',faces:'一平一凸 · 静心而行'},xiao:{title:'笑筊',description:'心意未明，想清楚再问',faces:'两面皆平 · 再问初心'},yin:{title:'阴筊',description:'所问未允，且缓一缓',faces:'两面皆凸 · 从容思量'}};
let busy=false,soundEnabled=false,audioContext,lastThrow=0,lastMotion=null,motionEnabled=false,motionTimer;
function cupSVG(flat,id){
  const face='M12 41Q100-25 188 41Q148 102 100 122Q52 102 12 41Z';
  const side='M12 43Q100-23 188 43L188 61Q100 166 12 61Z';
  // Irregular long fibres and smaller broken pores remain visible at phone size.
  const fibres=Array.from({length:48},(_,i)=>{
    const x=i*4.6-10, bend=Math.sin(i*2.37)*3.5, width=i%7===0?1.4:.65;
    const d=`M${x} -15C${x+bend+5} 20 ${x-4} 37 ${x+bend} 63S${x+7} 106 ${x+2} 150`;
    return `<path d="${d}" fill="none" stroke="#3d1015" stroke-width="${width}" opacity="${i%3===0?.65:.4}"/><path d="${d}" transform="translate(1.2 0)" fill="none" stroke="#cf8172" stroke-width=".55" opacity=".32"/>`;
  }).join('');
  const pores=Array.from({length:75},(_,i)=>{
    const x=(i*37.7)%194, y=(i*23.3)%139, length=2+(i%5);
    return `<path d="M${x} ${y}l.7 ${length}" stroke="#321014" stroke-width=".7" opacity=".5"/>`;
  }).join('');
  const edges=Array.from({length:43},(_,i)=>`<path d="M${i*5} 20l-4 126" stroke="${i%3?'#260a0e':'#aa4f47'}" stroke-width="${i%3?.9:.6}" opacity=".55"/>`).join('');
  return `<svg viewBox="0 0 200 140" role="presentation"><defs>
    <linearGradient id="wood-${id}" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="${flat?'#a0443c':'#a44840'}"/><stop offset=".5" stop-color="#87322e"/><stop offset="1" stop-color="#63211f"/></linearGradient>
    <linearGradient id="edge-${id}" x2="0" y2="1"><stop stop-color="#782824"/><stop offset="1" stop-color="#320d11"/></linearGradient>
    <linearGradient id="round-${id}"><stop stop-color="#2e0c10" stop-opacity=".75"/><stop offset=".35" stop-color="#bd6860" stop-opacity=".28"/><stop offset="1" stop-color="#290c10" stop-opacity=".8"/></linearGradient>
    <clipPath id="face-clip-${id}"><path d="${face}"/></clipPath><clipPath id="side-clip-${id}"><path d="${side}"/></clipPath>
    <filter id="pores-${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".42 .16" numOctaves="3" seed="${id==='left'?8:17}" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".22"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter>
  </defs>
  <path d="${side}" fill="url(#edge-${id})"/><g clip-path="url(#side-clip-${id})">${edges}</g>
  <path d="${face}" fill="url(#wood-${id})" filter="url(#pores-${id})"/>
  ${flat?'':`<path d="${face}" fill="url(#round-${id})"/>`}
  <g clip-path="url(#face-clip-${id})"><g transform="rotate(-17 100 60)">${fibres}${pores}<path d="M116 0C101 29 99 42 105 64S122 103 116 140M119 0C105 31 103 44 109 65S126 104 120 140" fill="none" stroke="#46151a" stroke-width=".8" opacity=".45"/></g></g>
  <path d="M13 41Q100-24 187 41" fill="none" stroke="#c2796b" stroke-width="1" stroke-opacity=".45"/>
  ${flat?'':`<path d="M35 44Q98 4 162 43" fill="none" stroke="#d78e83" stroke-width="1.5" opacity=".2"/>`}
  </svg>`;
}
function renderCups(left,right){document.querySelector('#left-cup').innerHTML=cupSVG(left,'left');document.querySelector('#right-cup').innerHTML=cupSVG(right,'right')}
renderCups(true,true);
function playTone(frequency,duration,type='sine',volume=.08,delay=0){if(!soundEnabled)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const osc=audioContext.createOscillator(),gain=audioContext.createGain(),start=audioContext.currentTime+delay;osc.type=type;osc.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(volume,start);gain.gain.exponentialRampToValueAtTime(.001,start+duration);osc.connect(gain);gain.connect(audioContext.destination);osc.start(start);osc.stop(start+duration)}catch{}}
function randomFace(){const value=new Uint32Array(1);crypto.getRandomValues(value);return Boolean(value[0]&1)}
function toss(){if(busy)return;busy=true;lastThrow=Date.now();clearTimeout(motionTimer);result.hidden=true;game.classList.remove('resolved');game.classList.add('throwing');throwButton.disabled=true;throwLabel.textContent='诚心问筊';status.textContent='一念虔诚，静候筊示…';renderCups(true,true);playTone(190,.2,'triangle',.1);const left=randomFace(),right=randomFace();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;setTimeout(()=>{renderCups(left,right);game.classList.remove('throwing');game.classList.add('resolved');const outcome=outcomes[left!==right?'sheng':left?'xiao':'yin'];document.querySelector('#result-title').textContent=outcome.title;document.querySelector('#result-description').textContent=outcome.description;document.querySelector('#result-faces').textContent=outcome.faces;result.hidden=false;status.style.visibility='hidden';throwLabel.textContent='再掷一筊';throwButton.disabled=false;busy=false;playTone(145,.15,'triangle',.16);playTone(880,1.6,'sine',.05,.16);if(navigator.vibrate)navigator.vibrate([30,50,30])},reduced?180:1700)}
throwButton.addEventListener('click',toss);
document.querySelector('#sound').addEventListener('click',()=>{soundEnabled=!soundEnabled;const button=document.querySelector('#sound');button.setAttribute('aria-label',soundEnabled?'关闭声音':'开启声音');button.setAttribute('aria-pressed',String(soundEnabled));button.style.opacity=soundEnabled?'1':'.55';if(soundEnabled)playTone(660,.6)});
document.querySelector('#sound').style.opacity='.55';
function motionHandler(event){const a=event.accelerationIncludingGravity;if(!a||a.x==null||a.y==null||a.z==null)return;clearTimeout(motionTimer);if(!game.classList.contains('resolved')){status.style.visibility='visible';status.textContent='体感已启用，轻摇手机掷筊'}const now=Date.now();if(lastMotion&&now-lastMotion.time<600&&Math.abs(a.x-lastMotion.x)+Math.abs(a.y-lastMotion.y)+Math.abs(a.z-lastMotion.z)>24&&now-lastThrow>2500)toss();lastMotion={x:a.x,y:a.y,z:a.z,time:now}}
function showMotionStatus(message){status.style.visibility='visible';status.textContent=message;}
motionButton.addEventListener('click',async()=>{if(motionEnabled){window.removeEventListener('devicemotion',motionHandler);clearTimeout(motionTimer);motionEnabled=false;motionButton.textContent='启用摇手机';showMotionStatus('体感已关闭，点击即可掷筊');return}if(!window.isSecureContext||!window.DeviceMotionEvent){showMotionStatus('此设备暂不支持体感，请点击掷筊');return}try{if(typeof DeviceMotionEvent.requestPermission==='function'){const permission=await DeviceMotionEvent.requestPermission();if(permission!=='granted'){showMotionStatus('未获得体感授权，请点击掷筊');return}}window.addEventListener('devicemotion',motionHandler);motionEnabled=true;motionButton.textContent='关闭摇手机';showMotionStatus('体感已启用，轻摇手机掷筊');motionTimer=setTimeout(()=>showMotionStatus('未检测到体感数据，点击也可掷筊'),5000)}catch{showMotionStatus('体感不可用，请点击掷筊')}});
const dialog=document.querySelector('#help-dialog');document.querySelector('#help').addEventListener('click',()=>dialog.showModal());document.querySelector('#close-help').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
