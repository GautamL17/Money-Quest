import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DollarSign, Target, Home, Utensils, Zap, Briefcase, FileText, X } from 'lucide-react';
import FeatureSlider from './FeatureSlider';
import { Link, NavLink } from 'react-router-dom';
import Login from '../pages/Auth/Login'
// import targetsign from './public/targetsign.svg'
const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock data for the chart
  const chartData = [
    { month: 'Jan', income: 3600, expenses: 980, savings: 2300 },
    { month: 'Feb', income: 3650, expenses: 1050, savings: 2350 },
    { month: 'Mar', income: 3500, expenses: 1100, savings: 2200 },
    { month: 'Apr', income: 3700, expenses: 1000, savings: 2400 },
    { month: 'May', income: 3550, expenses: 980, savings: 2300 },
    { month: 'Jun', income: 3900, expenses: 1200, savings: 2450 }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // const LoginModal = () => (
  //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  //     <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
  //       <div className="flex justify-between items-center mb-6">
  //         <h2 className="text-2xl font-bold text-gray-900">Login to Money Quest</h2>
  //         <button
  //           onClick={() => setShowLoginModal(false)}
  //           className="text-gray-500 hover:text-gray-700"
  //         >
  //           <X size={24} />
  //         </button>
  //       </div>
  //       <div className="space-y-4">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
  //           <input
  //             type="email"
  //             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
  //             placeholder="Enter your email"
  //           />
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
  //           <input
  //             type="password"
  //             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
  //             placeholder="Enter your password"
  //           />
  //         </div>
  //         <button
  //           onClick={() => setShowLoginModal(false)}
  //           className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
  //         >
  //           Sign In
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Monthly Income</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">$3,500.00</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Monthly Expense</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">$1,200.00</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600 font-medium">Monthly Savings</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">$2,300.00</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'Income':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Income Sources</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">Primary Job</span>
                </div>
                <span className="text-xl font-bold text-green-600">$3,000.00</span>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">Freelance Work</span>
                </div>
                <span className="text-xl font-bold text-green-600">$500.00</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Monthly Income</span>
                <span className="text-2xl font-bold text-green-600">$3,500.00</span>
              </div>
            </div>
          </div>
        );

      case 'Expenses':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Monthly Expenses</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">Rent</span>
                </div>
                <span className="text-xl font-bold text-red-600">$800.00</span>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">Food & Dining</span>
                </div>
                <span className="text-xl font-bold text-red-600">$250.00</span>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">Utilities</span>
                </div>
                <span className="text-xl font-bold text-red-600">$150.00</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Monthly Expenses</span>
                <span className="text-2xl font-bold text-red-600">$1,200.00</span>
              </div>
            </div>
          </div>
        );

      case 'Goals':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Financial Goals</h3>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-700">Emergency Fund</span>
                  <span className="text-sm text-gray-500">$5,000 / $10,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-700">Vacation Fund</span>
                  <span className="text-sm text-gray-500">$1,500 / $3,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`sticky top-0 z-40 transition-colors duration-300 bg-white shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavLink to='/'>
              <div className="flex items-center space-x-3">
                <div>
                  <img src="/Logo.svg" alt="Money Quest Logo" className="w-10 h-10" />
                </div>
                <span className="text-xl font-extrabold font-mono text-gray-900">Money Quest</span>
              </div>
            </NavLink>
            <nav className="hidden md:flex items-center space-x-8 ">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-white hover:bg-[#23082A] rounded-md py-1 px-2 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-white hover:bg-[#23082A] rounded-md py-1 px-2 transition-colors"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 hover:text-white hover:bg-[#23082A] rounded-md py-1 px-2 transition-colors"
              >
                Pricing
              </button>
              <NavLink to='/login' className='bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors'>Login</NavLink>

            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative top-0 overflow-hidden">
        <div className="bg-gradient-to-br from-pink-100 via-pink-200 to-yellow-200 min-h-screen flex items-center top-0">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 text-2xl animate-bounce">💰</div>
          <div className="absolute top-32 right-20 text-2xl animate-"></div>
          <div className="absolute bottom-40 left-20 text-2xl animate-bounce delay-300">🎯</div>
          <div className="absolute top-40 right-40 text-2xl animate-pulse delay-150">💎</div>
          <div className="absolute bottom-60 right-10 text-2xl animate-bounce delay-500">🌟</div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-[#23082A] mb-6 leading-tight">
              Plan your coins<br />
              <span className="text-[#23082A]">Live your dreams</span>
            </h1>
            <img></img>
            <p className="text-lg text-zinc-800 mb-12 max-w-2xl mx-auto">
              Built for anyone ready to master their finances and smash every goal 🎯
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('dashboard')}
                className="bg-gray-900 text-white px-6 py-2 rounded-md font-semibold text-lg hover:bg-gray-800  transform  shadow-lg"
              >
                Try for free
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="bg-white text-gray-900 px-6 py-2 rounded-md font-semibold text-lg hover:bg-gray-50 shadow-lg"
              >
                How it works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 shadow-sm">
              {['Overview', 'Income', 'Expenses', 'Goals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </section>

      {/* Placeholder sections for smooth scrolling */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Features</h2>
          {/* <p className="text-xl text-gray-600">Coming soon - Amazing features to help you manage your finances!</p> */}

          <FeatureSlider />
        </div>
      </section>
 
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">How it Works</h2>
          <p className="text-xl text-gray-600">Simple steps to financial success!</p>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Pricing</h2>
          <p className="text-xl text-gray-600">Affordable plans for everyone!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-sm text-gray-400">Designed by</span>
            <span className="text-sm text-white font-medium">🔺 Readdy</span>
          </div>
          <p className="text-gray-400">© 2024 Money Quest. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && <LoginModal />}
    </div>
  );
};

export default LandingPage;