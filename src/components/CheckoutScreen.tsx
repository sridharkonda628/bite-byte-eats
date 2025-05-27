
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { RootState } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { placeOrder } from '../services/orderService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CheckoutScreenProps {
  onNavigateBack: () => void;
  onNavigateToMenu: () => void;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onNavigateBack, onNavigateToMenu }) => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const deliveryFee = 2.99;
  const finalTotal = total + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newOrderId = await placeOrder({
        items,
        total: finalTotal,
        status: 'pending',
        customerInfo
      });
      
      setOrderId(newOrderId);
      setOrderPlaced(true);
      dispatch(clearCart());
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${newOrderId} has been confirmed`,
      });
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="text-center">
            <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">Thank you for your order</p>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Order Details</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono font-bold">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold text-green-600">${finalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center">
                    <Clock size={14} className="mr-1" />
                    Preparing
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onNavigateToMenu}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl"
              >
                Order Again
              </Button>
              <p className="text-sm text-gray-500">
                Estimated delivery time: 25-35 minutes
              </p>
            </div>
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
            <div className="flex items-center">
              <button onClick={onNavigateBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold">Checkout</h1>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-orange-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Delivery Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Input
                  id="address"
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your full address"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Placing Order...
              </>
            ) : (
              `Place Order - $${finalTotal.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
