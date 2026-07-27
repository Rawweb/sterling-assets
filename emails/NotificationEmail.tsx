import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type Props = {
  title: string;
  message: string;
  fullName?: string;
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://sterlingassetsholdings.com';

export default function NotificationEmail({ title, message, fullName }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>

      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>STERLING</Text>
            <Text style={brandSub}>ASSETS HOLDINGS</Text>
          </Section>

          <Section style={card}>
            <Heading style={h1}>{title}</Heading>

            <Text style={paragraph}>
              {fullName ? `Hi ${fullName},` : 'Hi,'}
            </Text>
            <Text style={paragraph}>{message}</Text>

            <Button style={button} href={`${APP_URL}/dashboard`}>
              Go to your dashboard
            </Button>

            <Hr style={hr} />

            <Text style={small}>
              This is an update about your Sterling Assets Holdings account.
            </Text>
          </Section>

          <Text style={footer}>
            &copy; {new Date().getFullYear()} Sterling Assets Holdings. All
            rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: '#f7f9fc',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: '0',
  padding: '32px 0',
};
const container = { margin: '0 auto', maxWidth: '520px', padding: '0 16px' };
const header = {
  backgroundColor: '#0f1b2d',
  borderRadius: '12px 12px 0 0',
  padding: '28px 32px 22px',
};
const brand = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  letterSpacing: '1px',
  margin: '0',
};
const brandSub = {
  color: '#e0a100',
  fontSize: '10px',
  fontWeight: '500',
  letterSpacing: '3px',
  margin: '2px 0 0',
};
const card = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6e9f0',
  borderRadius: '0 0 12px 12px',
  borderTop: 'none',
  padding: '36px 32px 32px',
};
const h1 = {
  color: '#101828',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 20px',
};
const paragraph = {
  color: '#344054',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 14px',
};
const button = {
  backgroundColor: '#4f6bf6',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 22px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0 4px',
};
const small = {
  color: '#667085',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
};
const hr = { borderColor: '#e6e9f0', margin: '26px 0 20px' };
const footer = {
  color: '#98a2b3',
  fontSize: '11px',
  margin: '20px 0 0',
  textAlign: 'center' as const,
};
