import { Wallet, Target, Bell, LineChart, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Wallet className="w-10 h-10 text-indigo-500" />,
    title: "Smart Budgeting",
    desc: "Track income and expenses with clear visual insights."
  },
  {
    icon: <Target className="w-10 h-10 text-green-500" />,
    title: "Goal Tracking",
    desc: "Set financial goals and monitor progress in real time."
  },
  {
    icon: <LineChart className="w-10 h-10 text-pink-500" />,
    title: "AI Insights",
    desc: "Get personalized tips and suggestions for saving smarter."
  },
  {
    icon: <Shield className="w-10 h-10 text-blue-500" />,
    title: "Secure & Private",
    desc: "We use bank-level encryption to protect your data."
  },
  {
    icon: <Smartphone className="w-10 h-10 text-yellow-500" />,
    title: "Multi-device Access",
    desc: "Access your dashboard seamlessly on web and mobile."
  },
  {
    icon: <Bell className="w-10 h-10 text-red-500" />,
    title: "Notifications",
    desc: "Stay updated with bill reminders and spending alerts."
  },
];

const Features = () => {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Unlock Powerful Features</h1>
        <p className="mt-4 text-lg text-gray-600">
          Manage your money, track goals, and get AI-powered insights.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Take control of your finances today!</h2>
        <button
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
          onClick={() => (window.location.href = "/signup")}
        >
          Join Money Quest
        </button>
      </div>
    </div>
  );
};

export default Features;
