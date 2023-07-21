import ProductsModel from '../models/products.model.js';

class ProductManager {
  constructor() {
    this.productsModel = ProductsModel;
  }

  getProducts = async (limit = 10, page = 1, sort, category, available, baseUrl) => {
    try {
      let query = this.productsModel.find();
      if (category) {
        const trimmedCategory = category.trim();
        const categoryRegex = new RegExp(`^${trimmedCategory}$`, 'i');
        query = query.where('category').equals(categoryRegex);
      }
      if (available) {
        const lowerAvailable = available.toLowerCase();
        if (lowerAvailable  === 'true') {
          query = query.where('stock').gt(0);
        } else if (lowerAvailable === 'false') {
          query = query.where('stock').equals(0);
        } else {
          throw new Error('Valor disponible no válido. verdadero o falso esperado');
        }
      }
      if (sort) {
        const lowerSort = sort.toLowerCase();
        if (lowerSort === 'asc') {
          query = query.sort({ price: 1 });
        } else if (lowerSort === 'desc') {
          query = query.sort({ price: -1 });
        } else {
          throw new Error('Valor de clasificación no válido. asc o desc esperado');
        }
      }

      const products = await this.productsModel.paginate(query, {
        limit: parseInt(limit) || 10,
        lean: true,
        page: parseInt(page) || 1,
        customLabels: {
          docs: 'products',
          totalDocs: 'totalProducts',
        }
      });

      let navLinks = {};

      if (baseUrl) {
        const sortOptions = ['asc', 'desc'];
        const availableOptions = ['true', 'false'];
        const sortQuery = sort && sortOptions.includes(sort.toLowerCase()) ? `&sort=${sort}` : '';
        const categoryQuery = category ? `&category=${encodeURIComponent(category)}` : '';
        const availableQuery = available && availableOptions.includes(available.toLowerCase()) ? `&available=${available}` : '';
        navLinks = {
            firstLink: products.totalPages > 1? `${baseUrl}?limit=${limit}&page=1${sortQuery}${categoryQuery}${availableQuery}` : null,
            prevLink: products.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${products.prevPage}${sortQuery}${categoryQuery}${availableQuery}` : null,
            nextLink: products.hasNextPage ? `${baseUrl}?limit=${limit}&page=${products.nextPage}${sortQuery}${categoryQuery}${availableQuery}` : null,
            lastLink: products.totalPages > 1? `${baseUrl}?limit=${limit}&page=${products.totalPages}${sortQuery}${categoryQuery}${availableQuery}` : null
        };
      }
      const productsWithLinks = { ...products, ...navLinks };
      return productsWithLinks;

    } catch (error) {
      throw new Error(`Falló al recuperar: ${error.message}`);
    }
  }

  addProduct = async (newFields) => {
    try {
      const newProduct = await this.productsModel.create(newFields);
      return newProduct;
    } catch (error) {
      throw new Error(`No se pudo agregar el producto: ${error.message}`);
    }
  }

  getProductById = async (productId) => {
    try {
      const product = await this.productsModel.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw new Error(`No se pudo recuperar el producto: ${error.message}`);
    }
  }

  deleteProduct = async (productId) => {
    try {
      const product = await this.productsModel.findByIdAndDelete(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      throw new Error(`No se pudo eliminar el producto: ${error.message}`);
    }
  }

  updateProduct = async (productId, updatedFields) => {
    try {
      const { code, price, stock, thumbnails, ...otherFields } = updatedFields;

      if (code) {
        const existingProduct = await this.productsModel.findOne({ code: code });
        if (existingProduct && existingProduct._id.toString() !== productId) {
          throw new Error('El código especificado está en uso por otro producto existente');
        }
      }

      const updatedProduct = await this.productsModel.findByIdAndUpdate(
        productId,
        {
          $set: {
            ...otherFields,
            ...(code && { code }),
            ...(price && { price }),
            stock: stock !== undefined ? stock : 0,
            ...(thumbnails && { thumbnails }),
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        throw new Error('Producto no encontrado');
      }
  
      return updatedProduct;

    } catch (error) {
      throw new Error(`No se pudo actualizar el producto: ${error.message}`);
    }
  }
}

export { ProductManager };