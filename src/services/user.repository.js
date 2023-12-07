import UserDTO from "../DTO/user.dto.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import { generateUserErrorInfo } from "../errors/info.js";

export default class UserRepository {
  constructor(userDAO, cartDAO) {
    this.userDAO = userDAO;
    this.cartDAO = cartDAO;
  }
  async createUser(data) {
    try {
      const user = await this.userDAO.createUser(data);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getUserById(id) {
    try {
      const user = await this.userDAO.getUserById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getUsers() {
    try {
      const users = await this.userDAO.getUsers();
      return users;
    } catch (error) {
      throw error;
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await this.userDAO.getUserByEmail(email);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmailCode(email, verificationCode) {
    try {
      const user = await this.userDAO.getUserByEmailCode(
        email,
        verificationCode
      );
      return new UserDTO(user);
    } catch (e) {
      throw e;
    }
  }

  async updateUser(id, data) {
    try {
      const user = await this.userDAO.updateUser(id, data);
      return new UserDTO(user);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.userDAO.deleteUser(id);
      return new UserDTO(user);
    } catch (error) {
      throw error;
    }
  }

  addCartToUser = async (userId, cartId) => {
    try {
      const user = await this.userDAO.getUserById(userId);
      user.cart.push(cartId);
      user.save();
      return user;
    } catch (e) {
      throw e;
    }
  };

  userPremium = async (id) => {
    try {
      const user = await this.userDAO.getUserById(id);
      if (user) {
        if (user.rol === "admin") {
          CustomError.createError({
            message: "No authorized",
            code: EErrors.USER_NOT_AUTHORIZED,
            status: 401,
            info: generateCartErrorInfo({ pid }),
          });
        }
        if (user.rol === "user" && user.documents.length >= 3) {
          user.rol = "premium";
          await this.userDAO.updateUser(user._id, user);
          return user;
        } else {
          CustomError.createError({
            message: "You have not uploaded the complete documentation",
            code: EErrors.USER_NOT_AUTHORIZED,
            status: 401,
            info: generateCartErrorInfo({ pid }),
          });
        }
        user.rol = "user";
        await this.userDAO.updateUser(user._id, user);
        return user;
      } else {
        CustomError.createError({
          message: "User not found",
          code: EErrors.USER_NOT_EXISTS,
          status: 404,
          info: generateCartErrorInfo({ pid }),
        });
      }
    } catch (error) {
      throw CustomError.createError({
        message: "You have not uploaded the complete documentation",
        code: EErrors.USER_NOT_AUTHORIZED,
        status: 401,
        info: generateUserErrorInfo({
          message: "You have not uploaded the complete documentation",
        }),
      });
    }
  };
}
