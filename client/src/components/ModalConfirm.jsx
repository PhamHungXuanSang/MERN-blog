/* eslint-disable react/prop-types */
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';

export default function ModalConfirm({
    showModal,
    setShowModal,
    title,
    onConfirm,
    onNoConfirm,
    confirm,
    noConfirm,
    children,
}) {
    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                    <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">{title}</h3>
                    {children}
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={onConfirm}>
                            {confirm}
                        </Button>
                        <Button color="gray" onClick={onNoConfirm}>
                            {noConfirm}
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
