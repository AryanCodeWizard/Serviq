export const sendmailTemplate = (fullName: string, newOtp: number) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - KamWale</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 100%);font-family:'Inter',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 100%);padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;padding:50px 45px;box-shadow:0 20px 60px rgba(37,99,235,0.15);border:1px solid rgba(37,99,235,0.08);">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <div style="display:inline-flex;align-items:center;gap:12px;background:linear-gradient(135deg, #2563eb, #1d4ed8);padding:12px 30px;border-radius:50px;box-shadow:0 4px 15px rgba(37,99,235,0.3);">
                <span style="font-size:28px;color:#fff;font-weight:800;letter-spacing:-0.5px;">KamWale</span>
                <span style="color:#93bbfc;font-weight:300;">✦</span>
                <span style="color:#93bbfc;font-size:13px;font-weight:500;">Connect</span>
              </div>
              <p style="color:#64748b;margin:12px 0 0 0;font-size:15px;font-weight:400;">Connecting Customers with Trusted Workers</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td>
              <div style="height:2px;background:linear-gradient(to right, transparent, #2563eb, transparent);margin:5px 0 30px 0;"></div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td>
              <h2 style="color:#1e293b;font-size:26px;font-weight:700;margin:0 0 8px 0;letter-spacing:-0.3px;">
                Hello ${fullName}! 👋
              </h2>
              <p style="color:#475569;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
                Thank you for choosing <strong style="color:#2563eb;">KamWale</strong>. 
                Please use the verification code below to complete your registration.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td>
              <div style="background:linear-gradient(135deg, #f8faff, #eef4ff);border-radius:16px;padding:30px;margin:10px 0 25px 0;border:2px solid #dbeafe;position:relative;overflow:hidden;">
                <!-- Decorative elements -->
                <div style="position:absolute;top:-30px;right:-30px;width:100px;height:100px;background:radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%);border-radius:50%;"></div>
                <div style="position:absolute;bottom:-40px;left:-40px;width:120px;height:120px;background:radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%);border-radius:50%;"></div>
                
                <p style="color:#475569;font-size:14px;font-weight:500;margin:0 0 15px 0;text-align:center;letter-spacing:1px;text-transform:uppercase;">
                  ✦ Verification Code ✦
                </p>
                
                <div style="text-align:center;position:relative;z-index:1;">
                  <span style="
                    display:inline-block;
                    padding:20px 45px;
                    font-size:42px;
                    font-weight:800;
                    letter-spacing:10px;
                    color:#1e293b;
                    background:#ffffff;
                    border-radius:12px;
                    border:2px solid #2563eb;
                    box-shadow:0 4px 20px rgba(37,99,235,0.15);
                    font-family:'Inter',monospace;
                    min-width:200px;
                  ">
                    ${newOtp}
                  </span>
                </div>
                
                <div style="text-align:center;margin-top:18px;position:relative;z-index:1;">
                  <span style="display:inline-flex;align-items:center;gap:8px;background:#fef2f2;color:#dc2626;padding:8px 20px;border-radius:50px;font-size:13px;font-weight:600;border:1px solid #fecaca;">
                    ⏳ Expires in <span style="color:#b91c1c;font-weight:700;">5 minutes</span>
                  </span>
                </div>
              </div>
            </td>
          </tr>

          <!-- Instructions -->
          <tr>
            <td>
              <div style="background:#f8fafc;border-radius:12px;padding:20px 25px;margin:5px 0 25px 0;border-left:4px solid #2563eb;">
                <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
                  <strong style="color:#1e293b;">📌 How to verify:</strong><br>
                  Enter this code on the verification page to activate your account. 
                  If you didn't request this, please ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Security Tip -->
          <tr>
            <td>
              <div style="background:#fffbeb;border-radius:12px;padding:18px 22px;margin:0 0 25px 0;border:1px solid #fde68a;">
                <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;display:flex;align-items:flex-start;gap:10px;">
                  <span style="font-size:18px;">🔒</span>
                  <span>
                    <strong>Security Tip:</strong> Never share your OTP with anyone. 
                    KamWale will never ask for your verification code via phone or email.
                  </span>
                </p>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td>
              <div style="height:1px;background:linear-gradient(to right, transparent, #e2e8f0, transparent);margin:10px 0 25px 0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <div style="text-align:center;">
                <p style="color:#64748b;font-size:14px;margin:0 0 5px 0;line-height:1.8;">
                  Need help? Contact us at 
                  <a href="mailto:support@kamwale.com" style="color:#2563eb;text-decoration:none;font-weight:500;">support@kamwale.com</a>
                </p>
                <p style="color:#94a3b8;font-size:13px;margin:0;">
                  Regards,<br>
                  <strong style="color:#1e293b;font-size:15px;">Team KamWale</strong><br>
                  <span style="font-size:12px;color:#94a3b8;">Founded by Aryan Singh</span>
                </p>
                
                <!-- Social Links Placeholder -->
                <div style="margin-top:20px;display:flex;justify-content:center;gap:15px;">
                  <span style="color:#94a3b8;font-size:20px;">📱</span>
                  <span style="color:#94a3b8;font-size:20px;">🐦</span>
                  <span style="color:#94a3b8;font-size:20px;">📷</span>
                  <span style="color:#94a3b8;font-size:20px;">💼</span>
                </div>
                
                <p style="color:#cbd5e1;font-size:11px;margin:15px 0 0 0;">
                  © 2026 KamWale. All rights reserved.
                </p>
              </div>
            </td>
          </tr>

        </table>

        <!-- Footer note -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top:20px;">
          <tr>
            <td align="center">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                This email was sent to verify your KamWale account.
              </p>
              <p style="color:#cbd5e1;font-size:11px;margin:5px 0 0 0;">
                KamWale • Building Trust, One Connection at a Time
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
}