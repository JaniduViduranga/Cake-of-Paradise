import { useState } from 'react';

export const INQUIRY_TYPES = [
  'General Question',
  'Custom Cake Order',
  'Wedding Consultation',
  'Corporate / Bulk Order',
  'Feedback',
  'Other',
];

export const HOURS = [
  { day: 'Monday - Friday', hours: '8:00 AM – 8:00 PM' },
  { day: 'Saturday', hours: '9:00 AM – 7:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

/**
 * Controller managing contact form input and submission state
 */
export function useContactController() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    inquiryType: INQUIRY_TYPES[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitContactForm = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      inquiryType: INQUIRY_TYPES[0],
      message: '',
    });
  };

  return {
    form,
    updateField,
    submitted,
    loading,
    submitContactForm,
    resetForm,
    inquiryTypes: INQUIRY_TYPES,
    hours: HOURS,
  };
}
