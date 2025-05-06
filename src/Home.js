import React from "react";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();

    return (
        <div>
            <Navbar title="Home" />
            <div className="content home-page">
                <h1>{t("Welcome Message")}</h1>
            </div>
        </div>
    );
};

export default Home;
