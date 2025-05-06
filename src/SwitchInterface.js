import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

const SwitchInterface = () => {
    const { t } = useTranslation();
    const [switchData, setSwitchData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/switch-info");
                const data = await response.json();
                console.log("Fetched Data:", data); // Log the response to check
                setSwitchData(data); // Set all switch data (Switch1, Switch2, Switch3)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Navbar title="Switch Interfaces" />
            <div className="content switch-interface">
                <h1>{t("Switch Details")}</h1>

                {/* Render Interfaces for all switches */}
                {Object.keys(switchData).length > 0 ? (
                    Object.keys(switchData).map((switchName) => {
                        const switchInfo = switchData[switchName];
                        return (
                            <div key={switchName}>
                                <h2>{switchName}</h2>
                                {switchInfo.interfaces && Object.keys(switchInfo.interfaces).length > 0 ? (
                                    Object.values(switchInfo.interfaces).map((interfaceData, index) => (
                                        <div key={index} className="interface-card">
                                            <h3>{interfaceData.name}</h3>
                                            <p>{t("Description")}: {interfaceData.description || "N/A"}</p>
                                            <p>{t("Status")}: {interfaceData.oper_status}</p>
                                            <p>{t("Speed")}: {interfaceData.speed_mbps} Mbps</p>
                                            <p>{t("IP Address")}: {interfaceData.ipv4}</p>
                                            <p>{t("Neighbor")}: {interfaceData.neighbor}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>{t("No interfaces available.")}</p>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>{t("Loading...")}</p>
                )}
            </div>
        </div>
    );
};

export default SwitchInterface;
