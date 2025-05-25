import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Sidebar from '../components/Sidebar';
import AI from '../assets/AI.jpg';
import Education from '../assets/educ.jpg';
import Tools from '../assets/tools.jpg';
import Advisors from '../assets/advisor.jpg';

function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Financial Advisor AI. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatBoxWidth, setChatBoxWidth] = useState(384); // default 24rem (Tailwind w-96)
  const [chatBoxHeight, setChatBoxHeight] = useState(384); // default 24rem (Tailwind h-96)
  const [isResizing, setIsResizing] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Auth Guard: Check if the user is authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/'); 
    }
  }, [navigate]);

  // Fetch the user's name from the Django backend
  useEffect(() => {
    const fetchUserName = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }
  
      try {
        const response = await fetch('http://127.0.0.1:8000/accounts/api/user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include', // Include cookies if using session-based auth
        });
  
        if (response.ok) {
          const data = await response.json();
          setUserName(data.username); // Set the username from the backend
        } else if (response.status === 401) {
          console.error('Unauthorized: Invalid or expired token');
          navigate('/'); // Redirect to login page
        } else {
          console.error('Failed to fetch user details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserName();
  }, [navigate]);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const startResizing = (e: React.MouseEvent) => {
  e.preventDefault();
  setIsResizing(true);
};

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    // Calculate new width and height based on mouse position
    if (chatBoxRef.current) {
      const rect = chatBoxRef.current.getBoundingClientRect();
      const newWidth = Math.max(320, e.clientX - rect.left); // min width 320px
      const newHeight = Math.max(320, rect.bottom - e.clientY); // min height 320px
      setChatBoxWidth(newWidth);
      setChatBoxHeight(newHeight);
    }
  };
  const handleMouseUp = () => setIsResizing(false);

  if (isResizing) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}, [isResizing]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('username');
    alert('You have been logged out.');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Dark Mode Toggler */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded transition flex items-center justify-center"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-16">
        {/* Hero Section */}
        <section className="mt-9 text-center bg-blue-500 dark:bg-blue-700 text-white py-16 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome back, {userName}!</h1>
          <p className="text-lg mb-6">Learn, plan, and grow with expert-backed financial insights and AI-powered advice.</p>
          <div className="space-x-4">
            <button className="bg-white dark:bg-gray-800 text-blue-500 dark:text-white px-6 py-2 rounded-md font-bold hover:bg-gray-100 dark:hover:bg-gray-700">
              Get Started
            </button>
            <button
              className="bg-blue-600 dark:bg-blue-800 px-6 py-2 rounded-md font-bold hover:bg-blue-700 dark:hover:bg-blue-900"
              onClick={() => setShowChat(true)}
            >
              Talk to Our AI Advisor
            </button>
          </div>
        </section>

        {/* Key Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={AI}
              alt="AI-Powered Financial Advice"
              className="h-24 w-24 object-cover rounded-full mb-4 shadow"
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI-Powered Financial Advice</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">Get personalized advice from our AI advisor to achieve your financial goals.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={Education}
              alt="Educational Resources"
              className="h-24 w-24 object-cover rounded-full mb-4 shadow"
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Educational Resources</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">Access videos, blogs, and courses to boost your financial literacy.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={Tools}
              alt="Budgeting Tools"
              className="h-24 w-24 object-cover rounded-full mb-4 shadow"
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Budgeting Tools</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">Use our tools to manage your budget and investments.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={Advisors}
              alt="Certified Advisors"
              className="h-24 w-24 object-cover rounded-full mb-4 shadow"
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Certified Advisors</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">Combine AI insights with certified financial advisors for expert guidance.</p>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="text-center bg-gray-200 dark:bg-gray-800 py-12 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Join our mailing list for tips, updates, and free tools to help you achieve your financial goals.
          </p>
          <form className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 dark:bg-blue-700 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-600 dark:hover:bg-blue-800"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* Footer */}
      <footer className="bg-white-200 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/neri.jetross.axle" className="hover:text-dark dark:hover:text-white">Facebook</a>
              <a href="https://x.com/JetrossG" className="hover:text-dark dark:hover:text-white">Twitter</a>
              <a href="https://www.linkedin.com/in/jetross-galinato-141ba5361/" className="hover:text-dark dark:hover:text-white">LinkedIn</a>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPrivacy(true)}
                className="hover:text-dark dark:hover:text-white underline"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setShowTerms(true)}
                className="hover:text-dark dark:hover:text-white underline"
              >
                Terms of Service
              </button>
            </div>

            {/* Contact Info */}
            <div>
              <p>Contact us: <a href="mailto:support@finteach.com" className="hover:text-dark dark:hover:text-white">support@finteach.com</a></p>
            </div>
          </div>
        </div>
      </footer>
      {/* Privacy Policy Dialog */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold dark:text-gray-300 mb-4">Privacy Policy</h2>
            <div className="mb-6 text-gray-700 dark:text-gray-300 max-h-80 overflow-y-auto">
              <p>
                <strong>Effective Date:</strong> May 24, 2025
              </p>
              <p className="mt-2">
                We value your privacy. FinTeach collects only the information necessary to provide you with our services, such as your name, email address, and financial preferences. We do not sell or share your personal data with third parties except as required by law or to provide our core services.
              </p>
              <p className="mt-2">
                All data is stored securely and access is restricted to authorized personnel only. You may request to view, update, or delete your data at any time by contacting us at <a href="mailto:support@finteach.com" className="underline">support@finteach.com</a>.
              </p>
              <p className="mt-2">
                By using FinTeach, you consent to this privacy policy.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Dialog */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold dark:text-gray-300 mb-4">Terms of Service</h2>
            <div className="mb-6 text-gray-700 dark:text-gray-300 max-h-80 overflow-y-auto">
              <p>
                <strong>Effective Date:</strong> May 24, 2025
              </p>
              <p className="mt-2">
                By accessing or using FinTeach, you agree to abide by these terms. You must be at least 18 years old to use our services. You are responsible for maintaining the confidentiality of your account information.
              </p>
              <p className="mt-2">
                FinTeach provides educational content and tools for informational purposes only. We do not provide financial, legal, or tax advice. Always consult a qualified professional before making financial decisions.
              </p>
              <p className="mt-2">
                We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the new terms.
              </p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* AI Chatbox */}
      {showChat && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-0 right-0 z-50 bg-white dark:bg-gray-800 border-l border-t border-gray-300 dark:border-gray-700 rounded-tl-lg shadow-lg flex flex-col"
          style={{
            width: `${chatBoxWidth}px`,
            height: `${chatBoxHeight}px`,
            minWidth: '320px',
            minHeight: '320px',
            maxWidth: '100vw',
            maxHeight: '100vh',
            transition: isResizing ? 'none' : 'width 0.1s, height 0.1s'
          }}
        >
          {/* Draggable/Resizable Handle */}
          <div
            onMouseDown={startResizing}
            className="absolute top-0 left-0 z-50 cursor-nwse-resize bg-blue-500 rounded-tl-lg"
            style={{ width: 20, height: 20 }}
            title="Drag to resize"
          ></div>
          {/* Chatbox header and rest of your chatbox code... */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="font-bold text-gray-800 dark:text-gray-200">AI Financial Advisor</span>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-red-500 text-xl font-bold"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`px-3 py-2 rounded-lg text-sm max-w-xs
                  ${msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 animate-pulse">
                  AI is typing...
                </div>
              </div>
            )}
          </div>
          <form
            className="flex p-4 border-t border-gray-200 dark:border-gray-700"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!chatInput.trim()) return;
              const userMessage = chatInput;
              setChatMessages((msgs) => [...msgs, { sender: 'user', text: userMessage }]);
              setChatInput('');
              setIsLoading(true);

              // Call your AI backend here
              try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('http://127.0.0.1:8000/accounts/api/ai-chat/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ message: userMessage }),
                });
                const data = await response.json();
                const aiReply = data.reply || "I'm here to help with financial topics. Please ask a finance-related question!";
                setChatMessages((msgs) => [...msgs, { sender: 'ai', text: aiReply }]);
              } catch {
                setChatMessages((msgs) => [...msgs, { sender: 'ai', text: "Sorry, I couldn't process your request. Please try again." }]);
              }
              setIsLoading(false);
            }}
          >
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-l border border-gray-300 dark:border-gray-600 focus:outline-none"
              placeholder="Ask a financial question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded-r font-bold hover:bg-blue-600 dark:hover:bg-blue-800 flex items-center justify-center"
              disabled={isLoading}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}

export default HomePage;