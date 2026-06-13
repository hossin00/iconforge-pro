import { useState } from 'react';
import { Hexagon, Download, Plus, Trash2, Copy, Check } from 'lucide-react';

const SHAPES = ['circle','square','rounded','diamond','hexagon','star','shield','triangle'];
const EMOJIS = ['⭐','🔥','💡','🚀','🎯','🔮','💎','🌟','⚡','🎨','🔑','🛡️','📱','💻','🌙','☀️','🎸','🏆','🎭','💰'];
const BG_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#06b6d4','#f97316','#14b8a6','#1a1a2e','#0a0a0f'];
const FG_COLORS = ['#ffffff','#000000','#ffd700','#ff6b6b','#4ecdc4','#a8e6cf','#ffeaa7','#fd79a8','#e17055','#74b9ff'];

interface IconConfig { shape:string; emoji:string; bg:string; fg:string; size:number; gradient:boolean; shadow:boolean; }
interface SavedIcon { id:string; name:string; config:IconConfig; svg:string; }
const SAVE='ig_icons_v1';
const load=():SavedIcon[]=>{try{return JSON.parse(localStorage.getItem(SAVE)||'[]')}catch{return[]}};

const renderSVG=(config:IconConfig,sz:number):string=>{
  const { shape, emoji, bg, fg, gradient, shadow } = config;
  let clipPath = '';
  if(shape==='circle') clipPath='circle(50% at 50% 50%)';
  else if(shape==='rounded') clipPath='';
  else if(shape==='diamond') clipPath='polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
  else if(shape==='hexagon') clipPath='polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
  else if(shape==='star') clipPath='polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
  else if(shape==='shield') clipPath='polygon(50% 0%, 100% 20%, 100% 65%, 50% 100%, 0% 65%, 0% 20%)';
  else if(shape==='triangle') clipPath='polygon(50% 0%, 0% 100%, 100% 100%)';
  else clipPath='';

  const r = shape==='rounded'?sz*0.22:0;
  const gradId = 'grad-'+Math.random().toString(36).slice(2);
  const shadowId = 'shad-'+Math.random().toString(36).slice(2);

  const bg2 = bg+'99';
  const fillStr = gradient ? 'url(#'+gradId+')' : bg;

  let shapeEl = '';
  if(shape==='circle') shapeEl=`<circle cx="${sz/2}" cy="${sz/2}" r="${sz/2}" fill="${fillStr}"/>`;
  else if(clipPath) shapeEl=`<rect width="${sz}" height="${sz}" fill="${fillStr}" clip-path="url(#clip-${gradId})"/>`;
  else shapeEl=`<rect width="${sz}" height="${sz}" rx="${r}" fill="${fillStr}"/>`;

  const fontSize = sz * 0.45;

  return `<svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradient?`<linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient>`:''}
    ${clipPath?`<clipPath id="clip-${gradId}"><path d="M ${clipPath.replace(/polygon\(|\)/g,'').split(',').map(p=>{const [x,y]=p.trim().split(' ');return (parseFloat(x)/100*sz)+' '+(parseFloat(y)/100*sz)}).join(', ')} Z"/></clipPath>`:''}
    ${shadow?`<filter id="${shadowId}"><feDropShadow dx="0" dy="${sz*0.05}" stdDeviation="${sz*0.1}" flood-color="#000" flood-opacity="0.4"/></filter>`:''}
  </defs>
  <g ${shadow?`filter="url(#${shadowId})"`:''}>${shapeEl}</g>
  <text x="${sz/2}" y="${sz/2}" text-anchor="middle" dominant-baseline="central" font-size="${fontSize}">${emoji}</text>
</svg>`;
};

export default function App() {
  const [icons,   setIcons]   = useState<SavedIcon[]>(load);
  const [config,  setConfig]  = useState<IconConfig>({shape:'rounded',emoji:'🚀',bg:'#6366f1',fg:'#ffffff',size:512,gradient:true,shadow:true});
  const [name,    setName]    = useState('My Icon');
  const [copied,  setCopied]  = useState('');
  const [tab,     setTab]     = useState<'create'|'library'>('create');

  const save = (items:SavedIcon[]) => { setIcons(items); localStorage.setItem(SAVE,JSON.stringify(items)); };

  const currentSVG = renderSVG(config, 200);

  const downloadSVG = (svg:string, fname:string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    a.download = fname + '.svg'; a.click();
  };

  const downloadAllSizes = (cfg:IconConfig, fname:string) => {
    [16,32,64,128,256,512].forEach((sz,i) => {
      setTimeout(()=>downloadSVG(renderSVG(cfg,sz), fname+'-'+sz), i*200);
    });
  };

  const saveIcon = () => {
    const svg = renderSVG(config, 512);
    const icon: SavedIcon = { id:crypto.randomUUID(), name:name.trim()||'Untitled', config, svg };
    save([icon,...icons]);
    alert('✅ Icon saved to library!');
  };

  const copySVG = (svg:string, id:string) => {
    navigator.clipboard.writeText(svg);
    setCopied(id); setTimeout(()=>setCopied(''),2000);
  };

  const set = (key:keyof IconConfig, val:any) => setConfig(c=>({...c,[key]:val}));

  return (
    <div style={{minHeight:'100vh',background:'#080808',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #18100a',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#f97316,#ea580c)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px #f9731630'}}><Hexagon size={16} color="white"/></div>
          <div><div style={{fontWeight:'700',fontSize:'16px',color:'white',lineHeight:1}}>IconForge Pro</div>
          <div style={{fontSize:'11px',color:'#7c2d12',marginTop:'2px'}}>{icons.length} saved icons</div></div>
        </div>
        <div style={{display:'flex',gap:'4px'}}>
          {(['create','library'] as const).map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:'6px 12px',borderRadius:'7px',background:tab===t?'#f9731620':'none',border:`1px solid ${tab===t?'#f97316':'transparent'}`,color:tab===t?'#fb923c':'#7c2d12',fontSize:'12px',cursor:'pointer',fontFamily:'Inter',textTransform:'capitalize'}}>{t}</button>)}
        </div>
      </header>

      <div style={{flex:1,overflow:'auto',padding:'16px 20px'}}>
        {tab==='create'&&(
          <div style={{maxWidth:'600px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'14px'}}>
            {/* Preview */}
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'28px',background:'#14100a',border:'1px solid #18100a',borderRadius:'16px'}}>
              <div dangerouslySetInnerHTML={{__html:currentSVG}} style={{width:'120px',height:'120px'}}/>
              <div style={{marginTop:'12px',display:'flex',gap:'8px'}}>
                {[32,64,128,256].map(s=>(
                  <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                    <div dangerouslySetInnerHTML={{__html:renderSVG(config,s)}} style={{width:s/4+'px',height:s/4+'px'}}/>
                    <span style={{fontSize:'9px',color:'#7c2d12'}}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div style={{background:'#14100a',border:'1px solid #18100a',borderRadius:'14px',padding:'16px',display:'flex',flexDirection:'column',gap:'12px'}}>
              {/* Shape */}
              <div>
                <div style={{fontSize:'11px',color:'#7c2d12',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Shape</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                  {SHAPES.map(s=><button key={s} onClick={()=>set('shape',s)} style={{padding:'5px 12px',borderRadius:'20px',border:`1px solid ${config.shape===s?'#f97316':'#18100a'}`,background:config.shape===s?'#f9731615':'transparent',color:config.shape===s?'#fb923c':'#7c2d12',fontSize:'12px',cursor:'pointer',fontFamily:'Inter',textTransform:'capitalize'}}>{s}</button>)}
                </div>
              </div>
              {/* Emoji */}
              <div>
                <div style={{fontSize:'11px',color:'#7c2d12',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Icon (emoji)</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'8px'}}>
                  {EMOJIS.map(e=><button key={e} onClick={()=>set('emoji',e)} style={{width:'36px',height:'36px',borderRadius:'8px',border:`1px solid ${config.emoji===e?'#f97316':'#18100a'}`,background:config.emoji===e?'#f9731615':'transparent',fontSize:'20px',cursor:'pointer'}}>{e}</button>)}
                </div>
                <input value={config.emoji} onChange={e=>set('emoji',e.target.value)} placeholder="Or type emoji / text"
                  style={{width:'100%',background:'#080808',border:'1px solid #18100a',borderRadius:'8px',padding:'8px 12px',color:'white',fontSize:'16px',outline:'none',fontFamily:'Inter'}}/>
              </div>
              {/* Background */}
              <div>
                <div style={{fontSize:'11px',color:'#7c2d12',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Background</div>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'8px'}}>
                  {BG_COLORS.map(c=><button key={c} onClick={()=>set('bg',c)} style={{width:'28px',height:'28px',borderRadius:'50%',background:c,border:`2px solid ${config.bg===c?'white':c+'60'}`,cursor:'pointer',transform:config.bg===c?'scale(1.2)':'scale(1)',transition:'all 0.15s'}}/>)}
                </div>
                <input type="color" value={config.bg} onChange={e=>set('bg',e.target.value)} style={{width:'40px',height:'32px',borderRadius:'6px',border:'none',cursor:'pointer'}}/>
              </div>
              {/* Options */}
              <div style={{display:'flex',gap:'12px'}}>
                {[{k:'gradient',l:'Gradient'},{k:'shadow',l:'Shadow'}].map(({k,l})=>(
                  <label key={k} style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
                    <div style={{width:'36px',height:'20px',borderRadius:'10px',background:config[k as 'gradient']?'#f97316':'#18100a',position:'relative',transition:'background 0.2s',cursor:'pointer'}} onClick={()=>set(k as any,!config[k as 'gradient'])}>
                      <div style={{position:'absolute',top:'2px',left:config[k as 'gradient']?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.2s'}}/>
                    </div>
                    <span style={{fontSize:'13px',color:'#fb923c'}}>{l}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save + Export */}
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Icon name"
              style={{width:'100%',background:'#14100a',border:'1px solid #18100a',borderRadius:'10px',padding:'11px 14px',color:'white',fontSize:'14px',outline:'none',fontFamily:'Inter'}}
              onFocus={e=>e.target.style.borderColor='#f97316'} onBlur={e=>e.target.style.borderColor='#18100a'}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              <button onClick={saveIcon} style={{padding:'12px',borderRadius:'10px',background:'#f97316',border:'none',color:'white',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',boxShadow:'0 4px 12px #f9731630'}}>Save to Library</button>
              <button onClick={()=>downloadAllSizes(config,name||'icon')} style={{padding:'12px',borderRadius:'10px',background:'#14100a',border:'1px solid #f9731630',color:'#fb923c',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter'}}>Export All Sizes</button>
            </div>
          </div>
        )}

        {tab==='library'&&(
          <div style={{maxWidth:'600px',margin:'0 auto'}}>
            {icons.length===0?(
              <div style={{textAlign:'center',padding:'60px 20px'}}>
                <div style={{fontSize:'52px',marginBottom:'16px'}}>⬡</div>
                <p style={{color:'#7c2d12',fontSize:'14px',lineHeight:'1.6'}}>Create icons and save them to your library.</p>
              </div>
            ):(
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
                {icons.map(icon=>(
                  <div key={icon.id} style={{background:'#14100a',border:'1px solid #18100a',borderRadius:'12px',padding:'14px',textAlign:'center',transition:'all 0.2s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='#f9731630'} onMouseLeave={e=>e.currentTarget.style.borderColor='#18100a'}>
                    <div dangerouslySetInnerHTML={{__html:renderSVG(icon.config,80)}} style={{width:'80px',height:'80px',margin:'0 auto 10px'}}/>
                    <div style={{fontSize:'12px',color:'white',fontWeight:'500',marginBottom:'8px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{icon.name}</div>
                    <div style={{display:'flex',gap:'4px',justifyContent:'center'}}>
                      <button onClick={()=>copySVG(icon.svg,'svg-'+icon.id)} style={{padding:'5px',borderRadius:'6px',background:copied==='svg-'+icon.id?'#10b98115':'none',border:'none',cursor:'pointer',color:copied==='svg-'+icon.id?'#34d399':'#7c2d12'}}>
                        {copied==='svg-'+icon.id?<Check size={12}/>:<Copy size={12}/>}
                      </button>
                      <button onClick={()=>downloadSVG(icon.svg,icon.name)} style={{padding:'5px',borderRadius:'6px',background:'none',border:'none',cursor:'pointer',color:'#7c2d12'}}><Download size={12}/></button>
                      <button onClick={()=>save(icons.filter(x=>x.id!==icon.id))} style={{padding:'5px',borderRadius:'6px',background:'none',border:'none',cursor:'pointer',color:'#7c2d12'}}><Trash2 size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
