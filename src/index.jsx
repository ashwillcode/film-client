import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Add this import
import { MainView } from './components/main-view/main-view';
import './index.scss';
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <BrowserRouter>
      <MainView />
    </BrowserRouter>
  );
};

// Replace ReactDOM.render with createRoot
const root = createRoot(document.getElementById('root'));
root.render(<App />);
