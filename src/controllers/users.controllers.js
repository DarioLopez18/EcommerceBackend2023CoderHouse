import { use } from "chai";
import { userRepository } from "../services/index.js";

export const getUsers = async (req, res) => {
  try {
    const { user } = req.user;
    if (user.rol === "admin") {
      const users = await userRepository.getUsers();
      res.render("users", { users });
    } else {
      res.status(403).json({ message: "not authorized" });
    }
  } catch (error) {
    req.logger.fatal("Error al obtener los usuarios");
    res.status(500).json({ error: error.message });
  }
};

export const getTicketUser = async (req, res) => {
  try {
    const id = req.params.uid;
    const tickets = await userRepository.getTicketUserById(id);
    res.render("tickets", { tickets });
  } catch (e) {
    res
      .status(500)
      .send({ error: "usted no posee tickets, compre para poder verlos." });
  }
};

export const userPremium = async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDB = await userRepository.userPremium(uid);
    res.render("profile", userDB);
  } catch (error) {
    req.logger.fatal("Error al cambiar a usuario premium");
    res.status(500).json({ error: error.message });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const uid = req.params.uid;
    const files = req.files;
    const userDB = await userRepository.uploadDocuments(uid,files);
    res
      .status(200)
      .json({ message: "Documents uploaded successfully", userDB });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadDocumentView = async (req, res) => {
  try {
    const user = await userRepository.getUserByEmail(req.user.user.email);
    const uid = user._id;
    res.status(200).render("uploadDocuments", { uid });
  } catch (e) {
    throw e;
  }
};

export const inactiveUser = async (req, res) => {
  try {
    const userDrop = await userRepository.inactiveUsersDrop();
    res.status(200).send(userDrop);
  } catch (e) {
    res.status(500).send({ message: e });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const deleteUser = await userRepository.deleteUser(uid);
    res.status(200).send({ message: "usuario eliminado" });
  } catch (e) {
    res.status(500).send({ message: e });
  }
};
