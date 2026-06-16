import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner() {

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      }
    );

    scanner.render(success, error);

    function success(result) {
      alert("Scanned Successfully: " + result);
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear().catch(error => console.error(error));
    };

  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>QR Scanner</h2>

      <div id="reader"></div>
    </div>
  );
}

export default QRScanner;