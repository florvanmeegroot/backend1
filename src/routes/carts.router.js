import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();

const manager = new CartManager("./src/data/carts.json");

router.post("/", (req, res) => {
  const cart = manager.createCart();
  res.json(cart);
});

router.get("/:cid", (req, res) => {
  const cid = Number(req.params.cid);

  const cart = manager.getCartById(cid);

  if (!cart) {
    return res.json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

router.post("/:cid/product/:pid", (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);

  const cart = manager.addProductToCart(cid, pid);

  if (!cart) {
    return res.json({ error: "Carrito no encontrado" });
  }

  res.json({ mensaje: "Producto agregado al carrito" });
});

export default router;
