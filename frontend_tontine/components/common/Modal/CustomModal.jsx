// components/common/Modal/CustomModal.jsx
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const CustomModal = ({ isOpen, onClose, headerContent, bodyContent, footerContent }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        style={{
          padding: '20px',
          backgroundColor: '#131330',
          color: '#fff',
          borderRadius: '10px',
          border: 'double 1px transparent',
          backgroundClip: 'padding-box, border-box',
          backgroundOrigin: 'border-box',
          backgroundImage:
            'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
        }}
      >
        <ModalHeader>{headerContent}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{bodyContent}</ModalBody>
        <ModalFooter>{footerContent}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;