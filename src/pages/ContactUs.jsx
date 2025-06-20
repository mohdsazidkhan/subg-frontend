import React from 'react';

const ContactUs = () => (
  <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
      Contact Us
    </h1>
    <p className="mb-2">
      <strong>Owner:</strong> Mohd Sazid Khan
    </p>
    <p className="mb-2">
      <strong>Email:</strong>{' '}
      <a
        href="mailto:subgquiz@gmail.com"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        subgquiz@gmail.com
      </a>
    </p>
    <p>
      <strong>Phone:</strong>{' '}
      <a
        href="tel:+917678131912"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        +91 7678131912
      </a>
    </p>
  </div>
);

export default ContactUs;
