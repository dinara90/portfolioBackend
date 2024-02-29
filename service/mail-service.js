const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.STMP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Activation account for " + process.env.API_URL,
      text: "",
      html: `
          <div>
            <h1>thanks for authorization</h1>
          </div>
        `,
    });
  }
}

module.exports = new MailService();
