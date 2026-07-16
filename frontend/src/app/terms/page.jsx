import PolicyContent from '../../components/PolicyContent';

export const metadata = {
  title: 'Terms of Service - Vashishtha Spiritual Store',
  description: 'The terms governing your use of Vashishtha Spiritual Store, including orders, payment, and shipping.',
};

export default function TermsPage() {
  return (
    <section className="section policy-page">
      <PolicyContent headingKey="termsHeading" introKey="termsIntro" sectionCount={9} prefix="terms" />
    </section>
  );
}
