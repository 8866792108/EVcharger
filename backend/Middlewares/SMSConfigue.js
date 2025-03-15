const accountSid = process.env.ACCOUNTID
const authToken = process.env.AUTHTOKEN
const client = require('twilio')(accountSid, authToken);

const SendSMS = async (email, transaction, method, slots) => {
    try {
        const slotDetails = slots.map(slot => `${slot.start} - ${slot.end}`).join(", ");
        const smsBody = `Your EV slot booking is confirmed! \n - Email: ${email} \n - Transaction ID: ${transaction} \n - Payment Method: ${method} \n - Slot Timings: ${slotDetails} \n Thank you for choosing us!`;

        const message = await client.messages.create({
            body: smsBody,
            from: '+16576082492',
            to: '+919173228399'
        });

        console.log("Message Sent Successfully:", message.sid);
    } catch (error) {
        console.error("Twilio SMS Error:", error.message);
    }
};

module.exports = { SendSMS };
