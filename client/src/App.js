import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import UploadActivity from "./pages/UploadActivity"
import ActivityDetail from "./pages/ActivityDetail"
import Discussions from "./pages/Discussions"
import QuestionDetail from "./pages/QuestionDetail"
import AskQuestion from "./pages/AskQuestion"

const httpLink = createHttpLink({
  uri: "/graphql",
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth_token")
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

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
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/discussions/:id" element={<QuestionDetail />} />
              <Route path="/discussions/ask" element={<AskQuestion />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App
