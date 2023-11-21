import mongoose from "mongoose";
import User from "../../services/user.repository.js";
import Assert from "assert";

mongoose.connect();
const assert = Assert.strict;

describe("Testeando el servicio de usuarios", function () {
  //Conectamos la base de datos
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://darioangellopez38:*****@primerapracticaintegrad.r7jscez.mongodb.net/?retryWrites=true&w=majority",
        {
          dbName: "ecommerce",
        }
      )
      .then(() => {
        console.log("DB connected");
        done();
      });
  });
  this.timeout(10000);

  describe("Corriendo los test", function () {
    
  });
});
