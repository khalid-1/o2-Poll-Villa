
import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);

        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 max-w-lg mx-auto w-full text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="Your name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                        name="message"
                        id="message"
                        required
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                        placeholder="How can we help you?"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${status === 'success'
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-gray-900 text-white hover:bg-cyan-600 shadow-lg hover:shadow-cyan-200/50'
                            }`}
                    >
                        {status === 'loading' && <Loader2 size={20} className="animate-spin" />}
                        {status === 'success' && <CheckCircle size={20} />}
                        {status === 'idle' && <Send size={18} />}
                        {status === 'error' && <Send size={18} />}

                        <span>
                            {status === 'loading' && 'Sending...'}
                            {status === 'success' && 'Message Sent!'}
                            {status === 'idle' && 'Send Message'}
                            {status === 'error' && 'Try Again'}
                        </span>
                    </button>
                </div>

                <AnimatePresence>
                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                        >
                            <AlertCircle size={16} />
                            <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}
