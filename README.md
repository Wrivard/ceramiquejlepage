# Céramique J. Lepage - Professional Ceramic Installation Services

## 🚀 Project Overview

This is the official website for Céramique J. Lepage, a professional ceramic and flooring installation company serving Mont-Saint-Hilaire and surrounding areas in Quebec, Canada.

## 📋 Project Status

✅ **Initial Setup Complete**
- Webflow export analyzed and configured
- SEO files created (sitemap.xml, robots.txt, llm.txt)
- Git repository initialized
- Package.json and Vercel configuration ready
- Form identified: `wf-form-Contact-6-Form` in `soumission.html`

## 🛠️ Technology Stack

- **Frontend**: Webflow export (HTML/CSS/JS)
- **Backend**: Vercel serverless functions (ready for Resend integration)
- **Email Service**: Resend API (to be configured)
- **Image Optimization**: Sharp.js for responsive images
- **Deployment**: Vercel
- **Domain**: ceramiquejlepage.ca

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. **Optimize images**: `npm run optimize-images` (creates responsive versions)
4. Set up environment variables (see below)
5. Run locally: `npm run dev`
6. Deploy to Vercel: `vercel --prod`

## 📁 Project Structure

```
ceramiquejlepage.webflow/
├── index.html                          # Homepage
├── soumission.html                     # Contact form page (main form)
├── a-propos.html                       # About page
├── carrelage-commercial.html           # Commercial ceramic services
├── carreuleur-au-mont-saint-hilaire.html # Local services
├── installation-de-plancher-chauffant.html # Heated floor installation
├── pose-de-carrelage-residentiel.html  # Residential ceramic services
├── realisations.html                   # Portfolio/realizations
├── css/                                # Stylesheets
├── images/                             # Images and assets
├── js/                                 # JavaScript files
├── sitemap.xml                         # SEO sitemap
├── robots.txt                          # SEO robots file
├── llm.txt                            # AI training data declaration
├── package.json                        # Node.js dependencies
├── vercel.json                        # Vercel configuration
└── .gitignore                         # Git ignore rules
```

## 📧 Form Configuration

**Form Details:**
- **Form ID**: `wf-form-Contact-6-Form`
- **Form Fields**:
  - `Contact-6-First-Name` (Prénom)
  - `Contact-6-Last-Name` (Nom de famille)
  - `Contact-6-Email` (Email)
  - `Contact-6-Phone` (Téléphone)
  - `Contact-6-Message` (Message)

## 🔧 Next Steps

1. **Configure Resend API**:
   - Add `RESEND_API_KEY` to Vercel environment variables
   - Add `FROM_EMAIL` (noreply@ceramiquejlepage.ca) to Vercel environment variables
   - Verify domain in Resend dashboard

2. **Create API Function**:
   - Create `api/submit-form.js` for email handling
   - Update form JavaScript to use `/api/submit-form`

3. **Deploy to Vercel**:
   - Connect GitHub repository to Vercel
   - Configure environment variables
   - Deploy and test

## 🌐 SEO Configuration

- **Sitemap**: https://ceramiquejlepage.ca/sitemap.xml
- **Robots**: https://ceramiquejlepage.ca/robots.txt
- **Target Keywords**: céramique installation, carrelage commercial, carrelage résidentiel, Mont-Saint-Hilaire

## 📱 Contact

- **Website**: https://ceramiquejlepage.ca
- **Service Area**: Mont-Saint-Hilaire and surrounding regions, Quebec
- **Industry**: Professional ceramic and flooring installation services

---

**Last Updated**: 2024-12-19  
**Version**: 1.0.0  
**Status**: Ready for Resend integration and deployment
