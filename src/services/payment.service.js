import { paymentService } from "../services/index.js";
import Stripe from "stripe";
import config from "../config/config.js";

const stripe = new Stripe(config.keyPrivate);

export default class PaymentService {
  async creacteCheckout() {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [card],
      line_items: [
        {
          price_data: {
            product_data: {
              _id: {
                $oid: "64c54724e6bf28b4713ff8dd",
              },
              title: "NotebookActualizada",
              descripcion: "Notebook Gamer Acer Nitro 5 15.6",
              code: "14320",
              price: 465990,
              status: true,
              stock: 20,
              category: "NOTEBOOK",
              thumbail: "https://acortar.link/SLS5hS",
              owner: "adminCoder@coder.com",
            },
            currency: "usd",
            unit_amount: 465990 * 10,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:8080/api/payment/sucess",
      cancel_url: "http://localhost:8080/api/payment/cancel",
    });
    return session;
  }
}
