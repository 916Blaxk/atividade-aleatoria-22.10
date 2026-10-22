-- ============================================================
-- EventoSENAI - Script de Banco de Dados MySQL 8
-- Atividade Prática de Banco de Dados, API REST e Front-end
-- ============================================================

-- Criação e seleção do banco de dados
DROP DATABASE IF EXISTS eventosenai;
CREATE DATABASE eventosenai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE eventosenai;

-- ============================================================
-- TABELA: categorias
-- ============================================================
CREATE TABLE categorias (
  id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: eventos
-- ============================================================
CREATE TABLE eventos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo       VARCHAR(120) NOT NULL,
  descricao    TEXT,
  data_evento  DATETIME NOT NULL,
  local        VARCHAR(100) NOT NULL,
  vagas        INT NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  CONSTRAINT chk_vagas CHECK (vagas > 0),
  CONSTRAINT fk_eventos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: participantes
-- ============================================================
CREATE TABLE participantes (
  id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  turma VARCHAR(60)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABELA: inscricoes
-- ============================================================
CREATE TABLE inscricoes (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  evento_id        INT UNSIGNED NOT NULL,
  participante_id  INT UNSIGNED NOT NULL,
  data_inscricao   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_inscricao UNIQUE (evento_id, participante_id),
  CONSTRAINT fk_inscricoes_evento
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_inscricoes_participante
    FOREIGN KEY (participante_id) REFERENCES participantes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DADOS DE TESTE — CATEGORIAS (mínimo 3)
-- ============================================================
INSERT INTO categorias (nome) VALUES
  ('Palestra'),
  ('Oficina'),
  ('Workshop'),
  ('Hackathon'),
  ('Semana Tecnológica');

-- ============================================================
-- DADOS DE TESTE — EVENTOS (mínimo 5)
-- ============================================================
INSERT INTO eventos (titulo, descricao, data_evento, local, vagas, categoria_id) VALUES
  (
    'Introdução à Inteligência Artificial',
    'Palestra sobre fundamentos de IA, machine learning e aplicações no mercado de trabalho. Apresentada por especialistas da área.',
    '2026-11-05 09:00:00',
    'Auditório Principal — Bloco A',
    80,
    1
  ),
  (
    'Oficina de Arduino para Iniciantes',
    'Aprenda a programar microcontroladores com Arduino. Projeto prático de automação residencial ao final da oficina.',
    '2026-11-06 14:00:00',
    'Laboratório de Eletrônica — Bloco B',
    25,
    2
  ),
  (
    'Workshop de Desenvolvimento Web Full Stack',
    'Construa uma aplicação web completa com Node.js e React em um único dia. Traga seu notebook.',
    '2026-11-07 08:00:00',
    'Laboratório de Informática 02 — Bloco C',
    30,
    3
  ),
  (
    'Hackathon Sustentabilidade SENAI',
    'Desafio de 8 horas para desenvolver soluções tecnológicas para problemas ambientais. Premiação para os três primeiros.',
    '2026-11-12 07:30:00',
    'Ginásio Poliesportivo',
    60,
    4
  ),
  (
    'Semana da Tecnologia e Inovação',
    'Série de palestras, demonstrações e estandes de empresas parceiras. Certificado de participação para todos os inscritos.',
    '2026-11-18 08:00:00',
    'Pátio Central e Auditório Principal',
    200,
    5
  ),
  (
    'Oficina de Impressão 3D',
    'Da modelagem 3D à impressão: aprenda a usar o software Fusion 360 e opere as impressoras do laboratório.',
    '2026-11-20 13:30:00',
    'Laboratório de Fabricação Digital — Bloco D',
    20,
    2
  ),
  (
    'Palestra: Segurança da Informação no Dia a Dia',
    'Como proteger seus dados pessoais, reconhecer golpes online e usar senhas seguras. Palestra aberta à comunidade.',
    '2026-11-25 10:00:00',
    'Auditório Principal — Bloco A',
    100,
    1
  );

-- ============================================================
-- DADOS DE TESTE — PARTICIPANTES (mínimo 5)
-- ============================================================
INSERT INTO participantes (nome, email, turma) VALUES
  ('Ana Paula Ferreira',      'ana.ferreira@aluno.senai.br',   'idev4'),
  ('Bruno Costa Mendes',      'bruno.mendes@aluno.senai.br',    'ielemec4'),
  ('Carla Souza Lima',        'carla.lima@aluno.senai.br',      'idev3'),
  ('Diego Oliveira Santos',   'diego.santos@aluno.senai.br',    'ielemec3'),
  ('Eduarda Rocha Tavares',   'eduarda.tavares@aluno.senai.br', 'idev5'),
  ('Felipe Nascimento Cruz',  'felipe.cruz@aluno.senai.br',     'ielemec5'),
  ('Gabriela Pires Almeida',  'gabriela.almeida@aluno.senai.br','idev4'),
  ('Henrique Barbosa Leal',   'henrique.leal@aluno.senai.br',   'ielemec4');

-- ============================================================
-- DADOS DE TESTE — INSCRIÇÕES
-- ============================================================
-- Ana Paula inscrita em IA (evento 1) e Hackathon (evento 4)
INSERT INTO inscricoes (evento_id, participante_id) VALUES (1, 1);
INSERT INTO inscricoes (evento_id, participante_id) VALUES (4, 1);

-- Bruno inscrito em Arduino (evento 2) e Hackathon (evento 4)
INSERT INTO inscricoes (evento_id, participante_id) VALUES (2, 2);
INSERT INTO inscricoes (evento_id, participante_id) VALUES (4, 2);

-- Carla inscrita em IA (evento 1) e Workshop Full Stack (evento 3)
INSERT INTO inscricoes (evento_id, participante_id) VALUES (1, 3);
INSERT INTO inscricoes (evento_id, participante_id) VALUES (3, 3);

-- Diego inscrito em Semana Tecnologia (evento 5) e Segurança Info (evento 7)
INSERT INTO inscricoes (evento_id, participante_id) VALUES (5, 4);
INSERT INTO inscricoes (evento_id, participante_id) VALUES (7, 4);

-- Eduarda inscrita em Workshop (evento 3) e Impressão 3D (evento 6)
INSERT INTO inscricoes (evento_id, participante_id) VALUES (3, 5);
INSERT INTO inscricoes (evento_id, participante_id) VALUES (6, 5);

-- Felipe inscrito em IA (evento 1)
INSERT INTO inscricoes (evento_id, participante_id) VALUES (1, 6);

-- ============================================================
-- CONSULTAS SQL PARA ESTUDO
-- ============================================================

-- 1. Listar todos os eventos com suas categorias (JOIN)
SELECT
  e.id,
  e.titulo,
  e.data_evento,
  e.local,
  e.vagas,
  c.nome AS categoria
FROM eventos e
INNER JOIN categorias c ON e.categoria_id = c.id
ORDER BY e.data_evento;

-- 2. Listar participantes inscritos em um evento específico (ex.: evento 1)
SELECT
  p.id,
  p.nome,
  p.email,
  p.turma,
  i.data_inscricao
FROM inscricoes i
INNER JOIN participantes p ON i.participante_id = p.id
WHERE i.evento_id = 1
ORDER BY p.nome;

-- 3. Listar eventos com total de inscritos e vagas restantes
SELECT
  e.id,
  e.titulo,
  e.vagas                           AS total_vagas,
  COUNT(i.id)                       AS total_inscritos,
  e.vagas - COUNT(i.id)             AS vagas_restantes,
  c.nome                            AS categoria
FROM eventos e
LEFT JOIN inscricoes i ON e.id = i.evento_id
INNER JOIN categorias c ON e.categoria_id = c.id
GROUP BY e.id, e.titulo, e.vagas, c.nome
ORDER BY e.data_evento;

-- 4. Verificar inscrições duplicadas (não deve retornar nenhuma linha)
SELECT
  evento_id,
  participante_id,
  COUNT(*) AS ocorrencias
FROM inscricoes
GROUP BY evento_id, participante_id
HAVING COUNT(*) > 1;

-- 5. Listar todos os inscritos com nome do evento e nome do participante
SELECT
  e.titulo   AS evento,
  p.nome     AS participante,
  p.turma,
  i.data_inscricao
FROM inscricoes i
INNER JOIN eventos      e ON i.evento_id       = e.id
INNER JOIN participantes p ON i.participante_id = p.id
ORDER BY e.titulo, p.nome;
