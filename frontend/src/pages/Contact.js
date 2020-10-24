import React from 'react';

const Contact = () => {
  return (
    <div
       style={{
        marginLeft: '50px',
        marginRight: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'
      }}
    >
      
      <div>
          <iframe title="SPIT" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.6459336030325!2d72.83392671483827!3d19.12318265545724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9d90e067ba9%3A0x16268e5d6bca2e6a!2sBharatiya%20Vidya%20Bhavan&#39;s%20Sardar%20Patel%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1603525174512!5m2!1sen!2sin"
      width="600" height="450" frameborder="0" style={{border:"border:0"}} allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
      </div>
  
      

      <div className="container">
        <h2 className="text-center" style={{margin: "30px"}}>Contact Form</h2>
	      <div className="row justify-content-center">
		      <div className="col-12 col-md-8 col-lg-6 pb-5">
            <form action="">
                        <div className="card border-primary rounded-0">
                            <div className="card-header p-0">
                                <div className="bg-info text-white text-center py-2">
                                    <h3><i className="fa fa-envelope"></i> Contact Us!</h3>
                                    <p className="m-0">We'll get back to you.</p>
                                </div>
                            </div>
                            <div className="card-body p-3" style={{width: "100%"}}>

                                <div className="form-group">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-user text-info"></i></div>
                                        </div>
                                        <input type="text" className="form-control" id="nombre" name="nombre" placeholder="Manas Sinkar" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-envelope text-info"></i></div>
                                        </div>
                                        <input type="email" className="form-control" id="nombre" name="email" placeholder="manas.sinkar@gmail.com" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text"><i className="fa fa-comment text-info"></i></div>
                                        </div>
                                        <textarea className="form-control" placeholder="Comment" required></textarea>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <input type="submit" value="Enter" className="btn btn-info btn-block rounded-0 py-2" />
                                </div>
                            </div>

                        </div>
                    </form>

                </div>
	</div>
</div>
    </div>
  );
}

export default Contact;