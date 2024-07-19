import React, { useState } from 'react';
import Comment from './Comment';
import NewCommentForm from './NewCommentForm';
import { Comments } from './ArticlesList';
import { formatDate } from '../../../formatDate';

interface CommentsListProps {
  comments?: Comments[] | undefined;
  idArticle: string | undefined;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments = [], idArticle }) => {
  const [commentList, setCommentList] = useState<Comments[]>(comments);

  const handleAddComment = async (description: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/article_${idArticle}/add_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({
          message: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      const newComment = await response.json();
      setCommentList([...commentList, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <NewCommentForm onAddComment={handleAddComment} />
      <h2>Comments</h2>
      {commentList.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        commentList.map((comment) => (
          <Comment
            key={comment._id}
            id={comment._id}
            author={comment.author}
            date={formatDate(comment.date, true)}
            description={comment.text}
            likes={comment.likes.length}
            unlikes={comment.unlikes.length}
            reaction={comment.reaction}
          />
        ))
      )}
    </div>
  );
};

export default CommentsList;