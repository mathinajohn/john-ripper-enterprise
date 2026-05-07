export default function Hero() {
    return (
        <div className="bg-slate-900 text-white py-24 px-8 border-b-4 border-orange-600">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-6xl md:text-7xl font-black leading-none uppercase tracking-tighter">
                        Premium Apparel.<br />
                        <span className="text-orange-600">Industrial Power.</span>
                    </h1>
                    <p className="mt-6 text-xl text-slate-400 max-w-lg mx-auto md:mx-0 font-medium">
                        Explore John Ripper Company Limited's curated collection of designer fashion and enterprise-grade machinery.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
                        <button className="bg-white text-slate-900 px-8 py-4 font-black uppercase hover:bg-orange-600 hover:text-white transition shadow-lg active:scale-95">
                            Shop Collections
                        </button>
                        <button className="border-2 border-white px-8 py-4 font-black uppercase hover:border-orange-600 hover:text-orange-600 transition active:scale-95">
                            Technical Specs
                        </button>
                    </div>
                </div>
                <div className="flex-1 w-full bg-slate-800 p-12 rounded-2xl border border-slate-700 text-center flex items-center justify-center min-h-[300px] group">
                    <span className="text-8xl font-black opacity-10 select-none group-hover:opacity-20 transition-opacity duration-500">
                        JR CO.
                    </span>
                </div>
            </div>
        </div>
    );
}