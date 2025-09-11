import React from 'react';

const StakingHeroSection = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
                {/* Logo */}
                <div className="mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <div className="text-purple-400 text-4xl md:text-5xl">✧</div>
                        <h1 className="text-purple-400 text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide">
                            DSOSTAKE
                        </h1>
                    </div>
                </div>

                {/* Main Heading */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4">
                        Unlock the   Future of Decentralized Finance
                    </h2>                                       
                </div>

                {/* Description */}
                <div className="mb-8 md:mb-12">
                    <p className="text-gray-300 text-base md:text-lg= lg:text-xl leading-relaxed max-w-2xl mx-auto px-4">
                        Connect your Web3 wallet to manage your staking positions, earn rewards, and explore
                        protocol statistics on a secure and intuitive platform.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Top decorative elements */}
                    <div className="absolute top-20 left-10 text-purple-500 opacity-20 text-2xl md:text-4xl animate-pulse">
                        ✧
                    </div>
                    <div className="absolute top-32 right-16 text-purple-400 opacity-15 text-xl md:text-3xl animate-pulse delay-1000">
                        ✦
                    </div>
                    {/* Middle decorative elements */}
                    <div className="absolute top-1/2 left-8 text-purple-600 opacity-10 text-3xl md:text-5xl animate-pulse delay-500">
                        ✧
                    </div>
                    <div className="absolute top-1/2 right-12 text-purple-500 opacity-20 text-2xl md:text-4xl animate-pulse delay-2000">
                        ✦
                    </div>

                    {/* Bottom decorative elements */}
                    <div className="absolute bottom-32 left-16 text-purple-400 opacity-15 text-xl md:text-3xl animate-pulse delay-1500">
                        ✧
                    </div>
                    <div className="absolute bottom-20 right-8 text-purple-600 opacity-10 text-2xl md:text-4xl animate-pulse delay-700">
                        ✦
                    </div>
                </div>

                {/* Background Glow Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-800 opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 bg-purple-700 opacity-5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default StakingHeroSection;