import { useMemo, useState } from 'react';
import UploadFile from './components/UploadFile.jsx';
import PdfGenerator from './components/PdfGenerator.jsx';
import { parseExcelFile } from './utils/excelParser.js';
import PdfTemplate from './utils/PdfTemplate.jsx';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [statementMonth, setStatementMonth] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = useMemo(
    () => records.reduce((sum, record) => sum + record.amountDr, 0),
    [records]
  );

  const handleFileSelect = async (file) => {
    setError('');
    setSuccess('');
    setRecords([]);
    setStatementMonth('');

    if (!file) {
      setSelectedFile(null);
      setError('No file selected.');
      return;
    }

    const isExcelFile = /\.(xls|xlsx)$/i.test(file.name);
    if (!isExcelFile) {
      setSelectedFile(null);
      setError('Invalid file type. Please upload an .xls or .xlsx file.');
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const parsed = await parseExcelFile(file);
      setRecords(parsed.records);
      setStatementMonth(parsed.statementMonth);
      setSuccess(`${parsed.records.length} SRGD records are ready for PDF generation.`);
    } catch (parseError) {
      setError(parseError.message || 'Unable to read this Excel file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfSuccess = () => {
    setSuccess('PDF downloaded successfully.');
  };

  const handlePdfError = (message) => {
    setError(message);
  };

  return (
    <main className="app-background py-5">
      <div className="container">
        <section className="app-panel mx-auto">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
            <div>
              <p className="text-uppercase fw-bold text-primary-emphasis small mb-1">FASTag statement tool</p>
              <h1 className="display-6 fw-bold mb-2">Excel to E-Tag PDF Converter</h1>
              <p className="text-secondary mb-0">
                Upload a FASTag Excel file, keep only SRGD records, sort by transaction date, and download a formatted PDF.
              </p>
            </div>
            <div className="summary-box align-self-lg-start">
              <span className="summary-label">Amount (DR) Total</span>
              <strong>{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
          </div>

          <UploadFile
            selectedFile={selectedFile}
            isLoading={isLoading}
            onFileSelect={handleFileSelect}
          />

          {isLoading && (
            <div className="alert alert-info d-flex align-items-center gap-2 mt-3" role="status">
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
              Processing Excel file...
            </div>
          )}

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && !error && <div className="alert alert-success mt-3">{success}</div>}

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4 mb-3">
            <div>
              <h2 className="h5 fw-bold mb-1">Preview</h2>
              <p className="text-secondary mb-0">
                {statementMonth ? `PDF title: E-Tag Statement Month - ${statementMonth}` : 'Upload a valid file to preview the filtered records.'}
              </p>
            </div>
            <PdfGenerator
              records={records}
              statementMonth={statementMonth}
              disabled={isLoading}
              onSuccess={handlePdfSuccess}
              onError={handlePdfError}
            />
          </div>

          <div className="table-responsive preview-table-wrap">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Transaction Date Time</th>
                  <th>Processed Date Time</th>
                  <th>Licence Plate No</th>
                  <th>Group</th>
                  <th>Transaction Description</th>
                  <th className="text-end">Amount (DR)</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-secondary py-5">
                      No records to show.
                    </td>
                  </tr>
                ) : (
                  <>
                    {records.map((record, index) => (
                      <tr key={`${record.transactionDateTime}-${record.licencePlateNo}-${index}`}>
                        <td>{record.transactionDateTime}</td>
                        <td>{record.processedDateTime}</td>
                        <td>{record.licencePlateNo}</td>
                        <td><span className="badge text-bg-primary">{record.group}</span></td>
                        <td>{record.transactionDescription}</td>
                        <td className="text-end amount-cell">{record.amountDr.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="table-total-row">
                      <td colSpan="4"></td>
                      <td>SUM</td>
                      <td className="text-end amount-cell">{totalAmount.toFixed(2)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
           <PdfTemplate
           records={records}
    statementMonth={statementMonth}
    totalETag={totalAmount}
    totalBuses={records.length}
    />
        </section>
      </div>
    </main>
  );
}

export default App;
