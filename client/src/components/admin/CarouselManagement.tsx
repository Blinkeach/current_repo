import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, ImageIcon, RefreshCw, Save, Trash2, Edit, Upload, Eye, EyeOff } from 'lucide-react';
import type { CarouselImage } from '@shared/schema';

const CarouselManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    bannerType: 'hero',
    displayOrder: 0,
    isActive: true
  });

  // Fetch carousel images
  const { data: carouselImages = [], isLoading, refetch } = useQuery<CarouselImage[]>({
    queryKey: ['/api/carousel-images']
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/carousel-images', {
        method: 'POST',
        body: data,
        credentials: 'include', // Use session cookies
      });
      
      if (!response.ok) {
        throw new Error(`Create failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Carousel image created successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/carousel-images'] });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create carousel image", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`/api/carousel-images/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include', // Use session cookies
      });
      
      if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Carousel image updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/carousel-images'] });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update carousel image", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/carousel-images/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Use session cookies
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Carousel image deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/carousel-images'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete carousel image", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      bannerType: 'hero',
      displayOrder: 0,
      isActive: true
    });
    setShowForm(false);
    setEditingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startEdit = (image: CarouselImage) => {
    setFormData({
      title: image.title,
      description: image.description || '',
      imageUrl: image.imageUrl,
      buttonText: image.buttonText || '',
      buttonLink: image.buttonLink || '',
      bannerType: image.bannerType || 'hero',
      displayOrder: image.displayOrder,
      isActive: image.isActive
    });
    setEditingImage(image);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await fetch('/api/uploads/images', {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include', // Use session cookies
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: result.url }));
      toast({ title: "Success", description: "Image uploaded successfully!" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl) {
      toast({ title: "Error", description: "Title and image are required", variant: "destructive" });
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ImageIcon className="h-6 w-6 text-blue-600" />
            </div>
            Carousel Management
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Manage homepage carousel images, titles, descriptions, and call-to-action buttons.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Carousel Image
          </Button>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingImage ? 'Edit' : 'Add New'} Carousel Image</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter carousel title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bannerType">Banner Type</Label>
                  <Select
                    value={formData.bannerType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, bannerType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select banner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero Slider</SelectItem>
                      <SelectItem value="promotional">Promotional Banner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter display order"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter carousel description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="e.g., Shop Now"
                  />
                </div>
                <div>
                  <Label htmlFor="buttonLink">Button Link</Label>
                  <Input
                    id="buttonLink"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                    placeholder="e.g., /shop"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Carousel Image *</Label>
                <div className="mt-2 space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    disabled={uploading}
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || uploading}
                  className="flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {editingImage ? 'Update' : 'Create'} Carousel Image
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Carousel Images List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Carousel Images</CardTitle>
          <CardDescription>
            {carouselImages.length} carousel image{carouselImages.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">Loading carousel images...</span>
            </div>
          ) : carouselImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Carousel Images</h3>
              <p className="text-gray-500 mb-6">Add your first carousel image to get started.</p>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Add First Carousel Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {carouselImages.map((image: CarouselImage) => (
                <div key={image.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-24 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                    )}
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      {image.buttonText && <span>Button: {image.buttonText}</span>}
                      <span>Order: {image.displayOrder}</span>
                      <span className={image.isActive ? 'text-green-600' : 'text-red-600'}>
                        {image.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(image)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteMutation.mutate(image.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CarouselManagement;