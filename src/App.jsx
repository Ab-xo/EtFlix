import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MoviesPage from "./pages/MoviesPage";
import GenresPage from "./pages/GenresPage";
import AboutPage from "./pages/AboutPage";
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<MoviesPage />} path="/movies" />
      <Route element={<GenresPage />} path="/genres" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<AccountPage mode="signin" />} path="/signin" />
      <Route element={<AccountPage mode="signup" />} path="/signup" />
    </Routes>
  );
}

export default App;
