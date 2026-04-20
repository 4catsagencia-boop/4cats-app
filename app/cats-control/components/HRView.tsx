"use client";

import { useEffect, useState } from "react";
import { fetchColaboradores, fetchComisiones, insertColaborador, type Colaborador, type Comision } from "../../../utils/supabase";

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function HRView() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newColab, setNewColab] = useState({
    nombre: "",
    email: "",
    rol: "",
    rut: "",
    telefono: "",
    direccion: "",
    banco: "",
    tipo_cuenta: "",
    numero_cuenta: "",
    comision_porcentaje: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [colabs, coms] = await Promise.all([
        fetchColaboradores(),
        fetchComisiones()
      ]);
      setColaboradores(colabs);
      setComisiones(coms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!newColab.nombre || !newColab.email) return;
    
    setIsSaving(true);
    try {
      await insertColaborador({
        ...newColab,
        activo: true
      });
      setShowModal(false);
      setNewColab({ 
        nombre: "", email: "", rol: "", rut: "", telefono: "", 
        direccion: "", banco: "", tipo_cuenta: "", numero_cuenta: "", 
        comision_porcentaje: 0 
      });
      await loadData();
    } catch (error) {
      console.error("Error saving collaborator:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayColaboradores = colaboradores;
  const displayComisiones = comisiones;

  if (loading && colaboradores.length === 0) return (
    <div className="p-12 flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C5CBF]" />
    </div>
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#18181B] dark:text-white">Recursos Humanos y Comisiones</h1>
          <p className="text-sm text-[#A1A1AA] mt-0.5">Gestión de colaboradores y pagos por rendimiento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Colaboradores */}
        <div className="lg:col-span-1 bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-6 shadow-sm">
          <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest mb-6">Colaboradores Activos</h2>
          <div className="space-y-4">
            {displayColaboradores.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-all group">
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#18181B] dark:text-white">{c.nombre}</p>
                  <p className="text-[10px] text-[#A1A1AA]">{c.rol} • {c.comision_porcentaje}% Comisión</p>
                  {c.rut && <p className="text-[9px] text-[#D4D4D8] mt-0.5">RUT: {c.rut}</p>}
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))}
            {displayColaboradores.length === 0 && (
              <p className="text-xs text-[#A1A1AA] text-center py-4">No hay colaboradores registrados.</p>
            )}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full mt-6 py-3 rounded-xl bg-[#7C5CBF] text-white text-xs font-bold hover:opacity-90 transition-all"
          >
            Nuevo Colaborador
          </button>
        </div>

        {/* Historial de Comisiones */}
        <div className="lg:col-span-2 bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#E4E4E7] dark:border-[#2A2A35]">
            <h2 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-widest">Liquidación de Comisiones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA] dark:bg-[#1C1C1E]">
                  <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Fecha</th>
                  <th className="text-left text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Colaborador</th>
                  <th className="text-right text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Comisión</th>
                  <th className="text-center text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#2A2A35]">
                {displayComisiones.map((com) => {
                  const colab = displayColaboradores.find(c => c.id === com.colaborador_id);
                  return (
                    <tr key={com.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-colors">
                      <td className="px-6 py-4 text-[#A1A1AA]">{new Date(com.created_at!).toLocaleDateString("es-CL")}</td>
                      <td className="px-6 py-4 font-medium text-[#18181B] dark:text-white">{colab?.nombre || 'Desconocido'}</td>
                      <td className="px-6 py-4 text-right font-bold text-[#7C5CBF]">{clp.format(com.monto)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          com.estado === 'pagada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {com.estado.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {displayComisiones.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-xs text-[#A1A1AA]">No hay comisiones registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Nuevo Colaborador - EXTENDIDO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#18181B] dark:text-white mb-6">Nuevo Colaborador</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sección Datos Personales */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-[#7C5CBF] uppercase tracking-widest border-b border-[#F4F4F5] dark:border-[#2A2A35] pb-2">Datos Personales</h4>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={newColab.nombre}
                    onChange={(e) => setNewColab({...newColab, nombre: e.target.value})}
                    placeholder="Ej: Luis Caballero"
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">RUT</label>
                    <input 
                      type="text" 
                      value={newColab.rut}
                      onChange={(e) => setNewColab({...newColab, rut: e.target.value})}
                      placeholder="12.345.678-9"
                      className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Teléfono</label>
                    <input 
                      type="text" 
                      value={newColab.telefono}
                      onChange={(e) => setNewColab({...newColab, telefono: e.target.value})}
                      placeholder="+56 9..."
                      className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={newColab.email}
                    onChange={(e) => setNewColab({...newColab, email: e.target.value})}
                    placeholder="ejemplo@4cats.cl"
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Rol</label>
                    <input 
                      type="text" 
                      value={newColab.rol}
                      onChange={(e) => setNewColab({...newColab, rol: e.target.value})}
                      placeholder="Ej: Senior Dev"
                      className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">% Comisión</label>
                    <input 
                      type="number" 
                      value={newColab.comision_porcentaje}
                      onChange={(e) => setNewColab({...newColab, comision_porcentaje: Number(e.target.value)})}
                      placeholder="10"
                      className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Datos de Transferencia */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-[#7C5CBF] uppercase tracking-widest border-b border-[#F4F4F5] dark:border-[#2A2A35] pb-2">Datos de Transferencia</h4>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Banco</label>
                  <input 
                    type="text" 
                    value={newColab.banco}
                    onChange={(e) => setNewColab({...newColab, banco: e.target.value})}
                    placeholder="Ej: Banco Estado / Santander"
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Tipo de Cuenta</label>
                  <select 
                    value={newColab.tipo_cuenta}
                    onChange={(e) => setNewColab({...newColab, tipo_cuenta: e.target.value})}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Corriente">Cuenta Corriente</option>
                    <option value="Vista">Cuenta Vista / RUT</option>
                    <option value="Ahorro">Cuenta de Ahorro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Número de Cuenta</label>
                  <input 
                    type="text" 
                    value={newColab.numero_cuenta}
                    onChange={(e) => setNewColab({...newColab, numero_cuenta: e.target.value})}
                    placeholder="0000000000"
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest block mb-1.5">Dirección (Opcional)</label>
                  <textarea 
                    value={newColab.direccion}
                    onChange={(e) => setNewColab({...newColab, direccion: e.target.value})}
                    placeholder="Calle, Comuna, Ciudad"
                    className="w-full bg-[#FAFAFA] dark:bg-[#0F0F12] border border-[#E4E4E7] dark:border-[#2A2A35] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#7C5CBF] transition-all h-20 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-10">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A35] text-xs font-bold text-[#A1A1AA] hover:bg-[#FAFAFA] dark:hover:bg-[#1C1C1E] transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl bg-[#7C5CBF] text-white text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Guardar Colaborador"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
