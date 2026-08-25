function UploadFile({ selectedFile, isLoading, onFileSelect }) {
  const handleChange = (event) => {
    onFileSelect(event.target.files?.[0] || null);
    event.target.value = '';
  };

  return (
    <div className="upload-card">
      <label htmlFor="fastag-file" className="form-label fw-semibold">Upload Excel FASTag statement</label>
      <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
        <input
          id="fastag-file"
          className="form-control form-control-lg"
          type="file"
          accept=".xls,.xlsx"
          onChange={handleChange}
          disabled={isLoading}
        />
        <div className="selected-file text-md-end">
          <span className="d-block text-secondary small">Selected file</span>
          <strong>{selectedFile?.name || 'No file selected'}</strong>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
