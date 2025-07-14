import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import VirtualTableCard from './VirtualTableCard';

export default function PopularTableSlider({ table, updateAllTableDetails }) {
    console.log('tablesssssss: ', table);

    return (
        <>
            <Swiper
                slidesPerView={1}
                centeredSlides={true}
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 3000,  // Set autoplay delay in milliseconds (e.g., 3000ms = 3 seconds)
                    disableOnInteraction: false,  // Continue autoplay after interactions
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper"
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 100,
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 150,
                    },
                }}

            >
                {/* {table?.length > 0 && table?.map((item, index) => (
                    item?.filter((item) => {
                        item?.tableMembers?.length> 2 && <SwiperSlide key={index}>
                        <VirtualTableCard tableData={item?.table} tableMember = {item?.tableMembers} updateAllTableDetails />
                    </SwiperSlide>
                    })
                    
                ))} */}
                {
                    table?.length > 0 &&
                    table?.filter((item) => item?.tableMembers?.length > 2).map((item) => {
                        return (
                            <SwiperSlide>
                                <VirtualTableCard
                                    tableData={item?.table}
                                    tableMember={item?.tableMembers}
                                    updateAllTableDetails
                                />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </>
    );
}
