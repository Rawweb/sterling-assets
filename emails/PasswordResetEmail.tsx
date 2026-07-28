import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type Props = {
  fullName: string;
  resetUrl: string;
};

export default function PasswordResetEmail({ fullName, resetUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Sterling Assets Holdings password</Preview>

      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>STERLING</Text>
            <Text style={brandSub}>ASSETS HOLDINGS</Text>
          </Section>

          <Section style={card}>
            <Heading style={h1}>Reset your password</Heading>

            <Text style={paragraph}>
              {fullName ? `Hi ${fullName},` : 'Hi,'}
            </Text>

            <Text style={paragraph}>
              We received a request to reset the password for your Sterling
              Assets Holdings account. Click the button below to choose a new
              password. This link expires in 1 hour.
            </Text>

            <Section style={buttonWrap}>
              <Button style={button} href={resetUrl}>
                Reset password
              </Button>
            </Section>

            <Text style={small}>
              If you did not request a password reset, you can safely ignore
              this email. Your password will not change.
            </Text>

            <Hr style={hr} />

            <Text style={small}>
              Button not working? Paste this into your browser:
            </Text>
            <Link href={resetUrl} style={rawLink}>
              {resetUrl}
            </Link>
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

const container = {
  margin: '0 auto',
  maxWidth: '520px',
  padding: '0 16px',
};

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

const buttonWrap = {
  margin: '28px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#4f6bf6',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '13px 32px',
  textDecoration: 'none',
};

const small = {
  color: '#667085',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 8px',
};

const hr = {
  borderColor: '#e6e9f0',
  margin: '26px 0 20px',
};

const rawLink = {
  color: '#4f6bf6',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
};

const footer = {
  color: '#98a2b3',
  fontSize: '11px',
  margin: '20px 0 0',
  textAlign: 'center' as const,
};
