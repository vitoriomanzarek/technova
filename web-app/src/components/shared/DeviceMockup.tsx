import { motion } from 'framer-motion';

const DeviceMockup = ({ color = "blue" }: { color?: string }) => {
    // Map colors to tailwind classes roughly
    const getColorClass = (type: 'bg' | 'border' | 'text') => {
        const colors: any = {
            blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500', from: 'from-blue-600', to: 'to-cyan-500' },
            emerald: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500', from: 'from-emerald-600', to: 'to-green-500' },
            violet: { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-500', from: 'from-violet-600', to: 'to-amber-500' },
            indigo: { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-500', from: 'from-indigo-600', to: 'to-sky-500' },
            orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', from: 'from-orange-600', to: 'to-red-500' },
            fuchsia: { bg: 'bg-fuchsia-500', border: 'border-fuchsia-500', text: 'text-fuchsia-500', from: 'from-fuchsia-600', to: 'to-pink-500' },
            cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-500', from: 'from-cyan-600', to: 'to-teal-500' },
            rose: { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-500', from: 'from-rose-600', to: 'to-red-500' },
            purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500', from: 'from-purple-600', to: 'to-fuchsia-500' },
        };
        return colors[color]?.[type] || colors['blue'][type];
    };

    const theme = {
        from: getColorClass('from').replace('from-', ''),
        to: getColorClass('to').replace('to-', ''),
        base: color
    };

    return (
        <div className="relative mx-auto max-w-4xl h-[400px] md:h-[500px] flex items-end justify-center perspective-1000">
            {/* Laptop Frame */}
            <motion.div
                initial={{ rotateX: 10, y: 50, opacity: 0 }}
                whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-[80%] md:w-[70%] bg-gray-900 rounded-t-2xl border-4 border-gray-800 shadow-2xl"
            >
                {/* Screen Content */}
                <div className="bg-[#0B0F19] aspect-video rounded-t-lg overflow-hidden relative p-4 border-b border-gray-700">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full"></div>
                    {/* Mockup UI */}
                    <div className="mt-4 space-y-3 opacity-80">
                        <div className={`h-2 w-1/3 bg-${theme.base}-500/30 rounded`}></div>
                        <div className={`h-8 w-2/3 bg-gradient-to-r from-${theme.from} to-${theme.to} rounded-lg`}></div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className={`h-20 bg-${theme.base}-900/20 rounded border border-${theme.base}-500/10`}></div>
                            <div className={`h-20 bg-${theme.base}-900/20 rounded border border-${theme.base}-500/10`}></div>
                        </div>
                    </div>
                </div>
                {/* Laptop Base */}
                <div className="h-4 bg-gray-800 rounded-b-xl shadow-lg relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gray-700 rounded-b-md"></div>
                </div>
            </motion.div>

            {/* Phone Frame */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 20, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute bottom-0 -right-4 md:right-10 z-20 w-[25%] md:w-[20%] bg-black rounded-[2rem] border-4 border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-black rounded-b-xl z-30"></div>
                <div className="bg-[#0B0F19] aspect-[9/19] p-2 pt-6">
                    {/* Phone UI */}
                    <div className="space-y-2 opacity-90">
                        <div className={`h-10 w-full bg-gradient-to-r from-${theme.from} to-${theme.to} rounded-lg mb-4`}></div>
                        <div className="h-1 w-3/4 bg-gray-700 rounded"></div>
                        <div className="h-1 w-full bg-gray-700 rounded"></div>
                        <div className="h-1 w-5/6 bg-gray-700 rounded"></div>
                        <div className={`mt-4 h-16 w-full bg-${theme.base}-900/20 rounded border border-${theme.base}-500/10`}></div>
                    </div>
                </div>
            </motion.div>

            {/* Glow effect back */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-${theme.base}-500/20 blur-[100px] -z-10`}></div>
        </div>
    );
};

export default DeviceMockup;
