import googleLogo from "../assets/images/googleLogo.webp";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, storage, db } from "../components/firebase.js";
import { useState, useId } from "react";
import { FaRegImage } from "react-icons/fa";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [googleErrorMessage, setGoogleErrorMessage] = useState(null);

  // form id
  const inputId = useId();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "file") setFile(files[0]);
  };

  // Handle user sign up with email and password
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      const user = userCredential.user;

      // upload image to firebase storage
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        () => {
          // Handle unsuccessful uploads
          setError(true);
        },
        () => {
          // Handle successful uploads on complete
          // get the download url from firebase storage
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // update user profile
            await updateProfile(user, {
              displayName: name,
              photoURL: downloadURL,
            });

            // add user to firestore
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName: name,
              email,
              photoURL: downloadURL,
            });

            // add userChats to firestore
            await setDoc(doc(db, "userChats", user.uid), {});

            // redirect to home page
            navigate("/");
          });

        }
      );
    } catch (err) {
      const errorMessage = err.message;

      setError(true);
      setErrorMessage(errorMessage);
    }
  };

  // Handle user sign up with google
  const handleGoogleSignUp = async (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);

      // eslint-disable-next-line
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      const { displayName, email, photoURL, uid } = user;

      await updateProfile(user, {
        displayName,
        photoURL,
      });

      // add user to firestore
      await setDoc(doc(db, "users", user.uid), {
        uid,
        displayName,
        email,
        photoURL,
      });

      // add userChats to firestore
      await setDoc(doc(db, "userChats", user.uid), {
        chats: [],
      });

      // redirect to home page
      navigate("/");
    } catch (error) {
      // Handle Errors here.
      setError(true);
      const errorMessage = error.message;
      setGoogleErrorMessage(errorMessage);

      // The email of the user's account used.
      // eslint-disable-next-line
      const email = error.customData.email;

      // The AuthCredential type that was used.
      // eslint-disable-next-line
      const credential = GoogleAuthProvider.credentialFromError(error);


    }
  };

  return (
    <div className='signupContainer'>
      <div className='signupContainer__box'>
        <div className='signupContainer__box__inner'>
          <h1>Sign Up</h1>
          <form className='signupContainer__box__form' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Name'
              onChange={handleChange}
              name='name'
              value={name}
            />
            <input
              type='email'
              placeholder='Email'
              onChange={handleChange}
              name='email'
              value={email}
            />
            <input
              type='password'
              placeholder='Password'
              onChange={handleChange}
              name='password'
              value={password}
            />
            <input
              type='file'
              style={{ display: "none" }}
              onChange={handleChange}
              name='file'
              id={`file-${inputId}`}
            />
            <label htmlFor={`file-${inputId}`}>
              <FaRegImage /> Add an image
            </label>
            {/* <input type="password" placeholder="Confirm Password" name="confirmPassword" /> */}
            <button type='submit'>Sign Up</button>
            {error && <p>"Something went wrong!" {errorMessage}</p>}
          </form>

          <div className='signupContainer__box__google'>
            <button onClick={handleGoogleSignUp}>
              <span>
                <img src={googleLogo} alt='Google Logo' />
              </span>
              Sign Up with Google
            </button>
            {error && <p>"Something went wrong!" {googleErrorMessage}</p>}
          </div>

          <div className='signupContainer__box__login'>
            <p>
              Already have an account? <Link to='/signin'>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
