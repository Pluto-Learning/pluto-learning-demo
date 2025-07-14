import React from 'react'

export default function Subscription() {
  return (
    <div className="subscription-main pt_50 pb_50" style={{background: "url('/assets/images/mail_bg.svg')"}}>
        <div className="container">
            <div className="subscription-content">
                <h4 className="subscription-content-title text-center">Embrace the future of studying. Join the waitlist!</h4>
                <form>
                    <input type="email" className="form-control" placeholder="plutofan@pluto.com" />
                    <button className="btn rounded-pill" type="submit">Lets's Rock</button>
                </form>
            </div>
        </div>
    </div>
  )
}
