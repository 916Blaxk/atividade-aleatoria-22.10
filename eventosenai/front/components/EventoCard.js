// components/EventoCard.js
'use client';

import { useState, useEffect } from 'react';
import { getInscritos } from '../lib/api';

// Formata data ISO para padrão brasileiro
function formatarData(dataISO) {
  if (!dataISO) return '—';
  const data = new Date(dataISO);
  return data.toLocaleString('pt-BR', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

// Iniciais do nome para o avatar
function getIniciais(nome) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

// ─── Modal de Inscritos ──────────────────────────────────────
function ModalInscritos({ evento, onClose }) {
  const [inscritos, setInscritos]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [erro, setErro]             = useState('');

  // Busca inscritos quando o modal abre
  useEffect(() => {
    let ativo = true;
    getInscritos(evento.id)
      .then((data) => { if (ativo) { setInscritos(data.inscritos); setLoading(false); } })
      .catch((err) => { if (ativo) { setErro(err.message); setLoading(false); } });
    return () => { ativo = false; };
  }, [evento.id]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">👥 Participantes Inscritos</div>
            <div className="modal-subtitle">{evento.titulo}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div className="modal-body">
          {loading && (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <div className="empty-state-title">Carregando inscritos…</div>
            </div>
          )}
          {erro && (
            <div className="alert alert-error">⚠️ {erro}</div>
          )}
          {!loading && !erro && inscritos && inscritos.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🎫</div>
              <div className="empty-state-title">Nenhum inscrito ainda</div>
              <div className="empty-state-text">Seja o primeiro a se inscrever neste evento!</div>
            </div>
          )}
          {!loading && !erro && inscritos && inscritos.length > 0 && (
            <>
              <div style={{ marginBottom: 16 }}>
                <span className="section-count">{inscritos.length} inscrito(s)</span>
              </div>
              {inscritos.map((p) => (
                <div key={p.id} className="inscrito-item">
                  <div className="inscrito-avatar">{getIniciais(p.nome)}</div>
                  <div>
                    <div className="inscrito-nome">{p.nome}</div>
                    <div className="inscrito-info">
                      {p.turma} &nbsp;·&nbsp; {p.email}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EventoCard ──────────────────────────────────────────────
export default function EventoCard({ evento }) {
  const [modalAberto, setModalAberto] = useState(false);

  const vagas       = Number(evento.total_vagas);
  const inscritos   = Number(evento.total_inscritos);
  const restantes   = Number(evento.vagas_restantes);
  const percentOcup = vagas > 0 ? Math.round((inscritos / vagas) * 100) : 100;
  const lotado      = restantes <= 0;

  let barClass = 'event-vagas-fill';
  if (lotado)         barClass += ' lotado';
  else if (percentOcup >= 70) barClass += ' ocupado';

  return (
    <>
      <article className={`event-card${lotado ? ' lotado' : ''}`}>
        <div className="event-card-header">
          <span className="event-categoria">{evento.categoria}</span>
          {lotado && <span className="event-badge-lotado">🔴 Lotado</span>}
        </div>

        <h2 className="event-titulo">{evento.titulo}</h2>

        {evento.descricao && (
          <p className="event-descricao">{evento.descricao}</p>
        )}

        <div className="event-meta">
          <div className="event-meta-item">
            <span className="event-meta-icon">📅</span>
            <span>{formatarData(evento.data_evento)}</span>
          </div>
          <div className="event-meta-item">
            <span className="event-meta-icon">📍</span>
            <span>{evento.local}</span>
          </div>
        </div>

        <div className="event-vagas">
          <div className="event-vagas-info">
            <span className="event-vagas-label">Vagas restantes</span>
            <span className={`event-vagas-num${lotado ? ' sem-vagas' : ''}`}>
              {lotado ? 'Esgotado' : `${restantes} / ${vagas}`}
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="event-vagas-bar">
              <div
                className={barClass}
                style={{ width: `${Math.min(percentOcup, 100)}%` }}
                role="progressbar"
                aria-valuenow={percentOcup}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {inscritos} inscrito(s)
            </div>
          </div>
        </div>

        <div className="event-card-footer">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setModalAberto(true)}
            id={`btn-inscritos-${evento.id}`}
          >
            👥 Ver inscritos
          </button>
        </div>
      </article>

      {modalAberto && (
        <ModalInscritos evento={evento} onClose={() => setModalAberto(false)} />
      )}
    </>
  );
}
