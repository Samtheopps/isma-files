import PDFDocument from 'pdfkit';
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
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc
        .fontSize(20)
        .text('CONTRAT DE LICENCE MUSICALE', { align: 'center' })
        .moveDown();

      doc.fontSize(12).text(`Numéro de commande: ${params.orderNumber}`, { align: 'right' });
      doc.text(`Date: ${params.date.toLocaleDateString('fr-FR')}`, { align: 'right' });
      doc.moveDown();

      // Parties
      doc
        .fontSize(14)
        .text('PARTIES', { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(11)
        .text(`Producteur: ${process.env.NEXT_PUBLIC_APP_NAME}`)
        .text(`Licensee: ${params.customerName}`)
        .text(`Email: ${params.customerEmail}`)
        .moveDown();

      // Beat Information
      doc
        .fontSize(14)
        .text('ŒUVRE MUSICALE', { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(11)
        .text(`Titre: ${params.beatTitle}`)
        .text(`Type de licence: ${params.licenseType.toUpperCase()}`)
        .text(`Prix: ${params.price}€`)
        .moveDown();

      // License Terms
      doc
        .fontSize(14)
        .text('TERMES DE LA LICENCE', { underline: true })
        .moveDown(0.5);

      const licenseTerms = getLicenseTerms(params.licenseType);

      doc.fontSize(11);
      licenseTerms.forEach((term) => {
        doc.text(`• ${term}`).moveDown(0.3);
      });

      doc.moveDown();

      // Legal Terms
      doc
        .fontSize(14)
        .text('CONDITIONS GÉNÉRALES', { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(11)
        .text(
          'Le Licensee reconnaît avoir lu et accepté les termes de cette licence. Cette licence est non-transférable et commence à la date d\'achat.'
        )
        .moveDown(0.5);

      doc
        .text(
          'Le crédit du producteur doit apparaître comme suit: "(prod. par ' +
            process.env.NEXT_PUBLIC_APP_NAME +
            ')" sur toutes les plateformes de distribution.'
        )
        .moveDown();

      // Footer
      doc
        .fontSize(10)
        .text(
          `© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME}. Tous droits réservés.`,
          { align: 'center' }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
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
