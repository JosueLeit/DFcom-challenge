import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição do produto é obrigatória'],
    trim: true,
    maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Preço do produto é obrigatório'],
    min: [0, 'Preço deve ser maior ou igual a zero'],
    validate: {
      validator: function(value) {
        // Validar se tem no máximo 2 casas decimais
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      },
      message: 'Preço deve ter no máximo 2 casas decimais'
    }
  },
  category: {
    type: String,
    required: [true, 'Categoria do produto é obrigatória'],
    trim: true,
    enum: {
      values: ['eletrônicos', 'roupas', 'casa', 'esportes', 'livros', 'saúde', 'beleza', 'brinquedos', 'alimentação', 'outros'],
      message: 'Categoria deve ser uma das opções válidas'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId'
});

// Virtual para contagem de reviews
productSchema.virtual('reviewCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  count: true
});

// Middleware para atualizar updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index para melhorar performance de busca (removido text index que requer agregação)
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 1 });
productSchema.index({ description: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
