import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import eye from '../../assets/eye.svg';
import closed_eye from '../../assets/closed_eye.svg';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
  const [visibility, setVisibility] = useState("password");
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();
const { loginUser, user, error, loading } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError(validate({ ...formData, [name]: value }));
  };

  const validate = (values) => {
    const error = {};
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!values.email) {
      error.email = 'Email is required';
    } else if (!regex.test(values.email)) {
      error.email = 'Invalid email';
    }
    if (!values.password) {
      error.password = 'Password is required';
    } else if (values.password.length < 6) {
      error.password = 'Password must contain more than 6 characters';
    }
    return error;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setFormError(validate(formData));
  //   setIsSubmit(true);

  //   if (Object.keys(validate(formData)).length === 0) {
  //     const success = await login(formData.email, formData.password);
  //     if (success) {
  //       navigate('/dashboard');
  //     }
  //   }
  // };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(Object.keys(validate(formData)).length === 0){
      await loginUser(formData);
      if(useAuthStore.getState().user){
        navigate('/dashboard');
      }
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#0E100F]">
      <div className="w-[50%] mx-auto pt-20">
        <div className="shadow-2xl w-[50%] mx-auto px-10 py-3 flex-col border rounded-xl bg-[#141515] border-zinc-700">
          <div className="flex justify-center items-center flex-col mx-auto text-zinc-200">
            <h1 className="text-3xl font-semibold mb-3">Welcome back 👋🏻</h1>
            <p className="text-sm">Long time no see!</p>
          </div>

          <form className="flex flex-wrap flex-col justify-center" noValidate onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-md text-zinc-200">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                className="block bg-[#141515] border-zinc-700 border rounded-md outline-none text-zinc-200 w-full mb-3 h-[35px] pl-2 placeholder-zinc-500"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <p className="text-red-400 mb-3">{formError.email}</p>
            </div>

            <div>
              <label htmlFor="password" className="text-md text-zinc-200">Password</label>
              <div className="flex justify-center items-center">
                <input
                  type={visibility}
                  name="password"
                  placeholder="••••••••"
                  className="block bg-[#141515] border-zinc-700 border rounded-md outline-none text-zinc-200 w-full h-[35px] pl-2 placeholder-zinc-500"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => setVisibility(visibility === "password" ? "text" : "password")}
                >
                  <div className="border border-zinc-700 p-1 w-[35px] h-[35px] rounded-md flex justify-center items-center">
                    <img src={visibility === "password" ? eye : closed_eye} alt="toggle visibility" />
                  </div>
                </button>
              </div>
              <p className="text-red-400 mb-3">{formError.password}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white mx-auto flex justify-center items-center px-2 py-1 rounded-md hover:bg-blue-500"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p className="text-red-400 mt-3">{error}</p>}

            <p className="mt-3 text-sm text-gray-400">
              Don’t have an account? <NavLink to="/signup" className="text-blue-500">Sign Up</NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
