import { writeFileSync } from 'node:fs';
import { createStatementPdf } from '../../src/utils/pdfGenerator.js';

const records = Array.from({ length: 2700 }, (_, index) => ({
  transactionDateTime: `01-04-2026 ${String(index % 24).padStart(2, '0')}:${String(index % 60).padStart(2, '0')}`,
  processedDateTime: `01-04-2026 ${String(index % 24).padStart(2, '0')}:${String((index + 1) % 60).padStart(2, '0')}`,
  licencePlateNo: 'MH20GC2542',
  group: 'SRGD',
  transactionDescription: 'Plaza Name:Nimgaon Khalu Toll Plaza- Lane ID:L02',
  amountDr: 160
}));

const doc = createStatementPdf(records, 'April 2026');
writeFileSync('tmp/pdfs/stress-2700.pdf', Buffer.from(doc.output('arraybuffer')));
