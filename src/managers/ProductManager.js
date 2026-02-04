import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Leer productos
  getProducts() {
    if (!fs.existsSync(this.path)) {
      return [];
    }

    const data = fs.readFileSync(this.path, "utf-8");
    return JSON.parse(data || "[]");
  }

  // Guardar productos
  saveProducts(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
  }

  // Agregar producto
  addProduct(product) {
    const products = this.getProducts();

    const newId =
      products.length > 0
        ? products[products.length - 1].id + 1
        : 1;

    const newProduct = {
      id: newId,
      ...product
    };

    products.push(newProduct);
    this.saveProducts(products);
  }
}

