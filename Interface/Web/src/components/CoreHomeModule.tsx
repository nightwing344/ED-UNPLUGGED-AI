import React,{useEffect,useState} from 'react';
import {
  MessageCircle,CheckSquare,Scale,Grid2X2,
  Sparkles,Settings,Mic
} from 'lucide-react';
import {CoreModule} from './CoreModule';

type Props=React.ComponentProps<typeof CoreModule>;

export const CoreHomeModule:React.FC<Props>=(props)=>{
  const [open,setOpen]=useState(false);
  const [chat,setChat]=useState(false);

  useEffect(()=>{
    const h=document.documentElement;
    if(!chat) h.classList.add('ed-orb-home');
    else h.classList.remove('ed-orb-home');
    return ()=>h.classList.remove('ed-orb-home');
  },[chat]);

  if(chat) return <CoreModule {...props}/>;

  const go=(m:string)=>props.onNavigateModule?.(m);

  const items=[
    ['Chat',MessageCircle,()=>setChat(true),'50%','7%'],
    ['Tasks',CheckSquare,()=>go('agents'),'12%','28%'],
    ['Legal',Scale,()=>go('legal'),'88%','28%'],
    ['Tools',Grid2X2,()=>go('builder'),'12%','72%'],
    ['Create',Sparkles,()=>go('creative'),'88%','72%'],
    ['Settings',Settings,()=>document.getElementById('ed-theme-toggle')?.click(),'50%','93%'],
  ] as const;

  const voice=(e:React.MouseEvent)=>{
    e.stopPropagation();
    const W:any=window;
    const SR=W.SpeechRecognition||W.webkitSpeechRecognition;
    if(!SR){setChat(true);return;}
    const r=new SR();
    r.lang='en-US';
    r.onresult=(x:any)=>{
      const t=x.results[0][0].transcript;
      setChat(true);
      setTimeout(()=>props.onSendMessage?.(t),100);
    };
    r.start();
  };

  return (
    <main className="ed-home-stage fixed inset-0 overflow-hidden text-white">
      <div className="absolute left-5 top-5 z-20">
        <span className="text-3xl font-black" style={{color:'var(--ed-primary)'}}>ED</span>
        <span className="ml-2 tracking-[.25em] text-sm">UNPLUGGED AI</span>
      </div>

      <div className="absolute right-5 top-6 text-xs text-emerald-400">● ONLINE</div>

      <div className="absolute left-1/2 top-1/2 aspect-square w-[92vw] max-w-[430px] -translate-x-1/2 -translate-y-1/2">
        <div
  className="ed-orbit-ring absolute inset-[7%] rounded-full border"
  style={{
    borderColor:'rgb(var(--ed-primary-rgb) / .28)',
    boxShadow:'0 0 30px rgb(var(--ed-secondary-rgb) / .12)'
  }}
/>

        <svg
          className="ed-connector-svg absolute inset-0 z-[5] h-full w-full pointer-events-none"
          viewBox="0 0 100 100"
        >
          <g stroke="var(--ed-primary)" strokeWidth=".65" opacity=".9">
            <line x1="50" y1="14" x2="50" y2="24"/>
            <line x1="18" y1="32" x2="27" y2="37"/>
            <line x1="82" y1="32" x2="73" y2="37"/>
            <line x1="18" y1="68" x2="27" y2="63"/>
            <line x1="82" y1="68" x2="73" y2="63"/>
            <line x1="50" y1="86" x2="50" y2="76"/>
          </g>
          <g fill="var(--ed-primary)">
            <circle cx="50" cy="24" r="1"/>
            <circle cx="27" cy="37" r="1"/>
            <circle cx="73" cy="37" r="1"/>
            <circle cx="27" cy="63" r="1"/>
            <circle cx="73" cy="63" r="1"/>
            <circle cx="50" cy="76" r="1"/>
          </g>
        </svg>

        {items.map(([label,Icon,action,left,top])=>(
          <button
            key={label}
            onClick={action}
            className={`ed-page-node absolute z-20 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border bg-black/80 transition-all duration-300 ${
              open?'scale-100 opacity-100':'pointer-events-none scale-50 opacity-0'
            }`}
            style={{
              left,top,
              borderColor:'var(--ed-primary)',
              background:'radial-gradient(circle,rgb(var(--ed-secondary-rgb)/.22),#050608 68%)',
              boxShadow:'0 0 12px rgb(var(--ed-primary-rgb)/.45), 0 0 24px rgb(var(--ed-secondary-rgb)/.30)'
            }}
          >
            <Icon size={22} style={{color:'var(--ed-primary)'}}/>
            <span className="absolute top-[68px] text-[10px]">{label}</span>
          </button>
        ))}

        <div
          onClick={()=>setOpen(v=>!v)}
          className="ed-home-core absolute left-1/2 top-1/2 z-10 flex aspect-square w-[52vw] max-w-[250px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2"
          style={{
            borderColor:'var(--ed-primary)',
            background:'radial-gradient(circle,rgb(var(--ed-secondary-rgb)/.2),#050608 65%)',
            boxShadow:'0 0 45px rgb(var(--ed-primary-rgb)/.35)'
          }}
        >
          <div className="text-center">
            <div className="text-4xl font-black" style={{color:'var(--ed-primary)'}}>ED</div>

            <button
              onClick={voice}
              className="mx-auto mt-4 flex h-[72px] w-[72px] items-center justify-center rounded-full border"
              style={{borderColor:'var(--ed-primary)',color:'var(--ed-primary)'}}
            >
              <Mic size={32}/>
            </button>

            <div className="mt-3 text-xs font-bold tracking-[.18em]">TAP TO TALK</div>
            <div className="mt-1 text-[9px]" style={{color:'var(--ed-secondary)'}}>
              TAP SPHERE FOR PAGES
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
