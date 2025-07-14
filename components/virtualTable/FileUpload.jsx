import React, { useState, useRef } from 'react';
import { fileUploadByUser } from '@/app/api/crud';
import { useSession } from 'next-auth/react';
import { Tooltip } from '@mui/material';

const FileUpload = ({ room, user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonOpen, setIsButtonOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [data, setData] = useState({
    userName: user,
    roomName: room,
    file: '',
  });
  const { data: session } = useSession()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setData((prevData) => ({ ...prevData, file }));
      setErrorMessage("");
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    setUploading(true);

    try {
      const response = await fileUploadByUser(data, session?.user?.token);
      if (response == 1) {
        // toast.success('File uploaded successfully!');
      } else {
        // toast.error('File is not uploaded.');
      }
      setSelectedFile(null)
    } catch (error) {
      setErrorMessage('Error uploading file. Please try again.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleCloseClick = () => {
    setIsOpen(false);
    setIsButtonOpen(true);
  };

  return (
    <div>
      {isButtonOpen && (
        <Tooltip title={`File Upload`} placement="top" arrow className=''>

          <button
            onClick={() => {
              setIsOpen(true);
              setIsButtonOpen(false);
            }}
            className="btn file-upload-btn rounded-pill shadow "
            aria-label="Open file upload"
          >
            <i className="fa-solid fa-folder-open"></i>
          </button>
        </Tooltip>
      )}

      {isOpen && (
        <div className="file-upload">
          <div className="card">
            <div className="card-body">
              <button className="btn close-btn" onClick={handleCloseClick}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="drop_box">
                <h4>Select File here</h4>
                <p>Files Supported: PDF, TEXT, DOC, DOCX</p>

                <input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button className="btn choose-file-btn" onClick={handleChooseFileClick}>
                  Choose File
                </button>

                {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button
                  className="btn upload-btn"
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;