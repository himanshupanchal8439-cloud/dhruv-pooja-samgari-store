import ContactForm from '../../components/ContactForm';

export const metadata = {
  title: 'Contact Us - Vasishtha Pooja Samagri Store',
  description: 'Get in touch with Vasishtha Pooja Samagri Store for order, product, or general questions.',
};

export default function ContactUsPage() {
  return (
    <section className="section policy-page">
      <ContactForm />
    </section>
  );
}
