import React from "react";
import "./PdfTemplate.css";

const PdfTemplate = ({
  records = [],
  statementMonth = "एप्रिल २०२६",
  totalETag = 0,
  totalBuses = 0,
}) => {
    
    let sum = (text)=>{
        return records
  .filter(record =>
    record.transactionDescription?.toLowerCase().includes(text.toLowerCase())
  )
  .reduce((sum, record) => sum + Number(record.amountDr || 0), 0);
    }
    console.log(records);
    
       let count = (text)=>{
        return records
  .filter(record =>
    record.transactionDescription?.toLowerCase().includes(text.toLowerCase())
  ).length;
    }

    const totalsum =
  sum("sinner") +
  sum("undri") +
  sum("vaidyakinhi") +
  sum("nimgaon") +
  sum("banpimpri");

const totalcount =
  count("sinner") +
  count("undri") +
  count("vaidyakinhi") +
  count("nimgaon") +
  count("banpimpri");
    const routes = [
  {
    route: "श्रीगोंदा-नाशिक",
    isETagAccepted: "येतो",
    eTagPlazaName: "सिन्नर टोल प्लाझा",
    eTagAmount: sum("sinner"),
    isCashAccepted: "येतो",
    cashPlazaName: "सिन्नर टोल प्लाझा",
    cashAmount: null,
    busCount: count("sinner")
  },
  {
    route: "श्रीगोंदा-शेगाव",
    isETagAccepted: "येतो",
    eTagPlazaName: "उंदरी टोल प्लाझा",
    eTagAmount:  sum("Undri"),
    isCashAccepted: "येतो",
    cashPlazaName: "उंदरी टोल प्लाझा",
    cashAmount: null,
    busCount: totalcount + count("Undri")
  },
  {
    route: "श्रीगोंदा-लातूर",
    isETagAccepted: "येतो",
    eTagPlazaName: "वैद्यकिन्ही टोल प्लाझा",
    eTagAmount: sum("Vaidyakinhi"),
    isCashAccepted: "येतो",
    cashPlazaName: "वैद्यकिन्ही टोल प्लाझा",
    cashAmount: null,
    busCount:  count("Vaidyakinhi")
  },
  {
    route: "श्रीगोंदा-दौंड-पुणे",
    isETagAccepted: "येतो",
    eTagPlazaName: "निमगाव खलु टोल प्लाझा",
    eTagAmount: sum("Nimgaon"),
    isCashAccepted: "येतो",
    cashPlazaName: "निमगाव खलु टोल प्लाझा",
    cashAmount: null,
    busCount: count("Nimgaon")
  },
  {
    route: "अहिल्यानगर-कर्जत",
    isETagAccepted: "येतो",
    eTagPlazaName: "बनपिंपरी टोल प्लाझा",
    eTagAmount:  sum("Banpimpri"),
    isCashAccepted: "येतो",
    cashPlazaName: "बनपिंपरी टोल प्लाझा",
    cashAmount: null,
    busCount:  count("Banpimpri")
  },
  {
    route: "विशेष बस सेवा, जादा",
    isETagAccepted: "येतो",
    eTagPlazaName: "खालापूर/तळेगाव/घोटी टोल प्लाझा",
    eTagAmount: totalETag - totalsum,
    isCashAccepted: "येतो",
    cashPlazaName: "खालापूर/तळेगाव/घोटी टोल प्लाझा",
    cashAmount: null,
    busCount: totalBuses - totalcount
  },
  {
    route: "मालवाहतूक ट्रक",
    isETagAccepted: "येतो",
    eTagPlazaName: "खालापूर/तळेगाव/घोटी टोल प्लाझा",
    eTagAmount: null,
    isCashAccepted: "येतो",
    cashPlazaName: "खालापूर/तळेगाव/घोटी टोल प्लाझा",
    cashAmount: null,
    busCount: null
  }
];

    const marathiMonths = {
  January: "जानेवारी",
  February: "फेब्रुवारी",
  March: "मार्च",
  April: "एप्रिल",
  May: "मे",
  June: "जून",
  July: "जुलै",
  August: "ऑगस्ट",
  September: "सप्टेंबर",
  October: "ऑक्टोबर",
  November: "नोव्हेंबर",
  December: "डिसेंबर",
};

const marathiDigits = {
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

function convertToMarathiDate(text) {
    console.log(text);
    

  const [month, year] = text.split(" ");

  const marathiMonth = marathiMonths[month] || month;
let marathiYear = "null"
if(year){
       marathiYear = year
    .split("")
    .map((digit) => marathiDigits[digit] || digit)
    .join("");
}

  return `${marathiMonth} ${marathiYear}`;
}


  return (
    <div className="invoice-container" id="pdf-content">
       <div className="d-flex justify-content-center flex-column">
         <div className="d-flex justify-content-center">
          <strong>परिशिष्ट - १</strong>
        </div>
      <div className="meta-header d-flex justify-content-between mx-5">
        <div>
          <strong>रा.प. श्रीगोंदा आगार</strong>
        </div>

        <div>माहे-{convertToMarathiDate(statementMonth)}</div>
      </div>
       </div>

      <table>
        <thead>
          <tr>
            <th>मार्ग</th>

            <th>
              ई-टॅग द्वारे
              <br />
              पथकर भरण्यात
              <br />
              येतो किंवा नाही
            </th>

            <th>
              पथकर नाक्याचे नाव व
              <br />
              पथकर नाका कोणाच्या
              <br />
              अधिपत्याखाली येतो
            </th>

            <th>
              ई-टॅग द्वारे
              <br />
              भरण्यात आलेली
              <br />
              एकूण रक्कम
            </th>

            <th>
              रोखीने पथकर
              <br />
              भरण्यात येतो की
              <br />
              नाही
            </th>

            <th>
              पथकर नाक्याचे नाव व
              <br />
              पथकर नाका कोणाच्या
              <br />
              अधिपत्याखाली येतो
            </th>

            <th>
              रोखीने भरण्यात
              <br />
              आलेली एकूण
              <br />
              रक्कम
            </th>

            <th>
              बस
              <br />
              संख्या
            </th>
          </tr>
        </thead>

        <tbody>
          {routes.map((row, index) => (
            <tr key={index}>
              <td>{row.route}</td>

              <td className="center-text">{row.isETagAccepted}</td>

              <td>{row.eTagPlazaName}</td>

              <td className="right-text">{Math.ceil(row.eTagAmount)}</td>

              <td className="center-text">{row.isCashAccepted}</td>

              <td>{row.cashPlazaName}</td>

              <td className="right-text">{row.cashAmount}</td>

              <td className="right-text">{row.busCount}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="total-row">
            <td className="center-text" colSpan={3}>एकूण</td>

           

            <td className="right-text">{Math.ceil(totalETag)}</td>

            <td></td>

            <td></td>

            <td></td>

            <td className="right-text">{totalBuses}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PdfTemplate;