const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'database.sqlite');

// Função para inicializar o banco de dados
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFile, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
        reject(err);
      } else {
        console.log('Conectado ao banco de dados SQLite.');

        // Criar tabela de medições
        db.run(`CREATE TABLE IF NOT EXISTS measurements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          heartRate REAL NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) {
            console.error('Erro ao criar tabela de medições:', err.message);
            reject(err);
          } else {
            console.log('Tabela de medições criada com sucesso.');
          }
        });

        // Criar tabela de irregularidades
        db.run(`CREATE TABLE IF NOT EXISTS irregularities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          end TIMESTAMP
        )`, (err) => {
          if (err) {
            console.error('Erro ao criar tabela de irregularidades:', err.message);
            reject(err);
          } else {
            console.log('Tabela de irregularidades criada com sucesso.');
            resolve(db);
          }
        });
      }
    });
  });
};

module.exports = initializeDatabase;
