// src/db.js
// Pool de conexões MySQL usando mysql2/promise e dotenv
'use strict';

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               Number(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'eventosenai',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '-03:00',
  decimalNumbers:     true,
});

// Testa a conexão ao iniciar
pool.getConnection()
  .then((conn) => {
    console.log('✅ Conexão com MySQL estabelecida com sucesso.');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  });

module.exports = pool;
