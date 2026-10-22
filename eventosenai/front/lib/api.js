// lib/api.js
// Funções de comunicação com a API EventoSENAI
// Todas as funções tratam erros de rede e respostas HTTP inválidas

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// ─── Utilitário interno ──────────────────────────────────────────────────────
async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o servidor está rodando.');
  }

  // Respostas 204 não têm body
  if (response.status === 204) return null;

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Resposta inválida do servidor.');
  }

  if (!response.ok) {
    throw new Error(data?.erro || `Erro ${response.status}`);
  }

  return data;
}

// ─── Eventos ─────────────────────────────────────────────────────────────────
export async function getEventos() {
  return request('/eventos');
}

export async function getEvento(id) {
  return request(`/eventos/${id}`);
}

export async function criarEvento(dados) {
  return request('/eventos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function atualizarEvento(id, dados) {
  return request(`/eventos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export async function excluirEvento(id) {
  return request(`/eventos/${id}`, { method: 'DELETE' });
}

export async function getInscritos(eventoId) {
  return request(`/eventos/${eventoId}/inscritos`);
}

// ─── Participantes ────────────────────────────────────────────────────────────
export async function getParticipantes() {
  return request('/participantes');
}

export async function cadastrarParticipante(dados) {
  return request('/participantes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

// ─── Inscrições ───────────────────────────────────────────────────────────────
export async function inscrever(evento_id, participante_id) {
  return request('/inscricoes', {
    method: 'POST',
    body: JSON.stringify({ evento_id, participante_id }),
  });
}

export async function cancelarInscricao(inscricaoId) {
  return request(`/inscricoes/${inscricaoId}`, { method: 'DELETE' });
}
