const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  orderConfirmation: (orderData) => ({
    subject: `Order Confirmation - Ergiva #${orderData.id || orderData.order_id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your order with Ergiva</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <tr style="background: #667eea; color: white;">
              <td style="padding: 15px; font-weight: bold;">Order ID</td>
              <td style="padding: 15px;">#${orderData.id || orderData.order_id}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Total Amount</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">₹${orderData.total_amount}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 15px; font-weight: bold;">Payment Method</td>
              <td style="padding: 15px;">${orderData.payment_method === 'razorpay' ? 'Online Payment' : 'Pay on Visit'}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">What's Next?</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              ${orderData.payment_method === 'razorpay' 
                ? '<p style="margin: 0; color: #555;">Your payment has been processed successfully. We will prepare your order and ship it soon.</p>'
                : '<p style="margin: 0; color: #555;">Your order has been received. Our team will contact you shortly to confirm delivery details and payment.</p>'
              }
            </div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #666; margin-bottom: 20px;">Need help? Contact us:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; display: inline-block;">
              <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> +91 92112 15116</p>
              <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> support@ergiva.com</p>
              <p style="margin: 5px 0; color: #333;"><strong>Hours:</strong> 9 AM - 9 PM</p>
            </div>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2024 Ergiva. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">Delhi NCR's trusted physiotherapy services</p>
        </div>
      </div>
    `
  }),

  sessionConfirmation: (sessionData, isAdmin = false) => ({
    subject: isAdmin 
      ? `New Session Booking - ${sessionData.name}` 
      : `Session Booking Confirmed - Ergiva`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">
            ${isAdmin ? 'New Booking Received' : 'Session Booked Successfully!'}
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">
            ${isAdmin ? 'A new physiotherapy session has been booked' : 'Your physiotherapy session has been confirmed'}
          </p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Session Details</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <tr style="background: #48bb78; color: white;">
              <td style="padding: 15px; font-weight: bold;">Booking ID</td>
              <td style="padding: 15px;">#${sessionData.session_id}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Patient Name</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${sessionData.name}</td>
            </tr>
            ${isAdmin ? `
            <tr style="background: #f8f9fa;">
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Contact</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${sessionData.contact}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${sessionData.email}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Address</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${sessionData.address}</td>
            </tr>
            ${sessionData.condition_description ? `
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Condition</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${sessionData.condition_description}</td>
            </tr>
            ` : ''}
            ` : ''}
            <tr style="background: #f8f9fa;">
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Preferred Time</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${new Date(sessionData.preferred_time).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Session Type</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${sessionData.session_type === 'home_visit' ? 'Home Visit' : 'Online Consultation'}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">
              ${isAdmin ? 'Action Required' : 'What\'s Next?'}
            </h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #48bb78;">
              ${isAdmin 
                ? '<p style="margin: 0; color: #555;">Please review the booking and assign a physiotherapist. Contact the patient to confirm the appointment.</p>'
                : sessionData.payment_method === 'razorpay' 
                  ? '<p style="margin: 0; color: #555;">Your payment has been processed. Our team will contact you within 2 hours to confirm your appointment and provide the physiotherapist details.</p>'
                  : '<p style="margin: 0; color: #555;">Your booking has been received. Our team will contact you shortly to confirm the appointment time and provide payment details.</p>'
              }
            </div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #666; margin-bottom: 20px;">
              ${isAdmin ? 'Admin Dashboard' : 'Need help? Contact us:'}
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; display: inline-block;">
              <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> +91 92112 15116</p>
              <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> support@ergiva.com</p>
              <p style="margin: 5px 0; color: #333;"><strong>Hours:</strong> 9 AM - 9 PM</p>
            </div>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2024 Ergiva. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">Delhi NCR's trusted physiotherapy services</p>
        </div>
      </div>
    `
  }),

  partnerApplicationConfirmation: (applicationData, isAdmin = false, isStatusUpdate = false) => ({
    subject: isAdmin 
      ? `New Partner Application - ${applicationData.name}`
      : isStatusUpdate
        ? `Application Update - Ergiva Partner Program`
        : `Application Received - Ergiva Partner Program`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">
            ${isAdmin 
              ? 'New Partner Application' 
              : isStatusUpdate
                ? 'Application Status Update'
                : 'Application Received!'
            }
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">
            ${isAdmin 
              ? 'A new physiotherapist wants to join Ergiva'
              : isStatusUpdate
                ? `Your application status has been updated`
                : 'Thank you for your interest in joining Ergiva'
            }
          </p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          ${isStatusUpdate ? `
            <div style="background: ${applicationData.status === 'approved' ? '#48bb78' : applicationData.status === 'rejected' ? '#f56565' : '#ed8936'}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <h2 style="margin: 0; font-size: 24px;">
                Status: ${applicationData.status.charAt(0).toUpperCase() + applicationData.status.slice(1)}
              </h2>
              ${applicationData.review_notes ? `
                <p style="margin: 10px 0 0 0; font-size: 16px;">${applicationData.review_notes}</p>
              ` : ''}
            </div>
          ` : ''}
          
          <h2 style="color: #333; margin-bottom: 20px;">Application Details</h2>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <tr style="background: #ed8936; color: white;">
              <td style="padding: 15px; font-weight: bold;">Application ID</td>
              <td style="padding: 15px;">#${applicationData.application_id}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${applicationData.name}</td>
            </tr>
            ${isAdmin ? `
            <tr style="background: #f8f9fa;">
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Mobile</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${applicationData.mobile}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${applicationData.email}</td>
            </tr>
            ` : ''}
            <tr style="background: #f8f9fa;">
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Qualification</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${applicationData.qualification}</td>
            </tr>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee; font-weight: bold;">Experience</td>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">${applicationData.years_experience} years</td>
            </tr>
            ${applicationData.preferred_area ? `
            <tr style="background: #f8f9fa;">
              <td style="padding: 15px; font-weight: bold;">Preferred Area</td>
              <td style="padding: 15px;">${applicationData.preferred_area}</td>
            </tr>
            ` : ''}
            ${isAdmin && applicationData.additional_info ? `
            <tr>
              <td style="padding: 15px; font-weight: bold;">Additional Info</td>
              <td style="padding: 15px;">${applicationData.additional_info}</td>
            </tr>
            ` : ''}
          </table>
          
          <div style="margin-top: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">
              ${isAdmin 
                ? 'Next Steps' 
                : isStatusUpdate
                  ? applicationData.status === 'approved' ? 'Welcome to Ergiva!' : 'Thank You'
                  : 'What\'s Next?'
              }
            </h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ed8936;">
              ${isAdmin 
                ? '<p style="margin: 0; color: #555;">Please review the application in the admin panel and contact the applicant for further steps.</p>'
                : isStatusUpdate
                  ? applicationData.status === 'approved' 
                    ? '<p style="margin: 0; color: #555;">Congratulations! Your application has been approved. Our team will contact you soon with onboarding details and training information.</p>'
                    : applicationData.status === 'rejected'
                      ? '<p style="margin: 0; color: #555;">We appreciate your interest in joining Ergiva. Unfortunately, we cannot move forward with your application at this time. Feel free to apply again in the future.</p>'
                      : '<p style="margin: 0; color: #555;">Your application is currently under review. We will update you as soon as we have more information.</p>'
                  : '<p style="margin: 0; color: #555;">We have received your application and will review it carefully. Our team will contact you within 3-5 business days with the next steps.</p>'
              }
            </div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #666; margin-bottom: 20px;">
              ${isAdmin ? 'Admin Dashboard' : 'Questions? Contact us:'}
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; display: inline-block;">
              <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> +91 92112 15116</p>
              <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> careers@ergiva.com</p>
              <p style="margin: 5px 0; color: #333;"><strong>Hours:</strong> 9 AM - 6 PM (Mon-Fri)</p>
            </div>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2024 Ergiva. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">Delhi NCR's trusted physiotherapy services</p>
        </div>
      </div>
    `
  })
};

// Send order confirmation email
const sendOrderConfirmation = async (email, orderData) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.orderConfirmation(orderData);
    
    await transporter.sendMail({
      from: `"Ergiva" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html
    });

    console.log(`Order confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Send session confirmation email
const sendSessionConfirmation = async (email, sessionData, isAdmin = false) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.sessionConfirmation(sessionData, isAdmin);
    
    await transporter.sendMail({
      from: `"Ergiva" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html
    });

    console.log(`Session confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending session confirmation email:', error);
    throw error;
  }
};

// Send partner application confirmation email
const sendPartnerApplicationConfirmation = async (email, applicationData, isAdmin = false, isStatusUpdate = false) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.partnerApplicationConfirmation(applicationData, isAdmin, isStatusUpdate);
    
    await transporter.sendMail({
      from: `"Ergiva" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html
    });

    console.log(`Partner application email sent to ${email}`);
  } catch (error) {
    console.error('Error sending partner application email:', error);
    throw error;
  }
};

// Test email connection
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendSessionConfirmation,
  sendPartnerApplicationConfirmation,
  testEmailConnection
};