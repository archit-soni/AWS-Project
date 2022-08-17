import React from "react";
import GlobalContext from './components/GlobalContext';
import { Routes, Route } from 'react-router-dom';

import "./styles/App.css";
import Profile from "./components/Profie";
import MyProfile from "./components/MyProfile";
import Wallet from "./components/Wallet";
import GetTransaction from "./components/GetTransaction";
import GetMyAssets from "./components/GetMyAssets";
import NewAsset from "./components/NewAsset";

function App() {
  return (
    <Routes>
    <Route path='/wallet' element={<Wallet />} />
    <Route path='/' element={<GlobalContext/>} />
    <Route path='/profile/:username' element={<Profile />} />
    <Route path='/me' element={<MyProfile />} />
    <Route path='/myassets' element={<GetMyAssets />} />
    <Route path='/transaction' element={<GetTransaction />} />
    <Route path='/registerasset' element={<NewAsset />} />
  </Routes>
  );
}

export default App;
