import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoURL, captions, onDeleteCaption, onEditCaption }) => {
  const [currentCaption, setCurrentCaption] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTimestamp, setEditTimestamp] = useState("");
  const playerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const matchingCaption = captions.find(
          (cap) => Math.floor(cap.timestamp) === Math.floor(currentTime)
        );
        setCurrentCaption(matchingCaption ? matchingCaption.text : "");
      }
    }, 500);
    return () => clearInterval(interval);
  }, [captions]);

  const handleEditClick = (index, caption) => {
    setEditingIndex(index);
    setEditText(caption.text);
    setEditTimestamp(caption.timestamp.toString());
  };

  const handleSaveEdit = (index) => {
    if (editText && editTimestamp) {
      onEditCaption(index, {
        text: editText,
        timestamp: parseFloat(editTimestamp),
      });
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
    setEditTimestamp("");
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-white/10">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Video Preview</h2>
          <div className="relative aspect-video">
            <ReactPlayer
              ref={playerRef}
              url={videoURL}
              controls
              width="100%"
              height="100%"
              style={{ borderRadius: '0.75rem', overflow: 'hidden' }}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
            {currentCaption && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
                           bg-black/75 text-white px-6 py-3 rounded-lg
                           text-lg font-medium max-w-[80%] text-center
                           backdrop-blur-sm border border-white/10">
                {currentCaption}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Captions List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            Captions
          </h3>
          <span className="px-2 py-1 rounded-full text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {captions.length} caption{captions.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {captions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No captions added yet. Add your first caption above!
          </p>
        ) : (
          <ul className="space-y-3">
            {captions.map((cap, index) => (
              <li
                key={index}
                className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden"
              >
                {editingIndex === index ? (
                  <div className="p-4 space-y-3">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Caption text"
                    />
                    <input
                      type="number"
                      value={editTimestamp}
                      onChange={(e) => setEditTimestamp(e.target.value)}
                      step="0.1"
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Timestamp (seconds)"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-400 font-mono">
                        {cap.timestamp}s
                      </span>
                      <span className="text-white">{cap.text}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(index, cap)}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteCaption(index)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
