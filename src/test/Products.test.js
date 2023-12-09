import { expect } from "chai";
import { generateToken } from "../utils.js";
import mongoose from "mongoose";
import app from "../app.js";
import config from "../config/config.js";
import supertest from "supertest";
let server;
let request;
let token;

describe("Pruebas de la API", () => {
  before(async function () {
    request = supertest("http://localhost:8080");
    token = generateToken();
  });
  it("Debería poder crear un producto de la ruta /api/product", async () => {
    const product = {
      title: "Notebook",
      descripcion: "Notebook Gamer Acer Nitro 5 15.6",
      /*Cambiar el codigo en cada peticion */
      code: "14323242332456788645321",
      price: 465990,
      status: true,
      stock: 20,
      category: "NOTEBOOK",
      thumbail: "https://acortar.link/SLS5hS",
      owner: "adminCoder@coder.com",
    };
    const response = await request
      .post("/api/products")
      .send(product)
      .set("Cookie", `keyCookieForJWT=${token}`);
    const product2 = response.body;
    expect(product2.title).to.eql(product.title);
    expect(product2.descripcion).to.eql(product.descripcion);
    expect(product2.stock).to.eql(product.stock);
    expect(product2.thumbail).to.eql(product.thumbail);
    expect(product2.owner).to.eql(product.owner);
    expect(response.status).to.equal(201);
  }).timeout(8000);
  it("Debería devolver un producto por id /api/products/:pid", async () => {
    const response = await request
      .get("/api/products/64c54724e6bf28b4713ff8dd")
      .set("Cookie", `keyCookieForJWT=${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.title).to.eql("NotebookActualizada");
  }).timeout(8000);
  it("Debería actualizar un producto por id /api/products/:pid", async () => {
    const product = {
      title: "NotebookActualizada",
      descripcion: "Notebook Gamer Acer Nitro 5 15.6",
      /*Cambiar el codigo en cada peticion */
      code: "14320",
      price: 465990,
      status: true,
      stock: 20,
      category: "NOTEBOOK",
      thumbail: "https://acortar.link/SLS5hS",
      owner: "adminCoder@coder.com",
    };
    const response = await request
      .put("/api/products/64c54724e6bf28b4713ff8dd")
      .send(product)
      .set("Cookie", `keyCookieForJWT=${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.title).to.eql("NotebookActualizada");
  }).timeout(8000);
});
