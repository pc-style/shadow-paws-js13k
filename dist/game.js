function e(e,t,o=.1){if(!ve||!Z)return
const n=Z.createOscillator(),i=Z.createGain()
n.connect(i),i.connect(Z.destination),n.frequency.value=e,i.gain.value=o,i.gain.exponentialRampToValueAtTime(.01,Z.currentTime+t),n.start(),n.stop(Z.currentTime+t)}function t(t){if(me[t]>0)return
const o=je[t]
ue.push({type:t,t:o.duration}),me[t]=o.o,'nineLives'===t&&9>W&&(W++,s(we.x,we.y,'#ff69b4',15)),e('pounce'===t?200:'nightVision'===t?400:600,.2)}function o(e){return ue.some(t=>t.type===e)}function n(t){if(ge[t])return
ge[t]=1,K('achievements',JSON.stringify(ge))
!function(){for(let e=0;20>e;e++)c(S.width-100,50)
r()}(),e(800,.3,.15),setTimeout(()=>e(1e3,.3,.1),150)}function i(i){if(i.i){ne++,ne>ae&&(ae=ne),ie=120
let o=1+y(ne/5)
if(he&&(o*=2),fe&&(o*=1.5),R+=i.points*o,s(i.x,i.y,ne>5?'#ff0':'#0f0',Math.min(ne,5)),ne>15){e(880,.15,.08)
for(let e=0;8>e;e++)c(i.x,i.y)}else if(ne>5)for(let e=0;3>e;e++)c(i.x,i.y)
if(i.l){t(i.l)
for(let e=0;10>e;e++)c(i.x,i.y)
r()}ne>10?(!function(){if(ve)for(let t=0;3>t;t++)setTimeout(()=>e(50+20*M(),.3,.05),100*t)}(),we.u='happy',we.m=1):we.u=ne>5?'happy':'neutral',ce++,be++,ye++,ye>Me&&(Me=ye,K('longestStreak',Me)),ce>0&&ce%12==0&&(se++,re=1+.1*(se-1),l(),'story'===U&&se>3*(qe.p.h+1)&&(qe.p.h++,v(),R+=200,I.textContent="\ud83d\udcd6 Chapter Complete! Next: "+Ge[qe.p.h%Ge.length].theme),function(){if('challenge'!==U||!qe.challenge.v)return
const e=qe.challenge.v
switch(e.k){case'noLivesLost':if(3>W)return I.textContent="\u274c Challenge Failed: Lives Lost",0
break
case'comboTarget':if(ae>=e.target)return R+=e.M,I.textContent=`\u2705 Challenge Complete! +${e.M} points`,1
break
case'itemTarget':if(ce>=e.target)return R+=e.M,I.textContent=`\u2705 Challenge Complete! +${e.M} points`,1}}(),se%3==0&&9>W&&(W++,s(we.x,we.y,'#ff69b4',20))),K('totalItems',be),1>be||ge.L||n('firstSteps'),5>ne||ge.C||n('combo5'),25>ne||ge.S||n('combo25'),50>ne||ge.T||n('combo50'),10>se||ge.B||n('level10'),1===W&&se>3&&!ge.$&&n('survivor'),1e3>be||ge.j||n('collector'),100>ke||ge.I||n('veteran'),10>ye||ge.A||n('streaker'),i.D&&(te=1,oe=300,ne+=5)}else{if(o('pounce'))return s(i.x,i.y,'#ff6b6b',8),void(R+=5)
if(te)s(i.x,i.y,'#9333ea',8),R+=5
else{W--,ne=0,ie=0,ye=0,we.u='scared',we.m=0,setTimeout(()=>we.u='neutral',2e3)
const t=Math.min(5+se,15)
S.style.transform=`translateX(${t}px)`,setTimeout(()=>S.style.transform=`translateX(-${t}px)`,50),setTimeout(()=>S.style.transform='translateX(0)',100),s(i.x,i.y,'#f00',20),e(150,.5,.2),W>0||function(){J=0,ke++,K('totalGames',ke),R>ee&&(ee=R,K('high',ee))
const e=parseInt(_('bestCombo'))||0
ae>e&&K('bestCombo',ae)
const t=y((Date.now()-(_('gameStartTime')||Date.now()))/1e3),o=parseInt(_('totalTime'))||0
K('totalTime',o+t);(function(e){const t=[]
ge.L||1>e.O||(ge.L=1,t.push('firstSteps'))
ge.C||5>e.F||(ge.C=1,t.push('combo5'))
ge.S||25>e.F||(ge.S=1,t.push('combo25'))
ge.T||50>e.F||(ge.T=1,t.push('combo50'))
ge.B||10>e.level||(ge.B=1,t.push('level10'))
ge.$||1!==e.P||5>e.level||(ge.$=1,t.push('survivor'))
ge.j||1e3>be||(ge.j=1,t.push('collector'))
ge.I||100>ke||(ge.I=1,t.push('veteran'))
ge.A||10>Me||(ge.A=1,t.push('streaker'))
t.length>0&&(K('achievements',JSON.stringify(ge)),function(e){const t=b('newAchievements'),o=b('achievementNotifications')
t&&o&&(o.innerHTML=e.map(e=>{const t=ze[e]
return`<div class="achievement-notification">${t.icon} ${t.name}</div>`}).join(''),t.classList.remove('hidden'))}(t))})({V:R,level:se,F:ae,P:W,O:ce,mode:U}),G.textContent=R,X.textContent=se,q.textContent=ae,H.textContent=ee,f('gameOver')}()}}}function a(){let e=Math.max(.3,.7-.02*se)
fe&&(e=.2)
let t
if(M()<e){const e=['fish','star','moon'],o=['paw','eye','heart']
t=M()<.04+(ne>10?.02:0)?'clover':.08>M()&&se>2?o[y(M()*o.length)]:e[y(M()*e.length)]}else{const e=['mirror','ladder','salt']
t=e[y(M()*e.length)]}const o=2.5+.25*se
Le.push({type:t,x:M()*(S.width-40)+20,y:-30,speed:o+1.5*M(),rotation:0,N:M()*C*2,G:.1*M()+.05,...$e[t]})}function s(e,t,o,n=10){for(let i=0;n>i;i++)Ce.push({x:e,y:t,X:8*(M()-.5),q:8*(M()-.5),H:30+20*M(),color:o,size:2+3*M(),J:.1*M()})}function c(e,t){Be.push({x:e,y:t,X:4*(M()-.5),q:4*(M()-.5),H:80+40*M(),U:120,color:['#ff69b4','#9333ea','#00ffff','#ffd700'][y(4*M())],size:1+2*M()})}function r(){xe.push({H:8,R:.3*M()+.2})}function l(){for(let e=0;50>e;e++){const t=e/50*C*2
Ce.push({x:we.x,y:we.y,X:L(t)*(5*M()+2),q:w(t)*(5*M()+2),H:60,color:'#9333ea'})}}function u(){x.textContent=R,B.textContent=W,$.textContent=ee,j.textContent=ne,z.textContent=se
let e=''
if(fe&&(e+='\ud83d\udeab Friday 13th Mode! '),he&&(e+='\ud83c\udf15 Full Moon! '),ue.length>0){e+=ue.map(e=>'pounce'===e.type?'\ud83d\udc3e':'nightVision'===e.type?'\ud83d\udc41\ufe0f':'\ud83d\udc9c').join(' ')}I.textContent=e,ne>5?(j.style.color='#ff0',j.style.transform=`scale(${1+Math.min(ne/50,.5)})`):ne>0?(j.style.color='#0f0',j.style.transform='scale(1)'):(j.style.color='#fff',j.style.transform='scale(1)')}function m(){if(!J)return
let t=.25+Math.min(.02*se,.15),n='15, 15, 30'
fe?(n='30, 10, 10',t=.3):he&&(n='20, 20, 35',t=.2),T.fillStyle=`rgba(${n}, ${t})`,T.fillRect(0,0,S.width,S.height),fe&&0>=--de&&(fe=0),he&&0>=--pe&&(he=0),5e-4>M()&&(!fe&&.3>M()?(fe=1,de=600,l(),e(100,1,.15)):!he&&.2>M()&&(he=1,pe=900,l(),e(300,1,.1))),function(){for(let e=ue.length-1;e>=0;e--){const t=ue[e]
t.t--,t.t>0||ue.splice(e,1)}Object.keys(me).forEach(e=>{me[e]>0&&me[e]--})}(),function(){for(let e=Be.length-1;e>=0;e--){const t=Be[e]
t.x+=t.X,t.y+=t.q,t.X*=.99,t.q*=.99,t.H--,t.H>0||Be.splice(e,1)}}(),function(){for(let e=xe.length-1;e>=0;e--)xe[e].H--,xe[e].H>0||xe.splice(e,1)}(),xe.length>0&&(T.fillStyle=`rgba(255, 255, 255, ${xe[0].R})`,T.fillRect(0,0,S.width,S.height)),Se.forEach(e=>{e.y+=e.speed*re,e.y>S.height&&(e.y=0,e.x=M()*S.width)
let t='#fff'
fe&&(t='#ffaa00'),he&&(t='#aaeeff'),T.fillStyle=t,T.globalAlpha=.5*M()+.5
const o=.5*w(.005*Date.now()+e.x)+1,n=e.size*o
T.fillRect(e.x-n/2,e.y-n/2,n,n)}),T.globalAlpha=1,function(){for(let e=Te.length-1;e>=0;e--){const t=Te[e]
t.H--,t.alpha=t.H/60,t.H>0||Te.splice(e,1)}}(),Te.forEach(e=>{T.globalAlpha=.4*e.alpha,T.fillStyle=o('pounce')?'#ff6b6b':'#333',T.font=(e.size||12)+"px serif",T.fillText('\ud83d\udc3e',e.x-(e.size||12)/2,e.y+4)}),T.globalAlpha=1,Be.forEach(e=>{T.globalAlpha=e.H/e.U,T.fillStyle=e.color,T.shadowBlur=15,T.shadowColor=e.color
for(let t=0;4>t;t++){const o=t/4*C*2+.01*Date.now(),n=e.x+L(o)*e.size,i=e.y+w(o)*e.size
T.beginPath(),T.arc(n,i,1,0,2*C),T.fill()}T.shadowBlur=0}),T.globalAlpha=1,function(){let e=we.speed*(1+.1*se),t=1
we.W>0&&(we.W--,t=3,we.u='focused'),o('pounce')&&(e*=1.8,we.u='focused'),De&&((Ie.Y||Ie.a)&&(we.targetX-=e*t,we.X=Math.min(we.X-1,-e*t*.3)),(Ie._||Ie.d)&&(we.targetX+=e*t,we.X=Math.max(we.X+1,e*t*.3)),(Ie.K||Ie.w)&&(we.targetY-=e*t,we.q=Math.min(we.q-1,-e*t*.3)),(Ie.Z||Ie.s)&&(we.targetY+=e*t,we.q=Math.max(we.q+1,e*t*.3)))
const n=we.x,i=we.y
De?(we.x+=.8*we.X,we.y+=.8*we.q,we.X*=.85,we.q*=.85):(we.X=.25*(we.targetX-we.x),we.q=.25*(we.targetY-we.y),we.x+=we.X,we.y+=we.q),Math.sqrt((we.x-n)**2+(we.y-i)**2)>2&&M()<(we.W>0?.8:.3)&&Te.push({x:n,y:i,H:we.W>0?90:60,alpha:we.W>0?1.2:.8,size:we.W>0?16:12}),we.x=Math.max(we.size,Math.min(S.width-we.size,we.x)),we.y=Math.max(we.size,Math.min(S.height-we.size,we.y)),we.targetX=Math.max(we.size,Math.min(S.width-we.size,we.targetX)),we.targetY=Math.max(we.size,Math.min(S.height-we.size,we.targetY)),te&&0>=--oe&&(te=0),ie>0&&0==--ie&&(ne=0,u())}(),function(){let e=te?'#9333ea':'#2a2a2a'
we.W>0&&(e='#ff4757'),o('pounce')&&(e='#ff6b6b'),o('nightVision')&&(e='#5fd3d3'),o('nineLives')&&(e='#6bc5e8'),T.save(),T.translate(we.x,we.y)
const t=5*w(.008*Date.now())
T.strokeStyle=e,T.lineWidth=.15*we.size,T.lineCap='round',T.beginPath(),T.moveTo(.4*we.size,.1*we.size),T.quadraticCurveTo(.8*we.size,.4*we.size+t,.6*we.size,.9*we.size),T.stroke(),T.fillStyle=e,T.beginPath(),T.ellipse(0,0,.6*we.size,.5*we.size,0,0,2*C),T.fill(),T.beginPath(),T.arc(0,.4*-we.size,.45*we.size,0,2*C),T.fill(),T.beginPath(),T.moveTo(.15*-we.size,.8*-we.size),T.quadraticCurveTo(.3*-we.size,1.1*-we.size,.45*-we.size,.7*-we.size),T.closePath(),T.fill(),T.beginPath(),T.moveTo(.15*we.size,.8*-we.size),T.quadraticCurveTo(.3*we.size,1.1*-we.size,.45*we.size,.7*-we.size),T.closePath(),T.fill()
const n=.45*-we.size
if(we.ee=Math.max(0,we.ee-1),.002>M()&&(we.ee=6),0==we.ee){T.fillStyle='#fff'
const e=.18*we.size,t=.09*we.size
T.beginPath(),T.arc(-e,n,t,0,2*C),T.arc(e,n,t,0,2*C),T.fill(),T.fillStyle='#000'
const o=.05*we.size
T.beginPath(),T.arc(-e,n,o,0,2*C),T.arc(e,n,o,0,2*C),T.fill()}else{T.strokeStyle='#2a2a2a',T.lineWidth=.05*we.size,T.lineCap='round'
const e=.18*we.size,t=.1*we.size
T.beginPath(),T.moveTo(-e-t/2,n),T.lineTo(t/2-e,n),T.stroke(),T.beginPath(),T.moveTo(e-t/2,n),T.lineTo(e+t/2,n),T.stroke()}T.fillStyle='#ff91a4',T.beginPath()
const i=n+.1*we.size
T.moveTo(0,i-.02*we.size),T.lineTo(.04*-we.size,i+.03*we.size),T.lineTo(.04*we.size,i+.03*we.size),T.closePath(),T.fill(),T.restore(),te&&(T.strokeStyle='#9333ea',T.lineWidth=3,T.globalAlpha=.4*w(.008*Date.now())+.3,T.beginPath(),T.arc(we.x,we.y-.2*we.size,1.1*we.size,0,2*C),T.stroke(),T.globalAlpha=1)}(),function(){for(let e=Le.length-1;e>=0;e--){const t=Le[e]
t.y+=t.speed*re,t.rotation+=.08,t.N+=t.G,t.x+=.5*w(t.N)
const o=we.x-t.x,n=we.y-t.y
we.size/2+t.size/2>Math.sqrt(o*o+n*n)?(i(t),Le.splice(e,1),u()):t.y>S.height+30&&Le.splice(e,1)}}(),T.font='25px serif',Le.forEach(e=>{if(T.save(),T.translate(e.x,e.y),T.rotate(e.rotation),he){const e=.3*w(.02*Date.now())+1
T.scale(e,e)}if(e.D||e.l){const e=.2*w(.01*Date.now())+1
T.scale(e,e)}const t=o('nightVision')&&100>e.y?.5:1
T.globalAlpha=t,T.shadowBlur=10
let n=e.i?e.D||e.l?'#9333ea':'#0f0':'#f00'
fe&&(n=e.i?'#ff0':'#ff6600'),he&&(n='#ffffff'),T.shadowColor=n,T.fillText(e.te,-e.size/2,e.size/2),T.restore()}),T.shadowBlur=0,function(){for(let e=Ce.length-1;e>=0;e--){const t=Ce[e]
t.x+=t.X,t.y+=t.q,t.q+=t.J||.3,t.X*=.98,--t.H>0||Ce.splice(e,1)}}(),Ce.forEach(e=>{T.fillStyle=e.color,T.globalAlpha=e.H/50
const t=e.size||4
e.H>20&&(T.shadowBlur=10,T.shadowColor=e.color),T.beginPath(),T.arc(e.x,e.y,t,0,2*C),T.fill(),T.shadowBlur=0}),T.globalAlpha=1,le++
if(le%y(Math.max(25-2*se,6))==0&&(a(),se>2&&M()<.2+.05*se&&setTimeout(a,100),se>5&&M()<.02*se&&setTimeout(a,200)),ne>0&&ne%10==0&&ie>118)for(let e=0;3>e;e++)setTimeout(()=>{const t={...$e.oe,type:'star',x:M()*(S.width-40)+20,y:-30-40*e,speed:4+.3*se,rotation:0,N:M()*C*2,G:.1}
Le.push(t)},150*e)
k(m)}function f(e){let t
switch([A,D,O,F,P,V,N].forEach(e=>{e&&(e.classList.add('hidden'),e.classList.remove('show'))}),e){case'main':t=A
break
case'play':t=D
break
case'tutorial':t=O
break
case'achievements':t=F
break
case'stats':t=P
break
case'settings':t=V
break
case'gameOver':t=N}t&&(t.classList.remove('hidden'),t.classList.add('show'),E=e)}function d(){const e=b('achievementsList')
e&&(e.innerHTML='',Object.keys(ze).forEach(t=>{const o=ze[t],n=document.createElement('div')
n.className="achievement-card "+(ge[t]?'unlocked':''),n.innerHTML=`\n            <div class="achievement-icon">${o.icon}</div>\n            <div class="achievement-name">${o.name}</div>\n            <div class="achievement-desc">${o.ne}</div>\n        `,e.appendChild(n)}))}function h(){const e={ie:ke,ae:ee,se:be,ce:_('bestCombo')||0,re:Me,le:p(parseInt(_('totalTime'))||0),ue:`${Object.keys(ge).length}/${Object.keys(ze).length}`}
Object.entries(e).forEach(([e,t])=>{const o=b(e)
o&&(o.textContent=t)})}function p(e){return`${y(e/60)}m ${e%60}s`}function v(){const e=Ge[qe.p.h%Ge.length]
switch(I.textContent="\ud83d\udcd6 Story: "+e.theme,e.D){case'friday13th':fe=1,de=1800
break
case'fullMoon':he=1,pe=1800}}function g(e){U=e
const t=qe[e]
t&&(t.init(),f(''),J||(clearInterval(Q),f(''),K('gameStartTime',Date.now()),J=1,m()))}const b=document.getElementById,k=(addEventListener,requestAnimationFrame),M=Math.random,y=Math.floor,w=Math.sin,L=Math.cos,C=Math.PI,S=b('game'),T=S.getContext('2d'),x=b('score'),B=b('lives'),$=b('highScore'),j=b('combo'),z=b('level'),I=b('eventStatus'),A=b('mainMenu'),D=b('playMenu'),O=b('tutorialScreen'),F=b('achievementsScreen'),P=b('statsScreen'),V=b('settingsScreen'),N=b('gameOver'),G=(b('endlessButton'),b('playAgainButton'),b('finalScore')),X=b('finalLevel'),q=b('finalCombo'),H=b('finalHighScore')
S.width=400,S.height=600
let J=0,U='endless',E='main',R=0,W=9
const Y='shadowPaws2025_',_=e=>localStorage.getItem(Y+e),K=(e,t)=>localStorage.setItem(Y+e,t)
let Q,Z,ee=_('high')||0,te=0,oe=0,ne=0,ie=0,ae=0,se=1,ce=0,re=1,le=0,ue=[],me={me:0,fe:0,de:0},fe=0,de=0,he=0,pe=0,ve=1,ge=_('achievements')?JSON.parse(_('achievements')):{},be=parseInt(_('totalItems'))||0,ke=parseInt(_('totalGames'))||0,Me=parseInt(_('longestStreak'))||0,ye=0
const we={x:S.width/2,y:S.height-100,size:30,speed:8,X:0,q:0,targetX:S.width/2,targetY:S.height-100,he:[],W:0,ee:0,u:'neutral',m:0}
let Le=[],Ce=[],Se=[],Te=[],xe=[],Be=[]
const $e={pe:{te:'\ud83d\udc1f',points:10,i:1,size:25},oe:{te:'\u2b50',points:20,i:1,size:25},ve:{te:'\ud83c\udf19',points:30,i:1,size:25},ge:{te:'\ud83e\ude9e',points:-1,i:0,size:30},be:{te:'\ud83e\ude9c',points:-1,i:0,size:35},ke:{te:'\ud83e\uddc2',points:-1,i:0,size:25},Me:{te:'\ud83c\udf40',points:50,i:1,D:1,size:25},ye:{te:'\ud83d\udc3e',points:15,i:1,l:'pounce',size:25},eye:{te:'\ud83d\udc41\ufe0f',points:15,i:1,l:'nightVision',size:25},we:{te:'\ud83d\udc9c',points:15,i:1,l:'nineLives',size:25}},je={me:{duration:180,o:600},fe:{duration:300,o:900},de:{duration:1,o:1200}},ze={L:{name:'First Steps',ne:'Collect your first item',icon:'\ud83d\udc76'},C:{name:'Combo Cat',ne:'Achieve a 5x combo',icon:'\ud83d\udd25'},S:{name:'Combo Master',ne:'Achieve a 25x combo',icon:'\u26a1'},T:{name:'Combo Legend',ne:'Achieve a 50x combo',icon:'\ud83c\udfc6'},B:{name:'Persistent Cat',ne:'Reach level 10',icon:'\ud83c\udfaf'},$:{name:'Nine Lives',ne:'Survive with only 1 life',icon:'\ud83d\udc96'},j:{name:'Item Hoarder',ne:'Collect 1000 total items',icon:'\ud83d\udce6'},I:{name:'Veteran Player',ne:'Play 100 games',icon:'\ud83c\udfae'},A:{name:'Lucky Cat',ne:'Get a 10 good item streak',icon:'\ud83c\udf40'},Le:{name:'Perfectionist',ne:'Complete level without taking damage',icon:'\u2728'}},Ie={}
let Ae=0,De=0,Oe={x:S.width/2,y:S.height-100}
document.Ce('keydown',e=>{const n=e.key.toLowerCase()
if(Ie[n]=1,De=1,J)['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ','shift'].includes(n)&&e.preventDefault(),'1'!==n&&'q'!==n||t('pounce'),'2'!==n&&'e'!==n||t('nightVision'),'3'!==n&&'r'!==n||t('nineLives'),' '!==n&&'shift'!==n||!o('pounce')||(we.W=15)
else if('escape'===n&&'main'!==E)return f('main'),void e.preventDefault()}),document.Ce('keyup',e=>Ie[e.key.toLowerCase()]=0)
const Fe=e=>{e.preventDefault(),Ae=1,Ve(e)},Pe=e=>{e.preventDefault(),Ae=0},Ve=e=>{De=0
const t=e.touches?e.touches[0]:e,o=S.getBoundingClientRect(),n=S.width/o.width*(t.clientX-o.left),i=S.height/o.height*(t.clientY-o.top)
Oe.x=n,Oe.y=i,De||(we.targetX=n,we.targetY=i)}
S.Ce('touchstart',Fe),S.Ce('touchmove',e=>{e.preventDefault(),Ae&&Ve(e)}),S.Ce('touchend',Pe),S.Ce('mousedown',Fe),S.Ce('mousemove',e=>{Ae||Ve(e)}),S.Ce('mouseup',Pe),S.Ce('mouseleave',Pe)
let Ne=1
const Ge=[{theme:'Midnight Walk',Se:1,Te:1,D:'normal'},{theme:'Friday 13th',Se:2,Te:.5,D:'friday13th'},{theme:'Full Moon',Se:.5,Te:2,D:'fullMoon'},{theme:'Black Cat Crossing',Se:1.5,Te:1.5,D:'crossroads'},{theme:'Superstition City',Se:2,Te:1,D:'cityscape'}],Xe=[{name:'No Lives Lost',k:'noLivesLost',description:'Complete 5 levels without losing a life',M:500},{name:'Combo Master',k:'comboTarget',target:20,description:'Achieve a 20x combo',M:300},{name:'Speed Run',k:'timeLimit',xe:60,description:'Survive for 60 seconds',M:400},{name:'Item Collector',k:'itemTarget',target:50,description:'Collect 50 items',M:350},{name:'Mirror Madness',k:'avoidBadLuck',description:'Avoid all bad luck items for 30 seconds',M:450}],qe={Be:{name:'Endless Mode',description:'Classic arcade survival - see how long you can last!',init:()=>{W=9,se=1,ce=0,R=0,ne=0,ae=0,re=1,le=0}},p:{name:'Story Mode',description:'Progress through themed levels with unique challenges',h:0,init:()=>{W=9,se=1,ce=0,R=0,ne=0,ae=0,re=1,le=0,qe.p.h=0,v()}},challenge:{name:'Challenge Mode',description:'Daily challenges with special rules and rewards',v:null,init:()=>{W=3,se=1,ce=0,R=0,ne=0,ae=0,re=1,le=0,function(){const e=(new Date).getDate(),t=Xe[e%Xe.length]
qe.challenge.v=t,I.textContent="\u26a1 Challenge: "+t.name,'timeLimit'===t.k&&setTimeout(()=>{'challenge'===U&&J&&(R+=t.M,I.textContent=`\u2705 Challenge Complete! +${t.M} points`)},1e3*t.xe)}()}},$e:{name:'Interactive Tutorial',description:'Learn the game with guided practice',init:()=>{W=9,se=1,ce=0,R=0,ne=0,re=.5}}}
document.Ce('DOMContentLoaded',function(){u(),function(){try{Z=new(window.AudioContext||window.webkitAudioContext)}catch(e){ve=0}}()
for(let e=0;50>e;e++)Se.push({x:M()*S.width,y:M()*S.height,size:2*M(),speed:.5*M()+.1})
b('playButton')?.Ce('click',()=>f('play')),b('tutorialButton')?.Ce('click',()=>f('tutorial')),b('achievementsButton')?.Ce('click',()=>{f('achievements'),d()}),b('statsButton')?.Ce('click',()=>{f('stats'),h()}),b('settingsButton')?.Ce('click',()=>f('settings')),b('endlessButton')?.Ce('click',()=>g('endless')),b('storyButton')?.Ce('click',()=>g('story')),b('challengeButton')?.Ce('click',()=>g('challenge')),b('backToMainButton')?.Ce('click',()=>f('main')),b('backToMainFromTutorial')?.Ce('click',()=>f('main')),b('backToMainFromAchievements')?.Ce('click',()=>f('main')),b('backToMainFromStats')?.Ce('click',()=>f('main')),b('backToMainFromSettings')?.Ce('click',()=>f('main')),b('playAgainButton')?.Ce('click',()=>g(U)),b('backToMenuButton')?.Ce('click',()=>f('main')),b('resetStatsButton')?.Ce('click',()=>{confirm('Are you sure you want to reset all stats? This cannot be undone.')&&(localStorage.clear(),location.reload())}),function(){function e(){t.forEach((e,t)=>{e.classList.toggle('active',t===Ne-1)}),i.textContent=`${Ne}/${t.length}`,o.style.opacity=1===Ne?'0.5':'1',n.style.opacity=Ne===t.length?'0.5':'1'}const t=document.querySelectorAll('.tutorial-step'),o=b('tutPrevButton'),n=b('tutNextButton'),i=b('tutorialProgress')
o.onclick=()=>{Ne>1&&(Ne--,e())},n.onclick=()=>{t.length>Ne&&(Ne++,e())},e()}(),function(){ve='!1'!==_('audio')
const e=b('soundToggle')
e&&(e.checked=ve,e.onchange=()=>{ve=e.checked,K('audio',ve)})}(),d(),h(),f('main'),clearInterval(Q)})
