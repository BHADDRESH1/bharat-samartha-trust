'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import axios from 'axios'; 
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';

// Define form steps and inputs
type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

type AvailabilityInfo = {
  interests: string[];
  availability: string;
  commitmentType: 'one-time' | 'recurring';
};

type SkillsInfo = {
  skills: string[];
  experience: string;
  languages: string[];
};

type DocumentInfo = {
  aadhaarCard: File | null;
  photo: File | null;
  aadhaarCardPreview: string;
  photoPreview: string;
};

type FormData = PersonalInfo & AvailabilityInfo & SkillsInfo & DocumentInfo;

// Available options for the form
const interestOptions = [
  'Teaching & Education',
  'Medical & Healthcare',
  'Environmental',
  'Community Service',
  'Fundraising',
  'Event Planning',
  'Administrative',
  'Marketing & Communications',
  'Technical & IT',
];

const skillOptions = [
  'Leadership',
  'Communication',
  'Organization',
  'Problem Solving',
  'Technical',
  'Creative',
  'Language Skills',
  'Teaching',
  'Medical',
  'Fundraising',
  'Project Management',
];

const availabilityOptions = [
  'Weekday mornings',
  'Weekday afternoons',
  'Weekday evenings',
  'Weekend mornings',
  'Weekend afternoons',
  'Weekend evenings',
  'Flexible schedule',
];

interface SignupFormSectionProps {
  onSubmitSuccess: () => void;
}

const SignupFormSection = ({ onSubmitSuccess }: SignupFormSectionProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [volunteerId, setVolunteerId] = useState('');
  const [certificateDate, setCertificateDate] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  const certificateRef = useRef<HTMLDivElement>(null);
  const idCardRef = useRef<HTMLDivElement>(null);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    interests: [],
    availability: '',
    commitmentType: 'one-time',
    skills: [],
    experience: '',
    languages: [],
    aadhaarCard: null,
    photo: null,
    aadhaarCardPreview: '',
    photoPreview: '',
  });

  // Form steps definition
  const steps = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Interests & Availability' },
    { id: 3, title: 'Skills & Experience' },
    { id: 4, title: 'Documents Upload' },
    { id: 5, title: 'Review & Submit' },
  ];

  // Generate volunteer ID
  useEffect(() => {
    const generateId = () => {
      const prefix = 'VOL';
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const year = new Date().getFullYear();
      return `${prefix}-${randomNum}-${year}`;
    };

    setVolunteerId(generateId());

    // Format date for certificate
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCertificateDate(formattedDate);
  }, []);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox/multi-select changes
  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field] as string[];
      if (currentValues.includes(value)) {
        // Remove value
        return {
          ...prev,
          [field]: currentValues.filter((item) => item !== value),
        };
      } else {
        // Add value
        return {
          ...prev,
          [field]: [...currentValues, value],
        };
      }
    });

    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'aadhaarCard' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: file,
          [`${field}Preview`]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);

      // Clear error for this field if it exists
      if (formErrors[field]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  // Form validation
  const validateStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.email) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Email is invalid';
        }
        if (!formData.address) errors.address = 'Address is required';
        break;
      case 2:
        if (formData.interests.length === 0) errors.interests = 'Select at least one interest';
        if (!formData.availability) errors.availability = 'Please select your availability';
        break;
      case 3:
        // Skills are optional, no validation required
        break;
      case 4:
        if (!formData.aadhaarCard) errors.aadhaarCard = 'Aadhaar card is required';
        if (!formData.photo) errors.photo = 'Photo is required';
        break;
      default:
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation between steps
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateStep()) return;

  setIsSubmitting(true);

  try {
    // 🔹 Upload Aadhaar Card
    let aadhaarCardUrl = '';
    if (formData.aadhaarCard) {
      const aadhaarForm = new FormData();
      aadhaarForm.append('image', formData.aadhaarCard);
      const aadhaarRes = await axios.post('/api/vsignup/upload-image', aadhaarForm);
      aadhaarCardUrl = aadhaarRes.data.url;
    }

    // 🔹 Upload Photo
    let photoUrl = '';
    if (formData.photo) {
      const photoForm = new FormData();
      photoForm.append('image', formData.photo);
      const photoRes = await axios.post('/api/vsignup/upload-image', photoForm);
      photoUrl = photoRes.data.url;
    }

    // 🔹 Prepare full volunteer data
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      interests: formData.interests,
      availability: formData.availability,
      commitmentType: formData.commitmentType,
      skills: formData.skills,
      experience: formData.experience,
      languages: formData.languages,
      aadhaarCardPath: aadhaarCardUrl,
      photoPath: photoUrl,
      volunteerId,
      certificateDate,
      badgeLevel: getBadgeLevel(),
    };

    // 🔹 Submit form data to backend
    const response = await axios.post('/api/vsignup', payload);

    console.log('Volunteer created:', response.data);

    setIsSubmitting(false);
    setFormSubmitted(true);
    setShowCertificate(true);
    setShowIdCard(true);

    // Simulate sending email (can be enhanced later)
    console.log('Sending certificate to:', formData.email);

    onSubmitSuccess();
  } catch (error) {
    console.error('Error submitting form:', error);
    setIsSubmitting(false);
  }
};

  // Generate PDF certificate
  const downloadCertificate = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.firstName}_${formData.lastName}_Certificate.pdf`);
    }
  };

  // Generate PDF ID card
  const downloadIdCard = async () => {
    if (idCardRef.current) {
      const canvas = await html2canvas(idCardRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85, 55],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.firstName}_${formData.lastName}_IDCard.pdf`);
    }
  };

  // Share certificate to social media
  const shareCertificate = () => {
    const text = `I'm proud to volunteer with Community First! Check out my volunteer certificate. #ProudVolunteer #ChangeMaker`;
    const url = window.location.href;

    // Open share dialog
    if (navigator.share) {
      navigator
        .share({
          title: 'My Volunteer Certificate',
          text: text,
          url: url,
        })
        .catch(console.error);
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank'
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      interests: [],
      availability: '',
      commitmentType: 'one-time',
      skills: [],
      experience: '',
      languages: [],
      aadhaarCard: null,
      photo: null,
      aadhaarCardPreview: '',
      photoPreview: '',
    });
    setFormErrors({});
    setCurrentStep(1);
    setFormSubmitted(false);
    setShowCertificate(false);
    setShowIdCard(false);
    setCardFlipped(false);
  };

  // Determine volunteer badge level based on interests and skills
  const getBadgeLevel = () => {
    const totalPoints = formData.interests.length + formData.skills.length;
    if (totalPoints > 10) return 'Gold';
    if (totalPoints > 5) return 'Silver';
    return 'Bronze';
  };

  return (
    <section id="volunteer-signup" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Join Our Volunteer Community</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take the first step towards making a difference. Sign up to become a volunteer today!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {formSubmitted ? (
            <motion.div
              key="success"
              className="max-w-5xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 p-10 rounded-2xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-7xl mb-6 mx-auto"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold text-green-800 mb-4">Thank You for Signing Up!</h3>
                <p className="text-lg text-gray-700 mb-6">
                  We're excited to have you join our volunteer community. We'll be in touch soon with next steps.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-purple-600 text-white font-medium rounded-full flex items-center"
                    onClick={() => {
                      setShowCertificate(true);
                      setShowIdCard(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    View Certificate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full flex items-center"
                    onClick={() => {
                      setShowIdCard(true);
                      setShowCertificate(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H5a2 2 0 01-2 2v9a2 2 0 012 2h14a2 2 0 012-2V8a2 2 0 01-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                    View ID Card
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-full flex items-center"
                    onClick={resetForm}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Sign Up Another Volunteer
                  </motion.button>
                </div>
              </div>

              {/* Volunteer Certificate */}
              <AnimatePresence>
                {showCertificate && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-2xl font-bold text-gray-800">Your Volunteer Certificate</h4>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-blue-600 text-white rounded-full"
                          onClick={downloadCertificate}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-green-600 text-white rounded-full"
                          onClick={shareCertificate}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>

                    <motion.div
                      ref={certificateRef}
                      className="w-full bg-white border-8 border-double border-amber-200 p-8 rounded-lg shadow-lg relative overflow-hidden"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {/* Certificate Background */}
                      <div className="absolute inset-0 bg-[url('/certificate-bg.png')] opacity-5 z-0"></div>

                      {/* Certificate Content */}
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold mr-4">
                              CF
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-gray-800">Community First</h5>
                              <p className="text-sm text-gray-600">Volunteer Program</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-4">
                              <p className="text-sm text-gray-600">Volunteer ID</p>
                              <p className="font-bold text-purple-600">{volunteerId}</p>
                            </div>
                            <QRCodeCanvas value={`https://example.com/verify/${volunteerId}`} size={80} />
                          </div>
                        </div>

                        <div className="text-center py-10">
                          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Certificate of Appreciation</h1>
                          <p className="text-lg text-gray-600 mb-6">This certifies that</p>
                          <h2 className="text-3xl font-bold text-purple-600 mb-6 font-serif">
                            {formData.firstName} {formData.lastName}
                          </h2>
                          <p className="text-lg text-gray-600 mb-6">
                            has registered as a volunteer with Community First and is recognized for their commitment to
                            making a positive impact in our community. We appreciate your dedication to serve and
                            contribute to the betterment of society.
                          </p>
                          <motion.div
                            className="inline-block bg-purple-100 border border-purple-300 rounded-full px-4 py-2 text-purple-700 font-bold mt-2 mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                          >
                            {getBadgeLevel()} Badge
                          </motion.div>
                        </div>

                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm text-gray-600">Issued on</p>
                            <p className="font-bold">{certificateDate}</p>
                          </div>
                          <div className="text-center">
                            <div className="h-px w-40 bg-gray-400 mb-2"></div>
                            <p className="font-bold">John Doe</p>
                            <p className="text-sm text-gray-600">Program Director</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Volunteer ID Card */}
              <AnimatePresence>
                {showIdCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-2xl font-bold text-gray-800">Your Volunteer ID Card</h4>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-blue-600 text-white rounded-full"
                          onClick={downloadIdCard}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-purple-600 text-white rounded-full"
                          onClick={() => setCardFlipped(!cardFlipped)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex justify-center mx-auto">
                      <div className="w-full max-w-md perspective-1000">
                        <motion.div
                          className="relative preserve-3d w-full h-64"
                          initial={false}
                          animate={{ rotateY: cardFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {/* Front of card */}
                          <motion.div
                            ref={!cardFlipped ? idCardRef : null}
                            className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg"
                            style={{
                              backfaceVisibility: 'hidden',
                            }}
                          >
                            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex">
                              <div className="w-1/3 flex flex-col items-center justify-center">
                                <div className="w-24 h-24 bg-white rounded-full overflow-hidden mb-2">
                                  {formData.photoPreview ? (
                                    <img
                                      src={formData.photoPreview}
                                      alt="Volunteer"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-white font-bold bg-blue-700 px-2 py-1 rounded-full">
                                    {getBadgeLevel()}
                                  </div>
                                </div>
                              </div>
                              <div className="w-2/3 pl-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h5 className="text-lg font-bold text-white">
                                      {formData.firstName} {formData.lastName}
                                    </h5>
                                    <p className="text-xs text-blue-100">Volunteer</p>
                                  </div>
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-purple-600">CF</span>
                                  </div>
                                </div>
                                <div className="mb-4">
                                  <p className="text-xs text-blue-100">Volunteer ID</p>
                                  <p className="text-sm font-bold text-white">{volunteerId}</p>
                                </div>
                                <div className="mb-4">
                                  <p className="text-xs text-blue-100">Volunteer Since</p>
                                  <p className="text-sm font-bold text-white">{certificateDate}</p>
                                </div>
                                <div className="mb-4">
                                  <p className="text-xs text-blue-100">Areas of Interest</p>
                                  <p className="text-sm font-bold text-white">
                                    {formData.interests.slice(0, 2).join(', ')}
                                    {formData.interests.length > 2 ? '...' : ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {/* Back of card */}
                          <motion.div
                            ref={cardFlipped ? idCardRef : null}
                            className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg"
                            style={{
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                            }}
                          >
                            <div className="w-full h-full bg-white p-4 flex flex-col">
                              <div className="flex justify-between items-center mb-4">
                                <h5 className="text-lg font-bold text-purple-700">Community First</h5>
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">CF</span>
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-xs text-gray-600">Address</p>
                                <p className="text-sm text-gray-800">{formData.address}</p>
                              </div>

                              <div className="mb-4">
                                <p className="text-xs text-gray-600">Contact</p>
                                <p className="text-sm text-gray-800">{formData.email}</p>
                                <p className="text-sm text-gray-800">{formData.phone}</p>
                              </div>

                              <div className="mb-4">
                                <p className="text-xs text-gray-600">Skills</p>
                                <p className="text-sm text-gray-800">
                                  {formData.skills.slice(0, 3).join(', ')}
                                  {formData.skills.length > 3 ? '...' : ''}
                                </p>
                              </div>

                              <div className="mt-auto">
                                <QRCodeCanvas
                                  value={`https://example.com/verify/${volunteerId}`}
                                  size={80}
                                  renderAs="svg"
                                  className="mx-auto"
                                />
                                <p className="text-xs text-center text-gray-500 mt-2">
                                  Scan to verify volunteer status
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Form header with progress indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Volunteer Registration</h3>
                  <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}</p>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Form steps */}
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full p-3 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full p-3 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full p-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="Enter your email address"
                        />
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className={`w-full p-3 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="Enter your complete address"
                        />
                        {formErrors.address && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Areas of Interest *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {interestOptions.map((interest) => (
                            <div key={interest} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`interest-${interest}`}
                                checked={formData.interests.includes(interest)}
                                onChange={() => handleCheckboxChange('interests', interest)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <label htmlFor={`interest-${interest}`} className="ml-2 text-sm text-gray-700">
                                {interest}
                              </label>
                            </div>
                          ))}
                        </div>
                        {formErrors.interests && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.interests}</p>
                        )}
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Availability *
                        </label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className={`w-full p-3 border ${formErrors.availability ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        >
                          <option value="">Select your availability</option>
                          {availabilityOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {formErrors.availability && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.availability}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commitment Type
                        </label>
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="one-time"
                              name="commitmentType"
                              value="one-time"
                              checked={formData.commitmentType === 'one-time'}
                              onChange={handleChange}
                              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <label htmlFor="one-time" className="ml-2 text-sm text-gray-700">
                              One-time
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="recurring"
                              name="commitmentType"
                              value="recurring"
                              checked={formData.commitmentType === 'recurring'}
                              onChange={handleChange}
                              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
                              Recurring
                            </label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skills (Select all that apply)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {skillOptions.map((skill) => (
                            <div key={skill} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`skill-${skill}`}
                                checked={formData.skills.includes(skill)}
                                onChange={() => handleCheckboxChange('skills', skill)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <label htmlFor={`skill-${skill}`} className="ml-2 text-sm text-gray-700">
                                {skill}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                          Previous Volunteer Experience
                        </label>
                        <textarea
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Briefly describe your previous volunteer experience"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Languages Known
                        </label>
                        <select
                          multiple
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
                            setFormData({ ...formData, languages: selectedOptions });
                          }}
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Kannada">Kannada</option>
                          <option value="Malayalam">Malayalam</option>
                          <option value="Marathi">Marathi</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="Urdu">Urdu</option>
                          <option value="Other">Other</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple languages</p>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Photo *
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'photo')}
                            className="hidden"
                          />
                          <label
                            htmlFor="photo"
                            className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 cursor-pointer"
                          >
                            {formData.photoPreview ? (
                              <img
                                src={formData.photoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="text-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-gray-400 mx-auto mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                <span className="text-sm text-gray-500">Click to upload</span>
                              </div>
                            )}
                          </label>
                          <div>
                            <p className="text-sm text-gray-700 mb-2">Requirements:</p>
                            <ul className="text-xs text-gray-500 list-disc pl-5">
                              <li>Passport-sized photo</li>
                              <li>Clear face visibility</li>
                              <li>Max size: 2MB</li>
                              <li>Formats: JPG, PNG</li>
                            </ul>
                          </div>
                        </div>
                        {formErrors.photo && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.photo}</p>
                        )}
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aadhaar Card Upload *
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            id="aadhaarCard"
                            name="aadhaarCard"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, 'aadhaarCard')}
                            className="hidden"
                          />
                          <label
                            htmlFor="aadhaarCard"
                            className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 cursor-pointer"
                          >
                            {formData.aadhaarCardPreview ? (
                              formData.aadhaarCardPreview.includes('application/pdf') ? (
                                <div className="text-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-red-500 mx-auto mb-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  <span className="text-sm text-gray-500">PDF Uploaded</span>
                                </div>
                              ) : (
                                <img
                                  src={formData.aadhaarCardPreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              )
                            ) : (
                              <div className="text-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-gray-400 mx-auto mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                <span className="text-sm text-gray-500">Click to upload</span>
                              </div>
                            )}
                          </label>
                          <div>
                            <p className="text-sm text-gray-700 mb-2">Requirements:</p>
                            <ul className="text-xs text-gray-500 list-disc pl-5">
                              <li>Clear and legible</li>
                              <li>All corners visible</li>
                              <li>Max size: 5MB</li>
                              <li>Formats: JPG, PNG, PDF</li>
                            </ul>
                          </div>
                        </div>
                        {formErrors.aadhaarCard && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.aadhaarCard}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="consent"
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label htmlFor="consent" className="ml-2 text-sm text-gray-700">
                            I consent to the processing of my personal data in accordance with the privacy policy.
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-xl font-bold text-gray-800 mb-4">Review Your Information</h4>

                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h5 className="font-bold text-gray-700 mb-2">Personal Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-gray-800">
                              {formData.firstName} {formData.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800">{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-800">{formData.phone || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-gray-800">{formData.address}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h5 className="font-bold text-gray-700 mb-2">Volunteer Preferences</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Areas of Interest</p>
                            <p className="text-gray-800">
                              {formData.interests.length > 0
                                ? formData.interests.join(', ')
                                : 'None selected'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Availability</p>
                            <p className="text-gray-800">{formData.availability}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Commitment Type</p>
                            <p className="text-gray-800">
                              {formData.commitmentType === 'one-time' ? 'One-time' : 'Recurring'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h5 className="font-bold text-gray-700 mb-2">Skills & Experience</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Skills</p>
                            <p className="text-gray-800">
                              {formData.skills.length > 0
                                ? formData.skills.join(', ')
                                : 'None selected'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Languages</p>
                            <p className="text-gray-800">
                              {formData.languages.length > 0
                                ? formData.languages.join(', ')
                                : 'None selected'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Previous Experience</p>
                          <p className="text-gray-800">{formData.experience || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h5 className="font-bold text-gray-700 mb-2">Uploaded Documents</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Profile Photo</p>
                            {formData.photoPreview ? (
                              <div className="w-20 h-20 mt-2 rounded-lg overflow-hidden">
                                <img
                                  src={formData.photoPreview}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <p className="text-red-500">Not uploaded</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Aadhaar Card</p>
                            {formData.aadhaarCardPreview ? (
                              <p className="text-green-600">Uploaded ✓</p>
                ) : (
                  <p className="text-red-500">Not uploaded</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-6">
            <p>By submitting this form, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
    <div className="flex justify-between mt-8">
      {currentStep > 1 && (
        <motion.button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Previous
        </motion.button>
      )}
      {currentStep < steps.length && (
        <motion.button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 ml-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      )}
      {currentStep === steps.length && (
        <motion.button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 ml-auto flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Submit'}
        </motion.button>
      )}
    </div>
  </form>

  {/* Form steps indicator */}
  <div className="mt-8">
    <div className="flex justify-between">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= step.id ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
            animate={{
              scale: currentStep === step.id ? 1.2 : 1,
              backgroundColor: currentStep >= step.id ? '#8B5CF6' : '#E5E7EB',
            }}
            transition={{ duration: 0.3 }}
          >
            {currentStep > step.id ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step.id
            )}
          </motion.div>
          <p className="text-xs text-gray-500 mt-1 hidden md:block">{step.title}</p>
        </div>
      ))}
    </div>
    <div className="relative flex justify-between mt-2">
      <div className="absolute top-0 h-0.5 bg-gray-200 w-full z-0"></div>
      <motion.div
        className="absolute top-0 h-0.5 bg-purple-600 z-0"
        initial={{ width: '0%' }}
        animate={{ width: `${(Math.max(1, currentStep - 1) / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.3 }}
      ></motion.div>
    </div>
  </div>
</motion.div>
)}
</AnimatePresence>
</div>
</section>
);
};

export default SignupFormSection;