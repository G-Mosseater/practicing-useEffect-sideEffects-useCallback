import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// const Modal = forwardRef(

function Modal({ open, children, onClose }) {
  // added onClose prop for closing the modal with escape key
  // without it modalIsOpen will not be set to false therefore modal wont open again (he is still in true)
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);
  // dependencies are props or state values (can be functions as well)
  // any value that causes the component function to execute again is a dependancy

  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal(); // backdrop available only when calling this method
  //     },
  //     close: () => {
  //       dialog.current.close();
  //     },
  //   };
  // });

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}

// );

export default Modal;
