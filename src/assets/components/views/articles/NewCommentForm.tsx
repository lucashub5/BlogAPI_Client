import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormValues {
  description: string;
}

interface NewCommentFormProps {
  onAddComment: (description: string) => void;
}

const NewCommentForm: React.FC<NewCommentFormProps> = ({ onAddComment }) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const token = localStorage.getItem('token');

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onAddComment(data.description);
    reset();
  };

  return (
    <div>
      <h3>Add a New Comment</h3>
      {token ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Message:</label>
            <textarea {...register('description', { required: true })} />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Please log in to send messages.</p>
      )}
    </div>
  );
};

export default NewCommentForm;