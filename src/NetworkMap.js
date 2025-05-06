import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./NetworkMap.css";

const NetworkMap = () => {
    const [switches, setSwitches] = useState([]);
    const [links, setLinks] = useState([]);
    const [hoveredSwitch, setHoveredSwitch] = useState(null);
    const [dragging, setDragging] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    const formatBytes = (bytes) => {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 B';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    };

    const fetchNetworkData = () => {
        fetch("http://localhost:3000/switch-info")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Data: ", data);
                const switchesArray = Object.entries(data).map(([name, details], index) => ({
                    id: name,
                    name,
                    system_info: details.system_info,
                    interfaces: Object.entries(details.interfaces || {}).map(([ifName, ifDetails]) => ({
                        name: ifName,
                        ...ifDetails
                    })),
                    position: { 
                        x: 150 + index * 400, 
                        y: 200 + (index % 2) * 200 
                    },
                    width: 120,
                    height: 60,
                }));

                console.log("Processed Switches Array: ", switchesArray);

            
                const linksArray = [];
                switchesArray.forEach(sourceSwitch => {
                    sourceSwitch.interfaces.forEach(intf => {
                        if (intf.neighbor) {
                            const [targetSwitchName] = intf.neighbor.split(":");
                            const targetSwitch = switchesArray.find(sw => sw.name === targetSwitchName);
                            if (targetSwitch) {
                                linksArray.push({
                                    source: sourceSwitch,
                                    target: targetSwitch,
                                    interface: intf
                                });
                            }
                        }
                    });
                });

                setSwitches(switchesArray);
                setLinks(linksArray);
            })
            .catch((err) => console.error("Fetch error:", err));
    };

    useEffect(() => {
        fetchNetworkData();
        const interval = setInterval(fetchNetworkData, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const linksArray = [];
        switches.forEach(sourceSwitch => {
            sourceSwitch.interfaces.forEach(intf => {
                if (intf.neighbor) {
                    const [targetSwitchName] = intf.neighbor.split(":");
                    const targetSwitch = switches.find(sw => sw.name === targetSwitchName);
                    if (targetSwitch) {
                        linksArray.push({
                            source: sourceSwitch,
                            target: targetSwitch,
                            interface: intf
                        });
                    }
                }
            });
        });
        setLinks(linksArray);
    }, [switches]);
    

    const handleMouseDown = (e, sw) => {
        e.preventDefault();
        setDragging({ id: sw.id, offsetX: e.clientX - sw.position.x, offsetY: e.clientY - sw.position.y });
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            setSwitches(prev =>
                prev.map(sw =>
                    sw.id === dragging.id
                        ? { ...sw, position: { x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY } }
                        : sw
                )
            );
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    const handleSwitchHover = (e, sw) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.right + 20;
        const y = Math.min(rect.top, window.innerHeight - 350);
        setPopupPosition({ x, y });
        setHoveredSwitch(sw);
    };

    const handlePopupMouseEnter = () => {
        if (hoveredSwitch) {
            setHoveredSwitch({ ...hoveredSwitch, keepOpen: true });
        }
    };

    const handlePopupMouseLeave = () => {
        if (hoveredSwitch) {
            setHoveredSwitch(null);
        }
    };

    if (!switches.length) return <div>Loading...</div>;

    return (
        <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <Navbar title="Network Map" />
            <svg width="100%" height="800" viewBox="0 0 2000 1000">
                {links.map((link, idx) => (
                    <line
                        key={idx}
                        className="network-link"
                        x1={link.source.position.x + link.source.width / 2}
                        y1={link.source.position.y + link.source.height / 2}
                        x2={link.target.position.x + link.target.width / 2}
                        y2={link.target.position.y + link.target.height / 2}
                        stroke="black" 
                        strokeWidth="2"
                    />
                ))}
                
                {switches.map((sw) => (
                    <g
                        key={sw.id}
                        transform={`translate(${sw.position.x}, ${sw.position.y})`}
                        onMouseEnter={(e) => handleSwitchHover(e, sw)}
                        onMouseLeave={() => {
                            if (!hoveredSwitch?.keepOpen) {
                                setTimeout(() => {
                                    setHoveredSwitch(prev => prev?.keepOpen ? prev : null);
                                }, 300);
                            }
                        }}
                        onMouseDown={(e) => handleMouseDown(e, sw)}
                        style={{ cursor: "move" }}
                    >
                        <rect
                            width={sw.width}
                            height={sw.height}
                            fill="#007bff"
                            stroke="#000"
                            rx="5"
                        />
                        <text
                            x={sw.width / 2}
                            y={sw.height / 2 + 4}
                            fill="white"
                            fontSize="14"
                            textAnchor="middle"
                        >
                            {sw.name}
                        </text>
                    </g>
                ))}
            </svg>

            {hoveredSwitch && (
                <div
                    className="switch-popup"
                    style={{
                        left: `${popupPosition.x}px`,
                        top: `${popupPosition.y}px`
                    }}
                    onMouseEnter={handlePopupMouseEnter}
                    onMouseLeave={handlePopupMouseLeave}
                >
                    <div className="system-info">
                        <h3 className="text-lg font-bold mb-2">{hoveredSwitch.name} System Info</h3>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div>OS Version: {hoveredSwitch.system_info.os_version}</div>
                            <div>Model: {hoveredSwitch.system_info.model}</div>
                            <div>Uptime: {hoveredSwitch.system_info.uptime}</div>
                        </div>
                    </div>

                    <strong>Interfaces:</strong>
                    {hoveredSwitch.interfaces.length > 0 ? (
                        <ul>
                            {hoveredSwitch.interfaces.map((intf, idx) => (
                                <li key={idx}>
                                    <div className="interface-detail">
                                        <strong>Name:</strong> {intf.name}
                                    </div>
                                    <div className="interface-detail">
                                        <strong>Description:</strong> {intf.description || "N/A"}
                                    </div>
                                    <div className="interface-detail">
                                        <strong>Status:</strong> 
                                        <span className={intf.oper_status === "up" ? "status-up" : "status-down"}>
                                            {intf.oper_status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="interface-detail">
                                        <strong>Speed:</strong> {intf.speed_mbps}Mbps
                                    </div>
                                    <div className="interface-detail">
                                        <strong>Duplex:</strong> {intf.duplex}
                                    </div>
                                    <div className="interface-detail">
                                        <strong>IP:</strong> {intf.ipv4}
                                    </div>
                                    <div className="interface-detail">
                                        <strong>Neighbor:</strong> {intf.neighbor || "N/A"}
                                    </div>
                                    <div className="interface-detail">
                                        <strong>Traffic:</strong>
                                        <div className="ml-4">
                                            <div>In: {formatBytes(intf.counters.in_bytes)} (Errors: {intf.counters.in_errors})</div>
                                            <div>Out: {formatBytes(intf.counters.out_bytes)} (Errors: {intf.counters.out_errors})</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No interfaces available</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NetworkMap;
