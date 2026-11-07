import React from 'react';
import { Component } from 'react';

// Icon mapping component
const FeatureIcon = ({ icon }) => {
  const iconMap = {
    'hammer': '🔨',
    'ruler': '📏',
    'truck': '🚚',
    'shield': '🛡️',
    'clock': '⏰',
    'award': '🏆',
    'leaf': '🍃',
    'sparkles': '✨',
    'palette': '🎨',
    'wrench': '🔧',
    'star': '⭐',
    'heart': '❤️',
    'check-circle': '✅',
    'zap': '⚡',
    'package': '📦',
    'users': '👥'
  };

  const emoji = iconMap[icon] || '⭐';

  return (
    <div className="text-4xl mb-3">
      {emoji}
    </div>
  );
};

// Banner block component
const BannerBlock = ({ data }) => {
  if (!data?.image) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <img
        src={data.image}
        alt={data.alt || 'Service banner'}
        className="w-full h-64 md:h-96 object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/api/placeholder/1200/400';
        }}
      />
    </div>
  );
};

// Heading block component
const HeadingBlock = ({ data }) => {
  if (!data?.title) return null;

  return (
    <div className="text-center py-8">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
        {data.title}
      </h2>
      {data.subtitle && (
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          {data.subtitle}
        </p>
      )}
    </div>
  );
};

// Feature strip block component
const FeatureStripBlock = ({ data }) => {
  if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) return null;

  return (
    <div className="bg-gray-100 rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.items.map((item, index) => (
          <div key={index} className="text-center">
            <FeatureIcon icon={item.icon} />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Image/Text block component
const ImageTextBlock = ({ data }) => {
  if (!data?.image || !data?.title || !data?.text) return null;

  const isImageLeft = data.imagePosition === 'left';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
      isImageLeft ? '' : 'md:grid-flow-dense'
    }`}>
      {/* Image */}
      <div className={isImageLeft ? '' : 'md:col-start-2'}>
        <img
          src={data.image}
          alt={data.alt || data.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/api/placeholder/600/400';
          }}
        />
      </div>

      {/* Text */}
      <div className={isImageLeft ? '' : 'md:col-start-1 md:row-start-1'}>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
          {data.title}
        </h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {data.text}
        </p>
      </div>
    </div>
  );
};

// Gallery block component
const GalleryBlock = ({ data }) => {
  if (!data?.images || !Array.isArray(data.images) || data.images.length < 2) return null;

  const gridCols = data.images.length === 2 ? 'md:grid-cols-2' : 
                   data.images.length === 3 ? 'md:grid-cols-3' : 
                   'md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
      {data.images.map((img, index) => (
        <div key={index} className="overflow-hidden rounded-2xl">
          <img
            src={img.image}
            alt={img.alt || `Gallery image ${index + 1}`}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/300';
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Main AdvertContent component
const AdvertContent = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8 md:space-y-12">
      {sortedBlocks.map((block) => {
        try {
          switch (block.type) {
            case 'banner':
              return <BannerBlock key={block.id} data={block.data} />;
            case 'heading':
              return <HeadingBlock key={block.id} data={block.data} />;
            case 'featureStrip':
              return <FeatureStripBlock key={block.id} data={block.data} />;
            case 'imageText':
              return <ImageTextBlock key={block.id} data={block.data} />;
            case 'gallery':
              return <GalleryBlock key={block.id} data={block.data} />;
            default:
              console.warn(`Unknown block type: ${block.type}`);
              return null;
          }
        } catch (error) {
          console.error('Error rendering block:', block.id, error);
          return null; // Fail silently, don't break the page
        }
      })}
    </div>
  );
};

// Error boundary for AdvertContent
class AdvertContentErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdvertContent error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Don't render anything if there's an error
      return null;
    }

    return this.props.children;
  }
}

// Wrapped export with error boundary
const AdvertContentWithBoundary = ({ blocks }) => (
  <AdvertContentErrorBoundary>
    <AdvertContent blocks={blocks} />
  </AdvertContentErrorBoundary>
);

export default AdvertContentWithBoundary;
