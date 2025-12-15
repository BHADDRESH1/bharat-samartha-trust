'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Camera, X, Share2, Info } from 'lucide-react';
import Image from 'next/image';

// Mock events data
const events = [
  {
    id: 1,
    title: "Annual Charity Gala",
    date: "April 15, 2025",
    location: "Grand Plaza Hotel",
    image: "/images/events/gala.jpg"
  },
  {
    id: 2,
    title: "Summer Volunteer Drive",
    date: "June 10, 2025",
    location: "Central Community Park",
    image: "/images/events/volunteer.jpg"
  },
  {
    id: 3,
    title: "Fundraising Marathon",
    date: "August 22, 2025",
    location: "City Waterfront",
    image: "/images/events/marathon.jpg"
  }
];

// T-shirt size options
const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Country codes for phone
const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  { code: "+61", country: "AU" },
  { code: "+49", country: "DE" },
  // Add more as needed
];

export default function EventRegistrationForm() {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phone: "",
    dob: "",
    address: "",
    selectedEvent: "",
    shirtSize: "M",
    reason: "",
    referralCode: "",
    agreeTerms: false
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle profile picture upload
  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Remove profile picture
  const removeProfilePicture = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
    fileInputRef.current.value = "";
  };
  
  // Validate form for current step
  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be 10 digits";
      }
    }
    
    if (currentStep === 2) {
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.selectedEvent) newErrors.selectedEvent = "Please select an event";
    }
    
    if (currentStep === 3) {
      if (!formData.reason.trim()) newErrors.reason = "Please share your reason for joining";
      if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Generate registration ID
  const generateRegistrationId = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REG-${dateStr}-${randomStr}`;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      setIsSubmitting(true);
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        const newRegistrationId = generateRegistrationId();
        setRegistrationId(newRegistrationId);
        setSubmitted(true);
        setIsSubmitting(false);
        
        // Show confetti animation
        triggerConfetti();
      }, 1500);
    }
  };
  
  // Trigger confetti animation (placeholder)
  const triggerConfetti = () => {
    // Confetti animation would be implemented here
    console.log("Confetti animation triggered");
  };
  
  // Share registration
  const shareRegistration = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Event Registration',
        text: `I've registered for the ${formData.selectedEvent} event! Join me!`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      alert("Web Share API not supported in your browser");
    }
  };
  
  // Form step indicator component
  const StepIndicator = () => (
    <div className="flex justify-center items-center mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
              currentStep > index + 1 
                ? 'bg-green-500' 
                : currentStep === index + 1 
                  ? 'bg-purple-600' 
                  : 'bg-gray-300'
            }`}
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: currentStep === index + 1 ? 1.1 : 1,
              backgroundColor: currentStep > index + 1 
                ? '#10b981' 
                : currentStep === index + 1 
                  ? '#9333ea' 
                  : '#d1d5db'
            }}
            transition={{ duration: 0.3 }}
          >
            {currentStep > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
          </motion.div>
          {index < totalSteps - 1 && (
            <div className={`w-16 h-1 mx-1 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
  
  // Step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-gray-800">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`peer w-full p-4 pt-6 rounded-md border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white`}
                  placeholder=" "
                />
                <label
                  htmlFor="firstName"
                  className="absolute left-4 top-5 text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600"
                >
                  First Name
                </label>
                {errors.firstName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`peer w-full p-4 pt-6 rounded-md border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white`}
                  placeholder=" "
                />
                <label
                  htmlFor="lastName"
                  className="absolute left-4 top-5 text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600"
                >
                  Last Name
                </label>
                {errors.lastName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`peer w-full p-4 pt-6 rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white`}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-5 text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600"
              >
                Email Address
              </label>
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            
            {/* Phone with Country Code */}
            <div className="relative">
              <div className="flex">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-24 p-4 pt-6 rounded-l-md border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`peer w-full p-4 pt-6 rounded-r-md border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-4 top-5 text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600"
                  >
                    Phone Number
                  </label>
                </div>
              </div>
              {errors.phone && (
                <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-gray-800">Event Details</h3>
            
            {/* Date of Birth */}
            <div className="relative">
              <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className={`peer w-full p-4 pt-6 rounded-md border ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white`}
              />
              <label
                htmlFor="dob"
                className="absolute left-4 top-2 text-xs text-purple-600"
              >
                Date of Birth
              </label>
              {errors.dob && (
                <p className="mt-1 text-red-500 text-sm">{errors.dob}</p>
              )}
            </div>
            
            {/* Address */}
            <div className="relative">
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={`peer w-full p-4 pt-6 rounded-md border ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white`}
                placeholder=" "
              />
              <label
                htmlFor="address"
                className="absolute left-4 top-5 text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600"
              >
                Address
              </label>
              {errors.address && (
                <p className="mt-1 text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            
            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Event
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setFormData({ ...formData, selectedEvent: event.title })}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      formData.selectedEvent === event.title
                        ? 'ring-4 ring-purple-500 shadow-lg scale-105'
                        : 'border border-gray-200'
                    }`}
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                        <Info className="w-8 h-8 text-gray-500" />
                        {/* Replace with Image component when you have actual images */}
                        {/* <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        /> */}
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <h4 className="font-semibold text-gray-800">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                    {formData.selectedEvent === event.title && (
                      <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {errors.selectedEvent && (
                <p className="mt-2 text-red-500 text-sm">{errors.selectedEvent}</p>
              )}
            </div>
            
            {/* T-shirt Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                T-Shirt Size (Optional)
              </label>
              <div className="flex flex-wrap gap-3">
                {shirtSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData({ ...formData, shirtSize: size })}
                    className={`py-2 px-4 rounded-full transition-all ${
                      formData.shirtSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-gray-800">Final Details</h3>
            
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Picture (Optional)
              </label>
              
              <div className="flex items-center justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicture}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500">
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-32 h-32 rounded-full bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Photo</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Reason for Joining */}
            <div className="relative">
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                className={`peer w-full p-4 pt-6 rounded-md border ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white`}
                placeholder=" "
              />
              <label
                htmlFor="reason"
                className="absolute left-4 top-5 text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600"
              >
                Why Do You Want to Join This Event?
              </label>
              {errors.reason && (
                <p className="mt-1 text-red-500 text-sm">{errors.reason}</p>
              )}
            </div>
            
            {/* Referral Code */}
            <div className="relative">
              <input
                id="referralCode"
                name="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={handleChange}
                className="peer w-full p-4 pt-6 rounded-md border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 outline-none transition-all bg-white"
                placeholder=" "
              />
              <label
                htmlFor="referralCode"
                className="absolute left-4 top-5 text-gray-500 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600"
              >
                Referral Code (Optional)
              </label>
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 border border-gray-300 rounded focus:ring-purple-500"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                  I agree to the <a href="#" className="text-purple-600 hover:text-purple-800">Terms and Conditions</a> and <a href="#" className="text-purple-600 hover:text-purple-800">Privacy Policy</a>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-red-500 text-sm">{errors.agreeTerms}</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };
  
  // Registration success component
  const RegistrationSuccess = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
      <p className="text-lg text-gray-600 mb-6">Thank you for registering for {formData.selectedEvent}.</p>
      
      <div className="bg-purple-50 py-4 px-6 rounded-lg inline-block mb-8">
        <p className="text-sm text-gray-600 mb-1">Your Registration ID:</p>
        <p className="text-xl font-bold text-purple-700">{registrationId}</p>
      </div>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-3">A confirmation email has been sent to:</p>
        <p className="font-semibold text-gray-800">{formData.email}</p>
      </div>
      
      <div className="space-y-4">
        <button 
          type="button"
          className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          onClick={() => window.print()}
        >
          Download Confirmation
        </button>
        
        <button 
          type="button"
          className="w-full sm:w-auto px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center mx-auto gap-2"
          onClick={shareRegistration}
        >
          <Share2 className="w-5 h-5" />
          Share Registration
        </button>
      </div>
    </motion.div>
  );
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 py-8 px-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Event Registration</h2>
            <p>Join us for an amazing experience</p>
          </div>
          
          <div className="p-6 md:p-8">
            {submitted ? (
              <RegistrationSuccess />
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step indicator */}
                <StepIndicator />
                
                {/* Form content based on current step */}
                {renderStepContent()}
                
                {/* Form navigation buttons */}
                <div className="mt-8 flex justify-between">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Previous
                    </motion.button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors ml-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all ml-auto flex items-center gap-2"
                     // ... (previous code continues)

                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.98 }}
                     disabled={isSubmitting}
                   >
                     {isSubmitting ? (
                       <div className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         Submitting...
                       </div>
                     ) : (
                       "Submit"
                     )}
                   </motion.button>
                 )}
               </div>
             </form>
           )}
         </div>
       </motion.div>
     </div>
   </section>
 );
}