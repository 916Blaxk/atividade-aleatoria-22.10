// src/routes/inscricoes.js
// Rotas de inscrições: realizar e cancelar
// Usa transação com SELECT ... FOR UPDATE para evitar race condition nas vagas
'use strict';

const express = require('express');
const pool    = require('../db');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /inscricoes
// Realiza a inscrição de um participante em um evento
// Usa transação MySQL + SELECT FOR UPDATE para evitar condição de corrida
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { evento_id, participante_id } = req.body;

  if (!evento_id || !participante_id) {
    return res.status(400).json({ erro: 'Campos obrigatórios: evento_id, participante_id.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Bloqueia a linha do evento para evitar corrida pelas últimas vagas
    const [eventos] = await conn.query(
      'SELECT id, titulo, vagas FROM eventos WHERE id = ? FOR UPDATE',
      [evento_id]
    );
    if (eventos.length === 0) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    // Verifica se o participante existe
    const [participantes] = await conn.query(
      'SELECT id FROM participantes WHERE id = ?',
      [participante_id]
    );
    if (participantes.length === 0) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Participante não encontrado.' });
    }

    // Verifica inscrição duplicada
    const [jaInscrito] = await conn.query(
      'SELECT id FROM inscricoes WHERE evento_id = ? AND participante_id = ?',
      [evento_id, participante_id]
    );
    if (jaInscrito.length > 0) {
      await conn.rollback();
      return res.status(409).json({ erro: 'Participante já inscrito neste evento.' });
    }

    // Conta inscrições atuais (dentro da transação, após o FOR UPDATE)
    const [[{ total_inscritos }]] = await conn.query(
      'SELECT COUNT(*) AS total_inscritos FROM inscricoes WHERE evento_id = ?',
      [evento_id]
    );

    if (total_inscritos >= eventos[0].vagas) {
      await conn.rollback();
      return res.status(409).json({ erro: 'Evento lotado.' });
    }

    // Insere a inscrição
    const [result] = await conn.query(
      'INSERT INTO inscricoes (evento_id, participante_id) VALUES (?, ?)',
      [evento_id, participante_id]
    );

    await conn.commit();

    res.status(201).json({
      id:              result.insertId,
      evento_id:       Number(evento_id),
      participante_id: Number(participante_id),
      vagas_restantes: eventos[0].vagas - total_inscritos - 1,
    });
  } catch (err) {
    await conn.rollback();
    // Captura violação da UNIQUE constraint caso a transação não tenha capturado
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Participante já inscrito neste evento.' });
    }
    console.error('POST /inscricoes:', err);
    res.status(500).json({ erro: 'Erro ao realizar inscrição.' });
  } finally {
    conn.release();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /inscricoes/:id
// Cancela uma inscrição pelo seu ID
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM inscricoes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Inscrição não encontrada.' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /inscricoes/:id:', err);
    res.status(500).json({ erro: 'Erro ao cancelar inscrição.' });
  }
});

module.exports = router;
