import React, { useState } from 'react';

export default function SRFCalculator() {
  // Shared Topology State
  const [ranNodes, setRanNodes] = useState(150000); // M: Default 150k
  const [amfInstances, setAmfInstances] = useState(6); // N: Default 6
  const [srfInstances, setSrfInstances] = useState(2); // K: Default 2 (1+1 Redundancy)

  // Tab State
  const [activeTab, setActiveTab] = useState('micro'); // 'micro' | 'macro'

  // Micro-Level State (Tab 1)
  const [ramCostKb, setRamCostKb] = useState(512); // KB per link
  const [cpuCostCores, setCpuCostCores] = useState(0.005); // Cores per link

  // Macro-Level State (Tab 2)
  const [currentVms, setCurrentVms] = useState(72); // V_5G: Default 72
  const [vmCores, setVmCores] = useState(12);
  const [vmRam, setVmRam] = useState(32);
  const [vmStorage, setVmStorage] = useState(38);

  // Total AMF Instance Footprint
  const [amfTotalVms, setAmfTotalVms] = useState(53);
  const [amfTotalCores, setAmfTotalCores] = useState(484);
  const [amfTotalRam, setAmfTotalRam] = useState(1736);
  const [amfTotalStorage, setAmfTotalStorage] = useState(2448);

  // Shared Math
  const links5G = ranNodes * amfInstances;
  const links6G = (ranNodes * srfInstances) + (srfInstances * amfInstances);
  const linksEliminated = links5G - links6G;
  const isPositiveGain = linksEliminated > 0;
  const reductionRatio = isPositiveGain ? linksEliminated / links5G : 0;

  // Micro Math (Tab 1)
  const ramSavedGB = (linksEliminated * ramCostKb) / (1024 * 1024);
  const cpuSavedCores = linksEliminated * cpuCostCores;

  // Macro Math (Tab 2)
  const vmsSaved = Math.floor(currentVms * reductionRatio);
  const newVmFootprint = currentVms - vmsSaved;
  const macroCoresSaved = vmsSaved * vmCores;
  const macroRamSaved = vmsSaved * vmRam;
  const macroStorageSaved = vmsSaved * vmStorage;

  // Overall System ROI Math
  const poolTotalVms = amfInstances * amfTotalVms;
  const poolTotalCores = amfInstances * amfTotalCores;
  const poolTotalRam = amfInstances * amfTotalRam;
  const poolTotalStorage = amfInstances * amfTotalStorage;

  const pctVmsSaved = poolTotalVms > 0 && isPositiveGain ? vmsSaved / poolTotalVms : 0;
  const pctCoresSaved = poolTotalCores > 0 && isPositiveGain ? macroCoresSaved / poolTotalCores : 0;
  const pctRamSaved = poolTotalRam > 0 && isPositiveGain ? macroRamSaved / poolTotalRam : 0;
  const pctStorageSaved = poolTotalStorage > 0 && isPositiveGain ? macroStorageSaved / poolTotalStorage : 0;

  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(Math.round(num));
  const formatDecimal = (num) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  const formatPercent = (num) => new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(num);

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-4 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-3">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-200 pb-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900">6G SRF Architecture ROI Dashboard</h1>
            <p className="text-slate-500 text-xs mt-0.5">Evaluate Core Network hardware savings using Micro and Macro methodologies.</p>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0 bg-slate-200/60 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('micro')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'micro' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Method 1: Micro (Link Resource)
            </button>
            <button 
              onClick={() => setActiveTab('macro')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'macro' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Method 2: Macro (VM Proportional)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          {/* Shared Topology Column */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 h-full">
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center border-b pb-1.5">
                <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Shared Topology Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-600">RAN Nodes (M)</label>
                    <span className="text-xs font-bold bg-slate-100 px-1.5 rounded text-slate-700">{formatNumber(ranNodes)}</span>
                  </div>
                  <input type="range" min="10000" max="500000" step="5000" value={ranNodes} onChange={(e) => setRanNodes(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-600">AMF Instances (N)</label>
                    <span className="text-xs font-bold bg-slate-100 px-1.5 rounded text-slate-700">{amfInstances}</span>
                  </div>
                  <input type="range" min="2" max="32" step="1" value={amfInstances} onChange={(e) => setAmfInstances(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-indigo-600">SRF Instances (K)</label>
                    <span className="text-xs font-bold bg-indigo-50 px-1.5 rounded text-indigo-700">{srfInstances}</span>
                  </div>
                  <input type="range" min="1" max="16" step="1" value={srfInstances} onChange={(e) => setSrfInstances(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
              </div>

              <div className="mt-4 p-2 bg-slate-50 border border-slate-100 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Link Reduction</p>
                <p className={`text-lg font-bold ${isPositiveGain ? 'text-green-600' : 'text-red-500'}`}>
                  {isPositiveGain ? '-' : '+'}{formatNumber(Math.abs(linksEliminated))}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">From {formatNumber(links5G)} ➔ {formatNumber(links6G)}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Content Column */}
          <div className="lg:col-span-8">
            
            {activeTab === 'micro' && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 h-full flex flex-col animate-in fade-in duration-300">
                <div className="mb-3 border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-indigo-800 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                    Method 1: Micro (Link Resource Overhead)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Calculates absolute hardware savings by isolating the CPU/RAM cost (C<sub>link</sub>) of maintaining individual SCTP/NGAP socket states.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold text-indigo-900">RAM per Link (C<sub>link</sub>)</label>
                      <span className="text-xs font-bold text-indigo-700">{formatNumber(ramCostKb)} KB</span>
                    </div>
                    <input type="range" min="1" max="2048" step="1" value={ramCostKb} onChange={(e) => setRamCostKb(Number(e.target.value))} className="w-full h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold text-indigo-900">CPU per Link (C<sub>link</sub>)</label>
                      <span className="text-xs font-bold text-indigo-700">{cpuCostCores.toFixed(4)} Cores</span>
                    </div>
                    <input type="range" min="0.0001" max="0.0200" step="0.0001" value={cpuCostCores} onChange={(e) => setCpuCostCores(Number(e.target.value))} className="w-full h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <div className="bg-white p-4 rounded-xl border-2 border-indigo-50 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">RAM Saved</p>
                    <h3 className={`text-3xl font-extrabold tracking-tight ${isPositiveGain ? 'text-indigo-600' : 'text-red-500'}`}>
                      {isPositiveGain ? '' : '-'}{formatDecimal(Math.abs(ramSavedGB))} <span className="text-sm text-slate-400 font-semibold tracking-normal">GB</span>
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-xl border-2 border-indigo-50 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">CPU Cores Saved</p>
                    <h3 className={`text-3xl font-extrabold tracking-tight ${isPositiveGain ? 'text-indigo-600' : 'text-red-500'}`}>
                      {isPositiveGain ? '' : '-'}{formatDecimal(Math.abs(cpuSavedCores))} <span className="text-sm text-slate-400 font-semibold tracking-normal">Cores</span>
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'macro' && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 h-full flex flex-col animate-in fade-in duration-300">
                <div className="mb-3 border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-emerald-800 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                    Method 2: Macro (VM Proportional Reduction)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Calculates abstract server hardware reduction by assuming VM requirements scale linearly with connection fan-out reduction (ρ).</p>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100/50 mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <label className="text-xs font-bold text-emerald-900 block mb-0.5">Current VM<sub>A1</sub> Server Footprint (V<sub>5G</sub>)</label>
                      <p className="text-[10px] text-emerald-600">Total VMs currently deployed in the AMF pool.</p>
                    </div>
                    <span className="text-lg font-black text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm border border-emerald-100">{currentVms}</span>
                  </div>
                  <input type="range" min="4" max="128" step="2" value={currentVms} onChange={(e) => setCurrentVms(Number(e.target.value))} className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2" />
                  
                  {/* VM Hardware Specification Inputs */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-100/70">
                    <div>
                      <label className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide">Cores / VM</label>
                      <input type="number" value={vmCores} onChange={(e) => setVmCores(Number(e.target.value))} className="w-full text-xs font-bold text-emerald-900 bg-white border border-emerald-200 rounded px-2 py-1 mt-0.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide">RAM (GB) / VM</label>
                      <input type="number" value={vmRam} onChange={(e) => setVmRam(Number(e.target.value))} className="w-full text-xs font-bold text-emerald-900 bg-white border border-emerald-200 rounded px-2 py-1 mt-0.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide">Storage (GB) / VM</label>
                      <input type="number" value={vmStorage} onChange={(e) => setVmStorage(Number(e.target.value))} className="w-full text-xs font-bold text-emerald-900 bg-white border border-emerald-200 rounded px-2 py-1 mt-0.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Link Reduction Ratio (ρ)</p>
                    <h3 className="text-xl font-bold text-slate-800">{formatPercent(reductionRatio)}</h3>
                  </div>

                  <div className="bg-emerald-600 p-3 rounded-lg shadow-sm border border-emerald-700 text-center flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20"><svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>
                    <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wide mb-1 relative z-10">Total VMs Saved</p>
                    <h3 className="text-3xl font-black text-white relative z-10">{isPositiveGain ? vmsSaved : 0}</h3>
                  </div>

                  <div className="bg-white p-3 rounded-lg border-2 border-emerald-100 text-center flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">New Target Footprint</p>
                    <h3 className="text-xl font-bold text-emerald-600">{isPositiveGain ? newVmFootprint : currentVms} <span className="text-xs text-slate-400 font-semibold tracking-normal">VMs</span></h3>
                  </div>
                </div>

                {/* Absolute Hardware Savings Row */}
                <div className="mt-3 bg-emerald-50/40 border border-emerald-100 rounded-lg p-2.5 flex justify-around text-center items-center">
                   <div>
                     <p className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">Cores Freed</p>
                     <p className="text-sm font-black text-emerald-700">-{formatNumber(isPositiveGain ? macroCoresSaved : 0)}</p>
                   </div>
                   <div className="w-px h-6 bg-emerald-200"></div>
                   <div>
                     <p className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">RAM Freed</p>
                     <p className="text-sm font-black text-emerald-700">-{formatNumber(isPositiveGain ? macroRamSaved : 0)} <span className="text-[10px] font-semibold text-emerald-600/60">GB</span></p>
                   </div>
                   <div className="w-px h-6 bg-emerald-200"></div>
                   <div>
                     <p className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">Storage Freed</p>
                     <p className="text-sm font-black text-emerald-700">-{formatNumber(isPositiveGain ? macroStorageSaved : 0)} <span className="text-[10px] font-semibold text-emerald-600/60">GB</span></p>
                   </div>
                </div>

                {/* Overall System ROI Block */}
                <div className="mt-4 pt-3 border-t border-emerald-100">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-3">Overall AMF Pool Performance Gain</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-[3px] border-emerald-500 flex items-center justify-center bg-emerald-50 mb-1">
                        <span className="text-xs font-bold text-emerald-700">{formatPercent(pctVmsSaved)}</span>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-600">Total VMs</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-[3px] border-emerald-500 flex items-center justify-center bg-emerald-50 mb-1">
                        <span className="text-xs font-bold text-emerald-700">{formatPercent(pctCoresSaved)}</span>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-600">Total CPU</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-[3px] border-emerald-500 flex items-center justify-center bg-emerald-50 mb-1">
                        <span className="text-xs font-bold text-emerald-700">{formatPercent(pctRamSaved)}</span>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-600">Total RAM</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-[3px] border-emerald-500 flex items-center justify-center bg-emerald-50 mb-1">
                        <span className="text-xs font-bold text-emerald-700">{formatPercent(pctStorageSaved)}</span>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-600">Total Storage</span>
                    </div>
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
