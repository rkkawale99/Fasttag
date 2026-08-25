import html2pdf from "html2pdf.js";

export function generatePdf() {

  const element = document.getElementById("pdf-content");

  const options = {

    margin: [40, 2, 2, 2],

    filename: "Marathi-Report.pdf",

    image: {
      type: "jpeg",
      quality: 1
    },

    html2canvas: {
      scale: 2
    },

    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }

  };

  html2pdf().set(options).from(element).save();

}