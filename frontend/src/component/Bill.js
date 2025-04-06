export const Template_Bill = (orderid, date, name, email, branch, price, slots, barcodereq = true) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });

    // Create a properly formatted QR code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(orderid)}`;

    // Create a unique ID for the barcode canvas
    const barcodeId = `barcode-${orderid.replace(/[^a-zA-Z0-9]/g, '')}`;

    // Create a direct barcode image URL as a fallback
    const barcodeImageUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(orderid)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&showtext=true&textposition=Bottom&textfont=Arial&fontsize=12&fontcolor=%23000000&backcolor=%23FFFFFF&codepage=&format=jpeg`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EV Charger - Bill</title>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .bill-container {
                max-width: 800px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 30px;
                position: relative;
                background-color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
            }
            .bill-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #3498db;
                padding-bottom: 20px;
                position: relative;
            }
            .bill-header h1 {
                color: #2c3e50;
                font-size: 32px;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .bill-header p {
                color: #7f8c8d;
                margin: 5px 0;
                font-size: 14px;
            }
            .bill-details {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 20px;
            }
            .bill-details .row, .amount-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 8px 0;
                border-bottom: 1px dashed #e0e0e0;
            }
            .bill-details .row:last-child, .amount-row:last-child {
                border-bottom: none;
            }
            .bill-details .row span:first-child {
                font-weight: 600;
                color: #34495e;
            }
            .total-amount {
                font-size: 22px;
                font-weight: bold;
                color: #27ae60;
                border-top: 2px solid #3498db;
                padding-top: 15px;
                margin-top: 10px;
            }
            .qr-code {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 100px;
                height: 100px;
                background-color: white;
                padding: 5px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .qr-code img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .barcode-container {
                text-align: center;
                margin: 25px 0;
                padding: 15px;
                border: 1px dashed #3498db;
                border-radius: 8px;
                background-color: #f8f9fa;
                page-break-inside: avoid;
            }
            .barcode-canvas {
                max-width: 100%;
                height: auto;
                margin-bottom: 10px;
                display: block;
                margin-left: auto;
                margin-right: auto;
                border: 1px solid #ddd;
                padding: 10px;
                background-color: white;
            }
            .barcode-image {
                max-width: 100%;
                height: auto;
                margin-bottom: 10px;
                display: block;
                margin-left: auto;
                margin-right: auto;
                border: 1px solid #ddd;
                padding: 10px;
                background-color: white;
            }
            .barcode-text {
                font-size: 14px;
                color: #7f8c8d;
                margin-top: 10px;
                font-style: italic;
            }
            .booked-slots {
                margin-top: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #3498db;
                page-break-inside: avoid;
            }
            .booked-slots h2 {
                color: #2c3e50;
                font-size: 18px;
                margin-bottom: 10px;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 8px;
            }
            .booked-slots ul {
                list-style-type: none;
            }
            .booked-slots li {
                padding: 8px 0;
                border-bottom: 1px dashed #e0e0e0;
            }
            .booked-slots li:last-child {
                border-bottom: none;
            }
            .bill-footer {
                text-align: center;
                margin-top: 30px;
                border-top: 1px solid #e0e0e0;
                padding-top: 15px;
                color: #7f8c8d;
                font-size: 14px;
            }
            .bill-footer p {
                margin: 5px 0;
            }
            .logo {
                display: inline-block;
                margin-bottom: 15px;
            }
            .logo img {
                height: 50px;
            }
            .watermark {
                position: absolute;
                bottom: 50%;
                right: 50%;
                transform: translate(50%, 50%) rotate(-45deg);
                font-size: 100px;
                opacity: 0.03;
                pointer-events: none;
                white-space: nowrap;
                color: #000;
                font-weight: bold;
            }
            .bill-id {
                position: absolute;
                top: 20px;
                left: 20px;
                font-size: 12px;
                color: #95a5a6;
            }
            .bill-date {
                position: absolute;
                top: 40px;
                left: 20px;
                font-size: 12px;
                color: #95a5a6;
            }
            .barcode-wrapper {
                display: flex;
                color: black;
                flex-direction: column;
                position: relative;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
            @media print {
                body {
                    background-color: white;
                }
                .bill-container {
                    box-shadow: none;
                    border: none;
                }
                .barcode-canvas, .barcode-image {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                }
                .booked-slots {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
                .booked-slots h2 {
                    page-break-after: avoid;
                    break-after: avoid;
                }
                .booked-slots ul {
                    page-break-before: avoid;
                    break-before: avoid;
                }
                .booked-slots li {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            }
        </style>
    </head>
    <body>
        <div class="bill-container">
            <div class="watermark">EV CHARGER</div>
            <div class="bill-id">Bill ID: ${orderid.slice(-8)}</div>
            <div class="bill-date">${formattedDate}</div>
            
            <div class="bill-header">
                <div class="logo">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" class="text-2xl text-green-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"></path></svg>
                </div>
                <h1>EV CHARGER</h1>
                <p>123 Energy Street, Green City, 12345</p>
                <p>Phone: (123) 456-7890 | Email: support@evcharger.com</p>
                <p>GST No: 12ABCDE3456F7Z8</p>
            </div>
            
            <div class="qr-code">
                <img src="${qrCodeUrl}" alt="QR Code">
            </div>
            
            <div class="bill-details">
                <div class="row"><span>Order Id:</span> <span id="orderid">${orderid}</span></div>
                <div class="row"><span>Date:</span> <span id="date">${formattedDate}</span></div>
                <div class="row"><span>Customer Name:</span> <span id="customerName">${name}</span></div>
                <div class="row"><span>Email:</span> <span id="email">${email}</span></div>
                <div class="row"><span>Branch:</span> <span id="branch">${branch}</span></div>
            </div>
            
            <div class="barcode-container">
            ${barcodereq
            ? `<img src="${barcodeImageUrl}" alt="Barcode" class="barcode-image" style="display: none;"/>`
            : `<div class="barcode-wrapper">
                <div style="display: flex; justify-content: center;padding-bottom: 10px;background-color: white;width:576px;">
                    <img src="./src/assets/img/barcode.png" alt="Barcode" class="barcode-image" style="width:576px;border: none !important;outline: none !important;box-shadow: none !important;background: transparent !important;" />
                </div>
                <span style="top: -38px;position: relative;">${orderid}</span>
            </div>`
        }
                <div class="barcode-text">Scan to view order details</div>
            </div>
            
            <div class="booked-slots">
                <h2>Booked Slots</h2>
                <ul id="slotList">
                    ${slots.map(slot => `<li>${slot.start} - ${slot.end}</li>`).join('')}
                </ul>
            </div>
            <div class="amount-row total-amount">
                <span>Total Amount</span>
                <span id="totalAmount">₹${price}</span>
            </div>
            
            <div class="bill-footer">
                <p>Thank you for choosing EV Charger!</p>
                <p>This is a computer-generated bill and does not require a signature.</p>
            </div>
        </div >

    // <script>
    //         // Generate barcode when the document is loaded
    //     document.addEventListener('DOMContentLoaded', function() {
    //             try {
    //         // Try to generate barcode using JsBarcode
    //         JsBarcode("#${barcodeId}", "${orderid}", {
    //             format: "CODE128",
    //             width: 2,
    //             height: 100,
    //             displayValue: true,
    //             fontSize: 14,
    //             margin: 10,
    //             background: "#ffffff",
    //             lineColor: "#000000",
    //             font: "monospace"
    //         });
    //             } catch (e) {
    //         console.error("Barcode generation error:", e);
    //     document.querySelector('.barcode-image').style.display = 'block';
    //             }
    //         });
    // </script>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        ${barcodereq === false
            ? `
        try {
            JsBarcode("#${barcodeId}", "${orderid}", {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10,
                background: "#ffffff",
                lineColor: "#000000",
                font: "monospace"
            });
        } catch (e) {
            console.error("Barcode generation error:", e);
        }
        `
            : `src/assets/img/barcode.png`}
    });
</script>
    </body >
    </html >
    `;
}
