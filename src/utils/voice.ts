// Speech Recognition & Voice Synthesis Utility for ED OS

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

export function createSpeechRecognizer(
  onTranscript: (transcript: string, isFinal: boolean) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): { start: () => void; stop: () => void; isListening: () => boolean } {
  if (!isSpeechRecognitionSupported()) {
    return {
      start: () => {
        onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      },
      stop: () => {},
      isListening: () => false,
    };
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let listening = false;

  recognition.onstart = () => {
    listening = true;
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    if (currentText.trim()) {
      onTranscript(currentText.trim(), Boolean(finalTranscript));
    }
  };

  recognition.onerror = (event: any) => {
    listening = false;
    onError?.(event.error || 'Speech recognition error');
  };

  recognition.onend = () => {
    listening = false;
    onEnd?.();
  };

  return {
    start: () => {
      try {
        listening = true;
        recognition.start();
      } catch (e: any) {
        console.warn('Speech recognition start failed:', e);
      }
    },
    stop: () => {
      try {
        listening = false;
        recognition.stop();
      } catch (e: any) {
        console.warn('Speech recognition stop failed:', e);
      }
    },
    isListening: () => listening,
  };
}

export function speakText(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
): void {
  if (!isSpeechSynthesisSupported()) return;

  try {
    window.speechSynthesis.cancel();
    // Clean markdown, symbols, and formatting for clean natural voice
    const cleanText = text
      .replace(/[#*`_~\[\]()><]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate ?? 1.05;
    utterance.pitch = options?.pitch ?? 1.0;

    // Pick an authoritative and clear voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha')) &&
        v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      options?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
    options?.onEnd?.();
  }
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function generateVaultVoiceBriefing(
  memories: { id: string; title: string; category: string }[],
  links: { sourceId: string; targetId: string; relationType: string; label?: string }[]
): string {
  if (memories.length === 0) {
    return 'The memory vault is currently empty. No active memories or knowledge links are registered.';
  }

  const memoryMap = new Map(memories.map((m) => [m.id, m]));
  const linkedCount = links.length;

  let briefing = `ED Knowledge Graph Status Report: ${memories.length} memories indexed in local storage with ${linkedCount} active relational links. `;

  // Highlight key legal and strategic links
  const legalLinks = links.filter((l) => {
    const s = memoryMap.get(l.sourceId);
    const t = memoryMap.get(l.targetId);
    return s?.category === 'legal' || t?.category === 'legal' || s?.category === 'decision' || t?.category === 'decision';
  });

  if (legalLinks.length > 0) {
    const first = legalLinks[0];
    const s = memoryMap.get(first.sourceId);
    const t = memoryMap.get(first.targetId);
    if (s && t) {
      briefing += `Noticeable synergy: ${s.title} actively ${first.relationType} ${t.title}. `;
    }
  }

  const categoryCounts: Record<string, number> = {};
  for (const m of memories) {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
  }

  const cats = Object.entries(categoryCounts)
    .map(([cat, count]) => `${count} ${cat}`)
    .join(', ');

  briefing += `Knowledge distribution includes ${cats}. All relational synapses are synchronized and accessible offline.`;

  return briefing;
}
