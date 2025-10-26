
export function GenerateCreateAccountHtml ( otp: number ) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { margin: 0; padding: 20px; font-family: Arial; background: #f4f4f4; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; text-align: center; }
            .otp { font-size: 42px; font-weight: bold; color: #2563eb; margin: 25px 0; letter-spacing: 8px; }
            @media (max-width: 500px) { .container { padding: 20px; } .otp { font-size: 32px; letter-spacing: 6px; } }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Your Verification Code</h2>
            <p>Use this code to complete your verification:</p>
            <div class="otp">${otp}</div>
            <p><small>This code expires in 10 minutes.</small></p>
        </div>
    </body>
    </html>
  `;
}