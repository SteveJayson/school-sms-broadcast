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

  // Fetch sections and templates on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For testing without authentication, we'll use a demo token
        // In production, you'd get this from login
        localStorage.setItem('token', 'demo_token');
        
        const [sectionsRes, templatesRes] = await Promise.all([
          api.get('/sections'),
          api.get('/templates')
        ]);
        setSections(sectionsRes.data);
        setTemplates(templatesRes.data);
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
      
      setSuccess(`✅ Broadcast sent! ${response.data.sent} messages delivered.`);
      setMessage('');
      setSelectedSections([]);
      setRecipientType('all');
      // After successful send
if (response.data.sent > 0) {
  setSuccess(`✅ Broadcast sent successfully! ${response.data.sent} messages would be delivered.`);
  // Show preview of SMS in UI
  setMessagePreview(message);
}
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      setError(error.response?.data?.message || 'Failed to send broadcast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        📱 Send Announcement
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          <p className="font-medium">Success</p>
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Recipient Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Recipients
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="all"
                name="recipientType"
                value="all"
                checked={recipientType === 'all'}
                onChange={() => setRecipientType('all')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="all" className="ml-2 text-sm text-gray-700">
                All Sections
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="specific"
                name="recipientType"
                value="specific"
                checked={recipientType === 'specific'}
                onChange={() => setRecipientType('specific')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="specific" className="ml-2 text-sm text-gray-700">
                Specific Sections
              </label>
            </div>
          </div>

          {recipientType === 'specific' && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {sections.map((section) => (
                <label key={section._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section._id)}
                    onChange={() => handleSectionToggle(section._id)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{section.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <button
                key={template._id}
                type="button"
                onClick={() => handleTemplateSelect(template.content)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Type your announcement message here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            {message.length} characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Sending...' : '📤 Send Broadcast'}
        </button>
      </form>
    </div>
  );
};


export default BroadcastForm;