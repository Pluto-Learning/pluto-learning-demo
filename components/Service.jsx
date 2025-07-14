import React from 'react'

export default function Service() {
  return (
    <div className='service-main'>
        <div className="container">
            <div className=" service-card-wrapper">
                {/* <div className="col-lg-4"> */}
                    <div className="service-single connect">
                        <div className="service-icon rounded-pill">
                            <img src="/assets/images/service/connect-icon.png" alt="" className='img-fluid'/>
                        </div>
                        <div className="service-name">
                            <img src="/assets/images/service/connect.png" alt="" className='img-fluid'/>
                        </div>
                        <p className="service-description">
                            with new campus communities
                        </p>
                    </div>
                {/* </div> */}
                {/* <div className="col-lg-4"> */}
                    <div className="service-single grow">
                        <div className="service-icon rounded-pill">
                            <img src="/assets/images/service/grow-icon.png" alt="" className='img-fluid'/>
                        </div>
                        <div className="service-name">
                            <img src="/assets/images/service/grow.png" alt="" className='img-fluid'/>
                        </div>
                        <p className="service-description">
                            with new campus communities
                        </p>
                    </div>
                {/* </div> */}
                {/* <div className="col-lg-4"> */}
                    <div className="service-single explore">
                        <div className="service-icon rounded-pill">
                            <img src="/assets/images/service/explore-icon.png" alt="" className='img-fluid'/>
                        </div>
                        <div className="service-name">
                            <img src="/assets/images/service/explore.png" alt="" className='img-fluid'/>
                        </div>
                        <p className="service-description">
                            with new campus communities
                        </p>
                    </div>
                {/* </div> */}
            </div>
        </div>
    </div>
  )
}
