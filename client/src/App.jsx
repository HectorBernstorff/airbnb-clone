import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import PropertiePage from './pages/PropertiePage';
import AllPictures from './components/AllPictures'
import NotFound from './pages/NoPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/propertiepage/:hostname" element={<PropertiePage />} />
          <Route path="/propertiepage/:hostname/pictures" element={<AllPictures />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
