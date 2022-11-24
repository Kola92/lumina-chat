import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

function App() {
  const { currentUser } = useContext(AuthContext);

  // If the user is not logged in, redirect to the sign in page
  const PrivateRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to='/signin' />;
    }

    return children;
  };

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route exact path='/' element={<Home />} />
        <Route exact path='/signup' element={<SignUp />} />
        <Route exact path='/signin' element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
