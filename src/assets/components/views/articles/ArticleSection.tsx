import React from 'react';
import { Author } from './ArticlesList';
import DOMPurify from 'dompurify';

interface ArticleSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  author: Author;
  date: string;
  likes?: number;
  children: React.ReactNode;
}

const ArticleSection: React.FC<ArticleSectionProps> = ({ title, subtitle, description, image, author, date, likes, children }) => {
  const cleanHtmlDescription = DOMPurify.sanitize(description || '');

  return (
    <section className="article-section">
      <div className='article-image-main'>
        <img src={image} alt='cover image'/>
      </div>
      <div className="article-header">
        <h1>{title}</h1>
        <p className="article-likes">Likes: {likes}</p>
        <p className="article-date">Published on: {date}</p>
        <p className="article-author">By {author.firstName} {author.lastName}</p>
      </div>
      <p className="article-section-brief-description">{subtitle}</p>
      <section className="article-section-description" dangerouslySetInnerHTML={{ __html: cleanHtmlDescription }} />
      <section className="article-comments">
        {children}
      </section>
    </section>
  );
};

export default ArticleSection;