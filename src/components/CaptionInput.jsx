import { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';
import { getToken } from '../Services/Services/LocalStorageServices';

const CaptionInput = ({ onAddCaption }) => {
  const [text, setText] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const checkAuth = () => {
      const { access_token } = getToken();
      setIsAuthenticated(!!access_token);
    };

    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const validateInputs = () => {
    if (!text.trim()) {
      setError("Caption text is required");
      enqueueSnackbar("Caption text is required", { variant: 'error' });
      return false;
    }
    if (!timestamp) {
      setError("Timestamp is required");
      enqueueSnackbar("Timestamp is required", { variant: 'error' });
      return false;
    }
    if (isNaN(timestamp) || parseFloat(timestamp) < 0) {
      setError("Please enter a valid timestamp");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!isAuthenticated) {
      setError("Please login to add captions");
      enqueueSnackbar("Please login to add captions", { variant: 'error' });
      return;
    }

    if (validateInputs()) {
      onAddCaption({ text: text.trim(), timestamp: parseFloat(timestamp) });
      setText("");
      setTimestamp("");
      enqueueSnackbar("Caption added successfully", { variant: 'success' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Add Caption</h2>
        <div className="text-blue-400 text-sm">Step 2</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Caption Text
          </label>
          <textarea
            placeholder="Enter your caption text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-gray-900 text-white placeholder-gray-400 
                     rounded-lg px-4 py-3 border border-gray-600
                     focus:border-blue-500 focus:outline-none focus:ring-2 
                     focus:ring-blue-500/20 transition-colors duration-200
                     resize-none h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Timestamp (seconds)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 5.5"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full bg-gray-900 text-white placeholder-gray-400 
                       rounded-lg pl-4 pr-12 py-3 border border-gray-600
                       focus:border-blue-500 focus:outline-none focus:ring-2 
                       focus:ring-blue-500/20 transition-colors duration-200"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              sec
            </span>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm py-2 px-3 bg-red-500/10 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                   hover:from-blue-600 hover:to-blue-700 
                   text-white font-medium px-6 py-3 rounded-lg
                   transform transition-all duration-200 
                   hover:shadow-lg hover:shadow-blue-500/30
                   focus:outline-none focus:ring-2 focus:ring-blue-500/20
                   flex items-center justify-center space-x-2"
        >
          <span>Add Caption</span>
          <span>✨</span>
        </button>
      </form>
    </div>
  );
};

export default CaptionInput;
