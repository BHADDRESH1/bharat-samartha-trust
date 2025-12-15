'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Play, 
  Pause, 
  Volume2,
  Save,
  X,
  Eye,
  MapPin,
  User,
  Quote,
  Mic,
  Image as ImageIcon
} from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  image: string;
  cause: string;
  audio: string;
  isActive: boolean;
  dateAdded: string;
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Priya Sharma",
      location: "Rural Rajasthan",
      quote: "The healthcare camp in our village changed my life. I was able to get treatment for my chronic pain that had been troubling me for years. Now I can work and support my family again.",
      image: "/images/testimonials/priya.jpg",
      cause: "Healthcare for All",
      audio: "/audio/testimonial-priya.mp3",
      isActive: true,
      dateAdded: "2024-12-15"
    },
    {
      id: 2,
      name: "Rajan Kumar",
      location: "Slums of Mumbai",
      quote: "My daughter is the first in our family to receive an education. The free learning materials and scholarship have given her hope for a better future. She dreams of becoming a doctor.",
      image: "/images/testimonials/rajan.jpg",
      cause: "Education for Children",
      audio: "/audio/testimonial-rajan.mp3",
      isActive: true,
      dateAdded: "2024-12-14"
    },
    {
      id: 3,
      name: "Lakshmi Devi",
      location: "Coastal Tamil Nadu",
      quote: "After the vocational training program, I started my own small tailoring business. I can now earn enough to support my children and even save for their education.",
      image: "/images/testimonials/lakshmi.jpg",
      cause: "Women Empowerment",
      audio: "/audio/testimonial-lakshmi.mp3",
      isActive: true,
      dateAdded: "2024-12-13"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    quote: '',
    cause: '',
    image: '',
    audio: ''
  });

  const causes = [
    "Healthcare for All",
    "Education for Children", 
    "Women Empowerment",
    "Feeding the Hungry",
    "Environmental Sustainability"
  ];

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      quote: testimonial.quote,
      cause: testimonial.cause,
      image: testimonial.image,
      audio: testimonial.audio
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      location: '',
      quote: '',
      cause: causes[0],
      image: '',
      audio: ''
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingTestimonial) {
      setTestimonials(prev => prev.map(t => 
        t.id === editingTestimonial.id 
          ? { ...t, ...formData }
          : t
      ));
    } else {
      const newTestimonial: Testimonial = {
        id: Math.max(...testimonials.map(t => t.id)) + 1,
        ...formData,
        isActive: true,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setTestimonials(prev => [...prev, newTestimonial]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const toggleActive = (id: number) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const playAudio = (testimonial: Testimonial) => {
    if (playingAudio === testimonial.id) {
      audioRef.current?.pause();
      setPlayingAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = testimonial.audio;
        audioRef.current.play();
        setPlayingAudio(testimonial.id);
      }
    }
  };

  const stats = {
    total: testimonials.length,
    active: testimonials.filter(t => t.isActive).length,
    causes: [...new Set(testimonials.map(t => t.cause))].length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingAudio(null)}
        className="hidden"
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-2">Manage testimonials displayed in the carousel</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Quote className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Testimonials</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Causes Covered</p>
              <p className="text-3xl font-bold text-blue-600">{stats.causes}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-sm border ${testimonial.isActive ? 'border-green-200' : 'border-gray-200'} p-6`}
          >
            <div className="flex items-start gap-6">
              {/* Image */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                {testimonial.image ? (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {testimonial.location}
                    </p>
                    <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {testimonial.cause}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(testimonial.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        testimonial.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                <blockquote className="text-gray-700 italic mb-4 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => playAudio(testimonial)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      {playingAudio === testimonial.id ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Listen
                        </>
                      )}
                    </button>
                    
                    <span className="text-sm text-gray-500">
                      Added: {testimonial.dateAdded}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Rural Rajasthan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cause Category
                  </label>
                  <select
                    value={formData.cause}
                    onChange={(e) => setFormData(prev => ({ ...prev, cause: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {causes.map(cause => (
                      <option key={cause} value={cause}>{cause}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Quote className="w-4 h-4 inline mr-2" />
                    Testimonial Quote
                  </label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter the testimonial quote..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ImageIcon className="w-4 h-4 inline mr-2" />
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="/images/testimonials/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mic className="w-4 h-4 inline mr-2" />
                      Audio File URL
                    </label>
                    <input
                      type="text"
                      value={formData.audio}
                      onChange={(e) => setFormData(prev => ({ ...prev, audio: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="/audio/testimonial-..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingTestimonial ? 'Update' : 'Add'} Testimonial
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}