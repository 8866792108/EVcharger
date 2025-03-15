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
                            <span class="value">${date}</span>
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

module.exports = {
    AdminEmail
}