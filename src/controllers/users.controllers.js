import { userRepository } from "../services/index.js";

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
    await userRepository.updateUser(user._id,user);
    res.status(200).json({ message: "Documents uploaded successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadDocumentView = async(req,res)=>{
  try{
    res.status(200).render("uploadDocuments")
  }catch(e){
    throw e;
  }
}
