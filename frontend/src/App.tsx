import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'tailwindcss/tailwind.css';
import LivePreview from './components/LivePreview';

const App = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setContent(data.content);
      setHtmlContent(data.content); // Set htmlContent for live preview
    } catch (error) {
      console.error('Error saat mengunggah file:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      console.log('Final Edit:', data.message);
    } catch (error) {
      console.error('Error saat menyimpan content:', error);
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
    setHtmlContent(value); // Update htmlContent for live preview
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CV Converter</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Upload
          </button>
          <ReactQuill value={content} onChange={handleContentChange} className="mb-4" />
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Save
          </button>
        </div>
        <div className="col-span-1">
          <LivePreview htmlContent={htmlContent} />
        </div>
      </div>
    </div>
  );
};

export default App;
