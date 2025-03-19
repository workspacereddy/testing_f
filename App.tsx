import React, { useState } from 'react';
import { MessageSquare, Stethoscope, Phone, Info, Send, Heart, Shield, Clock, Brain, ArrowLeft } from 'lucide-react';
import axios from 'axios';

// Define types
type Message = {
  text: string;
  isUser: boolean;
};

type FormData = {
  bloodPressure: string;
  bloodSugar: string;
  cholesterol: string;
  heartRate: string;
  temperature: string;
  symptoms: string;
};

function App() {
  // State management
  const [activeComponent, setActiveComponent] = useState<string>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState<FormData>({
    bloodPressure: '',
    bloodSugar: '',
    cholesterol: '',
    heartRate: '',
    temperature: '',
    symptoms: ''
  });

  // Chat functionality
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    
    try {
      const response = await axios.post('YOUR_BACKEND_URL/chat', { message: input });
      setMessages(prev => [...prev, { text: response.data.response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I'm sorry, but I'm having trouble connecting to the server. Please try again later.",
        isUser: false 
      }]);
    }
    
    setInput('');
  };

  // Health prediction functionality
  const handlePredictionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('YOUR_BACKEND_URL/predict', formData);
      alert(response.data.prediction + '\n\nRecommendations:\n' + 
            response.data.recommendations.join('\n'));
    } catch (error) {
      alert('Error getting prediction. Please try again.');
    }
  };

  // Emergency contacts data
  const emergencyContacts = [
    { name: 'Emergency Medical Services', number: '911' },
    { name: 'Poison Control', number: '1-800-222-1222' },
    { name: 'Mental Health Crisis', number: '988' },
  ];

  // Features data for introduction
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Medical Chat',
      description: 'Get instant medical guidance through our advanced AI chatbot trained on medical knowledge.'
    },
    {
      icon: Heart,
      title: 'Health Predictions',
      description: 'Receive personalized health insights and recommendations based on your medical test results.'
    },
    {
      icon: Clock,
      title: '24/7 Emergency Access',
      description: 'Quick access to emergency services and immediate medical assistance when you need it most.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data is encrypted and protected with the highest security standards.'
    }
  ];

  // Back button component
  const BackButton = () => (
    <button
      onClick={() => setActiveComponent('intro')}
      className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
    >
      <ArrowLeft className="w-6 h-6 text-indigo-600" />
    </button>
  );

  // Render different components based on activeComponent state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'chat':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <BackButton />
            <div className="max-w-4xl mx-auto pt-16">
              <h1 className="text-3xl font-bold text-indigo-900 mb-8">AI Medical Chat</h1>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="h-[600px] flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
                      >
                        <div
                          className={`inline-block p-4 rounded-lg ${
                            message.isUser
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your medical question..."
                      className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      case 'prediction':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <BackButton />
            <div className="max-w-4xl mx-auto pt-16">
              <h1 className="text-3xl font-bold text-indigo-900 mb-8">Health Prediction</h1>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <form onSubmit={handlePredictionSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Pressure (mmHg)
                      </label>
                      <input
                        type="text"
                        value={formData.bloodPressure}
                        onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
                        placeholder="120/80"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Sugar (mg/dL)
                      </label>
                      <input
                        type="number"
                        value={formData.bloodSugar}
                        onChange={(e) => setFormData({...formData, bloodSugar: e.target.value})}
                        placeholder="100"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cholesterol (mg/dL)
                      </label>
                      <input
                        type="number"
                        value={formData.cholesterol}
                        onChange={(e) => setFormData({...formData, cholesterol: e.target.value})}
                        placeholder="200"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        value={formData.heartRate}
                        onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                        placeholder="75"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms
                    </label>
                    <textarea
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                      placeholder="Describe your symptoms..."
                      className="w-full p-3 border rounded-lg h-32"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                  >
                    Get Health Prediction
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <BackButton />
            <div className="max-w-4xl mx-auto pt-16">
              <h1 className="text-3xl font-bold text-indigo-900 mb-8">Emergency Services</h1>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-red-600 font-semibold">{contact.number}</p>
                    </div>
                    <a
                      href={`tel:${contact.number}`}
                      className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Phone className="w-6 h-6" />
                    </a>
                  </div>
                ))}
                
                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Important Note</h3>
                  <p className="text-gray-700">
                    If you're experiencing a medical emergency, don't wait - call emergency services immediately.
                    These numbers are for use in the United States. If you're in another country, please use your local emergency numbers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default: // intro
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-4xl font-bold text-center text-indigo-900 mb-12">
                MediAssist AI
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  { id: 'chat', icon: MessageSquare, title: 'AI Medical Chat', color: 'indigo' },
                  { id: 'prediction', icon: Stethoscope, title: 'Health Prediction', color: 'blue' },
                  { id: 'emergency', icon: Phone, title: 'Emergency Services', color: 'red' },
                  { id: 'intro', icon: Info, title: 'About MediAssist', color: 'green' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveComponent(item.id)}
                    className={`p-8 rounded-xl shadow-lg bg-white hover:bg-${item.color}-50 transition-all transform hover:scale-105`}
                  >
                    <item.icon className={`w-12 h-12 mb-4 mx-auto text-${item.color}-600`} />
                    <h2 className="text-2xl font-semibold text-center text-gray-900">{item.title}</h2>
                  </button>
                ))}
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {features.map((feature, index) => (
                  <div key={index} className="p-6 bg-white rounded-xl shadow-lg">
                    <feature.icon className="w-10 h-10 text-indigo-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-4">Important Disclaimer</h3>
                <p className="text-gray-700">
                  MediAssist AI is designed to provide general health information and guidance. It is not a
                  substitute for professional medical advice, diagnosis, or treatment. Always seek the advice
                  of your physician or other qualified health provider with any questions you may have
                  regarding a medical condition.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderComponent();
}

export default App;
