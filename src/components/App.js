import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notes from "../notes";
import CreateArea from './createArea'

function App() {
  return (
    <div>
      <Header />
      {notes.map((d) => (
        <Note key={d.key} title={d.title} content={d.content} />
      ))}
      
      
      <CreateArea />
      <Footer />
    </div>
  )
}

export default App;
