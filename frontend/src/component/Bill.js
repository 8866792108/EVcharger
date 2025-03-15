export const Template_Bill = (orderid, date, name, email, branch, price, slots) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EV Charger - Bill</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                padding: 20px;
            }
            .bill-container {
                max-width: 800px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 30px;
                position: relative;
            }
            .bill-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
            }
            .bill-header h1 {
                color: #2c3e50;
                font-size: 28px;
            }
            .bill-details .row, .amount-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            .total-amount {
                font-size: 20px;
                font-weight: bold;
                color: #27ae60;
                border-top: 2px solid #333;
                padding-top: 10px;
            }
            .qr-code {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 100px;
                height: 100px;
            }
            .booked-slots {
                margin-top: 20px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 4px;
            }
            .bill-footer {
                text-align: center;
                margin-top: 30px;
                border-top: 1px solid #ddd;
                padding-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="bill-container">
            <div class="bill-header">
                <h1>EV CHARGER</h1>
                <p>123 Energy Street, Green City, 12345</p>
                <p>Phone: (123) 456-7890 | Email: support@evcharger.com</p>
                <p>GST No: 12ABCDE3456F7Z8</p>
            </div>
            
            <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderid}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            
            <div class="bill-details">
                <div class="row"><span>Order Id:</span> <span id="orderid">${orderid}</span></div>
                <div class="row"><span>Date:</span> <span id="date">${formattedDate}</span></div>
                <div class="row"><span>Customer Name:</span> <span id="customerName">${name}</span></div>
                <div class="row"><span>Email:</span> <span id="email">${email}</span></div>
                <div class="row"><span>Branch:</span> <span id="branch">${branch}</span></div>
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
            </div>
        </div>
    </body>
    </html>
    `;
}
