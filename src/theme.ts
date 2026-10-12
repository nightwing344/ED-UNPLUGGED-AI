export type EDTheme =
  | 'yellow'
  | 'purple'
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow-purple'
  | 'blue-yellow'
  | 'green-yellow';

export const ED_THEME_KEY = 'ed_ui_theme';

export const ED_THEMES: Record<
  EDTheme,
  {
    name: string;
    primary: string;
    secondary: string;
    primaryRgb: string;
    secondaryRgb: string;
  }
> = {
  yellow: {
    name: 'Black + Yellow',
    primary: '#FFD400',
    secondary: '#FFB300',
    primaryRgb: '255 212 0',
    secondaryRgb: '255 179 0',
  },

  purple: {
    name: 'Black + Purple',
    primary: '#B026FF',
    secondary: '#7C3AED',
    primaryRgb: '176 38 255',
    secondaryRgb: '124 58 237',
  },

  blue: {
    name: 'Black + Blue',
    primary: '#00BFFF',
    secondary: '#2563EB',
    primaryRgb: '0 191 255',
    secondaryRgb: '37 99 235',
  },

  green: {
    name: 'Black + Green',
    primary: '#39FF14',
    secondary: '#00C853',
    primaryRgb: '57 255 20',
    secondaryRgb: '0 200 83',
  },

  red: {
    name: 'Black + Red',
    primary: '#FF2A2A',
    secondary: '#E0004D',
    primaryRgb: '255 42 42',
    secondaryRgb: '224 0 77',
  },

  'yellow-purple': {
    name: 'Yellow + Purple',
    primary: '#FFD400',
    secondary: '#A855F7',
    primaryRgb: '255 212 0',
    secondaryRgb: '168 85 247',
  },

  'blue-yellow': {
    name: 'Blue + Yellow',
    primary: '#FFD400',
    secondary: '#008CFF',
    primaryRgb: '255 212 0',
    secondaryRgb: '0 140 255',
  },

  'green-yellow': {
    name: 'Green + Yellow',
    primary: '#FFD400',
    secondary: '#00E676',
    primaryRgb: '255 212 0',
    secondaryRgb: '0 230 118',
  },
};

function validTheme(value: string | null): value is EDTheme {
  return !!value && value in ED_THEMES;
}

export function getEDTheme(): EDTheme {
  const saved = localStorage.getItem(ED_THEME_KEY);
  return validTheme(saved) ? saved : 'yellow-purple';
}

export function applyEDTheme(theme: EDTheme) {
  const config = ED_THEMES[theme];
  const root = document.documentElement;

  root.dataset.edTheme = theme;

  root.style.setProperty('--ed-primary', config.primary);
  root.style.setProperty('--ed-secondary', config.secondary);
  root.style.setProperty('--ed-primary-rgb', config.primaryRgb);
  root.style.setProperty('--ed-secondary-rgb', config.secondaryRgb);

  localStorage.setItem(ED_THEME_KEY, theme);

  window.dispatchEvent(
    new CustomEvent('ed-theme-change', {
      detail: { theme, ...config },
    })
  );
}

function installThemeStyles() {
  if (document.getElementById('ed-theme-engine')) return;

  const style = document.createElement('style');
  style.id = 'ed-theme-engine';

  style.textContent = `
    :root {
      --ed-primary: #FFD400;
      --ed-secondary: #A855F7;
      --ed-primary-rgb: 255 212 0;
      --ed-secondary-rgb: 168 85 247;
    }

    html[data-ed-theme] body {
      background:
        radial-gradient(
          circle at 50% 35%,
          rgb(var(--ed-secondary-rgb) / .11),
          transparent 34%
        ),
        radial-gradient(
          circle at 50% 60%,
          rgb(var(--ed-primary-rgb) / .08),
          transparent 42%
        ),
        #020305 !important;
    }

    /* Existing ED primary accents */
    html[data-ed-theme] [class*="text-amber-"],
    html[data-ed-theme] [class*="text-yellow-"] {
      color: var(--ed-primary) !important;
    }

    html[data-ed-theme] [class*="border-amber-"],
    html[data-ed-theme] [class*="border-yellow-"] {
      border-color: rgb(var(--ed-primary-rgb) / .48) !important;
    }

    html[data-ed-theme] [class*="bg-amber-500"],
    html[data-ed-theme] [class*="bg-yellow-500"] {
      background-color: var(--ed-primary) !important;
    }

    /* Existing ED secondary accents */
    html[data-ed-theme] [class*="text-cyan-"],
    html[data-ed-theme] [class*="text-blue-"],
    html[data-ed-theme] [class*="text-purple-"],
    html[data-ed-theme] [class*="text-pink-"] {
      color: var(--ed-secondary) !important;
    }

    html[data-ed-theme] [class*="border-cyan-"],
    html[data-ed-theme] [class*="border-blue-"],
    html[data-ed-theme] [class*="border-purple-"],
    html[data-ed-theme] [class*="border-pink-"] {
      border-color: rgb(var(--ed-secondary-rgb) / .48) !important;
    }

    /* Temporary theme control — later moves into Settings */
    #ed-theme-control {
      position: fixed;
      right: 12px;
      top: 72px;
      z-index: 9999;
      font-family: inherit;
    }

    #ed-theme-toggle {
      min-width: 48px;
      height: 38px;
      border-radius: 999px;
      border: 1px solid rgb(var(--ed-primary-rgb) / .55);
      background: rgb(2 3 5 / .88);
      color: var(--ed-primary);
      box-shadow:
        0 0 18px rgb(var(--ed-primary-rgb) / .18),
        inset 0 0 12px rgb(var(--ed-secondary-rgb) / .08);
      padding: 0 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .08em;
      backdrop-filter: blur(12px);
    }

    #ed-theme-panel {
      display: none;
      width: 210px;
      margin-top: 8px;
      padding: 10px;
      border-radius: 16px;
      border: 1px solid rgb(var(--ed-primary-rgb) / .35);
      background: rgb(2 3 5 / .95);
      box-shadow: 0 12px 38px rgb(0 0 0 / .65);
      backdrop-filter: blur(18px);
    }

    #ed-theme-panel.open {
      display: block;
    }

    .ed-theme-option {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 9px;
      border: 0;
      background: transparent;
      color: #e5e7eb;
      padding: 8px;
      border-radius: 10px;
      text-align: left;
      font-size: 12px;
    }

    .ed-theme-option:hover,
    .ed-theme-option.active {
      background: rgb(var(--ed-primary-rgb) / .11);
      color: white;
    }

    .ed-theme-swatches {
      display: flex;
      gap: 3px;
    }

    .ed-theme-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
    }
  `;

  document.head.appendChild(style);
}

function installThemeControl() {
  if (document.getElementById('ed-theme-control')) return;

  const control = document.createElement('div');
  control.id = 'ed-theme-control';

  const toggle = document.createElement('button');
  toggle.id = 'ed-theme-toggle';
  toggle.type = 'button';
  toggle.textContent = 'THEME';

  const panel = document.createElement('div');
  panel.id = 'ed-theme-panel';

  const render = () => {
    const active = getEDTheme();
    panel.innerHTML = '';

    (
      Object.entries(ED_THEMES) as [
        EDTheme,
        (typeof ED_THEMES)[EDTheme]
      ][]
    ).forEach(([id, theme]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className =
        'ed-theme-option' + (active === id ? ' active' : '');

      button.innerHTML = `
        <span class="ed-theme-swatches">
          <span
            class="ed-theme-dot"
            style="background:${theme.primary};color:${theme.primary}"
          ></span>
          <span
            class="ed-theme-dot"
            style="background:${theme.secondary};color:${theme.secondary}"
          ></span>
        </span>
        <span>${theme.name}</span>
      `;

      button.onclick = () => {
        applyEDTheme(id);
        render();
      };

      panel.appendChild(button);
    });
  };

  toggle.onclick = () => {
    panel.classList.toggle('open');
  };

  control.appendChild(toggle);
  control.appendChild(panel);

  document.body.appendChild(control);
  render();
}

export function initEDTheme() {
  installThemeStyles();
  applyEDTheme(getEDTheme());

  const start = () => installThemeControl();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}
