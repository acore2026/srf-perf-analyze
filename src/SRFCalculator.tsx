import { useState } from 'react';

type Language = 'en' | 'zh';
type ActiveTab = 'micro' | 'macro';

type Translation = {
  language: string;
  title: string;
  subtitle: string;
  microTab: string;
  macroTab: string;
  topologyTitle: string;
  ranNodes: string;
  amfInstances: string;
  srfInstances: string;
  totalLinkReduction: string;
  fromTo: (from: string, to: string) => string;
  microTitle: string;
  microDescription: string;
  ramPerLink: string;
  cpuPerLink: string;
  ramSaved: string;
  cpuSaved: string;
  pbuSaved: string;
  pbuSpec: string;
  macroTitle: string;
  macroDescription: string;
  currentFootprint: string;
  currentFootprintHint: string;
  pbuPerAmf: string;
  footprintFormula: (amfs: number, pbus: number) => string;
  coresPerVm: string;
  ramPerVm: string;
  storagePerVm: string;
  linkReductionRatio: string;
  totalVmsSaved: string;
  targetFootprint: string;
  coresFreed: string;
  ramFreed: string;
  storageFreed: string;
  overallGain: string;
  totalVms: string;
  totalCpu: string;
  totalRam: string;
  totalStorage: string;
  cores: string;
  vms: string;
  gb: string;
  kb: string;
};

const copy: Record<Language, Translation> = {
  en: {
    language: '中文',
    title: '6G SRF Architecture ROI Dashboard',
    subtitle: 'Evaluate Core Network hardware savings using Micro and Macro methodologies.',
    microTab: 'Method 2: Micro (Link Resource)',
    macroTab: 'Method 1: Macro (PBU_C-A1 Proportional)',
    topologyTitle: 'Shared Topology Settings',
    ranNodes: 'RAN Nodes (M)',
    amfInstances: 'AMF Instances (N)',
    srfInstances: 'SRF Instances (K)',
    totalLinkReduction: 'Total Link Reduction',
    fromTo: (from, to) => `From ${from} to ${to}`,
    microTitle: 'Method 2: Micro (Link Resource Overhead)',
    microDescription: 'Calculates absolute hardware savings by isolating the CPU/RAM cost of maintaining individual SCTP/NGAP socket states.',
    ramPerLink: 'RAM per Link',
    cpuPerLink: 'CPU per Link',
    ramSaved: 'RAM Saved',
    cpuSaved: 'CPU Cores Saved',
    pbuSaved: 'PBU_C-A1 VM Eliminated',
    pbuSpec: '12 cores / 32 GB per VM',
    macroTitle: 'Method 1: Macro (PBU_C-A1 Proportional Reduction)',
    macroDescription: 'Calculates server hardware reduction by assuming PBU_C-A1 requirements scale linearly with connection fan-out reduction.',
    currentFootprint: 'Current PBU_C-A1 Server Footprint',
    currentFootprintHint: 'Calculated as AMF instances × PBU_C-A1 VMs per AMF.',
    pbuPerAmf: 'PBU_C-A1 VMs per AMF',
    footprintFormula: (amfs, pbus) => `${amfs} AMFs × ${pbus} PBU_C-A1 VMs / AMF`,
    coresPerVm: 'Cores / VM',
    ramPerVm: 'RAM (GB) / VM',
    storagePerVm: 'Storage (GB) / VM',
    linkReductionRatio: 'Link Reduction Ratio',
    totalVmsSaved: 'PBU_C-A1 VMs Saved',
    targetFootprint: 'New PBU_C-A1 Footprint',
    coresFreed: 'Cores Freed',
    ramFreed: 'RAM Freed',
    storageFreed: 'Storage Freed',
    overallGain: 'Overall AMF Pool Performance Gain',
    totalVms: 'Total VMs',
    totalCpu: 'Total CPU',
    totalRam: 'Total RAM',
    totalStorage: 'Total Storage',
    cores: 'Cores',
    vms: 'VMs',
    gb: 'GB',
    kb: 'KB'
  },
  zh: {
    language: 'English',
    title: '6G SRF 架构 ROI 仪表盘',
    subtitle: '基于微观链路资源和宏观 PBU_C-A1 比例两种方法评估核心网硬件节省。',
    microTab: '方法二：微观链路资源',
    macroTab: '方法一：宏观 PBU_C-A1 比例',
    topologyTitle: '共享拓扑设置',
    ranNodes: 'RAN 节点数 (M)',
    amfInstances: 'AMF 实例数 (N)',
    srfInstances: 'SRF 实例数 (K)',
    totalLinkReduction: '总链路减少量',
    fromTo: (from, to) => `从 ${from} 降至 ${to}`,
    microTitle: '方法二：微观链路资源开销',
    microDescription: '通过单独计算维持每条 SCTP/NGAP socket 状态所需的 CPU/RAM 成本，得出绝对硬件节省。',
    ramPerLink: '每条链路 RAM',
    cpuPerLink: '每条链路 CPU',
    ramSaved: '节省 RAM',
    cpuSaved: '节省 CPU 核数',
    pbuSaved: '减少 PBU_C-A1 VM',
    pbuSpec: '每个 VM 为 12 核 / 32 GB',
    macroTitle: '方法一：宏观 PBU_C-A1 比例缩减',
    macroDescription: '假设 PBU_C-A1 需求随连接扇出减少比例线性缩减，从而计算服务器硬件减少量。',
    currentFootprint: '当前 PBU_C-A1 服务器规模',
    currentFootprintHint: '按 AMF 实例数 × 每 AMF 的 PBU_C-A1 VM 数量计算。',
    pbuPerAmf: '每 AMF 的 PBU_C-A1 VM 数',
    footprintFormula: (amfs, pbus) => `${amfs} 个 AMF × 每 AMF ${pbus} 个 PBU_C-A1 VM`,
    coresPerVm: '每 VM 核数',
    ramPerVm: '每 VM RAM (GB)',
    storagePerVm: '每 VM 存储 (GB)',
    linkReductionRatio: '链路减少比例',
    totalVmsSaved: '节省 PBU_C-A1 VM 数',
    targetFootprint: '目标 PBU_C-A1 规模',
    coresFreed: '释放 CPU 核',
    ramFreed: '释放 RAM',
    storageFreed: '释放存储',
    overallGain: 'AMF 池整体性能收益',
    totalVms: '总 VM',
    totalCpu: '总 CPU',
    totalRam: '总 RAM',
    totalStorage: '总存储',
    cores: '核',
    vms: 'VM',
    gb: 'GB',
    kb: 'KB'
  }
};

export default function SRFCalculator() {
  const [language, setLanguage] = useState<Language>('en');
  const t = copy[language];
  const locale = language === 'zh' ? 'zh-CN' : 'en-US';

  // Shared Topology State
  const [ranNodes, setRanNodes] = useState(150000);
  const [amfInstances, setAmfInstances] = useState(6);
  const [srfInstances, setSrfInstances] = useState(2);

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('macro');

  // Micro-Level State
  const [ramCostKb, setRamCostKb] = useState(156);
  const [cpuCostCores, setCpuCostCores] = useState(0.0001);

  // Macro-Level State
  const [pbuCA1VmsPerAmf, setPbuCA1VmsPerAmf] = useState(12);
  const [vmCores, setVmCores] = useState(12);
  const [vmRam, setVmRam] = useState(32);
  const [vmStorage, setVmStorage] = useState(38);

  // AMF instance footprint for the overall gain comparison.
  const [amfTotalVms] = useState(53);
  const [amfTotalCores] = useState(484);
  const [amfTotalRam] = useState(1736);
  const [amfTotalStorage] = useState(2448);

  const links5G = ranNodes * amfInstances;
  const links6G = (ranNodes * srfInstances) + (srfInstances * amfInstances);
  const linksEliminated = links5G - links6G;
  const isPositiveGain = linksEliminated > 0;
  const reductionRatio = isPositiveGain ? linksEliminated / links5G : 0;

  const ramSavedGB = (linksEliminated * ramCostKb) / (1024 * 1024);
  const cpuSavedCores = linksEliminated * cpuCostCores;
  const pbuCA1VmsEliminated = Math.floor(Math.min(Math.abs(ramSavedGB) / 32, Math.abs(cpuSavedCores) / 12));

  const currentVms = amfInstances * pbuCA1VmsPerAmf;
  const vmsSaved = Math.floor(currentVms * reductionRatio);
  const newVmFootprint = currentVms - vmsSaved;
  const macroCoresSaved = vmsSaved * vmCores;
  const macroRamSaved = vmsSaved * vmRam;
  const macroStorageSaved = vmsSaved * vmStorage;

  const poolTotalVms = amfInstances * amfTotalVms;
  const poolTotalCores = amfInstances * amfTotalCores;
  const poolTotalRam = amfInstances * amfTotalRam;
  const poolTotalStorage = amfInstances * amfTotalStorage;

  const pctVmsSaved = poolTotalVms > 0 && isPositiveGain ? vmsSaved / poolTotalVms : 0;
  const pctCoresSaved = poolTotalCores > 0 && isPositiveGain ? macroCoresSaved / poolTotalCores : 0;
  const pctRamSaved = poolTotalRam > 0 && isPositiveGain ? macroRamSaved / poolTotalRam : 0;
  const pctStorageSaved = poolTotalStorage > 0 && isPositiveGain ? macroStorageSaved / poolTotalStorage : 0;

  const formatNumber = (num: number) => new Intl.NumberFormat(locale).format(Math.round(num));
  const formatDecimal = (num: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  const formatPercent = (num: number) => new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 1 }).format(num);

  const toggleLanguage = () => setLanguage((current) => (current === 'en' ? 'zh' : 'en'));
  const overallGainMetrics: Array<[string, number]> = [
    [t.totalVms, pctVmsSaved],
    [t.totalCpu, pctCoresSaved],
    [t.totalRam, pctRamSaved],
    [t.totalStorage, pctStorageSaved]
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-4 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-3">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-slate-500 text-xs mt-0.5">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex space-x-2 bg-slate-200/60 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('macro')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'macro' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t.macroTab}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('micro')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'micro' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t.microTab}
              </button>
            </div>
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              {t.language}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 h-full">
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center border-b pb-1.5">
                <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                {t.topologyTitle}
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-600">{t.ranNodes}</label>
                    <span className="text-xs font-bold bg-slate-100 px-1.5 rounded text-slate-700">{formatNumber(ranNodes)}</span>
                  </div>
                  <input type="range" min="10000" max="500000" step="5000" value={ranNodes} onChange={(e) => setRanNodes(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-600">{t.amfInstances}</label>
                    <span className="text-xs font-bold bg-slate-100 px-1.5 rounded text-slate-700">{amfInstances}</span>
                  </div>
                  <input type="range" min="2" max="32" step="1" value={amfInstances} onChange={(e) => setAmfInstances(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-indigo-600">{t.srfInstances}</label>
                    <span className="text-xs font-bold bg-indigo-50 px-1.5 rounded text-indigo-700">{srfInstances}</span>
                  </div>
                  <input type="range" min="1" max="16" step="1" value={srfInstances} onChange={(e) => setSrfInstances(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
              </div>

              <div className="mt-4 p-2 bg-slate-50 border border-slate-100 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{t.totalLinkReduction}</p>
                <p className={`text-lg font-bold ${isPositiveGain ? 'text-green-600' : 'text-red-500'}`}>
                  {isPositiveGain ? '-' : '+'}{formatNumber(Math.abs(linksEliminated))}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.fromTo(formatNumber(links5G), formatNumber(links6G))}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {activeTab === 'micro' && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 h-full flex flex-col animate-in fade-in duration-300">
                <div className="mb-3 border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-indigo-800 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                    {t.microTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.microDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold text-indigo-900">{t.ramPerLink} (C<sub>link</sub>)</label>
                      <span className="text-xs font-bold text-indigo-700">{formatNumber(ramCostKb)} {t.kb}</span>
                    </div>
                    <input type="range" min="1" max="2048" step="1" value={ramCostKb} onChange={(e) => setRamCostKb(Number(e.target.value))} className="w-full h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold text-indigo-900">{t.cpuPerLink} (C<sub>link</sub>)</label>
                      <span className="text-xs font-bold text-indigo-700">{cpuCostCores.toFixed(4)} {t.cores}</span>
                    </div>
                    <input type="range" min="0.0001" max="0.0200" step="0.0001" value={cpuCostCores} onChange={(e) => setCpuCostCores(Number(e.target.value))} className="w-full h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-auto">
                  <div className="bg-white p-4 rounded-xl border-2 border-indigo-50 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.ramSaved}</p>
                    <h3 className={`text-3xl font-extrabold tracking-tight ${isPositiveGain ? 'text-indigo-600' : 'text-red-500'}`}>
                      {isPositiveGain ? '' : '-'}{formatDecimal(Math.abs(ramSavedGB))} <span className="text-sm text-slate-400 font-semibold tracking-normal">{t.gb}</span>
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-xl border-2 border-indigo-50 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.cpuSaved}</p>
                    <h3 className={`text-3xl font-extrabold tracking-tight ${isPositiveGain ? 'text-indigo-600' : 'text-red-500'}`}>
                      {isPositiveGain ? '' : '-'}{formatDecimal(Math.abs(cpuSavedCores))} <span className="text-sm text-slate-400 font-semibold tracking-normal">{t.cores}</span>
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-xl border-2 border-indigo-50 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.pbuSaved}</p>
                    <h3 className={`text-3xl font-extrabold tracking-tight ${isPositiveGain ? 'text-indigo-600' : 'text-red-500'}`}>
                      {isPositiveGain ? '' : '-'}{formatNumber(pbuCA1VmsEliminated)} <span className="text-sm text-slate-400 font-semibold tracking-normal">{t.vms}</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">{t.pbuSpec}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'macro' && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 h-full flex flex-col animate-in fade-in duration-300">
                <div className="mb-3 border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-emerald-800 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                    {t.macroTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.macroDescription}</p>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100/50 mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <label className="text-xs font-bold text-emerald-900 block mb-0.5">{t.currentFootprint} (V<sub>5G</sub>)</label>
                      <p className="text-[10px] text-emerald-600">{t.currentFootprintHint}</p>
                    </div>
                    <span className="text-lg font-black text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm border border-emerald-100">{currentVms}</span>
                  </div>
                  <div className="rounded-md bg-white/70 border border-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                    {t.footprintFormula(amfInstances, pbuCA1VmsPerAmf)}
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold text-emerald-900">{t.pbuPerAmf}</label>
                      <span className="text-xs font-bold text-emerald-700">{pbuCA1VmsPerAmf}</span>
                    </div>
                    <input type="range" min="1" max="64" step="1" value={pbuCA1VmsPerAmf} onChange={(e) => setPbuCA1VmsPerAmf(Number(e.target.value))} className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-100/70">
                    <div>
                      <label className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide">{t.coresPerVm}</label>
                      <input type="number" value={vmCores} onChange={(e) => setVmCores(Number(e.target.value))} className="w-full text-xs font-bold text-emerald-900 bg-white border border-emerald-200 rounded px-2 py-1 mt-0.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide">{t.ramPerVm}</label>
                      <input type="number" value={vmRam} onChange={(e) => setVmRam(Number(e.target.value))} className="w-full text-xs font-bold text-emerald-900 bg-white border border-emerald-200 rounded px-2 py-1 mt-0.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide">{t.storagePerVm}</label>
                      <input type="number" value={vmStorage} onChange={(e) => setVmStorage(Number(e.target.value))} className="w-full text-xs font-bold text-emerald-900 bg-white border border-emerald-200 rounded px-2 py-1 mt-0.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t.linkReductionRatio} (ρ)</p>
                    <h3 className="text-xl font-bold text-slate-800">{formatPercent(reductionRatio)}</h3>
                  </div>

                  <div className="bg-emerald-600 p-3 rounded-lg shadow-sm border border-emerald-700 text-center flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20"><svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>
                    <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wide mb-1 relative z-10">{t.totalVmsSaved}</p>
                    <h3 className="text-3xl font-black text-white relative z-10">{isPositiveGain ? vmsSaved : 0}</h3>
                  </div>

                  <div className="bg-white p-3 rounded-lg border-2 border-emerald-100 text-center flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t.targetFootprint}</p>
                    <h3 className="text-xl font-bold text-emerald-600">{isPositiveGain ? newVmFootprint : currentVms} <span className="text-xs text-slate-400 font-semibold tracking-normal">{t.vms}</span></h3>
                  </div>
                </div>

                <div className="mt-3 bg-emerald-50/40 border border-emerald-100 rounded-lg p-2.5 flex justify-around text-center items-center">
                  <div>
                    <p className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">{t.coresFreed}</p>
                    <p className="text-sm font-black text-emerald-700">-{formatNumber(isPositiveGain ? macroCoresSaved : 0)}</p>
                  </div>
                  <div className="w-px h-6 bg-emerald-200"></div>
                  <div>
                    <p className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">{t.ramFreed}</p>
                    <p className="text-sm font-black text-emerald-700">-{formatNumber(isPositiveGain ? macroRamSaved : 0)} <span className="text-[10px] font-semibold text-emerald-600/60">{t.gb}</span></p>
                  </div>
                  <div className="w-px h-6 bg-emerald-200"></div>
                  <div>
                    <p className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">{t.storageFreed}</p>
                    <p className="text-sm font-black text-emerald-700">-{formatNumber(isPositiveGain ? macroStorageSaved : 0)} <span className="text-[10px] font-semibold text-emerald-600/60">{t.gb}</span></p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-100">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-3">{t.overallGain}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {overallGainMetrics.map(([label, value]) => (
                      <div key={label} className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-full border-[3px] border-emerald-500 flex items-center justify-center bg-emerald-50 mb-1">
                          <span className="text-xs font-bold text-emerald-700">{formatPercent(value)}</span>
                        </div>
                        <span className="text-[9px] font-semibold text-slate-600 text-center">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
