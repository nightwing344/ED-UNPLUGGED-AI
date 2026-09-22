import React,{useEffect,useState} from 'react';
import {
  MessageCircle,CheckSquare,Scale,Grid2X2,
  Sparkles,Settings,Mic
} from 'lucide-react';
import {CoreModule} from './CoreModule';
import {
  ED_THEMES,
  applyEDTheme,
  getEDTheme,
  type EDTheme
} from '../theme';

type Props=React.ComponentProps<typeof CoreModule>;

export const CoreHomeModule:React.FC<Props>=(props)=>{
  const [open,setOpen]=useState(false);
  const [chat,setChat]=useState(false);

  const [voiceState,setVoiceState]=useState<
    'idle'|'listening'|'processing'
  >('idle');

  const [voiceHint,setVoiceHint]=useState('TAP TO TALK');

  const [settingsOpen,setSettingsOpen]=useState(false);

  const [activeTheme,setActiveTheme]=useState<EDTheme>(
    ()=>getEDTheme()
  );

  useEffect(()=>{
    const h=document.documentElement;
    h.classList.add('ed-orb-home');

    return ()=>{
      h.classList.remove('ed-orb-home');
      document.getElementById('ed-theme-panel')?.classList.remove('open');
      document.getElementById('ed-theme-control')?.classList.remove('ed-home-settings-visible');
    };
  },[]);

  if(chat) return (
    <section className="ed-chat-overlay fixed inset-0 z-[80] flex min-h-0 flex-col bg-slate-950 text-white">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-3 py-2">
        <button
          type="button"
          onClick={()=>setChat(false)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-100 active:scale-95"
        >
          ← HOME
        </button>

        <span
          className="text-xs font-bold tracking-[.18em]"
          style={{color:'var(--ed-primary)'}}
        >
          ED CHAT
        </span>

        <span className="text-[10px] text-emerald-400">
          ● ONLINE
        </span>
      </div>

      <div className="flex min-h-0 w-full flex-1">
        <CoreModule {...props}/>
      </div>
    </section>
  );

  const closeThemePanel=()=>{
    setSettingsOpen(false);

    document
      .getElementById('ed-theme-panel')
      ?.classList.remove('open');

    document
      .getElementById('ed-theme-control')
      ?.classList.remove('ed-home-settings-visible');
  };

  const toggleSettingsPanel=()=>{
    // Never depend on the hidden legacy Theme button on Orb Home.
    document
      .getElementById('ed-theme-panel')
      ?.classList.remove('open');

    document
      .getElementById('ed-theme-control')
      ?.classList.remove('ed-home-settings-visible');

    setOpen(false);

    if(!settingsOpen){
      setActiveTheme(getEDTheme());
    }

    setSettingsOpen(v=>!v);
  };

  const go=(m:string)=>{
    closeThemePanel();
    setOpen(false);
    props.onNavigateModule?.(m);
  };

  const enterChat=()=>{
    closeThemePanel();
    setOpen(false);
    setChat(true);
  };

  const togglePages=(e:React.MouseEvent<HTMLDivElement>)=>{
    const target=e.target as HTMLElement;

    // The voice zone owns its own taps. Never let a near-mic tap
    // accidentally toggle the radial menu.
    if(target.closest('.ed-voice-zone,.ed-voice-button')) return;

    if(settingsOpen){
      closeThemePanel();
      return;
    }

    const themePanel=document.getElementById('ed-theme-panel');

    if(themePanel?.classList.contains('open')){
      closeThemePanel();
      return;
    }

    setOpen(v=>!v);
  };

  const items=[
    ['Chat',MessageCircle,enterChat,'50%','7%'],
    ['Tasks',CheckSquare,()=>go('agents'),'12%','28%'],
    ['Legal',Scale,()=>go('legal'),'88%','28%'],
    ['Tools',Grid2X2,()=>go('builder'),'12%','72%'],
    ['Create',Sparkles,()=>go('creative'),'88%','72%'],
    ['Settings',Settings,toggleSettingsPanel,'50%','93%'],
  ] as const;

  const voice=(e:React.MouseEvent)=>{
    e.stopPropagation();
    const W:any=window;
    const SR=W.SpeechRecognition||W.webkitSpeechRecognition;
    if(!SR){
      setVoiceHint('VOICE NOT SUPPORTED');
      return;
    }

    setVoiceHint('STARTING MIC...');

    const r=new SR();
    r.lang='en-US';

    r.onstart=()=>{
      setVoiceState('listening');
      setVoiceHint('LISTENING...');
    };

    r.onerror=(err:any)=>{
      setVoiceState('idle');

      const code=String(err?.error||'unknown');

      if(code==='not-allowed' || code==='service-not-allowed'){
        setVoiceHint('MIC PERMISSION BLOCKED');
      }else if(code==='no-speech'){
        setVoiceHint('NO SPEECH HEARD');
      }else{
        setVoiceHint(`VOICE ERROR: ${code.toUpperCase()}`);
      }
    };

    r.onresult=(x:any)=>{
      const t=x.results[0][0].transcript?.trim();
      if(!t){setVoiceState('idle');return;}

      setVoiceState('processing');
      setVoiceHint('PROCESSING...');
      closeThemePanel();
      setOpen(false);
      setChat(true);

      setTimeout(()=>{
        props.onSendMessage?.(t);
        setVoiceState('idle');
      },100);
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
            type="button"
            onPointerDown={(e)=>e.stopPropagation()}
            onClick={(e)=>{
              e.stopPropagation();
              action();
            }}
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
          onClick={togglePages}
          className="ed-home-core absolute left-1/2 top-1/2 z-10 flex aspect-square w-[52vw] max-w-[250px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2"
          style={{
            borderColor:'var(--ed-primary)',
            background:'radial-gradient(circle,rgb(var(--ed-secondary-rgb)/.2),#050608 65%)',
            boxShadow:'0 0 45px rgb(var(--ed-primary-rgb)/.35)'
          }}
        >
          <div className="text-center">
            <div className="text-4xl font-black" style={{color:'var(--ed-primary)'}}>ED</div>

            <div
              className="ed-voice-zone mt-4"
              onPointerDown={(e)=>e.stopPropagation()}
              onClick={voice}
            >
              <button
                type="button"
                onPointerDown={(e)=>e.stopPropagation()}
                onClick={voice}
                aria-label="Talk to ED"
                className={`ed-voice-button mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border ${voiceState==='listening'?'ed-listening':''}`}
                style={{borderColor:'var(--ed-primary)',color:'var(--ed-primary)'}}
              >
                <Mic size={32}/>
              </button>

              <div className="mt-3 text-xs font-bold tracking-[.18em]">
                {voiceState==='listening' ? 'LISTENING...' :
                 voiceState==='processing' ? 'PROCESSING...' :
                 voiceHint}
              </div>
            </div>

            <button
              type="button"
              onClick={(e)=>{
                e.stopPropagation();
                setOpen(v=>!v);
              }}
              className="mt-1 text-[9px]"
              style={{color:'var(--ed-secondary)'}}
            >
              TAP SPHERE FOR PAGES
            </button>
          </div>
        </div>
      </div>

      {settingsOpen && (
        <div
          className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
          onClick={()=>setSettingsOpen(false)}
        >
          <section
            className="w-full max-w-sm rounded-3xl border bg-[#05060b]/95 p-4 shadow-2xl backdrop-blur-xl"
            style={{
              borderColor:'rgb(var(--ed-primary-rgb)/.55)',
              boxShadow:
                '0 0 30px rgb(var(--ed-primary-rgb)/.25), 0 20px 60px rgb(0 0 0/.8)'
            }}
            onClick={(e)=>e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div
                  className="text-sm font-black tracking-[.18em]"
                  style={{color:'var(--ed-primary)'}}
                >
                  ED SETTINGS
                </div>

                <div className="mt-1 text-[10px] text-slate-400">
                  INTERFACE THEME
                </div>
              </div>

              <button
                type="button"
                aria-label="Close settings"
                onClick={()=>setSettingsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-black/50 text-xl text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {(Object.entries(ED_THEMES) as [
                EDTheme,
                (typeof ED_THEMES)[EDTheme]
              ][]).map(([id,theme])=>(
                <button
                  key={id}
                  type="button"
                  onClick={()=>{
                    applyEDTheme(id);
                    setActiveTheme(id);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition-all ${
                    activeTheme===id
                      ? 'border-white/50 bg-white/10'
                      : 'border-white/10 bg-black/30'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex gap-1">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{
                          background:theme.primary,
                          boxShadow:`0 0 9px ${theme.primary}`
                        }}
                      />

                      <span
                        className="h-4 w-4 rounded-full"
                        style={{
                          background:theme.secondary,
                          boxShadow:`0 0 9px ${theme.secondary}`
                        }}
                      />
                    </span>

                    <span className="text-sm text-slate-100">
                      {theme.name}
                    </span>
                  </span>

                  <span
                    className="text-xs font-bold"
                    style={{
                      color:
                        activeTheme===id
                          ? 'var(--ed-primary)'
                          : '#64748b'
                    }}
                  >
                    {activeTheme===id ? 'ACTIVE' : 'SELECT'}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={()=>setSettingsOpen(false)}
              className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-900 py-3 text-xs font-bold tracking-[.15em] text-white"
            >
              DONE
            </button>
          </section>
        </div>
      )}
    </main>
  );
};
