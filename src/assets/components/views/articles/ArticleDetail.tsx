import React, { useEffect, useState, useCallback } from "react";
import ArticleSection from "./ArticleSection";
import { useParams } from "react-router-dom";
import CommentsList from "./CommentsList";
import { formatDate } from "../../../formatDate";
import { Article } from "./ArticlesList";

const ArticleDetail: React.FC = () => {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { id } = useParams<{ id: string }>();

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/article_${id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,  
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const article = await response.json();
            setArticle(article);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="article-detail-container">
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            {!loading && !article && (
                <div className="article-not-found">Article not found</div>
            )}

            {!loading && article && (
                <ArticleSection
                    title={article.title}
                    subtitle={article.subtitle}
                    description={article.description}
                    image={article.image}
                    author={article.author}
                    date={formatDate(article.date)}
                    likes={article.likes}
                >
                    <CommentsList 
                        comments={article.comments}
                        idArticle={id}
                    />
                </ArticleSection>
            )}
        </div>
    );
};

export default ArticleDetail;