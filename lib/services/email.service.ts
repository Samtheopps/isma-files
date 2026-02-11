import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    path: string;
  }[];
}

export const sendEmail = async ({ to, subject, html, attachments }: SendEmailParams) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async ({
  email,
  orderNumber,
  items,
  totalAmount,
  downloadUrl,
}: {
  email: string;
  orderNumber: string;
  items: { beatTitle: string; licenseType: string; price: number }[];
  totalAmount: number;
  downloadUrl: string;
}) => {
  const itemsList = items
    .map(
      (item) =>
        `<li>${item.beatTitle} - ${item.licenseType.toUpperCase()} License (${item.price}€)</li>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .button { 
            display: inline-block; 
            background: #3B82F6; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${process.env.NEXT_PUBLIC_APP_NAME}</h1>
          </div>
          <div class="content">
            <h2>Merci pour votre achat ! 🎵</h2>
            <p>Votre commande <strong>${orderNumber}</strong> a été confirmée.</p>
            
            <h3>Détails de la commande :</h3>
            <ul>${itemsList}</ul>
            <p><strong>Total : ${totalAmount}€</strong></p>
            
            <p>Vous pouvez télécharger vos fichiers en cliquant sur le bouton ci-dessous :</p>
            <a href="${downloadUrl}" class="button">Télécharger mes fichiers</a>
            
            <p><small>Ce lien est valable pendant 30 jours. Vous pouvez télécharger vos fichiers jusqu'à 3 fois.</small></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Confirmation de commande - ${orderNumber}`,
    html,
  });
};
