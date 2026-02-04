import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const manager = new ProductManager("./src/data/products.json");

// Obtener todos los productos
router.get("/", (req, res) => {
  res.json(manager.getProducts());
});

// Obtener producto por ID
router.get("/:pid", (req, res) => {
  const product = manager.getProducts().find(
    p => p.id == req.params.pid
  );

  if (!product) {
    return res.json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

// Crear producto
router.post("/", (req, res) => {
  manager.addProduct(req.body);
  res.json({ mensaje: "Producto agregado" });
});

// Actualizar producto
router.put("/:pid", (req, res) => {
  const products = manager.getProducts();
  const index = products.findIndex(p => p.id == req.params.pid);

  if (index === -1) {
    return res.json({ error: "Producto no encontrado" });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id  //mantiene id
  };

  manager.saveProducts(products);

  res.json({ mensaje: "Producto actualizado" });
});

// Eliminar producto
router.delete("/:pid", (req, res) => {
  const products = manager
    .getProducts()
    .filter(p => p.id != req.params.pid);

  manager.saveProducts(products);

  res.json({ mensaje: "Producto eliminado" });
});

export default router;
