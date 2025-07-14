"use client";
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the ArcElement and other components needed by Doughnut chart
Chart.register(ArcElement, Tooltip, Legend);

export default function StudyHours() {

    const data = {
        labels: ['Whiteboard', 'Task'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [300, 300],
                backgroundColor: ['#F52683', '#4361EE'],
                hoverBackgroundColor: ['#F52683', '#4361EE'],
                cutout: '50%', // Controls the size of the center hole
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div>
            <div className="study-hour">
                <div className="card study-hour-card mb-3 position-relative">
                    <div className="card-header pb-0 text-end border-0">
                        <div className='d-flex align-items-center justify-content-between'>
                            <h6 className='fw-bold'>Study Hours</h6>
                            <select className="form-select text-muted fw-bold border-0" aria-label="Default select example">
                                <option selected>Today</option>
                                <option value="1">Today</option>
                                <option value="2">Today</option>
                                <option value="3">Today</option>
                            </select>
                        </div>
                    </div>
                    <div className="card-body py-0 d-flex align-items-center">
                        <Doughnut data={data} options={options} />
                    </div>
                    <div className="card-footer pt-0 border-0">
                    </div>
                </div>
            </div>
        </div>
    );
}
