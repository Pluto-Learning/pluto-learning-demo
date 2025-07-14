"use client"
import React, { useState } from 'react';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        studentStatus: '',
        course: '',
        date: '',
        fromTime: '',
        toTime: '',
        purpose: ''
    });

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted', formData);
    };

    return (
        <div className="multistep-form">
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div>
                        <div className='multistep-form-step status'>
                            <ul className='nav flex-column'>
                                <li className='nav-item'>
                                    <div className="custom-radio-btn status">
                                        <input
                                            type="radio"
                                            name="studentStatus"
                                            value="fresherman"
                                            checked={formData.studentStatus === 'fresherman'}
                                            onChange={handleChange}
                                            id="fresherman"
                                        />
                                        <label htmlFor='fresherman'>Fresherman</label>
                                    </div>
                                </li>
                                <li className='nav-item'>
                                    <div className="custom-radio-btn status">
                                        <input
                                            type="radio"
                                            name="studentStatus"
                                            value="sophomore"
                                            checked={formData.studentStatus === 'sophomore'}
                                            onChange={handleChange}
                                            id="sophomore"
                                        />
                                        <label htmlFor="sophomore">Sophomore</label>
                                    </div>
                                </li>
                                <li className='nav-item'>
                                    <div className="custom-radio-btn status">
                                        <input
                                            type="radio"
                                            name="studentStatus"
                                            value="junior"
                                            checked={formData.studentStatus === 'junior'}
                                            onChange={handleChange}
                                            id="junior"
                                        />
                                        <label htmlFor="junior">Junior</label>
                                    </div>
                                </li>
                                <li className='nav-item'>
                                    <div className="custom-radio-btn status">
                                        <input
                                            type="radio"
                                            name="studentStatus"
                                            value="senior"
                                            checked={formData.studentStatus === 'senior'}
                                            onChange={handleChange}
                                            id="senior"
                                        />
                                        <label htmlFor="senior">Senior</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="btn-wrapper">
                            <button type="button" className='btn step-btn next' onClick={handleNext} disabled={!formData.studentStatus}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className='multistep-form-step course'>
                            <form>
                                <div className="course-add-section">
                                    <div className='course-input'>
                                        <input type="text" className='form-control' placeholder='Type your course name' />
                                    </div>
                                    <div className='section-input'>
                                        <select className="form-select" aria-label="Default select example">
                                            <option selected>Section</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                    {/* <div className="btn-wrapper">
                                        <button className="btn add-btn">Add</button>
                                    </div> */}
                                </div>
                                {/* <p className='course-suggestion'>course suggestion</p> */}
                                {/* <ul className="nav">
                                    <li className="nav-item">
                                        <div className="custom-radio-btn course">
                                            <input
                                                type="radio"
                                                name="course"
                                                value="math101"
                                                checked={formData.course === 'math101'}
                                                onChange={handleChange}
                                                id="math101"
                                            />
                                            <label htmlFor="math101">Math 101</label>
                                        </div>
                                    </li>
                                    <li className="nav-item">
                                        <div className="custom-radio-btn course">
                                            <input
                                                type="radio"
                                                name="course"
                                                value="engl1320"
                                                checked={formData.course === 'engl1320'}
                                                onChange={handleChange}
                                                id="engl1320"
                                            />
                                            <label htmlFor="engl1320">Engl 1320</label>
                                        </div>
                                    </li>
                                    <li className="nav-item">
                                        <div className="custom-radio-btn course">
                                            <input
                                                type="radio"
                                                name="course"
                                                value="cse1320"
                                                checked={formData.course === 'cse1320'}
                                                onChange={handleChange}
                                                id="cse1320"
                                            />
                                            <label htmlFor="cse1320">Cse 1320</label>
                                        </div>
                                    </li>
                                </ul> */}
                            </form>
                        </div>

                        {/* <div className='multistep-form-step time'>
                            <div className="date-time-wrapper">
                                <div className='date-time'>
                                    <label htmlFor="date" className='mb-1'>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className='form-control'
                                        id="date"
                                    />
                                </div>
                                <div className='date-time'>
                                    <label htmlFor="from-time" className='mb-1'>From</label>
                                    <input
                                        type="time"
                                        name="fromTime"
                                        value={formData.fromTime}
                                        onChange={handleChange}
                                        className='form-control'
                                        id='from-time'
                                    />
                                </div>
                                <div className='date-time'>
                                    <label htmlFor="to-time" className='mb-1'>To</label>
                                    <input
                                        type="time"
                                        name="toTime"
                                        value={formData.toTime}
                                        onChange={handleChange}
                                        className='form-control'
                                        id="to-time"
                                    />
                                </div>
                            </div>

                            <div className="purpose">
                                <input
                                    type="text"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className='form-control'
                                    placeholder='Type Your Purpose'
                                />
                            </div>
                        </div> */}

                        <div className='btn-wrapper'>
                            <button type="button" className='btn step-btn prev' onClick={handlePrev}>
                                Back
                            </button>
                            <button type="submit" className='btn step-btn submit' data-bs-toggle="modal" data-bs-target="#invite-friends-modal">Submit</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MultiStepForm;
