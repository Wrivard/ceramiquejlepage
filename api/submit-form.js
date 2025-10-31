import { Resend } from 'resend';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Important for file uploads
  },
};

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

  let uploadedFiles = []; // Declare outside try block for cleanup in catch
  
  try {
    // Parse form data with formidable
    // Note: Vercel has a ~4.5MB total payload limit, so we use 4MB per file
    const form = formidable({
      maxFileSize: 4 * 1024 * 1024, // 4MB per file (to account for multipart overhead)
      maxFiles: 5, // Maximum 5 files
      keepExtensions: true,
      uploadDir: '/tmp' // Temporary directory
    });

    let fields, files;
    try {
      [fields, files] = await form.parse(req);
    } catch (parseError) {
      // Handle file size errors from formidable
      if (parseError.message && parseError.message.includes('maxFileSize') || parseError.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'Les images sont trop volumineuses. Veuillez réduire la taille des images ou en sélectionner moins. Maximum ~4.5MB au total.'
        });
      }
      // Re-throw other errors
      throw parseError;
    }
    
    // Extract form fields - handle both single values and arrays
    const firstName = Array.isArray(fields['Contact-6-First-Name']) ? fields['Contact-6-First-Name'][0] : fields['Contact-6-First-Name'];
    const lastName = Array.isArray(fields['Contact-6-Last-Name']) ? fields['Contact-6-Last-Name'][0] : fields['Contact-6-Last-Name'];
    const email = Array.isArray(fields['Contact-6-Email']) ? fields['Contact-6-Email'][0] : fields['Contact-6-Email'];
    const phone = Array.isArray(fields['Contact-6-Phone']) ? fields['Contact-6-Phone'][0] : fields['Contact-6-Phone'];
    const projectType = Array.isArray(fields['Contact-6-Select']) ? fields['Contact-6-Select'][0] : fields['Contact-6-Select'];
    const tileType = Array.isArray(fields['Contact-6-Radio']) ? fields['Contact-6-Radio'][0] : fields['Contact-6-Radio'];
    const superficie = Array.isArray(fields['Contact-6-Superficie']) ? fields['Contact-6-Superficie'][0] : fields['Contact-6-Superficie'];
    const message = Array.isArray(fields['Contact-6-Message']) ? fields['Contact-6-Message'][0] : fields['Contact-6-Message'];
    const recaptchaToken = Array.isArray(fields['recaptchaToken']) ? fields['recaptchaToken'][0] : fields['recaptchaToken'];
    
    // Extract uploaded files - handle both single file and multiple files
    uploadedFiles = files['Contact-6-Image[]'] || files['Contact-6-Image'] || [];
    
    // Ensure uploadedFiles is always an array
    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }
    
    // Filter out any undefined/null files
    uploadedFiles = uploadedFiles.filter(file => file && file.filepath);
    
    // Verify reCAPTCHA Enterprise token
    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA token manquant' });
    }

    const enterpriseApiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY;
    const projectId = process.env.RECAPTCHA_PROJECT_ID; // Prefer numeric project number
    const siteKey = process.env.RECAPTCHA_ENTERPRISE_SITE_KEY || '6LdxXPwrAAAAALsNDZDtLewYxVeQtCjF4e-EON-e';
    const expectedAction = 'LOGIN';

    if (!enterpriseApiKey || !projectId) {
      console.warn('Missing RECAPTCHA_ENTERPRISE_API_KEY or RECAPTCHA_PROJECT_ID');
    }

    try {
      const assessUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/assessments?key=${encodeURIComponent(enterpriseApiKey || '')}`;
      const assessBody = {
        event: {
          token: recaptchaToken,
          expectedAction,
          siteKey
        }
      };
      const assessRes = await fetch(assessUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessBody)
      });
      const assessText = await assessRes.text();
      let assess;
      try { assess = JSON.parse(assessText); } catch { assess = { raw: assessText }; }

      const valid = assess?.tokenProperties?.valid === true;
      const actionOk = assess?.tokenProperties?.action ? assess.tokenProperties.action === expectedAction : true;
      const score = typeof assess?.riskAnalysis?.score === 'number' ? assess.riskAnalysis.score : 1;
      const invalidReason = assess?.tokenProperties?.invalidReason || 'UNKNOWN';
      const hostname = assess?.tokenProperties?.hostname || 'UNKNOWN_HOST';

      // Temporary: relax threshold and log details for debugging
      if (!valid || score < 0.3) {
        console.warn('reCAPTCHA Enterprise assessment failed', { tokenProperties: assess?.tokenProperties, risk: assess?.riskAnalysis });
        return res.status(400).json({ success: false, message: 'Échec de vérification reCAPTCHA (Enterprise)', details: { valid, actionOk, score, invalidReason, hostname, usedSiteKey: siteKey } });
      }

      // Passed verification — add explicit logs
      console.info('reCAPTCHA Enterprise verified', {
        siteKey,
        action: expectedAction,
        hostname,
        score
      });
      req._recaptcha = { verified: true, score, action: expectedAction, hostname };
    } catch (enterpriseErr) {
      console.error('reCAPTCHA Enterprise verify error:', enterpriseErr);
      return res.status(400).json({ success: false, message: 'Vérification reCAPTCHA Enterprise indisponible' });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      // Clean up temporary files before returning
      if (uploadedFiles && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          if (file && file.filepath) {
            try {
              fs.unlinkSync(file.filepath);
            } catch (cleanupError) {
              console.error('Error cleaning up file:', cleanupError);
            }
          }
        }
      }
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
                      ${tileType ? `
                      <tr>
                        <td style="border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Type de tuiles:</td>
                        <td style="border-bottom: 1px solid #eee; color: #333;">${tileType}</td>
                      </tr>` : ''}
                      ${superficie ? `
                      <tr>
                        <td style="border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Superficie:</td>
                        <td style="border-bottom: 1px solid #eee; color: #333;">${superficie}</td>
                      </tr>` : ''}
                    </table>
                    
                    <h3 style="color: #333; margin-top: 25px;">💬 Message</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #d4a574;">
                      <p style="margin: 0; line-height: 1.6; color: #333;">${message}</p>
                    </div>
                    
                    ${uploadedFiles && uploadedFiles.length > 0 ? `
                    <h3 style="color: #333; margin-top: 25px;">📷 Photos du projet</h3>
                    <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
                      <p style="margin: 0; line-height: 1.6; color: #333;">
                        Le client a joint <strong>${uploadedFiles.length} image${uploadedFiles.length > 1 ? 's' : ''}</strong> à sa soumission. 
                        ${uploadedFiles.length === 1 ? 'Voir la pièce jointe ci-dessous.' : 'Voir les pièces jointes ci-dessous.'}
                      </p>
                    </div>
                    ` : ''}
                    
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

    // Prepare attachments
    const attachments = [];
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file && file.filepath) {
          try {
            const fileBuffer = fs.readFileSync(file.filepath);
            const timestamp = Date.now();
            const fileExtension = file.originalFilename ? file.originalFilename.split('.').pop() : 'jpg';
            
            // Generate clean filename for email attachment
            const cleanFilename = file.originalFilename ? 
              file.originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_') : 
              `image_${timestamp}.${fileExtension}`;
            
            console.log('📎 Creating attachment:', {
              originalFilename: file.originalFilename,
              cleanFilename: cleanFilename,
              mimetype: file.mimetype,
              size: fileBuffer.length
            });
            
            attachments.push({
              filename: cleanFilename,
              content: fileBuffer,
              contentType: file.mimetype || 'image/jpeg'
            });
          } catch (fileError) {
            console.error('Error reading file:', fileError);
          }
        }
      }
    }

    // Send business email
    const emailData = {
      from: fromEmail,
      to: businessEmail,
      subject: `Nouvelle soumission - ${fullName} (${tileType || projectType || 'Non spécifié'})`,
      html: emailContent,
      replyTo: email
    };

    // Add attachments if any
    if (attachments.length > 0) {
      emailData.attachments = attachments;
    }

    const { data, error } = await resend.emails.send(emailData);
    
    // Clean up temporary files after sending email
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file && file.filepath) {
          try {
            fs.unlinkSync(file.filepath);
            console.log('🗑️ Cleaned up temporary file:', file.filepath);
          } catch (cleanupError) {
            console.error('Error cleaning up file:', cleanupError);
          }
        }
      }
    }

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
                        📞 <a href="tel:+15147756608" style="color: #333; text-decoration: none; font-weight: 600;">(514) 775-6608</a><br>
                        ✉️ <a href="mailto:ceramiquesjlepage@gmail.com" style="color: #333; text-decoration: none; font-weight: 600;">ceramiquesjlepage@gmail.com</a>
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
      data: data,
      recaptcha: req._recaptcha || { verified: false }
    });

  } catch (error) {
    console.error('Server error:', error);
    
    // Try to clean up files if they exist (in case of error during processing)
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file && file.filepath) {
          try {
            if (fs.existsSync(file.filepath)) {
              fs.unlinkSync(file.filepath);
              console.log('🗑️ Cleaned up temporary file after error:', file.filepath);
            }
          } catch (cleanupError) {
            console.error('Error cleaning up file after error:', cleanupError);
          }
        }
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
}
