import { use } from "chai";
import { userRepository } from "../services/index.js";

export const getUsers = async (req, res) => {
  try {
    const { user } = req.user;
    if (user.rol === "admin") {
      const users = await userRepository.getUsers();
      res.render("users", { users });
    } else {
      const message = {
        message:
          "Usted no se encuentra autorizado para realizar dicha operación",
      };
      const URI = {
        URI: "/api/products/products",
      };
      res.status(500).render("popUp", { message, URI });
    }
  } catch (error) {
    req.logger.fatal("Error al obtener los usuarios");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const getTicketUser = async (req, res) => {
  try {
    const id = req.params.uid;
    const tickets = await userRepository.getTicketUserById(id);
    res.render("tickets", { tickets });
  } catch (e) {
    const message = {
      message:
        "Usted no posee tickets de compra,para verlos por favor haga primero una compra.",
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const userPremium = async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDB = await userRepository.userPremium(uid);
    res.render("profile", userDB);
  } catch (error) {
    req.logger.fatal("Error al cambiar a usuario premium");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const uid = req.params.uid;
    const files = req.files;
    const userDB = await userRepository.uploadDocuments(uid, files);
    const message = {
      message: "Felicidades, sus documentos han sido subidos con éxito",
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(200).render("popUp", { message, URI });
  } catch (error) {
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const uploadDocumentView = async (req, res) => {
  try {
    const user = await userRepository.getUserByEmail(req.user.user.email);
    const uid = user._id;
    res.status(200).render("uploadDocuments", { uid });
  } catch (e) {
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const inactiveUser = async (req, res) => {
  try {
    const userDrop = await userRepository.inactiveUsersDrop();
    res.status(200).send(userDrop);
  } catch (e) {
    const message = {
      message: e,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const deleteUser = await userRepository.deleteUser(uid);
    const message = {
      message: "Usuario eliminado con exito",
    };
    const URI = {
      URI: "/api/users",
    };
    res.status(500).render("popUp", { message, URI });
  } catch (e) {
    const message = {
      message: e,
    };
    const URI = {
      URI: "/api/users",
    };
    res.status(500).render("popUp", { message, URI });
  }
};
