import { writeFileSync } from 'node:fs';
import { createStatementPdf } from '../../src/utils/pdfGenerator.js';

const records = Array.from({ length: 85 }, (_, index) => {
  const day = String(1 + Math.floor(index / 30)).padStart(2, '0');
  const hour = String(6 + (index % 15)).padStart(2, '0');
  const minute = String((index * 7) % 60).padStart(2, '0');
  return {
    transactionDateTime: `${day}-04-2026 ${hour}:${minute}`,
    processedDateTime: `${day}-04-2026 ${hour}:${String((Number(minute) + 2) % 60).padStart(2, '0')}`,
    licencePlateNo: index % 2 ? 'MH20GC2542' : 'MH14MH8660',
    group: 'SRGD',
    transactionDescription: `Plaza Name:Nimgaon Khalu Toll Plaza- Lane ID:L0${(index % 9) + 1}`,
    amountDr: [85, 160, 225, 315, 455][index % 5]
  };
});

const doc = createStatementPdf(records, 'April 2026');
writeFileSync('tmp/pdfs/test-statement.pdf', Buffer.from(doc.output('arraybuffer')));

