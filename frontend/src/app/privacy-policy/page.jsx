import PolicyContent from '../../components/PolicyContent';

export const metadata = {
  title: 'Privacy Policy - Vasishtha Pooja Samagri Store',
  description: 'How Vasishtha Pooja Samagri Store collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section policy-page">
      <PolicyContent headingKey="privacyHeading" introKey="privacyIntro" sectionCount={7} prefix="privacy" />
    </section>
  );
}
