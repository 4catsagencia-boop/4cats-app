"use client";

import React, { useState, useEffect } from 'react';
import { useAdminDB } from "@/app/admin/hooks/useAdminDB";
import { Propuesta, AccesosPropuesta, Tables } from "@/utils/supabase";
import { 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  Truck, 
  MapPin, 
  LayoutDashboard, 
  ClipboardList,
  AlertTriangle,
  Link,
  Copy,
  CheckCircle,
  RefreshCw,
  Search
} from 'lucide-react';

const PUBLIC_BASE = "https://4cats.cl/propuesta";

const HardyView = () => {
  const adminDB = useAdminDB();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Data State
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [accessLogs, setAccessLogs] = useState<AccesosPropuesta[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const selectedPropuesta = propuestas.find(p => p.id === selectedId);
  const isLocked = selectedPropuesta?.estado === 'bloqueada';

  // Check if LIVE
  const isLive = accessLogs.length > 0 && 
    (new Date().getTime() - new Date(accessLogs[0].created_at || '').getTime()) < 5 * 60 * 1000;

  const loadData = async () => {
    // Silently refresh unless first load
    if (propuestas.length === 0) setLoading(true);
    try {
      const data = await adminDB.select(Tables.Propuestas);
      setPropuestas(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error loading propuestas:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async (propuestaId: string) => {
    try {
      const logs = await adminDB.select(Tables.AccesosPropuesta, { column: "propuesta_id", value: propuestaId });
      // Sort by created_at desc (API proxy usually does this but just in case)
      const sortedLogs = [...logs].sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
      setAccessLogs(sortedLogs);
    } catch (error) {
      console.error("Error loading logs:", error);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto refresh every 30 seconds for live monitoring
    const interval = setInterval(() => {
        if (selectedId) loadLogs(selectedId);
        loadData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedId]);

  useEffect(() => {
    if (selectedId) {
      loadLogs(selectedId);
    }
  }, [selectedId]);

  const toggleLock = async () => {
    if (!selectedPropuesta) return;
    setActionLoading(true);
    try {
      const newEstado = isLocked ? 'enviada' : 'bloqueada';
      await adminDB.update(Tables.Propuestas, selectedPropuesta.id, { estado: newEstado });
      
      // Update local state
      setPropuestas(prev => prev.map(p => 
        p.id === selectedPropuesta.id ? { ...p, estado: newEstado } : p
      ));
    } catch (error) {
      console.error("Error toggling lock:", error);
      alert("Error al cambiar el estado de la propuesta.");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!selectedPropuesta) return;
    const text = `${PUBLIC_BASE}/${selectedPropuesta.slug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredPropuestas = propuestas.filter(p => 
    p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mb-4" />
          <p className="font-medium">Sincronizando con Hardy Central...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Proposal Selector */}
            <div className="bg-white dark:bg-[#18181B] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-[#2A2A35] flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="bg-yellow-400 p-2 rounded-xl text-slate-900">
                   <ClipboardList size={20} />
                </div>
                <div className="flex-1 md:w-64">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Propuesta Activa</p>
                   <select 
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="bg-transparent border-none p-0 font-bold text-slate-800 dark:text-white focus:ring-0 w-full"
                   >
                     {propuestas.map(p => (
                       <option key={p.id} value={p.id} className="dark:bg-[#18181B]">
                         {p.titulo} {p.estado === 'bloqueada' ? '🔒' : ''}
                       </option>
                     ))}
                   </select>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#27272A] px-3 py-2 rounded-xl w-full md:w-auto">
                <Search size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar propuesta..." 
                  className="bg-transparent border-none text-sm outline-none w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#18181B] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-[#2A2A35]">
                <p className="text-sm text-slate-500 font-medium">Vistas Totales</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{selectedPropuesta?.vistas || 0}</h3>
              </div>
              <div className="bg-white dark:bg-[#18181B] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-[#2A2A35]">
                <p className="text-sm text-slate-500 font-medium">Accesos Únicos</p>
                <h3 className="text-3xl font-bold text-yellow-600">{new Set(accessLogs.map(l => l.ip)).size}</h3>
              </div>
              <div className="bg-white dark:bg-[#18181B] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-[#2A2A35]">
                <p className="text-sm text-slate-500 font-medium">Estado de Enlace</p>
                <div className="flex items-center gap-2">
                    <h3 className={`text-3xl font-bold ${isLocked ? 'text-red-500' : 'text-green-500'}`}>
                    {isLocked ? 'BLOQUEADO' : 'ACTIVO'}
                    </h3>
                    {isLive && !isLocked && (
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
                <p className="text-[10px] text-slate-400 font-medium">
                    Última sincronización: {lastRefresh.toLocaleTimeString()}
                </p>
            </div>

            {/* Link Control Card */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Control Maestro</h2>
                <p className="text-slate-400 mb-6 max-w-md">
                  Gestioná el acceso a la propuesta de <strong>{selectedPropuesta?.titulo}</strong>. Si detectás movimientos sospechosos, ¡bloqueá el acceso al instante!
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setShowLinkModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full font-bold transition-all"
                  >
                    <Link size={18} /> Ver Enlace Seguro
                  </button>
                  <button 
                    onClick={toggleLock}
                    disabled={actionLoading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border-2 ${
                      isLocked 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    {actionLoading ? <RefreshCw size={18} className="animate-spin" /> : (isLocked ? <Unlock size={18} /> : <Lock size={18} />)}
                    {isLocked ? 'Restaurar Acceso' : 'Ejecutar Kill Switch'}
                  </button>
                </div>
              </div>
              <Shield className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64 rotate-12" />
            </div>

            {/* Link Modal */}
            {showLinkModal && selectedPropuesta && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-[#18181B] rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
                  <h3 className="text-xl font-bold mb-4 dark:text-white">Enlace Estratégico</h3>
                  <p className="text-sm text-slate-500 mb-6">Este enlace permite al cliente ver la propuesta. Podés revocar el acceso en cualquier momento.</p>
                  <div className="flex gap-2 p-3 bg-slate-100 dark:bg-[#27272A] rounded-lg mb-6 border border-slate-200 dark:border-[#3F3F46]">
                    <input 
                      readOnly 
                      value={`${PUBLIC_BASE}/${selectedPropuesta.slug}`} 
                      className="bg-transparent border-none text-xs flex-1 outline-none font-mono dark:text-white"
                    />
                    <button onClick={copyToClipboard} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                      {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowLinkModal(false)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
                  >
                    Cerrar Panel
                  </button>
                </div>
              </div>
            )}

            {/* Logs */}
            <div className="bg-white dark:bg-[#18181B] rounded-xl shadow-sm border border-slate-100 dark:border-[#2A2A35] p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Eye size={18} className="text-blue-500" /> Registro de Accesos (Hardy Logs)
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                {accessLogs.length === 0 ? (
                    <p className="text-sm text-slate-400 italic py-4">No se han registrado visitas aún para esta propuesta.</p>
                ) : (
                    accessLogs.map(log => (
                    <div key={log.id} className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-[#2A2A35] last:border-0">
                        <div>
                        <p className="font-mono text-xs text-slate-700 dark:text-slate-200">
                            {log.ip} {log.ciudad && log.ciudad !== 'unknown' ? `· ${log.ciudad}, ${log.pais}` : ''}
                        </p>
                        <p className="text-[10px] text-slate-400">{new Date(log.created_at || '').toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                        <span className={`text-[10px] px-2 py-1 rounded-md font-bold bg-slate-100 dark:bg-[#27272A] text-slate-600 dark:text-slate-400 uppercase`}>
                            {log.dispositivo || 'Visualización'}
                            {log.tiempo_permanencia ? ` · ${log.tiempo_permanencia}s` : ''}
                        </span>
                        {log.cta_click && (
                            <p className="text-[10px] text-green-500 font-bold mt-1">¡CTA CLICK!</p>
                        )}
                        </div>
                    </div>
                    ))
                )}
              </div>
            </div>
          </div>
        );
      case 'viewer':
        return (
          <div className="flex flex-col h-[70vh] items-center justify-center bg-slate-100 dark:bg-[#09090B] rounded-2xl border-2 border-dashed border-slate-300 dark:border-[#2A2A35] p-12 relative overflow-hidden">
            {isLocked ? (
              <div className="text-center animate-in slide-in-from-bottom duration-500">
                <div className="bg-red-100 p-6 rounded-full inline-block mb-6">
                  <AlertTriangle size={64} className="text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter">ENLACE DESACTIVADO</h2>
                <p className="text-slate-500 max-w-xs mx-auto">Este documento ya no está disponible por decisión del propietario.</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center">
                <div className="bg-white dark:bg-[#18181B] w-full max-w-2xl h-full shadow-2xl rounded-t-lg flex items-center justify-center border-b-4 border-yellow-500 overflow-auto p-4">
                  <div className="text-center p-8 w-full">
                    <Truck size={48} className="text-slate-800 dark:text-white mx-auto mb-4" />
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter italic uppercase">Hardy</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">Sistema de Administración</p>
                    
                    <div className="text-left space-y-6 max-w-md mx-auto">
                        <div className="p-4 bg-slate-50 dark:bg-[#27272A] rounded-xl border-l-4 border-slate-900 dark:border-white">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Título de Propuesta</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">{selectedPropuesta?.titulo}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 dark:bg-[#27272A] rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tipo</p>
                                <p className="text-sm font-bold uppercase">{selectedPropuesta?.tipo}</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-[#27272A] rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estado</p>
                                <p className="text-sm font-bold uppercase text-blue-500">{selectedPropuesta?.estado}</p>
                            </div>
                        </div>

                        <div className="p-4 border-2 border-slate-100 dark:border-[#2A2A35] rounded-xl italic text-sm text-slate-500">
                           "Esta es una vista previa simplificada del sistema Hardy. La propuesta completa se renderiza en el enlace público."
                        </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 text-white w-full max-w-2xl p-4 rounded-b-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Modo Solo Lectura Activo</span>
                  </div>
                  <div className="flex gap-4">
                    <button className="opacity-30 cursor-not-allowed flex items-center gap-1 text-[10px] font-bold">DESCARGA <Lock size={10}/></button>
                    <button className="opacity-30 cursor-not-allowed flex items-center gap-1 text-[10px] font-bold">IMPRESIÓN <Lock size={10}/></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-white font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white dark:bg-[#18181B] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-[#2A2A35]">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Truck className="text-yellow-400" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none">Hardy Central</h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Admin Panel v2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l pl-4 border-slate-100 dark:border-[#2A2A35]">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold text-slate-400">MASTER ADMIN</p>
              <p className="text-sm font-bold tracking-tight">Plus Gráfica</p>
            </div>
            <div className="w-10 h-10 bg-slate-900 text-yellow-400 rounded-full flex items-center justify-center font-black">PG</div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <nav className="w-full md:w-64 space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-white dark:hover:bg-[#18181B] text-slate-500'}`}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('viewer')}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${activeTab === 'viewer' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-white dark:hover:bg-[#18181B] text-slate-500'}`}
            >
              <Eye size={20} /> Ver como Cliente
            </button>
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-[#2A2A35] space-y-2">
              <p className="text-[10px] font-black text-slate-400 px-4 mb-2 tracking-widest uppercase">Operaciones</p>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-white dark:hover:bg-[#18181B] transition-all opacity-50 cursor-not-allowed">
                <MapPin size={18} /> Logística
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-white dark:hover:bg-[#18181B] transition-all opacity-50 cursor-not-allowed">
                <ClipboardList size={18} /> Servicios
              </button>
            </div>
          </nav>

          <main className="flex-1 pb-12">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HardyView;
