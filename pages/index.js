import {useState, useRef, useEffect} from "react";
import style from "../style/index.module.scss"
import React from 'react'
import axios from 'axios';
import {Howl, Howler} from 'howler';
const index = () => {
    const inputEl = useRef(null);

    const sound = new Howl({
        src : ["son.mp3" , "son.mp3"]
    });
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [dataToNigtht, setDataToNigtht] = useState([])

    const [allTickets, setAllTickets] = useState([])
    dataToNigtht.map((item , index)=>{
        item?.Capacity > 1 ? sound.play() : ""
    })

    //اگر چند روز را داشته باشیم باید تمام بلیط ها را در یک آرایه بریزیم. مثال :
    if (loading === false) {
        setAllTickets([...data, ...dataToNigtht])
        setLoading(true)
        inputEl.current.click();
    }


    //درخواست اطلاعات به سمت سرور
    const getData = async () => {
        setLoading(true)
        await axios.post('https://bus.atighgasht.com/BusService/api/GetServices', {
            "From": 11320000,
            "To": 54360000,
            "Date": "2022-08-04",
            "Count": 1,
            "IncludeClosed": true,
            "IncludePromotions": true,
            "LoadFromDbOnUnavailability": true,
            "IncludeUnderDevelopment": true,
            "ExcludeProviderIds": [6]
        })
            .then(res => {
                setData(res?.data?.Buses)
            })
            .catch(err => {
                console.log(err)

            })
    }
    const getDataToNight = async () => {
        await axios.post('https://bus.atighgasht.com/BusService/api/GetServices', {
            "From": 54360000,
            "To": 11320000,
            "Date": "2022-08-08",
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
                inputEl.current.click();

            })
            .catch(err => {
                console.log(err)

            })
    }

    //دریافت اطلاعات بلیط های دو روز
    function twoDay() {
        // getData()
        getDataToNight()

    }

    //تنظیم کردن دریافت اطلاعات هر 10 ثانیه یک بار
    useEffect(() => {
        twoDay()

        const interval = setInterval(() => {

            twoDay()
        }, 50000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={style.ticket} ref={inputEl}>
            <div>

                {
                    dataToNigtht.length > 1 ? dataToNigtht.map((item, index) => {

                        return (
                            <div  style={{background: item.Capacity === 0 ? "#a82e2e" : "#4b8869"}} key={index}>
                                <span ref={inputEl}>{item.Capacity} صندلی خالی </span>
                                <span>روز {item?.Weekday}</span>
                                <span>{item?.DepartureTime.substring(11, 16)} ساعت </span>
                            </div>
                        )
                    }) : <div style={{
                        background: `red`,
                        position: `absolute`,
                        right: `0`,
                        left: `0`,
                        top: `50%`,
                        display: `flex`,
                        justifyContent : `center`
                    }}><span>درحال بارگزاری. . .</span></div>

                }
            </div>
        </div>
    )
}

export default index