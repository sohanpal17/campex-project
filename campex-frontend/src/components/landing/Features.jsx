import { Shield, Lock, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'College Students Only',
      description: 'Safe and trusted - only verified college students with college email IDs can join our community.',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      icon: Lock,
      title: 'AI-Image Moderation',
      description: 'AI-powered image moderation ensures safe and appropriate uploads. Prevent misleading or harmful content in listings.',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      icon: Zap,
      title: 'Quick & Easy',
      description: 'List items in seconds, chat instantly with sellers, and complete trades right on campus.',
      color: 'bg-primary-100 text-primary-600',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Campex?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A trusted marketplace designed specifically for campus communities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-lg shadow-lg transition-shadow duration-2000"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${feature.color} flex items-center justify-center`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;