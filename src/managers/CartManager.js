import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  getCarts() {
    if (!fs.existsSync(this.path)) {
      return [];
    }

    const data = fs.readFileSync(this.path, "utf-8");
    return JSON.parse(data || "[]");
  }

  saveCarts(carts) {
    fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
  }

  createCart() {
    const carts = this.getCarts();

    const newId =
      carts.length > 0
        ? carts[carts.length - 1].id + 1
        : 1;

    const newCart = {
      id: newId,
      products: []
    };

    carts.push(newCart);
    this.saveCarts(carts);

    return newCart;
  }

  getCartById(id) {
    const carts = this.getCarts();
    return carts.find(c => c.id === id);
  }

  addProductToCart(cid, pid) {
    const carts = this.getCarts();

    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];

    const productIndex = cart.products.findIndex(
      p => p.product === pid
    );

    if (productIndex === -1) {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    } else {
      cart.products[productIndex].quantity++;
    }

    this.saveCarts(carts);

    return cart;
  }
}