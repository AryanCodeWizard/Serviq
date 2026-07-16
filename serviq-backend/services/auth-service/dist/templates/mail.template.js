"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmailTemplate = void 0;
const sendmailTemplate = (fullName, newOtp) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;padding:40px;">
          <tr>
            <td align="center">
              <h1 style="color:#2563eb;margin:0;">KamWale</h1>
              <p style="color:#666;">Connecting Customers with Trusted Workers</p>
            </td>
          </tr>

          <tr>
            <td>
              <h2>Hello ${fullName}, 👋</h2>

              <p>
                Thank you for registering with <strong>KamWale</strong>.
                Please use the OTP below to verify your email address.
              </p>

              <div style="margin:35px 0;text-align:center;">
                <span style="
                  display:inline-block;
                  padding:18px 35px;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#2563eb;
                  border:2px dashed #2563eb;
                  border-radius:8px;
                  background:#eef4ff;">
                  ${newOtp}
                </span>
              </div>

              <p style="color:#dc2626;font-weight:bold;text-align:center;">
                ⏳ This OTP expires in 5 minutes.
              </p>

              <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

              <p>
                <strong>Security Tip:</strong> Never share your OTP with anyone.
                The KamWale team will never ask for your verification code.
              </p>

              <p>
                If you didn't request this OTP, please ignore this email.
              </p>

              <br>

              <p>
                Regards,<br>
                <strong>Team KamWale</strong><br>
                <small>Founded by Aryan Singh</small>
              </p>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};
exports.sendmailTemplate = sendmailTemplate;
