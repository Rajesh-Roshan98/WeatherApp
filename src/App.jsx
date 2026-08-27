import React from "react";
import Weather from "./components/Weather";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-gray-950 text-slate-100 overflow-x-hidden selection:bg-sky-500/30 selection:text-sky-200">
      <Weather />
    </div>
  );
};

export default App;
