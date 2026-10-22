// src/routes/eventos.js
// Rotas de eventos: CRUD + listagem de inscritos
'use strict';

const express = require('express');
const pool    = require('../db');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /eventos
// Lista todos os eventos com categoria, total de inscritos e vagas restantes
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        e.id,
        e.titulo,
        e.descricao,
        e.data_evento,
        e.local,
        e.vagas                       AS total_vagas,
        COUNT(i.id)                   AS total_inscritos,
        e.vagas - COUNT(i.id)         AS vagas_restantes,
        c.id                          AS categoria_id,
        c.nome                        AS categoria
      FROM eventos e
      INNER JOIN categorias c ON e.categoria_id = c.id
      LEFT JOIN  inscricoes  i ON e.id = i.evento_id
      GROUP BY e.id, e.titulo, e.descricao, e.data_evento,
               e.local, e.vagas, c.id, c.nome
      ORDER BY e.data_evento
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /eventos:', err);
    res.status(500).json({ erro: 'Erro ao buscar eventos.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /eventos/:id
// Retorna um evento específico com detalhes completos
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT
        e.id,
        e.titulo,
        e.descricao,
        e.data_evento,
        e.local,
        e.vagas                       AS total_vagas,
        COUNT(i.id)                   AS total_inscritos,
        e.vagas - COUNT(i.id)         AS vagas_restantes,
        c.id                          AS categoria_id,
        c.nome                        AS categoria
      FROM eventos e
      INNER JOIN categorias c ON e.categoria_id = c.id
      LEFT JOIN  inscricoes  i ON e.id = i.evento_id
      WHERE e.id = ?
      GROUP BY e.id, e.titulo, e.descricao, e.data_evento,
               e.local, e.vagas, c.id, c.nome
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /eventos/:id:', err);
    res.status(500).json({ erro: 'Erro ao buscar evento.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /eventos
// Cadastra um novo evento
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { titulo, descricao, data_evento, local, vagas, categoria_id } = req.body;

  // Validação de campos obrigatórios
  if (!titulo || !data_evento || !local || vagas === undefined || !categoria_id) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: titulo, data_evento, local, vagas, categoria_id.',
    });
  }
  if (!Number.isInteger(Number(vagas)) || Number(vagas) <= 0) {
    return res.status(400).json({ erro: 'O campo vagas deve ser um número inteiro maior que zero.' });
  }

  try {
    // Verifica se a categoria existe
    const [cats] = await pool.query('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
    if (cats.length === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }

    const [result] = await pool.query(
      'INSERT INTO eventos (titulo, descricao, data_evento, local, vagas, categoria_id) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, descricao || null, data_evento, local, Number(vagas), categoria_id]
    );

    const [novoEvento] = await pool.query(`
      SELECT e.id, e.titulo, e.descricao, e.data_evento, e.local,
             e.vagas AS total_vagas, 0 AS total_inscritos, e.vagas AS vagas_restantes,
             c.id AS categoria_id, c.nome AS categoria
      FROM eventos e
      INNER JOIN categorias c ON e.categoria_id = c.id
      WHERE e.id = ?
    `, [result.insertId]);

    res.status(201).json(novoEvento[0]);
  } catch (err) {
    console.error('POST /eventos:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar evento.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /eventos/:id
// Atualiza os dados de um evento existente
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data_evento, local, vagas, categoria_id } = req.body;

  if (!titulo || !data_evento || !local || vagas === undefined || !categoria_id) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: titulo, data_evento, local, vagas, categoria_id.',
    });
  }
  if (!Number.isInteger(Number(vagas)) || Number(vagas) <= 0) {
    return res.status(400).json({ erro: 'O campo vagas deve ser um número inteiro maior que zero.' });
  }

  try {
    // Verifica se o evento existe
    const [eventos] = await pool.query('SELECT id FROM eventos WHERE id = ?', [id]);
    if (eventos.length === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    // Impede que vagas sejam reduzidas abaixo do total de inscritos
    const [[{ total_inscritos }]] = await pool.query(
      'SELECT COUNT(*) AS total_inscritos FROM inscricoes WHERE evento_id = ?',
      [id]
    );
    if (Number(vagas) < total_inscritos) {
      return res.status(409).json({
        erro: `Não é possível reduzir as vagas para ${vagas}. Há ${total_inscritos} inscrito(s).`,
      });
    }

    // Verifica se a categoria existe
    const [cats] = await pool.query('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
    if (cats.length === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }

    await pool.query(
      'UPDATE eventos SET titulo=?, descricao=?, data_evento=?, local=?, vagas=?, categoria_id=? WHERE id=?',
      [titulo, descricao || null, data_evento, local, Number(vagas), categoria_id, id]
    );

    const [atualizado] = await pool.query(`
      SELECT e.id, e.titulo, e.descricao, e.data_evento, e.local,
             e.vagas AS total_vagas, COUNT(i.id) AS total_inscritos,
             e.vagas - COUNT(i.id) AS vagas_restantes,
             c.id AS categoria_id, c.nome AS categoria
      FROM eventos e
      INNER JOIN categorias c ON e.categoria_id = c.id
      LEFT JOIN  inscricoes  i ON e.id = i.evento_id
      WHERE e.id = ?
      GROUP BY e.id
    `, [id]);

    res.json(atualizado[0]);
  } catch (err) {
    console.error('PUT /eventos/:id:', err);
    res.status(500).json({ erro: 'Erro ao atualizar evento.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /eventos/:id
// Exclui um evento (inscrições são removidas em cascata pelo banco)
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM eventos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /eventos/:id:', err);
    res.status(500).json({ erro: 'Erro ao excluir evento.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /eventos/:id/inscritos
// Lista os participantes inscritos em um evento
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id/inscritos', async (req, res) => {
  const { id } = req.params;
  try {
    // Verifica se o evento existe
    const [eventos] = await pool.query('SELECT id, titulo FROM eventos WHERE id = ?', [id]);
    if (eventos.length === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    const [inscritos] = await pool.query(`
      SELECT
        p.id,
        p.nome,
        p.email,
        p.turma,
        i.id             AS inscricao_id,
        i.data_inscricao
      FROM inscricoes  i
      INNER JOIN participantes p ON i.participante_id = p.id
      WHERE i.evento_id = ?
      ORDER BY p.nome
    `, [id]);

    res.json({
      evento_id: eventos[0].id,
      evento:    eventos[0].titulo,
      total:     inscritos.length,
      inscritos,
    });
  } catch (err) {
    console.error('GET /eventos/:id/inscritos:', err);
    res.status(500).json({ erro: 'Erro ao buscar inscritos.' });
  }
});

module.exports = router;
