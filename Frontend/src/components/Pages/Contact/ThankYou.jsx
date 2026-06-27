import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ThankYou.css'; // Import the CSS file
import  { useState, useEffect } from 'react';

function ThankYou() {
  const [avatarX, setAvatarX] = useState(200);
  const [avatarY, setAvatarY] = useState(200);

  useEffect(() => {
    const animation = setInterval(() => {
      setAvatarX(avatarX + 1);
      setAvatarY(avatarY + 1);
    }, 10);

    return () => clearInterval(animation);
  }, [avatarX, avatarY]);

  return (
    <div className="container">
      <div className="text">
        <h1>Thank You</h1>
        <p>We&apos;ll reach You Shortly</p>
      </div>
      <div className="avatar" style={{ left: avatarX, top: avatarY }}>
        <img src="https://www.flaticon.com/free-icons/avatar" alt="Avatar" />
      </div>
      <div className="gear"></div>
      <div className="icons">
        <div className="icon">
          <img src="https://www.flaticon.com/free-icons/email" alt="Email" />
        </div>
        <div className="icon">
          <img src="https://www.flaticon.com/free-icons/shopping-cart" alt="Shopping Cart" />
        </div>
        <div className="icon">
          <img src="https://www.flaticon.com/free-icons/globe" alt="Globe" />
        </div>
      </div>
      <div className="computer">
        <div className="screen"></div>
        <div className="keyboard"></div>
        <div className="mouse"></div>
      </div>
      <div className="lamp"></div>
    </div>
  );
}

export default ThankYou;