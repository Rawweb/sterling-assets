'use client';

import { useState } from 'react';

type Tab = 'terms' | 'privacy';

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='mb-8'>
      <h3 className='text-base md:text-lg font-bold text-navy mb-3'>
        {n}. {title}
      </h3>
      <div className='text-muted text-sm leading-[1.8] space-y-3'>
        {children}
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <>
      <Section n={1} title='Acceptance of Terms'>
        <p>
          By accessing and using Sterling Assets Holdings, you accept and agree
          to be bound by these terms and conditions in full. If you do not agree
          with any part of these terms, please do not use the platform.
        </p>
      </Section>
      <Section n={2} title='Investment Risk Disclosure'>
        <p>
          All investments carry risk. Digital asset, steel, real estate, and
          agricultural values can be volatile. Past performance does not
          guarantee future results. Only invest capital you can afford to lose.
          Sterling Assets Holdings does not guarantee specific returns.
        </p>
      </Section>
      <Section n={3} title='Account Responsibilities'>
        <p>
          You are solely responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account. You must notify us immediately of any unauthorised use or
          security breach.
        </p>
      </Section>
      <Section n={4} title='KYC and Compliance'>
        <p>
          Identity verification is mandatory before withdrawals can be
          processed. We comply with applicable anti-money laundering (AML) and
          know-your-customer (KYC) regulations. Providing false or misleading
          information during verification will result in immediate account
          suspension.
        </p>
      </Section>
      <Section n={5} title='Deposits and Withdrawals'>
        <p>
          Deposits are accepted in the supported cryptocurrencies only and are
          subject to admin approval. Withdrawals require completed KYC
          verification and are processed after admin review. Minimum deposit and
          withdrawal amounts apply and are stated within the platform.
        </p>
      </Section>
      <Section n={6} title='Daily Returns and Plan Terms'>
        <p>
          Daily returns are credited based on your selected investment plan.
          Plan rates, durations, and terms are subject to change at the
          discretion of Sterling Assets Holdings. Once a plan is purchased, the
          stated rate for that plan is locked for its duration.
        </p>
      </Section>
      <Section n={7} title='Limitation of Liability'>
        <p>
          Sterling Assets Holdings shall not be liable for any indirect,
          incidental, or consequential damages arising from the use or inability
          to use the platform, market volatility, or technical failures beyond
          our reasonable control.
        </p>
      </Section>
      <Section n={8} title='Governing Law'>
        <p>
          These terms are governed by the laws of the Grand Duchy of Luxembourg.
          Any disputes arising from these terms shall be subject to the
          exclusive jurisdiction of the courts of Luxembourg.
        </p>
      </Section>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <Section n={1} title='Information We Collect'>
        <p>
          We collect information you provide during registration and
          verification, including your full name, email address, phone number,
          country of residence, and identity documents required for KYC
          compliance.
        </p>
      </Section>
      <Section n={2} title='How We Use Your Data'>
        <p>
          Your data is used to operate your account, process deposits and
          withdrawals, verify your identity, communicate account updates, and
          comply with legal and regulatory obligations. We never sell your
          personal data to third parties.
        </p>
      </Section>
      <Section n={3} title='Data Storage and Security'>
        <p>
          We use bank-grade encryption and secure storage to protect your
          information. All sensitive data is encrypted at rest and in transit.
          Access to personal data is restricted to authorised personnel only.
        </p>
      </Section>
      <Section n={4} title='KYC Document Handling'>
        <p>
          Identity documents submitted for KYC verification are stored privately
          in a secure, private cloud storage system. They are never publicly
          accessible. Access to these documents is logged and limited to our
          compliance team.
        </p>
      </Section>
      <Section n={5} title='Third-Party Services'>
        <p>
          We use trusted third-party services to operate the platform, including
          email delivery, file storage, and analytics providers. These providers
          process your data only as necessary to deliver the service and are
          bound by confidentiality obligations.
        </p>
      </Section>
      <Section n={6} title='Cookies and Tracking'>
        <p>
          We use only essential cookies required for authentication and
          security. We do not use advertising cookies or sell browsing data. You
          can clear cookies at any time through your browser settings.
        </p>
      </Section>
      <Section n={7} title='Your Rights'>
        <p>
          You may request access to, correction of, or deletion of your personal
          data at any time by contacting our support team. Account deletion
          requests will be processed within 30 days, subject to any legal data
          retention requirements.
        </p>
      </Section>
      <Section n={8} title='Contact Us'>
        <p>
          If you have questions or concerns about how we handle your data,
          please contact us at support@sterlingassetsholdings.com. We aim to
          respond to all data-related enquiries within 48 hours.
        </p>
      </Section>
    </>
  );
}

export default function LegalTabs() {
  const [tab, setTab] = useState<Tab>('terms');

  return (
    <div>
      {/* Tab switcher */}
      <div className='flex gap-2 bg-bg p-1.5 rounded-xl max-w-[480px] mx-auto mb-10'>
        {(['terms', 'privacy'] as Tab[]).map((t) => (
          <button
            key={t}
            type='button'
            onClick={() => setTab(t)}
            className={`flex-1 py-3 rounded-[9px] text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? 'bg-primary text-on-navy shadow-sm'
                : 'text-muted hover:text-text'
            }`}
          >
            {t === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className='max-w-[760px] mx-auto'>
        {tab === 'terms' ? <TermsContent /> : <PrivacyContent />}
      </div>
    </div>
  );
}
