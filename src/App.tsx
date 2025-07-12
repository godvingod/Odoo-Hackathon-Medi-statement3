import React from "react";
import { Routes, Route } from "react-router-dom";

import {
  LandingPage,
  Login,
  Register,
  Dashboard,
  AddItem,
  ItemDetail,
  AdminPanel,
  BrowseItems,
  NotFound
} from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/add-item" element={
          <ProtectedRoute>
            <AddItem />
          </ProtectedRoute>
        } />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/browse" element={<BrowseItems />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;