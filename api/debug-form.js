// Debug version of the form submission endpoint
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
    console.log('=== DEBUG FORM SUBMISSION ===');
    console.log('Request body:', req.body);
    console.log('Environment variables check:');
    console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('- FROM_EMAIL:', process.env.FROM_EMAIL || 'Not set');

    // Extract form data
    const {
      'Contact-6-First-Name': firstName,
      'Contact-6-Last-Name': lastName,
      'Contact-6-Email': email,
      'Contact-6-Phone': phone,
      'Contact-6-Select': projectType,
      'Contact-6-Radio': clientType,
      'Contact-6-Message': message
    } = req.body;

    console.log('Form data extracted:');
    console.log('- firstName:', firstName);
    console.log('- lastName:', lastName);
    console.log('- email:', email);
    console.log('- phone:', phone);
    console.log('- projectType:', projectType);
    console.log('- clientType:', clientType);
    console.log('- message:', message?.substring(0, 50) + '...');

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants',
        missing: {
          firstName: !firstName,
          lastName: !lastName,
          email: !email,
          message: !message
        }
      });
    }

    // Check if we can initialize Resend
    if (!process.env.RESEND_API_KEY) {
      console.log('ERROR: RESEND_API_KEY environment variable missing');
      return res.status(500).json({
        success: false,
        message: 'Configuration manquante - RESEND_API_KEY'
      });
    }

    // Try to import and initialize Resend
    let resend;
    try {
      const { Resend } = await import('resend');
      resend = new Resend(process.env.RESEND_API_KEY);
      console.log('Resend initialized successfully');
    } catch (importError) {
      console.log('ERROR importing Resend:', importError);
      return res.status(500).json({
        success: false,
        message: 'Erreur d\'importation Resend: ' + importError.message
      });
    }

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const businessEmail = 'wrivard@kua.quebec';
    const fullName = `${firstName} ${lastName}`;

    console.log('Attempting to send email...');
    console.log('- From:', fromEmail);
    console.log('- To:', businessEmail);
    console.log('- Subject: Nouvelle soumission -', fullName);

    // Try to send a simple test email first
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: businessEmail,
      subject: `TEST - Nouvelle soumission - ${fullName}`,
      html: `
        <h2>Test Email - Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Project:</strong> ${projectType || 'Not specified'}</p>
        <p><strong>Client Type:</strong> ${clientType || 'Not specified'}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><em>This is a test email to debug the form submission.</em></p>
      `
    });

    if (error) {
      console.log('EMAIL SEND ERROR:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi: ' + error.message,
        error: error
      });
    }

    console.log('Email sent successfully:', data);

    res.status(200).json({
      success: true,
      message: 'Email de test envoyé avec succès!',
      data: data,
      debug: {
        fullName,
        email,
        fromEmail,
        businessEmail
      }
    });

  } catch (error) {
    console.log('GENERAL ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne: ' + error.message,
      stack: error.stack
    });
  }
}
