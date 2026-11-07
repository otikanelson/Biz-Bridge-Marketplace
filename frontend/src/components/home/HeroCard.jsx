import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getServiceImageUrl } from '../../utils/imageUrl';
import './HeroCard.css';

/**
 * Large hero card for featured services
 * @param {Object} props
 * @param {Object} props.service - Service object with title, category, pricing, rating, images, provider
 * @param {string} [props.badge] - Optional badge text (e.g., "FEATURED", "TOP RATED")
 */
const HeroCard = ({ service, badge }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${service._id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Handle both image formats: single image or images array
  const imageUrl = service.image || (service.images && service.images[0]) || 'https://via.placeholder.com/400x300?text=No+Image';

  // Get price from various possible formats
  const price = service.basePrice || service.pricing?.basePrice;

  // Get provider/artisan info
  const provider = service.artisan || service.provider;

  // Get rating info
  const rating = service.ratings || service.rating;

  return (
    <div
      className="hero-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${service.title}`}
    >
      <img
        src={imageUrl}
        alt={service.title}
        className="hero-card__image"
      />
      
      {badge && (
        <div className="hero-card__badge">{badge}</div>
      )}

      <div className="hero-card__overlay">
        <p className="hero-card__category">{service.category}</p>
        <h3 className="hero-card__title">{service.title}</h3>
        
        {provider && (
          <p className="hero-card__provider">
            by {provider.businessName || provider.contactName || provider.name}
          </p>
        )}

        <div className="hero-card__footer">
          <div className="hero-card__price">
            {price ? `₦${price.toLocaleString()}` : 'Contact for price'}
          </div>
          
          {rating?.average > 0 && (
            <div className="hero-card__rating">
              <Star size={16} fill="currentColor" />
              {rating.average.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
