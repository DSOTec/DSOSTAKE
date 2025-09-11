import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router";

const StakingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useAccount(); 
  const navigate = useNavigate();

  // Redirect based on wallet connection status
  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [isConnected, navigate]);

  const navItems = ["Staking Dashboard", "Stake Positions", "Protocol Stats"];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="text-white text-xl font-bold">✧</div>
            <span className="text-white text-lg font-bold tracking-wide">
              DSOSTAKE
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-purple-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-purple-800 rounded-md"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Connect Wallet Button - Desktop */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ConnectButton />
            <button
              onClick={toggleMenu}
              className="text-white hover:text-purple-200 focus:outline-none focus:text-purple-200 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-800 border-t border-purple-600">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="text-purple-100 hover:text-white hover:bg-purple-700 block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="px-3 pt-2">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StakingNavbar;
