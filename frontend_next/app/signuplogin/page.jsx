// app/login/page.jsx
import AuthForm from "../components/LoginSignupForm";

const LoginPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-transparent overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Particles */}
        <div className="absolute animate-particle-1">
          <div className="w-5 h-5 bg-white/20 rounded-full" />
        </div>
        <div className="absolute animate-particle-2">
          <div className="w-4 h-4 bg-white/20 rounded-full" />
        </div>
        <div className="absolute animate-particle-3">
          <div className="w-3 h-3 bg-white/20 rounded-full" />
        </div>
      </div>
      
      {/* Auth form */}
      <AuthForm initialMode="login" />
    </div>
  );
};

export default LoginPage;
