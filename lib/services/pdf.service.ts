import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getTranslations } from 'next-intl/server';
import { LicenseType } from '@/types';

interface GenerateLicenseContractParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  beatTitle: string;
  licenseType: LicenseType;
  price: number;
  date: Date;
  locale?: string;
}

export const generateLicenseContract = async (
  params: GenerateLicenseContractParams
): Promise<Buffer> => {
  try {
    const locale = params.locale || 'en';
    const t = await getTranslations({ locale, namespace: 'pdf.license' });
    
    // Créer un nouveau document PDF
    const pdfDoc = await PDFDocument.create();
    
    // Charger les fonts standard
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Ajouter une page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    // Couleurs - Palette Tech Moderne
    const darkBlueGray = rgb(0.15, 0.18, 0.24); // #262E3D - Titres, éléments importants
    const cyan = rgb(0.25, 0.55, 0.75); // #408CBF - Accents, lignes
    const darkGray = rgb(0.3, 0.3, 0.3); // #4D4D4D - Texte principal
    const mediumGray = rgb(0.5, 0.5, 0.5); // #808080 - Texte secondaire
    const lightGray = rgb(0.7, 0.7, 0.7); // #B3B3B3 - Lignes de séparation
    
    // Header avec fond et titre stylisé
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: rgb(0.95, 0.95, 0.95),
    });

    // Logo/Nom en grand
    page.drawText('ISMA', {
      x: 50,
      y: height - 40,
      size: 24,
      font: helveticaBold,
      color: darkBlueGray,
    });

    page.drawText(t('title'), {
      x: 50,
      y: height - 65,
      size: 16,
      font: helveticaBold,
      color: cyan,
    });

    // Numéro de commande et date à droite
    const rightMargin = width - 50;
    page.drawText(`${t('orderNumber')} ${params.orderNumber}`, {
      x: rightMargin - 150,
      y: height - 40,
      size: 11,
      font: helvetica,
      color: darkGray,
    });

    const dateFormat = locale === 'fr' ? 'fr-FR' : 'en-US';
    page.drawText(params.date.toLocaleDateString(dateFormat), {
      x: rightMargin - 150,
      y: height - 60,
      size: 10,
      font: helvetica,
      color: mediumGray,
    });

    let yPosition = height - 130;
    
    // Section PARTIES
    page.drawText(t('sections.parties'), {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: darkBlueGray,
    });
    
    // Ligne de soulignement
    const partiesWidth = helveticaBold.widthOfTextAtSize(t('sections.parties'), 14);
    page.drawLine({
      start: { x: 50, y: yPosition - 2 },
      end: { x: 50 + partiesWidth, y: yPosition - 2 },
      thickness: 2,
      color: cyan,
    });
    
    yPosition -= 25;
    
    page.drawText(`${t('producer')}: Isma`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 20;
    
    page.drawText(`${t('buyer')}: ${params.customerName}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 20;
    
    page.drawText(`${t('email')}: ${params.customerEmail}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 40;
    
    // Encadré autour de la section Beat
    page.drawRectangle({
      x: 40,
      y: yPosition - 80,
      width: width - 80,
      height: 90,
      borderColor: cyan,
      borderWidth: 2,
    });

    yPosition -= 10;
    
    // Section ŒUVRE MUSICALE
    page.drawText(t('sections.musicalWork'), {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: darkBlueGray,
    });
    
    const musicalWorkWidth = helveticaBold.widthOfTextAtSize(t('sections.musicalWork'), 14);
    page.drawLine({
      start: { x: 50, y: yPosition - 2 },
      end: { x: 50 + musicalWorkWidth, y: yPosition - 2 },
      thickness: 2,
      color: cyan,
    });
    
    yPosition -= 25;
    
    page.drawText(`${t('beat')}: ${params.beatTitle}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 20;
    
    page.drawText(`${t('licenseType')}: ${params.licenseType.toUpperCase()}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 20;
    
    page.drawText(`${t('price')}: ${(params.price / 100).toFixed(2)}€`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 40;
    
    // Section TERMES DE LA LICENCE
    page.drawText(t('sections.licenseTerms'), {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: darkBlueGray,
    });
    
    const licenseTermsWidth = helveticaBold.widthOfTextAtSize(t('sections.licenseTerms'), 14);
    page.drawLine({
      start: { x: 50, y: yPosition - 2 },
      end: { x: 50 + licenseTermsWidth, y: yPosition - 2 },
      thickness: 2,
      color: cyan,
    });
    
    yPosition -= 25;
    
    const licenseTerms = await getLicenseTerms(params.licenseType, locale);
    
    for (const term of licenseTerms) {
      page.drawText(`• ${term}`, {
        x: 50,
        y: yPosition,
        size: 11,
        font: helvetica,
        color: darkGray,
      });
      yPosition -= 20;
    }
    
    yPosition -= 20;
    
    // Section CONDITIONS GÉNÉRALES
    page.drawText(t('sections.generalConditions'), {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: darkBlueGray,
    });
    
    const conditionsWidth = helveticaBold.widthOfTextAtSize(t('sections.generalConditions'), 14);
    page.drawLine({
      start: { x: 50, y: yPosition - 2 },
      end: { x: 50 + conditionsWidth, y: yPosition - 2 },
      thickness: 2,
      color: cyan,
    });
    
    yPosition -= 25;
    
    // Texte multiligne pour les conditions générales
    page.drawText(t('conditions.acceptance'), {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
      maxWidth: width - 100,
    });
    
    yPosition -= 20;
    
    page.drawText(t('conditions.nonTransferable'), {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
      maxWidth: width - 100,
    });
    
    yPosition -= 30;
    
    page.drawText(t('conditions.credit'), {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
      maxWidth: width - 100,
    });
    
    yPosition -= 20;
    
    page.drawText(t('conditions.platforms'), {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    // Ligne de séparation
    page.drawLine({
      start: { x: 50, y: 60 },
      end: { x: width - 50, y: 60 },
      thickness: 1,
      color: lightGray,
    });

    // Footer text
    const currentYear = new Date().getFullYear();
    const footerText = t('copyright', { year: currentYear });
    const footerWidth = helvetica.widthOfTextAtSize(footerText, 9);

    page.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 40,
      size: 9,
      font: helvetica,
      color: mediumGray,
    });

    // Petit texte de validation
    page.drawText(t('validity'), {
      x: 50,
      y: 20,
      size: 8,
      font: helvetica,
      color: mediumGray,
    });
    
    // Sauvegarder le PDF
    const pdfBytes = await pdfDoc.save();
    
    return Buffer.from(pdfBytes);
    
  } catch (error) {
    console.error('[PDF] Erreur génération:', error);
    throw error;
  }
};

const getLicenseTerms = async (licenseType: LicenseType, locale: string): Promise<string[]> => {
  const t = await getTranslations({ locale, namespace: 'pdf.license' });
  
  // Get the terms array from translations
  const termsKey = `terms.${licenseType}` as const;
  const terms = t.raw(termsKey);
  
  // Return the array directly (it's already in the correct language)
  return Array.isArray(terms) ? terms : [];
};
