import React, { createContext, useReducer } from 'react';
import { appReducer, defaultAppState } from './appReducer';

// Define an action type for dispatching
type AppAction = {
  type: string;
  payload?: any;
};

// Create a type for the context
interface AppContextType {
  appState: typeof defaultAppState;
  dispatch: React.Dispatch<AppAction>;
  setAppState: (stateOrAction: Partial<typeof defaultAppState> | AppAction) => void;
}

// Create the context with an initial undefined value
export const AppContext = createContext<AppContextType>({
  appState: defaultAppState,
  dispatch: () => null,
  setAppState: () => null
});

// Create the provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [appState, dispatch] = useReducer(appReducer, defaultAppState);

  // Helper function to update app state
  const setAppState = (stateOrAction: Partial<typeof defaultAppState> | AppAction) => {
    // Check if the input is an action object with a 'type' property
    if ('type' in stateOrAction) {
      // If it's an action object, dispatch it directly
      dispatch(stateOrAction as AppAction);
    } else {
      // If it's a partial state object, convert each property to an action
      Object.keys(stateOrAction).forEach(key => {
        dispatch({
          type: `update${key.charAt(0).toUpperCase() + key.slice(1)}`,
          payload: stateOrAction[key as keyof typeof stateOrAction]
        });
      });
    }
  };

  return (
    <AppContext.Provider value={{ appState, dispatch, setAppState }}>
      {children}
    </AppContext.Provider>
  );
}; 