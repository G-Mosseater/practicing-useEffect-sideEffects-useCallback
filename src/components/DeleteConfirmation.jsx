import { useEffect, useState } from "react";

import ProgressBar from "./ProgressBar";
const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  // use effect to stop the setTimeout with a clean up function
  // conditional rendering on the Modal component  open ? children : null
  useEffect(() => {
    console.log("timer set");

    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    return () => {
      console.log("clean up function");
      clearTimeout(timer);
    };
  }, [onConfirm]); // using a function as a dependancy array can lead to infinite loops // javascript functions are being recreated at each render
  // making values not being equal

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
