import React, { useEffect, useState } from 'react';
import ArticleItem from './ArticleItem';
import { formatDate } from '../../../formatDate';

export interface Author {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Comments {
  _id: string;
  author: Author;
  text: string;
  date: string;
  likes: string[];
  unlikes: string[];
  reaction: string;
}

export interface Article {
  _id: number;
  image: string;
  date: string;
  title: string;
  subtitle: string;
  author: Author;
  likes?: number;
  description?: string;
  comments?: Comments[];
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const articles = await response.json();
      setArticles(articles);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className='articles-list'>
      {articles.map((article) => (
        <ArticleItem
          key={article._id}
          id={article._id}
          image={article.image}
          date={formatDate(article.date)}
          title={article.title}
          subtitle={article.subtitle}
          author={article.author}
        />
      ))}
    </section>
  );
};

export default ArticleList;