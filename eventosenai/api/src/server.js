// src/server.js
// Ponto de entrada da API EventoSENAI
'use strict';

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const eventosRouter      = require('./routes/eventos');
const participantesRouter = require('./routes/participantes');
const inscricoesRouter   = require('./routes/inscricoes');

const app  = express();
const PORT = process.env.PORT || 3333;

// ─── Middlewares globais ────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ─── Rota de saúde ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Rotas principais ───────────────────────────────────────────────────────
app.use('/eventos',       eventosRouter);
app.use('/participantes', participantesRouter);
app.use('/inscricoes',    inscricoesRouter);

// ─── 404 para rotas desconhecidas ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// ─── Handler global de erros ────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

// ─── Inicialização ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 EventoSENAI API rodando em http://localhost:${PORT}`);
});
