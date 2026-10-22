// app/page.js
// Página principal do EventoSENAI
// Usa 'use client' porque usa useState/useEffect para consumir a API
'use client';

import { useState, useEffect, useCallback } from 'react';
import EventoCard      from '../components/EventoCard';
import FormParticipante from '../components/FormParticipante';
import FormInscricao   from '../components/FormInscricao';
import { getEventos, getParticipantes } from '../lib/api';

export default function Home() {
  const [eventos,       setEventos]       = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [loadingEvt,   setLoadingEvt]   = useState(true);
  const [loadingPart,  setLoadingPart]  = useState(true);
  const [erroEvt,      setErroEvt]      = useState('');
  const [erroPart,     setErroPart]     = useState('');
  const [secaoAtiva,   setSecaoAtiva]   = useState('eventos'); // 'eventos' | 'inscricoes'

  // ─── Carrega eventos ───────────────────────────────────────
  const carregarEventos = useCallback(async () => {
    setLoadingEvt(true);
    setErroEvt('');
    try {
      const data = await getEventos();
      setEventos(data);
    } catch (err) {
      setErroEvt(err.message);
    } finally {
      setLoadingEvt(false);
    }
  }, []);

  // ─── Carrega participantes ─────────────────────────────────
  const carregarParticipantes = useCallback(async () => {
    setLoadingPart(true);
    setErroPart('');
    try {
      const data = await getParticipantes();
      setParticipantes(data);
    } catch (err) {
      setErroPart(err.message);
    } finally {
      setLoadingPart(false);
    }
  }, []);

  useEffect(() => {
    carregarEventos();
    carregarParticipantes();
  }, [carregarEventos, carregarParticipantes]);

  // Quando um participante é cadastrado, adiciona-o à lista local
  function handleParticipanteCadastrado(novoParticipante) {
    setParticipantes((prev) =>
      [...prev, novoParticipante].sort((a, b) => a.nome.localeCompare(b.nome))
    );
  }

  // Quando uma inscrição é realizada, recarrega eventos para atualizar vagas
  function handleInscricaoRealizada() {
    carregarEventos();
  }

  // ─── Estatísticas do header ────────────────────────────────
  const totalEventos      = eventos.length;
  const totalParticipantes = participantes.length;
  const totalInscrições   = eventos.reduce((acc, e) => acc + Number(e.total_inscritos), 0);

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <div className="header-logo-badge">🎓</div>
            <div>
              <div className="header-title">EventoSENAI</div>
              <div className="header-subtitle">Gestão de Eventos Escolares</div>
            </div>
          </div>
          <nav className="header-nav" aria-label="Navegação principal">
            <button
              className={`header-nav-btn${secaoAtiva === 'eventos' ? ' active' : ''}`}
              onClick={() => setSecaoAtiva('eventos')}
              id="nav-eventos"
            >
              📅 Eventos
            </button>
            <button
              className={`header-nav-btn${secaoAtiva === 'inscricoes' ? ' active' : ''}`}
              onClick={() => setSecaoAtiva('inscricoes')}
              id="nav-inscricoes"
            >
              🎫 Inscrições
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero" aria-label="Apresentação">
        <div className="hero-badge">
          <span>🏫</span> Plataforma Oficial de Eventos
        </div>
        <h1>
          Bem-vindo ao <span>EventoSENAI</span>
        </h1>
        <p>
          Consulte os eventos do SENAI, cadastre participantes e realize inscrições
          em palestras, oficinas e workshops com facilidade.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">
              {loadingEvt ? '—' : totalEventos}
            </span>
            <span className="hero-stat-label">Eventos</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">
              {loadingPart ? '—' : totalParticipantes}
            </span>
            <span className="hero-stat-label">Participantes</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">
              {loadingEvt ? '—' : totalInscrições}
            </span>
            <span className="hero-stat-label">Inscrições</span>
          </div>
        </div>
      </section>

      {/* ── Conteúdo principal ─────────────────────────────── */}
      <main className="main-container">

        {/* ── Seção: Eventos ──────────────────────────────── */}
        <section
          className="section"
          id="secao-eventos"
          aria-label="Lista de eventos"
          style={{ display: secaoAtiva === 'eventos' ? 'block' : 'none' }}
        >
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon">📅</div>
              Eventos Disponíveis
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {!loadingEvt && (
                <span className="section-count">{totalEventos} evento(s)</span>
              )}
              <button
                className="btn btn-ghost btn-sm"
                onClick={carregarEventos}
                disabled={loadingEvt}
                id="btn-recarregar-eventos"
                title="Atualizar lista de eventos"
              >
                🔄 Atualizar
              </button>
            </div>
          </div>

          {/* Erro ao buscar eventos */}
          {erroEvt && (
            <div className="alert alert-error">
              ⚠️ {erroEvt}
              <button
                className="btn btn-ghost btn-sm"
                onClick={carregarEventos}
                style={{ marginLeft: 'auto' }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loadingEvt && !erroEvt && (
            <div className="events-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton skeleton-card" aria-hidden="true" />
              ))}
            </div>
          )}

          {/* Lista de eventos */}
          {!loadingEvt && !erroEvt && eventos.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">Nenhum evento cadastrado</div>
              <div className="empty-state-text">
                Aguarde — novos eventos serão publicados em breve.
              </div>
            </div>
          )}

          {!loadingEvt && !erroEvt && eventos.length > 0 && (
            <div className="events-grid" role="list" aria-label="Cards de eventos">
              {eventos.map((ev) => (
                <div key={ev.id} role="listitem">
                  <EventoCard evento={ev} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Seção: Inscrições ───────────────────────────── */}
        <section
          className="section"
          id="secao-inscricoes"
          aria-label="Cadastro e inscrições"
          style={{ display: secaoAtiva === 'inscricoes' ? 'block' : 'none' }}
        >
          <div className="section-header">
            <div className="section-title">
              <div className="section-title-icon">🎫</div>
              Participantes &amp; Inscrições
            </div>
          </div>

          {/* Erros de conexão */}
          {erroPart && (
            <div className="alert alert-error" style={{ marginBottom: 24 }}>
              ⚠️ Erro ao carregar participantes: {erroPart}
            </div>
          )}

          <div className="forms-grid">
            {/* Formulário de Participante */}
            <FormParticipante
              onParticipanteCadastrado={handleParticipanteCadastrado}
            />

            {/* Formulário de Inscrição */}
            {loadingEvt || loadingPart ? (
              <div className="form-card">
                <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 24 }} />
                <div className="skeleton" style={{ height: 44, marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 44, marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 44 }} />
              </div>
            ) : (
              <FormInscricao
                eventos={eventos}
                participantes={participantes}
                onInscricaoRealizada={handleInscricaoRealizada}
              />
            )}
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="footer" role="contentinfo">
        <p>
          EventoSENAI &copy; {new Date().getFullYear()} &nbsp;·&nbsp;
          Desenvolvido com <span>♥</span> para o SENAI &nbsp;·&nbsp;
          Node.js + Next.js + MySQL
        </p>
      </footer>
    </>
  );
}
