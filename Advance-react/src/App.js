import React from 'react'
import shoes from './Data/shoes.json';
import Routes from "./Routes/routes";

export default function App() {
  console.log(shoes);
  return (
    <div>
      <Routes />
      <h1>Shoes</h1>
     
    </div>
  )
}
