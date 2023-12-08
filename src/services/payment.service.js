import { paymentService, ticketRepository } from "../services/index.js";
import Stripe from "stripe";
import config from "../config/config.js";
import nodemailer from "nodemailer";

const stripe = new Stripe(config.keyPrivate);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.USER,
    pass: config.PASS,
  },
});

export default class PaymentService {
  constructor(ticketDAO) {
    this.ticketDAO = ticketDAO;
  }

  async creacteCheckout(id) {
    const ticket = await this.ticketDAO.getTicketById(id);
    const products = ticket.products;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.pid.title,
          },
          unit_amount: product.pid.price * 100,
        },
        quantity: product.quantity,
      })),
      mode: "payment",
      success_url: `http://localhost:8080/api/payment/sucess?ticketId=${encodeURIComponent(
        ticket._id
      )}`,
      cancel_url: `http://localhost:8080/api/payment/cancel?ticketId=${encodeURIComponent(
        ticket._id
      )}`,
    });
    return session;
  }
  async sucessPayment(ticketId) {
    const ticket = await this.ticketDAO.getTicketById(ticketId);
    ticket.status = "confirmate";
    await this.ticketDAO.updateTicket(ticketId, ticket);
    const result = transporter.sendMail({
      from: config.USER,
      to: ticket.purcharser,
      subject: "Thank you for your purchase!",
      html: `Thank you for your purchase! Your order number is ${ticket._id}.
      Your products are: ${ticket.products
        .map(
          (product) =>
            `Title: ${product.pid.title} - Descripcion: ${product.pid.descripcion} - Price: $ ${product.pid.price}`
        )
        .join(", ")}.
      A confirmation email will be sent to you when your order is shipped.Total de la compra:$ ${
        ticket.amount
      }`,
    });
    return ticket;
  }
}
