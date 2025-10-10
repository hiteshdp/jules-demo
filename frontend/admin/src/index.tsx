import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'antd/dist/reset.css';
import { store } from './store/store';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/admin">
        <App />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);


