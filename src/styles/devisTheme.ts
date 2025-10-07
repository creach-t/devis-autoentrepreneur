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
    title: 28,
    subtitle: 11,
    sectionTitle: 10,
    companyName: 10,
    normal: 9,
    small: 8,
    tiny: 7,
  },
  weights: {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const SPACING = {
  xs: 1,    // 1mm
  sm: 2,    // 2mm
  md: 3,    // 3mm
  lg: 4,    // 4mm
  xl: 6,    // 6mm
  xxl: 8,   // 8mm
  xxxl: 10, // 10mm
  section: 12, // 12mm
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
    fontSize: FONTS.sizes.small,
    textColor: PDF_COLORS.white,
    fillColor: PDF_COLORS.textPrimary,
  },
  body: {
    rowHeight: 7,
    fontSize: FONTS.sizes.normal,
    textColor: PDF_COLORS.textSecondary,
    altRowColor: PDF_COLORS.bgLight,
  },
};

/**
 * Génère le CSS complet pour le preview A4
 */
export function getPreviewCSS(): string {
  return `
    .a4-page * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .a4-page {
      width: ${DIMENSIONS.pageWidth}mm;
      min-height: ${DIMENSIONS.pageHeight}mm;
      background: ${COLORS.bgWhite};
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      padding: ${DIMENSIONS.margin}mm;
      position: relative;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', Arial, sans-serif;
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
      font-size: ${FONTS.sizes.small}pt;
      margin-bottom: ${SPACING.xxl}mm;
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
      margin-bottom: ${SPACING.section}mm;
    }

    .header h1 {
      font-size: ${FONTS.sizes.title}pt;
      font-weight: ${FONTS.weights.light};
      color: ${COLORS.textPrimary};
      letter-spacing: 2px;
      margin-bottom: ${SPACING.md}mm;
      line-height: ${FONTS.lineHeights.tight};
    }

    .header .numero {
      font-size: ${FONTS.sizes.subtitle}pt;
      color: ${COLORS.textMuted};
      font-weight: ${FONTS.weights.normal};
      line-height: ${FONTS.lineHeights.normal};
    }

    .section-title {
      font-size: ${FONTS.sizes.sectionTitle}pt;
      font-weight: ${FONTS.weights.semibold};
      color: ${COLORS.accent};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid ${COLORS.accent};
      padding-bottom: ${SPACING.sm}mm;
      margin-bottom: ${SPACING.md}mm;
      line-height: ${FONTS.lineHeights.tight};
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: ${SPACING.xxxl}mm;
      margin-bottom: ${SPACING.xxxl}mm;
    }

    .info-block {
      font-size: ${FONTS.sizes.normal}pt;
      line-height: ${FONTS.lineHeights.normal};
    }

    .info-block .company-name {
      font-weight: ${FONTS.weights.semibold};
      color: ${COLORS.textPrimary};
      margin-bottom: ${SPACING.sm}mm;
      font-size: ${FONTS.sizes.companyName}pt;
      line-height: ${FONTS.lineHeights.tight};
    }

    .info-block .detail {
      color: ${COLORS.textSecondary};
      line-height: ${FONTS.lineHeights.normal};
    }

    .info-block .legal {
      color: ${COLORS.textLight};
      font-size: ${FONTS.sizes.small}pt;
      margin-top: ${SPACING.sm}mm;
      line-height: ${FONTS.lineHeights.normal};
    }

    .devis-info-bar {
      background: ${COLORS.bgGray};
      padding: ${SPACING.lg}mm;
      border-radius: 2mm;
      margin-bottom: ${SPACING.xxl}mm;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${SPACING.lg}mm;
      font-size: ${FONTS.sizes.normal}pt;
    }

    .devis-info-item .label {
      color: ${COLORS.textMuted};
      font-size: ${FONTS.sizes.small}pt;
      margin-bottom: ${SPACING.xs}mm;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: ${FONTS.lineHeights.tight};
    }

    .devis-info-item .value {
      color: ${COLORS.textPrimary};
      font-weight: ${FONTS.weights.semibold};
      font-size: ${FONTS.sizes.normal}pt;
      line-height: ${FONTS.lineHeights.normal};
    }

    .prestations-section {
      margin-bottom: ${SPACING.xxl}mm;
    }

    .prestations-table {
      width: 100%;
      border-collapse: collapse;
      font-size: ${FONTS.sizes.normal}pt;
    }

    .prestations-table thead {
      background: ${COLORS.tableHeader};
      color: white;
    }

    .prestations-table th {
      padding: ${SPACING.md}mm ${SPACING.sm}mm;
      text-align: left;
      font-weight: ${FONTS.weights.semibold};
      font-size: ${FONTS.sizes.small}pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: ${FONTS.lineHeights.tight};
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
      padding: ${SPACING.md}mm ${SPACING.sm}mm;
      color: ${COLORS.textSecondary};
      font-size: ${FONTS.sizes.normal}pt;
      line-height: ${FONTS.lineHeights.tight};
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
      margin-bottom: ${SPACING.xxl}mm;
    }

    .totaux-box {
      width: 60mm;
      background: ${COLORS.bgLight};
      border: 1px solid ${COLORS.borderLight};
      border-radius: 2mm;
      padding: ${SPACING.lg}mm;
    }

    .totaux-line {
      display: flex;
      justify-content: space-between;
      padding: ${SPACING.sm}mm 0;
      font-size: ${FONTS.sizes.normal}pt;
      color: ${COLORS.textSecondary};
      line-height: ${FONTS.lineHeights.tight};
    }

    .totaux-line.total {
      border-top: 2px solid ${COLORS.textPrimary};
      margin-top: ${SPACING.sm}mm;
      padding-top: ${SPACING.md}mm;
      font-weight: ${FONTS.weights.bold};
      font-size: ${FONTS.sizes.subtitle}pt;
      color: ${COLORS.textPrimary};
    }

    .totaux-line.total .value {
      color: ${COLORS.accent};
    }

    .conditions-box,
    .comments-box {
      background: ${COLORS.conditionsYellow};
      border-left: 3px solid ${COLORS.conditionsYellowBorder};
      padding: ${SPACING.lg}mm;
      margin-bottom: ${SPACING.xl}mm;
      font-size: ${FONTS.sizes.small}pt;
      line-height: ${FONTS.lineHeights.normal};
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
      margin-bottom: ${SPACING.sm}mm;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-size: ${FONTS.sizes.small}pt;
      line-height: ${FONTS.lineHeights.tight};
    }

    .mentions-legales {
      border-top: 1px solid ${COLORS.borderLight};
      padding-top: ${SPACING.lg}mm;
      font-size: ${FONTS.sizes.tiny}pt;
      color: ${COLORS.textMuted};
      line-height: ${FONTS.lineHeights.normal};
    }

    .mentions-legales .title {
      font-weight: ${FONTS.weights.semibold};
      color: ${COLORS.textPrimary};
      margin-bottom: ${SPACING.sm}mm;
      font-size: ${FONTS.sizes.small}pt;
      line-height: ${FONTS.lineHeights.tight};
    }

    .mentions-legales p {
      margin-bottom: ${SPACING.sm}mm;
    }

    .page-footer {
      margin-top: ${SPACING.lg}mm;
      text-align: center;
      font-size: ${FONTS.sizes.tiny}pt;
      color: ${COLORS.textLight};
      line-height: ${FONTS.lineHeights.normal};
    }

    @media print {
      .a4-page {
        box-shadow: none;
        margin: 0;
        width: 100%;
        min-height: auto;
      }
    }
  `;
}
