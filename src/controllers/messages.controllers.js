import { messageRepository } from "../services/index.js";

export const getMessages = async (req, res) => {
  try {
    if (req.user.user.rol === "user" || req.user.user.rol === "premium" || req.user.user.rol === "admin") {
      const messages = await messageRepository.getMessages();
      res.status(200).render("chat", { messages });
    } else {
      req.logger.info("No autorizado");
      throw new Error("No authorized");
    }
  } catch (error) {
    req.logger.fatal("Error al obtener los mensajes");
    const message = {
      message:
        error
    };
    res.status(500).render("popUp",message);
  }
};
export const saveMessage = async (req, res) => {
  try {
    const message = await messageRepository.saveMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    req.logger.fatal("Error al guardar el mensaje");
    const message = {
      message:
        error
    };
    res.status(500).render("popUp",message);
  }
};
