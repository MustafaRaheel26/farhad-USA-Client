import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Tag, 
  Image as ImageIcon, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Percent,
  Coffee,
  Pizza,
  Utensils,
  ChevronRight,
  X
} from 'lucide-react';
import { Category, MenuItem } from '@/types';
import { CATEGORIES, MENU_ITEMS_DATA } from '@/data/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const iconMap: Record<string, any> = {
  Coffee,
  Pizza,
  Utensils
};

export function ChefPanel() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);

  // Form States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Item Form
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemCat, setItemCat] = useState('');

  // Category Form
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('Utensils');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleApplyGlobalDiscount = () => {
    const discount = prompt('Enter global discount percentage (0-100):');
    if (discount !== null) {
      const d = parseInt(discount);
      if (!isNaN(d) && d >= 0 && d <= 100) {
        setGlobalDiscount(d);
        setItems(prev => prev.map(item => ({ ...item, discount: d })));
        toast.success(`Applied ${d}% discount to all items`);
      } else {
        toast.error('Invalid discount value');
      }
    }
  };

  const handleApplyCategoryDiscount = (categoryId: string) => {
    const discount = prompt('Enter discount percentage for this category (0-100):');
    if (discount !== null) {
      const d = parseInt(discount);
      if (!isNaN(d) && d >= 0 && d <= 100) {
        setItems(prev => prev.map(item => 
          item.categoryId === categoryId ? { ...item, discount: d } : item
        ));
        toast.success(`Applied ${d}% discount to ${categories.find(c => c.id === categoryId)?.name}`);
      } else {
        toast.error('Invalid discount value');
      }
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Item deleted successfully');
    }
  };

  const openItemModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemPrice(item.price.toString());
      setItemDesc(item.description);
      setItemImage(item.image);
      setItemCat(item.categoryId);
    } else {
      setEditingItem(null);
      setItemName('');
      setItemPrice('');
      setItemDesc('');
      setItemImage('');
      setItemCat(selectedCategory === 'all' ? categories[0]?.id || '' : selectedCategory);
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!itemName || !itemPrice || !itemCat) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem: MenuItem = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      name: itemName,
      price: parseFloat(itemPrice),
      description: itemDesc,
      image: itemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
      categoryId: itemCat,
      discount: editingItem?.discount || globalDiscount
    };

    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? newItem : i));
      toast.success('Item updated successfully');
    } else {
      setItems(prev => [...prev, newItem]);
      toast.success('Item added successfully');
    }
    setIsItemModalOpen(false);
  };

  const handleSaveCategory = () => {
    if (!catName) {
      toast.error('Please enter a category name');
      return;
    }

    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: catName,
      icon: catIcon
    };

    setCategories(prev => [...prev, newCat]);
    toast.success('Category added successfully');
    setIsCategoryModalOpen(false);
    setCatName('');
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kitchen Management</h2>
          <p className="text-muted-foreground">Manage your menu categories, items, and promotions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleApplyGlobalDiscount}>
            <Percent className="w-4 h-4" />
            Global Discount
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => openItemModal()}>
            <Plus className="w-4 h-4" />
            Add New Item
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden">
        {/* Categories Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              <Button 
                variant={selectedCategory === 'all' ? 'secondary' : 'ghost'} 
                className="w-full justify-start gap-3 rounded-lg"
                onClick={() => setSelectedCategory('all')}
              >
                <Filter className="w-4 h-4" />
                All Items
                <Badge variant="secondary" className="ml-auto">{items.length}</Badge>
              </Button>
              <Separator className="my-2" />
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Utensils;
                const count = items.filter(i => i.categoryId === cat.id).length;
                return (
                  <div key={cat.id} className="group flex items-center gap-1">
                    <Button 
                      variant={selectedCategory === cat.id ? 'secondary' : 'ghost'} 
                      className="flex-grow justify-start gap-3 rounded-lg"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.name}
                      <Badge variant="secondary" className="ml-auto">{count}</Badge>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={() => handleApplyCategoryDiscount(cat.id)}
                    >
                      <Percent className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 rounded-lg text-primary hover:text-primary hover:bg-primary/10 mt-2"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-primary/5 border-primary/20">
            <CardHeader className="p-4">
              <div className="flex items-center gap-2 text-primary">
                <Tag className="w-4 h-4" />
                <CardTitle className="text-sm font-bold uppercase tracking-wider">Active Promotions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {globalDiscount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Global Discount</span>
                  <Badge className="bg-emerald-500">{globalDiscount}% OFF</Badge>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground italic">
                Discounts are applied instantly to the digital menu and checkout.
              </p>
            </CardContent>
          </Card>
        </aside>

        {/* Items Grid */}
        <main className="lg:col-span-9 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search menu items..." 
                className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
              <span>Showing {filteredItems.length} items</span>
            </div>
          </div>

          <ScrollArea className="flex-grow pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <div className="flex gap-2 w-full">
                            <Button size="sm" variant="secondary" className="flex-grow gap-2" onClick={() => openItemModal(item)}>
                              <Edit2 className="w-3 h-3" /> Edit
                            </Button>
                            <Button size="sm" variant="destructive" className="size-8 p-0" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {item.discount && item.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-emerald-500 border-none">
                            {item.discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                            <CardDescription className="text-xs line-clamp-1 mt-1">{item.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "font-bold text-lg",
                              item.discount && item.discount > 0 ? "text-emerald-500" : "text-primary"
                            )}>
                              ${(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}
                            </p>
                            {item.discount && item.discount > 0 && (
                              <p className="text-[10px] text-muted-foreground line-through">${item.price.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 mt-auto">
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wider">
                            {categories.find(c => c.id === item.categoryId)?.name}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 px-2">
                            Details <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Add New Item Placeholder */}
              <motion.div layout onClick={() => openItemModal()}>
                <Card className="border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-full flex flex-col items-center justify-center p-8 cursor-pointer group min-h-[280px]">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <h3 className="font-bold text-muted-foreground group-hover:text-primary">Add New Item</h3>
                  <p className="text-xs text-muted-foreground text-center mt-2">Create a new menu item for this category.</p>
                </Card>
              </motion.div>
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* Item Modal */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingItem ? 'update' : 'create'} a menu item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Classic Burger" 
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={itemCat} onValueChange={setItemCat}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the item..." 
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input 
                id="image" 
                placeholder="https://..." 
                value={itemImage}
                onChange={(e) => setItemImage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem}>Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your menu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cat-name">Category Name</Label>
              <Input 
                id="cat-name" 
                placeholder="e.g. Desserts" 
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-icon">Icon</Label>
              <Select value={catIcon} onValueChange={setCatIcon}>
                <SelectTrigger id="cat-icon">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Utensils">Utensils</SelectItem>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Pizza">Pizza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
