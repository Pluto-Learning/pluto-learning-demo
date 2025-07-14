import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatDate } from "@fullcalendar/core";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Tooltip } from "@mui/material";

const Calendar = ({ data }) => {
    console.log('datadatadata: ', data);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (selected) => {
        setSelectedEvent(selected.event);
        console.log('calendar schedule: ', selected.event);
    };

    const handleClosePopup = () => {
        setSelectedEvent(null);
    };

    // Color sets for events
    const colorSets = [
        { background: "#F1EAFC", borderTop: "#870AA6" },
        { background: "#0654BA", borderTop: "#DEF4FE" },
        { background: "#0AA630", borderTop: "#DCF8E1" },
        { background: "#EC8E02", borderTop: "#FFE9CB" },
        { background: "#00AAFF", borderTop: "#EAF1FF" },
        { background: "#FF4589", borderTop: "#FFD5DD" },
    ];

    // Custom rendering for event content
    const renderEventContent = (eventInfo) => {
        const { title, start, end, extendedProps, _def } = eventInfo.event;
        const { attendees = [], courseName } = extendedProps; // Default to empty array if no attendees
        const eventId = _def.publicId;

        const colorIndex = typeof eventId === "string" ? parseInt(eventId.slice(-1)) % colorSets.length : 0;
        const { background, borderTop } = colorSets[colorIndex] || colorSets[0];

        return (
            <div style={{
                padding: "10px",
                borderRadius: "0 0 8px 8px",
                backgroundColor: background,
                borderTop: `2px solid ${borderTop}`,
                width: "100%",
                overflow: "hidden"
            }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px", color: '#000' }}>{title}</div>
                {courseName && <div style={{ color: '#555', fontSize: '12px', marginBottom: '4px' }}>Course: {courseName}</div>}
                <div>
                    <small style={{ color: '#666' }}>
                        {formatDate(start, { hour: "numeric", minute: "numeric" })} - {formatDate(end, { hour: "numeric", minute: "numeric" })}
                    </small>
                </div>
                <AvatarGroup max={3} style={{ justifyContent: "left", marginTop: "4px" }}>
                    {attendees.map((attendee, index) => (
                        <Tooltip title={attendee.name} placement="top-start" arrow key={index}>
                            <Avatar alt={attendee.name} src={attendee.imageUrl} sx={{ width: 24, height: 24 }} />
                        </Tooltip>
                    ))}
                </AvatarGroup>
            </div>
        );
    };

    return (
        <div className="full-calendar">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                initialView="dayGridMonth"
                editable={false}
                selectable={false}
                events={data}
                eventClick={handleEventClick}
                height="80vh"
                eventContent={renderEventContent}
            />

            {selectedEvent && (
                <div className="modal show d-block transition full-calendar-modal" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedEvent.title}</h5>
                                <button type="button" className="btn-close" onClick={handleClosePopup}></button>
                            </div>
                            <div className="modal-body">
                                {selectedEvent.extendedProps.courseName && (
                                    <p className="text-capitalize"><strong>Course Name:</strong> {selectedEvent.extendedProps.courseName}</p>
                                )}
                                {/* {selectedEvent.extendedProps.sectionName && (
                                    <p><strong>Section:</strong> {selectedEvent.extendedProps.sectionName}</p>
                                )} */}
                                <p>
                                    <strong>Start:</strong> {formatDate(selectedEvent.start, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })}
                                </p>
                                {
                                    selectedEvent.end &&
                                    <p>
                                        <strong>End:</strong> {formatDate(selectedEvent.end, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })}
                                    </p>
                                }

                                <p>
                                    <strong>All Day:</strong> {selectedEvent.allDay ? "Yes" : "No"}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClosePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
