import { useState } from 'react';

const faqItems = [
  {
    question: 'What is included in a Nintendo account purchase?',
    answer: 'Each Nintendo account comes with a collection of games and DLCs that have been previously purchased. The exact contents vary by account, but you can see the full list of games and DLCs in the account details before purchasing.'
  },
  {
    question: 'How do I access the games after purchase?',
    answer: 'After your purchase is confirmed, you will receive the account credentials via email. You can then log in to your Nintendo Switch using these credentials to access all the games and DLCs included in the account.'
  },
  {
    question: 'Is it safe to purchase Nintendo accounts?',
    answer: 'Yes, all our accounts are verified and come with a guarantee. We ensure that all accounts are legitimate and have been properly purchased. We also provide support in case of any issues with accessing the games.'
  },
  {
    question: 'Can I play the games online?',
    answer: 'Yes, you can play the games online as long as you have an active Nintendo Switch Online subscription. The account purchase includes the games, but the online subscription is separate and needs to be purchased from Nintendo.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including credit cards, PayPal, and cryptocurrency. All payments are processed securely through our payment providers.'
  },
  {
    question: 'Can I transfer the games to my main Nintendo account?',
    answer: 'No, the games are tied to the Nintendo account they were purchased on. You cannot transfer them to another account. However, you can use the purchased account on your Nintendo Switch alongside your main account.'
  },
  {
    question: 'What is your refund policy?',
    answer: 'We offer a 24-hour refund policy if you are unable to access the games or if there are any issues with the account. Please contact our support team for assistance with refunds.'
  },
  {
    question: 'How long does it take to receive the account details?',
    answer: 'Account details are typically sent within 1-2 hours after purchase. In rare cases, it may take up to 24 hours. You will receive an email with the account credentials and instructions.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.question}
                </h3>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            
            <div
              className={`px-6 transition-all duration-200 ease-in-out ${
                openIndex === index
                  ? 'max-h-96 opacity-100 py-4'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Still have questions? Contact our support team at{' '}
          <a 
            href="mailto:support@nintendostore.com"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            support@nintendostore.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQ; 