import React from "react";

const context = React.createContext();

function Store(props) {
  const [location, setLocation] = React.useState("");
  const [forecastData, setForecastData] = React.useState([]);
  const mapRef = React.useRef();
  const getPlacesService = React.useCallback(() => {
    const map = new global.google.maps.Map(mapRef.current);
    const service = new global.google.maps.places.PlacesService(map);
    return service;
  }, []);

  return (
    <context.Provider value={{
      location,
      setLocation,
      forecastData,
      setForecastData,
      getPlacesService,
    }}>
      <div ref={mapRef} ></div>
      {props.children}
    </context.Provider>
  )
}

export default Store;
export { context };