import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a detectable array of dishes. Our mission is t satisfy your cravings and elevate your dining experience. one delicious meal at a time</p>

      <div className='explore-menu-list'>
        {menu_list.map((item, index) => {
          const isActive = category === item.menu_name;

          return (
            <div
              key={index}
              className={`explore-menu-list-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                console.log('Clicked/Touched:', item.menu_name, 'Current Category:', category); // Debug log
                setCategory((prev) =>
                  prev === item.menu_name ? 'All' : item.menu_name
                );
              }}
              onTouchStart={() => {
                console.log('Touched:', item.menu_name, 'Current Category:', category); // Debug log
                setCategory((prev) =>
                  prev === item.menu_name ? 'All' : item.menu_name
                );
              }}
            >
              <img src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;