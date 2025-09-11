import { Globe, ChevronRight } from 'lucide-react';

const ProtocolSnapshot = ({
                              totalValueLocked = 150000000,
                              currency = '$',
                              unit = 'M',
                              changePercent = '+2.4%',
                              isPositive = true
                          }) => {
    return (
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 hover:border-blue-600/50 transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">
                    Protocol Snapshot
                </h3>
            </div>

            {/* Main Content */}
            <div className="text-center">
                <div className="text-gray-400 text-sm md:text-base mb-2">
                    Total Value Locked
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                    {currency}{totalValueLocked.toLocaleString()}{unit}
                </div>
                <div className={`text-sm md:text-base font-medium ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                    {changePercent} 24h
                </div>
            </div>

            {/* View All Stats Button */}
            <button className="w-full mt-6 md:mt-8 bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>View All Stats</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ProtocolSnapshot;
