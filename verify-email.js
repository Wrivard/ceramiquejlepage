// Simple email verification script for testing Resend integration
// Run with: node verify-email.js

const { Resend } = require('resend');

async function testEmail() {
  console.log('🧪 Testing Resend Email Integration...\n');

  // Check environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY environment variable is missing');
    console.log('💡 Add it to your .env file or Vercel environment variables');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  try {
    console.log(`📧 Sending test email from: ${fromEmail}`);
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: 'wrivard@kua.quebec', // Testing email
      subject: 'Test Email - Céramique JLepage Form Integration',
      html: `
        <h2>✅ Email Integration Test Successful!</h2>
        <p>This is a test email to verify that your Resend integration is working correctly.</p>
        <p><strong>From:</strong> ${fromEmail}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('fr-CA', { timeZone: 'America/Montreal' })}</p>
        <p>If you received this email, your form integration is ready to go! 🎉</p>
      `
    });

    if (error) {
      console.error('❌ Email send failed:', error);
    } else {
      console.log('✅ Test email sent successfully!');
      console.log('📋 Email ID:', data.id);
      console.log('\n🎉 Your Resend integration is working correctly!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEmail();
