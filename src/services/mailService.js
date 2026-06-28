import { Resend } from "resend";
import ApiError from "../exceptions/ApiError.js";

class MailService {
  constructor() {
    this.resend = null;
  }

  _init() {
    if (this.resend) return;

    if (!process.env.RESEND_API_KEY) {
      throw ApiError.internal(
        "MailService initialization error: RESEND_API_KEY is not defined"
      );
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendActivationToMail(to, link) {
    this._init();

    try {
      const { data, error } = await this.resend.emails.send({
        from: "Avion Mail Service <onboarding@resend.dev>",
        to,
        subject: "Account activation on Avion",
        text: `To activate your account, follow this link: ${link}`,
        html: `
          <div>
            <h1>To activate your account, follow the link</h1>
            <a href="${link}">${link}</a>
          </div>
        `,
      });

      if (error) {
        console.error("RESEND ERROR:", error);
        throw ApiError.serviceUnavailable("Email service unavailable");
      }

      console.log("RESEND RESPONSE:", data);
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }

      console.error("RESEND ERROR:", err);
      throw ApiError.serviceUnavailable("Email service unavailable");
    }
  }
}

export default new MailService();