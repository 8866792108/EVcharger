const AdminEmail = (email, orderId, branchId, date, amount, method, transaction, slots) => {

    const dateObj = new Date(date);

    // Format the date as "Month DD YYYY"
    const formattedDate = dateObj.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });

    const Admin_Template_Email = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
<style>
/* General Styles */
body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    margin: 0;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* Email Template */
.email-template {
    max-width: 600px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.email-container {
    padding: 2rem;
}

/* Header */
.email-header {
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 2px solid #eee;
}

.email-header h1 {
    color: #2c3e50;
    font-size: 2rem;
}

.date {
    color: #666;
    font-size: 0.9rem;
}

/* Content */
.email-content {
    padding: 2rem 0;
}

.greeting h2 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

/* Details Box */
.order-details,
.payment-details,
.time-slots {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 6px;
}

/* Section Titles */
h3 {
    color: #2c3e50;
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

/* Details Grid */
.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
}

.label {
    color: #666;
    font-size: 0.9rem;
}

.value {
    color: #2c3e50;
    font-weight: bold;
}

.amount {
    color: #27ae60;
    font-size: 1.2rem;
    font-weight: bold;
}

.status {
    color: red;
    font-weight: bold;
}

/* Time Slots */
.slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
}

.slot-item {
    background: #fff;
    padding: 0.75rem;
    border-radius: 4px;
    text-align: center;
    border: 1px solid #ddd;
    font-weight: 500;
}

/* Footer */
.email-footer {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 2px solid #eee;
    color: #666;
}

.small {
    font-size: 0.8rem;
    margin-top: 0.5rem;
}
</style>
</head>
<body>

    <div class="email-template">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <h1>Payment Confirmation</h1>
                <p class="date">${formattedDate}</p>
            </div>

            <!-- Main Content -->
            <div class="email-content">
                <div class="greeting">
                    <h2>Dear User,</h2>
                    <p>Your payment has been successfully processed. Below are your booking details:</p>
                </div>

                <!-- Order Details -->
                <div class="order-details">
                    <h3>Booking Details</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="label">Email:</span>
                            <span class="value">${email}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Order ID:</span>
                            <span class="value">${orderId}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Branch:</span>
                            <span class="value">Ev Branch ${branchId}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Date:</span>
                            <span class="value">${formattedDate}</span>
                        </div>
                    </div>
                </div>

                <!-- Payment Details -->
                <div class="payment-details">
                    <h3>Payment Information</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="label">Amount:</span>
                            <span class="value amount">₹${amount}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Payment Method:</span>
                            <span class="value">${method}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Transaction ID:</span>
                            <span class="value">${transaction}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Status:</span>
                            <span class="value status">Pending</span>
                        </div>
                    </div>
                </div>

                <!-- Time Slots -->
                <div class="time-slots">
                    <h3>Selected Time Slots</h3>
                    <div class="slots-grid">
                        ${slots.map(slot => `<div class="slot-item">${slot.start + "-" + slot.end}</div>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <p>Thank you for choosing EV Charger System!</p>
                <p class="small">If you have any issues, contact our support team.</p>
            </div>
        </div>
    </div>

</body>
</html>
`;

    return Admin_Template_Email;
}

const AcceptedPayment = (order) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: #0073e6;
                color: #ffffff;
                text-align: center;
                padding: 15px;
                font-size: 22px;
                font-weight: bold;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                color: #333;
                text-align: left;
            }
            .details {
                background: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-top: 10px;
            }
            .details div {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 16px;
                border-bottom: 1px solid #ddd;
            }
            .details div:last-child {
                border-bottom: none;
            }
            .details span {
                font-weight: bold;
                color: #0073e6;
            }
            .details div {
                justify-content: space-between;
            }
            .amount {
                font-size: 20px;
                font-weight: bold;
                color: #27ae60;
                margin-top: 15px;
                text-align: center;
            }
            .slots {
                margin-top: 15px;
            }
            .slot-item {
                background: #e6f7ff;
                padding: 10px;
                border-radius: 4px;
                margin: 5px 0;
                font-size: 14px;
                text-align: center;
                font-weight: bold;
                color: #333;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
            .footer a {
                color: #0073e6;
                text-decoration: none;
                font-weight: bold;
            }
            .btn {
                display: block;
                text-align: center;
                background: #0073e6;
                color: #ffffff;
                padding: 12px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin-top: 20px;
            }
            @media screen and (max-width: 600px) {
                .email-container {
                    width: 90%;
                }
                .content, .details {
                    padding: 10px;
                }
            }
        </style>
    </head>
    <body>

        <div class="email-container">
            <div class="header">
                Payment Confirmation ✅
            </div>

            <div class="content">
                <p>Dear Customer,</p>
                <p>Your payment for the EV charger booking has been successfully received. Here are your order details:</p>
                
                <div class="details">
                    <div><span>Order ID:</span> <strong>${order._id}</strong></div>
                    <div><span>Transaction ID:</span> <strong>${order.transaction}</strong></div>
                    <div><span>Payment Method:</span> <strong>${order.method === "gpay" ? "Google Pay" : order.method}</strong></div>
                    <div><span>Status:</span> <strong>${order.status}</strong></div>
                </div>

                <div class="amount">
                    Total Paid: ₹${order.price}
                </div>

                <div class="slots">
                    <strong>Booked Slots:</strong>
                    ${order.slots.map(slot => `<div class="slot-item">${slot.start} - ${slot.end}</div>`).join('')}
                </div>

                <a href="http://localhost:5173/orders" class="btn">View Order Details</a>
            </div>

            <div class="footer">
                <p>Thank you for choosing EV Charger! 🚀</p>
                <p><a href="http://localhost:5173/contact">Contact Support</a> | <a href="http://localhost:5173">Visit Website</a></p>
            </div>
        </div>

    </body>
    </html>
    `;
};
const RejectedPayment = (order) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Rejected</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            background: #ff4d4d;
            padding: 15px;
            color: #fff;
            font-size: 22px;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 20px;
            color: #333;
        }
        .content p {
            font-size: 16px;
            margin: 10px 0;
        }
        .transaction-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            text-align: left;
            margin-top: 15px;
        }
        .transaction-details .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        .detail-row {
            justify-content: space-between;
        }
        .transaction-details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
        .slots {
            margin-top: 15px;
        }
        .slot-item {
            background: #e6f7ff;
            padding: 10px;
            border-radius: 4px;
            margin: 5px 0;
            font-size: 14px;
            text-align: center;
            font-weight: bold;
            color: #333;
        }
        .contact-btn {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background: #ff4d4d;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .contact-btn:hover {
            background: #e60000;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">Payment Rejected</div>
        <div class="content">
            <p>Dear User,</p>
            <p>Unfortunately, your payment for the EV slot booking has been rejected due to an incorrect transaction ID.</p>
            <div class="transaction-details">
                <div class="detail-row"><strong>Transaction ID:</strong> <span>${order.transaction}</span></div>
                <div class="detail-row"><strong>Payment Method:</strong> <span>${order.method}</span></div>
                <div class="detail-row"><strong>Amount:</strong> <span>₹${order.price}</span></div>
                <div class="detail-row"><strong>Booking Date:</strong> <span>${order.date}</span></div>
                <div class="slots">
                    <strong>Booked Slots:</strong>
                    ${order.slots.map(slot => `<div class="slot-item">${slot.start} - ${slot.end}</div>`).join('')}
                </div>
            </div>
            <p>Please verify your transaction details and try again.</p>
            <a href="http://localhost:5173/contact" class="contact-btn">Contact Support</a>
        </div>
        <div class="footer">If you did not attempt this payment, please ignore this email.</div>
    </div>
</body>
</html>`;
};

const RequestAccept = (Request) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Service Request Accepted</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin: auto;
            border-top: 5px solid #007bff;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 15px;
        }
        .info-card {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: left;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-title {
            font-weight: bold;
            color: #444;
        }
        .info-value {
            color: #666;
        }
        .status {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
            background: #eaffea;
            padding: 12px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .button-container {
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 6px;
            text-decoration: none;
            transition: background 0.3s ease;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">🎉 Service Request Approved</div>
        <div class="info-card">
            <div class="info-row"><span class="info-title">Owner:</span><span class="info-value">${Request.ownerName}</span></div>
            <div class="info-row"><span class="info-title">Business:</span><span class="info-value">${Request.businessName}</span></div>
            <div class="info-row"><span class="info-title">Location:</span><span class="info-value">${Request.stationLocation}</span></div>
            <div class="info-row"><span class="info-title">Contact:</span><span class="info-value">${Request.contactNumber}</span></div>
            <div class="info-row"><span class="info-title">Email:</span><span class="info-value">${Request.email}</span></div>
            <div class="info-row"><span class="info-title">Station Type:</span><span class="info-value">${Request.stationType}</span></div>
            <div class="info-row"><span class="info-title">Ports:</span><span class="info-value">${Request.numberOfPorts}</span></div>
            <div class="info-row"><span class="info-title">Additional Info:</span><span class="info-value">${Request.additionalInfo}</span></div>
        </div>
        <div class="status">✅ Status: ${Request.status}</div>
        <div class="button-container">
            <a href="https://api.whatsapp.com/send?phone=9173228399" class="button">Contact Us</a>
        </div>
        <div class="footer">&copy; 2025 EVCharge Services. All rights reserved.</div>
    </div>
</body>
</html>`;
};


const RequestReject = (Request) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Service Request Rejected</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin: auto;
            border-top: 5px solid #dc3545;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #dc3545;
            margin-bottom: 15px;
        }
        .info-card {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: left;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-title {
            font-weight: bold;
            color: #444;
        }
        .info-value {
            color: #666;
        }
        .status {
            font-size: 18px;
            font-weight: bold;
            color: #dc3545;
            background: #ffe5e5;
            padding: 12px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">❌ Service Request Rejected</div>
        <div class="info-card">
            <div class="info-row"><span class="info-title">Owner:</span><span class="info-value">${Request.ownerName}</span></div>
            <div class="info-row"><span class="info-title">Business:</span><span class="info-value">${Request.businessName}</span></div>
            <div class="info-row"><span class="info-title">Location:</span><span class="info-value">${Request.stationLocation}</span></div>
            <div class="info-row"><span class="info-title">Contact:</span><span class="info-value">${Request.contactNumber}</span></div>
            <div class="info-row"><span class="info-title">Email:</span><span class="info-value">${Request.email}</span></div>
            <div class="info-row"><span class="info-title">Station Type:</span><span class="info-value">${Request.stationType}</span></div>
            <div class="info-row"><span class="info-title">Ports:</span><span class="info-value">${Request.numberOfPorts}</span></div>
            <div class="info-row"><span class="info-title">Additional Info:</span><span class="info-value">${Request.additionalInfo}</span></div>
        </div>
        <div class="status">❌ Status: Rejected</div>
        <div class="footer">&copy; 2025 EVCharge Services. All rights reserved.</div>
    </div>
</body>
</html>`;
};


module.exports = {
    AdminEmail,
    AcceptedPayment,
    RejectedPayment,
    RequestAccept,
    RequestReject
}