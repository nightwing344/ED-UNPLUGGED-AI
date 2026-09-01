import React, { useState } from 'react';
import { 
  Scale, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Check, 
  RefreshCw, 
  BookOpen, 
  HelpCircle, 
  ArrowRight,
  Cpu,
  Layers,
  Copy,
  Users,
  Heart,
  Calendar,
  DollarSign,
  ClipboardList,
  Clock,
  Sparkles,
  ChevronRight,
  Calculator,
  Shield,
  FileCheck
} from 'lucide-react';
import { CustodyScheduleModel, BestInterestsFactor } from '../types';

interface LegalModuleProps {
  onSaveToMemory: (title: string, content: string, tags: string[]) => void;
  onDispatchLegalAgent?: (title: string, objective: string) => void;
  onNavigateModule?: (module: string) => void;
}

const PRESET_FAMILY_TEMPLATES = [
  {
    type: 'family_custody',
    title: '50/50 Joint Physical & Legal Custody Parenting Plan (2-2-5-5 Schedule)',
    content: `PROPOSED CUSTODY & PARENTING PLAN STIPULATION:
1. Legal Custody: Both parents share Joint Legal Custody with equal decision-making on education, medical, dental, psychological, and religious upbringing. Neither parent may make unilateral non-emergency decisions without 72-hour written notice.
2. Physical Custody Schedule (2-2-5-5 Rotation):
   - Parent A: Every Monday & Tuesday overnight.
   - Parent B: Every Wednesday & Thursday overnight.
   - Weekends alternate: Friday school dismissal through Monday morning school return (5-day blocks).
3. Exchanges & Transportation: All exchanges take place at school drop-off / pick-up to minimize direct parental contact during high conflict.
4. Right of First Refusal: If either parent cannot care for the children during their scheduled parenting time for more than 4 consecutive hours, the other parent shall be offered the first option to care for the child before engaging third-party babysitters.
5. Holiday & Vacation Rotation: Major holidays (Thanksgiving, Christmas Eve/Day, Spring Break, 4th of July) alternate odd/even calendar years. Each parent is entitled to two (2) uninterrupted 7-day summer vacation blocks with 30 days prior written notice.`,
    concerns: 'Ensure clear tie-breaking procedures for joint legal disputes, enforceable Right of First Refusal rules, out-of-state travel notification protocols, and anti-alienation non-disparagement covenants.',
  },
  {
    type: 'family_divorce',
    title: 'Divorce Dissolution & Marital Property Separation Strategy',
    content: `DIVORCE DISSOLUTION FACT PATTERN & ASSET DIVISION INQUIRY:
1. Marriage Length: 8 years. Two minor children (ages 6 and 4).
2. Marital Residence: Current market value $650,000. Remaining mortgage $320,000. Net equity $330,000. Parent A desires to buy out Parent B's 50% equity share ($165,000) and refinance the mortgage solely into Parent A's name within 90 days of decree entry.
3. Separate Property Claim: Parent A contributed $50,000 from a pre-marital inheritance toward the initial down payment (Bank records and closing statement available).
4. Retirement Accounts: Parent A 401(k) value: $210,000 (accrued during marriage). Parent B IRA value: $90,000 (accrued during marriage). Propose Qualified Domestic Relations Order (QDRO) equalization.
5. Debt Allocation: Joint credit card debt of $18,000 accumulated prior to date of separation.`,
    concerns: 'Calculate equitable vs community property distribution, evaluate tracing requirements for the $50k separate inheritance down payment, draft QDRO rollover instructions, and structure temporary support pendente lite.',
  },
  {
    type: 'family_support',
    title: 'Child Support & Extraordinary Expense Allocation (Material Change in Circumstance)',
    content: `CHILD SUPPORT MODIFICATION ANALYSIS:
1. Current Order: Parent A pays $1,200/month based on a historical 80/20 parenting time schedule and Parent A earning $110,000/year and Parent B earning $45,000/year.
2. Material Change:
   - Parenting time has shifted by court stipulation to equal 50/50 overnights (182.5 overnights each parent).
   - Parent B's income has increased to $72,000/year.
   - Child health insurance premium of $350/month is paid directly by Parent A.
   - Work-related childcare / after-school expenses equal $600/month.
3. Request: Calculate updated child support under Income Shares Model, credit for health insurance & direct childcare payments, and percentage split (pro-rata) for out-of-pocket medical and extracurricular sports fees.`,
    concerns: 'Determine adjusted gross incomes, calculate overnight deviation credits, ensure automatic tax exemption alternation (claiming children in alternate tax years), and establish statutory arrears reconciliation.',
  },
  {
    type: 'family_evidence',
    title: 'Custody Incident & High-Conflict Communication Log (Court Exhibit Formatter)',
    content: `CHRONOLOGICAL INCIDENT & COMMUNICATION RECORD:
- Incident 1 [May 12, 17:30]: Scheduled Friday exchange at school. Parent B failed to appear for 45 minutes without notice. When contacted, Parent B stated in SMS: "I'm keeping them tonight because you didn't answer my call yesterday." (SMS screenshot preserved, time-stamped).
- Incident 2 [May 28, 09:00]: Parent B scheduled child's pediatric appointment without notifying Parent A, violating Joint Legal Custody consultation clause. Parent A was not given the doctor's report.
- Incident 3 [June 14, 20:15]: During FaceTime call with child, Parent B was heard in background disparaging Parent A ("Your father is trying to steal you from us"), causing child visible distress.
- Incident 4 [July 03, 12:00]: Parent B refused summer vacation travel clearance despite Parent A providing itinerary, flight numbers, and hotel address 45 days in advance as required by paragraph 6 of the decree.`,
    concerns: 'Organize into an admissible court-ready declaration exhibit showing pattern of custody interference, parental alienation, and willful violation of joint legal custody terms.',
  },
  {
    type: 'contract_review',
    title: 'Software Consulting & IP Assignment Agreement',
    content: `CONSULTING SERVICES & INTELLECTUAL PROPERTY ASSIGNMENT:
1. Services & Deliverables: Contractor shall deliver software code specified in Schedule A.
2. IP Ownership: Contractor irrevocably assigns to Client all right, title, and interest in Work Product, including pre-existing open-source modules, developer tooling, and proprietary libraries created prior to or during the term.
3. Indemnification: Contractor agrees to defend, indemnify, and hold harmless Client against any claims, losses, liabilities, and legal fees.
4. Liability: Contractor liability shall be unlimited. Client liability capped at past 30 days fees.`,
    concerns: 'Audit overbroad IP capture, asymmetric indemnity traps, and unlimited contractor liability.',
  },
  {
    type: 'ip_licensing',
    title: 'Open Source Dual-Licensing (MIT vs GPLv3 vs Apache 2.0)',
    content: `We are building a local-first AI operating system with open-source core modules and proprietary cloud telemetry connectors.
1. Can we bundle MIT components without exposing proprietary plugins?
2. If we link with a GPLv3 library, does it trigger a copyleft viral clause requiring our full source code to be released?
3. How does Apache 2.0 handle patent grants and contributor indemnification?`,
    concerns: 'Clarify viral copyleft risks, patent protection, and dual-licensing strategies for commercial deployment.',
  },
];

const CUSTODY_SCHEDULES: CustodyScheduleModel[] = [
  {
    name: '2-2-5-5 Rotation (50/50)',
    type: '2-2-5-5',
    parentAPercentage: 50,
    parentBPercentage: 50,
    description: 'Parent A always has Mon-Tue, Parent B always has Wed-Thu. Weekends (Fri-Sun) alternate. Creates 2-day midweeks and 5-day alternating blocks.',
    pros: ['Consistent weekdays for school routines & extracurriculars', 'No parent goes more than 5 days without seeing the child', 'Equal 50/50 division of overnights'],
    cons: ['Frequent exchanges during mid-week', 'Requires close residential proximity'],
    recommendedAges: 'School-age children (Ages 5-16)',
    exchangeRules: 'School drop-off / pick-up exchanges. Friday after school until Monday morning.',
  },
  {
    name: '2-2-3 Rotation (50/50)',
    type: '2-2-3',
    parentAPercentage: 50,
    parentBPercentage: 50,
    description: 'Week 1: Parent A (2 days), Parent B (2 days), Parent A (3 days weekend). Week 2: Parent B (2 days), Parent A (2 days), Parent B (3 days weekend).',
    pros: ['Shortest duration away from either parent', 'Ideal for infants and toddlers with high attachment needs', 'Equal overnight allocation'],
    cons: ['Days of the week change every week', 'Requires high parental coordination and calendar tracking'],
    recommendedAges: 'Infants & Toddlers (Ages 0-5)',
    exchangeRules: 'Evenings at 18:00 or morning drop-off at daycare.',
  },
  {
    name: '7-7 Alternating Weeks (50/50)',
    type: '7-7',
    parentAPercentage: 50,
    parentBPercentage: 50,
    description: 'Children stay with Parent A for 7 full consecutive days, then switch to Parent B for 7 full consecutive days (usually exchange on Friday or Sunday evening).',
    pros: ['Only one exchange per week', 'Complete immersion in one household with zero mid-week packing', 'Excellent for high-conflict parents'],
    cons: ['7 full days apart can be challenging for younger children'],
    recommendedAges: 'Pre-teens & Adolescents (Ages 11-18)',
    exchangeRules: 'Friday afternoon after school dismissal directly to receiving parent.',
  },
  {
    name: 'Every Other Weekend + Midweek Dinner (80/20 or 70/30)',
    type: 'every-other-weekend',
    parentAPercentage: 75,
    parentBPercentage: 25,
    description: 'Primary physical custody with Parent A. Parent B has alternating weekends (Friday 18:00 to Sunday 18:00) plus one weekday dinner/overnight (e.g. Wednesday).',
    pros: ['Maximum stability for children in one primary home and school district', 'Simple schedule for busy work schedules'],
    cons: ['Unequal parenting time may increase child support disparity and feeling of non-primary parent'],
    recommendedAges: 'All ages when distance or work schedules make 50/50 impractical',
    exchangeRules: 'Parent B picks up Friday 18:00 and returns Sunday 18:00 at neutral location or curbside.',
  },
];

const BEST_INTERESTS_FACTORS: BestInterestsFactor[] = [
  {
    factor: 'Home Stability & Continuity',
    statutoryFocus: 'Maintaining child’s school, community, peer group, and stable living environment.',
    parentEvaluation: 'Which parent provides a stable household routine, reliable bedroom space, and consistent schedule?',
    evidenceNeeded: ['Lease/mortgage stability', 'School attendance & report cards', 'Doctor records'],
    courtWeight: 'Critical',
  },
  {
    factor: 'Facilitating Relationship with Other Parent',
    statutoryFocus: 'Willingness of each parent to foster, encourage, and support a loving bond with the other parent.',
    parentEvaluation: 'Does either parent engage in gatekeeping, disparagement, or parental alienation?',
    evidenceNeeded: ['Written text messages/emails', 'Co-parenting app logs', 'Exchange timeliness'],
    courtWeight: 'Critical',
  },
  {
    factor: 'Historical Caregiving Roles',
    statutoryFocus: 'Which parent has historically managed daily feeding, medical appointments, school conferences, and bedtime routines?',
    parentEvaluation: 'Demonstrated history of active day-to-day parenting vs absentee involvement.',
    evidenceNeeded: ['Pediatrician records listing primary contact', 'Teacher communications', 'Activity signups'],
    courtWeight: 'High',
  },
  {
    factor: 'Mental & Physical Health of Parents',
    statutoryFocus: 'Ability of each parent to provide safe, sober, and emotionally stable supervision.',
    parentEvaluation: 'Absence of untreated substance abuse, severe mental instability, or domestic volatility.',
    evidenceNeeded: ['Medical clearances if contested', 'Clean background checks', 'Witness statements'],
    courtWeight: 'Critical',
  },
  {
    factor: 'Child’s Reasonable Preference',
    statutoryFocus: 'Weight given to child’s wishes based on age, maturity, and absence of undue influence or coaching.',
    parentEvaluation: 'Applies primarily to older children (statutory thresholds typically age 12-14+).',
    evidenceNeeded: ['In-camera judicial interview', 'Guardian ad Litem (GAL) report', 'Custody evaluator memo'],
    courtWeight: 'Moderate',
  },
  {
    factor: 'Domestic Safety & Protection',
    statutoryFocus: 'Protection of child from physical abuse, domestic violence, neglect, or endangerment.',
    parentEvaluation: 'Zero tolerance for violent conduct or household safety hazards.',
    evidenceNeeded: ['Police reports', 'Protective orders', 'Child protective services findings'],
    courtWeight: 'Critical',
  },
];

export const LegalModule: React.FC<LegalModuleProps> = ({ 
  onSaveToMemory, 
  onDispatchLegalAgent,
  onNavigateModule 
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'schedules' | 'best_interests' | 'evidence_logger'>('audit');
  const [analysisType, setAnalysisType] = useState<
    | 'family_custody'
    | 'family_divorce'
    | 'family_assets'
    | 'family_support'
    | 'family_evidence'
    | 'contract_review'
    | 'ip_licensing'
    | 'statute_doctrine'
    | 'compliance_risk'
    | 'case_analysis'
  >('family_custody');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [specificConcerns, setSpecificConcerns] = useState('');
  const [jurisdictionState, setJurisdictionState] = useState('General / Uniform Codes (UCCJEA)');
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Evidence Logger State
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logCategory, setLogCategory] = useState<'custody_denial' | 'late_exchange' | 'communication_harassment' | 'unilateral_decision' | 'medical_school_issue'>('late_exchange');
  const [logDescription, setLogDescription] = useState('');
  const [logChildImpact, setLogChildImpact] = useState('');
  const [logProofAvailable, setLogProofAvailable] = useState('');
  const [evidenceEntries, setEvidenceEntries] = useState<any[]>([
    {
      date: '2026-08-15 17:30',
      category: 'late_exchange',
      description: 'Parent B was 45 minutes late to school exchange without prior notice.',
      impact: 'Child was distressed waiting alone in the administrative office.',
      proof: 'Time-stamped school sign-out log and text messages.'
    },
    {
      date: '2026-08-22 09:00',
      category: 'unilateral_decision',
      description: 'Parent B enrolled child in martial arts during Parent A parenting time without consultation.',
      impact: 'Conflicted with existing tutoring schedule and violated joint legal custody clause.',
      proof: 'Email receipt from karate studio showing Parent A was excluded from emergency contact list.'
    }
  ]);

  const handleRunAnalysis = async (customPayload?: any) => {
    const activeTitle = customPayload?.title || title || 'Family Law & Legal Assessment';
    const activeContent = customPayload?.content || content;
    const activeConcerns = customPayload?.concerns || specificConcerns;
    const activeType = customPayload?.type || analysisType;

    if (!activeContent.trim() || isLoading) return;

    setIsLoading(true);
    setSavedSuccess(false);

    try {
      const enrichedConcerns = `${activeConcerns} [Jurisdiction / State Law Context: ${jurisdictionState}]`;
      const res = await fetch('/api/ed/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: activeType,
          title: activeTitle,
          content: activeContent,
          specificConcerns: enrichedConcerns,
        }),
      });

      const data = await res.json();
      setResultText(data.resultText || 'Legal analysis completed with no text.');
    } catch (err: any) {
      console.error('Legal analysis failed:', err);
      setResultText(`Legal audit failed: ${err.message || 'Network error'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVault = () => {
    if (!resultText) return;
    const docTitle = `Legal Audit: ${title || 'Family Law Assessment'}`;
    onSaveToMemory(docTitle, resultText, ['legal', 'family-law', analysisType]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddEvidenceEntry = () => {
    if (!logDescription.trim()) return;
    const newEntry = {
      date: `${logDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      category: logCategory,
      description: logDescription,
      impact: logChildImpact || 'No specific negative behavior documented, but violated schedule protocol.',
      proof: logProofAvailable || 'Contemporaneous journal notation.'
    };
    setEvidenceEntries([newEntry, ...evidenceEntries]);
    setLogDescription('');
    setLogChildImpact('');
    setLogProofAvailable('');
  };

  const handleExportEvidenceToAudit = () => {
    const formatted = evidenceEntries.map((e, idx) => 
      `Exhibit Item ${idx + 1} [${e.date}] - Category: ${e.category.toUpperCase().replace('_', ' ')}\n- Incident Facts: ${e.description}\n- Impact on Child: ${e.impact}\n- Preserved Evidence: ${e.proof}`
    ).join('\n\n');

    setTitle('Chronological Custody Incident & Exchange Evidence Log');
    setContent(`CONTEMPORANEOUS EVIDENCE LOG FOR CUSTODY & DIVORCE PROCEEDINGS:\n\n${formatted}`);
    setSpecificConcerns('Audit these incidents for admissible evidence of custodial interference, parental alienation, and failure to co-parent under state Best Interests statutory factors.');
    setAnalysisType('family_evidence');
    setActiveTab('audit');
  };

  const handleInsertSchedule = (sched: CustodyScheduleModel) => {
    setTitle(`Proposed ${sched.name} Stipulation`);
    setContent(`PROPOSED CUSTODY ROTATION & PARENTING PLAN:
Schedule Type: ${sched.name}
Overnight Allocation: Parent A (${sched.parentAPercentage}%) / Parent B (${sched.parentBPercentage}%)
Schedule Mechanics: ${sched.description}
Exchange & Drop-off Protocol: ${sched.exchangeRules}
Recommended Age Cohort: ${sched.recommendedAges}

SPECIFIC PARENTING COVENANTS REQUESTED:
1. Joint Legal Custody: Equal rights on schooling, doctors, and religious development.
2. Holiday Rotation: Alternate major holidays every year.
3. Right of First Refusal: 4-hour threshold before hiring babysitters.`);
    setSpecificConcerns(`Validate statutory feasibility for ${sched.name}, formulate transportation exchange clauses, and establish conflict resolution / mediation steps.`);
    setAnalysisType('family_custody');
    setActiveTab('audit');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-950 text-slate-100 pb-16">
      {/* Left Input Sidebar */}
      <div className="w-full md:w-[450px] border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-3.5 overflow-y-auto shrink-0">
        {/* Header Branding */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 text-indigo-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-100 tracking-tight">Family Law & Legal Intelligence</h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">ED PARTNER</span>
            </div>
            <p className="text-xs text-slate-400">Child custody, divorce dissolution, asset division & contracts</p>
          </div>
        </div>

        {/* Top Module Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-1.5 px-2 text-[11px] rounded-lg font-medium transition-all flex flex-col items-center gap-0.5 ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Audit Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`py-1.5 px-2 text-[11px] rounded-lg font-medium transition-all flex flex-col items-center gap-0.5 ${
              activeTab === 'schedules'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>50/50 Schedules</span>
          </button>
          <button
            onClick={() => setActiveTab('best_interests')}
            className={`py-1.5 px-2 text-[11px] rounded-lg font-medium transition-all flex flex-col items-center gap-0.5 ${
              activeTab === 'best_interests'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Best Interests</span>
          </button>
          <button
            onClick={() => setActiveTab('evidence_logger')}
            className={`py-1.5 px-2 text-[11px] rounded-lg font-medium transition-all flex flex-col items-center gap-0.5 ${
              activeTab === 'evidence_logger'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Evidence Log</span>
          </button>
        </div>

        {activeTab === 'audit' && (
          <>
            {/* Analysis Specialties Grouped */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-indigo-300 font-mono uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Family Law & Domestic Specialties</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'family_custody', label: 'Child Custody & Parenting' },
                  { id: 'family_divorce', label: 'Divorce & Dissolution' },
                  { id: 'family_assets', label: 'Asset & Debt Division' },
                  { id: 'family_support', label: 'Child & Spousal Support' },
                  { id: 'family_evidence', label: 'Custody Evidence & Logs' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setAnalysisType(cat.id as any)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-all ${
                      analysisType === cat.id
                        ? 'bg-indigo-500/25 text-indigo-200 border-indigo-500/60 font-semibold shadow-xs'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="pt-1.5">
                <label className="text-[11px] font-semibold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  Commercial & General Legal
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'contract_review', label: 'Contract / NDA Audit' },
                    { id: 'ip_licensing', label: 'IP & Open Source' },
                    { id: 'statute_doctrine', label: 'Statute & Precedent' },
                    { id: 'compliance_risk', label: 'Compliance & Liability' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setAnalysisType(cat.id as any)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-all ${
                        analysisType === cat.id
                          ? 'bg-indigo-500/25 text-indigo-200 border-indigo-500/60 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Jurisdiction State Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Jurisdiction / State Framework</span>
                <span className="text-[10px] text-indigo-400 font-normal">Uniform Codes & State Law</span>
              </label>
              <input
                type="text"
                value={jurisdictionState}
                onChange={(e) => setJurisdictionState(e.target.value)}
                placeholder="e.g. California (Community Property / UCCJEA) or Texas Family Code"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 font-sans"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-300 font-mono uppercase tracking-wider">
                Document / Case Inquiry Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 50/50 Custody Stipulation & Parenting Plan Audit"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 font-sans"
              />
            </div>

            {/* Content / Clauses */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-300 font-mono uppercase tracking-wider">
                Case Facts / Agreement Clauses / Incident Context
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste proposed parenting schedules, divorce asset facts, support figures, dispute emails, or contract clauses..."
                rows={5}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Specific Concerns */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-300 font-mono uppercase tracking-wider">
                Targeted Outcomes & High-Stakes Red Flags
              </label>
              <input
                type="text"
                value={specificConcerns}
                onChange={(e) => setSpecificConcerns(e.target.value)}
                placeholder="e.g. Protect 50/50 overnight count, trace separate down payment, prevent parental alienation"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 font-sans"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={() => handleRunAnalysis()}
              disabled={isLoading || !content.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Statutory Factors & Legal Exposure...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Execute Legal & Family Law Audit</span>
                </>
              )}
            </button>

            {/* Preset Templates */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
                Quick-Load Family Law & Legal Blueprints
              </span>
              <div className="flex flex-col gap-2">
                {PRESET_FAMILY_TEMPLATES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTitle(item.title);
                      setContent(item.content);
                      setSpecificConcerns(item.concerns);
                      setAnalysisType(item.type as any);
                      handleRunAnalysis({
                        title: item.title,
                        content: item.content,
                        concerns: item.concerns,
                        type: item.type,
                      });
                    }}
                    className="text-left p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                        {item.title}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 shrink-0 ml-2">
                        {item.type.replace('family_', '').replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {item.concerns}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'schedules' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>50/50 & Standard Physical Custody Models</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Compare statutory parenting time models, overnight distributions, transition frequencies, and age-appropriateness.
              </p>
            </div>

            <div className="space-y-3">
              {CUSTODY_SCHEDULES.map((sched, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{sched.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold">
                      {sched.parentAPercentage}% / {sched.parentBPercentage}% Overnights
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{sched.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                      <span className="font-semibold text-emerald-400 block mb-1">Key Advantages:</span>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                        {sched.pros.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-900/40">
                      <span className="font-semibold text-amber-400 block mb-1">Considerations:</span>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                        {sched.cons.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400">Target Ages: <strong className="text-slate-200">{sched.recommendedAges}</strong></span>
                    <button
                      onClick={() => handleInsertSchedule(sched)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium flex items-center gap-1 shadow-xs"
                    >
                      <span>Draft Plan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'best_interests' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs">
              <div className="flex items-center gap-1.5 text-purple-300 font-semibold mb-1">
                <Heart className="w-4 h-4 text-purple-400" />
                <span>Statutory "Best Interests of the Child" Checklist</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Family courts evaluate custody disputes strictly through statutory factor doctrines. Use these factors to ground your evidence and arguments.
              </p>
            </div>

            <div className="space-y-2.5">
              {BEST_INTERESTS_FACTORS.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{item.factor}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                      item.courtWeight === 'Critical' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                      item.courtWeight === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {item.courtWeight} Judicial Weight
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{item.statutoryFocus}</p>
                  <p className="text-[11px] text-slate-400 italic">"{item.parentEvaluation}"</p>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {item.evidenceNeeded.map((ev, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setTitle('Best Interests of the Child Statutory Factor Audit');
                setContent(`FAMILY LAW CUSTODY FACTOR AUDIT REQUEST:
Evaluate our current custody arrangement and disputes against all 6 major Best Interests of the Child statutory factors:
1. Home Stability & Routine
2. Willingness to Facilitate Relationship (Non-Alienation)
3. Historical Caregiving Continuity
4. Mental & Physical Parental Health
5. Child Reasonable Preference
6. Domestic Safety and Protection.`);
                setSpecificConcerns('Highlight key evidentiary vulnerabilities, recommend documents to gather, and outline strategic positioning for court mediation.');
                setAnalysisType('family_custody');
                setActiveTab('audit');
              }}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Audit Case Against Best Interests Factors</span>
            </button>
          </div>
        )}

        {activeTab === 'evidence_logger' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <ClipboardList className="w-4 h-4 text-indigo-400" />
                <span>Court-Ready Custody Incident & Exchange Logger</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Log factual, non-emotional records of custody interference, late exchanges, missed visits, or unapproved medical decisions.
              </p>
            </div>

            {/* Logger Form */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Date of Incident</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Violation Category</label>
                  <select
                    value={logCategory}
                    onChange={(e: any) => setLogCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200"
                  >
                    <option value="late_exchange">Late Exchange / No-Show</option>
                    <option value="custody_denial">Custody Denial / Withholding</option>
                    <option value="communication_harassment">Disparagement / Harassment</option>
                    <option value="unilateral_decision">Unilateral Decision (Doctor/School)</option>
                    <option value="medical_school_issue">Medical or School Concealment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Objective Facts (What Happened)</label>
                <textarea
                  value={logDescription}
                  onChange={(e) => setLogDescription(e.target.value)}
                  placeholder="Describe facts objectively without editorial insults. e.g. Parent arrived 50 mins late; refused to hand over medication."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder:text-slate-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Direct Child Impact</label>
                  <input
                    type="text"
                    value={logChildImpact}
                    onChange={(e) => setLogChildImpact(e.target.value)}
                    placeholder="e.g. Missed dinner and homework schedule"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Preserved Proof</label>
                  <input
                    type="text"
                    value={logProofAvailable}
                    onChange={(e) => setLogProofAvailable(e.target.value)}
                    placeholder="e.g. SMS screenshot, school attendance log"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                onClick={handleAddEvidenceEntry}
                disabled={!logDescription.trim()}
                className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all disabled:opacity-50"
              >
                Add Incident to Log
              </button>
            </div>

            {/* List of Entries */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Logged Events ({evidenceEntries.length})</span>
                <button
                  onClick={handleExportEvidenceToAudit}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Send to Legal Auditor</span>
                </button>
              </div>

              {evidenceEntries.map((ev, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-indigo-400 font-bold">{ev.date}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {ev.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-200 text-xs">{ev.description}</p>
                  <p className="text-[11px] text-slate-400"><strong className="text-slate-300">Impact:</strong> {ev.impact}</p>
                  <p className="text-[10px] text-slate-500 font-mono"><strong className="text-slate-400">Proof:</strong> {ev.proof}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Result Stage */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-6">
        {resultText ? (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">
                  {title || 'Family Law & Legal Intelligence Assessment'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleSaveVault}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Saved to Vault</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Save to Memory Vault</span>
                    </>
                  )}
                </button>
                {onDispatchLegalAgent && (
                  <button
                    onClick={() => {
                      onDispatchLegalAgent(
                        `Family Law Task: ${title || 'Custody & Divorce Strategy'}`,
                        `Conduct rigorous line-by-line statutory audit, drafting protective parenting clauses, asset division formulas, or mediation strategy for: ${title}`
                      );
                      onNavigateModule?.('agents');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Delegate to Legal Agent</span>
                  </button>
                )}
              </div>
            </div>

            {/* Disclaimer Callout */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-300 font-semibold">Educational & Strategic Notice:</strong> ED Family Law & Legal Intelligence assists with custody schedule structuring, divorce asset deconstruction, evidence organization, and statutory literacy for informational and preparation purposes. Always consult licensed family law counsel in your specific jurisdiction for binding court representation.
              </p>
            </div>

            {/* Output Markdown Display */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl prose prose-invert max-w-none prose-headings:text-slate-100 prose-headings:font-bold prose-h3:text-indigo-400 prose-h3:border-b prose-h3:border-slate-800 prose-h3:pb-1 prose-h3:text-sm prose-p:text-slate-300 prose-p:text-xs prose-p:leading-relaxed prose-li:text-xs prose-li:text-slate-300 prose-strong:text-slate-100">
              <div className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed space-y-4">
                {resultText}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200 mb-1.5">Family Law & Legal Intelligence Suite</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                Comprehensive legal strategy for child custody battles, parenting plans, divorce dissolution, marital property division, support calculations, and admissible court evidence formatting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>50/50 Custody & Schedules</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  2-2-5-5, 2-2-3, and alternating week rotations with holiday allocations and right of first refusal.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Divorce & Asset Division</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Community property vs equitable distribution, separate property down payments, and 401(k) QDRO formulas.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Heart className="w-3.5 h-3.5" />
                  <span>"Best Interests" Standards</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Evaluate case strengths against home stability, caregiving history, and non-alienation factors.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Evidence & Incident Logs</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Convert communication disputes and late exchanges into objective, court-ready exhibit logs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
