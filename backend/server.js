import app from './src/app.js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor executando na porta ${PORT}`);
  console.log(`📝 Documentação: http://localhost:${PORT}/api/docs`);
});
