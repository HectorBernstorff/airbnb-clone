import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import PropertiePage from './pages/PropertiePage';
import NotFound from './pages/NoPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/PropertiePage" element={<PropertiePage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
