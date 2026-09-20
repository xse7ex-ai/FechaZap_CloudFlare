import React from 'react';
export const Toast: React.FC<{ mensagem: string | null }> = ({ mensagem }) => mensagem ? <div className="fixed bottom-24 right-4 z-[70] rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl md:bottom-6">{mensagem}</div> : null;
