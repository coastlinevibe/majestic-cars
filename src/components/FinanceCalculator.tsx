import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const FinanceCalculator = () => {
  const [monthlyBudget, setMonthlyBudget] = useState<number>(15000);
  const [loanTerm, setLoanTerm] = useState<string>('72');
  const [tradeIn, setTradeIn] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<string>('11.5');
  const [maxPrice, setMaxPrice] = useState<number>(0);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const [displayPrice, setDisplayPrice] = useState('0');

  useEffect(() => {
    // Calculate max affordable car price
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanTerm);
    
    if (monthlyRate > 0) {
      const loanAmount = monthlyBudget * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
      const totalAffordable = loanAmount + tradeIn + deposit;
      setMaxPrice(Math.round(totalAffordable));
      motionValue.set(Math.round(totalAffordable));
    }
  }, [monthlyBudget, loanTerm, tradeIn, deposit, interestRate, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayPrice(Math.round(latest).toLocaleString());
    });
    return unsubscribe;
  }, [springValue]);

  const formatCurrency = (value: string) => {
    return `R ${value}`;
  };

  return (
    <section ref={sectionRef} className="section-padding bg-card">
      <div className="sterling-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h2 className="text-4xl font-black text-foreground mb-4">
              Buy within your budget
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let us know your budget, use our filters, and we'll match you with quality cars at that price.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="aspect-video rounded-xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
                alt="Luxury car interior"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Right - Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="bg-secondary rounded-2xl p-8 shadow-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <div className="text-4xl font-black text-foreground mb-2">
                {formatCurrency(displayPrice)}
              </div>
              <p className="text-muted-foreground text-sm">
                Estimated max budget power<br />
                Based on 11.5% interest
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Monthly budget</Label>
                  <Input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Loan term</Label>
                  <Select value={loanTerm} onValueChange={setLoanTerm}>
                    <SelectTrigger className="bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                      <SelectItem value="72">72 months</SelectItem>
                      <SelectItem value="84">84 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Trade-in amount</Label>
                  <Input
                    type="number"
                    value={tradeIn}
                    onChange={(e) => setTradeIn(Number(e.target.value))}
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Deposit amount</Label>
                  <Input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="bg-card"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Interest rate</Label>
                <Select value={interestRate} onValueChange={setInterestRate}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9.5">9.5% - Excellent Credit</SelectItem>
                    <SelectItem value="11.5">11.5% - Good Credit</SelectItem>
                    <SelectItem value="13.5">13.5% - Average Credit</SelectItem>
                    <SelectItem value="15.5">15.5% - Fair Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" size="lg">
                See your matches
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinanceCalculator;
