import "../style/public.scss"
import React, { useState } from "react";

export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}