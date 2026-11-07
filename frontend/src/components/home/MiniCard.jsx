import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getServiceImageUrl } from '../../utils/imageUrl';
import './MiniCard.css';

/**
 * Compact card for secondary rails
 * @param {Object} props
 * @param {Object} props.service - Service object
 */
const MiniCard = ({ service }) => {
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

  // Handle both image formats
  const imageUrl = service.image || (service.images && service.images[0]) || 'https://via.placeholder.com/400x300?text=No+Image';

  // Get price from various possible formats
  const price = service.basePrice || service.pricing?.basePrice;

  // Get rating info
  const rating = service.ratings || service.rating;

  return (
    <div
      className="mini-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${service.title}`}
    >
      <img
        src={imageUrl}
        alt={service.title}
        className="mini-card__image"
      />
      
      <div className="mini-card__content">
        <p className="mini-card__category">{service.category}</p>
        <h3 className="mini-card__title">{service.title}</h3>
        
        <div className="mini-card__footer">
          <div className="mini-card__price">
            {price ? `₦${price.toLocaleString()}` : 'Contact'}
          </div>
          
          {rating?.average > 0 && (
            <div className="mini-card__rating">
              <Star size={12} fill="currentColor" />
              {rating.average.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCard;
