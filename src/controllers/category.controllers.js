import { categoryRepository } from "../services/index.js";
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryRepository.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    req.logger.fatal("Error al obtener las categorias");
    const message = {
      message:
        error
    };
    res.status(500).render("popUp",message);
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryRepository.getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    req.logger.fatal("Error al obtener la categoria");
    const message = {
      message:
        error
    };
    const URI = {
      URI: "/api/session/login"
    }
    res.status(200).render("popUp",{message,URI});
  }
};
export const addCategory = async (req, res) => {
  try {
    const category = await categoryRepository.addCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    req.logger.fatal("Error al agregar la categoria");
    const message = {
      message:
        error
    };
    const URI = {
      URI: "/api/session/login"
    }
    res.status(200).render("popUp",{message,URI});
  }
};
export const updateCategory = async (req, res) => {
  try {
    const category = await categoryRepository.updateCategory(
      req.params.id,
      req.body
    );
    res.status(200).json(category);
  } catch (error) {
    req.logger.fatal("Error al actualizar la categoria");
    const message = {
      message:
        error
    };
    const URI = {
      URI: "/api/session/login"
    }
    res.status(200).render("popUp",{message,URI});
  }
};
