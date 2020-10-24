import React from 'react';
import './pageStyles/footer.css';

const Footer = () => {
  return (
    <footer>
        <div className='container'>
        <div className='row'>
            <div className='col-md-12'>
                <ul>
                    <li><a href='/'>Terms</a></li>
                    <li><a href='/'>Privacy</a></li>
                    <li><a href='/'>Contact</a></li>
                    <p>&copy; Copyright 2020</p>
                </ul>
            </div>
        </div>
        </div>
    </footer>
  );
};

export default Footer;