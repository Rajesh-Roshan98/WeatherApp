import React from "react";
import Weather from "./components/Weather";

const App = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#e2d4ff]">
      <div className="flex justify-center items-center">
        <Weather />
      </div>
    </div>
  );
};

export default App;
