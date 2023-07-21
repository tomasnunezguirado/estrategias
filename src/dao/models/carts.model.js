import mongoose from 'mongoose';
const { Schema } = mongoose;

export const cartsCollection = 'carts'

const cartsSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: true
        },
        quantity: {
          type: Number,
          default: 0,
          min: 0
        }      
      }
    ],
    default: []
  }
});

cartsSchema.pre('findOne', function() {
  this.populate('products.product');
});

cartsSchema.pre('findOneAndUpdate', function() {
  this.populate('products.product');
});

cartsSchema.pre('findByIdAndUpdate', function() {
  this.populate('products.product');
});

cartsSchema.pre('save', function() {
  this.populate('products.product');
});

const CartsModel = mongoose.model(cartsCollection, cartsSchema);

export default CartsModel;