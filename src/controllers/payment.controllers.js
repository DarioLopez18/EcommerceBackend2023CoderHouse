import Stripe from "stripe";
import { paymentService } from "../services/index.js";

export const creacteCheckout = async (req, res) => {
  try {
    const session = await paymentService.creacteCheckout();
    return res.json(session);
  } catch (e) {
    console.log(e);
  }
};

export const sucessPayment = async(req,res)=>{

}

export const CancellPayment = async(req,res)=>{
    
}