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
    res.render("tickets", {tickets});
  } catch (e) {
    res
      .status(500)
      .send({ error: "usted no posee tickets, compre para poder verlos." });
  }
};

export const userPremium = async (req, res) => {
  try {
    const id = req.params.uid;
    const user = await userRepository.userPremium(id);
    res.render("profile", user);
  } catch (error) {
    req.logger.fatal("Error al cambiar a usuario premium");
    res.status(500).json({ error: error.message });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userRepository.getUserById(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.files.forEach((file) => {
      user.documents.push({
        name: file.originalname,
        reference: file.path,
      });
    });
    await userRepository.updateUser(user._id, user);
    res.status(200).json({ message: "Documents uploaded successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadDocumentView = async (req, res) => {
  try {
    res.status(200).render("uploadDocuments");
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
