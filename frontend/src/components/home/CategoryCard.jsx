import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './CategoryCard.css';

/**
 * Category card for homepage rails
 * @param {Object} props
 * @param {string} props.category - Category name
 * @param {string} [props.image] - Category image URL
 * @param {number} [props.count] - Number of services
 * @param {string} [props.variant='image'] - 'image' | 'grid'
 * @param {Array} [props.subcategories] - For grid variant: [{icon, label}]
 */
const CategoryCard = ({ category, image, count, variant = 'image', subcategories = [] }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  if (variant === 'grid' && subcategories.length > 0) {
    return (
      <div
        className="category-card category-card--grid"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Browse ${category} category`}
      >
        <div className="category-card__header">
          <h3 className="category-card__title">{category}</h3>
        </div>
        <div className="category-card__grid">
          {subcategories.slice(0, 4).map((sub, index) => (
            <div key={index} className="category-card__grid-item">
              <div className="category-card__grid-icon">{sub.icon}</div>
              <div className="category-card__grid-label">{sub.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="category-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Browse ${category} category`}
    >
      {image && (
        <img
          src={image}
          alt={category}
          className="category-card__image"
        />
      )}
      <div className="category-card__content">
        <h3 className="category-card__title">{category}</h3>
        {count !== undefined && (
          <p className="category-card__count">
            {count} {count === 1 ? 'service' : 'services'}
          </p>
        )}
        <span className="category-card__link">
          Explore now <ChevronRight size={16} />
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
