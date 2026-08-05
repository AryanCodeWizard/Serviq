"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmailTemplate = void 0;
const sendmailTemplate = (fullName, newOtp) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Serviq • Verify your account</title>
  <!-- Google Fonts (Inter + plus subtle accents) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
  <style>
    /* Reset & base */
    * { margin:0; padding:0; box-sizing:border-box; }
    body { margin:0; padding:0; background:#f3f6fd; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    table { border-collapse:collapse; mso-table-lspace:0; mso-table-rspace:0; }
    td, th { padding:0; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    .body-bg { background:radial-gradient(ellipse at 20% 30%, #f0f5ff, #e3eaf9); padding:48px 0; }
    .card { background:#ffffff; border-radius:40px; box-shadow:0 40px 80px -24px rgba(0,20,50,0.25), 0 12px 28px rgba(0,0,0,0.02); padding:52px 44px; border:1px solid rgba(255,255,255,0.4); backdrop-filter:blur(2px); transition: all 0.2s; }
    @media only screen and (max-width: 600px) {
      .card { padding:32px 20px !important; border-radius:28px !important; }
      .otp-code { font-size:34px !important; padding:16px 20px !important; letter-spacing:8px !important; min-width:auto !important; }
      .header-brand { padding:10px 20px !important; font-size:22px !important; }
      .badge-chip { padding:10px 18px !important; }
    }
    /* subtle glow */
    .glow-ring { box-shadow: 0 0 0 1px rgba(255,255,255,0.5), 0 20px 50px -12px rgba(0,50,120,0.12); }
  </style>
</head>
<body style="margin:0;padding:0;background:#f3f6fd;font-family:'Inter',Arial,sans-serif;">

<!-- MAIN WRAPPER -->
<table width="100%" cellpadding="0" cellspacing="0" class="body-bg" style="background:radial-gradient(ellipse at 20% 30%, #f0f5ff, #e3eaf9);padding:48px 0;">
  <tr>
    <td align="center">

      <!-- CARD CONTAINER -->
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td>

            <!-- Main Card -->
            <table width="100%" cellpadding="0" cellspacing="0" class="card" style="background:#ffffff;border-radius:40px;box-shadow:0 40px 80px -24px rgba(0,20,50,0.25),0 12px 28px rgba(0,0,0,0.02);padding:52px 44px;border:1px solid rgba(255,255,255,0.4);">

              <!-- ===== HEADER : modern brand ===== -->
              <tr>
                <td style="padding-bottom:26px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <!-- brand chip with gradient & glow -->
                        <div style="display:inline-block;background:linear-gradient(135deg, #0b1f3b, #1d3b6b);padding:12px 32px;border-radius:100px;box-shadow:0 10px 24px -6px rgba(11,31,59,0.25);border:1px solid rgba(255,255,255,0.08);">
                          <span style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Serviq</span>
                          <span style="color:rgba(255,255,255,0.5);font-weight:300;margin:0 8px;">|</span>
                          <span style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;letter-spacing:0.3px;">verify</span>
                        </div>
                        <p style="color:#4a617c;margin:16px 0 0 0;font-size:15px;font-weight:400;letter-spacing:0.2px;">modern service • trusted professionals</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- ===== DIVIDER (glass) ===== -->
              <tr>
                <td style="padding-bottom:26px;">
                  <div style="height:2px;background:linear-gradient(to right, rgba(11,31,59,0), #1d3b6b, rgba(11,31,59,0));opacity:0.3;"></div>
                </td>
              </tr>

              <!-- ===== GREETING ===== -->
              <tr>
                <td style="padding-bottom:12px;">
                  <h2 style="color:#0b1f3b;font-size:30px;font-weight:700;margin:0 0 8px 0;letter-spacing:-0.4px;">Hey ${fullName} 👋</h2>
                  <p style="color:#2f4057;font-size:16px;line-height:1.7;margin:0 0 4px 0;font-weight:400;">
                    Welcome to <strong style="color:#1d3b6b;font-weight:700;">Serviq</strong>. 
                    Complete your registration with the secure code below.
                  </p>
                </td>
              </tr>

              <!-- ===== OTP BOX : premium / modern ===== -->
              <tr>
                <td style="padding:16px 0 22px 0;">
                  <div style="background:linear-gradient(145deg, #f6faff, #ecf2fd);border-radius:28px;padding:34px 30px;border:1px solid rgba(29,59,107,0.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.8), 0 12px 28px -12px rgba(0,20,50,0.08);position:relative;overflow:hidden;">

                    <!-- decorative blobs -->
                    <div style="position:absolute;top:-40px;right:-30px;width:160px;height:160px;background:radial-gradient(circle, rgba(29,59,107,0.04) 0%, transparent 70%);border-radius:50%;"></div>
                    <div style="position:absolute;bottom:-50px;left:-30px;width:180px;height:180px;background:radial-gradient(circle, rgba(11,31,59,0.03) 0%, transparent 70%);border-radius:50%;"></div>

                    <p style="color:#1f334a;font-size:12px;font-weight:600;margin:0 0 16px 0;text-align:center;letter-spacing:2.5px;text-transform:uppercase;opacity:0.5;">
                      ✦ one-time password ✦
                    </p>

                    <div style="text-align:center;position:relative;z-index:2;">
                      <span class="otp-code" style="
                        display:inline-block;
                        padding:20px 42px;
                        font-size:48px;
                        font-weight:800;
                        letter-spacing:14px;
                        color:#0b1f3b;
                        background:rgba(255,255,255,0.6);
                        backdrop-filter:blur(6px);
                        border-radius:20px;
                        border:1px solid rgba(255,255,255,0.8);
                        box-shadow:0 12px 30px -10px rgba(29,59,107,0.12);
                        font-family:'Inter',monospace;
                        min-width:220px;
                      ">
                        ${newOtp}
                      </span>
                    </div>

                    <div style="text-align:center;margin-top:24px;position:relative;z-index:2;">
                      <span style="display:inline-flex;align-items:center;gap:10px;background:#ffffff;color:#b21f1f;padding:8px 24px;border-radius:60px;font-size:13px;font-weight:600;border:1px solid rgba(178,31,31,0.08);box-shadow:0 4px 12px rgba(0,0,0,0.02);">
                        <span style="font-size:16px;line-height:1;">⏳</span> expires in <span style="color:#8a1616;font-weight:700;">5 minutes</span>
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- ===== INSTRUCTION CARD : clean ===== -->
              <tr>
                <td style="padding-bottom:18px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6faff;border-radius:20px;padding:18px 24px;border-left:6px solid #1d3b6b;">
                    <tr>
                      <td>
                        <p style="margin:0;color:#1f334a;font-size:14px;line-height:1.6;">
                          <strong style="color:#0b1f3b;">📌 how to verify</strong><br />
                          Enter the code on the verification page to activate your account. 
                          If you didn’t request this, please ignore this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- ===== SECURITY NOTE : modern ===== -->
              <tr>
                <td style="padding-bottom:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f2fc;border-radius:20px;padding:16px 22px;border:1px solid rgba(29,59,107,0.06);">
                    <tr>
                      <td>
                        <p style="margin:0;color:#3b2e5c;font-size:13px;line-height:1.6;display:flex;align-items:flex-start;gap:12px;">
                          <span style="font-size:18px;line-height:1.2;">🛡️</span>
                          <span>
                            <strong style="color:#1f1a3a;">security tip</strong> — never share your OTP. 
                            Serviq will never ask for your verification code via phone or email.
                          </span>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- ===== DIVIDER ===== -->
              <tr>
                <td style="padding-bottom:22px;">
                  <div style="height:1px;background:linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0));"></div>
                </td>
              </tr>

              <!-- ===== FOOTER : refined ===== -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <p style="color:#4a617c;font-size:14px;margin:0 0 6px 0;line-height:1.7;">
                          Need help? <a href="mailto:support@serviq.com" style="color:#1d3b6b;text-decoration:none;font-weight:600;border-bottom:1.5px dashed #1d3b6b;">support@serviq.com</a>
                        </p>
                        <p style="color:#7a8fa5;font-size:13px;margin:0;">
                          Regards,<br />
                          <strong style="color:#0b1f3b;font-size:15px;">Team Serviq</strong><br />
                          <span style="font-size:12px;color:#7a8fa5;">founded by Aryan Singh</span>
                        </p>

                        <!-- social icons (modern) -->
                        <div style="margin-top:24px;display:flex;justify-content:center;gap:20px;opacity:0.6;">
                          <span style="font-size:20px;color:#1f334a;">📱</span>
                          <span style="font-size:20px;color:#1f334a;">🐦</span>
                          <span style="font-size:20px;color:#1f334a;">📷</span>
                          <span style="font-size:20px;color:#1f334a;">💼</span>
                        </div>

                        <p style="color:#b0c4db;font-size:11px;margin:18px 0 0 0;letter-spacing:0.3px;">
                          © 2026 Serviq — elevating service, one connection at a time.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
            <!-- end main card -->

            <!-- ===== FOOTER NOTE (outside card) ===== -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td align="center">
                  <p style="color:#7a8fa5;font-size:12px;margin:0 0 4px 0;">
                    This email was sent to verify your Serviq account.
                  </p>
                  <p style="color:#a9bdd4;font-size:11px;margin:0;">
                    Serviq • modern service • trusted professionals
                  </p>
                </td>
              </tr>
            </table>

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
