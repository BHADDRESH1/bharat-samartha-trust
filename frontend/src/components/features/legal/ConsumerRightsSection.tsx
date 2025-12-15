'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Play, 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  DragAndDrop,
  Search,
  Filter
} from 'lucide-react';

interface ComplaintTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  useCase: string;
}

interface CaseStory {
  id: string;
  title: string;
  category: string;
  issue: string;
  resolution: string;
  timeframe: string;
  compensation: string;
  status: 'resolved' | 'ongoing' | 'dismissed';
}

export default function ConsumerRightsSection() {
  const [activeTab, setActiveTab] = useState<'consumer' | 'rti'>('consumer');
  const [selectedTemplate, setSelectedTemplate] = useState<ComplaintTemplate | null>(null);
  const [rtiForm, setRtiForm] = useState({
    department: '',
    information: '',
    reason: '',
    applicantName: '',
    address: '',
    phone: ''
  });

  const complaintTemplates: ComplaintTemplate[] = [
    {
      id: '1',
      title: 'Defective Product Complaint',
      category: 'Product Quality',
      description: 'For products that are faulty, damaged, or not working as expected',
      format: 'District Consumer Forum',
      useCase: 'Electronics, Appliances, Clothing, etc.'
    },
    {
      id: '2',
      title: 'Service Deficiency Complaint',
      category: 'Service Issues',
      description: 'For poor service quality, delayed service, or service not as promised',
      format: 'State Consumer Commission',
      useCase: 'Banking, Insurance, Telecom, Transport'
    },
    {
      id: '3',
      title: 'Online Shopping Complaint',
      category: 'E-commerce',
      description: 'For issues with online purchases, delivery problems, or return/refund issues',
      format: 'National Consumer Commission',
      useCase: 'Amazon, Flipkart, Myntra, etc.'
    },
    {
      id: '4',
      title: 'Medical Negligence Complaint',
      category: 'Healthcare',
      description: 'For medical malpractice, wrong treatment, or hospital negligence',
      format: 'Medical Consumer Forum',
      useCase: 'Hospitals, Clinics, Doctors'
    }
  ];

  const caseStories: CaseStory[] = [
    {
      id: '1',
      title: 'Faulty Refrigerator Replacement',
      category: 'Electronics',
      issue: 'Brand new refrigerator stopped working within 15 days',
      resolution: 'Consumer forum ordered replacement + compensation for spoiled food',
      timeframe: '3 months',
      compensation: '₹25,000 + new refrigerator',
      status: 'resolved'
    },
    {
      id: '2',
      title: 'Insurance Claim Rejection',
      category: 'Insurance',
      issue: 'Health insurance claim rejected without proper investigation',
      resolution: 'Forum ordered insurance company to settle claim with interest',
      timeframe: '8 months',
      compensation: '₹3,50,000 + 12% interest',
      status: 'resolved'
    },
    {
      id: '3',
      title: 'Flight Cancellation Compensation',
      category: 'Travel',
      issue: 'Flight cancelled without notice, no alternative arrangement',
      resolution: 'Airline ordered to pay compensation and provide alternative booking',
      timeframe: '4 months',
      compensation: '₹15,000 + rebooking',
      status: 'resolved'
    }
  ];

  const rtiSteps = [
    {
      step: 1,
      title: 'Identify Information',
      description: 'Clearly define what information you need from the government department',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Write Application',
      description: 'Write a simple application mentioning the specific information required',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Pay Fee',
      description: 'Pay ₹10 fee (₹2 for BPL card holders) via cash, DD, or online',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Submit to PIO',
      description: 'Submit application to Public Information Officer of concerned department',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 5,
      title: 'Get Response',
      description: 'Response should be provided within 30 days (48 hours for life/liberty issues)',
      icon: <Clock className="w-6 h-6" />
    }
  ];

  const handleRTISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle RTI form submission
    console.log('RTI Form submitted:', rtiForm);
    alert('RTI application template generated! Check your downloads.');
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Consumer Rights & RTI Filing
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empower yourself with consumer protection laws and Right to Information filing guides
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('consumer')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'consumer'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Consumer Rights
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rti')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'rti'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              RTI Filing
            </div>
          </button>
        </div>
      </div>

      {/* Consumer Rights Section */}
      {activeTab === 'consumer' && (
        <div className="space-y-8">
          {/* Consumer Court Process */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">Consumer Court Process Guide</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { step: 1, title: 'Identify Issue', desc: 'Product defect or service deficiency' },
                { step: 2, title: 'Gather Evidence', desc: 'Bills, photos, communication records' },
                { step: 3, title: 'Write Complaint', desc: 'Use our templates or hire lawyer' },
                { step: 4, title: 'Pay Court Fee', desc: 'Nominal fee based on claim amount' },
                { step: 5, title: 'File & Follow', desc: 'Submit complaint and track progress' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-800 mb-3">Court Jurisdiction by Claim Amount:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-bold text-gray-800">District Forum</h5>
                  <p className="text-blue-600 font-bold">Up to ₹1 Crore</p>
                  <p className="text-gray-600">Local district level</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-bold text-gray-800">State Commission</h5>
                  <p className="text-green-600 font-bold">₹1 Crore - ₹10 Crore</p>
                  <p className="text-gray-600">State level appeals</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-bold text-gray-800">National Commission</h5>
                  <p className="text-red-600 font-bold">Above ₹10 Crore</p>
                  <p className="text-gray-600">Supreme consumer court</p>
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Templates */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">Sample Complaint Letters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complaintTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800">{template.title}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Format: {template.format}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Use for: {template.useCase}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Download Template
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Preview
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Case Outcome Visualizer */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800">Success Stories & Case Outcomes</h3>
            </div>

            <div className="space-y-6">
              {caseStories.map((caseStory, index) => (
                <motion.div
                  key={caseStory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-green-500 bg-green-50 p-6 rounded-r-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{caseStory.title}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {caseStory.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium capitalize">{caseStory.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-bold text-gray-800 mb-2">The Issue:</h5>
                      <p className="text-gray-700 mb-4">{caseStory.issue}</p>
                      
                      <h5 className="font-bold text-gray-800 mb-2">Resolution:</h5>
                      <p className="text-gray-700">{caseStory.resolution}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-800">Time Taken:</span>
                        </div>
                        <p className="text-blue-600 font-bold">{caseStory.timeframe}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-800">Compensation:</span>
                        </div>
                        <p className="text-green-600 font-bold">{caseStory.compensation}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RTI Section */}
      {activeTab === 'rti' && (
        <div className="space-y-8">
          {/* RTI Process Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">RTI Filing Process</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {rtiSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-blue-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {step.step}
                  </div>
                  <div className="mb-3 text-blue-600">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2">Important RTI Guidelines:</h4>
                  <ul className="space-y-1 text-yellow-700 text-sm">
                    <li>• Information should be available with the public authority</li>
                    <li>• Cannot ask for personal opinions or suggestions</li>
                    <li>• Questions should be specific and clear</li>
                    <li>• File number or reference should be mentioned if known</li>
                    <li>• Appeals can be filed if information is denied</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RTI Application Generator */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">RTI Application Generator</h3>
            </div>

            <form onSubmit={handleRTISubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Government Department/Office
                  </label>
                  <select
                    value={rtiForm.department}
                    onChange={(e) => setRtiForm({...rtiForm, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="education">Education Department</option>
                    <option value="health">Health Department</option>
                    <option value="police">Police Department</option>
                    <option value="municipal">Municipal Corporation</option>
                    <option value="electricity">Electricity Board</option>
                    <option value="transport">Transport Department</option>
                    <option value="revenue">Revenue Department</option>
                    <option value="other">Other (Specify in application)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={rtiForm.applicantName}
                    onChange={(e) => setRtiForm({...rtiForm, applicantName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address
                </label>
                <textarea
                  value={rtiForm.address}
                  onChange={(e) => setRtiForm({...rtiForm, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your complete address with PIN code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={rtiForm.phone}
                  onChange={(e) => setRtiForm({...rtiForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Information Required (Be Specific)
                </label>
                <textarea
                  value={rtiForm.information}
                  onChange={(e) => setRtiForm({...rtiForm, information: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Clearly describe what information you need. Be specific with dates, file numbers, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Information (Optional)
                </label>
                <textarea
                  value={rtiForm.reason}
                  onChange={(e) => setRtiForm({...rtiForm, reason: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief reason why you need this information (optional but recommended)"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generate RTI Application
                </button>
                <div className="text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Application will be generated as a downloadable PDF
                </div>
              </div>
            </form>
          </div>

          {/* RTI Fee Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800">RTI Fee Structure</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-3">Application Fee</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>General Category:</span>
                    <span className="font-bold">₹10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BPL Card Holders:</span>
                    <span className="font-bold">₹2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SC/ST Applicants:</span>
                    <span className="font-bold">Free</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-3">Additional Charges</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Per A4 Page Copy:</span>
                    <span className="font-bold">₹2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection per Hour:</span>
                    <span className="font-bold">₹5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CD/DVD Copy:</span>
                    <span className="font-bold">₹50</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-bold text-green-800 mb-3">Appeal Fee</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>First Appeal:</span>
                    <span className="font-bold">₹10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Second Appeal:</span>
                    <span className="font-bold">₹10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BPL Card Holders:</span>
                    <span className="font-bold">Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RTI Sample Applications */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-8 h-8 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">Sample RTI Applications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Property Records',
                  description: 'Land records, mutation details, ownership history',
                  category: 'Revenue',
                  downloads: '25K+'
                },
                {
                  title: 'Police Verification',
                  description: 'Status of police verification, background check',
                  category: 'Police',
                  downloads: '18K+'
                },
                {
                  title: 'Education Certificates',
                  description: 'School records, mark sheets, certificates status',
                  category: 'Education',
                  downloads: '30K+'
                },
                {
                  title: 'Government Job Status',
                  description: 'Application status, selection process details',
                  category: 'Employment',
                  downloads: '22K+'
                },
                {
                  title: 'Healthcare Facilities',
                  description: 'Hospital records, medical facility information',
                  category: 'Health',
                  downloads: '15K+'
                },
                {
                  title: 'Development Projects',
                  description: 'Road construction, public works progress',
                  category: 'Public Works',
                  downloads: '12K+'
                }
              ].map((sample, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-gray-800">{sample.title}</h4>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {sample.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{sample.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{sample.downloads} downloads</span>
                    <button className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Video Tutorial */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">RTI Filing Tutorial</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="font-bold text-gray-800 mb-4">Watch Step-by-Step RTI Filing Process</h4>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    How to identify the right department
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Writing effective RTI applications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Online and offline submission process
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    What to do if information is denied
                  </li>
                </ul>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Watch Tutorial
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">RTI Filing Demo Video</p>
                    <p className="text-sm text-gray-500">Duration: 15 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedTemplate.title}</h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {selectedTemplate.category}
                </span>
              </div>

              <p className="text-gray-600">{selectedTemplate.description}</p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Template Preview:</h4>
                <div className="text-sm text-gray-700 space-y-2 font-mono bg-white p-4 rounded border">
                  <p>To,</p>
                  <p>The Registrar,</p>
                  <p>{selectedTemplate.format}</p>
                  <p>[Address]</p>
                  <br />
                  <p>Subject: Consumer Complaint regarding {selectedTemplate.category}</p>
                  <br />
                  <p>Sir/Madam,</p>
                  <br />
                  <p>I, [Your Name], am filing this complaint against [Company/Shop Name]...</p>
                  <p className="text-gray-500">[Template continues with proper legal format]</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                  Download Full Template
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  Email Template
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}