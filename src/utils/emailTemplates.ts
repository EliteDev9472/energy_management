
interface GridOperatorEmailParams {
  type: string;
  address: string;
  city: string;
  postalCode: string;
  capacity: string;
  desiredConnectionDate: string;
  installer?: string;
  installerEmail?: string;
  installerPhone?: string;
  objectName: string;
}

export function generateGridOperatorEmailTemplate(params: GridOperatorEmailParams): string {
  const {
    type,
    address,
    city,
    postalCode,
    capacity,
    desiredConnectionDate,
    installer,
    installerEmail,
    installerPhone,
    objectName
  } = params;

  const formattedDate = new Date(desiredConnectionDate).toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const connectionType = type === 'electricity' ? 'elektriciteitsaansluiting' : 'gasaansluiting';
  
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Geachte heer/mevrouw,</p>
      
      <p>Middels dit bericht willen wij graag een ${connectionType} aanvragen voor het volgende adres:</p>
      
      <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #0066cc; background-color: #f5f5f5;">
        <strong>Object:</strong> ${objectName}<br>
        <strong>Adres:</strong> ${address}<br>
        <strong>Postcode:</strong> ${postalCode}<br>
        <strong>Plaats:</strong> ${city}<br>
        <strong>Capaciteit:</strong> ${capacity}<br>
        <strong>Gewenste aansluitdatum:</strong> ${formattedDate}
      </div>
      
      <p>De installatie wordt verzorgd door:</p>
      
      <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #66cc00; background-color: #f5f5f5;">
        <strong>Installateur:</strong> ${installer || '-'}<br>
        <strong>E-mail:</strong> ${installerEmail || '-'}<br>
        <strong>Telefoon:</strong> ${installerPhone || '-'}
      </div>
      
      <p>Graag ontvangen wij van u een bevestiging van deze aanvraag met daarbij informatie over de verwachte aansluitdatum en eventuele kosten.</p>
      
      <p>Mocht u nog vragen hebben of aanvullende informatie nodig hebben, dan kunt u contact met ons opnemen.</p>
      
      <p>Met vriendelijke groet,<br>
      Atlas Power & Gas<br>
      <a href="mailto:info@atlaspowerandgas.com">info@atlaspowerandgas.com</a><br>
      Tel: 088-123 45 67</p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #666;">
        Dit is een automatisch gegenereerd bericht. Reageer niet op deze e-mail, maar gebruik de contactgegevens hierboven.
      </p>
    </div>
  `;
}
