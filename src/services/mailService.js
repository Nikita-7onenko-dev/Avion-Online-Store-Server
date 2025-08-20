import nodemailer from 'nodemailer';
import ApiError from '../exceptions/ApiError.js';

class MailService{

  constructor() {
    this.transporter = null;
  }

  _init() {
    if(this.transporter) return;
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw ApiError.internal('MailService initialization error: user or password is not defined')
    }
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    })
  }

  async sendActivationToMail(to, link) {

    this._init()
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "Account activation on Avion",
        text: "",
        html: `
              <div>
                <h1>To activate your account, follow the link</h1>
                <a href="${link}">${link}</a>
              </div>
              `
      }) 
    } catch(err) {
      if(err instanceof ApiError) {
        throw err;
      }
      throw ApiError.serviceUnavailable('Service unavailable: smtp.gmail.com')
    }
  }
}

export default new MailService();