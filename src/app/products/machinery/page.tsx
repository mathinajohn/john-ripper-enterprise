export default function MachineryPage() {
    const equipment = [
        {
            id: 1,
            name: "TX-900 Industrial CNC",
            power: "15kW",
            weight: "1,200kg",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"
        },
        {
            id: 2,
            name: "Hydro-Press 5000",
            power: "22kW",
            weight: "3,500kg",
            image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800"
        },
        {
            id: 3,
            name: "Precision Lathe X-1",
            power: "7.5kW",
            weight: "850kg",
            image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-slate-900 py-20 px-6 border-b-8 border-orange-600">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
                        Heavy <span className="text-orange-600">Machinery</span>
                    </h1>
                    <p className="text-slate-400 mt-6 max-w-xl font-bold uppercase tracking-widest text-sm">
                        High-Performance Industrial Solutions
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {equipment.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200">
                            <div className="md:w-1/2 h-64 md:h-auto relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            </div>
                            <div className="p-8 md:w-1/2 flex flex-col justify-between">
                                <div>
                                    <span className="text-orange-600 font-black text-xs tracking-widest uppercase">Certified Unit</span>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase mt-2">{item.name}</h3>
                                    <div className="mt-6 space-y-3">
                                        <div className="flex justify-between border-b border-slate-100 pb-2">
                                            <span className="text-slate-500 font-bold text-xs uppercase">Power Output</span>
                                            <span className="font-black text-slate-900">{item.power}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-100 pb-2">
                                            <span className="text-slate-500 font-bold text-xs uppercase">Net Weight</span>
                                            <span className="font-black text-slate-900">{item.weight}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-8 w-full bg-slate-900 text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition">
                                    Request Technical Quote
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}