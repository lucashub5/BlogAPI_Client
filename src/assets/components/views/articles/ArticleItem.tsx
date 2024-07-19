import { Link } from 'react-router-dom';
import { Author } from './ArticlesList';

interface ArticleItemProps {
  id: number;
  image: string;
  date: string;
  title: string;
  subtitle: string;
  author: Author
}

const ArticleItem: React.FC<ArticleItemProps> = ({ id, image, date, title, subtitle, author }) => {
  return (
    <div className="article-item">
      <div className="article-image">
        <img src={image} alt={title} />
      </div>
      <div className="article-date">{date} by {author.firstName} {author.lastName}</div>
      <h2 className="article-title">{title}</h2>
      <p className="article-description">{subtitle}</p>
      <Link to={`/articles/${id}`}>Read more</Link>
    </div>
  );
};

export default ArticleItem;
