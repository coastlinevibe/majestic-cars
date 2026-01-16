import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Car, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, useInView } from 'framer-motion';
import contactHeroImg from '@/assets/contact-hero.jpg';
import { setPageTitle, setPageDescription, setPageImage } from '@/lib/seo';
import { sendGeneralInquiryEmail, sendVehicleInquiryEmail } from '@/lib/email';

const Contact = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const contentRef = useRef<HTMLDivElement>(null);

  // Set SEO meta tags
  useEffect(() => {
    setPageTitle('Contact Us - Majestic Cars | Get in Touch');
    setPageDescription('Contact Majestic Cars for inquiries about our quality second-hand cars. Call 060 857 9146 or visit us in Sinoville, Pretoria. Simple, honest car buying.');
    setPageImage('https://majestic-cars.vercel.app/contact-hero.jpg');
  }, []);
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });
  
  const [generalFormData, setGeneralFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [vehicleFormData, setVehicleFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleInterest: '',
    budgetRange: '',
    financingNeeded: '',
    tradeIn: '',
    message: '',
  });

  const [isSubmittingGeneral, setIsSubmittingGeneral] = useState(false);
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingGeneral(true);
    
    try {
      await sendGeneralInquiryEmail(generalFormData);
      toast({
        title: 'General Inquiry Sent!',
        description: "We'll get back to you within 24 hours.",
      });
      setGeneralFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send inquiry. Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingGeneral(false);
    }
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingVehicle(true);
    
    try {
      await sendVehicleInquiryEmail(vehicleFormData);
      toast({
        title: 'Car Inquiry Sent!',
        description: "Our sales team will contact you within 24 hours.",
      });
      setVehicleFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        vehicleInterest: '', 
        budgetRange: '', 
        financingNeeded: '', 
        tradeIn: '', 
        message: '' 
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send inquiry. Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingVehicle(false);
    }
  };

  const fillDemoGeneralForm = () => {
    setGeneralFormData({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '060 123 4567',
      subject: 'general',
      message: 'Hi, I would like to know more about your services and available vehicles. Looking forward to hearing from you!',
    });
    toast({
      title: 'Demo Data Filled',
      description: 'Form filled with sample data for testing.',
    });
  };

  const fillDemoVehicleForm = () => {
    setVehicleFormData({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '079 987 6543',
      vehicleInterest: 'bmw-m8',
      budgetRange: '1m-1.5m',
      financingNeeded: 'yes',
      tradeIn: '2019 Audi A4',
      message: 'I am interested in the BMW M8. Would like to schedule a test drive and discuss financing options.',
    });
    toast({
      title: 'Demo Data Filled',
      description: 'Form filled with sample data for testing.',
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['154 Sefako Makgatho Service Ln', 'Sinoville, Pretoria, 0129', 'South Africa'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['060 857 9146', '079 202 1308'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['majesticcarssinoville@gmail.com'],
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Friday: 8:00 - 17:00', 'Saturday - Sunday: 8:00 - 16:00', 'www.majesticars.com'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, filter: 'blur(5px)' }}
          animate={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${contactHeroImg})` }}
        />
        <div className="hero-overlay" />
        <div className="relative z-10 sterling-container text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4"
            style={{ fontFamily: 'serif', fontStyle: 'italic' }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-white/80 text-base md:text-lg lg:text-xl max-w-3xl mx-auto"
            style={{ fontStyle: 'italic' }}
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section ref={contentRef} className="section-padding bg-card md:px-8 px-2">
        <div className="max-w-7xl mx-auto md:px-6 lg:px-8 px-2">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Contact Forms */}
            <motion.div
              initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              animate={contentInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">Get in Touch</h2>
              <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
                Choose the type of inquiry and fill out the form below. Our team will get back to you within 24 hours.
              </p>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                  <TabsTrigger value="general" className="flex items-center gap-2 text-xs md:text-sm">
                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">General Inquiry</span>
                    <span className="sm:hidden">General</span>
                  </TabsTrigger>
                  <TabsTrigger value="vehicle" className="flex items-center gap-2 text-xs md:text-sm">
                    <Car className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Car Inquiry</span>
                    <span className="sm:hidden">Car</span>
                  </TabsTrigger>
                </TabsList>

                {/* General Inquiry Form */}
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>General Inquiry</CardTitle>
                          <CardDescription>
                            For general questions, support, or information about our services
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={fillDemoGeneralForm}
                          className="flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Demo
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleGeneralSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="general-name" className="mb-2 block">Full Name *</Label>
                            <Input
                              id="general-name"
                              value={generalFormData.name}
                              onChange={(e) => setGeneralFormData({ ...generalFormData, name: e.target.value })}
                              placeholder="John Doe"
                              required
                              className="bg-background"
                            />
                          </div>
                          <div>
                            <Label htmlFor="general-email" className="mb-2 block">Email Address *</Label>
                            <Input
                              id="general-email"
                              type="email"
                              value={generalFormData.email}
                              onChange={(e) => setGeneralFormData({ ...generalFormData, email: e.target.value })}
                              placeholder="john@example.com"
                              required
                              className="bg-background"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="general-phone" className="mb-2 block">Phone Number</Label>
                            <Input
                              id="general-phone"
                              type="tel"
                              value={generalFormData.phone}
                              onChange={(e) => setGeneralFormData({ ...generalFormData, phone: e.target.value })}
                              placeholder="060 857 9146"
                              className="bg-background"
                            />
                          </div>
                          <div>
                            <Label htmlFor="general-subject" className="mb-2 block">Subject *</Label>
                            <Select
                              value={generalFormData.subject}
                              onValueChange={(value) => setGeneralFormData({ ...generalFormData, subject: value })}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General Information</SelectItem>
                                <SelectItem value="service">Service & Maintenance</SelectItem>
                                <SelectItem value="support">Customer Support</SelectItem>
                                <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                                <SelectItem value="feedback">Feedback</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="general-message" className="mb-2 block">Message *</Label>
                          <Textarea
                            id="general-message"
                            value={generalFormData.message}
                            onChange={(e) => setGeneralFormData({ ...generalFormData, message: e.target.value })}
                            placeholder="Tell us how we can help you..."
                            required
                            rows={6}
                            className="bg-background resize-none"
                          />
                        </div>

                        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmittingGeneral}>
                          <Send className="mr-2" size={18} />
                          {isSubmittingGeneral ? 'Sending...' : 'Send General Inquiry'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Car Inquiry Form */}
                <TabsContent value="vehicle">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Car Inquiry</CardTitle>
                          <CardDescription>
                            Interested in purchasing a car? Let us know your preferences and we'll help you find the perfect match
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={fillDemoVehicleForm}
                          className="flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Demo
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleVehicleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="vehicle-name" className="mb-2 block">Full Name *</Label>
                            <Input
                              id="vehicle-name"
                              value={vehicleFormData.name}
                              onChange={(e) => setVehicleFormData({ ...vehicleFormData, name: e.target.value })}
                              placeholder="John Doe"
                              required
                              className="bg-background"
                            />
                          </div>
                          <div>
                            <Label htmlFor="vehicle-email" className="mb-2 block">Email Address *</Label>
                            <Input
                              id="vehicle-email"
                              type="email"
                              value={vehicleFormData.email}
                              onChange={(e) => setVehicleFormData({ ...vehicleFormData, email: e.target.value })}
                              placeholder="john@example.com"
                              required
                              className="bg-background"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="vehicle-phone" className="mb-2 block">Phone Number *</Label>
                            <Input
                              id="vehicle-phone"
                              type="tel"
                              value={vehicleFormData.phone}
                              onChange={(e) => setVehicleFormData({ ...vehicleFormData, phone: e.target.value })}
                              placeholder="060 857 9146"
                              required
                              className="bg-background"
                            />
                          </div>
                          <div>
                            <Label htmlFor="vehicle-interest" className="mb-2 block">Car of Interest</Label>
                            <Select
                              value={vehicleFormData.vehicleInterest}
                              onValueChange={(value) => setVehicleFormData({ ...vehicleFormData, vehicleInterest: value })}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select a car" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bmw-m8">BMW M8</SelectItem>
                                <SelectItem value="mercedes-amg-gt">Mercedes AMG GT</SelectItem>
                                <SelectItem value="audi-rs6">Audi RS6</SelectItem>
                                <SelectItem value="audi-tt">Audi TT</SelectItem>
                                <SelectItem value="bmw-x7">BMW X7</SelectItem>
                                <SelectItem value="not-sure">Not sure yet</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="budget-range" className="mb-2 block">Budget Range</Label>
                            <Select
                              value={vehicleFormData.budgetRange}
                              onValueChange={(value) => setVehicleFormData({ ...vehicleFormData, budgetRange: value })}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under-500k">Under R 500,000</SelectItem>
                                <SelectItem value="500k-1m">R 500,000 - R 1,000,000</SelectItem>
                                <SelectItem value="1m-1.5m">R 1,000,000 - R 1,500,000</SelectItem>
                                <SelectItem value="1.5m-2m">R 1,500,000 - R 2,000,000</SelectItem>
                                <SelectItem value="over-2m">Over R 2,000,000</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="financing-needed" className="mb-2 block">Financing Needed?</Label>
                            <Select
                              value={vehicleFormData.financingNeeded}
                              onValueChange={(value) => setVehicleFormData({ ...vehicleFormData, financingNeeded: value })}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes, I need financing</SelectItem>
                                <SelectItem value="no">No, cash purchase</SelectItem>
                                <SelectItem value="maybe">Maybe, need more info</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="trade-in" className="mb-2 block">Trade-In Car</Label>
                          <Input
                            id="trade-in"
                            value={vehicleFormData.tradeIn}
                            onChange={(e) => setVehicleFormData({ ...vehicleFormData, tradeIn: e.target.value })}
                            placeholder="e.g., 2020 BMW 3 Series"
                            className="bg-background"
                          />
                        </div>

                        <div>
                          <Label htmlFor="vehicle-message" className="mb-2 block">Additional Information</Label>
                          <Textarea
                            id="vehicle-message"
                            value={vehicleFormData.message}
                            onChange={(e) => setVehicleFormData({ ...vehicleFormData, message: e.target.value })}
                            placeholder="Tell us about your preferences, timeline, or any specific requirements..."
                            rows={4}
                            className="bg-background resize-none"
                          />
                        </div>

                        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmittingVehicle}>
                          <Send className="mr-2" size={18} />
                          {isSubmittingVehicle ? 'Sending...' : 'Send Vehicle Inquiry'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
              animate={contentInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">Contact Information</h2>
              <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
                Reach out to us through any of these channels.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 30, filter: 'blur(10px)', scale: 0.9 }}
                      animate={contentInView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                      className="bg-background rounded-xl p-4 md:p-6"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={contentInView ? { scale: 1, rotate: 0 } : {}}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 md:mb-4"
                      >
                        <Icon size={20} className="text-primary md:w-6 md:h-6" />
                      </motion.div>
                      <h3 className="font-bold text-foreground mb-2 text-sm md:text-base">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground text-xs md:text-sm">{detail}</p>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={contentInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="bg-secondary rounded-xl overflow-hidden h-64"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.8234567890123!2d28.2234567!3d-25.7123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9560e8b8b8b8b8%3A0x1234567890abcdef!2s154%20Sefako%20Makgatho%20Service%20Ln%2C%20Sinoville%2C%20Pretoria%2C%200129!5e0!3m2!1sen!2sza!4v1234567890123!5m2!1sen!2sza"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Majesticars Sinoville Location"
                ></iframe>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default Contact;