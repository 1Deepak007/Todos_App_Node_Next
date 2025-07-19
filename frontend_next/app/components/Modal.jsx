import { useRef, useEffect } from 'react'

const Modal = ({ isOpen, onClose, children, title }) => {
    const modelRef = useRef(null);

    useEffect(() => {
        const handleCLickOutside = (event) => {
            if (modelRef.current && !modelRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleCLickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleCLickOutside);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div
                ref={modelRef} 
                className="bg-amber-50 rounded-lg shadow-xl p-6 relative w-full max-w-lg mx-4"
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition duration-200"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal

