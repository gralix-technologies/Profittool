import { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    IconDashboard, 
    IconUsers, 
    IconChartBar, 
    IconDatabase, 
    IconSettings,
    IconLogout,
    IconUser,
    IconEdit,
    IconLock,
    IconUserCheck,
    IconShield,
    IconFileText,
    IconClipboardList,
    IconUsersGroup,
    IconKey,
    IconServer
} from '@tabler/icons-react';
import ToastContainer from '@/Components/ToastContainer';
import { useToast } from '@/Hooks/useToast';
import LogoutForm from '@/Components/LogoutForm';

export default function AppLayout({ children, title }) {
    const pageData = usePage();
    const { auth, flash } = pageData.props;
    const currentUrl = pageData.url || window.location.pathname;
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const { toasts, removeToast, showSuccess, showError } = useToast();

    // Helper function to check if user has specific role
    const hasRole = (roleName) => {
        return auth?.user?.roles?.some(role => role.name === roleName);
    };

    // Helper function to check if user has specific permission
    const hasPermission = (permissionName) => {
        return auth?.user?.roles?.some(role => 
            role.permissions?.some(permission => permission.name === permissionName)
        );
    };

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            showSuccess(flash.success);
        }
        if (flash?.error) {
            showError(flash.error);
        }
    }, [flash, showSuccess, showError]);

    // Handle logout success/error
    const handleLogoutSuccess = () => {
        showSuccess('Logged out successfully');
        setUserDropdownOpen(false);
    };
    
    const handleLogoutError = (error) => {
        console.error('Logout error:', error);
        showError('Failed to logout. Please try again.');
        setUserDropdownOpen(false);
    };


    // Base navigation items available to all users
    const baseNavigation = [
        { name: 'Dashboard', href: '/', icon: IconDashboard, current: currentUrl === '/' },
        { name: 'Products', href: '/products', icon: IconDatabase, current: currentUrl.startsWith('/products') },
        { name: 'Customers', href: '/customers', icon: IconUsers, current: currentUrl.startsWith('/customers') },
        { name: 'Dashboards', href: '/dashboards', icon: IconChartBar, current: currentUrl.startsWith('/dashboards') },
        { name: 'Formulas', href: '/formulas', icon: IconSettings, current: currentUrl.startsWith('/formulas') },
        { name: 'Data Ingestion', href: '/data-ingestion', icon: IconDatabase, current: currentUrl.startsWith('/data-ingestion') },
    ];

    // Admin-only navigation items
    const adminNavigation = [
        { name: 'User Management', href: '/admin/users', icon: IconUsersGroup, current: currentUrl.startsWith('/admin/users') },
        { name: 'Audit Trail', href: '/admin/audit-trail', icon: IconClipboardList, current: currentUrl.startsWith('/admin/audit-trail') },
        { name: 'Role Management', href: '/admin/roles', icon: IconShield, current: currentUrl.startsWith('/admin/roles') },
        { name: 'System Settings', href: '/admin/settings', icon: IconServer, current: currentUrl.startsWith('/admin/settings') },
        { name: 'System Logs', href: '/admin/logs', icon: IconFileText, current: currentUrl.startsWith('/admin/logs') },
    ];

    // Combine navigation based on user role
    const navigation = [
        ...baseNavigation,
        // Only show admin navigation if user has Admin role or specific admin permissions
        ...(hasRole('Admin') || hasPermission('manage-users') || hasPermission('view-audit-trail') ? adminNavigation : [])
    ];

    return (
        <>
            <Head title={title} />
            
            <div className="page" style={{backgroundColor: '#000000', margin: 0, padding: 0}}>
                {/* Authentic Tabler Header Navigation */}
                <header className="navbar navbar-expand-md navbar-light d-print-none w-100" data-bs-theme="dark" style={{backgroundColor: '#1f2937', width: '100vw', margin: 0, padding: 0}}>
                    <div className="container-fluid">
                        
                        {/* Mobile toggle */}
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        
                        {/* Main Navigation */}
                        <div className="collapse navbar-collapse" id="navbar-menu">
                            <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
                                <ul className="navbar-nav">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={item.name} className="nav-item">
                                                <Link
                                                    href={item.href}
                                                    className={`nav-link ${item.current ? 'active' : ''}`}
                                                >
                                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                        <Icon size={24} />
                                                    </span>
                                                    <span className="nav-link-title">
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        
                        {/* Right side navigation */}
                        <div className="navbar-nav flex-row order-md-last">
                            
                            {/* User menu */}
                            <div className="nav-item dropdown position-relative">
                                <button 
                                    className="nav-link d-flex lh-1 text-reset p-2 btn btn-link" 
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    style={{minWidth: 'fit-content'}}
                                >
                                    <span className="avatar avatar-sm bg-primary text-white">
                                        {(auth?.user?.name?.charAt(0)) || 'U'}
                                    </span>
                                    <div className="d-none d-lg-block ps-2" style={{whiteSpace: 'nowrap'}}>
                                        <div className="text-white">{auth?.user?.name || 'User'}</div>
                                        <div className="mt-1 small text-muted">{auth?.user?.email || 'user@example.com'}</div>
                                    </div>
                                </button>
                                {userDropdownOpen && (
                                    <>
                                        <div 
                                            className="position-fixed top-0 start-0 w-100 h-100" 
                                            style={{zIndex: 1040}}
                                            onClick={() => setUserDropdownOpen(false)}
                                        ></div>
                                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow show position-absolute" style={{zIndex: 1050, right: 0, top: '100%'}}>
                                            <div className="dropdown-header">
                                                <strong>{auth?.user?.name || 'User'}</strong>
                                                <div className="text-muted small">{auth?.user?.email || 'user@example.com'}</div>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            <Link href="/profile" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                                                <IconUser size={16} className="me-2" />
                                                View Profile
                                            </Link>
                                            <Link href="/profile/edit" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                                                <IconEdit size={16} className="me-2" />
                                                Edit Profile
                                            </Link>
                                            <Link href="/profile/edit#password" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                                                <IconLock size={16} className="me-2" />
                                                Change Password
                                            </Link>
                                            <div className="dropdown-divider"></div>
                                            <LogoutForm 
                                                onSuccess={handleLogoutSuccess}
                                                onError={handleLogoutError}
                                                className="d-block"
                                            >
                                                <button type="submit" className="dropdown-item text-danger w-100 text-start">
                                                    <IconLogout size={16} className="me-2" />
                                                    Logout
                                                </button>
                                            </LogoutForm>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content - Full width without wrapper */}
                <main className="main-content">
                    {/* Flash messages */}
                    {flash?.message && (
                        <div className="container-fluid px-4 pt-3">
                            <div className="alert alert-success alert-dismissible" role="alert">
                                <div className="d-flex">
                                    <div>
                                        {flash.message}
                                    </div>
                                </div>
                                <a className="btn-close" data-bs-dismiss="alert"></a>
                            </div>
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="container-fluid px-4 pt-3">
                            <div className="alert alert-danger alert-dismissible" role="alert">
                                <div className="d-flex">
                                    <div>
                                        {flash.error}
                                    </div>
                                </div>
                                <a className="btn-close" data-bs-dismiss="alert"></a>
                            </div>
                        </div>
                    )}

                    {children}
                </main>
            </div>
            
            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </>
    );
}