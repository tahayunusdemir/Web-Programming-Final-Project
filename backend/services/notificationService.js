/**
 * @desc    Simulate sending a credit notification email to a client
 * @param   {object} client - The client user object
 * @param   {number} creditsAwarded - The number of credits awarded
 */
const sendCreditNotification = (client, creditsAwarded) => {
    const message = `
    --------------------------------------------------
    [EMAIL SIMULATION]
    To: ${client.email}
    Subject: Your Monthly Energy Credits Have Been Awarded!

    Hello ${client.username},

    You have been awarded ${creditsAwarded.toFixed(2)} credits for your energy production this month.
    Your new credit balance is ${client.credits.toFixed(2)}.

    Thank you for being a part of our green energy community!
    --------------------------------------------------
    `;
    console.log(message);
};

module.exports = {
    sendCreditNotification,
}; 