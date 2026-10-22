// components/FormInscricao.js
'use client';

import { useState } from 'react';
import { inscrever } from '../lib/api';

// Formata data ISO para padrão brasileiro (curto)
function formatarDataCurta(dataISO) {
  if (!dataISO) return '';
  return new Date(dataISO).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

export default function FormInscricao({ eventos, participantes, onInscricaoRealizada }) {
  const [eventoId,       setEventoId]       = useState('');
  const [participanteId, setParticipanteId] = useState('');
  const [loading,        setLoading]        = useState(false);
  const [mensagem,       setMensagem]       = useState(null);
  const [erros,          setErros]          = useState({});

  const eventoSelecionado = eventos.find((e) => String(e.id) === String(eventoId));
  const lotado = eventoSelecionado && Number(eventoSelecionado.vagas_restantes) <= 0;

  function validar() {
    const novosErros = {};
    if (!eventoId)       novosErros.evento       = 'Selecione um evento.';
    if (!participanteId) novosErros.participante  = 'Selecione um participante.';
    return novosErros;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem(null);

    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    setErros({});

    if (lotado) {
      setMensagem({ tipo: 'error', texto: '❌ Este evento está lotado.' });
      return;
    }

    setLoading(true);
    try {
      const resultado = await inscrever(Number(eventoId), Number(participanteId));
      const nomeEvento        = eventoSelecionado?.titulo || 'evento';
      const nomeParticipante  = participantes.find((p) => String(p.id) === String(participanteId))?.nome || '';

      setMensagem({
        tipo:  'success',
        texto: `✅ ${nomeParticipante} inscrito(a) em "${nomeEvento}" com sucesso! Vagas restantes: ${resultado.vagas_restantes}.`,
      });
      setEventoId('');
      setParticipanteId('');

      // Notifica o pai para atualizar eventos (vagas restantes)
      if (onInscricaoRealizada) onInscricaoRealizada();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      <div className="form-card-title">🎫 Realizar Inscrição</div>
      <div className="form-card-subtitle">
        Selecione o evento e o participante para efetivar a inscrição.
      </div>

      {mensagem && (
        <div className={`alert alert-${mensagem.tipo === 'success' ? 'success' : 'error'}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="insc-evento" className="form-label">Evento *</label>
          <select
            id="insc-evento"
            className={`form-select${erros.evento ? ' error' : ''}`}
            value={eventoId}
            onChange={(e) => { setEventoId(e.target.value); setErros((p) => ({ ...p, evento: '' })); setMensagem(null); }}
            disabled={loading}
          >
            <option value="">— Selecione um evento —</option>
            {eventos.map((ev) => {
              const rest = Number(ev.vagas_restantes);
              const label = rest <= 0
                ? `[LOTADO] ${ev.titulo}`
                : `${ev.titulo} (${rest} vaga${rest !== 1 ? 's' : ''}) — ${formatarDataCurta(ev.data_evento)}`;
              return (
                <option key={ev.id} value={ev.id} disabled={rest <= 0}>
                  {label}
                </option>
              );
            })}
          </select>
          {erros.evento && <div className="form-error-text">⚠ {erros.evento}</div>}
          {eventoSelecionado && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              📍 {eventoSelecionado.local} &nbsp;·&nbsp; 📅 {formatarDataCurta(eventoSelecionado.data_evento)}
              {lotado
                ? <span style={{ color: 'var(--error)', marginLeft: 8 }}>🔴 Lotado</span>
                : <span style={{ color: 'var(--success)', marginLeft: 8 }}>✅ {eventoSelecionado.vagas_restantes} vaga(s)</span>
              }
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="insc-participante" className="form-label">Participante *</label>
          <select
            id="insc-participante"
            className={`form-select${erros.participante ? ' error' : ''}`}
            value={participanteId}
            onChange={(e) => { setParticipanteId(e.target.value); setErros((p) => ({ ...p, participante: '' })); setMensagem(null); }}
            disabled={loading}
          >
            <option value="">— Selecione um participante —</option>
            {participantes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — {p.turma}
              </option>
            ))}
          </select>
          {erros.participante && <div className="form-error-text">⚠ {erros.participante}</div>}
          {participantes.length === 0 && (
            <div className="alert alert-info" style={{ marginTop: 8 }}>
              ℹ️ Nenhum participante cadastrado. Cadastre um primeiro.
            </div>
          )}
        </div>

        <button
          type="submit"
          id="btn-realizar-inscricao"
          className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
          disabled={loading || lotado}
          title={lotado ? 'Evento lotado — inscrição indisponível' : ''}
        >
          {!loading && (lotado ? '🔴 Evento Lotado' : '🎫 Confirmar Inscrição')}
        </button>
      </form>
    </div>
  );
}
