import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import likeOutline from '/thumb-up-outline.svg';
import unlikeOutline from '/thumb-down-outline.svg';
import like from '/thumb-up.svg';
import unlike from '/thumb-down.svg';
import { Author } from './ArticlesList';

interface CommentProps {
  id: string;
  author: Author;
  date: string;
  description: string;
  likes: number;
  unlikes: number;
  reaction: string;
}

const Comment: React.FC<CommentProps> = ({ id, author, date, description, likes, unlikes, reaction }) => {
  const [liked, setLiked] = useState<boolean>(reaction === 'like');
  const [unliked, setUnliked] = useState<boolean>(reaction === 'unlike');
  const [likeCount, setLikeCount] = useState<number>(likes);
  const [unlikeCount, setUnlikeCount] = useState<number>(unlikes);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLiked(reaction === 'like');
    setUnliked(reaction === 'unlike');
  }, [reaction]);

  const handleReaction = async (newReaction: 'like' | 'unlike') => {
    if (!token) {
      localStorage.setItem('lastPath', location.pathname);
      navigate('/register');
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/api/comments/comment_${id}/${newReaction}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
        console.log('Comment after reaction:', data.comment);

      if (newReaction === 'like') {
        if (liked) {
          setLiked(false);
          setLikeCount(likeCount - 1);
        } else {
          setLiked(true);
          setLikeCount(likeCount + 1);
          if (unliked) {
            setUnliked(false);
            setUnlikeCount(unlikeCount - 1);
          }
        }
      } else if (newReaction === 'unlike') {
        if (unliked) {
          setUnliked(false);
          setUnlikeCount(unlikeCount - 1);
        } else {
          setUnliked(true);
          setUnlikeCount(unlikeCount + 1);
          if (liked) {
            setLiked(false);
            setLikeCount(likeCount - 1);
          }
        }
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  return (
    <div className="article-comments">
      <h3>{author.firstName} {author.lastName}</h3>
      <p className='article-date'>{date}</p>
      <p>{description}</p>
      <div className="like-buttons">
        <button onClick={() => handleReaction('like')}>
          <img src={liked ? like : likeOutline} alt={liked ? 'liked' : 'like'} />
          <span>{likeCount}</span>
        </button>
        <button onClick={() => handleReaction('unlike')}>
          <img src={unliked ? unlike : unlikeOutline} alt={unliked ? 'unliked' : 'unlike'} />
          <span>{unlikeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default Comment;