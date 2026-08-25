import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const TABLE_COLUMNS = [
  'Transaction Date\nTime',
  'Processed Date\nTime',
  'Licence Plate\nNo',
  'Group',
  'Transaction Description',
  'Amount(\nDR)'
];

const COLUMN_WIDTHS = [32, 32, 26, 14, 66, 18];
const MAX_ALLOWED_PAGES = 60;

function getPdfTitle(statementMonth) {
  return `E-Tag Statement Month- ${statementMonth || 'Unknown Month'}`;
}

function getSafeFileName(statementMonth) {
  return `E-Tag-Statement-${statementMonth || 'Unknown-Month'}`.replace(/[^a-z0-9-]+/gi, '-');
}

function getLayout(recordsCount) {
  const normalLayout = {
    fontSize: 8.8,
    headerFontSize: 9,
    rowHeight: 5.85,
    headerHeight: 12.3,
    cellPadding: { top: 0.55, right: 0.9, bottom: 0.55, left: 0.9 },
    startY: 31,
    margin: { top: 14, right: 11, bottom: 13, left: 11 }
  };

  const usableHeight = 297 - normalLayout.startY - normalLayout.margin.bottom - normalLayout.headerHeight;
  const normalRowsPerPage = Math.max(1, Math.floor(usableHeight / normalLayout.rowHeight));
  const estimatedNormalPages = Math.ceil((recordsCount + 1) / normalRowsPerPage);

  if (estimatedNormalPages <= MAX_ALLOWED_PAGES) {
    return normalLayout;
  }

  const requiredRowsPerPage = Math.ceil((recordsCount + 1) / MAX_ALLOWED_PAGES);
  const compactRowHeight = Math.max(3.6, Math.min(normalLayout.rowHeight, usableHeight / requiredRowsPerPage));
  const scale = compactRowHeight / normalLayout.rowHeight;

  return {
    ...normalLayout,
    fontSize: Math.max(5.2, normalLayout.fontSize * scale),
    headerFontSize: Math.max(6, normalLayout.headerFontSize * scale),
    rowHeight: compactRowHeight,
    headerHeight: Math.max(8.4, normalLayout.headerHeight * scale),
    cellPadding: {
      top: Math.max(0.25, 0.7 * scale),
      right: 0.8,
      bottom: Math.max(0.25, 0.7 * scale),
      left: 0.8
    }
  };
}

function addPageNumbers(doc) {
  const totalPages = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(70, 70, 70);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
  }
}

export function createStatementPdf(records, statementMonth) {
  if (!records.length) {
    throw new Error('No records available for PDF generation.');
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const title = getPdfTitle(statementMonth);
  const layout = getLayout(records.length);
  const totalAmount = records.reduce((sum, record) => sum + record.amountDr, 0);

  
  const tableBody = records.map((record) => [
    record.transactionDateTime,
    record.processedDateTime,
    record.licencePlateNo,
    record.group,
    record.transactionDescription,
    record.amountDr.toFixed(0)
  ]);

  tableBody.push([
    {
      content: 'SUM',
      colSpan: 5,
      styles: { halign: 'center', fontStyle: 'bold' }
    },
    {
      content: totalAmount.toFixed(0),
      styles: { halign: 'right', fontStyle: 'bold' }
    }
  ]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

  autoTable(doc, {
    head: [TABLE_COLUMNS],
    body: tableBody,
    startY: layout.startY,
    theme: 'grid',
    margin: layout.margin,
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.35,
    showHead: 'firstPage',
    styles: {
      font: 'helvetica',
      fontSize: layout.fontSize,
      cellPadding: layout.cellPadding,
      minCellHeight: layout.rowHeight,
      overflow: 'hidden',
      lineColor: [0, 0, 0],
      lineWidth: 0.35,
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
      valign: 'middle'
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: layout.headerFontSize,
      minCellHeight: layout.headerHeight,
      halign: 'left',
      valign: 'middle',
      lineColor: [0, 0, 0],
      lineWidth: 0.45
    },
    bodyStyles: {
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: COLUMN_WIDTHS[0], halign: 'left' },
      1: { cellWidth: COLUMN_WIDTHS[1], halign: 'left' },
      2: { cellWidth: COLUMN_WIDTHS[2], halign: 'left' },
      3: { cellWidth: COLUMN_WIDTHS[3], halign: 'left' },
      4: { cellWidth: COLUMN_WIDTHS[4], halign: 'left' },
      5: { cellWidth: COLUMN_WIDTHS[5], halign: 'right' }
    },
    didParseCell: (data) => {
      const isTotalRow = data.section === 'body' && data.row.index === tableBody.length - 1;

      if (data.section === 'body' && data.column.index === 5) {
        data.cell.styles.halign = 'right';
      }

      if (isTotalRow) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [255, 255, 255];
        data.cell.styles.lineWidth = 0.45;
      }
    }
  });

  addPageNumbers(doc);
  return doc;
}

export function generateStatementPdf(records, statementMonth) {
  const doc = createStatementPdf(records, statementMonth);
  doc.save(`${getSafeFileName(statementMonth)}.pdf`);
}
