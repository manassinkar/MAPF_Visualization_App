import React from 'react';
import './pageStyles/about.css';

const About = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'
      }}
    >
       <div class="about-section paddingTB60 gray-bg">
                <div class="container">
                    <div class="row">
						<div class="col-md-7 col-sm-6">
							<div class="about-title clearfix">
								<h1>About <span>US</span></h1>
								<h3> Manas Sinkar, Izhan Mohammad, Sai Nimkar </h3>
								<p class="about-paddingB">We are final year students pursuing IT from Sardar Patel Institute of Technology, Andheri. This was developed as our final year project.</p>
								<p>A body remains in the state of rest or uniform motion in a straight line unless and until an external force acts on it.</p>
                <p> - Issac Baba</p>
						<div class="about-icons"> 
                <ul >
                    <li><a href="https://www.facebook.com/"><i id="social-fb" class="fa fa-facebook-square fa-3x social"></i></a> </li>
                    <li><a href="https://twitter.com/"><i id="social-tw" class="fa fa-twitter-square fa-3x social"></i></a> </li>
                    <li> <a href="https://plus.google.com/"><i id="social-gp" class="fa fa-google-plus-square fa-3x social"></i></a> </li>
                    <li> <a href="mailto:bootsnipp@gmail.com"><i id="social-em" class="fa fa-envelope-square fa-3x social"></i></a> </li>
                </ul>       
               
               
	           
	           
	        
	        </div>
							</div>
						</div>
						<div class="col-md-5 col-sm-6">
							<div class="about-img">
								<img src="https://devitems.com/preview/appmom/img/mobile/2.png" alt="" />
							</div>
						</div>	
                    </div>
                </div>
            </div>
    </div>
  );
};

export default About;