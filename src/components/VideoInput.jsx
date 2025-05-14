import { useState } from "react";
import { useSnackbar } from 'notistack';

const VideoInput = ({ onVideoURLChange }) => {
  const [videoURL, setVideoURL] = useState("");
  const [isValidURL, setIsValidURL] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoURL && validateURL(videoURL)) {
      onVideoURLChange(videoURL);
      setVideoURL("");
      setIsValidURL(true);
      enqueueSnackbar("watch video", { variant: 'success' });

    } else {
      setIsValidURL(false);
      enqueueSnackbar("Please enter the valid url", { variant: 'error' });

    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Video Source</h2>
        <div className="text-blue-400 text-sm">Step 1</div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Paste video URL here..."
            value={videoURL}
            onChange={(e) => {
              setVideoURL(e.target.value);
              setIsValidURL(true);
            }}
            className={`w-full bg-gray-900 text-white placeholder-gray-400 
                     rounded-lg px-4 py-3 border ${
                       isValidURL 
                         ? 'border-gray-600 focus:border-blue-500' 
                         : 'border-red-500'
                     } 
                     focus:outline-none focus:ring-2 
                     ${isValidURL ? 'focus:ring-blue-500/20' : 'focus:ring-red-500/20'}
                     transition-colors duration-200`}
          />
          {!isValidURL && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid URL
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                   hover:from-blue-600 hover:to-blue-700 
                   text-white font-medium px-6 py-3 rounded-lg
                   transform transition-all duration-200 
                   hover:shadow-lg hover:shadow-blue-500/30
                   focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          Load Video
        </button>
      </form>
    </div>
  );
};

export default VideoInput;
