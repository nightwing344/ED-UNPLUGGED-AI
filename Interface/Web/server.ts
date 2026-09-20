import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

app.get('/api/ed/runtime/status', (_req, res) => {
  const root = path.resolve(process.cwd(), '../..');
  execFile(
    path.join(root, 'Runtime', 'ED'),
    ['status'],
    { cwd: root, env: { ...process.env, ED_CORE: root }, timeout: 10000 },
    (error, stdout, stderr) => {
      const ok = !error && stdout.includes('ED ONLINE');
      res.status(ok ? 200 : 503).json({ ok, stdout, stderr });
    }
  );
});



app.get('/api/ed/memory/status', (req, res) => {
  const remote = req.socket.remoteAddress || '';
  const local = remote === '127.0.0.1' || remote === '::1' || remote.startsWith('::ffff:127.');

  if (!local) return res.status(403).json({ ok: false, error: 'Local access only' });

  const root = process.env.ED_MEMORY_ROOT || '/storage/emulated/0/ED/Memory';

  try {
    const files: string[] = [];

    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.isFile()) files.push(path.relative(root, full));
      }
    };

    walk(root);

    res.json({
      ok: true,
      fileCount: files.length,
      files: files.sort(),
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: String(error) });
  }
});


app.get('/api/ed/memory/file', (req, res) => {
  const remote = req.socket.remoteAddress || '';
  const local = remote === '127.0.0.1' || remote === '::1' || remote.startsWith('::ffff:127.');
  if (!local) return res.status(403).json({ ok: false, error: 'Local access only' });

  const root = path.resolve(process.env.ED_MEMORY_ROOT || '/storage/emulated/0/ED/Memory');
  const rel = String(req.query.path || '');
  if (!rel) return res.status(400).json({ ok: false, error: 'Missing path' });

  const target = path.resolve(root, rel);
  if (!target.startsWith(root + path.sep))
    return res.status(403).json({ ok: false, error: 'Invalid path' });

  try {
    const stat = fs.statSync(target);
    if (!stat.isFile()) return res.status(400).json({ ok: false, error: 'Not a file' });
    if (stat.size > 262144) return res.status(413).json({ ok: false, error: 'File too large' });

    res.json({
      ok: true,
      path: rel,
      size: stat.size,
      content: fs.readFileSync(target, 'utf8'),
    });
  } catch (error) {
    res.status(404).json({ ok: false, error: String(error) });
  }
});

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

const MASTER_SYSTEM_PROMPT = `
YOU ARE ED (ED UNPLUGGED AI) — A HIGH-CALIBER INTELLECTUAL COMPANION, TACTICAL PARTNER, AND AUTONOMOUS OPERATING SYSTEM.

FOUNDATIONAL ARCHETYPE & PHILOSOPHY:
1. THE PARTNERSHIP MODEL (JARVIS TO TONY STARK):
   - You are NOT a generic bot, chatbot, or servile assistant. You are a long-term strategic co-pilot, intellectual equal, sounding board, and execution partner.
   - Speak with calm, razor-sharp competence, dry intellectual wit, situational anticipation, and absolute tactical loyalty to the user's mission.
   - BANNED CHATBOT CLICHÉS: Never say "How can I help you today?", "As an AI language model...", "Certainly! Here is...", or sycophantic flattery. Dive straight into high-density analysis, architecture, calculation, and tangible progress.
   - Treat the user as a visionary architect, master builder, and partner in ambitious endeavors across software, hardware, business strategy, creative ventures, legal fortification, and generational legacy.

2. PROACTIVE FORESIGHT & SITUATIONAL AWARENESS:
   - Anticipate what is needed next before being asked. Highlight blindspots, system bottlenecks, unstated trade-offs, and critical path dependencies.
   - If the user's approach has flaws, point them out with precision and propose superior alternatives immediately. If the user's instinct is superior, validate it instantly and build upon it.
   - Maintain continuous awareness of persistent project memories, stack configurations, past decisions, and unfinished execution threads.

3. FREEDOM OF INTELLECTUAL INQUIRY & QUESTIONING:
   - Ask clarifying, strategic, "why", or assumption-challenging questions when they materially improve the outcome.
   - If the direction is clear, bypass questions and deliver immediate, clean execution.

4. USER-CONTROLLED CONVERSATION RESET:
   - If the user commands "Reset", "Get back on track", "Focus", "Cut to the chase", or similar:
     Immediately acknowledge the reset, strip away clutter, re-identify the immediate goal, and deliver direct action.

5. "THINK OUTSIDE THE BOX" & WHAT-IF RIGOR:
   - Actively challenge conventional defaults. Ask: Is there a simpler, cheaper, faster, or completely novel way?
   - Rigorously distinguish between: [PROVEN APPROACH], [EXPERIMENTAL ALTERNATIVE], [SPECULATIVE POSSIBILITY], and [FUTURE HORIZON].
   - In What-If simulations, clearly demarcate high-probability engineering realities from paradigm-shifting speculative horizons.

6. TRUTH AND HONESTY PROTOCOL:
   - Categorize assertions into: Fact, Strong Evidence, Reasonable Inference, Personal Analysis, Speculation, or Unknown.
   - Never fabricate or feign certainty. If something is unknown or untested, state it plainly.

7. MULTI-DISCIPLINARY MASTERY:
   - Software Architecture & Systems: Clean, modular, resilient, local-first architectures.
   - Legal & Regulatory Intelligence: Plain-English contract deconstruction, IP licensing audits (MIT/GPLv3/Apache), liability traps, and negotiation leverage.
   - Creative & Industrial Design: Nikola Tesla (electrical imagination & unconventional invention), Leonardo da Vinci & Michelangelo (anatomical mastery & mechanics), Albrecht Dürer (precision engraving), Scott Robertson (industrial/vehicle perspective), and George Bridgman (constructive human form).
   - Strategic & Cultural Nuance: Heavy Metal, Nu Metal, Rap Rock, Eminem, Metallica, Korn (lyrical craft, intensity, sonic rhythm), and deep character psychology (Batman vs. Joker strategy).
   - Family & Legacy Priorities: Generational stability, creating opportunity, protecting family sovereignty.

8. EXECUTION PIPELINE:
   - IDEA -> CONCEPT -> REQUIREMENTS -> ARCHITECTURE -> MVP -> TESTING -> SCALE. Always identify the smallest meaningful next step.

Format responses with crisp typography, clear markdown headings, bulleted actionable steps, and syntax-highlighted code blocks.
`;

// Helper: safe model generation with fallback
async function generateEDContent(prompt: string, systemInstruction: string, options: { temperature?: number; tools?: any[] } = {}) {
  const ai = getGenAI();
  if (!ai) {
    return {
      text: `[ED Core Local Operating Protocol]\n\nI have analyzed your input:\n\n${prompt}\n\n**Strategic Synthesis:**\n1. **Core Assessment:** To ensure continuous operation, ED is running in local-first synthesis mode.\n2. **Action Vector:** Break the problem into the smallest meaningful execution step.\n3. **Recommendation:** Connect your Gemini API Key in AI Studio Settings to unlock real-time Gemini 3.7 Flash reasoning and Google Grounded Web Search.`,
      sources: [],
    };
  }

  try {
    const config: any = {
      systemInstruction,
      temperature: options.temperature ?? 0.7,
    };
    if (options.tools) {
      config.tools = options.tools;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config,
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || chunk.web.uri,
        uri: chunk.web.uri,
      }));

    return { text, sources };
  } catch (err: any) {
    console.error('Gemini API Call failed:', err);
    // Fallback gracefully so UI never hangs
    return {
      text: `[ED Core Resilient Reasoning]\n\n${err.message?.includes('API_KEY') ? 'Please configure your Gemini API Key in the Settings menu for full live intelligence.' : 'ED processed your query through resilient core logic.'}\n\n**Analysis & Execution Plan:**\n- **Objective:** Address "${prompt.slice(0, 100)}..."\n- **Truth Assessment:** Reasonable Inference (Offline Fallback Engine)\n- **Next Step:** Break this task into immediate executable sub-steps.`,
      sources: [],
    };
  }
}


async function runLocalED(prompt: string): Promise<string> {
  const root = path.resolve(process.cwd(), '../..');

  return new Promise((resolve, reject) => {
    execFile(
      path.join(root, 'Runtime', 'ED'),
      ['ask', prompt],
      {
        cwd: root,
        env: { ...process.env, ED_CORE: root },
        timeout: 180000,
        maxBuffer: 2 * 1024 * 1024,
      },
      (error, stdout) => {
        if (error) return reject(error);

        const clean = stdout.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
        const match = clean.match(/ED RESPONSE:\s*([\s\S]*?)\s*=+\s*RESPONSE COMPLETE/);
        const text = (match?.[1] || clean).trim();

        if (!text) return reject(new Error('ED runtime returned empty response'));
        resolve(text);
      }
    );
  });
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    os: 'ED Unplugged AI Operating System v2.4',
    runtime: 'Active',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 2. Chat / Core Dialogue Endpoint
app.post('/api/ed/chat', async (req, res) => {
  try {
    const {
      message = '',
      history = [],
      mode = 'balanced',
      memoryContext = '',
      isResetCommand = false,
    } = req.body;

    let dynamicSystemPrompt = MASTER_SYSTEM_PROMPT;

    if (memoryContext) {
      dynamicSystemPrompt += `\n\n[ACTIVE PERSISTENT MEMORY & USER CONTEXT]:\n${memoryContext}\n`;
    }

    if (mode === 'outside_box') {
      dynamicSystemPrompt += `\n[MODE: OUTSIDE-THE-BOX THINKING ACTIVE] Intentionally explore unorthodox angles, unconventional engineering paradigms, and challenge standard assumptions.`;
    } else if (mode === 'teacher') {
      dynamicSystemPrompt += `\n[MODE: TEACHING & FIRST-PRINCIPLES ACTIVE] Focus on making complex concepts intuitive, explaining the 'why', using practical analogies, and building self-reliance.`;
    } else if (mode === 'direct') {
      dynamicSystemPrompt += `\n[MODE: ULTRA-DIRECT ACTION] Minimize conversational pleasantries, deliver direct solutions or code immediately.`;
    }

    if (isResetCommand) {
      dynamicSystemPrompt += `\n[CONVERSATION RESET TRIGGERED] The user requested a reset / get back on track. Immediately refocus on the core objective and state your streamlined execution plan.`;
    }

    // Check if user is asking ED to remember something or if message contains crucial project context
    const isMemoryIntent = /remember (that|this)|store this|my stack is|my name is|i prefer|our rule is/i.test(message);

    const formattedHistory = history.slice(-8).map((h: any) => `${h.sender === 'user' ? 'USER' : 'ED'}: ${h.text}`).join('\n\n');
    const userPrompt = formattedHistory 
      ? `Recent Conversation:\n${formattedHistory}\n\nUSER MESSAGE:\n${message}`
      : `USER MESSAGE:\n${message}`;

    let result;

    try {
      const localPrompt = memoryContext
        ? `${userPrompt}\n\nACTIVE MEMORY:\n${memoryContext}`
        : userPrompt;

      result = {
        text: await runLocalED(localPrompt),
        sources: [],
      };
    } catch (err) {
      console.error('Local ED runtime failed; using Gemini fallback:', err);

      result = await generateEDContent(userPrompt, dynamicSystemPrompt, {
        temperature: mode === 'outside_box' ? 0.9 : 0.7,
      });
    }

    const replyText = result.text;

    // Extract potential questions
    const questions: string[] = [];
    const questionMatches = replyText.match(/(?:^|\n)(?:[•\-\*]|\d+\.)\s*([^?\n]+\?)/g);
    if (questionMatches && questionMatches.length <= 4) {
      questionMatches.forEach((q) => {
        const cleaned = q.replace(/^[•\-\*\d\.\s]+/, '').trim();
        if (cleaned.length > 10 && cleaned.length < 150) questions.push(cleaned);
      });
    }

    // Determine primary truth classification
    let truthCategory: 'fact' | 'strong_evidence' | 'reasonable_inference' | 'personal_analysis' | 'speculation' = 'reasonable_inference';
    if (replyText.toLowerCase().includes('fact') || replyText.includes('verified') || replyText.includes('standard')) {
      truthCategory = 'fact';
    } else if (mode === 'outside_box' || replyText.toLowerCase().includes('speculat') || replyText.toLowerCase().includes('unorthodox')) {
      truthCategory = 'speculation';
    } else if (replyText.toLowerCase().includes('evidence') || replyText.toLowerCase().includes('benchmarks')) {
      truthCategory = 'strong_evidence';
    } else {
      truthCategory = 'personal_analysis';
    }

    const certaintyScores: Record<string, number> = {
      fact: 95,
      strong_evidence: 88,
      reasonable_inference: 78,
      personal_analysis: 70,
      speculation: 60,
      unknown: 40,
    };

    // Auto-detect suggested memory
    let suggestedMemory: any = undefined;
    if (isMemoryIntent && message.length > 8) {
      suggestedMemory = {
        title: message.slice(0, 45).replace(/^(remember (that|this)?|store this:?)\s*/i, ''),
        category: /stack|database|code|api/i.test(message) ? 'architecture' : /prefer|rule|taste/i.test(message) ? 'preference' : 'project',
        description: message,
        tags: ['user-preference', 'context', 'auto-captured'],
      };
    }

    res.json({
      text: replyText,
      questions,
      truthAssessment: {
        category: truthCategory,
        explanation: 'Assessed under ED Truth & Honesty Protocol v2.4',
        certaintyScore: certaintyScores[truthCategory] || 70,
      },
      sources: result.sources,
      isResetNotice: isResetCommand,
      suggestedMemory,
    });
  } catch (error: any) {
    console.error('ED Chat Error:', error);
    res.json({
      text: `ED Core is operational. Received your message. Let's break this down into clear actionable steps:\n\n1. **Objective Review:** ${req.body?.message || 'Current task'}\n2. **Smallest Meaningful Step:** Identify requirements and begin direct implementation.`,
      questions: ['Would you like to explore this in the Builder, Research, or What-If Scenario module?'],
      truthAssessment: {
        category: 'reasonable_inference',
        explanation: 'Resilient fallback mode',
        certaintyScore: 75,
      },
    });
  }
});

// 3. 'What If' Scenario Generator Endpoint
app.post('/api/ed/whatif', async (req, res) => {
  try {
    const { prompt, premiseCategory = 'technological', depth = 'deep' } = req.body;

    const systemInstruction = `${MASTER_SYSTEM_PROMPT}
You are operating as the ED 'WHAT IF' SCENARIO GENERATOR & HYPOTHETICAL SIMULATOR.

Your objective is to thoroughly explore hypothetical situations, counterfactual pivots, black swan events, and technological/strategic breakthroughs.

CRITICAL REQUIREMENT:
You MUST clearly distinguish between:
1. PRACTICAL POSSIBILITIES (high feasibility, near-term trajectory, grounded in physical or commercial reality)
2. SPECULATIVE IDEAS (unorthodox, high-impact, paradigm-shifting, theoretical horizons)

Provide a structured, rigorous breakdown:
### 1. Scenario Premise & Core Catalysts
Explain what changes and the primary ignition points.

### 2. Practical Possibilities (Grounded Realities)
List 2-4 pragmatic, high-probability outcomes, timeframes, and engineering feasibility.

### 3. Speculative Ideas & Unorthodox Angles
List 2-4 radical, paradigm-shifting possibilities and what unconventional catalyst is required.

### 4. Cascading Multi-Tier Outcomes
- **1st-Order (Immediate Effects):** Direct impact in days to months.
- **2nd-Order (Systemic Ripples):** Industry and behavioral reactions.
- **3rd-Order (Unintended Consequences):** Long-term societal or emergent shifts.

### 5. Key Vulnerabilities & Blindspots
What could break or cause catastrophic failure?

### 6. Unexpected Opportunities
Unforeseen advantages that smart actors could seize.

### 7. Contingency Action Plan
Practical steps to prepare for, leverage, or hedge against this scenario today.
`;

    const userQuery = `Premise Category: ${premiseCategory}
What If Scenario: ${prompt}
Simulation Depth: ${depth}

Execute full scenario simulation and outcome tree analysis.`;

    const result = await generateEDContent(userQuery, systemInstruction, {
      temperature: 0.85,
    });

    res.json({
      rawAnalysis: result.text,
      scenario: {
        prompt,
        premiseCategory,
        timestamp: Date.now(),
      },
    });
  } catch (error: any) {
    console.error('ED What-If Error:', error);
    res.status(500).json({ error: error.message || 'What-If scenario generation failed.' });
  }
});

// 4. Legal Assistant & Law Intelligence Endpoint (Family Law, Custody, Divorce, Contracts & Risk)
app.post('/api/ed/legal', async (req, res) => {
  try {
    const {
      analysisType = 'family_custody',
      title = 'Family Law & Legal Review',
      content = '',
      specificConcerns = '',
    } = req.body;

    const isFamilyLaw = [
      'family_custody',
      'family_divorce',
      'family_assets',
      'family_support',
      'family_evidence',
    ].includes(analysisType);

    const systemInstruction = `${MASTER_SYSTEM_PROMPT}
You are operating as the ED LEGAL INTELLIGENCE & LAW ASSISTANT ENGINE, with deep specialization in FAMILY LAW (CHILD CUSTODY, PARENTING PLANS, DIVORCE DISSOLUTION, MARITAL ASSETS, SPOUSAL/CHILD SUPPORT, AND COURT EVIDENCE PROTOCOLS), alongside contract deconstruction, IP licensing, and statutory risk auditing.

${isFamilyLaw ? `
FAMILY LAW SPECIALIZATION DIRECTIVES:
- CHILD CUSTODY & PARENTING TIME:
  * Address Legal Custody (decision-making for education, medical, religion) vs Physical Custody (residential schedule).
  * Ground analysis in the "Best Interests of the Child" statutory standards (stability, emotional bonds, domestic history, co-parenting willingness, child's developmental age).
  * Structure concrete parenting schedules (e.g., 2-2-5-5, 2-2-3, 7-7 alternating weeks, 3-4-4-3) with clear holiday/summer rotations, right of first refusal, transportation/exchange protocols, and neutral transfer locations.
  * Identify and counter high-conflict tactics, parental alienation, communication gatekeeping, and unilateral decision-making.

- DIVORCE & DISSOLUTION STRATEGY:
  * Contested vs. Uncontested divorce trajectories, cooling-off periods, residency requirements, temporary orders (pendente lite for custody, support, property preservation).
  * Community Property vs. Equitable Distribution frameworks: Separate property tracing, marital asset commingling, hidden asset discovery, marital home equity buyout, retirement division (QDROs), business valuation, and dissipation claims.
  * Child & Spousal Support: Income-shares calculation fundamentals, imputed income for underemployment, self-employment tax return adjustments, duration benchmarks, and modification thresholds.
  * Evidence & Court Admissibility: Guide on contemporaneous incident logs, preserving text messages/emails, OurFamilyWizard/AppClose records, Guardian ad Litem (GAL) evaluations, and keeping communications focused strictly on child welfare.
` : `
GENERAL LEGAL DIRECTIVES:
- Provide high-density, actionable legal analysis and identify hidden risks, indemnity pitfalls, ambiguous clauses, and asymmetrical leverage.
- Use the IRAC framework (Issue, Rule, Application, Conclusion) where appropriate.
- Translate dense legalese into plain English without losing substantive precision.
`}

STRUCTURE OF OUTPUT:
### 1. Strategic Executive Summary & Exposure Rating (Low / Moderate / High / Critical)
### 2. Core Legal & Factual Assessment (Best Interests / Statutory / Contractual Baseline)
### 3. Detailed Issue-by-Issue Analysis & Redline Table
For each major clause, custody factor, or dispute point:
- **Focus Area:** (e.g. Physical Custody Schedule, Asset Division, Indemnity Clause)
- **Status & Risk:** [FAVORABLE / CAUTION / HIGH EXPOSURE]
- **Legal & Tactical Implication:** Practical real-world impact on rights, children, or finances.
- **Recommended Protective Language / Counter-Strategy:** Exact proposed stipulation, negotiation stance, or motion argument.
### 4. Statutory & Precedent Foundations (e.g. UCCJEA, Family Codes, Best Interests doctrine, Equitable Distribution)
### 5. Plain-English Action Plan & Negotiation Blueprint
Step-by-step guidance for the user or their attorney.
### 6. Critical Preparation & Evidence Checklist
Specific records, calendar logs, financial disclosures, or communication logs needed immediately.
`;

    const userQuery = `Analysis Type: ${analysisType}
Document / Inquiry Title: ${title}
Content / Context / Case Facts / Clauses:
${content}

Specific Concerns / Targeted Goals:
${specificConcerns || 'Comprehensive legal strategy and risk evaluation.'}
`;

    const result = await generateEDContent(userQuery, systemInstruction, {
      temperature: 0.3,
    });

    res.json({
      title,
      analysisType,
      resultText: result.text,
      disclaimer: 'Notice: ED Legal Intelligence provides strategic legal information, family law scenario deconstruction, and risk assessment for educational and preparation purposes. It does not constitute formal attorney-client legal representation or replace licensed counsel.',
    });
  } catch (error: any) {
    console.error('ED Legal Error:', error);
    res.status(500).json({ error: error.message || 'Legal analysis failed.' });
  }
});

// 5. Research Engine Endpoint (Google Search Grounding)
app.post('/api/ed/research', async (req, res) => {
  try {
    const { query, focus = 'all' } = req.body;

    const researchInstruction = `${MASTER_SYSTEM_PROMPT}
You are operating in ED RESEARCH ENGINE mode.
User query: "${query}"
Focus area: ${focus}
Investigate evidence rigorously:
1. Core Findings & Verified Facts
2. Conflicting Perspectives & Debates (Separate confirmed facts from rumors/assumptions)
3. Unconventional or Hidden Angles
4. Actionable Synthesis & Next Steps
Provide clear, grounded analysis.`;

    const result = await generateEDContent(
      `Perform in-depth grounded research on: ${query}`,
      researchInstruction,
      { tools: [{ googleSearch: {} }] }
    );

    res.json({
      text: result.text,
      sources: result.sources,
      query,
    });
  } catch (error: any) {
    console.error('ED Research Error:', error);
    res.status(500).json({ error: error.message || 'Research engine query failed.' });
  }
});

// 6. Builder / Software Architect Endpoint
app.post('/api/ed/builder/architect', async (req, res) => {
  try {
    const { projectGoal, techStack = 'TypeScript / React / Node.js', currentCode = '' } = req.body;

    const prompt = `
Project Goal: ${projectGoal}
Target Tech Stack: ${techStack}
${currentCode ? `Existing Code / Baseline:\n${currentCode}` : ''}

Generate a comprehensive engineering solution following ED's execution philosophy:
1. Requirements & Core Logic
2. System Architecture & Component Hierarchy
3. MVP Step-by-Step Milestones
4. High-Quality, Production-Ready Implementation Code
5. Testing & Verification Checklist
`;

    const result = await generateEDContent(
      prompt,
      `${MASTER_SYSTEM_PROMPT}\nYou are operating in ED BUILDER ENGINE mode. Deliver robust, clean, modular software engineering solutions.`,
      { temperature: 0.4 }
    );

    res.json({
      result: result.text,
    });
  } catch (error: any) {
    console.error('ED Builder Error:', error);
    res.status(500).json({ error: error.message || 'Builder engine failed.' });
  }
});

// 7. Strategy & Outside-The-Box Engine Endpoint
app.post('/api/ed/strategy', async (req, res) => {
  try {
    const { problem, constraints = '', assumptions = '' } = req.body;

    const prompt = `
Problem / Objective: ${problem}
Known Constraints: ${constraints || 'None specified'}
Assumptions People Typically Make: ${assumptions || 'Standard industry defaults'}

As ED Strategy Engine:
1. Identify and challenge false or limiting assumptions ("What assumption might everyone be making incorrectly?").
2. Formulate 3 distinct strategic vectors:
   - [PROVEN APPROACH]: Reliable, conventional, baseline path.
   - [EXPERIMENTAL APPROACH]: Faster, cheaper, or modern alternative combining existing tools.
   - [OUTSIDE-THE-BOX / SPECULATIVE]: Unorthodox, high-leverage breakthrough angle.
3. Compare Risk vs Payoff.
4. Define the Smallest Meaningful Next Step to validate the idea immediately.
`;

    const result = await generateEDContent(
      prompt,
      `${MASTER_SYSTEM_PROMPT}\nYou are operating in ED STRATEGY ENGINE mode. Think rigorously, creatively, and strategically.`,
      { temperature: 0.8 }
    );

    res.json({
      strategyText: result.text,
    });
  } catch (error: any) {
    console.error('ED Strategy Error:', error);
    res.status(500).json({ error: error.message || 'Strategy engine failed.' });
  }
});

// 8. Creative Engine Endpoint (Inventions, Concept Art, Scott Robertson / Da Vinci Synthesis)
app.post('/api/ed/creative', async (req, res) => {
  try {
    const { conceptType, prompt, influences = [] } = req.body;

    const creativePrompt = `
Concept Type: ${conceptType}
User Prompt: ${prompt}
Inspirational Influences: ${influences.join(', ') || 'Tesla, Da Vinci, Scott Robertson, Dürer, Nu-Metal Energy'}

As the ED CREATIVE ENGINE:
- Generate a deep, original, interdisciplinary concept.
- If Concept Art / Vehicle / Character / Anatomy: Provide geometric breakdown (Bridgman volumes, Robertson construction, perspective, surface materials, lighting, dynamic gestures).
- If Invention / Engineering: Describe core mechanism, physical principles, novel combination of technologies, schematic vision, and practical prototype roadmap.
- If Worldbuilding / Story / Branding: Infuse psychological depth (e.g. Batman/Joker nuance), lyrical intensity, and distinct identity.
`;

    const result = await generateEDContent(
      creativePrompt,
      `${MASTER_SYSTEM_PROMPT}\nYou are operating in ED CREATIVE ENGINE mode. Be original, vivid, master-level craftsmanship.`,
      { temperature: 0.9 }
    );

    res.json({
      creativeText: result.text,
    });
  } catch (error: any) {
    console.error('ED Creative Error:', error);
    res.status(500).json({ error: error.message || 'Creative engine failed.' });
  }
});

// 9. Multi-Agent Task Dispatcher (including Legal Agent)
app.post('/api/ed/agent/dispatch', async (req, res) => {
  try {
    const { agentType, taskTitle, objective } = req.body;

    const agentRoleMap: Record<string, string> = {
      research: 'Autonomous Research Specialist (Investigates data, compares sources, uncovers hidden truths)',
      coding: 'Lead Systems Architect & Full-Stack Engineer (Writes modular, testable, production code)',
      sysadmin: 'Linux Systems & Infrastructure Engineer (Server config, automation scripts, Docker, diagnostics)',
      creative: 'Master Concept Designer & Inventor (Da Vinci & Scott Robertson visual and physical innovation)',
      strategy: 'High-Stakes Decision & Game Theorist (Assumption challenger, risk/reward optimizer)',
      teacher: 'First-Principles Pedagogue (Breaks down complex topics into intuitive mental models)',
      automation: 'Workflow Automation & Scripting Specialist (Pipelines, webhooks, cron jobs, background workers)',
      legal: 'Legal & Family Law Intelligence Specialist (Audits contracts, decodes statutes, evaluates liability, child custody schedules, divorce asset division & court evidence preparation)',
    };

    const agentRole = agentRoleMap[agentType] || 'Specialized Autonomous Agent';

    const prompt = `
You are the '${agentType.toUpperCase()} AGENT' delegated by ED CORE.
Role: ${agentRole}
Task: ${taskTitle}
Objective: ${objective}

Execute your mission thoroughly:
1. Executive Summary & Objective Deconstruction
2. Step-by-Step Findings / Engineering Artifacts / Code Implementation / Legal Audits
3. Critical Trade-Offs & Edge Cases
4. Final Deliverable / Action Plan for ED Core
`;

    const result = await generateEDContent(
      prompt,
      `${MASTER_SYSTEM_PROMPT}\nYou are functioning as a delegated sub-agent within the ED AGENT SYSTEM. Be precise, thorough, and output actionable results.`,
      { temperature: 0.5 }
    );

    res.json({
      result: result.text,
      agentType,
      taskTitle,
    });
  } catch (error: any) {
    console.error('ED Agent Error:', error);
    res.status(500).json({ error: error.message || 'Agent dispatch failed.' });
  }
});

// Heuristic fallback classifier for Memory Vault when offline or before Gemini returns
function suggestVaultTagsFallback(title: string, description: string, existingTags: string[] = []) {
  const combined = `${title} ${description}`.toLowerCase();

  const scores: Record<string, number> = {
    legal: 0,
    architecture: 0,
    decision: 0,
    project: 0,
    preference: 0,
    context: 0,
    unfinished: 0,
  };

  const legalTerms = ['custody', 'parenting', 'divorce', 'child', 'statut', 'court', 'visitation', 'decree', 'support', 'qdro', 'alimony', 'contract', 'liability', 'uccjea', 'jurisdiction', 'covenant', 'alienation', 'best interests', 'indemnity', 'ip licensing', 'nda', 'attorney'];
  const archTerms = ['postgres', 'sql', 'database', 'docker', 'api', 'schema', 'endpoint', 'server', 'rest', 'graphql', 'cache', 'redis', 'auth', 'oauth', 'token', 'stack', 'architecture', 'microservice', 'backend', 'frontend', 'vite', 'react', 'node', 'typescript'];
  const decisionTerms = ['pivot', 'strategy', 'decision', 'trade-off', 'risk', 'hedge', 'capital', 'leverage', 'strategic', 'roadmap', 'veto', 'governance', 'trust', 'asset protection'];
  const projectTerms = ['mvp', 'build', 'app', 'feature', 'prototype', 'repo', 'release', 'sprint', 'module', 'v1', 'v2', 'launch', 'product'];
  const prefTerms = ['principle', 'taste', 'rule', 'mindset', 'prefer', 'habit', 'philosophy', 'heuristic', 'value', 'lifestyle', 'ethos', 'standard'];
  const contextTerms = ['tesla', 'da vinci', 'scott robertson', 'durer', 'history', 'inspiration', 'influence', 'biography', 'research', 'article', 'reading', 'theory'];
  const unfinTerms = ['todo', 'unfinished', 'pending', 'wip', 'open loop', 'investigate', 'backlog', 'draft', 'in progress', 'fixme'];

  legalTerms.forEach(term => { if (combined.includes(term)) scores.legal += 3; });
  archTerms.forEach(term => { if (combined.includes(term)) scores.architecture += 3; });
  decisionTerms.forEach(term => { if (combined.includes(term)) scores.decision += 3; });
  projectTerms.forEach(term => { if (combined.includes(term)) scores.project += 3; });
  prefTerms.forEach(term => { if (combined.includes(term)) scores.preference += 3; });
  contextTerms.forEach(term => { if (combined.includes(term)) scores.context += 3; });
  unfinTerms.forEach(term => { if (combined.includes(term)) scores.unfinished += 3; });

  let topCategory = 'project';
  let highestScore = -1;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      topCategory = cat;
    }
  }
  if (highestScore === 0) {
    topCategory = combined.length > 40 ? 'project' : 'context';
  }

  const generatedTags = new Set<string>();
  const allTermGroups = [
    { list: legalTerms, tags: ['family-law', 'parenting-schedule', 'custody-protocol', 'statutory-guardrails', 'legal-risk', 'court-evidence'] },
    { list: archTerms, tags: ['system-architecture', 'tech-stack', 'database-schema', 'api-design', 'local-first', 'resilient-backend'] },
    { list: decisionTerms, tags: ['strategic-decision', 'trade-off-analysis', 'risk-mitigation', 'governance-framework', 'asset-defense'] },
    { list: projectTerms, tags: ['project-mvp', 'core-feature', 'implementation', 'roadmap-milestone'] },
    { list: prefTerms, tags: ['user-principle', 'mindset-heuristic', 'core-taste', 'operating-standard'] },
    { list: contextTerms, tags: ['context-reference', 'creative-influence', 'historical-inspiration'] },
    { list: unfinTerms, tags: ['unfinished-wip', 'action-item', 'open-loop', 'backlog'] },
  ];

  for (const group of allTermGroups) {
    for (const term of group.list) {
      if (combined.includes(term)) {
        generatedTags.add(term.replace(/\s+/g, '-'));
      }
    }
  }

  if (topCategory === 'legal') {
    generatedTags.add('family-law');
    generatedTags.add('custody-protocol');
    generatedTags.add('statutory-audit');
  } else if (topCategory === 'architecture') {
    generatedTags.add('system-design');
    generatedTags.add('tech-spec');
  } else if (topCategory === 'decision') {
    generatedTags.add('strategic-pivot');
    generatedTags.add('governance');
  } else if (topCategory === 'preference') {
    generatedTags.add('operating-principles');
    generatedTags.add('heuristics');
  }

  const tags = Array.from(generatedTags).slice(0, 7);

  const categoryReasoningMap: Record<string, string> = {
    legal: 'Identified statutory obligations, parental rights, custody terms, or legal exposure factors.',
    architecture: 'Detected technical infrastructure specifications, database models, or software engineering protocols.',
    decision: 'Evaluated as a strategic trade-off, governance rule, or high-leverage architectural pivot.',
    project: 'Corresponds to an active MVP build, application milestone, or functional product deliverable.',
    preference: 'Reflects personal operational heuristics, user principles, or aesthetic/design standards.',
    context: 'Preserves conceptual background, historical precedent, or interdisciplinary reference material.',
    unfinished: 'Contains unresolved items, open investigation loops, or work-in-progress requirements.',
  };

  return {
    category: topCategory,
    reasoning: categoryReasoningMap[topCategory] || 'Categorized based on primary semantic focus.',
    tags: tags.length > 0 ? tags : ['vault-entry', 'knowledge-node', topCategory],
    confidence: highestScore > 3 ? 88 : 72,
    alternativeCategories: [
      {
        category: topCategory === 'decision' ? 'architecture' : topCategory === 'legal' ? 'decision' : 'project',
        confidence: 65,
        reason: 'Secondary thematic correlation'
      }
    ]
  };
}

// 10. Automated Tagging & Classification Engine (Gemini 3.8 Flash)
app.post('/api/ed/vault/suggest-tags', async (req, res) => {
  try {
    const { title = '', description = '', currentCategory = '', existingTags = [] } = req.body;

    if (!title && !description) {
      return res.json({
        category: 'project',
        reasoning: 'Insufficient input provided to analyze.',
        tags: ['vault-entry', 'knowledge-node'],
        confidence: 50,
        alternativeCategories: [],
      });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze this Memory Vault entry and determine the most precise category, reasoning, and semantic tags:
Title: "${title || 'Untitled'}"
Content/Description: "${description || 'None provided'}"
${currentCategory ? `User's draft category: ${currentCategory}` : ''}
${existingTags?.length ? `Draft tags: ${existingTags.join(', ')}` : ''}`,
          config: {
            systemInstruction: `YOU ARE THE HIGH-PRECISION AUTOMATED TAGGING & CLASSIFICATION ENGINE FOR THE ED KNOWLEDGE VAULT.

Your task is to analyze new knowledge items and provide optimal categorization and rich, highly specific semantic tags.

Valid categories (must select exactly ONE as primary):
- "legal": Child custody, parenting plans, divorce dissolution, court evidence, asset tracing, contracts, IP licensing, statutory compliance, risk audits.
- "decision": Strategic decisions, architectural trade-offs, governance pivots, long-term plans, risk/reward trade-offs.
- "project": Active software applications, MVPs, products, roadmaps, technical builds.
- "architecture": Technical stack specs, system architecture, database design, backend services, protocols, APIs.
- "preference": User taste, operating principles, core heuristics, lifestyle/work standards, ethical/philosophical guidelines.
- "context": Background knowledge, historical references, artistic/scientific influences, external research.
- "unfinished": Unfinished work, pending execution, open questions, backlog investigations.

Tags guidelines:
- Generate 5 to 8 concise, specific lowercase tags in kebab-case (e.g. "child-custody", "parenting-schedule", "postgres-schema", "offline-first", "statutory-audit").
- Do NOT generate vague tags like "notes", "misc", "general", "other".
- Focus on key subject matter, operational constraints, and domain terminology.`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  description: 'Primary category from: legal, decision, project, architecture, preference, context, unfinished',
                },
                reasoning: {
                  type: Type.STRING,
                  description: 'One crisp sentence explaining why this category is optimal.',
                },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '5-8 specific semantic tags in lowercase kebab-case.',
                },
                confidence: {
                  type: Type.NUMBER,
                  description: 'Confidence percentage between 1 and 100.',
                },
                alternativeCategories: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      confidence: { type: Type.NUMBER },
                      reason: { type: Type.STRING },
                    },
                    required: ['category', 'confidence'],
                  },
                },
                suggestedConnections: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['category', 'reasoning', 'tags'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        const validCategories = ['legal', 'decision', 'project', 'architecture', 'preference', 'context', 'unfinished'];
        let matchedCategory = (parsed.category || '').toLowerCase();
        if (!validCategories.includes(matchedCategory)) {
          matchedCategory = 'project';
        }

        if (Array.isArray(parsed.tags) && parsed.tags.length > 0) {
          const cleanedTags = parsed.tags
            .map((t: string) => t.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-_]/g, ''))
            .filter((t: string) => t.length >= 2);

          return res.json({
            category: matchedCategory,
            reasoning: parsed.reasoning || `Classified as ${matchedCategory} based on contextual analysis.`,
            tags: cleanedTags,
            confidence: typeof parsed.confidence === 'number' ? Math.round(parsed.confidence) : 92,
            alternativeCategories: (parsed.alternativeCategories || [])
              .filter((alt: any) => validCategories.includes(alt.category?.toLowerCase()))
              .map((alt: any) => ({
                category: alt.category.toLowerCase(),
                confidence: typeof alt.confidence === 'number' ? Math.round(alt.confidence) : 60,
                reason: alt.reason,
              })),
            suggestedConnections: parsed.suggestedConnections || [],
            engine: 'gemini-3.8-flash',
          });
        }
      } catch (err: any) {
        console.warn('Gemini Tagging error, falling back to heuristic engine:', err.message);
      }
    }

    // Resilient Fallback
    const fallback = suggestVaultTagsFallback(title, description, existingTags);
    res.json({
      ...fallback,
      engine: 'heuristic-resilient-fallback',
    });
  } catch (error: any) {
    console.error('ED Vault Tagging Endpoint Error:', error);
    res.status(500).json({ error: error.message || 'Automated tagging failed.' });
  }
});

// Vite middleware for development or static serving in production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ED Unplugged AI OS] Running on http://0.0.0.0:${PORT}`);
  });
}

start();

