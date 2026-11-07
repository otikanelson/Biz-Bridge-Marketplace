import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import AdvertContent from './AdvertContent';
import { API_URL } from '../../api/config';

// Starter templates
const TEMPLATES = {
  'product-showcase': {
    name: 'Product Showcase',
    description: 'Highlight your service with stunning visuals',
    blocks: [
      {
        id: uuidv4(),
        type: 'banner',
        order: 0,
        data: { image: '', alt: 'Your service banner' }
      },
      {
        id: uuidv4(),
        type: 'heading',
        order: 1,
        data: { 
          title: 'Exceptional Craftsmanship',
          subtitle: 'Every detail matters in our work'
        }
      },
      {
        id: uuidv4(),
        type: 'featureStrip',
        order: 2,
        data: {
          items: [
            { icon: 'award', title: 'Quality Assured', text: 'Premium materials and expert workmanship' },
            { icon: 'clock', title: 'On-Time Delivery', text: 'We respect your deadlines' },
            { icon: 'shield', title: 'Guaranteed', text: 'Satisfaction or your money back' },
            { icon: 'heart', title: 'Made with Love', text: 'Crafted with passion and care' }
          ]
        }
      }
    ]
  },
  'craft-story': {
    name: 'Our Craft Story',
    description: 'Share your journey and expertise',
    blocks: [
      {
        id: uuidv4(),
        type: 'heading',
        order: 0,
        data: {
          title: 'Our Story',
          subtitle: 'Decades of experience in traditional craftsmanship'
        }
      },
      {
        id: uuidv4(),
        type: 'imageText',
        order: 1,
        data: {
          image: '',
          alt: 'Our workshop',
          title: 'Where Tradition Meets Innovation',
          text: 'For over 20 years, we have been perfecting our craft, blending traditional techniques with modern innovations to create exceptional pieces that stand the test of time.',
          imagePosition: 'left'
        }
      },
      {
        id: uuidv4(),
        type: 'imageText',
        order: 2,
        data: {
          image: '',
          alt: 'Crafting process',
          title: 'Attention to Every Detail',
          text: 'Each project receives our full attention, from initial consultation through final delivery. We take pride in understanding your vision and bringing it to life with precision and care.',
          imagePosition: 'right'
        }
      }
    ]
  },
  'why-choose-us': {
    name: 'Why Choose Us',
    description: 'Convince customers with your unique value',
    blocks: [
      {
        id: uuidv4(),
        type: 'heading',
        order: 0,
        data: {
          title: 'Why Choose Our Service',
          subtitle: 'What sets us apart from the rest'
        }
      },
      {
        id: uuidv4(),
        type: 'featureStrip',
        order: 1,
        data: {
          items: [
            { icon: 'star', title: 'Expert Craftsmen', text: 'Highly skilled and experienced team' },
            { icon: 'truck', title: 'Fast Delivery', text: 'Quick turnaround without compromising quality' },
            { icon: 'palette', title: 'Custom Designs', text: 'Tailored solutions for your needs' },
            { icon: 'users', title: 'Happy Clients', text: 'Hundreds of satisfied customers' }
          ]
        }
      },
      {
        id: uuidv4(),
        type: 'gallery',
        order: 2,
        data: {
          images: [
            { image: '', alt: 'Work sample 1' },
            { image: '', alt: 'Work sample 2' },
            { image: '', alt: 'Work sample 3' },
            { image: '', alt: 'Work sample 4' }
          ]
        }
      }
    ]
  }
};

// Available icons for feature strips
const AVAILABLE_ICONS = [
  { value: 'hammer', label: '🔨 Hammer', emoji: '🔨' },
  { value: 'ruler', label: '📏 Ruler', emoji: '📏' },
  { value: 'truck', label: '🚚 Truck', emoji: '🚚' },
  { value: 'shield', label: '🛡️ Shield', emoji: '🛡️' },
  { value: 'clock', label: '⏰ Clock', emoji: '⏰' },
  { value: 'award', label: '🏆 Award', emoji: '🏆' },
  { value: 'leaf', label: '🍃 Leaf', emoji: '🍃' },
  { value: 'sparkles', label: '✨ Sparkles', emoji: '✨' },
  { value: 'palette', label: '🎨 Palette', emoji: '🎨' },
  { value: 'wrench', label: '🔧 Wrench', emoji: '🔧' },
  { value: 'star', label: '⭐ Star', emoji: '⭐' },
  { value: 'heart', label: '❤️ Heart', emoji: '❤️' },
  { value: 'check-circle', label: '✅ Check', emoji: '✅' },
  { value: 'zap', label: '⚡ Zap', emoji: '⚡' },
  { value: 'package', label: '📦 Package', emoji: '📦' },
  { value: 'users', label: '👥 Users', emoji: '👥' }
];

const AdvertBuilder = ({ serviceId, existingContent, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingBlockId, setUploadingBlockId] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState(null);

  // Load existing content
  useEffect(() => {
    if (existingContent) {
      setBlocks(existingContent.blocks || []);
      setEnabled(existingContent.enabled || false);
    }
  }, [existingContent]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Add block
  const addBlock = (type) => {
    const newBlock = {
      id: uuidv4(),
      type,
      order: blocks.length,
      data: getDefaultBlockData(type)
    };

    setBlocks([...blocks, newBlock]);
    setHasUnsavedChanges(true);
  };

  // Get default data for block type
  const getDefaultBlockData = (type) => {
    switch (type) {
      case 'banner':
        return { image: '', alt: '' };
      case 'heading':
        return { title: '', subtitle: '' };
      case 'featureStrip':
        return {
          items: [
            { icon: 'star', title: '', text: '' },
            { icon: 'heart', title: '', text: '' },
            { icon: 'award', title: '', text: '' },
            { icon: 'shield', title: '', text: '' }
          ]
        };
      case 'imageText':
        return { image: '', alt: '', title: '', text: '', imagePosition: 'left' };
      case 'gallery':
        return {
          images: [
            { image: '', alt: '' },
            { image: '', alt: '' }
          ]
        };
      default:
        return {};
    }
  };

  // Update block data
  const updateBlockData = (blockId, newData) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, data: { ...block.data, ...newData } } : block
    ));
    setHasUnsavedChanges(true);
    // Clear error for this block
    if (errors[blockId]) {
      const newErrors = { ...errors };
      delete newErrors[blockId];
      setErrors(newErrors);
    }
  };

  // Move block up
  const moveBlockUp = (index) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    // Update order
    newBlocks.forEach((block, idx) => block.order = idx);
    setBlocks(newBlocks);
    setHasUnsavedChanges(true);
  };

  // Move block down
  const moveBlockDown = (index) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    // Update order
    newBlocks.forEach((block, idx) => block.order = idx);
    setBlocks(newBlocks);
    setHasUnsavedChanges(true);
  };

  // Duplicate block
  const duplicateBlock = (blockId) => {
    const blockToDuplicate = blocks.find(b => b.id === blockId);
    if (!blockToDuplicate) return;

    const newBlock = {
      ...blockToDuplicate,
      id: uuidv4(),
      order: blocks.length
    };

    setBlocks([...blocks, newBlock]);
    setHasUnsavedChanges(true);
  };

  // Delete block
  const deleteBlock = (blockId) => {
    setBlocks(blocks.filter(b => b.id !== blockId).map((block, idx) => ({ ...block, order: idx })));
    setHasUnsavedChanges(true);
    setBlockToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Upload image
  const uploadImage = async (file, blockId, imageKey = 'image') => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadingBlockId(blockId);

      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/services/${serviceId}/content/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      // Update block with image URL
      const block = blocks.find(b => b.id === blockId);
      if (block) {
        updateBlockData(blockId, { [imageKey]: data.url });
      }

      return data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadingBlockId(null);
    }
  };

  // Validate blocks
  const validate = () => {
    const newErrors = {};

    blocks.forEach((block, index) => {
      switch (block.type) {
        case 'banner':
          if (!block.data.image) {
            newErrors[block.id] = 'Banner image is required';
          }
          break;
        case 'heading':
          if (!block.data.title) {
            newErrors[block.id] = 'Heading title is required';
          }
          break;
        case 'featureStrip':
          if (!block.data.items || block.data.items.length === 0) {
            newErrors[block.id] = 'At least one feature item is required';
          } else {
            block.data.items.forEach((item, idx) => {
              if (!item.title || !item.text) {
                newErrors[block.id] = `Feature item ${idx + 1}: Title and text are required`;
              }
            });
          }
          break;
        case 'imageText':
          if (!block.data.image) {
            newErrors[block.id] = 'Image is required';
          }
          if (!block.data.title || !block.data.text) {
            newErrors[block.id] = 'Title and text are required';
          }
          break;
        case 'gallery':
          if (!block.data.images || block.data.images.length < 2) {
            newErrors[block.id] = 'At least 2 images are required for gallery';
          } else {
            const hasEmptyImages = block.data.images.some(img => !img.image);
            if (hasEmptyImages) {
              newErrors[block.id] = 'All gallery images must be uploaded';
            }
          }
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save content
  const handleSave = async (publishNow = false) => {
    if (!validate()) {
      alert('Please fix the errors before saving');
      return;
    }

    try {
      setIsSaving(true);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/services/${serviceId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          enabled: publishNow,
          blocks
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save content');
      }

      setHasUnsavedChanges(false);
      alert(publishNow ? 'Advert published successfully!' : 'Draft saved successfully!');
      
      if (onSave) {
        onSave(data.richContent);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete all content
  const handleDeleteContent = async () => {
    if (!confirm('Are you sure you want to remove this advert? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/services/${serviceId}/content`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      setBlocks([]);
      setEnabled(false);
      setHasUnsavedChanges(false);
      alert('Advert removed successfully');
      
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete: ${error.message}`);
    }
  };

  // Load template
  const loadTemplate = (templateKey) => {
    const template = TEMPLATES[templateKey];
    if (!template) return;

    setBlocks(template.blocks);
    setHasUnsavedChanges(true);
    setShowTemplateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advert Builder</h1>
              <p className="text-gray-600">Create a stunning advert section for your service</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕ Close
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              📋 Use Template
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving || blocks.length === 0}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving || blocks.length === 0}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {isSaving ? 'Publishing...' : '🚀 Publish Advert'}
            </button>
            {blocks.length > 0 && (
              <button
                onClick={handleDeleteContent}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition ml-auto"
              >
                🗑️ Remove Advert
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Content Blocks</h2>
              
              {/* Add Block Menu */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a block:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => addBlock('banner')}
                    disabled={blocks.length >= 12}
                    className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                  >
                    🖼️ Banner
                  </button>
                  <button
                    onClick={() => addBlock('heading')}
                    disabled={blocks.length >= 12}
                    className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                  >
                    📝 Heading
                  </button>
                  <button
                    onClick={() => addBlock('featureStrip')}
                    disabled={blocks.length >= 12}
                    className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                  >
                    ⭐ Features
                  </button>
                  <button
                    onClick={() => addBlock('imageText')}
                    disabled={blocks.length >= 12}
                    className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                  >
                    📷 Image + Text
                  </button>
                  <button
                    onClick={() => addBlock('gallery')}
                    disabled={blocks.length >= 12}
                    className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                  >
                    🎨 Gallery
                  </button>
                </div>
                {blocks.length >= 12 && (
                  <p className="text-red-600 text-sm mt-2">Maximum 12 blocks reached</p>
                )}
              </div>

              {/* Blocks List */}
              <div className="space-y-4">
                {blocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No blocks yet. Add a block to get started!</p>
                    <p className="text-sm mt-2">Or use a template for inspiration</p>
                  </div>
                ) : (
                  blocks.map((block, index) => (
                    <BlockEditor
                      key={block.id}
                      block={block}
                      index={index}
                      totalBlocks={blocks.length}
                      onUpdate={(newData) => updateBlockData(block.id, newData)}
                      onMoveUp={() => moveBlockUp(index)}
                      onMoveDown={() => moveBlockDown(index)}
                      onDuplicate={() => duplicateBlock(block.id)}
                      onDelete={() => {
                        setBlockToDelete(block.id);
                        setShowDeleteConfirm(true);
                      }}
                      onUploadImage={(file, key) => uploadImage(file, block.id, key)}
                      isUploading={isUploading && uploadingBlockId === block.id}
                      error={errors[block.id]}
                      availableIcons={AVAILABLE_ICONS}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-4 lg:h-screen lg:overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Live Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 rounded ${previewMode === 'desktop' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 rounded ${previewMode === 'mobile' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
                  >
                    📱 Mobile
                  </button>
                </div>
              </div>

              <div className={`border border-gray-200 rounded-lg p-4 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                {blocks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    Preview will appear here
                  </div>
                ) : (
                  <>
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">From the artisan</h3>
                      <p className="text-gray-600 text-sm">Learn more about this service</p>
                    </div>
                    <AdvertContent blocks={blocks} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Choose a Template</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  className="border border-gray-200 rounded-lg p-4 hover:border-red-500 cursor-pointer transition"
                  onClick={() => {
                    if (blocks.length > 0 && !confirm('This will replace your current blocks. Continue?')) {
                      return;
                    }
                    loadTemplate(key);
                  }}
                >
                  <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                  <p className="text-gray-600 text-sm">{template.description}</p>
                  <p className="text-gray-500 text-xs mt-2">{template.blocks.length} blocks</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTemplateModal(false)}
              className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Delete Block?</h3>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteBlock(blockToDelete)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBlockToDelete(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Block Editor Component
const BlockEditor = ({ 
  block, 
  index, 
  totalBlocks, 
  onUpdate, 
  onMoveUp, 
  onMoveDown, 
  onDuplicate, 
  onDelete,
  onUploadImage,
  isUploading,
  error,
  availableIcons
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderEditor = () => {
    switch (block.type) {
      case 'banner':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onUploadImage(e.target.files[0])}
                disabled={isUploading}
                className="w-full text-sm"
              />
              {block.data.image && (
                <img src={block.data.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={block.data.alt || ''}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                placeholder="Describe the image"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                maxLength={100}
              />
            </div>
          </div>
        );

      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title * (max 80 chars)
              </label>
              <input
                type="text"
                value={block.data.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Your headline"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                maxLength={80}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle (max 160 chars)
              </label>
              <input
                type="text"
                value={block.data.subtitle || ''}
                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                placeholder="Supporting text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                maxLength={160}
              />
            </div>
          </div>
        );

      case 'featureStrip':
        return (
          <div className="space-y-4">
            {block.data.items?.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {availableIcons.find(i => i.value === item.icon)?.emoji || '⭐'}
                  </span>
                  <select
                    value={item.icon}
                    onChange={(e) => {
                      const newItems = [...block.data.items];
                      newItems[idx].icon = e.target.value;
                      onUpdate({ items: newItems });
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {availableIcons.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...block.data.items];
                    newItems[idx].title = e.target.value;
                    onUpdate({ items: newItems });
                  }}
                  placeholder="Title"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  maxLength={40}
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...block.data.items];
                    newItems[idx].text = e.target.value;
                    onUpdate({ items: newItems });
                  }}
                  placeholder="Description"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  maxLength={60}
                />
              </div>
            ))}
          </div>
        );

      case 'imageText':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onUploadImage(e.target.files[0])}
                disabled={isUploading}
                className="w-full text-sm"
              />
              {block.data.image && (
                <img src={block.data.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Position
              </label>
              <select
                value={block.data.imagePosition || 'left'}
                onChange={(e) => onUpdate({ imagePosition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title * (max 80 chars)
              </label>
              <input
                type="text"
                value={block.data.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Section title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                maxLength={80}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text * (max 600 chars)
              </label>
              <textarea
                value={block.data.text || ''}
                onChange={(e) => onUpdate({ text: e.target.value })}
                placeholder="Your content"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                maxLength={600}
              />
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-3">
            {block.data.images?.map((img, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image {idx + 1} *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onUploadImage(e.target.files[0], `images[${idx}].image`)}
                  disabled={isUploading}
                  className="w-full text-sm mb-2"
                />
                {img.image && (
                  <img src={img.image} alt={`Gallery ${idx + 1}`} className="h-24 object-cover rounded" />
                )}
              </div>
            ))}
            {block.data.images && block.data.images.length < 4 && (
              <button
                onClick={() => {
                  const newImages = [...(block.data.images || []), { image: '', alt: '' }];
                  onUpdate({ images: newImages });
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                + Add Image
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const blockTypeLabels = {
    banner: '🖼️ Banner',
    heading: '📝 Heading',
    featureStrip: '⭐ Feature Strip',
    imageText: '📷 Image + Text',
    gallery: '🎨 Gallery'
  };

  return (
    <div className={`border rounded-lg p-4 ${error ? 'border-red-500' : 'border-gray-200'}`}>
      {/* Block Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{blockTypeLabels[block.type]}</span>
          <span className="text-xs text-gray-500">#{index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
            title="Move up"
          >
            ⬆️
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === totalBlocks - 1}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
            title="Move down"
          >
            ⬇️
          </button>
          <button
            onClick={onDuplicate}
            className="p-1 hover:bg-gray-100 rounded"
            title="Duplicate"
          >
            📋
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-100 text-red-600 rounded"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Block Content */}
      {!isCollapsed && (
        <>
          {renderEditor()}
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
          {isUploading && (
            <p className="text-blue-600 text-sm mt-2">Uploading image...</p>
          )}
        </>
      )}
    </div>
  );
};

export default AdvertBuilder;
