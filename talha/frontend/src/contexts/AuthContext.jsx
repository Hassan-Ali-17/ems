import { createContext, useEffect, useMemo, useReducer } from 'react';
import * as authService from '../services/authService';

const TOKEN_KEY = 'ems_token';
const USER_KEY = 'ems_user';

const AuthContext = createContext(null);

const initialState = {
  token: localStorage.getItem(TOKEN_KEY) || '',
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  loading: false,
  initializing: true,
  error: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, loading: true, error: '' };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, token: action.payload.token, user: action.payload.user, initializing: false, error: '' };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload, initializing: false };
    case 'LOGOUT':
      return { ...state, token: '', user: null, loading: false, initializing: false, error: '' };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'INIT_DONE':
      return { ...state, initializing: false };
    default:
      return state;
  }
}

function persistAuth(token, user) {
  if (token && user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const boot = async () => {
      if (!state.token) {
        dispatch({ type: 'INIT_DONE' });
        return;
      }

      try {
        const response = await authService.me();
        persistAuth(state.token, response.data.user);
        dispatch({ type: 'AUTH_SUCCESS', payload: { token: state.token, user: response.data.user } });
      } catch (error) {
        persistAuth('', null);
        dispatch({ type: 'LOGOUT' });
      }
    };

    boot();
  }, []);

  const value = useMemo(() => {
    const setAuth = (token, user) => {
      persistAuth(token, user);
      dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
    };

    return {
      ...state,
      register: async (payload) => {
        dispatch({ type: 'START' });
        try {
          const response = await authService.register(payload);
          setAuth(response.data.token, response.data.user);
          return response.data;
        } catch (error) {
          dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message || 'Registration failed.' });
          throw error;
        }
      },
      login: async (payload) => {
        dispatch({ type: 'START' });
        try {
          const response = await authService.login(payload);
          setAuth(response.data.token, response.data.user);
          return response.data;
        } catch (error) {
          dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message || 'Login failed.' });
          throw error;
        }
      },
      logout: () => {
        persistAuth('', null);
        dispatch({ type: 'LOGOUT' });
      },
      refreshUser: async () => {
        const response = await authService.me();
        persistAuth(state.token, response.data.user);
        dispatch({ type: 'UPDATE_USER', payload: response.data.user });
        return response.data.user;
      },
      updateProfile: async (payload) => {
        const response = await authService.updateProfile(payload);
        persistAuth(state.token, response.data.user);
        dispatch({ type: 'UPDATE_USER', payload: response.data.user });
        return response.data.user;
      },
      changePassword: async (payload) => authService.changePassword(payload)
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;