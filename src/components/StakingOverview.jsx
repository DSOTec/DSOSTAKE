import React from 'react';
import { Clock, ChevronRight, Calendar } from 'lucide-react';

const StakingOverview = ({
                              totalStaked = "12,500",
                              stakingToken = "XYZ",
                              pendingRewards = "125.78",
                              rewardsToken = "XYZ",
                              nextPayoutDays = 2
                          }) => {
    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-6 lg:p-8">
            {/* Dashboard Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    Staking Dashboard
                </h1>
            </div>

            {/* Staking Overview Card */}
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 md:p-8 shadow-2xl border border-purple-700/30">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        Staking Overview
                    </h2>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-700/50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-200" />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                    {/* Total Staked */}
                    <div>
                        <div className="text-sm md:text-base text-purple-200 mb-2">
                            Total Staked
                        </div>
                        <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
                            {totalStaked} {stakingToken}
                        </div>
                    </div>

                    {/* Pending Rewards */}
                    <div className="text-right">
                        <div className="text-sm md:text-base text-purple-200 mb-2">
                            💰 Pending Rewards
                        </div>
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                            {pendingRewards} {rewardsToken}
                        </div>
                    </div>
                </div>

                {/* Next Payout Info */}
                <div className="flex items-center mb-6 md:mb-8 text-purple-200">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm md:text-base">
            Next Payout: in <span className="font-semibold text-white">{nextPayoutDays} days</span>
          </span>
                </div>

                {/* View My Positions Button */}
                <div className="flex justify-end">
                    <button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-200 flex items-center space-x-2 group hover:shadow-lg">
                        <span>View My Positions</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                </div>
            </div>

            {/* Additional Dashboard Stats (Optional Extension) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                {/* APY Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 hover:border-purple-600/50 transition-colors duration-200">
                    <div className="text-gray-400 text-sm md:text-base mb-2">
                        Current APY
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-green-400">
                        12.5%
                    </div>
                </div>

                {/* Total Earned Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 hover:border-purple-600/50 transition-colors duration-200">
                    <div className="text-gray-400 text-sm md:text-base mb-2">
                        Total Earned
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-400">
                        2,847 {rewardsToken}
                    </div>
                </div>

                {/* Staking Period Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 hover:border-purple-600/50 transition-colors duration-200">
                    <div className="text-gray-400 text-sm md:text-base mb-2">
                        Staking Period
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-400">
                        90 Days
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StakingOverview;