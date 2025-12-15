'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  BookOpen, 
  Award, 
  MessageSquare, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  File,
  Image,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import { safeFetch } from '@/lib/fetchUtils';

interface Volunteer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  interests: string[];
  availability: string;
  commitmentType: string;
  skills: string[];
  experience: string;
  languages: string[];
  aadhaarCardPath: string;
  photoPath: string;
  volunteerId: string;
  certificateDate?: string;
  badgeLevel?: string;
  createdAt: string;
  updatedAt: string;
  status?: 'pending' | 'approved' | 'rejected'; // Add status field to your schema if needed
}

export default function AdminVolunteerSignupsPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  // Fetch volunteers from API
  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await safeFetch('/api/vsignup');
      if (!res.success) throw new Error(res.error || 'Failed to fetch volunteers');
      const data = res.data || [];
      
      // Transform data to match expected format
      const transformedData = data.map((volunteer: any) => ({
        ...volunteer,
        id: volunteer._id, // For backward compatibility
        signupDate: volunteer.createdAt,
        lastUpdated: volunteer.updatedAt,
        aadhaarCard: volunteer.aadhaarCardPath,
        photo: volunteer.photoPath,
        status: volunteer.status || 'pending', // Default to pending if not set
      }));
      
      setVolunteers(transformedData);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setError('Failed to load volunteer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.volunteerId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || volunteer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const updateVolunteerStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await safeFetch(`/api/vsignup/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to update volunteer status');
      }

      // Update local state
      setVolunteers(prev => 
        prev.map(v => 
          v._id === id ? { 
            ...v, 
            status, 
            lastUpdated: new Date().toISOString() 
          } : v
        )
      );

      if (selectedVolunteer && selectedVolunteer._id === id) {
        setSelectedVolunteer(prev => prev ? { ...prev, status } : null);
      }

      // Optionally close details view after action
      if (viewMode === 'details') {
        setTimeout(() => {
          setSelectedVolunteer(null);
          setViewMode('list');
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      alert('Failed to update volunteer status. Please try again.');
    }
  };

  const approveVolunteer = (id: string) => {
    updateVolunteerStatus(id, 'approved');
  };

  const rejectVolunteer = (id: string) => {
    updateVolunteerStatus(id, 'rejected');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewVolunteerDetails = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setViewMode('details');
  };

  const backToList = () => {
    setSelectedVolunteer(null);
    setViewMode('list');
  };

  const exportVolunteers = () => {
    const csv = [
      ['Volunteer ID', 'Name', 'Email', 'Phone', 'Status', 'Signup Date'].join(','),
      ...filteredVolunteers.map(v => [
        v.volunteerId,
        `${v.firstName} ${v.lastName}`,
        v.email,
        v.phone,
        v.status,
        new Date(v.signupDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchVolunteers}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Signups Management</h1>
        <p className="text-gray-600">Manage and review volunteer signups from the registration form</p>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Signups</p>
                  <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {volunteers.filter(v => v.status === 'pending').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Volunteers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {volunteers.filter(v => v.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Volunteer List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Volunteer Signups</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button 
                  onClick={exportVolunteers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading volunteer data...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volunteer ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signup Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVolunteers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No volunteers found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredVolunteers.map((volunteer) => (
                        <tr key={volunteer._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {volunteer.volunteerId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {volunteer.firstName} {volunteer.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{volunteer.email}</div>
                            <div className="text-sm text-gray-500">{volunteer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {volunteer.interests.slice(0, 2).join(', ')}
                              {volunteer.interests.length > 2 ? '...' : ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(volunteer.signupDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(volunteer.status)}`}>
                              {volunteer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button 
                              onClick={() => viewVolunteerDetails(volunteer)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {volunteer.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => approveVolunteer(volunteer._id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => rejectVolunteer(volunteer._id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Volunteer Details View */}
          {selectedVolunteer && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <button 
                    onClick={backToList}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to list
                  </button>
                </div>
                <div className="flex space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedVolunteer.status)}`}>
                    {selectedVolunteer.status}
                  </span>
                  {selectedVolunteer.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => approveVolunteer(selectedVolunteer._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button 
                        onClick={() => rejectVolunteer(selectedVolunteer._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Personal Info */}
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow">
                          <img 
                            src={selectedVolunteer.photo || '/default-avatar.png'} 
                            alt={`${selectedVolunteer.firstName} ${selectedVolunteer.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">Volunteer ID: {selectedVolunteer.volunteerId}</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            <QrCode className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-purple-100 text-purple-600 rounded-full">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-gray-900">{selectedVolunteer.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm text-gray-900">{selectedVolunteer.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="text-sm text-gray-900">{selectedVolunteer.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Signup Date</p>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedVolunteer.signupDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column - Volunteer Details */}
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-gray-900 mb-3">Volunteer Preferences</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Areas of Interest</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {selectedVolunteer.interests.map((interest, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Availability</p>
                          <p className="text-sm text-gray-900">{selectedVolunteer.availability}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Commitment Type</p>
                          <p className="text-sm text-gray-900 capitalize">{selectedVolunteer.commitmentType}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Skills & Experience</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Skills</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {selectedVolunteer.skills.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Languages</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {selectedVolunteer.languages.map((language, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Previous Experience</p>
                          <p className="text-sm text-gray-900">{selectedVolunteer.experience || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Documents */}
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Documents</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Aadhaar Card</p>
                          <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <File className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">aadhaar_card.jpg</span>
                            </div>
                            {selectedVolunteer.aadhaarCard && (
                              <a 
                                href={selectedVolunteer.aadhaarCard} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Profile Photo</p>
                          <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <Image className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">profile_photo.jpg</span>
                            </div>
                            {selectedVolunteer.photo && (
                              <a 
                                href={selectedVolunteer.photo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}