import './RailSkeleton.css';

/**
 * Loading skeleton for rail components
 * @param {Object} props
 * @param {string} [props.variant='hero'] - 'hero' | 'category' | 'mini'
 * @param {number} [props.count=4] - Number of card skeletons to show
 */
const RailSkeleton = ({ variant = 'hero', count = 4 }) => {
  return (
    <div className="rail-skeleton">
      <div className="rail-skeleton__header">
        <div className="rail-skeleton__title" />
      </div>
      
      <div className="rail-skeleton__content">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={`card-skeleton card-skeleton--${variant}`}>
            <div className="card-skeleton__image" />
            {variant !== 'hero' && (
              <div className="card-skeleton__content">
                <div className="card-skeleton__line card-skeleton__line--title" />
                <div className="card-skeleton__line card-skeleton__line--short" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RailSkeleton;
