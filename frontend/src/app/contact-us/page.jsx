import ContactForm from '../../components/ContactForm';

export const metadata = {
  title: 'Contact Us - Vashishtha Spiritual Store',
  description: 'Get in touch with Vashishtha Spiritual Store for order, product, or general questions.',
};

export default function ContactUsPage() {
  return (
    <section className="section policy-page">
      <ContactForm />
    </section>
  );
}
