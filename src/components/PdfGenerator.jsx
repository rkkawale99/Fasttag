import { generateStatementPdf } from '../utils/pdfGenerator.js';
import { generatePdf } from '../utils/GenerateParishit.js';


function PdfGenerator({ records, statementMonth, disabled, onSuccess, onError }) {
  const handleGeneratePdf = () => {
    if (!records.length) {
      onError('No SRGD records found. Please upload a valid Excel file first.');
      return;
    }

    try {
      generateStatementPdf(records, statementMonth);
      onSuccess();
    } catch (error) {
      onError(error.message || 'PDF generation failed.');
    }
  };
   const handleAppendixPdf = () => {
    if (!records.length) {
      onError('No SRGD records found. Please upload a valid Excel file first.');
      return;
    }

    try {
      generatePdf(records, statementMonth);
      onSuccess();
    } catch (error) {
      console.log(error);
      
      onError(error.message || 'PDF generation failed.');
    }
  };

  return (
    <>
    <button
      type="button"
      className="btn btn-primary btn-lg px-4"
      onClick={handleGeneratePdf}
      disabled={disabled || records.length === 0}
    >
      Generate Statement PDF
    </button><button
      type="button"
      className="btn btn-primary btn-lg px-4"
      onClick={handleAppendixPdf}
      disabled={disabled || records.length === 0}
    >
      Generate Appendix PDF
    </button>
   
    </>
    
  );
}

export default PdfGenerator;
