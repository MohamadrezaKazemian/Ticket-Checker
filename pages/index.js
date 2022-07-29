import style from "../style/index.module.scss"
import React, { useState } from "react";
import axios from 'axios';
import { DatePicker      } from "jalali-react-datepicker";


const index = () => {
    const [loading , setLoading] = useState()
    const [data , setData] = useState([])
    const [selectedDay , setSelectedDay] = useState("")
    console.log(selectedDay)
    function submitExample({ value }) {
        setSelectedDay(value._i.slice(0, -3))

    }



    const getData = async () => {
        if (selectedDay === ""){
            alert("لطفا یک تاریخ را انتخاب نمایید")
        }else{
            setLoading(true)

            await axios.post('https://bus.atighgasht.com/BusService/api/GetServices', {
                "From": 11320000,
                "To": 54360000,
                "Date": selectedDay,
                "Count": 1,
                "IncludeClosed": true,
                "IncludePromotions": true,
                "LoadFromDbOnUnavailability": true,
                "IncludeUnderDevelopment": true,
                "ExcludeProviderIds": [6]
            })
                .then(res => {
                    setData( res?.data?.Buses)
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)

                })
        }
    }



    //تنظیم کردن دریافت اطلاعات هر 10 ثانیه یک بار
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         twoDay()
    //     }, 10000);

    //     return () => clearInterval(interval);
    // }, []);


    return (
        <div className={style.ticket}>
            <div className={style.theForm}>
                <div>
                    <span>تاریخ حرکت</span>
                    <DatePicker
                        timePicker={false}
                        onClickSubmitButton={submitExample}
                    />
                </div>
                <button onClick={()=>getData()}>ثبت درخواست</button>

            </div>
            <div className={style.results}>
                {
                 loading === true ? <p className={style.loading}>درحال بارگزاری...</p> :
                     data.length> 0?data.map((item , index)=>{
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
