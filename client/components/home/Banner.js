import React from 'react';
import Link from 'next/link';


 const Banner = ({ currentUser }) => {

    return (
        <div className="banner">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="banner__pic">
                        <img src="img/banner/banner-1.jpg" alt="" />
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="banner__pic">
                        <img src="img/banner/banner-2.jpg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    )

}

export default Banner;