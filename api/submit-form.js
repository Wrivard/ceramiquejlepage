import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Extract form data (matching Céramique JLepage form field names)
    const {
      'Contact-6-First-Name': firstName,
      'Contact-6-Last-Name': lastName,
      'Contact-6-Email': email,
      'Contact-6-Phone': phone,
      'Contact-6-Select': projectType,
      'Contact-6-Radio': clientType,
      'Contact-6-Message': message
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants'
      });
    }

    // Initialize Resend
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable missing');
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const businessEmail = 'wrivard@kua.quebec'; // Testing email (change back to ceramiquesjlepage@gmail.com later)

    const fullName = `${firstName} ${lastName}`;

    // Create email content using table-based layout for compatibility
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle soumission - Céramique JLepage</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: #d4a574; color: #fff; text-align: center; padding: 30px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">📋 Nouvelle Demande de Soumission</h1>
                    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Céramique JLepage</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <h3 style="color: #333; margin-top: 0;">👤 Informations du client</h3>
                    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
                      <tr>
                        <td style="border-bottom: 1px solid #eee; font-weight: bold; color: #666; width: 30%;">Nom complet:</td>
                        <td style="border-bottom: 1px solid #eee; color: #333;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Courriel:</td>
                        <td style="border-bottom: 1px solid #eee; color: #333;">${email}</td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Téléphone:</td>
                        <td style="border-bottom: 1px solid #eee; color: #333;">${phone}</td>
                      </tr>` : ''}
                      ${projectType ? `
                      <tr>
                        <td style="border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Type de projet:</td>
                        <td style="border-bottom: 1px solid #eee; color: #333;">${projectType}</td>
                      </tr>` : ''}
                      ${clientType ? `
                      <tr>
                        <td style="border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Type de client:</td>
                        <td style="border-bottom: 1px solid #eee; color: #333;">${clientType}</td>
                      </tr>` : ''}
                    </table>
                    
                    <h3 style="color: #333; margin-top: 25px;">💬 Message</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #d4a574;">
                      <p style="margin: 0; line-height: 1.6; color: #333;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #fff3e0; border-radius: 8px; border: 1px solid #d4a574;">
                      <p style="margin: 0; font-size: 14px; color: #666;">
                        <strong>⚡ Action requise:</strong> Répondre au client dans les 24h pour maintenir notre standard de service.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-size: 12px; color: #666;">
                      Soumission reçue via ceramiquesjlepage.ca<br>
                      ${new Date().toLocaleString('fr-CA', { timeZone: 'America/Montreal' })}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send business email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: businessEmail,
      subject: `Nouvelle soumission - ${fullName} (${projectType || 'Non spécifié'})`,
      html: emailContent,
      replyTo: email
    });

    if (error) {
      console.error('Email send error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email'
      });
    }

    // Send confirmation email to client
    const confirmationContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de soumission - Céramique JLepage</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background: #d4a574; color: #fff; text-align: center; padding: 30px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Merci pour votre demande!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Bonjour ${firstName},</p>
                    <p style="margin: 0 0 20px 0; line-height: 1.6; color: #333;">
                      Merci d'avoir choisi <strong>Céramique JLepage</strong> pour votre projet de carrelage. 
                      Nous avons bien reçu votre demande de soumission et nous vous contacterons dans les <strong>24 à 48 heures</strong>.
                    </p>
                    <p style="margin: 0 0 20px 0; line-height: 1.6; color: #333;">
                      Notre équipe d'experts analysera votre projet et vous proposera une solution personnalisée 
                      qui respecte vos besoins et votre budget.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h3 style="margin: 0 0 15px 0; color: #d4a574;">Prochaines étapes:</h3>
                      <ul style="margin: 0; padding-left: 20px; color: #333;">
                        <li>Analyse de votre demande (24h)</li>
                        <li>Préparation de la soumission détaillée</li>
                        <li>Prise de contact pour planifier une visite si nécessaire</li>
                        <li>Remise de votre soumission personnalisée</li>
                      </ul>
                    </div>
                    
                    <p style="margin: 20px 0 0 0; line-height: 1.6; color: #333;">
                      En attendant, n'hésitez pas à consulter nos <a href="https://ceramiquesjlepage.ca/realisations" style="color: #d4a574;">réalisations récentes</a> 
                      pour vous inspirer.
                    </p>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #fff3e0; border-radius: 8px; text-align: center;">
                      <p style="margin: 0; color: #333;">
                        <strong>Une question urgente?</strong><br>
                        📞 <a href="tel:+15147756608" style="color: #d4a574; text-decoration: none;">(514) 775-6608</a><br>
                        ✉️ <a href="mailto:ceramiquesjlepage@gmail.com" style="color: #d4a574; text-decoration: none;">ceramiquesjlepage@gmail.com</a>
                      </p>
                    </div>
                    
                    <p style="margin: 30px 0 0 0; color: #333;">
                      Cordialement,<br>
                      <strong>L'équipe Céramique JLepage</strong><br>
                      <em>Votre expert en carrelage à Mont-Saint-Hilaire</em>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Confirmation de votre demande de soumission - Céramique JLepage',
        html: confirmationContent,
        replyTo: businessEmail
      });
    } catch (confirmationError) {
      console.warn('Confirmation email failed:', confirmationError);
      // Don't fail the main request if confirmation email fails
    }

    res.status(200).json({
      success: true,
      message: 'Votre demande a été envoyée avec succès! Nous vous contacterons sous peu.',
      data: data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
}
