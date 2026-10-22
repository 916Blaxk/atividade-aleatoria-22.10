// components/FormParticipante.js
'use client';

import { useState } from 'react';
import { cadastrarParticipante } from '../lib/api';

export default function FormParticipante({ onParticipanteCadastrado }) {
  const [form, setForm]       = useState({ nome: '', email: '', turma: '' });
  const [erros, setErros]     = useState({});
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null); // { tipo: 'success'|'error', texto: '' }

  function validar() {
    const novosErros = {};
    if (!form.nome.trim())  novosErros.nome  = 'Nome é obrigatório.';
    if (!form.email.trim()) novosErros.email = 'E-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      novosErros.email = 'Formato de e-mail inválido.';
    if (!form.turma.trim()) novosErros.turma = 'Turma é obrigatória.';
    return novosErros;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Remove erro do campo ao digitar
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: '' }));
    setMensagem(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setLoading(true);
    setMensagem(null);
    try {
      const novoParticipante = await cadastrarParticipante({
        nome:  form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        turma: form.turma.trim(),
      });

      setMensagem({
        tipo:  'success',
        texto: `✅ Participante "${novoParticipante.nome}" cadastrado com sucesso!`,
      });
      setForm({ nome: '', email: '', turma: '' });
      setErros({});

      // Notifica o componente pai para atualizar a lista
      if (onParticipanteCadastrado) onParticipanteCadastrado(novoParticipante);
    } catch (err) {
      setMensagem({ tipo: 'error', texto: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      <div className="form-card-title">📋 Cadastrar Participante</div>
      <div className="form-card-subtitle">
        Preencha os dados para adicionar um novo participante ao sistema.
      </div>

      {mensagem && (
        <div className={`alert alert-${mensagem.tipo === 'success' ? 'success' : 'error'}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="part-nome" className="form-label">Nome completo *</label>
          <input
            id="part-nome"
            name="nome"
            type="text"
            className={`form-input${erros.nome ? ' error' : ''}`}
            placeholder="Ex.: João da Silva Pereira"
            value={form.nome}
            onChange={handleChange}
            disabled={loading}
            autoComplete="name"
          />
          {erros.nome && <div className="form-error-text">⚠ {erros.nome}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="part-email" className="form-label">E-mail *</label>
          <input
            id="part-email"
            name="email"
            type="email"
            className={`form-input${erros.email ? ' error' : ''}`}
            placeholder="joao.silva@aluno.senai.br"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
          />
          {erros.email && <div className="form-error-text">⚠ {erros.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="part-turma" className="form-label">Turma *</label>
          <input
            id="part-turma"
            name="turma"
            type="text"
            className={`form-input${erros.turma ? ' error' : ''}`}
            placeholder="Ex.: idev4, ielemec4, idev3"
            value={form.turma}
            onChange={handleChange}
            disabled={loading}
          />
          {erros.turma && <div className="form-error-text">⚠ {erros.turma}</div>}
        </div>

        <button
          type="submit"
          id="btn-cadastrar-participante"
          className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`}
          disabled={loading}
        >
          {!loading && '➕ Cadastrar Participante'}
        </button>
      </form>
    </div>
  );
}
