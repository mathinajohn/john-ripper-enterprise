export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-8">
                            The <span className="text-orange-600">Legacy</span> of <br /> John Ripper
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            Founded on the principles of precision and security, John Ripper Company Limited began in the cybersecurity sector before expanding into a global trade powerhouse.
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Today, we operate at the intersection of craftsmanship and engineering. Whether it is a hand-stitched suit or a multi-ton industrial lathe, our commitment to "Universal Solutions" remains unchanged.
                        </p>
                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <div className="border-l-4 border-orange-600 pl-4">
                                <p className="text-3xl font-black">2026</p>
                                <p className="text-xs font-bold uppercase text-slate-400">Founded</p>
                            </div>
                            <div className="border-l-4 border-slate-900 pl-4">
                                <p className="text-3xl font-black">Global</p>
                                <p className="text-xs font-bold uppercase text-slate-400">Operations</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-inner">
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800" alt="Corporate" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-orange-600 p-8 text-white rounded-2xl hidden md:block">
                            <p className="text-sm font-black uppercase tracking-widest">Quality Assured</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION STRIP */}
            <section className="bg-slate-900 py-20 text-center text-white">
                <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-orange-600 mb-4">Our Core Mission</h3>
                <p className="text-3xl md:text-5xl font-black max-w-4xl mx-auto px-6 leading-tight uppercase">
                    Providing high-integrity logistics and products for the modern enterprise.
                </p>
            </section>
        </div>
    );
}