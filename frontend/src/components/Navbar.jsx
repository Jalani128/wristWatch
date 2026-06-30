import React, { useEffect, useState } from 'react'
import { navbarStyles } from "../assets/dummyStyles";
import { Clock, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BaggageClaim } from 'lucide-react';
import { useCart } from '../CartContext';
import { Menu, X } from 'lucide-react';


const navItems = [
    { name: "Home", href: "/" },
    { name: "Watches", href: "/watches" },
    { name: "Contact", href: "/contact" },
    { name: "My Orders", href: "/my-orders" },
    
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState(location.pathname || "/");

    const { totalItems, clearCart, reloadCart } = useCart();
    const [loggedIn, setLoggedIn] = useState(() => {
        try {
            return (
                localStorage.getItem("isLoggedIn") === "true" ||
                !!localStorage.getItem("authToken")
            );
        } catch (error) {
            return false;
        }
    });

    useEffect(() => {
        setActive(location.pathname || "/");
    }, [location]);

    // to keep the user login for all the pages until they log out
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "isLoggedIn" || e.key === "authToken") {
                try {
                    const isNowLoggedIn =
                        localStorage.getItem("isLoggedIn") === "true" ||
                        !!localStorage.getItem("authToken");
                    setLoggedIn(isNowLoggedIn);
                } catch {
                    setLoggedIn(false);
                }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const handleNavClick = (href) => {
        setActive(href);
        setOpen(false);
    }
    useEffect(() =>{
        try {
            reloadCart();
        } catch (e) {
            
        }
    },[loggedIn]);

    // to log out the user
    const handleLogOut = () => {
        try {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            localStorage.removeItem("cart");
            localStorage.removeItem("cartItems");

        } catch (error) {}

        try {
           clearCart && clearCart();
        } catch (err) {
            
        }
            setLoggedIn(false);
            setOpen(false);
            navigate("/");
    }

    return (
        <header className={navbarStyles.header}>
            <nav className={navbarStyles.nav}>
                <div className={navbarStyles.container}>
                    {/* BRAND LOGO */}
                    <div className={navbarStyles.brandContainer}>
                        <div className={navbarStyles.logoContainer}>
                            <Clock className={navbarStyles.logoIcon} />
                        </div>
                        <Link
                            to="/"
                            onClick={() => handleNavClick("/")}
                            className={navbarStyles.logoLink}>
                            <span style={navbarStyles.logoTextStyle}
                                className={navbarStyles.logoText}>
                                ChoronoElite
                            </span>
                        </Link>
                    </div>
                    {/* Destop Navigation */}
                    <div className={navbarStyles.desktopNav}>
                        {navItems.map((item) => {
                            const isActive = active === item.href;
                            return (
                                <Link
                                    key={item.name} to={item.href}
                                    onClick={() => handleNavClick(item.href)}
                                    className={`${navbarStyles.navItemBase} ${isActive
                                        ? navbarStyles.navItemActive
                                        : navbarStyles.navItemInactive
                                        }`}
                                >
                                    <span>{item.name}</span>
                                    <span
                                        className={`${navbarStyles.activeIndicator} ${isActive
                                            ? navbarStyles.activeIndicatorVisible
                                            : navbarStyles.activeIndicatorHidden
                                            }`}
                                    >
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                    {/* Right Side  */}
                    <div className={navbarStyles.rightActions}>
                        <Link to="/cart" className={navbarStyles.cartLink}>
                            <BaggageClaim className={navbarStyles.cartIcon} />
                            {totalItems > 0 && (
                                <span className={navbarStyles.cartBadge}>
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        {!loggedIn ? (
                            <Link to="/login" className={navbarStyles.accountLink}>
                                <User className={navbarStyles.accountIcon} />
                                <span className={navbarStyles.accountText}>
                                    Account
                                </span>
                            </Link>
                        ) : (
                            <button onClick={handleLogOut} className={navbarStyles.accountLink}>
                                <User className={navbarStyles.accountIcon} />
                                <span className={navbarStyles.accountText}>
                                    Logout
                                </span>
                            </button>
                        )}

                        {/* mobile menu toggle */}
                        <div className={navbarStyles.mobileMenuButton}>
                            <button
                                onClick={() => setOpen(!open)}
                                className={navbarStyles.mobileMenuButton}
                            >
                                {open ? (
                                    <X className={navbarStyles.menuIcon} />
                                ) : (
                                    <Menu className={navbarStyles.menuIcon} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* mobile menu navigation */}
                {open && (
                    <div className={navbarStyles.mobileMenu}>
                        <div className={navbarStyles.mobileMenuContainer}>
                            {navItems.map((item) => {
                                const isActive = active === item.href;
                                return (
                                    <Link
                                        key={item.name} to={item.href}
                                        onClick={() => handleNavClick(item.href)}
                                        className={`${navbarStyles.mobileNavItemBase} ${isActive
                                            ? navbarStyles.mobileNavItemActive
                                            : navbarStyles.mobileNavItemInactive
                                            }`}>
                                        <span className={navbarStyles.mobileNavItemText}>{item.name}</span>
                                    </Link>
                                )
                            })}

                            <div className={navbarStyles.mobileAccountContainer}>
                                {!loggedIn ? (
                                    <Link to="/login" onClick={() => {
                                        setOpen(false)
                                        handleNavClick('/login')
                                    }} className={navbarStyles.mobileAccountLink}>
                                        <User className={navbarStyles.mobileAccountIcon} />
                                        <span>Account</span>
                                    </Link>
                                ) : (
                                    <button onClick={handleLogOut}
                                        className={navbarStyles.mobileAccountButton}>
                                        <User className={navbarStyles.mobileAccountIcon} />
                                        <span>Logout</span>
                                    </button>
                                )}
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Navbar