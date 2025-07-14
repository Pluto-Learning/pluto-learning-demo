"use client";
import HomeLayout from '@/layouts/homeLayout/HomeLayout';
import React, { useEffect, useState } from 'react';
import { useSyncDemo, createPresenceStateDerivation } from '@tldraw/sync';
import { Tldraw, useTldrawUser, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '@/components/Loader/Loader';

import Link from 'next/link';
import { fetchTableById, updateTableLastTime, updateTableMemberLastActiveStatus } from '@/app/api/crud';
import { Rnd } from 'react-rnd';
import LiveCalling from '@/components/calling/LiveCalling';
import AiChat from '@/components/AiChat/AiChat';
// import LiveBlocksComments from '@/components/LiveBlocksComments/LiveBlocksComments';
import { createClient } from "@liveblocks/client";
import { RoomProvider } from "@/utils/liveblocks.config";
import { toast } from 'react-toastify';
import FileUpload from '@/components/virtualTable/FileUpload';
import { Tooltip } from '@mui/material';
import GroupChat from '@/components/GroupChat';

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY
});

export default function Page() {
  const [editor, setEditor] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const uniqueRoomId = pathname.split("/").pop();

  console.log('pathnamepathname tableId:', pathname);
  const [tableData, setTableData] = useState({})

  const getTableByRoomId = async () => {
    try {
      const data = await fetchTableById(uniqueRoomId, session?.user?.token)
      setTableData(data)
      // if (!data) {
      //   router.push('/not-found');
      // } else {
      //   return
      // }

    } catch (error) {
      console.log(error)
    }
  }

  // getTableByRoomId()
  useEffect(() => {
    getTableByRoomId()
  }, [uniqueRoomId])

  console.log('tableData: ', tableData)

  // if(uniqueRoomId){

  //   // api call

  //   //condigion
  //   if(false){
  //     router.push('/not-found')
  //   }
  // }

  const { data: session } = useSession()

  console.log('sessionsessionsessionsession', session)

  const [userPreferences, setUserPreferences] = useState({
    id: 'user-' + Math.random(),
    name: session?.user?.id ?? 'sakib',
    color: 'palevioletred',
    // colorScheme: 'dark',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXLb3TY72rHh4VSJUR8UGa83p3ABg3FRBNrw&s'
  })

  useEffect(() => {
    setUserPreferences({
      id: session?.user?.id,
      name: session?.user?.id ?? 'sakib',
      color: 'palevioletred',
      // colorScheme: 'dark',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXLb3TY72rHh4VSJUR8UGa83p3ABg3FRBNrw&s'
    })
  }, [session])

  // [2]
  const store = useSyncDemo({ roomId: uniqueRoomId, userInfo: userPreferences })

  // [3]
  const user = useTldrawUser({ userPreferences, setUserPreferences })

  // Create a presence state derivation for the current user
  const derivePresenceState = (str) => {
    console.log('sssssssssss', str)
  };

  const updateTableLastActive = async () => {
    try {
      await updateTableLastTime(uniqueRoomId, session?.user?.token)
      // toast.success('Table Time Updated successfully');
    } catch (error) {
      console.error("Error Update Table Last Active:", error);
    }
  }

  const updateTableMemberLastActive = async () => {
    try {
      await updateTableMemberLastActiveStatus(session?.user?.id, uniqueRoomId)
      // toast.success(`Member Table ${uniqueRoomId} Time Updated successfully`);
    } catch (error) {
      console.error("Error Update Table Last Active:", error);
    }
  }

  const [value, setValue] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => prevValue + 1); // increment the value every 5 seconds
      updateTableLastActive()
    }, 5000);

    return () => clearInterval(interval); // cleanup on component unmount
  }, []);

  useEffect(() => {
    console.log("editor", editor);
  }, [editor]);

  useEffect(() => {
    updateTableMemberLastActive()
  }, [session, uniqueRoomId])

  // const [rnd, setRnd] = useState({ width: '100px', height: '100px', x: 10, y: 10 })
  //   const setPosition = (e, direction) => {
  //       setRnd((prev) => ({
  //           ...prev,
  //           x: direction.x,
  //           y: direction.y
  //       }))
  //   }

  //   const setSize = (e, direction, ref, delta, position) => {
  //       setRnd((prev) => ({
  //           ...prev,
  //           width: parseInt(ref.style.width, 10),
  //           height: parseInt(ref.style.height, 10),
  //           ...position
  //       }))
  //   }

  // const [isChatOpen, setIsChatOpen] = useState(false);

  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);

  return (
    <HomeLayout>
      <div className="whiteboard-area">
        <div className="virtual-table whiteboard">

          {
            uniqueRoomId && session?.user?.id ?
              <>
                <div className="room-title">
                  <h4 className='mb-0 text-capitalize'>Table Name: {tableData?.roomName}</h4>
                </div>
                <div className="logo d-none">
                  <Link href={'/'}>
                    <img src="/assets/images/pluto-icon-pink.svg" alt="" className="img-fluid" />
                  </Link>
                </div>
                <div className="file-upload-main">
                  <FileUpload room={uniqueRoomId} user={session?.user?.id} />
                </div>
                <div className='video-call-btn-container '>
                  <Tooltip title={`${showVideoCall ? 'Hide Video Call' : 'Show Video Call'}`} placement="top" arrow className=''>
                    <button className='btn video-call-btn shadow' onClick={() => setShowVideoCall((prev) => !prev)}>
                      <img src="/assets/images/support-services-white.png" alt="" style={{ width: '30px' }} />
                    </button>
                  </Tooltip>
                </div>
                <Tldraw
                  store={store}
                  user={user}
                  onMount={(editorInstance) => {
                    setEditor(editorInstance);
                  }}
                />

                <Link href={'/table-discovery'} type='button' className="btn pluto-pink-btn leave-button ">Back to Tables</Link>

                {/* <Rnd
                  // style={{ backgroundColor: 'pink' }}
                  size={{ width: rnd.width, height: rnd.height }}
                  position={{ x: rnd.x, y: rnd.y }}
                  onDragStop={setPosition}
                  onResizeStop={setSize}
                  >
                  </Rnd> */}
                {
                  showVideoCall &&
                  <LiveCalling username={session?.user?.id} roomId={uniqueRoomId} updateLastActiveTime={updateTableLastActive} />
                }

                {editor && (
                  <RoomProvider client={client} id={uniqueRoomId}>
                    <AiChat editor={editor} roomId={uniqueRoomId} />
                  </RoomProvider>
                )}

                <div className='group-chat-btn-container'>
                  {
                    showGroupChat &&
                    <div className="group-chat-area">
                      <GroupChat roomId={uniqueRoomId} setShowGroupChat={setShowGroupChat} showGroupChat={showGroupChat}  />
                    </div>
                  }
                </div>
                <button className="btn group-chat-btn" onClick={() => setShowGroupChat((prev) => !prev)}>
                  {
                    showGroupChat ? <i class="ri-close-large-line"></i> : <i class="ri-question-answer-fill"></i>
                  }

                </button>
              </>
              :
              <>
                <Loader />
              </>
          }
        </div>
      </div>
    </HomeLayout>
  );
}
