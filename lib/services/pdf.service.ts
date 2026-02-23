import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { LicenseType } from '@/types';

interface GenerateLicenseContractParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  beatTitle: string;
  licenseType: LicenseType;
  price: number;
  date: Date;
}

export const generateLicenseContract = async (
  params: GenerateLicenseContractParams
): Promise<Buffer> => {
  try {
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

    page.drawText('CONTRAT DE LICENCE MUSICALE', {
      x: 50,
      y: height - 65,
      size: 16,
      font: helveticaBold,
      color: cyan,
    });

    // Numéro de commande et date à droite
    const rightMargin = width - 50;
    page.drawText(`N° ${params.orderNumber}`, {
      x: rightMargin - 150,
      y: height - 40,
      size: 11,
      font: helvetica,
      color: darkGray,
    });

    page.drawText(params.date.toLocaleDateString('fr-FR'), {
      x: rightMargin - 150,
      y: height - 60,
      size: 10,
      font: helvetica,
      color: mediumGray,
    });

    let yPosition = height - 130;
    
    // Section PARTIES
    page.drawText('PARTIES', {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: darkBlueGray,
    });
    
    // Ligne de soulignement
    page.drawLine({
      start: { x: 50, y: yPosition - 2 },
      end: { x: 130, y: yPosition - 2 },
      thickness: 2,
      color: cyan,
    });
    
    yPosition -= 25;
    
    page.drawText(`Producteur: Isma`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 20;
    
    page.drawText(`Licensee: ${params.customerName}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 20;
    
    page.drawText(`Email: ${params.customerEmail}`, {
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
    page.drawText('ŒUVRE MUSICALE', {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: darkBlueGray,
    });
    
    page.drawLine({
      start: { x: 50, y: yPosition - 2 },
      end: { x: 190, y: yPosition - 2 },
      thickness: 2,
      color: cyan,
    });
    
    yPosition -= 25;
    
    page.drawText(`Titre: ${params.beatTitle}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 20;
    
    page.drawText(`Type de licence: ${params.licenseType.toUpperCase()}`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 20;
    
    page.drawText(`Prix: ${(params.price / 100).toFixed(2)}€`, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
    });
    
    yPosition -= 40;
    
    // Section TERMES DE LA LICENCE
    page.drawText('TERMES DE LA LICENCE', {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: darkBlueGray,
    });
    
    page.drawLine({
      start: { x: 50, y: yPosition - 2 },
      end: { x: 230, y: yPosition - 2 },
      thickness: 2,
      color: cyan,
    });
    
    yPosition -= 25;
    
    const licenseTerms = getLicenseTerms(params.licenseType);
    
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
    page.drawText('CONDITIONS GÉNÉRALES', {
      x: 50,
      y: yPosition,
      size: 14,
      font: helveticaBold,
      color: darkBlueGray,
    });
    
    page.drawLine({
      start: { x: 50, y: yPosition - 2 },
      end: { x: 240, y: yPosition - 2 },
      thickness: 2,
      color: cyan,
    });
    
    yPosition -= 25;
    
    // Texte multiligne pour les conditions générales
    const condition1 = 'Le Licensee reconnaît avoir lu et accepté les termes de cette licence.';
    const condition2 = 'Cette licence est non-transférable et commence à la date d\'achat.';
    
    page.drawText(condition1, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
      maxWidth: width - 100,
    });
    
    yPosition -= 20;
    
    page.drawText(condition2, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
      maxWidth: width - 100,
    });
    
    yPosition -= 30;
    
    const creditText = `Le crédit du producteur doit apparaître comme suit: "(prod. Isma)"`;
    const creditText2 = 'sur toutes les plateformes de distribution.';
    
    page.drawText(creditText, {
      x: 50,
      y: yPosition,
      size: 11,
      font: helvetica,
      color: darkGray,
      maxWidth: width - 100,
    });
    
    yPosition -= 20;
    
    page.drawText(creditText2, {
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
    const footerText = `© ${new Date().getFullYear()} ISMA-FILES • Tous droits réservés • www.isma-files.com`;
    const footerWidth = helvetica.widthOfTextAtSize(footerText, 9);

    page.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 40,
      size: 9,
      font: helvetica,
      color: mediumGray,
    });

    // Petit texte de validation
    page.drawText('Document généré automatiquement - Valeur contractuelle', {
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

const getLicenseTerms = (licenseType: LicenseType): string[] => {
  const terms: Record<LicenseType, string[]> = {
    basic: [
      'Fichier MP3 haute qualité inclus',
      'Jusqu\'à 50,000 streams autorisés',
      'Jusqu\'à 500 ventes physiques autorisées',
      'L\'instrumental reste disponible à la vente',
      'Crédit obligatoire du producteur',
      'Licence non-exclusive',
    ],
    standard: [
      'Fichiers MP3 et WAV haute qualité inclus',
      'Jusqu\'à 100,000 streams autorisés',
      'Jusqu\'à 1,000 ventes physiques autorisées',
      'L\'instrumental reste disponible à la vente',
      'Crédit obligatoire du producteur',
      'Licence non-exclusive',
    ],
    pro: [
      'Fichiers MP3, WAV et pistes séparées (stems) inclus',
      'Jusqu\'à 250,000 streams autorisés',
      'Jusqu\'à 2,500 ventes physiques autorisées',
      'L\'instrumental reste disponible à la vente',
      'Crédit obligatoire du producteur',
      'Licence non-exclusive',
    ],
    unlimited: [
      'Fichiers MP3, WAV et pistes séparées (stems) inclus',
      'Streams illimités',
      'Ventes physiques illimitées',
      'L\'instrumental reste disponible à la vente',
      'Crédit obligatoire du producteur',
      'Licence non-exclusive',
    ],
    exclusive: [
      'Fichiers MP3, WAV et pistes séparées (stems) inclus',
      'Streams et ventes illimités',
      'L\'instrumental est retiré de la vente',
      'Crédit obligatoire du producteur',
      'Licence EXCLUSIVE - Vous êtes le seul à pouvoir utiliser cet instrumental',
      'Droits exclusifs permanents',
    ],
  };

  return terms[licenseType];
};
