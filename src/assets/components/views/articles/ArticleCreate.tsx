import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface FormData {
  title: string;
  subtitle: string;
  description?: string; 
  isPublished: boolean;
  imageFile: File | null;
}

const ArticleCreate: React.FC = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle);
      formData.append('description', editorRef.current?.getContent() || '');
      formData.append('isPublished', isPublished.toString());
      if (data.imageFile instanceof FileList) {
        formData.append('image', data.imageFile[0] as File);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/article_create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,          
        },
        body: formData,
      });

      if (response.ok) {
        const { id } = await response.json();
        navigate(`/articles/${id}`);
      }
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const handleTogglePublish = () => {
    setIsPublished(!isPublished);
  };

  return (
    <div className="dcs">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              {...register('title', { required: true })} 
              placeholder="Enter a brief headline about the news"
            />
            {errors.title && <span className="error-message">Title is required</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subtitle">Subtitle</label>
            <input 
              type="text" 
              id="subtitle" 
              {...register('subtitle', { required: true })} 
              placeholder="Enter a short description related to the news"
            />
            {errors.subtitle && <span className="error-message">Subtitle is required</span>}
          </div>

          <div className="form-group">
            <label>Upload Cover Image</label>
            <input 
              type="file" 
              accept="image/*"
              id="imageFile"
              {...register('imageFile', { required: true })} 
              onChange={handleImageUpload}
            />
            {errors.imageFile && <span className="error-message">Cover image is required</span>}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Cover" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            )}
            {errors.imageFile && <span className="error-message">Image upload failed</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(_evt, editor) => {
                editorRef.current = editor;
              }}
              initialValue=""
              init={{
                height: 500,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                skin: 'borderless'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="publishSwitch">Publish</label>
            <label className="switch">
              <input
                type="checkbox"
                id="publishSwitch"
                checked={isPublished}
                onChange={handleTogglePublish}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="form-row">
            <div className="form-group col-sm">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleCreate;