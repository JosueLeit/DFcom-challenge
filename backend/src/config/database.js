import mongoose from 'mongoose';

const connectDatabase = async () => {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/dfcom_products';

    const connection = await mongoose.connect(connectionString, {
      // Configurações recomendadas
      maxPoolSize: 10, // Máximo de conexões no pool
      serverSelectionTimeoutMS: 5000, // Timeout para seleção do servidor
      socketTimeoutMS: 45000, // Timeout do socket
      family: 4 // Use IPv4, skip trying IPv6
    });

    console.log(`🍃 MongoDB conectado: ${connection.connection.host}`);

    // Event listeners para monitoramento da conexão
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('🍃 MongoDB desconectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao desconectar MongoDB:', error);
  }
};

export { connectDatabase, disconnectDatabase };
