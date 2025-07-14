import HomeLayout from 'layouts/homeLayout/HomeLayout.jsx';
import { timeAgo } from 'utils/hepler.js';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { createClient } from "@liveblocks/client";
import { RoomProvider } from 'utils/liveblocks.config.js';
import PersonalAiChat from 'components/AiChat/PersonalAiChat.jsx';
import Loader from 'components/Loader/Loader.jsx';
