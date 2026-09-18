import { Outlet } from "react-router-dom";

import BarSidebar from "./BarSidebar";
import BarNavbar from "./BarNavbar";

import "./BarLayout.css";

function BarLayout() {
    return (
        <div className="bar-layout">

            {/* SIDEBAR */}
            <BarSidebar />

            {/* NAVBAR */}
            <BarNavbar />

            {/* MAIN CONTENT */}
            <main className="bar-main-content">
                <Outlet />
            </main>

        </div>
    );
}

export default BarLayout;