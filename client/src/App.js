import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AppointmentForm from './pages/AppointmentForm';
import NotFound from './pages/NotFound';

// Import or create the missing components
import OAuthCallback from './pages/OAuthCallback';
import Onboarding from './pages/Onboarding';

// Construct our main GraphQL API endpoint
const uploadLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://quickbookai.onrender.com/graphql'
      : 'http://localhost:3001/graphql',
  credentials: 'include',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  console.log("App component rendering"); // Add this for debugging
  
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/appointment" element={<AppointmentForm />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/onboarding" element={<Onboarding />} />
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
