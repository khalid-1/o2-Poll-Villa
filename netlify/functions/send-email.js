
import { Resend } from 'resend';

export const handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { name, email, message } = JSON.parse(event.body);

    if (!process.env.RESEND_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Missing Resend API Key' }),
        };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'O2 Pool Villa <onboarding@resend.dev>', // Update this to your verified domain later: e.g., contact@o2poolvilla.com
            to: ['reservations@o2poolvilla.com'], // The admin email receiving the messages
            reply_to: email, // Validated email from the form
            subject: `New Inquiry from ${name}`,
            html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!', data }),
        };
    } catch (error) {
        console.error('Server Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
