"use client";
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as FocusTrapModule from 'focus-trap-react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Modal.module.css';
import { X } from 'lucide-react';

const FocusTrap = (FocusTrapModule as any).default || FocusTrapModule;

interface ModalProps{
    children?: React.ReactNode;
    showModal: boolean;
    setShowModal: Function;
}

export default function Modal(props: ModalProps){
    const {children, showModal, setShowModal} = props;
    const modalRef = useRef(null);
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowModal(false);
        }
        },
        [setShowModal],
    );

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        
        return () => document.removeEventListener('keydown', onKeyDown);
        
    }, [onKeyDown]);

    useEffect(() => {
        if (showModal) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = 'unset';
        }
        
        return () => {
        document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const modalContent = (
        <AnimatePresence>
            {showModal && (
                <>
                <motion.div
                    key="backdrop"
                    className={styles.modalBackdrop}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowModal(false)}
                />

                <FocusTrap 
                    focusTrapOptions={{ 
                    initialFocus: false,
                    allowOutsideClick: true,
                    fallbackFocus: () => document.body,
                    checkCanFocusTrap: (trapContainers:any) => {
                        return new Promise((resolve) => {
                        setTimeout(() => {
                            const hasFocusable = trapContainers.some((container:any) => 
                            container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
                            );
                            resolve(hasFocusable);
                        }, 100);
                        });
                    }
                    }}
                >
                    <motion.div
                    ref={modalRef}
                    key="modal"
                    className={styles.modalContainer}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onMouseDown={(e) => {
                        if (modalRef.current === e.target) {
                        setShowModal(false);
                        }
                    }}
                    >
                        <div className={`${styles.modalContent} ${styles.modalContentDefaultWidth}`}>
                                        <button
                                            className={styles.closeButton}
                                            onClick={()=>setShowModal(false)}
                                        >
                                            <X/>
                                        </button>
                            {children}
                        </div>
                    </motion.div>
                </FocusTrap>
                </>
            )}
        </AnimatePresence>
    );

      return typeof document !== 'undefined' 
        ? createPortal(modalContent, document.body)
        : null;
}