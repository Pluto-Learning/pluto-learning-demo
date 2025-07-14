"use client"
import LiveCalling from '@/components/calling/LiveCalling'
import React, { useState } from 'react'
import { Rnd } from 'react-rnd'

export default function page() {

    const [rnd, setRnd] = useState({ width: '100px', height: '100px', x: 10, y: 10 })
    const setPosition = (e, direction) => {
        setRnd((prev) => ({
            ...prev,
            x: direction.x,
            y: direction.y
        }))
    }

    const setSize = (e, direction, ref, delta, position) => {
        setRnd((prev) => ({
            ...prev,
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
            ...position
        }))
    }

    return (
        <div>
            {/* <h1>Live Calling</h1> */}
            <div>
                <Rnd
                    style={{ backgroundColor: 'pink' }}
                    size={{ width: rnd.width, height: rnd.height }}
                    position={{ x: rnd.x, y: rnd.y }}
                    onDragStop={setPosition}
                    onResizeStop={setSize}
                >

                    <LiveCalling />
                </Rnd>
            </div>
        </div>
    )
}
