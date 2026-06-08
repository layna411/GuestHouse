from config import Config
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("EmailService")

def _send_smtp_email(to_email, subject, html_content):
    """Sends an HTML email via SMTP using config settings."""
    if not Config.SMTP_SERVER or not Config.SMTP_USERNAME or not Config.SMTP_PASSWORD:
        logger.warning("SMTP configuration is incomplete. Cannot send email via SMTP.")
        return False

    try:
        # Create message container
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = Config.MAIL_FROM or Config.SMTP_USERNAME
        msg['To'] = to_email

        # Record the MIME type text/html.
        part = MIMEText(html_content, 'html')
        msg.attach(part)

        # Connect to server
        logger.info(f"Connecting to SMTP server {Config.SMTP_SERVER}:{Config.SMTP_PORT}...")
        # Use 15 seconds timeout
        server = smtplib.SMTP(Config.SMTP_SERVER, Config.SMTP_PORT, timeout=15)
        server.ehlo()
        
        if Config.SMTP_USE_TLS:
            server.starttls()
            server.ehlo()
            
        logger.info(f"Logging in to SMTP as {Config.SMTP_USERNAME}...")
        server.login(Config.SMTP_USERNAME, Config.SMTP_PASSWORD)
        
        logger.info(f"Sending SMTP email to {to_email}...")
        server.sendmail(msg['From'], [to_email], msg.as_string())
        server.quit()
        
        logger.info(f"SMTP email sent successfully to {to_email}!")
        return True
    except Exception as e:
        logger.error(f"Failed to send email via SMTP to {to_email}: {e}")
        return False


def send_booking_pending_email(booking):
    """Sends an email to the guest confirming that their booking request was received and is pending allocation."""
    check_in_str = booking.check_in.strftime("%d %b %Y (%I:%M %p)")
    check_out_str = booking.check_out.strftime("%d %b %Y (%I:%M %p)")
    
    html_content = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #0f172a; margin: 0; font-family: Georgia, serif; font-size: 24px;">Booking Received</h2>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Saveetha Guest House Showcase</p>
        </div>
        
        <p>Dear {booking.guest_name},</p>
        <p>Greetings from Saveetha Guest House!</p>
        <p>Thank you for your booking request and payment. We have successfully received your request, and your booking status is currently <strong>Pending</strong>.</p>
        <p>Our staff is reviewing your request and will allocate your room shortly. You will receive a confirmation email with all the details once the allocation is complete. We will contact you soon.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px;">Booking Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 4px 0; width: 40%; color: #64748b;"><strong>Booking ID:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{booking.id}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Guest Name:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{booking.guest_name}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Check-In Date:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{check_in_str}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Check-Out Date:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{check_out_str}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Number of Guests:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{booking.number_of_guests}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Meal Plan:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{booking.meal_plan or "Room without Breakfast"}</td>
                </tr>
            </table>
        </div>
        
        <p>If you require any assistance in the meantime, please feel free to reply to this email.</p>
        
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">Warm Regards,</p>
            <p style="margin: 5px 0 0 0; font-weight: bold; color: #0f172a;">Reservations Team</p>
            <p style="margin: 2px 0 0 0;">Saveetha Guest House</p>
            <p style="margin: 2px 0 0 0;">Phone: +91 XXXXX XXXXX</p>
            <p style="margin: 2px 0 0 0;">Email: <a href="mailto:guesthouse@saveetha.edu.in" style="color: #2563eb; text-decoration: none;">guesthouse@saveetha.edu.in</a></p>
        </div>
    </div>
    """
    
    subject = f"Booking Request Received - Saveetha Guest House (ID: {booking.id})"

    # Send via SMTP
    if Config.SMTP_SERVER:
        smtp_success = _send_smtp_email(booking.guest_email, subject, html_content)
        return smtp_success
    else:
        logger.warning("SMTP Server is not configured. Skipping email sending.")
        return False


def send_booking_confirmed_email(booking):
    """Sends a detailed confirmation email to the guest once a room has been allocated and the booking is confirmed."""

    # Retrieve room information
    from models.room import RoomModel
    room = RoomModel.query.get(booking.room_id)
    room_no = room.room_number if room else "N/A"
    room_type = room.type if room else "N/A"
    
    check_in_str = booking.check_in.strftime("%d %b %Y (%I:%M %p)")
    check_out_str = booking.check_out.strftime("%d %b %Y (%I:%M %p)")
    
    # Generate mock transaction ID
    clean_phone = "".join(c for c in booking.guest_phone if c.isdigit())
    last_four = clean_phone[-4:] if len(clean_phone) >= 4 else "0000"
    txn_id = f"TXN-{booking.id}-{last_four}"
    
    amount = f"{float(booking.total_price):.2f}" if booking.total_price is not None else "0.00"
    
    html_content = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #16a34a; margin: 0; font-family: Georgia, serif; font-size: 24px;">Reservation Confirmed</h2>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Saveetha Guest House Showcase</p>
        </div>
        
        <p>Dear {booking.guest_name},</p>
        <p>Greetings from Saveetha Guest House!</p>
        <p>We are pleased to confirm your room reservation. Please find your booking details below:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 10px;">Booking Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 4px 0; width: 40%; color: #64748b;"><strong>Booking ID:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a; font-family: monospace; font-weight: bold;">{booking.id}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Guest Name:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{booking.guest_name}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Room Number:</strong></td>
                    <td style="padding: 4px 0; color: #16a34a; font-weight: bold;">{room_no}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Room Type:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{room_type}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Check-In Date:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{check_in_str}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Check-Out Date:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{check_out_str}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Number of Guests:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">{booking.number_of_guests}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #64748b;"><strong>Meal Plan:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a; font-weight: bold;">{booking.meal_plan or "Room without Breakfast"}</td>
                </tr>
            </table>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534; font-size: 16px; border-bottom: 1px solid #bbf7d0; padding-bottom: 5px; margin-bottom: 10px;">Payment Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 4px 0; width: 40%; color: #166534;"><strong>Total Amount:</strong></td>
                    <td style="padding: 4px 0; color: #14532d; font-weight: bold;">₹{amount}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #166534;"><strong>Payment Status:</strong></td>
                    <td style="padding: 4px 0; color: #16a34a; font-weight: bold;">Paid</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #166534;"><strong>Transaction ID:</strong></td>
                    <td style="padding: 4px 0; color: #14532d; font-family: monospace;">{txn_id}</td>
                </tr>
            </table>
            <p style="font-size: 11px; color: #166534; margin: 8px 0 0 0; font-style: italic;">
                The payment receipt/slip has been attached to this email for your reference.
            </p>
        </div>
        
        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px;">
            <h3 style="margin-top: 0; color: #92400e; font-size: 15px; border-bottom: 1px solid #fef3c7; padding-bottom: 5px; margin-bottom: 10px;">Important Information</h3>
            <ul style="padding-left: 20px; margin: 0; color: #78350f; list-style-type: square;">
                <li style="margin-bottom: 4px;"><strong>Check-In:</strong> 24 Hours</li>
                <li style="margin-bottom: 4px;"><strong>Check-Out:</strong> 24 Hours</li>
                <li style="margin-bottom: 4px;">Visitors are not allowed in guest rooms after 9:30 PM.</li>
                <li style="margin-bottom: 4px;">Parking is subject to availability.</li>
                <li style="margin-bottom: 4px;">Extra bed facility is available on request (₹500 per night).</li>
                <li style="margin-bottom: 0;">Please carry a valid government-issued ID proof during check-in.</li>
            </ul>
        </div>
        
        <p>If you require any assistance before your arrival, please feel free to contact us.</p>
        <p>We look forward to welcoming you and wish you a comfortable stay at Saveetha Guest House.</p>
        
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">Warm Regards,</p>
            <p style="margin: 5px 0 0 0; font-weight: bold; color: #0f172a;">Reservations Team</p>
            <p style="margin: 2px 0 0 0;">Saveetha Guest House</p>
            <p style="margin: 2px 0 0 0;">Phone: +91 XXXXX XXXXX</p>
            <p style="margin: 2px 0 0 0;">Email: <a href="mailto:guesthouse@saveetha.edu.in" style="color: #2563eb; text-decoration: none;">guesthouse@saveetha.edu.in</a></p>
        </div>
    </div>
    """
    
    subject = f"Booking Confirmed - Saveetha Guest House (ID: {booking.id})"

    # Send via SMTP
    if Config.SMTP_SERVER:
        smtp_success = _send_smtp_email(booking.guest_email, subject, html_content)
        return smtp_success
    else:
        logger.warning("SMTP Server is not configured. Skipping email sending.")
        return False
