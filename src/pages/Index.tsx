
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import MenuScreen from '../components/MenuScreen';
import CartScreen from '../components/CartScreen';
import CheckoutScreen from '../components/CheckoutScreen';

type Screen = 'menu' | 'cart' | 'checkout';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MenuScreen
            onNavigateToCart={() => setCurrentScreen('cart')}
            cartItemsCount={cartItemsCount}
          />
        );
      case 'cart':
        return (
          <CartScreen
            onNavigateBack={() => setCurrentScreen('menu')}
            onNavigateToCheckout={() => setCurrentScreen('checkout')}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            onNavigateBack={() => setCurrentScreen('cart')}
            onNavigateToMenu={() => setCurrentScreen('menu')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  );
};

export default Index;
