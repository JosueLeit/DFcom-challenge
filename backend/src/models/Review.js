import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'ID do produto é obrigatório'],
    validate: {
      validator: mongoose.Types.ObjectId.isValid,
      message: 'ID do produto deve ser um ObjectId válido'
    }
  },
  author: {
    type: String,
    required: [true, 'Nome do autor é obrigatório'],
    trim: true,
    minlength: [2, 'Nome do autor deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome do autor deve ter no máximo 100 caracteres']
  },
  rating: {
    type: Number,
    required: [true, 'Avaliação é obrigatória'],
    min: [1, 'Avaliação deve ser entre 1 e 5'],
    max: [5, 'Avaliação deve ser entre 1 e 5'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value);
      },
      message: 'Avaliação deve ser um número inteiro'
    }
  },
  comment: {
    type: String,
    required: [true, 'Comentário é obrigatório'],
    trim: true,
    minlength: [3, 'Comentário deve ter pelo menos 4 caracteres'],
    maxlength: [500, 'Comentário não pode exceder 500 caracteres']
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

// Virtual para produto relacionado
reviewSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true
});

// Middleware para atualizar updatedAt
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index para melhorar performance
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ author: 1 });

// Compound index para busca otimizada
reviewSchema.index({ productId: 1, rating: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
