import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CarManagementDialog from '@/components/CarManagementDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { carService, Car as SupabaseCar, supabase } from '@/lib/supabase';
import { authService } from '@/lib/auth';
import { 
  BarChart3, 
  Car, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Loader2,
  AlertCircle,
  LogOut
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [cars, setCars] = useState<SupabaseCar[]>([]);
  const [filteredCars, setFilteredCars] = useState<SupabaseCar[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<SupabaseCar | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Mock data for demonstration
  const analyticsData = {
    totalViews: 45230,
    totalInquiries: 1247,
    totalSales: 89,
    revenue: 12450000,
    conversionRate: 7.1,
    avgViewTime: '4:32'
  };

  const recentInquiries = [
    { id: 1, name: 'John Smith', email: 'john@email.com', vehicle: 'BMW M8', date: '2024-01-03', status: 'pending' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', vehicle: 'Mercedes AMG GT', date: '2024-01-02', status: 'contacted' },
    { id: 3, name: 'Mike Wilson', email: 'mike@email.com', vehicle: 'Audi RS6', date: '2024-01-02', status: 'completed' },
    { id: 4, name: 'Emma Davis', email: 'emma@email.com', vehicle: 'BMW X7', date: '2024-01-01', status: 'pending' },
  ];

  // Load cars from Supabase
  useEffect(() => {
    loadCars();
    loadUser();
  }, []);

  // Filter cars based on search and status
  useEffect(() => {
    let filtered = cars;

    if (searchQuery) {
      filtered = filtered.filter(car => 
        car.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(car => car.status === statusFilter);
    }

    setFilteredCars(filtered);
  }, [cars, searchQuery, statusFilter]);

  const loadUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      navigate('/sign-in');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out.',
        variant: 'destructive',
      });
    }
  };

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await carService.getAllCars();
      setCars(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load cars. Make sure Supabase is configured.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = () => {
    setSelectedCar(null);
    setIsDialogOpen(true);
  };

  const handleEditCar = (car: SupabaseCar) => {
    setSelectedCar(car);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (carId: string) => {
    setCarToDelete(carId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!carToDelete) return;

    try {
      // Find the car to get its make and model for folder deletion
      const carToDeleteData = cars.find(c => c.id === carToDelete);
      
      console.log('Deleting car:', carToDeleteData);
      
      // Delete the car from database
      await carService.deleteCar(carToDelete);
      
      // Delete the folder from storage if car has make and model
      if (carToDeleteData?.make && carToDeleteData?.model) {
        const folderName = `${carToDeleteData.make.trim()}_${carToDeleteData.model.trim()}`.replace(/[^a-zA-Z0-9-_]/g, '_');
        console.log('Attempting to delete folder:', folderName);
        
        try {
          await carService.deleteFolder(folderName);
          console.log('Folder deleted successfully:', folderName);
        } catch (storageError) {
          console.error('Error deleting folder:', storageError);
          // Show warning but don't fail the whole operation
          toast({
            title: 'Warning',
            description: 'Car deleted but some images may remain in storage.',
            variant: 'default',
          });
        }
      } else {
        console.warn('Car missing make or model, skipping folder deletion');
      }
      
      toast({
        title: 'Success!',
        description: 'Car deleted successfully.',
      });
      loadCars();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete car.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCarToDelete(null);
    }
  };

  const formatPrice = (price: number) => `R ${price?.toLocaleString() || 0}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <div className="sterling-container py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your Majesticars platform</p>
            </div>
            <div className="flex items-center gap-4">
              {userEmail && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-medium">{userEmail}</p>
                </div>
              )}
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Inquiries
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalInquiries.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+8.2%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalSales}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+15.3%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R {analyticsData.revenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+22.1%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+0.8%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. View Time</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.avgViewTime}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+0:23</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Views, inquiries, and sales over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Chart Component Placeholder
                      <br />
                      (Integration with Recharts recommended)
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Vehicles</CardTitle>
                    <CardDescription>Most viewed and inquired vehicles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cars.slice(0, 4).map((vehicle, index) => (
                      <div key={vehicle.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                          </div>
                        </div>
                        <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                          {vehicle.status}
                        </Badge>
                      </div>
                    ))}
                    {cars.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No vehicles yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              {/* Inventory Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Vehicle Inventory</h2>
                  <p className="text-muted-foreground">Manage your vehicle listings</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={loadCars} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button size="sm" onClick={handleAddCar}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </div>

              {/* Inventory Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search Vehicles</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="search" 
                          placeholder="Search by make, model, or description..." 
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-48">
                      <Label>Status Filter</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Listings</CardTitle>
                  <CardDescription>
                    {filteredCars.length} vehicles in inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : filteredCars.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
                      <p className="text-muted-foreground mb-4">
                        {cars.length === 0 
                          ? 'Get started by adding your first vehicle to the inventory.'
                          : 'Try adjusting your search or filter criteria.'}
                      </p>
                      {cars.length === 0 && (
                        <Button onClick={handleAddCar}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Vehicle
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCars.map((car) => (
                          <TableRow key={car.id}>
                            <TableCell className="font-medium">
                              {car.make} {car.model}
                            </TableCell>
                            <TableCell>{car.year}</TableCell>
                            <TableCell>{formatPrice(car.price)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  car.status === 'available' ? 'default' : 
                                  car.status === 'sold' ? 'destructive' : 'secondary'
                                }
                              >
                                {car.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{car.location || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditCar(car)}
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteClick(car.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inquiries Tab */}
            <TabsContent value="inquiries" className="space-y-6">
              {/* Inquiries Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Customer Inquiries</h2>
                  <p className="text-muted-foreground">Manage customer inquiries and leads</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Inquiry Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">89%</div>
                    <p className="text-xs text-muted-foreground">Response Rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Inquiries Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Inquiries</CardTitle>
                  <CardDescription>Latest customer inquiries and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="font-medium">{inquiry.name}</TableCell>
                          <TableCell>{inquiry.email}</TableCell>
                          <TableCell>{inquiry.vehicle}</TableCell>
                          <TableCell>{inquiry.date}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                inquiry.status === 'pending' ? 'secondary' : 
                                inquiry.status === 'contacted' ? 'default' : 'outline'
                              }
                            >
                              {inquiry.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Car Management Dialog */}
      <CarManagementDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        car={selectedCar}
        onSuccess={loadCars}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;