
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { BookOpenIcon } from '../components/icons';

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd call an API here.
        console.log(`Password reset requested for: ${email}`);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <BookOpenIcon className="h-12 w-auto text-primary-500" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Forgot your password?
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    No problem. Enter your email and we'll send you a reset link.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {submitted ? (
                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-700">
                                If an account exists for {email}, you will receive an email with instructions on how to reset your password.
                            </p>
                            <Link to="/login" className="mt-4 inline-block font-medium text-primary-600 hover:text-primary-500">
                                &larr; Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <Button type="submit" className="w-full">Send Reset Link</Button>
                            </div>
                             <div className="mt-6 text-center text-sm">
                                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                   Remembered your password? Sign in
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
