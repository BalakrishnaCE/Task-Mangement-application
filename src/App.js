import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache ,createHttpLink } from "@apollo/client";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import NoPage from "./pages/NoPage";
import RegisterPage from "./pages/Register";
import AddTaskPage from "./pages/AddTaskPage";
import { setContext } from '@apollo/client/link/context';


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Include the token in the authorization header
    },
  };
});
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Update to your GraphQL server URI
});
const client = new ApolloClient({
  link : authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
function App() {
  return (
    <ApolloProvider client={client}>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-task" element={<AddTaskPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
