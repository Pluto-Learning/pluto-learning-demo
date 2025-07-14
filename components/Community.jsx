import React from 'react'
// import musicPlayerPluto from '/assets/images/grayed-out-pluto.svg'
import { Camera, Pause, SkipNext, SkipPrev } from 'iconoir-react'

export default function Community() {
    return (
        <div id="community" className="community-main pt_50 pb_50">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="community-text">
                            <h2>Community like no other.</h2>
                            <h5>It is a well known fact that Pluto is a planet...</h5>
                            <p>But it is also an online learning platform offering a unique format to connect with others, share ideas, and expand your mind!</p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div class="content-ui-wrapper">
                            <div className="content-ui">
                                <div className="column">
                                    <section className="content-ui-card">
                                        <ul className="class-list">
                                            <li className="class-item">
                                                <div className="class-plus-icon">+</div>
                                                <div className="class-text">Finish Geology HW and take Quiz 4</div>
                                            </li>
                                            <li className="class-divider" aria-hidden></li>
                                            <li className="class-item">
                                                <div className="class-plus-icon">+</div>
                                                <div className="class-text">Meet with your advisor at 2 PM.</div>
                                            </li>
                                        </ul>
                                    </section>
                                    <section className="content-ui-card">
                                        <div className="quote-icon">icon</div>
                                        <div className="quote-container">
                                            <div className="quote-symbol left">“</div>
                                            <div className="quote-text">Join my table! Accounting 2301 session happening right now.</div>
                                            <div className="quote-symbol right">”</div>
                                        </div>
                                    </section>
                                    <section className="content-ui-card search">
                                        <input className="search-input"
                                            type="text"
                                            placeholder="Search for a class, group, or person" />
                                    </section>
                                </div>
                                <div className="column">
                                    <section className="content-ui-card tables">
                                        <h2 className="content-ui-card-header">Choose to join one of the pre-existing tables!</h2>
                                        <ul className="table-list">
                                            <li className="table-item active">ACCT 2301</li>
                                            <li className="table-item">Bio freshman peeps!</li>
                                            <li className="table-item">Vandergriff 3rd floor study class</li>
                                            <li className="table-item">Goolsby Cohort 19 GANG</li>
                                            <li className="table-item">ACM Shenanigans</li>
                                            <li className="table-item">Roger Wehr ECON 3300</li>
                                        </ul>
                                    </section>
                                    <section className="content-ui-card tasks">
                                        <h2 className="content-ui-card-header">Choose a task!</h2>
                                        <ul className="task-list">
                                            <li className="task-group">
                                                <div className="task-datetime">
                                                    <span className="task-datetime-day">20</span>
                                                    <span className="task-datetime-month">Nov</span>
                                                </div>
                                                <ul className="task-group-list">
                                                    <li className="task-group-list-item blue">Astronomy class</li>
                                                    <li className="task-group-list-item">Work from 1PM to 5PM.</li>
                                                </ul>
                                            </li>
                                            <li className="task-group">
                                                <div className="task-datetime">
                                                    <span className="task-datetime-day">25</span>
                                                    <span className="task-datetime-month">Nov</span>
                                                </div>
                                                <ul className="task-group-list">
                                                    <li className="task-group-list-item blue">Honors Collge General Meeting</li>
                                                    <li className="task-group-list-item blue">Halls Council Hangout 7PM</li>
                                                    <li className="task-group-list-item">GYM PR TIME!!!</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </section>
                                </div>
                                <div className="column">
                                    <section className="content-ui-card music-player">
                                        <div className="music-player-icon"><img src={'/assets/images/grayed-out-pluto.svg'} /></div>
                                        <div className="slider-container">
                                            <div className="slider-track">
                                                <span className="slider-thumb"></span>
                                            </div>
                                        </div>
                                        <div className="music-player-button-container">
                                            <button className="music-player-button"><SkipPrev height={36} /></button>
                                            <button className="music-player-button"><Pause height={36} /></button>
                                            <button className="music-player-button"><SkipNext height={36} /></button>
                                        </div>
                                    </section>
                                    <section className="content-ui-card post">
                                        <header className="post-header">
                                            <img className="post-header-icon" src={'/assets/images/grayed-out-pluto.svg'} height={24} width={24} />
                                            <div className="post-header-text">
                                                <span className='post-header-title'>CSE 1320 - Programming</span>
                                                <span className='post-header-desc'>The University of Texas at Arlington</span>
                                            </div>
                                        </header>
                                        <div className="post-content">
                                            <figure className="post-content-image">
                                                <Camera height={48} />
                                            </figure>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
