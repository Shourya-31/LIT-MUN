import React, { useState } from 'react';
import { Mail, ArrowRight, Send } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.message.trim().length < 20) {
            return;
        }
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setFormData((prev) => ({ ...prev, fullName: lettersOnly }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData((prev) => ({ ...prev, phone: digitsOnly }));
    };

    return (
        <section id="contact" className="relative w-full bg-[#0B1F3A] py-20 px-6 md:px-12 lg:px-20 overflow-hidden">

            <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none opacity-20">
                <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
                    <path d="M-50,300 C100,280 150,380 350,320" stroke="#D4AF69" strokeWidth="1.5" />
                    <path d="M-50,330 C120,310 180,410 380,350" stroke="#D4AF69" strokeWidth="1.2" />
                    <path d="M-50,360 C140,340 210,440 400,380" stroke="#D4AF69" strokeWidth="1" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">

                <div className="lg:col-span-5 flex flex-col justify-between pt-4">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold">
                                Get In Touch
                            </span>
                            <span className="w-12 h-[1px] bg-gold/50" />
                        </div>

                        <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-ivory leading-[1.15] mb-6">
                            Have a Question?<br />
                            We&apos;re Here to <span className="text-gold italic font-normal">Help.</span>
                        </h2>

                        <p className="text-ivory/70 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                            For registrations, committee queries, or general inquiries, reach out to us. We&apos;d love to hear from you.
                        </p>

                        <div className="flex flex-col gap-4 max-w-md">

                            <a
                                href="mailto:litfest@nitrr.ac.in"
                                className="group flex items-center justify-between p-5 rounded-xl border border-gold/25 bg-[#0e2444]/60 hover:bg-[#0e2444] hover:border-gold/60 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
                                        <Mail size={22} />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-semibold tracking-wider text-ivory/50 uppercase">
                                            Email Us
                                        </div>
                                        <div className="text-sm md:text-base font-medium text-ivory group-hover:text-gold transition-colors">
                                            litfest@nitrr.ac.in
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-ivory/40 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                            </a>

                            <a
                                href="https://instagram.com/literary.nitrr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-5 rounded-xl border border-gold/25 bg-[#0e2444]/60 hover:bg-[#0e2444] hover:border-gold/60 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
                                        <FaInstagram size={22} />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-semibold tracking-wider text-ivory/50 uppercase">
                                            Follow Us On Instagram
                                        </div>
                                        <div className="text-sm md:text-base font-medium text-ivory group-hover:text-gold transition-colors">
                                            @literati_nitrr
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-ivory/40 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                            </a>

                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 bg-[#F5F0E7] text-[#0B1F3A] rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative">

                    {submitted && (
                        <div className="mb-6 p-4 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 text-sm font-medium">
                            Thank you! Your message has been sent successfully. We will get back to you soon.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0B1F3A]/80 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your full name"
                                    value={formData.fullName}
                                    onChange={handleNameChange}
                                    pattern="[a-zA-Z\s]+"
                                    title="Name should only contain letters and spaces"
                                    className="w-full px-4 py-3 bg-white/70 border border-[#0B1F3A]/20 rounded-lg text-sm text-[#0B1F3A] placeholder-[#0B1F3A]/40 focus:outline-none focus:border-gold focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0B1F3A]/80 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                                    title="Please enter a valid email address (e.g. you@example.com)"
                                    className="w-full px-4 py-3 bg-white/70 border border-[#0B1F3A]/20 rounded-lg text-sm text-[#0B1F3A] placeholder-[#0B1F3A]/40 focus:outline-none focus:border-gold focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0B1F3A]/80 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit mobile number"
                                    className="w-full px-4 py-3 bg-white/70 border border-[#0B1F3A]/20 rounded-lg text-sm text-[#0B1F3A] placeholder-[#0B1F3A]/40 focus:outline-none focus:border-gold focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0B1F3A]/80 mb-2">
                                    Subject *
                                </label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/70 border border-[#0B1F3A]/20 rounded-lg text-sm text-[#0B1F3A] focus:outline-none focus:border-gold focus:bg-white transition-colors"
                                >
                                    <option value="" disabled>Select a subject</option>
                                    <option value="registration">Delegate Registration</option>
                                    <option value="committee">Committee & Agendas</option>
                                    <option value="itinerary">Event Itinerary</option>
                                    <option value="sponsorship">Sponsorship & Collaborations</option>
                                    <option value="other">Other Inquiries</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0B1F3A]/80">
                                    Message *
                                </label>
                                <span className={`text-[10px] font-semibold tracking-wide ${formData.message.trim().length < 20 ? 'text-amber-700' : 'text-emerald-700'
                                    }`}>
                                    {formData.message.trim().length < 20
                                        ? `${formData.message.trim().length} / 20 characters min`
                                        : `${formData.message.trim().length} characters`
                                    }
                                </span>
                            </div>
                            <textarea
                                required
                                rows={4}
                                minLength={20}
                                placeholder="Please describe your query in detail (minimum 20 characters)..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 bg-white/70 border border-[#0B1F3A]/20 rounded-lg text-sm text-[#0B1F3A] placeholder-[#0B1F3A]/40 focus:outline-none focus:border-gold focus:bg-white transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-6 rounded-lg bg-[#C69C55] hover:bg-[#B58B44] text-[#0B1F3A] font-bold text-xs md:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
                        >
                            <span>Send Message</span>
                            <Send size={15} />
                        </button>
                    </form>

                </div>

            </div>
        </section>
    );
};

export default Contact;
