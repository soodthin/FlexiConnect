import React, { useReducer } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { MyUserContext, MyDispatcherContext } from '@contexts/MyContexts';
import DarkModeProvider from '@configs/DarkModeProvider';

const initialState = null;

const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return action.payload;
    case 'logout':
      return null;
    default:
      return state;
  }
};

function AppWrapper() {
  const [user, dispatch] = useReducer(reducer, initialState);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatcherContext.Provider value={dispatch}>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
