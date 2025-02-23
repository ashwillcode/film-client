import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Add this import
import { MainView } from './components/main-view/main-view';
import './index.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainView />
      </BrowserRouter>
    </Provider>
  );
};

// Replace ReactDOM.render with createRoot
const root = createRoot(document.getElementById('root'));
root.render(<App />);
