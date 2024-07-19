import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ILoginFormInput {
  email: string;
  password: string;
}

const UserLogin: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ILoginFormInput>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: SubmitHandler<ILoginFormInput> = async (data) => {
    setLoading(true);
    setSuccess(false);
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        const lastPath = localStorage.getItem('lastPath') || '/';
        localStorage.removeItem('lastPath');
        window.location.href = lastPath;
        setSuccess(true);
        setErrorMessage('');
      } else {
        setErrorMessage(result.message || 'Login failed. Please try again.');
        reset({ email: '', password: '' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/users/auth/google`;
  };

  return (
    <div className="user-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {!success && (
        <>
          <h2>Log In</h2>
          <form className="sign-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="Email"
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="Password"
              />
              {errors.password && <span>{errors.password.message}</span>}
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit">Submit</button>
          </form>
          <div className="or">or</div>
          <button className="sign-button" onClick={handleGoogleLogin}>Login with Google</button>
        </>
      )}
      {success && (
        <div className="success-message">
          <h4>Logged in successfully.</h4>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
