

import { useContext } from 'react';
import SearchBar from '../../components/searchbar/searchBar';
import './homePage.scss'
import { AuthContext } from '../../context/AuthContext';


function Homepage()
{
    const {currentUser}=useContext(AuthContext)
    console.log(currentUser)
    return(
        <div className='homePage'>
            <div className='textContainer'>
                <div className="wrapper">
                <h1 className='title'>"Your Next Home Is Just A Click Away!"</h1>
                <p>Home Heaven will help you find <span>Real Estate</span> & get your dream place.</p>
                <SearchBar/>

                <div className="boxes">
                    <div className="box">
                        <h1>50+</h1>
                        <h2>Cities Covered</h2>
                    </div>
                    <div className="box">
                        <h1>24/7</h1>
                        <h2>Customer Support</h2>
                    </div>
                    <div className="box">
                        <h1>200+</h1>
                        <h2>Luxury Listing</h2>
                    </div>
                </div>
                </div>
            </div>
            <div className='imgContainer'>
                <img src="/bg.png" alt="" />
               

            </div>
           
        </div>
    )
}
export default Homepage;