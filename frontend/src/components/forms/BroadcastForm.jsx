import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const BroadcastForm = () => {
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedSections, setSelectedSections] = useState([]);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [stats, setStats] = useState({ total: 0, sections: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        localStorage.setItem('token', 'demo_token_for_testing');
        
        const [sectionsRes, templatesRes] = await Promise.all([
          api.get('/sections'),
          api.get('/templates')
        ]);
        
        setSections(sectionsRes.data);
        setTemplates(templatesRes.data);
        
        setStats({
          total: sectionsRes.data.length,
          sections: sectionsRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load data. Please refresh the page.');
      }
    };
    fetchData();
  }, []);

  const handleTemplateSelect = (templateContent) => {
    setMessage(templateContent);
  };

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message or select a template.');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSend = async () => {
    setShowConfirmation(false);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        message,
        recipientType,
        sections: recipientType === 'specific' ? selectedSections : [],
      };

      const response = await api.post('/broadcasts/send', payload);
      
      setSuccess(`✅ Broadcast sent successfully! ${response.data.sent} channel${response.data.sent !== 1 ? 's' : ''} received the message.`);
      setMessage('');
      setSelectedSections([]);
      setRecipientType('all');
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      setError(error.response?.data?.message || 'Failed to send broadcast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecipientCount = () => {
    if (recipientType === 'all') {
      return stats.sections;
    }
    return selectedSections.length;
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Sections</p>
              <p className="text-2xl font-bold text-gray-800">{stats.sections}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Channels</p>
              <p className="text-2xl font-bold text-gray-800">{stats.sections}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Selected Channels</p>
              <p className="text-2xl font-bold text-gray-800">{getRecipientCount()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 w-1 h-6 rounded-full mr-3"></span>
            Send Announcement
          </h2>
          <p className="text-sm text-gray-500 mt-1">Compose and broadcast to Telegram channels</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-slideDown">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Recipients
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${recipientType === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="recipientType"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={() => setRecipientType('all')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3 font-medium text-gray-700">All Sections</span>
                  <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{stats.sections} channels</span>
                </label>
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${recipientType === 'specific' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="recipientType"
                    value="specific"
                    checked={recipientType === 'specific'}
                    onChange={() => setRecipientType('specific')}
                    className="h-4 w-4 text-purple-600"
                  />
                  <span className="ml-3 font-medium text-gray-700">Specific Sections</span>
                </label>
              </div>

              {recipientType === 'specific' && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sections.map((section) => (
                    <label key={section._id} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedSections.includes(section._id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(section._id)}
                        onChange={() => handleSectionToggle(section._id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-700 text-sm">{section.name}</span>
                        <p className="text-xs text-gray-500">Telegram channel</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quick Templates
              </label>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template._id}
                    type="button"
                    onClick={() => handleTemplateSelect(template.content)}
                    className="group px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm font-medium hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow"
                  >
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {template.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Message
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({message.length} characters)
                </span>
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Type your announcement message here..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-700 placeholder-gray-400"
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <span className={`text-xs ${message.length > 0 ? 'text-blue-500' : 'text-gray-400'}`}>
                    {message.length > 0 ? `${message.length} characters` : 'Empty'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Broadcast
                  </span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setMessage('');
                  setError('');
                  setSuccess('');
                }}
                className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                Clear
              </button>
            </div>

            {/* Status Message */}
            {message.trim() && (
              <div className="flex items-center justify-between text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                <span>📝 Message ready to send</span>
                <span>📢 Will be sent to {getRecipientCount()} channel{getRecipientCount() !== 1 ? 's' : ''}</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-scaleIn">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Confirm Broadcast
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600 mb-3">You are about to send this message to:</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-700">
                  {recipientType === 'all' 
                    ? `All Sections (${stats.sections} channels)` 
                    : `${selectedSections.length} selected channel${selectedSections.length !== 1 ? 's' : ''}`
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {recipientType === 'all' 
                    ? `${stats.sections} Telegram channels will receive this message` 
                    : `${selectedSections.length} Telegram channel${selectedSections.length !== 1 ? 's' : ''} will receive this message`
                  }
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 max-h-24 overflow-y-auto">
                <p className="text-sm text-gray-600 italic">"{message}"</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmSend}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                Yes, Send
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BroadcastForm;