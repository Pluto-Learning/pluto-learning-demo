import InviteFriendsPopup from '@/components/InviteFriendsPopup'
import MultiStepForm from '@/components/MultiStepForm'
import MyCalendar from '@/components/MyCalendar'
import HomeLayout from '@/layouts/homeLayout/HomeLayout'
import ProfileLayout from '@/layouts/profileLayout/ProfileLayout'
import Link from 'next/link'
import React from 'react'

export default function page() {
    return (
        <HomeLayout>
            <div className="profile-content pt_50 pb_50">
                <div className="container">
                    <div className="course-selection">
                        <div className="row">
                            <div className="col-lg-6">
                                {/* <CourseSelectionForm /> */}
                                <h5 className='greetings'>Hi Ethan, lets start with telling us a bit about yourself</h5>
                                <h4 className='question'>What year are you in?</h4>
                                <MultiStepForm />
                            </div>
                            <div className="col-lg-6">
                                <MyCalendar />
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-12">

                                <div class="modal fade invite-friends-modal" id="invite-friends-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-xl">
                                        <div class="modal-content">
                                            <div class="modal-header border-0">
                                                <div className="pluto-logo">
                                                    <img src="/assets/images/pluto-profile-logo.png" alt="" className='img-fluid' />
                                                </div>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div className="friend-request-header">
                                                    <h4>Find your people</h4>
                                                    <p>Start here for information, connection and community.</p>
                                                    <p>Follow 5 of your peers</p>
                                                </div>
                                                <InviteFriendsPopup />
                                            </div>
                                            <div class="modal-footer border-0 d-flex justify-content-center">
                                                {/* <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                                                <Link href={'/invite-friends'} type="button" class="btn find-more-people-btn">Find More People</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}
