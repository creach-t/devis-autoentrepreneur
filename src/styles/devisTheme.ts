/**
 * Thème unifié pour les devis - Preview & PDF
 * Format A4: 210mm x 297mm
 */

export const COLORS = {
  // Accent principal - Bleu moderne
  accent: '#2563eb',
  accentDark: '#1d4ed8',
  
  // Texte
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  
  // Backgrounds
  bgWhite: '#ffffff',
  bgLight: '#f8fafc',
  bgGray: '#f1f5f9',
  
  // Borders
  borderLight: '#e2e8f0',
  borderMedium: '#cbd5e1',
  
  // Conditions box
  conditionsYellow: '#fef3c7',
  conditionsYellowBorder: '#f59e0b',
  conditionsYellowText: '#78350f',
  
  // Comments box
  commentsBlue: '#dbeafe',
  commentsBlueBorder: '#2563eb',
  commentsBlueText: '#1e3a8a',
  
  // Table
  tableHeader: '#1e293b',
  tableRowAlt: '#f8fafc',
};

export const DIMENSIONS = {
  // Format A4 en mm
  pageWidth: 210,
  pageHeight: 297,
  
  // Marges
  margin: 20,
  
  // Barre accent
  accentBarWidth: 4,
  
  // Logo
  logoWidth: 50,
  logoHeight: 20,
};

export const FONTS = {
  sizes: {
    title: '28pt',
    subtitle: '11pt',
    sectionTitle: '10pt',
    companyName: '10pt',
    normal: '9pt',
    small: '8pt',
    tiny: '7pt',
  },
  weights: {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
  },
};

export const SPACING = {
  xs: '1mm',
  sm: '2mm',
  md: '3mm',
  lg: '4mm',
  xl: '6mm',
  xxl: '8mm',
  xxxl: '10mm',
  section: '12mm',
};

/**
 * Classes CSS pour le preview HTML
 */
export const CSS_CLASSES = {
  page: 'a4-page',
  accentBar: 'accent-bar',
  logoZone: 'logo-zone',
  header: 'header',
  sectionTitle: 'section-title',
  infoGrid: 'info-grid',
  devisInfoBar: 'devis-info-bar',
  prestationsTable: 'prestations-table',
  totauxSection: 'totaux-section',
  conditionsBox: 'conditions-box',
  commentsBox: 'comments-box',
  mentionsLegales: 'mentions-legales',
};

/**
 * Styles inline pour jsPDF (valeurs en RGB)
 */
export const PDF_COLORS = {
  accent: [37, 99, 235],
  accentDark: [29, 78, 216],
  textPrimary: [30, 41, 59],
  textSecondary: [71, 85, 105],
  textMuted: [100, 116, 139],
  textLight: [148, 163, 184],
  bgLight: [248, 250, 252],
  bgGray: [241, 245, 249],
  borderLight: [226, 232, 240],
  white: [255, 255, 255],
};

/**
 * Configuration du tableau des prestations
 */
export const TABLE_CONFIG = {
  columns: {
    designation: { width: 45, align: 'left' as const },
    quantite: { width: 8, align: 'center' as const },
    unite: { width: 10, align: 'center' as const },
    prixUnitaire: { width: 12, align: 'right' as const },
    tva: { width: 8, align: 'center' as const },
    total: { width: 17, align: 'right' as const },
  },
  header: {
    height: 7,
    fontSize: 8,
    textColor: PDF_COLORS.white,
    fillColor: PDF_COLORS.textPrimary,
  },
  body: {
    rowHeight: 7,
    fontSize: 9,
    textColor: PDF_COLORS.textSecondary,
    altRowColor: PDF_COLORS.bgLight,
  },
};

/**
 * Génère le CSS complet pour le preview A4
 */
export function getPreviewCSS(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', Arial, sans-serif;
      background: #e5e7eb;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
    }

    .a4-page {
      width: ${DIMENSIONS.pageWidth}mm;
      min-height: ${DIMENSIONS.pageHeight}mm;
      background: ${COLORS.bgWhite};
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      padding: ${DIMENSIONS.margin}mm;
      position: relative;
      margin: 20px auto;
    }

    .accent-bar {
      position: absolute;
      left: 0;
      top: 0;
      width: ${DIMENSIONS.accentBarWidth}mm;
      height: 100%;
      background: linear-gradient(180deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%);
    }

    .logo-zone {
      width: ${DIMENSIONS.logoWidth}mm;
      height: ${DIMENSIONS.logoHeight}mm;
      border: 1px dashed ${COLORS.borderMedium};
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${COLORS.textLight};
      font-size: ${FONTS.sizes.small};
      margin-bottom: ${SPACING.xxl};
      background: ${COLORS.bgLight};
      overflow: hidden;
    }

    .logo-zone img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .header {
      text-align: center;
      margin-bottom: ${SPACING.section};
    }

    .header h1 {
      font-size: ${FONTS.sizes.title};
      font-weight: ${FONTS.weights.light};
      color: ${COLORS.textPrimary};
      letter-spacing: 2px;
      margin-bottom: ${SPACING.md};
    }

    .header .numero {
      font-size: ${FONTS.sizes.subtitle};
      color: ${COLORS.textMuted};
      font-weight: ${FONTS.weights.normal};
    }

    .section-title {
      font-size: ${FONTS.sizes.sectionTitle};
      font-weight: ${FONTS.weights.semibold};
      color: ${COLORS.accent};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid ${COLORS.accent};
      padding-bottom: ${SPACING.sm};
      margin-bottom: ${SPACING.md};
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: ${SPACING.xxxl};
      margin-bottom: ${SPACING.xxxl};
    }

    .info-block {
      font-size: ${FONTS.sizes.normal};
      line-height: 1.5;
    }

    .info-block .company-name {
      font-weight: ${FONTS.weights.semibold};
      color: ${COLORS.textPrimary};
      margin-bottom: ${SPACING.sm};
      font-size: ${FONTS.sizes.companyName};
    }

    .info-block .detail {
      color: ${COLORS.textSecondary};
    }

    .info-block .legal {
      color: ${COLORS.textLight};
      font-size: ${FONTS.sizes.small};
      margin-top: ${SPACING.sm};
    }

    .devis-info-bar {
      background: ${COLORS.bgGray};
      padding: ${SPACING.lg};
      border-radius: 2mm;
      margin-bottom: ${SPACING.xxl};
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${SPACING.lg};
      font-size: ${FONTS.sizes.normal};
    }

    .devis-info-item .label {
      color: ${COLORS.textMuted};
      font-size: ${FONTS.sizes.small};
      margin-bottom: ${SPACING.xs};
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .devis-info-item .value {
      color: ${COLORS.textPrimary};
      font-weight: ${FONTS.weights.semibold};
    }

    .prestations-section {
      margin-bottom: ${SPACING.xxl};
    }

    .prestations-table {
      width: 100%;
      border-collapse: collapse;
      font-size: ${FONTS.sizes.normal};
    }

    .prestations-table thead {
      background: ${COLORS.tableHeader};
      color: white;
    }

    .prestations-table th {
      padding: ${SPACING.md} ${SPACING.sm};
      text-align: left;
      font-weight: ${FONTS.weights.semibold};
      font-size: ${FONTS.sizes.small};
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .prestations-table th.center {
      text-align: center;
    }

    .prestations-table th.right {
      text-align: right;
    }

    .prestations-table tbody tr {
      border-bottom: 1px solid ${COLORS.borderLight};
    }

    .prestations-table tbody tr:nth-child(even) {
      background: ${COLORS.tableRowAlt};
    }

    .prestations-table td {
      padding: ${SPACING.md} ${SPACING.sm};
      color: ${COLORS.textSecondary};
    }

    .prestations-table td.center {
      text-align: center;
    }

    .prestations-table td.right {
      text-align: right;
      font-weight: ${FONTS.weights.semibold};
      color: ${COLORS.textPrimary};
    }

    .totaux-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: ${SPACING.xxl};
    }

    .totaux-box {
      width: 60mm;
      background: ${COLORS.bgLight};
      border: 1px solid ${COLORS.borderLight};
      border-radius: 2mm;
      padding: ${SPACING.lg};
    }

    .totaux-line {
      display: flex;
      justify-content: space-between;
      padding: ${SPACING.sm} 0;
      font-size: ${FONTS.sizes.normal};
      color: ${COLORS.textSecondary};
    }

    .totaux-line.total {
      border-top: 2px solid ${COLORS.textPrimary};
      margin-top: ${SPACING.sm};
      padding-top: ${SPACING.md};
      font-weight: ${FONTS.weights.bold};
      font-size: ${FONTS.sizes.subtitle};
      color: ${COLORS.textPrimary};
    }

    .totaux-line.total .value {
      color: ${COLORS.accent};
    }

    .conditions-box,
    .comments-box {
      background: ${COLORS.conditionsYellow};
      border-left: 3px solid ${COLORS.conditionsYellowBorder};
      padding: ${SPACING.lg};
      margin-bottom: ${SPACING.xl};
      font-size: ${FONTS.sizes.small};
      line-height: 1.5;
      color: ${COLORS.conditionsYellowText};
      border-radius: 2mm;
    }

    .comments-box {
      background: ${COLORS.commentsBlue};
      border-left-color: ${COLORS.commentsBlueBorder};
      color: ${COLORS.commentsBlueText};
    }

    .box-title {
      font-weight: ${FONTS.weights.semibold};
      margin-bottom: ${SPACING.sm};
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-size: ${FONTS.sizes.small};
    }

    .mentions-legales {
      border-top: 1px solid ${COLORS.borderLight};
      padding-top: ${SPACING.lg};
      font-size: ${FONTS.sizes.tiny};
      color: ${COLORS.textMuted};
      line-height: 1.5;
    }

    .mentions-legales .title {
      font-weight: ${FONTS.weights.semibold};
      color: ${COLORS.textPrimary};
      margin-bottom: ${SPACING.sm};
      font-size: ${FONTS.sizes.small};
    }

    .mentions-legales p {
      margin-bottom: ${SPACING.sm};
    }

    .page-footer {
      margin-top: ${SPACING.lg};
      text-align: center;
      font-size: ${FONTS.sizes.tiny};
      color: ${COLORS.textLight};
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .a4-page {
        box-shadow: none;
        margin: 0;
        width: 100%;
        min-height: auto;
      }
    }
  `;
}
