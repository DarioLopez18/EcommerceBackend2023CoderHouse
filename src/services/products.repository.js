import ProductDTO from "../DTO/products.dto.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import { generateProductsErrorInfo } from "../errors/info.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

export default class ProductRepository {
  constructor(productDAO, userDAO) {
    this.productDAO = productDAO;
    this.userDAO = userDAO;
  }
  async addProduct(data) {
    try {
      const productExist = await this.productDAO.getProductByCode(data.code);
      if (productExist) {
        CustomError.createError({
          name: "Error",
          message: "Product already exists",
          code: EErrors.PRODUCT_ALREADY_EXISTS,
          info: generateProductsErrorInfo(productExist),
        });
      }
      const owner = data.owner;
      const user = await this.userDAO.getUserByEmail(owner);
      if (!user) {
        return CustomError.createError({
          name: "Error",
          message: "User not found",
          code: EErrors.USER_NOT_FOUND,
          info: generateProductsErrorInfo(user),
        });
      }

      if (user.rol === "admin" || user.rol === "premium") {
        const product = await this.productDAO.addProduct(data);
        return product;
      } else {
        return CustomError.createError({
          name: "Error",
          message: "User not authorized",
          code: EErrors.USER_NOT_AUTHORIZED,
          info: generateProductsErrorInfo(user),
        });
      }
    } catch (error) {
      throw error;
    }
  }
  async getProducts() {
    try {
      const products = await this.productDAO.getProducts();
      return products.map((product) => new ProductDTO(product));
    } catch (error) {
      throw error;
    }
  }
  async getProductById(id) {
    try {
      const product = await this.productDAO.getProductById(id);
      return product;
    } catch (error) {
      throw error;
    }
  }
  async updateProduct(id, data) {
    try {
      const product = await this.productDAO.updateProduct(id, data);
      return product;
    } catch (error) {
      throw error;
    }
  }
  async deleteProduct(id, email) {
    try {
      const user = await this.userDAO.getUserByEmail(email);
      if (user.rol === "admin") {
        const producto = await this.productDAO.getProductById(id);
        if (producto.owner !== "admin") {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: config.USER,
              pass: config.PASS,
            },
          });
          const mailOptions = {
            to: producto.owner,
            subject:
              "Tu producto ha sido eliminado por no cumplir con nuestras normas",
            text: `El producto ${producto.title} ${producto.descripcion} ha sido eliminado. Contactarse con el servicio tecnico.`,
          };
          await transporter.sendMail(mailOptions);
        }
        const product = await this.productDAO.deleteProduct(id);
        return "product deleted";
      }
      const products = this.productDAO.getProductById(id);
      if (products.owner === email) {
        const product = await this.productDAO.deleteProduct(id);
        return "product deleted";
      }
      throw "El mail que proporcionó no posee permisos para eliminar productos,ingrese uno válido.";
    } catch (error) {
      throw error;
    }
  }

  async getProductsPaginate(page, limit, queryParams, sort) {
    try {
      const products = await this.productDAO.getProductsPaginate(
        page,
        limit,
        queryParams,
        sort
      );
      const productsPrev = products.productsPrev;
      const productsNext = products.productsNext;
      const parametrosAnterior = new URLSearchParams(productsPrev);
      const paginaAnterior = parametrosAnterior.get("page");
      const parametrosPosterior = new URLSearchParams(productsNext);
      const paginaSiguiente = parametrosPosterior.get("page");
      let productsPaginate = products.productsPaginate;
      productsPaginate = productsPaginate.filter(
        (product) => product.stock > 0
      );
      return {
        productsPaginate,
        productsPrev,
        productsNext,
        paginaAnterior,
        paginaSiguiente,
      };
    } catch (e) {
      throw e;
    }
  }

  async getProductsLimit(limit) {
    try {
      const products = await this.productDAO.getProductsLimit(limit);
      return products.map((product) => new ProductDTO(product));
    } catch (error) {
      throw error;
    }
  }
}
