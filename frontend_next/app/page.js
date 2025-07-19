"use client";

import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 animate-gradient-shift">
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        @keyframes pulse-button {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        .animate-pulse-button {
          animation: pulse-button 2s infinite;
        }
      `}</style>

      <div className="text-center p-8 max-w-3xl z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Organize Your Life, One Task at a Time.
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Effortlessly manage your daily tasks, projects, and goals. Get started today!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signuplogin" passHref>
            <button className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-100 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 animate-pulse-button animate-fade-in-up"
                    style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              Sign In
            </button>
          </Link>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-40 h-40 bg-white opacity-10 rounded-full -top-10 -left-10 animate-float-1"></div>
        <div className="absolute w-60 h-60 bg-white opacity-10 rounded-full -bottom-20 -right-20 animate-float-2"></div>
        <div className="absolute w-30 h-30 bg-white opacity-10 rounded-full top-1/4 right-1/4 animate-float-3"></div>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -30px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
          100% { transform: translate(0, 0); }
        }
        .animate-float-1 { animation: float-1 20s infinite ease-in-out; }
        .animate-float-2 { animation: float-2 25s infinite ease-in-out; }
        .animate-float-3 { animation: float-3 18s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default LandingPage;