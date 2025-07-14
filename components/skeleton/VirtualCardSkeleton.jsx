'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Avatar, Tooltip } from '@mui/material';
import { AvatarGroup } from '@mui/material';

const VirtualCardSkeleton = () => {
    return (
        <div className="popular-table-card card h-100">
            <div className="card-body">
                {/* Image Skeleton */}
                <div className="card-img position-relative mt-3">
                    <Skeleton height={150} width="100%" />
                </div>

                {/* Card Info */}
                <div className="card-info mt-3">
                    <div className="title-wrapper d-flex justify-content-between align-items-center">
                        <h4 className="card-title table-name">
                            <Skeleton width={100} />
                        </h4>
                        <Skeleton width={60} height={30} />
                    </div>
                    <p className="college-name"><Skeleton width={120} /></p>
                    <p className="description"><Skeleton count={2} /></p>
                </div>
            </div>

            {/* Card Footer */}
            <div className="card-footer border-0 d-flex justify-content-between align-items-center">
                {/* Avatar Group with Tooltips and Skeletons */}
                <AvatarGroup max={4}>
                    {Array(4).fill(0).map((_, idx) => (
                        // <Tooltip title={<Skeleton width={60} />} key={idx} arrow>
                        // </Tooltip>
                            <Avatar>
                                <Skeleton circle height={40} width={40} />
                            </Avatar>
                    ))}
                </AvatarGroup>

                {/* Invite Button Skeleton */}
                <Skeleton width={120} height={36} />
            </div>
        </div>
    );
};

export default VirtualCardSkeleton;
