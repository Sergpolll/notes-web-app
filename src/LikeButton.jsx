import React, { useState, useEffect } from 'react';

const LikeButton = ({ noteId }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // We use a free open API for counting: counterapi.dev
  const namespace = 'SerhiiNotes_v1';
  // ensure noteId is a valid string for URL
  const safeId = noteId ? noteId.replace(/[^a-zA-Z0-9-_]/g, '') : 'default';

  useEffect(() => {
    // Check if user already liked this note in this browser
    const likedNotes = JSON.parse(localStorage.getItem('likedNotes') || '{}');
    if (likedNotes[safeId]) {
      setHasLiked(true);
    }

    // Fetch initial count
    fetch(`https://api.counterapi.dev/v1/${namespace}/${safeId}/`)
      .then(res => res.json())
      .then(data => {
        setLikes(data.count || 0);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching likes', err);
        setIsLoading(false);
      });
  }, [safeId]);

  const handleLike = () => {
    if (hasLiked) return;

    // Optimistic UI update
    setLikes(prev => prev + 1);
    setHasLiked(true);
    
    const likedNotes = JSON.parse(localStorage.getItem('likedNotes') || '{}');
    likedNotes[safeId] = true;
    localStorage.setItem('likedNotes', JSON.stringify(likedNotes));

    // Send to API
    fetch(`https://api.counterapi.dev/v1/${namespace}/${safeId}/up`)
      .catch(err => console.error('Error liking', err));
  };

  return (
    <div className="like-widget">
      <button 
        className={`like-button ${hasLiked ? 'liked' : ''}`} 
        onClick={handleLike}
        disabled={isLoading || hasLiked}
      >
        <span className="heart-icon">{hasLiked ? '❤️' : '🤍'}</span>
        <span className="like-text">{hasLiked ? 'Дякую!' : 'Корисно?'}</span>
        {!isLoading && <span className="like-count">{likes}</span>}
      </button>
    </div>
  );
};

export default LikeButton;
