
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Search, ShoppingCart, Star } from 'lucide-react';
import { MenuItem, streamMenuItems } from '../services/menuService';
import { addItem } from '../store/cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MenuScreenProps {
  onNavigateToCart: () => void;
  cartItemsCount: number;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onNavigateToCart, cartItemsCount }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Setting up menu items real-time listener...');
    setLoading(true);
    setError(null);
    
    // Set up real-time listener
    const unsubscribe = streamMenuItems((items) => {
      console.log('Received menu items update:', items.length);
      setMenuItems(items);
      setLoading(false);
      setError(null);
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up menu items listener');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addItem(item));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading delicious menu...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FoodieApp</h1>
              <p className="text-gray-600">Delicious food delivered</p>
            </div>
            <button
              onClick={onNavigateToCart}
              className="relative bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2 border-gray-200 focus:border-orange-500 rounded-xl"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-orange-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-md mx-auto px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
            <p className="text-gray-400">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="flex">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-gray-600 text-sm ml-1">4.5</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-orange-600">${item.price}</span>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg"
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuScreen;
