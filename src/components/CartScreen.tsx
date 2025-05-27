
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { RootState } from '../store/store';
import { updateQuantity, removeItem } from '../store/cartSlice';
import { Button } from '@/components/ui/button';

interface CartScreenProps {
  onNavigateBack: () => void;
  onNavigateToCheckout: () => void;
}

const CartScreen: React.FC<CartScreenProps> = ({ onNavigateBack, onNavigateToCheckout }) => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const deliveryFee = 2.99;
  const finalTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="bg-white shadow-lg">
            <div className="px-4 py-6">
              <div className="flex items-center">
                <button onClick={onNavigateBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Your Cart</h1>
              </div>
            </div>
          </div>

          {/* Empty Cart */}
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-orange-100 p-6 rounded-full mb-6">
              <ShoppingBag size={48} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 text-center mb-8">Add some delicious items to get started</p>
            <Button
              onClick={onNavigateBack}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
            >
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg">
          <div className="px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button onClick={onNavigateBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Your Cart</h1>
              </div>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="px-4 py-6">
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-orange-600 font-semibold">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center"
                    >
                      <Minus size={16} className="text-orange-600" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center"
                    >
                      <Plus size={16} className="text-orange-600" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center ml-2"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={onNavigateToCheckout}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
