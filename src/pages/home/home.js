import React from "react";
import Banner from "../components/banner/banner";
import Header from "../components/header"
import './home.css'

function Home() {
    return (
        <div className="home">
            <Header />
            <Banner />
        </div>
    )
}

export default Home;