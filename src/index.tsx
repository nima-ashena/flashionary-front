import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const versionControl = () => {
   const currentVersion = '2.01.05';
   const browserVersion = localStorage.getItem('version');
   if (!browserVersion) {
      localStorage.setItem('version', currentVersion);
   } else {
      if (currentVersion != browserVersion) {
         localStorage.setItem('version', currentVersion);
         console.log(`New update: ${currentVersion}`);
         alert('A new version has been released; Please reload the page');
      }
   }
};

versionControl();

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement,
);
root.render(
   // <React.StrictMode>
   <BrowserRouter>
      <App />
   </BrowserRouter>,
   // </React.StrictMode>,
);
