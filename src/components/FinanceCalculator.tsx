import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FinanceCalculator = () => {
  const [monthlyBudget, setMonthlyBudget] = useState<number>(15000);
  const [loanTerm, setLoanTerm] = useState<string>('72');
  const [tradeIn, setTradeIn] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<string>('11.5');
  const [maxPrice, setMaxPrice] = useState<number>(0);

  useEffect(() => {
    // Calculate max affordable car price
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanTerm);
    
    if (monthlyRate > 0) {
      const loanAmount = monthlyBudget * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
      const totalAffordable = loanAmount + tradeIn + deposit;
      setMaxPrice(Math.round(totalAffordable));
    }
  }, [monthlyBudget, loanTerm, tradeIn, deposit, interestRate]);

  const formatCurrency = (value: number) => {
    return `R ${value.toLocaleString()}`;
  };

  return (
    <section className="section-padding bg-card">
      <div className="sterling-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Info */}
          <div>
            <h2 className="text-4xl font-black text-foreground mb-4">
              Buy within your budget
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let us know your budget, use our filters, and we'll match you with quality cars at that price.
            </p>
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
                alt="Luxury car interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right - Calculator */}
          <div className="bg-secondary rounded-2xl p-8 shadow-md">
            <div className="mb-8">
              <div className="text-4xl font-black text-foreground mb-2">
                {formatCurrency(maxPrice)}
              </div>
              <p className="text-muted-foreground text-sm">
                Estimated max budget power<br />
                Based on 11.5% interest
              </p>
            </div>

            <div className="space-y-6">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinanceCalculator;
