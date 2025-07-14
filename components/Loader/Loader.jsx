import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';
// import animationData from '/assets/images/loader/x75laMAhoT.json';


export default function Loader() {
  return (
    <div className='preloader'>
      <div className="lottie-loader">
        <DotLottieReact
          // src="https://lottie.host/2c3927a0-4eb3-41b1-bca4-b3a977e93bb7/qx0oT4ArXG.json"
          src="https://lottie.host/a9904aa4-1753-4f73-a158-4cfa48ec77d0/KI3pqnndwx.json"
          // src={"/assets/images/loader/loader.json"}
          loop
          autoplay
        />
      </div>
    </div>
  )
}
