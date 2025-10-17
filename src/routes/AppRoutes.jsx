import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

import InMateManageMent from '../pages/InMateManageMent/InMateManageMent';
import DashBoard from '../pages/DashBoard/DashBoard';
import TuckShopPos from '../pages/TuckShopPos/TuckShopPos';
import Reports from '../pages/Reports/Reports';
import MainSection from '../pages/MainSection';
import AuditTrails from '../pages/AuditTrails/AuditTrails';
import TransactionHistory from '../pages/TransactionHistory/TransactionHistory';
import BulkOperations from '../pages/BulkOperations/BulkOperations';
import Department from '../pages/Department/Department';
import InmateProfile from '../pages/InMateManageMent/InmateProfile';
import InmateTransaction from '../pages/InMateManageMent/InmateTransaction';
import Inventory from '../pages/Inventory/inventory';
import FeesManagement from '@/pages/FeesManagement/FeesManagement';
import UserManagement from '@/pages/UserManagement/UserManagement';

export default function AppRoutes() {

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route element={<MainSection />}>
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="/student-management" element={<InMateManageMent />} />
                    {/* <Route path="/fees-management" element={<FeesManagement />} /> */}
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/reports" element={<Reports />} />
                    {/* <Route path="/financial-management" element={<FinancialManagement />} /> */}
                    
                    <Route path="/transaction-history" element={<TransactionHistory />} />
                    <Route path="/audit-trails" element={<AuditTrails />} />
                    <Route path="/bulk-operations" element={<BulkOperations />} />
                    <Route path="/department" element={<Department />} />
                    <Route path="/inventory" element={<Inventory />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN", "POS"]} />}>
                <Route element={<MainSection />}>
                    <Route path="/tuck-shop-pos" element={<TuckShopPos />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                <Route element={<MainSection />}>
                    <Route path="/student-profile" element={<InmateProfile />} />
                    <Route path="/student-transaction" element={<InmateTransaction />} />
                </Route>
            </Route>

            <Route path="*" element={<div className="p-4 text-center text-red-500">404 - Page Not Found</div>} />
        </Routes>
    );
}

