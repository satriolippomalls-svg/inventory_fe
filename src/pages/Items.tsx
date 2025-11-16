import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getItems, getCategories, getLocations, saveItems, saveCategories, saveLocations } from '@/lib/storage';
import { Item, ItemCategory, Location } from '@/types';
import { Plus, Search, Filter, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingCategory, setEditingCategory] = useState<ItemCategory | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    code: '',
    amount: '',
    minStock: '',
    categoryId: '',
    locationId: '',
    imageUrl: '',
  });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newLocation, setNewLocation] = useState({ name: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    setItems(getItems());
    setCategories(getCategories());
    setLocations(getLocations());
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || item.locationId === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || 'Unknown';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      const updatedItems = items.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              name: newItem.name,
              code: newItem.code,
              amount: parseInt(newItem.amount),
              minStock: parseInt(newItem.minStock),
              categoryId: newItem.categoryId,
              locationId: newItem.locationId,
              imageUrl: newItem.imageUrl,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      saveItems(updatedItems);
      setItems(updatedItems);
      toast({ title: 'Item updated', description: 'Item has been updated successfully' });
    } else {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name,
        code: newItem.code,
        amount: parseInt(newItem.amount),
        minStock: parseInt(newItem.minStock),
        categoryId: newItem.categoryId,
        locationId: newItem.locationId,
        imageUrl: newItem.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedItems = [...items, item];
      saveItems(updatedItems);
      setItems(updatedItems);
      toast({ title: 'Item created', description: 'New item has been added successfully' });
    }
    
    setIsDialogOpen(false);
    setEditingItem(null);
    setNewItem({
      name: '',
      code: '',
      amount: '',
      minStock: '',
      categoryId: '',
      locationId: '',
      imageUrl: '',
    });
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: newCategory.name, description: newCategory.description }
          : cat
      );
      saveCategories(updatedCategories);
      setCategories(updatedCategories);
      toast({ title: 'Category updated', description: 'Category has been updated successfully' });
    } else {
      const category: ItemCategory = {
        id: Date.now().toString(),
        name: newCategory.name,
        description: newCategory.description,
      };
      const updatedCategories = [...categories, category];
      saveCategories(updatedCategories);
      setCategories(updatedCategories);
      toast({ title: 'Category created', description: 'New category has been added successfully' });
    }
    
    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: '', description: '' });
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLocation) {
      const updatedLocations = locations.map(loc =>
        loc.id === editingLocation.id
          ? { ...loc, name: newLocation.name, description: newLocation.description }
          : loc
      );
      saveLocations(updatedLocations);
      setLocations(updatedLocations);
      toast({ title: 'Location updated', description: 'Location has been updated successfully' });
    } else {
      const location: Location = {
        id: Date.now().toString(),
        name: newLocation.name,
        description: newLocation.description,
      };
      const updatedLocations = [...locations, location];
      saveLocations(updatedLocations);
      setLocations(updatedLocations);
      toast({ title: 'Location created', description: 'New location has been added successfully' });
    }
    
    setIsLocationDialogOpen(false);
    setEditingLocation(null);
    setNewLocation({ name: '', description: '' });
  };

  const handleEditCategory = (category: ItemCategory) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, description: category.description || '' });
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== id);
    saveCategories(updatedCategories);
    setCategories(updatedCategories);
    toast({ title: 'Category deleted', description: 'Category has been removed successfully' });
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setNewLocation({ name: location.name, description: location.description || '' });
    setIsLocationDialogOpen(true);
  };

  const handleDeleteLocation = (id: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== id);
    saveLocations(updatedLocations);
    setLocations(updatedLocations);
    toast({ title: 'Location deleted', description: 'Location has been removed successfully' });
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      code: item.code,
      amount: item.amount.toString(),
      minStock: item.minStock.toString(),
      categoryId: item.categoryId,
      locationId: item.locationId,
      imageUrl: item.imageUrl || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);
    setItems(updatedItems);
    toast({ title: 'Item deleted', description: 'Item has been removed successfully' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your items, categories, and locations</p>
        </div>

        <Tabs defaultValue="items" className="space-y-4">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Items</h2>
              <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Amount</TableHead>
                      <TableHead className="text-center">Min Stock</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                        <TableCell>{getLocationName(item.locationId)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.amount < item.minStock ? 'destructive' : 'default'}>
                            {item.amount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{item.minStock}</TableCell>
                        <TableCell className="text-center">
                          {item.amount < item.minStock ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : (
                            <Badge variant="secondary">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem onClick={() => handleEditItem(item)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteItem(item.id)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Button onClick={() => { setEditingCategory(null); setIsCategoryDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map(category => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem onClick={() => handleEditCategory(category)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteCategory(category.id)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Locations</h2>
              <Button onClick={() => { setEditingLocation(null); setIsLocationDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map(location => (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">{location.name}</TableCell>
                        <TableCell>{location.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem onClick={() => handleEditLocation(location)} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteLocation(location.id)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update item details' : 'Fill in the details to create a new inventory item'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={newItem.code}
                    onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      value={newItem.amount}
                      onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      min="0"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem(prev => ({ ...prev, minStock: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.categoryId}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, categoryId: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={newItem.locationId}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, locationId: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {locations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="picture">Picture</Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {newItem.imageUrl && (
                    <img src={newItem.imageUrl} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-md" />
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingItem ? 'Update Item' : 'Create Item'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update category details' : 'Create a new item category'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCategorySubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
              <DialogDescription>
                {editingLocation ? 'Update location details' : 'Create a new storage location'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLocationSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="locationName">Name</Label>
                  <Input
                    id="locationName"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationDescription">Description</Label>
                  <Textarea
                    id="locationDescription"
                    value={newLocation.description}
                    onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingLocation ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Items;
