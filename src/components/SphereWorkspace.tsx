import React from 'react';
import { Home } from 'lucide-react';

interface SphereWorkspaceProps {
  title: string;
  onHome: () => void;
  children: React.ReactNode;
}

export const SphereWorkspace: React.FC<SphereWorkspaceProps> = ({
  title,
  onHome,
  children,
}) => {
  return (
    <section className="ed-sphere-workspace fixed inset-0 z-[90] flex min-h-0 flex-col overflow-hidden text-white">
      <div className="ed-sphere-workspace-header flex shrink-0 items-center justify-between px-3 py-3">
        <button
          type="button"
          onClick={onHome}
          className="ed-sphere-home-button flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black tracking-[.14em]"
        >
          <Home size={16}/>
          HOME
        </button>

        <div className="text-center">
          <div
            className="text-sm font-black tracking-[.20em]"
            style={{ color: 'var(--ed-primary)' }}
          >
            {title}
          </div>

          <div className="mt-0.5 text-[9px] tracking-[.16em] text-slate-400">
            ED UNPLUGGED AI
          </div>
        </div>

        <div className="text-[10px] font-bold text-emerald-400">
          ● LOCAL
        </div>
      </div>

      <div className="ed-sphere-workspace-body min-h-0 flex-1 overflow-auto">
        {children}
      </div>
    </section>
  );
};
