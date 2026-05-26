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
    <div className="min-h-screen bg-zinc-100 px-3 py-4 font-sans text-zinc-900 md:px-5">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <div className="flex flex-col gap-3 border-b border-zinc-300 pb-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-950">{t.title}</h1>
            <p className="mt-1 text-sm text-zinc-600">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex border border-zinc-300 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab('macro')}
                className={`border-r border-zinc-300 px-3 py-2 text-xs font-semibold ${activeTab === 'macro' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
              >
                {t.macroTab}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('micro')}
                className={`px-3 py-2 text-xs font-semibold ${activeTab === 'micro' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
              >
                {t.microTab}
              </button>
            </div>
            <button
              type="button"
              onClick={toggleLanguage}
              className="border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              {t.language}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <section className="h-full border border-zinc-300 bg-white p-4">
              <h2 className="mb-4 border-b border-zinc-200 pb-2 text-sm font-semibold text-zinc-900">{t.topologyTitle}</h2>

              <div className="space-y-5">
                <div>
                  <div className="mb-1 flex justify-between">
                    <label className="text-xs font-medium text-zinc-600">{t.ranNodes}</label>
                    <span className="text-xs font-semibold text-zinc-900">{formatNumber(ranNodes)}</span>
                  </div>
                  <input type="range" min="10000" max="500000" step="5000" value={ranNodes} onChange={(e) => setRanNodes(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-zinc-800" />
                </div>

                <div>
                  <div className="mb-1 flex justify-between">
                    <label className="text-xs font-medium text-zinc-600">{t.amfInstances}</label>
                    <span className="text-xs font-semibold text-zinc-900">{amfInstances}</span>
                  </div>
                  <input type="range" min="2" max="32" step="1" value={amfInstances} onChange={(e) => setAmfInstances(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-zinc-800" />
                </div>

                <div>
                  <div className="mb-1 flex justify-between">
                    <label className="text-xs font-medium text-zinc-600">{t.srfInstances}</label>
                    <span className="text-xs font-semibold text-zinc-900">{srfInstances}</span>
                  </div>
                  <input type="range" min="1" max="16" step="1" value={srfInstances} onChange={(e) => setSrfInstances(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-zinc-800" />
                </div>
              </div>

              <div className="mt-5 border border-zinc-300 bg-zinc-50 p-3">
                <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.totalLinkReduction}</p>
                <p className={`text-2xl font-semibold ${isPositiveGain ? 'text-zinc-950' : 'text-red-700'}`}>
                  {isPositiveGain ? '-' : '+'}{formatNumber(Math.abs(linksEliminated))}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{t.fromTo(formatNumber(links5G), formatNumber(links6G))}</p>
              </div>
            </section>
          </aside>

          <main className="lg:col-span-8">
            {activeTab === 'micro' && (
              <section className="flex h-full flex-col border border-zinc-300 bg-white p-4">
                <div className="mb-4 border-b border-zinc-200 pb-3">
                  <h2 className="text-sm font-semibold text-zinc-950">{t.microTitle}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">{t.microDescription}</p>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="border border-zinc-300 bg-zinc-50 p-3">
                    <div className="mb-1.5 flex justify-between gap-3">
                      <label className="text-xs font-medium text-zinc-700">{t.ramPerLink} (C<sub>link</sub>)</label>
                      <span className="text-xs font-semibold text-zinc-900">{formatNumber(ramCostKb)} {t.kb}</span>
                    </div>
                    <input type="range" min="1" max="2048" step="1" value={ramCostKb} onChange={(e) => setRamCostKb(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-zinc-800" />
                  </div>

                  <div className="border border-zinc-300 bg-zinc-50 p-3">
                    <div className="mb-1.5 flex justify-between gap-3">
                      <label className="text-xs font-medium text-zinc-700">{t.cpuPerLink} (C<sub>link</sub>)</label>
                      <span className="text-xs font-semibold text-zinc-900">{cpuCostCores.toFixed(4)} {t.cores}</span>
                    </div>
                    <input type="range" min="0.0001" max="0.0200" step="0.0001" value={cpuCostCores} onChange={(e) => setCpuCostCores(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-zinc-800" />
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="border border-zinc-300 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.ramSaved}</p>
                    <h3 className={`text-2xl font-semibold ${isPositiveGain ? 'text-zinc-950' : 'text-red-700'}`}>
                      {isPositiveGain ? '' : '-'}{formatDecimal(Math.abs(ramSavedGB))} <span className="text-sm font-medium text-zinc-500">{t.gb}</span>
                    </h3>
                  </div>

                  <div className="border border-zinc-300 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.cpuSaved}</p>
                    <h3 className={`text-2xl font-semibold ${isPositiveGain ? 'text-zinc-950' : 'text-red-700'}`}>
                      {isPositiveGain ? '' : '-'}{formatDecimal(Math.abs(cpuSavedCores))} <span className="text-sm font-medium text-zinc-500">{t.cores}</span>
                    </h3>
                  </div>

                  <div className="border border-zinc-300 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.pbuSaved}</p>
                    <h3 className={`text-2xl font-semibold ${isPositiveGain ? 'text-zinc-950' : 'text-red-700'}`}>
                      {isPositiveGain ? '' : '-'}{formatNumber(pbuCA1VmsEliminated)} <span className="text-sm font-medium text-zinc-500">{t.vms}</span>
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">{t.pbuSpec}</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'macro' && (
              <section className="flex h-full flex-col border border-zinc-300 bg-white p-4">
                <div className="mb-4 border-b border-zinc-200 pb-3">
                  <h2 className="text-sm font-semibold text-zinc-950">{t.macroTitle}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">{t.macroDescription}</p>
                </div>

                <div className="mb-4 border border-zinc-300 bg-zinc-50 p-4">
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <div>
                      <label className="mb-0.5 block text-xs font-semibold text-zinc-800">{t.currentFootprint} (V<sub>5G</sub>)</label>
                      <p className="text-xs text-zinc-600">{t.currentFootprintHint}</p>
                    </div>
                    <span className="border border-zinc-300 bg-white px-2 py-1 text-lg font-semibold text-zinc-950">{currentVms}</span>
                  </div>
                  <div className="border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700">
                    {t.footprintFormula(amfInstances, pbuCA1VmsPerAmf)}
                  </div>

                  <div className="mt-3">
                    <div className="mb-1.5 flex justify-between">
                      <label className="text-xs font-medium text-zinc-700">{t.pbuPerAmf}</label>
                      <span className="text-xs font-semibold text-zinc-900">{pbuCA1VmsPerAmf}</span>
                    </div>
                    <input type="range" min="1" max="64" step="1" value={pbuCA1VmsPerAmf} onChange={(e) => setPbuCA1VmsPerAmf(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-zinc-800" />
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 border-t border-zinc-300 pt-3 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-medium text-zinc-600">{t.coresPerVm}</label>
                      <input type="number" value={vmCores} onChange={(e) => setVmCores(Number(e.target.value))} className="mt-1 w-full border border-zinc-300 bg-white px-2 py-1 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-600">{t.ramPerVm}</label>
                      <input type="number" value={vmRam} onChange={(e) => setVmRam(Number(e.target.value))} className="mt-1 w-full border border-zinc-300 bg-white px-2 py-1 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-600">{t.storagePerVm}</label>
                      <input type="number" value={vmStorage} onChange={(e) => setVmStorage(Number(e.target.value))} className="mt-1 w-full border border-zinc-300 bg-white px-2 py-1 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700" />
                    </div>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="border border-zinc-300 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.linkReductionRatio} (ρ)</p>
                    <h3 className="text-2xl font-semibold text-zinc-950">{formatPercent(reductionRatio)}</h3>
                  </div>

                  <div className="border border-zinc-900 bg-zinc-900 p-4 text-white">
                    <p className="mb-1 text-xs font-semibold uppercase text-zinc-300">{t.totalVmsSaved}</p>
                    <h3 className="text-2xl font-semibold">{isPositiveGain ? vmsSaved : 0}</h3>
                  </div>

                  <div className="border border-zinc-300 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.targetFootprint}</p>
                    <h3 className="text-2xl font-semibold text-zinc-950">{isPositiveGain ? newVmFootprint : currentVms} <span className="text-sm font-medium text-zinc-500">{t.vms}</span></h3>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 border border-zinc-300 bg-zinc-50 sm:grid-cols-3">
                  <div>
                    <div className="border-b border-zinc-300 p-3 sm:border-b-0 sm:border-r">
                      <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.coresFreed}</p>
                      <p className="text-sm font-semibold text-zinc-900">-{formatNumber(isPositiveGain ? macroCoresSaved : 0)}</p>
                    </div>
                  </div>
                  <div>
                    <div className="border-b border-zinc-300 p-3 sm:border-b-0 sm:border-r">
                      <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.ramFreed}</p>
                      <p className="text-sm font-semibold text-zinc-900">-{formatNumber(isPositiveGain ? macroRamSaved : 0)} <span className="text-xs font-medium text-zinc-500">{t.gb}</span></p>
                    </div>
                  </div>
                  <div>
                    <div className="p-3">
                      <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">{t.storageFreed}</p>
                      <p className="text-sm font-semibold text-zinc-900">-{formatNumber(isPositiveGain ? macroStorageSaved : 0)} <span className="text-xs font-medium text-zinc-500">{t.gb}</span></p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-zinc-200 pt-3">
                  <h3 className="mb-3 text-xs font-semibold uppercase text-zinc-500">{t.overallGain}</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {overallGainMetrics.map(([label, value]) => (
                      <div key={label} className="border border-zinc-300 p-3">
                        <p className="text-lg font-semibold text-zinc-950">{formatPercent(value)}</p>
                        <p className="mt-1 text-xs font-medium text-zinc-600">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
