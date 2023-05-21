import React, { useState } from 'react';
import Modal from 'react-modal';
import style from './RecordModal.module.css';
// Styles for the modal
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    maxHeight: '300px',
    margin: 'auto',
    padding: '20px',
  },
};

// Modal component
const RecordModal = ({ isOpen, closeModal }) => {
  const [name, setName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Name:', name);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      className={style['react-modal-content']}
      overlayClassName={style['react-modal-overlay']}>
      <h2>Modal Example</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
};

export default RecordModal;
