import React, { useState } from 'react';
import { Tldraw } from 'tldraw';

const TldrawComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tldraw-container">
      <button onClick={() => setIsOpen(!isOpen)} className="btn btn-primary">
        {isOpen ? 'Close Tldraw' : 'Open Tldraw'}
      </button>
      {isOpen && (
        <div className="tldraw-wrapper">
          <Tldraw />
        </div>
      )}
    </div>
  );n
};

export default TldrawComponent;
