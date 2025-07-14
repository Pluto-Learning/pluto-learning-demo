import Folder from '@/components/Dashboard/Folder'
import Friends from '@/components/Dashboard/Friends'
import Notes from '@/components/Dashboard/Notes'
import QuizMode from '@/components/Dashboard/QuizMode'
import SharedCalendar from '@/components/Dashboard/SharedCalendar'
import StudyHours from '@/components/Dashboard/StudyHours'
import Tasks from '@/components/Dashboard/Tasks'
import Whiteboard from '@/components/Dashboard/whiteboard'
import DashboardLayout from '@/layouts/dashboardLayout/DashboardLayout'
import React from 'react'

export default function page() {
    return (
        <div className='dashboard'>
            <div className="container-fluid ps-0">
                <DashboardLayout>
                    <div className="dashboard-content">
                        <div className="row g-5">
                            <div className="col-xl-5 col-lg-12">
                                <SharedCalendar />
                            </div>
                            <div className="col-xl-4 col-lg-6 ">
                                <Tasks />
                            </div>
                            <div className="col-xl-3 col-lg-6 ">
                                <StudyHours />
                            </div>
                            <div className="col-xl-4 col-lg-6 ">
                                <Notes />
                                {/* <Friends /> */}
                            </div>
                            <div className="col-xl-3 col-lg-6 ">
                                <Folder />
                                <QuizMode />
                            </div>
                            <div className="col-xl-5 col-lg-12 ">
                                <Whiteboard />
                            </div>
                        </div>
                    </div>
                </DashboardLayout>
            </div>
        </div>
    )
}
