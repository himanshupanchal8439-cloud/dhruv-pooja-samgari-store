import FaqAccordion from '../../components/FaqAccordion';

export const metadata = {
  title: 'FAQ - Vasishtha Pooja Samagri Store',
  description:
    'Answers to common questions about payment, shipping, order tracking, coupons, Hindi language support, astrology consultations, and daily panchang.',
};

export default function FaqPage() {
  return (
    <section className="section faq-page">
      <FaqAccordion />
    </section>
  );
}
