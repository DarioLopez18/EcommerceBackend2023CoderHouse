import { paymentService } from "../services/index.js";
import Stripe from "stripe";
import config from "../config/config.js";

const stripe = new Stripe(config.keyPrivate);

export default class PaymentService {
  async creacteCheckout() {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            product_data: {
              name: "Laptop",
            },
            currency: "usd",
            unit_amount: 2000,
          },
          quantity: 1,
        },
        {
          price_data: {
            product_data: {
              name: "TV",
            },
            currency: "usd",
            unit_amount: 1000,
          },
          quantity: 2,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:8080/api/payment/sucess",
      cancel_url: "http://localhost:8080/api/payment/cancel",
    });
    return session;
  }
}
