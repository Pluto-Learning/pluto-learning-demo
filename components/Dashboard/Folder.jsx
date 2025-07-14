'use client'
import React, { useEffect, useState } from 'react'
import { AvatarGroup, Box, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { fetchTableMemberFilesByUserId } from '@/app/api/crud';
import { useSession } from 'next-auth/react';
import { getFileIconClass, truncate } from '@/utils/hepler';
import Link from 'next/link';

export default function Folder() {

    const { data: session } = useSession()
    const [tableFolder, setTableFolder] = useState(null)
    const getTableMemberFilesByUserId = async () => {
        try {
            const data = await fetchTableMemberFilesByUserId(session?.user?.id, session?.user?.token)
            setTableFolder(data)
        } catch (error) {
            console.log('error getting TableMemberFilesByUserId: ', error)
        }
    }

    useEffect(() => {
        getTableMemberFilesByUserId()
    }, [session])

    console.log('tableFolder: ', tableFolder)

    return (
        <>
            <div className="folder">
                <div className='d-flex justify-content-between'>
                    <h3 className='fw-bold'>Folder</h3>
                </div>
                <div className="folder-list">
                    {
                        tableFolder && 
                        tableFolder?.length > 0
                        && tableFolder?.map((item) => {
                            const {
                                roomId,
                                tableName,
                                tableFiles
                            } = item;
                            return (
                                <>
                                    <div class="card folder-card mb-3 position-relative" key={roomId}>
                                        <div className="card-header pb-0 text-end border-0">
                                            <div style={{ fontSize: '18px' }}>
                                                <i class="fa-solid fa-paperclip"></i>
                                            </div>
                                        </div>
                                        <div class="card-body py-0 d-flex align-items-center ">
                                            <img src={'/assets/images/folder.svg'} alt="" className='img-fluid' data-bs-toggle="modal" data-bs-target=
                                                {`#showFolderModal-${roomId}`} />
                                            <div className="folder-title ms-4">
                                                <p className="mb-0 fw-bold text-capitalize">{tableName}</p>
                                                <span className='text-muted'>{tableFiles?.length > 0 ? tableFiles?.length : 0} Files</span>
                                            </div>

                                        </div>
                                        <div className="card-footer pt-0 border-0">
                                            <AvatarGroup
                                                max={4}
                                                sx={{
                                                    '& .MuiAvatar-root': {
                                                        width: 24,
                                                        height: 24,
                                                    },
                                                    '& .MuiAvatarGroup-avatar': {
                                                        width: 24,
                                                        height: 24,
                                                        fontSize: '0.75rem', // Adjust this value to make the font size smaller
                                                    }
                                                }}
                                            >
                                                <Avatar sx={{ width: 24, height: 24 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                                <Avatar sx={{ width: 24, height: 24 }} alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                                <Avatar sx={{ width: 24, height: 24 }} alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                                                <Avatar sx={{ width: 24, height: 24 }} alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                                                <Avatar sx={{ width: 24, height: 24 }} alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                                            </AvatarGroup>
                                        </div>
                                    </div>

                                    <div class="modal fade folder-modal" id={`showFolderModal-${roomId}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog  modal-lg modal-dialog-centered">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel">{tableName}</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <div className="folder-layout">
                                                        {
                                                            tableFiles && tableFiles?.length > 0
                                                            && tableFiles?.map((item) => {
                                                                return (
                                                                    <>
                                                                        <Tooltip title={item.fileName} placement="bottom" arrow>
                                                                            <Link href={item?.fileAwsUrl} download={item.fileName}>
                                                                                <div className="single-folder text-center">
                                                                                    <img src={getFileIconClass(item.fileName)} alt="" className='img-fluid' />
                                                                                    <p className="folder-name m-0 fw-bold">{truncate(item.fileName)}</p>
                                                                                </div>
                                                                            </Link>
                                                                        </Tooltip>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                        {/* <div className="single-folder text-center">
                                                            <img src={'/assets/images/file-icons/word.png'} alt="" className='img-fluid' />
                                                            <p className="folder-name m-0 fw-bold">English</p>
                                                        </div> */}
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }

                    {/* <div class="card folder-card mb-3 position-relative">
                        <div className="card-header pb-0 text-end border-0">
                            <div style={{ fontSize: '18px' }}>
                                <i class="fa-solid fa-paperclip"></i>
                            </div>
                        </div>
                        <div class="card-body py-0 d-flex align-items-center ">
                            <img src={'/assets/images/folder.svg'} alt="" className='img-fluid' data-bs-toggle="modal" data-bs-target="#exampleModal" />
                            <div className="folder-title ms-4">
                                <p className="mb-0 fw-bold">Moodboard</p>
                                <span className='text-muted'>4 Files</span>
                            </div>

                        </div>
                        <div className="card-footer pt-0 border-0">
                            <AvatarGroup
                                max={4}
                                sx={{
                                    '& .MuiAvatar-root': {
                                        width: 24,
                                        height: 24,
                                    },
                                    '& .MuiAvatarGroup-avatar': {
                                        width: 24,
                                        height: 24,
                                        fontSize: '0.75rem', // Adjust this value to make the font size smaller
                                    }
                                }}
                            >
                                <Avatar sx={{ width: 24, height: 24 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                <Avatar sx={{ width: 24, height: 24 }} alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                <Avatar sx={{ width: 24, height: 24 }} alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                                <Avatar sx={{ width: 24, height: 24 }} alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                                <Avatar sx={{ width: 24, height: 24 }} alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                            </AvatarGroup>
                        </div>
                    </div> */}

                </div>
            </div>

            {/* <div class="modal fade folder-modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog  modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Moodboard</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div className="folder-layout d-flex flex-wrap" style={{ gap: "20px" }}>
                                <div className="single-folder text-center">
                                    <img src={'/assets/images/file-icons/word.png'} alt="" className='img-fluid' />
                                    <p className="folder-name m-0 fw-bold">English</p>
                                </div>
                                <div className="single-folder text-center">
                                    <img src={'/assets/images/file-icons/xls.png'} alt="" className='img-fluid' />
                                    <p className="folder-name m-0 fw-bold">Math</p>
                                </div>
                                <div className="single-folder text-center">
                                    <img src={'/assets/images/file-icons/pdf.png'} alt="" className='img-fluid' />
                                    <p className="folder-name m-0 fw-bold">Physics</p>
                                </div>
                                <div className="single-folder text-center">
                                    <img src={'/assets/images/file-icons/doc.png'} alt="" className='img-fluid' />
                                    <p className="folder-name m-0 fw-bold">Java</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}
