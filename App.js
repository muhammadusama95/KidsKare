import React from 'react';
import Router from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ModalPortal } from 'react-native-modals';
const App = () => {
  return (
    <SafeAreaProvider>
      <Router />

      <ModalPortal />
    </SafeAreaProvider>
  );
};

export default App;