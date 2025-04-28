import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

// Components
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import UploadActivity from "./pages/UploadActivity"
import ActivityDetail from "./pages/ActivityDetail"

// Create an http link
const httpLink = createHttpLink({
  uri: "/graphql",
})

// Create an auth link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth_token")
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Create Apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-pastel-blue/30 to-pastel-purple/30">
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upload" element={<UploadActivity />} />
              <Route path="/activity/:id" element={<ActivityDetail />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App
