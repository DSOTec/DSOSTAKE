import React from 'react';
import { Clock, Globe, AlertTriangle, ChevronRight } from 'lucide-react';

// Component 1: Recent Stakes
const RecentStakes = ({
                          stakes = [
                              { amount: 5000, token: 'XYZ', rewards: 5.23, rewardToken: 'XYZ', daysLeft: 2 },
                              { amount: 2500, token: 'XYZ', rewards: 1.87, rewardToken: 'XYZ', daysLeft: 5 },
                              { amount: 7500, token: 'XYZ', rewards: 8.91, rewardToken: 'XYZ', daysLeft: 30 }
                          ]
                      }) => {
    const getProgressColor = (daysLeft) => {
        if (daysLeft <= 2) return 'bg-red-500';
        if (daysLeft <= 7) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getProgressWidth = (daysLeft) => {
        const maxDays = 30;
        return Math.min((daysLeft / maxDays) * 100, 100);
    };

    return (
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 hover:border-purple-600/50 transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">
                    My Recent Stakes
                </h3>
            </div>

            {/* Stakes List */}
            <div className="space-y-4">
                {stakes.map((stake, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-3 md:p-4">
                        {/* Stake Amount */}
                        <div className="flex items-center justify-between mb-2">
              <span className="text-lg md:text-xl font-bold text-white">
                {stake.amount.toLocaleString()} {stake.token}
              </span>
                            <span className="text-sm text-gray-400">
                {stake.daysLeft} days
              </span>
                        </div>

                        {/* Rewards */}
                        <div className="text-sm text-gray-400 mb-3">
                            Rewards: {stake.rewards} {stake.rewardToken}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className={`${getProgressColor(stake.daysLeft)} h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${getProgressWidth(stake.daysLeft)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Link */}
            <button className="w-full mt-4 md:mt-6 text-purple-400 hover:text-purple-300 text-sm md:text-base transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>View All Positions</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default RecentStakes;
