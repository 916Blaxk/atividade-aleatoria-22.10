// src/routes/participantes.js
// Rotas de participantes: listagem e cadastro
'use strict';

const express = require('express');
const pool    = require('../db');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /participantes
// Lista todos os participantes cadastrados
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, turma FROM participantes ORDER BY nome'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /participantes:', err);
    res.status(500).json({ erro: 'Erro ao buscar participantes.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /participantes/:id
// Retorna um participante específico
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, turma FROM participantes WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Participante não encontrado.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /participantes/:id:', err);
    res.status(500).json({ erro: 'Erro ao buscar participante.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /participantes
// Cadastra um novo participante
// Retorna 409 se o e-mail já estiver em uso
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { nome, email, turma } = req.body;

  // Validação de campos obrigatórios
  if (!nome || !email || !turma) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, email, turma.' });
  }

  // Validação básica de formato de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ erro: 'Formato de e-mail inválido.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO participantes (nome, email, turma) VALUES (?, ?, ?)',
      [nome.trim(), email.trim().toLowerCase(), turma.trim()]
    );

    res.status(201).json({
      id:    result.insertId,
      nome:  nome.trim(),
      email: email.trim().toLowerCase(),
      turma: turma.trim(),
    });
  } catch (err) {
    // Erro de UNIQUE: e-mail duplicado (código ER_DUP_ENTRY)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }
    console.error('POST /participantes:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar participante.' });
  }
});

module.exports = router;
