import Link from 'next/link';

export default function Categories() {
    const sectors = [
        {
            title: "Enterprise Fashion",
            desc: "Luxury apparel and custom branding solutions for the modern workforce.",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
            link: "/products/fashion",
            btn: "Shop Fashion"
        },
        {
            title: "Heavy Machinery",
            desc: "Precision industrial equipment and high-performance machinery.",
            image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
            link: "/products/machinery",
            btn: "View Equipment"
        }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
                        Business <span className="text-orange-600">Sectors</span>
                    </h2>
                    <div className="h-1.5 w-20 bg-orange-600 mt-4"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {sectors.map((sector, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-3xl bg-slate-900 h-[500px] shadow-2xl">
                            {/* Background Image with Hover Zoom */}
                            <img
                                src={sector.image}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                alt={sector.title}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 p-12 w-full">
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                                    {sector.title}
                                </h3>
                                <p className="text-slate-300 mb-8 max-w-md font-medium leading-relaxed">
                                    {sector.desc}
                                </p>
                                <Link
                                    href={sector.link}
                                    className="inline-block bg-orange-600 text-white px-8 py-4 font-black uppercase text-sm tracking-widest hover:bg-white hover:text-slate-900 transition-colors shadow-xl active:scale-95"
                                >
                                    {sector.btn}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}