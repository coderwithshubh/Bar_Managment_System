import { Routes, Route, Navigate } from "react-router-dom";


// =====================================================
// AUTH PAGES
// =====================================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";


// =====================================================
// BAR LAYOUT
// =====================================================

import BarLayout from "../components/bar/BarLayout";


// =====================================================
// BAR OVERVIEW
// =====================================================

import BarOverview from "../pages/bar/overview/BarOverview";


// =====================================================
// BAR PROFILE
// =====================================================

import BarProfile from "../pages/bar/profile/BarProfile";
import ChangePassword from "../pages/bar/profile/ChangePassword";


// =====================================================
// ACCOUNT SETTINGS
// =====================================================

import AccountSettings from "../pages/bar/profile/AccountSettings";


// =====================================================
// BAR NOTIFICATIONS
// =====================================================

import BarNotifications
    from "../pages/bar/notifications/BarNotifications";


// =====================================================
// BAR CATEGORY PAGES
// =====================================================

import BarCategories from "../pages/bar/categories/BarCategories";
import AddBarCategory from "../pages/bar/categories/AddBarCategory";
import ViewBarCategory from "../pages/bar/categories/ViewBarCategory";
import EditBarCategory from "../pages/bar/categories/EditBarCategory";


// =====================================================
// BAR MENU PAGES
// =====================================================

import BarMenu from "../pages/bar/menu/BarMenu";
import AddBarMenu from "../pages/bar/menu/AddBarMenu";
import ViewBarMenu from "../pages/bar/menu/ViewBarMenu";
import EditBarMenu from "../pages/bar/menu/EditBarMenu";


// =====================================================
// BAR INVENTORY
// =====================================================

import Inventory from "../pages/bar/inventory/Inventory";


// =====================================================
// BAR TABLES
// =====================================================

import BarTable from "../pages/bar/tables/BarTable";


// =====================================================
// BAR ORDERS
// =====================================================

import BarOrders from "../pages/bar/orders/BarOrders";


// =====================================================
// BAR BILLS
// =====================================================

import BarBills from "../pages/bar/bills/BarBills";
import PrintBarBill from "../pages/bar/bills/PrintBarBill";


// =====================================================
// BAR REPORTS
// =====================================================

import BarReports from "../pages/bar/reports/BarReports";
import BarSalesReport from "../pages/bar/reports/BarSalesReport";


// =====================================================
// APP ROUTES
// =====================================================

function AppRoutes() {

    return (

        <Routes>

            {/* =================================================
                LOGIN
            ================================================= */}

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =================================================
                REGISTER
            ================================================= */}

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =================================================
                FORGOT PASSWORD
            ================================================= */}

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />


            {/* =================================================
                RESET PASSWORD
            ================================================= */}

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />


            {/* =================================================
                BAR MODULE
            ================================================= */}

            <Route
                path="/bar"
                element={<BarLayout />}
            >

                {/* =================================================
                    BAR OVERVIEW
                ================================================= */}

                <Route
                    index
                    element={<BarOverview />}
                />


                {/* =================================================
                    MY PROFILE
                ================================================= */}

                <Route
                    path="profile"
                    element={<BarProfile />}
                />


                {/* =================================================
                    CHANGE PASSWORD
                ================================================= */}

                <Route
                    path="change-password"
                    element={<ChangePassword />}
                />


                {/* =================================================
                    ACCOUNT SETTINGS
                ================================================= */}

                <Route
                    path="account-settings"
                    element={<AccountSettings />}
                />


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <Route
                    path="notifications"
                    element={<BarNotifications />}
                />


                {/* =================================================
                    BAR CATEGORIES
                ================================================= */}

                <Route
                    path="categories"
                    element={<BarCategories />}
                />


                {/* =================================================
                    ADD BAR CATEGORY
                ================================================= */}

                <Route
                    path="categories/add"
                    element={<AddBarCategory />}
                />


                {/* =================================================
                    VIEW BAR CATEGORY
                ================================================= */}

                <Route
                    path="categories/view/:id"
                    element={<ViewBarCategory />}
                />


                {/* =================================================
                    EDIT BAR CATEGORY
                ================================================= */}

                <Route
                    path="categories/edit/:id"
                    element={<EditBarCategory />}
                />


                {/* =================================================
                    BAR MENU / DRINKS
                ================================================= */}

                <Route
                    path="menu"
                    element={<BarMenu />}
                />


                {/* =================================================
                    ADD BAR MENU ITEM
                ================================================= */}

                <Route
                    path="menu/add"
                    element={<AddBarMenu />}
                />


                {/* =================================================
                    VIEW BAR MENU ITEM
                ================================================= */}

                <Route
                    path="menu/view/:id"
                    element={<ViewBarMenu />}
                />


                {/* =================================================
                    EDIT BAR MENU ITEM
                ================================================= */}

                <Route
                    path="menu/edit/:id"
                    element={<EditBarMenu />}
                />


                {/* =================================================
                    BAR INVENTORY
                ================================================= */}

                <Route
                    path="inventory"
                    element={<Inventory />}
                />


                {/* =================================================
                    BAR TABLES
                ================================================= */}

                <Route
                    path="tables"
                    element={<BarTable />}
                />


                {/* =================================================
                    BAR ORDERS
                ================================================= */}

                <Route
                    path="orders"
                    element={<BarOrders />}
                />


                {/* =================================================
                    BAR BILLS
                ================================================= */}

                <Route
                    path="bills"
                    element={<BarBills />}
                />


                {/* =================================================
                    PRINT / PREVIEW BILL
                ================================================= */}

                <Route
                    path="bills/print/:id"
                    element={<PrintBarBill />}
                />


                {/* =================================================
                    BAR SUMMARY REPORT
                ================================================= */}

                <Route
                    path="reports"
                    element={<BarReports />}
                />


                {/* =================================================
                    BAR SALES REPORT
                ================================================= */}

                <Route
                    path="reports/sales"
                    element={<BarSalesReport />}
                />

            </Route>


            {/* =================================================
                UNKNOWN ROUTE
            ================================================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}


export default AppRoutes;