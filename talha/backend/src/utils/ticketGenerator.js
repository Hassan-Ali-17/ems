const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const ticketsDir = path.join(__dirname, '..', '..', 'uploads', 'tickets');

fs.mkdirSync(ticketsDir, { recursive: true });

const generateTicketPDF = async (registration, event, user) => {
  const fileName = `ticket-${registration.ticketId}.pdf`;
  const filePath = path.join(ticketsDir, fileName);
  const qrData = await QRCode.toDataURL(JSON.stringify({ ticketId: registration.ticketId, eventId: event._id.toString(), userId: user._id.toString() }));

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(filePath);

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
    doc.on('error', reject);

    doc.pipe(stream);
    doc.fontSize(24).fillColor('#1f2937').text('Event Management System', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).fillColor('#111827').text('Event Ticket', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(14).text(`Ticket ID: ${registration.ticketId}`);
    doc.text(`Attendee: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Event: ${event.title}`);
    doc.text(`Date: ${new Date(event.date).toLocaleString()}`);
    doc.text(`Location: ${event.location}`);
    doc.text(`Venue: ${event.venue || 'N/A'}`);
    doc.text(`Status: ${registration.status}`);

    doc.moveDown(1.5);
    doc.image(qrData, { fit: [140, 140], align: 'center' });

    doc.moveDown(1.5);
    doc.fontSize(10).fillColor('#6b7280').text('Present this QR code at the event entrance.', { align: 'center' });

    doc.end();
  });
};

module.exports = { generateTicketPDF };