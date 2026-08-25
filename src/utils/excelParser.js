import * as XLSX from 'xlsx';

const REQUIRED_HEADERS = [
  'Transaction Date Time',
  'Processed Date Time',
  'Licence Plate No',
  'Group',
  'Transaction Description',
  'Amount(DR)'
];

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric'
});

function normalizeHeader(header) {
  return String(header ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')');
}

function normalizeValue(value) {
  return String(value ?? '').replace(/\u00a0/g, ' ').trim();
}

function getColumnValue(row, headerMap, headerName) {
  return row[headerMap.get(normalizeHeader(headerName))];
}

export function parseDateTime(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'number') {
    const parsedDate = XLSX.SSF.parse_date_code(value);
    if (!parsedDate) return null;
    return new Date(
      parsedDate.y,
      parsedDate.m - 1,
      parsedDate.d,
      parsedDate.H || 0,
      parsedDate.M || 0,
      parsedDate.S || 0
    );
  }

  const text = normalizeValue(value);
  const match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!match) return null;

  const [, day, month, rawYear, hour = '0', minute = '0', second = '0'] = match;
  const year = rawYear.length === 2 ? Number(`20${rawYear}`) : Number(rawYear);
  return new Date(year, Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
}

function formatDateTime(value) {
  const date = parseDateTime(value);
  if (!date) return normalizeValue(value);

  const pad = (part) => String(part).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseAmount(value) {
  if (typeof value === 'number') return value;

  const numericPart = normalizeValue(value).replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return numericPart ? Number(numericPart[0]) : 0;
}

function createHeaderMap(row) {
  return new Map(Object.keys(row).map((header) => [normalizeHeader(header), header]));
}

function validateHeaders(headerMap) {
  return REQUIRED_HEADERS.filter((header) => !headerMap.has(normalizeHeader(header)));
}

function toStatementRecord(row, headerMap) {
  const transactionDateValue = getColumnValue(row, headerMap, 'Transaction Date Time');

  return {
    transactionDateTime: formatDateTime(transactionDateValue),
    processedDateTime: formatDateTime(getColumnValue(row, headerMap, 'Processed Date Time')),
    licencePlateNo: normalizeValue(getColumnValue(row, headerMap, 'Licence Plate No')),
    group: normalizeValue(getColumnValue(row, headerMap, 'Group')).toUpperCase(),
    transactionDescription: normalizeValue(getColumnValue(row, headerMap, 'Transaction Description')),
    amountDr: parseAmount(getColumnValue(row, headerMap, 'Amount(DR)')),
    transactionDate: parseDateTime(transactionDateValue)
  };
}

export async function parseExcelFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('Empty Excel file. No worksheet was found.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

  if (rows.length === 0) {
    throw new Error('Empty Excel file. No rows were found in the first worksheet.');
  }

  const headerMap = createHeaderMap(rows[0]);
  const missingHeaders = validateHeaders(headerMap);

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required column(s): ${missingHeaders.join(', ')}`);
  }

  const records = rows
    .map((row) => toStatementRecord(row, headerMap))
    .filter((record) => record.group === 'SRGD')
    .sort((first, second) => {
      const firstTime = first.transactionDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const secondTime = second.transactionDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return firstTime - secondTime;
    });

  if (records.length === 0) {
    throw new Error('No SRGD records found.');
  }

  const firstValidDate = records.find((record) => record.transactionDate)?.transactionDate;
  const statementMonth = firstValidDate ? MONTH_FORMATTER.format(firstValidDate) : 'Unknown Month';

  return { records, statementMonth };
}
