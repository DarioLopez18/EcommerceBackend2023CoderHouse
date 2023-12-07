import { expect } from "chai";
import { generateToken } from "../utils.js";
import mongoose from "mongoose";
import app from "../app.js";
import config from "../config/config.js";
import supertest from "supertest";
let server;
let request;

describe("Pruebas de la API", () => {
  before(async function () {
    await connectDb();
    server = await startServer();
    request = supertest("http://localhost:8080");
  });
  after(function () {
    mongoose.disconnect();
    server.close();
  });
  it("Debería poder crear un producto de la ruta /api/product", async () => {
    try {
      const token = generateToken();
      const product = {
        title: "Notebook",
        descripcion: "Notebook Gamer Acer Nitro 5 15.6",
        /*Cambiar el codigo en cada peticion */
        code: "1432324233245678",
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
    } catch (e) {
      console.log(e);
    }
  }).timeout(8000);
  it("Debería devolver un producto por id /api/products/:pid", async () => {
    try {
      const token = generateToken();
      const response = await request
        .get("/api/products/64c54724e6bf28b4713ff8dd")
        .set("Cookie", `keyCookieForJWT=${token}`);
      expect(response.status).to.equal(200);
      expect(response.body.title).to.eql("Notebook");
    } catch (e) {
      console.log(e);
    }
  }).timeout(8000);
  it("Debería actualizar un producto por id /api/products/:pid", async () => {
    try {
      const token = generateToken();
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
    } catch (e) {
      console.log(e);
    }
  }).timeout(8000);
});

async function connectDb() {
  try {
    const mongoDB = config.url;
    await mongoose.connect(mongoDB, {
      dbName: config.dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Base de datos conectada!");
  } catch (error) {
    throw new Error(`Error de conexión en la base de datos: ${err}`);
  }
}

async function startServer() {
  return new Promise((resolve, reject) => {
    const PORT = 9000;
    const server = app.listen(PORT, () => {
      console.log(`Servidor express escuchando en el puerto ${PORT}`);
      resolve(server);
    });
    server.on("error", (error) => {
      console.log(`Error en Servidor: ${error}`);
      reject(error);
    });
  });
}
