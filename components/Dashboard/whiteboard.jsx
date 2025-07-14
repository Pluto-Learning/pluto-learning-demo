"use client"
import React, { useRef } from 'react'
import CanvasDraw from "react-canvas-draw";

export default function Whiteboard() {
    const firstCanvas = useRef(null);
    const handleClick = () => {
        const data = firstCanvas.current.getSaveData();
        // secondCanvas.current.loadSaveData(data);
    };
    const clear = () => {
        firstCanvas.current.clear();
    };
    const undo = () => {
        firstCanvas.current.undo();
    };

    return (
        <div>
            <div className="whiteboard">
                <div className='d-flex justify-content-between'>
                    <h3 className='fw-bold'>Whiteboard</h3>
                </div>
                <div class="card whiteboard-card overflow-hidden ">
                    <div class="card-header text-white d-flex justify-content-between">

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
                    <div class="card-body p-0 shadow-none">
                        <div className="whiteboard-content shadow-none">
                            {/* <div className="math-image text-center">
                                                        <img src={math} alt="" width={300} className='img-fluid' />
                                                    </div> */}
                            <CanvasDraw
                                ref={firstCanvas}
                                style={{
                                    // boxShadow: "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)",
                                    width: "100%",
                                }}
                                onChange={null}
                                loadTimeOffset={5}
                                lazyRadius={30}
                                brushRadius={5}
                                brushColor="#444"
                                catenaryColor="#0a0302"
                                gridColor="rgba(150,150,150,0.17)"
                                hideGrid={false}
                                // canvasWidth={500}
                                // canvasHeight={500}
                                disabled={false}
                                imgSrc=""
                                saveData={null}
                                immediateLoading={false}
                                hideInterface={false}
                                gridSizeX={25}
                                gridSizeY={25}
                                gridLineWidth={0.5}
                                hideGridX={false}
                                hideGridY={false}
                                enablePanAndZoom={false}
                                mouseZoomFactor={0.01}
                                zoomExtents={{ min: 0.33, max: 3 }}
                            />

                        </div>
                    </div>
                    <div className="card-footer">
                        {/* <button className='btn btn-light' onClick={handleClick}>Saved data</button> */}
                        <button className='btn btn-danger me-2' onClick={clear}>Clear</button>
                        <button className='btn btn-warning' onClick={undo}>Undo</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
