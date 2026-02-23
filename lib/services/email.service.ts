import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <${process.env.EMAIL_FROM}>`,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent:', data);
    return data;
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
  isGuest = false,
}: {
  email: string;
  orderNumber: string;
  items: { beatTitle: string; licenseType: string; price: number }[];
  totalAmount: number;
  downloadUrl: string;
  isGuest?: boolean;
}) => {
  const itemsList = items
    .map(
      (item) =>
        `<li style="color: #cceeff; margin-bottom: 8px;">${item.beatTitle} - ${item.licenseType.toUpperCase()} License <span style="color: #00aaff; font-weight: 600;">(${(item.price / 100).toFixed(2)}€)</span></li>`
    )
    .join('');

  const guestNotice = isGuest
    ? `
    <div style="background: #0d4059; border: 1px solid rgba(0, 170, 255, 0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #cceeff;"><strong>ℹ️ Important :</strong></p>
      <p style="margin: 5px 0 0 0; color: #cceeff;">
        Ce lien de téléchargement est valable pendant <strong style="color: #00aaff;">30 jours</strong> avec des <strong style="color: #00aaff;">téléchargements illimités</strong>.
        Nous vous recommandons de créer un compte pour conserver un accès permanent à vos achats.
      </p>
    </div>
    `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Clash Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; background-color: #04161f;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #04161f;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #04161f;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #04161f; color: #cceeff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #0d4059;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #00aaff; text-transform: uppercase; letter-spacing: 2px;">ISMA FILES</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="background-color: #06202d; color: #cceeff; padding: 30px;">
                    <h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 600; color: #cceeff;">Merci pour votre achat ! 🎵</h2>
                    <p style="margin: 10px 0; color: #cceeff; font-size: 15px;">
                      Votre commande <strong style="color: #00aaff;">${orderNumber}</strong> a été confirmée.
                    </p>
                    
                    <h3 style="margin: 25px 0 15px 0; font-size: 18px; font-weight: 600; color: #cceeff;">Détails de la commande :</h3>
                    <ul style="margin: 10px 0; padding-left: 20px; color: #cceeff; font-size: 15px;">
                      ${itemsList}
                    </ul>
                    <p style="margin: 15px 0; font-size: 16px;">
                      <strong style="color: #00aaff; font-size: 18px;">Total : ${(totalAmount / 100).toFixed(2)}€</strong>
                    </p>
                    
                    ${guestNotice}
                    
                    <p style="margin: 20px 0 10px 0; color: #cceeff; font-size: 15px;">
                      Vous pouvez télécharger vos fichiers en cliquant sur le bouton ci-dessous :
                    </p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%); box-shadow: 0 0 20px rgba(0, 170, 255, 0.3);">
                          <a href="${downloadUrl}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                            Télécharger mes fichiers
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 15px 0 0 0; font-size: 13px; color: #9CA3AF;">
                      ${
                        isGuest
                          ? 'Lien valable 30 jours - Téléchargements illimités'
                          : 'Ce lien est valable pendant 30 jours avec des téléchargements illimités.'
                      }
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #04161f; color: #6B7280; padding: 20px; text-align: center; border-top: 1px solid #0d4059;">
                    <p style="margin: 0; font-size: 12px;">© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. Tous droits réservés.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Confirmation de commande - ${orderNumber}`,
    html,
  });
};
