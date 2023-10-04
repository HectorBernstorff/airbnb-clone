import { useState } from 'react'
import '../App.css'
import Propertie from '../components/Propertie';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'


function Home() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  function handleClick() {
    navigate('/PropertiePage');
  }

  return (
    <>
    <Header />
      {/* <header>
        <div className='headerTop'>
          <div className='innerHeaderTop'>
            <span>AIRBNB LOGO</span>
            <div>
              <span>Anywhere</span>
              <span>Any week</span>
              <span>Add guersts</span>
              <button>Search</button>
            </div>
            <div className='profileSection'>
              <span>Airbnb your home</span>
              <span>icon</span>
              <div>
                <span>///</span>
                <span>profile icon</span>
              </div>
            </div>
          </div>
        </div>

        <div className='navBar'>
          <div className='innerNavBar'>
            <button>--</button>
            <div className='items'>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
              <span>Cabins</span>
            </div>
            <button>++</button>
            <button>
              <span>icon</span>
              <span>Filters</span>
            </button>
          </div>

        </div>

      </header> */}

      <main>
        <a onClick={handleClick}>
            <Propertie  />
        </a>
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />
        <Propertie />


      </main>

      <footer>

      </footer>
    </>
  )
}

export default Home;
