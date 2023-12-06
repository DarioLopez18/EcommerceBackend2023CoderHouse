import { expect } from "chai";
import request from "supertest";

import app from "../app.js";
import { generateToken } from "../utils.js";

describe("Pruebas de la API", () => {
  it("Debería poder crear un carrito de la ruta api/cart", async () => {
    const token = generateToken();
    console.log(token);
    const response = await request(app)
      .get("localhost:8080/api/cart")
      .set("Cookie", `keyCookieForJWT=${token}`);
    console.log(response)
    // Asegúrate de que la respuesta tenga el código de estado correcto
    expect(response.status).to.equal(202);
  }).timeout(8000);
});

