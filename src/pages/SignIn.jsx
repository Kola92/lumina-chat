import googleLogo from "../assets/images/googleLogo.webp";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../components/firebase.js";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [googleErrorMessage, setGoogleErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // eslint-disable-next-line
      const user = userCredential.user;
      navigate("/");
      // console.log(user);
    } catch (err) {
      const errorMessage = err.message;

      console.log(errorMessage);
      setError(true);
      setErrorMessage(errorMessage);
    }
  };

  // Handle user sign in with google
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      // eslint-disable-next-line
      const credential = GoogleAuthProvider.credentialFromResult(result);

      // eslint-disable-next-line
      const token = credential.accessToken;

      // The signed-in user info.
      // eslint-disable-next-line
      const user = result.user;

      // redirect to home page
      navigate("/");
    } catch (error) {
      // Handle Errors here.
      setError(true);
      const errorMessage = error.message;
      setGoogleErrorMessage(errorMessage);

      // The email of the user's account used.
      const email = error.customData.email;

      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log(
        `errorMessage: ${errorMessage}, emailError: ${email}, credentialError: ${credential}`
      );
    }
  };

  return (
    <div className='signinContainer'>
      <div className='signinContainer__box'>
        <div className='signinContainer__box__inner'>
          <h1>Sign In</h1>
          <form className='signinContainer__box__form' onSubmit={handleSubmit}>
            <input
              type='email'
              placeholder='Email'
              name='email'
              onChange={handleChange}
            />
            <input
              type='password'
              placeholder='Password'
              name='password'
              onChange={handleChange}
            />
            {/* <input type="password" placeholder="Confirm Password" name="confirmPassword" /> */}
            <button type='submit'>Sign In</button>
            {error && <p>"Something went wrong!" {errorMessage}</p>}
          </form>

          <div className='signinContainer__box__google'>
            <button onClick={handleGoogleSignIn}>
              <span>
                <img src={googleLogo} alt='Google Logo' />
              </span>
              Sign In with Google
            </button>
            {error && <p>"Something went wrong!" {googleErrorMessage}</p>}
          </div>

          <div className='signinContainer__box__signup'>
            <p>
              Don't have an account? <Link to='/signup'>Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
