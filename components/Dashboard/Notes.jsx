import React from 'react'

export default function Notes() {
    return (
        <div>
            <div className="notes mb-4">
                <div className='d-flex justify-content-between'>
                    <h3 className='fw-bold'>Notes</h3>
                    <a href='#' className='text-muted'>
                        View All
                    </a>
                </div>

                <div className="notes-list">
                    <div class="card note-card mb-3">
                        <div class="card-body ">
                            <div className='d-flex justify-content-between'>
                                <div className='note-title '>
                                <p className="fw-bold mb-0">CSE Class 3 Notes</p>

                                </div>
                                <span className='notification-light rounded-pill'></span>
                                <div className="date">
                                    <div className="text-muted">Apr 01, 2023</div>
                                </div>
                                <div>
                                    <div class="dropdown">
                                        <div class="" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </div>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="#">Action</a></li>
                                            <li><a class="dropdown-item" href="#">Another action</a></li>
                                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card note-card mb-3">
                        <div class="card-body ">
                            <div className='d-flex justify-content-between'>
                                <div className='note-title '>
                                    <p className="fw-bold mb-0">Note Week 2</p>
                                </div>
                                <span className='notification-light rounded-pill'></span>
                                <div className="date">
                                    <div className="text-muted">Apr 19, 2023</div>
                                </div>
                                <div>
                                    <div class="dropdown">
                                        <div class="" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </div>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="#">Action</a></li>
                                            <li><a class="dropdown-item" href="#">Another action</a></li>
                                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card note-card mb-3">
                        <div class="card-body ">
                            <div className='d-flex justify-content-between'>
                                <div className='note-title'>
                                    <p className="fw-bold mb-0">CSE Class 4 Notes</p>
                                </div>
                                <span className='notification-light rounded-pill'></span>
                                <div className="date">
                                    <div className="text-muted">Apr 20, 2023</div>
                                </div>
                                <div>
                                    <div class="dropdown">
                                        <div class="" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </div>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="#">Action</a></li>
                                            <li><a class="dropdown-item" href="#">Another action</a></li>
                                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
