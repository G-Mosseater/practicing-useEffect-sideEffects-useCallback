import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

//
const storedIds = JSON.parse(localStorage.getItem("SelectedPlaces")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);
console.log(storedPlaces);

function App() {
  // const modal = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  //useEffect takes two arguments, one is the function, second is the dependecy array
  // if the dependacy array is defined React will check it and execut the effect function only if the dependency value changed
  // if the dependency array is empty, the function is executed only once
  // useEffect executes the first argument only AFTER the App finishes executing all other components/functions
  useEffect(() => {
    // Example of side-effect, it is not related with the rest of the code/task
    //function provided by the browser to get users's location
    //it provides a position object from which we can get lat, lon and others
    // requires a use state to set the available places at render
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      // this trigers an infinite loop as setAvailablePlaces state tells react to re-render the application
      // need to be moved in a useEffect hook

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    // example of side-effect that does not need useEffect()
    const storedIds = JSON.parse(localStorage.getItem("SelectedPlaces")) || []; //extracts the data in a string form
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "SelectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }
  // useCallback makes sure the handleRemovePlace function is not recreated, it stores it in memory and reuses the the store when compoment executes again

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setIsOpen(false);
    const storedIds = JSON.parse(localStorage.getItem("SelectedPlaces")) || []; //extracts the data in a string form
    localStorage.setItem(
      "SelectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []); // the dependency array works just like the useEffect array, here we have no prop or state values / keep empty array

  return (
    <>
      <Modal open={isOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
