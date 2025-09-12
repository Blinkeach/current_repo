import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Edit, Plus, Save, X, Image as ImageIcon } from "lucide-react";

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HeroSlideForm {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  isActive: boolean;
  imageFile?: File;
}

export default function HeroSlidesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<HeroSlideForm>({
    title: "",
    description: "",
    imageUrl: "",
    buttonText: "",
    buttonLink: "",
    displayOrder: 0,
    isActive: true
  });

  // Fetch hero slides
  const { data: heroSlides = [], isLoading } = useQuery({
    queryKey: ["/api/hero-slides"],
  });

  // Create hero slide mutation
  const createSlideMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("/api/hero-slides", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({ title: "Success", description: "Hero slide created successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to create hero slide: ${error.message}`,
        variant: "destructive" 
      });
    },
  });

  // Update hero slide mutation
  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await apiRequest(`/api/hero-slides/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({ title: "Success", description: "Hero slide updated successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to update hero slide: ${error.message}`,
        variant: "destructive" 
      });
    },
  });

  // Delete hero slide mutation
  const deleteSlideMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-slides"] });
      toast({ title: "Success", description: "Hero slide deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to delete hero slide: ${error.message}`,
        variant: "destructive" 
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      displayOrder: 0,
      isActive: true
    });
    setEditingSlide(null);
    setIsCreating(false);
  };

  const startCreating = () => {
    resetForm();
    setIsCreating(true);
  };

  const startEditing = (slide: HeroSlide) => {
    setFormData({
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      displayOrder: slide.displayOrder,
      isActive: slide.isActive
    });
    setEditingSlide(slide);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('buttonText', formData.buttonText);
    formDataToSend.append('buttonLink', formData.buttonLink);
    formDataToSend.append('displayOrder', formData.displayOrder.toString());
    formDataToSend.append('isActive', formData.isActive.toString());
    
    if (formData.imageFile) {
      formDataToSend.append('image', formData.imageFile);
    } else if (formData.imageUrl) {
      formDataToSend.append('imageUrl', formData.imageUrl);
    }

    if (editingSlide) {
      updateSlideMutation.mutate({ id: editingSlide.id, data: formDataToSend });
    } else {
      createSlideMutation.mutate(formDataToSend);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl: "" }));
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading hero slides...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hero Slides Management</h2>
        <Button onClick={startCreating} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Slide
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingSlide) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSlide ? "Edit Hero Slide" : "Create New Hero Slide"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buttonLink">Button Link</Label>
                  <Input
                    id="buttonLink"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                    placeholder="/shop"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Hero Image</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {!formData.imageFile && (
                    <>
                      <div className="text-sm text-muted-foreground">Or enter image URL:</div>
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createSlideMutation.isPending || updateSlideMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingSlide ? "Update" : "Create"} Slide
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Hero Slides List */}
      <div className="grid gap-4">
        {heroSlides.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hero slides found. Create your first slide!</p>
            </CardContent>
          </Card>
        ) : (
          heroSlides.map((slide: HeroSlide) => (
            <Card key={slide.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-32 h-20 object-cover rounded-lg border"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{slide.title}</h3>
                        <p className="text-muted-foreground text-sm">{slide.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={slide.isActive ? "default" : "secondary"}>
                          {slide.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">Order: {slide.displayOrder}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Button:</span> {slide.buttonText} → {slide.buttonLink}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(slide)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSlideMutation.mutate(slide.id)}
                          disabled={deleteSlideMutation.isPending}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}