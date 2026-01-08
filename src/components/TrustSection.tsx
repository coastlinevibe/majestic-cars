import { useEffect, useRef, useState } from 'react';
import { Users, Car, Star, Award, Headphones, CheckCircle } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: '+',
    label: 'Happy Customers',
    description: 'Join thousands of satisfied customers who have found their dream vehicle through us with confidence.',
  },
  {
    icon: Car,
    value: 150,
    suffix: '+',
    label: 'Premium Vehicles',
    description: 'Carefully curated collection of luxury and performance cars to suit all tastes.',
  },
  {
    icon: Star,
    value: 25,
    suffix: '%',
    label: 'Customer Satisfaction',
    description: 'Industry-leading satisfaction rates backed by our commitment to service excellence.',
    displayValue: '4.9',
  },
  {
    icon: Award,
    value: 4,
    suffix: '+',
    label: 'Years Experience',
    description: 'Over four years of expertise in premium automotive sales and service.',
  },
  {
    icon: Headphones,
    value: 24,
    suffix: '/7',
    label: 'Customer Support',
    description: 'Round-the-clock customer support for all your automotive needs and questions.',
  },
  {
    icon: CheckCircle,
    value: 10,
    suffix: '%',
    label: 'Certified Vehicles',
    description: 'Every car undergoes rigorous inspection and comes with warranty coverage.',
    displayValue: '100',
  },
];

const TrustSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-card">
      <div className="sterling-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-foreground mb-4">
            Why Customers Trust Sterling Motors
          </h2>
          <p className="text-muted-foreground text-lg">
            Proven excellence backed by real numbers and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`trust-card ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={32} className="text-primary" />
                </div>
                <div className="text-4xl font-black text-primary mb-2">
                  {stat.displayValue || stat.value}{stat.suffix}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {stat.label}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
