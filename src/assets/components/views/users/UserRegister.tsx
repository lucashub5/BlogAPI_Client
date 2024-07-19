import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IUserFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const UserRegister: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm<IUserFormInput>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const password = watch('password');

  const onSubmit: SubmitHandler<IUserFormInput> = async (data) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user_register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.message === 'already-exists') {
        setError('email', {
          type: 'manual',
          message: 'User already exists. Please choose another email.',
        });
        document.getElementById('email')?.focus();
      } else if (result.message === 'registered-successfully') {
        setSuccess(true);
        clearErrors();
      }
    } catch (error) {
      console.error('Error:', error);
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
      {success ? (
        <div className="success-message">
          <h4>Your account has been successfully created. Log in with your email and password to start using the service.</h4>
        </div>
      ) : (
        <>
          <h2>Register</h2>
          <form className="sign-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input 
                type="text" 
                id="first-name" 
                {...register('firstName', { required: 'This field is required' })}
                placeholder="First Name" 
              />
              {errors.firstName && <span>{errors.firstName.message}</span>}
            </div>
            <div className="form-group">
              <input 
                type="text" 
                id="last-name" 
                {...register('lastName', { required: 'This field is required' })} 
                placeholder="Last Name" 
              />
              {errors.lastName && <span>{errors.lastName.message}</span>}
            </div>
            <div className="form-group">
              <input 
                type="email" 
                id="email" 
                {...register('email', { 
                  required: 'This field is required',
                })} 
                placeholder="Email" 
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <input 
                type="password" 
                id="password" 
                {...register('password', { 
                  required: 'This field is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  },
                  maxLength: {
                    value: 30,
                    message: 'Password must be less than 30 characters long'
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/,
                    message: 'Password must contain at least one letter and one number'
                  }
                })} 
                placeholder="Password"
              />
              {errors.password && <span>{errors.password.message}</span>}
            </div>
            <div className="form-group">
              <input 
                type="password" 
                id="confirm-password" 
                {...register('confirmPassword', { 
                  required: 'This field is required',
                  validate: value => value === password || 'Passwords do not match'
                })} 
                placeholder="Confirm Password" 
              />
              {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
            </div>
            {errors.email?.type === 'manual' && (
              <div className="error-message">{errors.email.message}</div>
            )}
            <button type="submit">Submit</button>
          </form>
          <div className="or">or</div>
          <button className="sign-button" onClick={handleGoogleLogin}>Login with Google</button>
        </>
      )}
    </div>
  );
};

export default UserRegister;