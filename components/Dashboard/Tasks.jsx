import React from 'react'
// import './task.css'

export default function Tasks() {
    return (
        <div>
            <div className="tasks">
                <div class="card ">
                    <div class="card-header text-white d-flex justify-content-between">
                        <span className='fw-bold'>Tasks</span>
                        <div class="dropdown">
                            <div type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis"></i>
                            </div>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body px-0 pt-2 pb-0">
                        <table class="task-table table table-borderless">
                            <tbody>
                                <tr>
                                    <td className='text-start py-2'>Watch the lectures</td>
                                    <td className='d-flex justify-content-end py-2'>
                                        <div class="form-check text-end">
                                            <input class="form-check-input " type="checkbox" value="" id="flexCheckDefault" />
                                        </div></td>
                                </tr>
                                <tr>
                                    <td className='text-start py-2'>Watch video tutorial with classmates</td>
                                    <td className='d-flex justify-content-end py-2'>
                                        <div class="form-check text-end">
                                            <input class="form-check-input " type="checkbox" value="" id="flexCheckDefault" />
                                        </div></td>
                                </tr>
                                <tr>
                                    <td className='text-start py-2'>Meet with Advisor</td>
                                    <td className='d-flex justify-content-end py-2'>
                                        <div class="form-check text-end">
                                            <input class="form-check-input " type="checkbox" value="" id="flexCheckDefault" />
                                        </div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
