const socket = io();

const updateProductCards = (products) => {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    products.forEach(product => {
        let htmlImage = '';
        if (product.thumbnails && product.thumbnails.length > 0) {
          htmlImage = `<img src="${product.thumbnails[0]}" alt="Thumbnail">`;
        }      
        const productCard = document.createElement('div');
        productCard.className = 'card';
        productCard.innerHTML = `
          ${htmlImage}
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p class="price">$ ${product.price}</p>
          <p class="stock">Stock: ${product.stock}</p>
          <p class="category">Categoría: ${product.category}</p>
        `;
        cardsContainer.appendChild(productCard);
    });
};

socket.on('connect', () => {
    socket.emit('newConnection', socket.id);
});

socket.on('productsUpdated', (products) => {
    updateProductCards(products);
  });