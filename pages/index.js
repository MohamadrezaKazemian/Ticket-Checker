import {useState, useRef, useEffect} from "react";
import style from "../style/index.module.scss"
import React from 'react'
import axios from 'axios';

const index = () => {
    const [loading , setLoading] = useState(true)
    const [data , setData] = useState([])
    const [dataToNigtht , setDataToNigtht] = useState([])
    const [allTickets , setAllTickets] = useState([])

    //اگر چند روز را داشته باشیم باید تمام بلیط ها را در یک آرایه بریزیم. مثال :
    if (loading === false){
        setAllTickets([...data , ...dataToNigtht])
        setLoading(true)
    }


    //درخواست اطلاعات به سمت سرور
    const getData = async () => {
        setLoading(true)
        await axios.post('https://bus.atighgasht.com/BusService/api/GetServices', {
            "From": 11320000,
            "To": 54360000,
            "Date": "2022-07-15",
            "Count": 1,
            "IncludeClosed": true,
            "IncludePromotions": true,
            "LoadFromDbOnUnavailability": true,
            "IncludeUnderDevelopment": true,
            "ExcludeProviderIds": [6]
        })
            .then(res => {
                setData( res?.data?.Buses)
            })
            .catch(err => {
                console.log(err)

            })
    }
    const getDataToNight = async () => {
        await axios.post('https://bus.atighgasht.com/BusService/api/GetServices', {
            "From": 11320000,
            "To": 54360000,
            "Date": "2022-07-07",
            "Count": 1,
            "IncludeClosed": true,
            "IncludePromotions": true,
            "LoadFromDbOnUnavailability": true,
            "IncludeUnderDevelopment": true,
            "ExcludeProviderIds": [6]
        })
            .then(res => {
                setDataToNigtht(res?.data?.Buses)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)

            })
    }

    //دریافت اطلاعات بلیط های دو روز
    function twoDay() {
        getData()
    }
    //تنظیم کردن دریافت اطلاعات هر 10 ثانیه یک بار
    useEffect(() => {
        const interval = setInterval(() => {
            twoDay()
        }, 10000);

        return () => clearInterval(interval);
    }, []);


    return (
        <div className={style.ticket}>
            <div>
                {
                    allTickets.length> 0?allTickets.map((item , index)=>{
                        return(
                            <div style={{background : item.Capacity === 0 ? "#a82e2e" : "#4b8869"}} key={index}>
                                <span>{item.Capacity}  صندلی خالی </span>
                                <span>روز {item?.Weekday}</span>
                                <span>{item?.DepartureTime.substring(11 , 16)} ساعت </span>
                            </div>
                        )
                    }):""

                }
            </div>
        </div>
    )
}

export default index
