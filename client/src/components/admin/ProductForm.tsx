import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X, Upload, Image as ImageIcon, Box } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Create schema for form validation
const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  originalPrice: z.coerce
    .number()
    .positive({ message: "Original price must be positive" })
    .optional(),
  stock: z.coerce.number().nonnegative({ message: "Stock cannot be negative" }),
  quantityUnit: z.string().min(1, { message: "Please select a quantity unit" }),
  quantityPerUnit: z.coerce.number().positive({ message: "Quantity per unit must be positive" }),
  category: z.string().min(1, { message: "Please select a category" }),
  hsnCode: z.string().optional(),
  igst: z.coerce.number().min(0).max(100).default(0),
  sgst: z.coerce.number().min(0).max(100).default(0),
  cgst: z.coerce.number().min(0).max(100).default(0),
  images: z
    .array(z.string())
    .min(0, { message: "Images will be added during submission" }),
  highlights: z
    .array(z.string())
    .min(1, { message: "At least one highlight is required" }),
  colorSizeCombinations: z
    .array(z.object({
      color: z.string().min(1, "Color name is required"),
      colorValue: z.string().min(1, "Color value is required"),
      sizes: z.array(z.object({
        size: z.string().min(1, "Size name is required"),
        stock: z.coerce.number().nonnegative("Stock cannot be negative"),
        sku: z.preprocess(v => v === "" ? null : v, z.string().nullable().optional()),
      })).min(1, "At least one size is required for each color"),
    }))
    .optional()
    .default([]),
  rating: z.coerce
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating cannot exceed 5" })
    .optional(),
  reviewCount: z.coerce
    .number()
    .min(0, { message: "Review count cannot be negative" })
    .optional(),
  adminReviewCount: z.coerce
    .number()
    .min(0, { message: "Admin review count cannot be negative" })
    .optional(),
  model3d: z.object({
    url: z.string().optional(),
    type: z.string().optional(),
    scale: z.number().optional(),
  }).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    stock: number;
    quantityUnit?: string;
    quantityPerUnit?: number;
    category: string;
    hsnCode?: string;
    igst?: number;
    sgst?: number;
    cgst?: number;
    images: string[];
    highlights?: string[];
    specifications?: Record<string, string>;
    variants?: Array<{
      colorName: string;
      colorValue: string;
      sizeName: string;
      stock: number;
      sku?: string;
      images?: string[];
      price?: number;
    }>;
    colorSizeCombinations?: Array<{
      color: string;
      colorValue: string;
      sizes: Array<{
        size: string;
        stock: number;
        sku?: string;
      }>;
    }>;
    rating?: number;
    reviewCount?: number;
    adminReviewCount?: number;
    model3d?: {url?: string, type?: string, scale?: number};
  };
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >(
    product && product.specifications
      ? Object.entries(product.specifications).map(([key, value]) => ({
          key,
          value,
        }))
      : [{ key: "", value: "" }],
  );

  // Transform variants to colorSizeCombinations format for editing
  const transformVariantsToColorSizeCombinations = (variants?: Array<{
    colorName: string;
    colorValue: string;
    sizeName: string;
    stock: number;
    sku?: string;
  }>) => {
    if (!variants || variants.length === 0) return [];

    const colorMap = new Map<string, {
      color: string;
      colorValue: string;
      sizes: Array<{ size: string; stock: number; sku?: string }>;
    }>();

    variants.forEach(variant => {
      const key = `${variant.colorName}_${variant.colorValue}`;
      if (!colorMap.has(key)) {
        colorMap.set(key, {
          color: variant.colorName,
          colorValue: variant.colorValue,
          sizes: []
        });
      }
      colorMap.get(key)!.sizes.push({
        size: variant.sizeName,
        stock: variant.stock,
        sku: variant.sku
      });
    });

    return Array.from(colorMap.values());
  };

  // Get the colorSizeCombinations data - use existing or transform from variants
  const getInitialColorSizeCombinations = () => {
    if (product?.colorSizeCombinations) {
      return product.colorSizeCombinations;
    }
    if (product?.variants) {
      return transformVariantsToColorSizeCombinations(product.variants);
    }
    return [];
  };



  // Initialize the form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product ? product.price / 100 : 0, // Convert from paisa to rupees for display
      originalPrice: product?.originalPrice
        ? product.originalPrice / 100
        : undefined,
      stock: product?.stock || 0,
      quantityUnit: product?.quantityUnit || "pcs",
      quantityPerUnit: product?.quantityPerUnit || 1,
      category: product?.category || "",
      hsnCode: product?.hsnCode || "",
      igst: product?.igst || 0,
      sgst: product?.sgst || 0,
      cgst: product?.cgst || 0,
      images: product?.images || [], // No default empty image URL
      highlights: product?.highlights || [""],
      colorSizeCombinations: getInitialColorSizeCombinations(),
      rating: product?.rating || 0,
      reviewCount: product?.reviewCount || 0,
      adminReviewCount: product?.adminReviewCount || 0,
      model3d: product?.model3d || undefined,
    },
  });

  // Create or update product mutation
  const productMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Convert prices from rupees to paisa
      const formattedData = {
        ...data,
        price: Math.round(data.price * 100),
        originalPrice: data.originalPrice
          ? Math.round(data.originalPrice * 100)
          : undefined,

        specifications: specifications.reduce(
          (acc, { key, value }) => {
            if (key && value) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>,
        ),
      };

      if (product?.id) {
        // Update existing product
        const response = await apiRequest(
          "PUT",
          `/api/products/${product.id}`,
          formattedData,
        );
        return response.json();
      } else {
        // Create new product
        const response = await apiRequest(
          "POST",
          "/api/products",
          formattedData,
        );
        return response.json();
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Product mutation error:", error);
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      console.log("Form submission started with values:", values);
      console.log("Form errors:", form.formState.errors);
      console.log("Form valid:", form.formState.isValid);
      console.log("Highlights array:", form.getValues("highlights"));
      console.log("Color combinations:", values.colorSizeCombinations);
      console.log("Current color state:", colorSizeCombinations);
      console.log("Image uploads:", imageUploads.length);
      
      // Validate form before proceeding
      if (!form.formState.isValid) {
        console.log("Form validation failed");
        console.log("All form errors:", form.formState.errors);
        
        // Trigger form validation to show errors
        await form.trigger();
        
        toast({
          title: "Form Validation Error",
          description: "Please fill in all required fields before submitting.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if we're in edit mode (updating existing product)
      const isEditMode = !!product?.id;
      let finalImages: string[] = isEditMode ? [...existingImages] : [];
      
      // If there are image uploads, process them first
      if (imageUploads.length > 0) {
        console.log("Processing image uploads...");
        const uploadedImageUrls = await uploadImages();
        if (uploadedImageUrls.length > 0) {
          // Add uploaded image URLs to existing URLs (if in edit mode)
          finalImages = [...finalImages, ...uploadedImageUrls];
        }
      }
      
      // Handle 3D model upload (optional)
      let final3dModel = isEditMode ? product?.model3d : undefined;
      if (model3dUpload) {
        console.log("Processing 3D model upload...");
        const uploaded3dModelUrl = await upload3dModel();
        if (uploaded3dModelUrl) {
          final3dModel = {
            url: uploaded3dModelUrl,
            type: model3dUpload.name.split('.').pop()?.toLowerCase() || 'glb',
            scale: 1.0
          };
        }
      }
      
      // Ensure we have images (either from upload or existing ones in edit mode)
      if (finalImages.length === 0 && imageUploads.length === 0) {
        console.log("No images found, showing error");
        toast({
          title: "Image Required",
          description: "Please upload at least one product image before creating the product.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the images and 3D model values
      values.images = finalImages;
      values.model3d = final3dModel;



      // Clean up color-size combinations - remove empty entries
      const cleanedColorCombinations = colorSizeCombinations
        .filter(combination => combination.color.trim() && combination.colorValue)
        .map(combination => ({
          ...combination,
          sizes: combination.sizes
            .filter(size => size.size.trim() && size.stock >= 0)
            .map(size => ({
              ...size,
              sku: size.sku == null ? null : (typeof size.sku === 'string' ? size.sku.trim() : String(size.sku)).trim() || null
            }))
        }))
        .filter(combination => combination.sizes.length > 0);

      // Update color-size combinations in form values
      values.colorSizeCombinations = cleanedColorCombinations;

      console.log("Final submission data:", {
        colorSizeCombinations: values.colorSizeCombinations
      });

      // Submit the form with updated values
      productMutation.mutate(values);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting the form.",
        variant: "destructive",
      });
    }
  };

  // State for existing images management
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  
  // State for image uploads
  const [imageUploads, setImageUploads] = useState<
    { file: File; preview: string }[]
  >([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for 3D model uploads
  const [model3dUpload, setModel3dUpload] = useState<File | null>(null);
  const [uploading3dModel, setUploading3dModel] = useState(false);
  const model3dInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // State for color-size combinations management
  const [colorSizeCombinations, setColorSizeCombinations] = useState<Array<{
    color: string;
    colorValue: string;
    sizes: Array<{
      size: string;
      stock: number;
      sku?: string;
    }>;
  }>>(getInitialColorSizeCombinations());

  // Functions for managing color-size combinations
  const addColorCombination = () => {
    const newCombination = {
      color: '',
      colorValue: '#000000',
      sizes: [{ size: '', stock: 0, sku: '' }]
    };
    const updatedCombinations = [...colorSizeCombinations, newCombination];
    setColorSizeCombinations(updatedCombinations);
    form.setValue('colorSizeCombinations', updatedCombinations);
  };

  const removeColorCombination = (colorIndex: number) => {
    const updatedCombinations = colorSizeCombinations.filter((_, i) => i !== colorIndex);
    setColorSizeCombinations(updatedCombinations);
    form.setValue('colorSizeCombinations', updatedCombinations);
  };

  const updateColorCombination = (colorIndex: number, field: string, value: string) => {
    const updatedCombinations = colorSizeCombinations.map((combination, i) => 
      i === colorIndex ? { ...combination, [field]: value } : combination
    );
    setColorSizeCombinations(updatedCombinations);
    form.setValue('colorSizeCombinations', updatedCombinations);
  };

  const addSizeToColor = (colorIndex: number) => {
    const updatedCombinations = colorSizeCombinations.map((combination, i) => 
      i === colorIndex ? {
        ...combination,
        sizes: [...combination.sizes, { size: '', stock: 0, sku: '' }]
      } : combination
    );
    setColorSizeCombinations(updatedCombinations);
    form.setValue('colorSizeCombinations', updatedCombinations);
  };

  const removeSizeFromColor = (colorIndex: number, sizeIndex: number) => {
    const updatedCombinations = colorSizeCombinations.map((combination, i) => 
      i === colorIndex ? {
        ...combination,
        sizes: combination.sizes.filter((_, j) => j !== sizeIndex)
      } : combination
    );
    setColorSizeCombinations(updatedCombinations);
    form.setValue('colorSizeCombinations', updatedCombinations);
  };

  const updateSizeInColor = (colorIndex: number, sizeIndex: number, field: string, value: string | number) => {
    const updatedCombinations = colorSizeCombinations.map((combination, i) => 
      i === colorIndex ? {
        ...combination,
        sizes: combination.sizes.map((size, j) => 
          j === sizeIndex ? { ...size, [field]: value } : size
        )
      } : combination
    );
    setColorSizeCombinations(updatedCombinations);
    form.setValue('colorSizeCombinations', updatedCombinations);
  };

  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#008000', 'Black': '#000000',
      'White': '#FFFFFF', 'Yellow': '#FFFF00', 'Orange': '#FFA500', 'Purple': '#800080',
      'Pink': '#FFC0CB', 'Gray': '#808080', 'Brown': '#A52A2A', 'Navy': '#000080',
      'Maroon': '#800000', 'Olive': '#808000', 'Lime': '#00FF00', 'Aqua': '#00FFFF',
      'Teal': '#008080', 'Silver': '#C0C0C0', 'Fuchsia': '#FF00FF'
    };
    return colorMap[colorName] || '#000000';
  };



  // Existing image management functions
  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
    toast({
      title: "Image removed",
      description: "The image will be removed when you save the product.",
    });
  };

  // Handle file select for image upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map((file) => {
        // Create file preview
        const preview = URL.createObjectURL(file);
        return { file, preview };
      });
      setImageUploads([...imageUploads, ...newFiles]);
    }
  };

  // Remove uploaded image preview
  const removeUploadedImage = (index: number) => {
    setImageUploads((prev) => {
      const newUploads = [...prev];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newUploads[index].preview);
      newUploads.splice(index, 1);
      return newUploads;
    });
  };

  // Upload images to server
  const uploadImages = async (): Promise<string[]> => {
    if (imageUploads.length === 0) {
      return [];
    }

    setUploadingImages(true);

    try {
      // If there's only one image, use single upload endpoint
      if (imageUploads.length === 1) {
        const formData = new FormData();
        formData.append("image", imageUploads[0].file);

        const response = await fetch("/api/uploads/images", {
          method: "POST",
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }

        const data = await response.json();

        // Clear uploads after successful upload
        imageUploads.forEach((upload) => URL.revokeObjectURL(upload.preview));
        setImageUploads([]);

        return [data.url];
      }
      // For multiple images, use the batch upload endpoint
      else {
        const formData = new FormData();
        imageUploads.forEach((upload) => {
          formData.append("images", upload.file);
        });

        const response = await fetch("/api/uploads/multiple-images", {
          method: "POST",
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to upload images: ${response.statusText}`);
        }

        const data = await response.json();
        const urls = data.files.map((file: { url: string }) => file.url);

        // Clear uploads after successful upload
        imageUploads.forEach((upload) => URL.revokeObjectURL(upload.preview));
        setImageUploads([]);

        return urls;
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload one or more images. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  // 3D Model upload function
  const upload3dModel = async (): Promise<string | null> => {
    if (!model3dUpload) return null;

    setUploading3dModel(true);
    try {
      const formData = new FormData();
      formData.append("model", model3dUpload);

      const response = await fetch("/api/uploads/model3d", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to upload 3D model");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("3D model upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload 3D model. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading3dModel(false);
    }
  };

  // Handle 3D model file selection
  const handle3dModelSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type (accept common 3D model formats)
      const allowedTypes = ['.glb', '.gltf', '.obj', '.fbx', '.dae'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid 3D model file (.glb, .gltf, .obj, .fbx, .dae)",
          variant: "destructive",
        });
        return;
      }

      setModel3dUpload(file);
    }
  };

  // Add/remove highlight points
  const addHighlightField = () => {
    const currentHighlights = form.getValues("highlights");
    form.setValue("highlights", [...currentHighlights, ""]);
  };

  const removeHighlightField = (index: number) => {
    const currentHighlights = form.getValues("highlights");
    if (currentHighlights.length > 1) {
      form.setValue(
        "highlights",
        currentHighlights.filter((_, i) => i !== index),
      );
    }
  };

  // Add/remove specification fields
  const addSpecificationField = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecificationField = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const updateSpecificationKey = (index: number, key: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index].key = key;
    setSpecifications(newSpecifications);
  };

  const updateSpecificationValue = (index: number, value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index].value = value;
    setSpecifications(newSpecifications);
  };

  // Available categories
  const categories = [
    "Home",
    "Home & Office",
    "Arts & Craft",
    "Electronics",
    "Fashion",
    "Appliances",
    "Toy",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hsnCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN Code (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter HSN code (e.g., 85234910)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    HSN (Harmonized System of Nomenclature) code for tax classification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">GST Configuration</h4>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="igst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Integrated GST rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sgst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SGST/UTGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        State/UT GST rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cgst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Central GST rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (₹) (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Set this higher than the actual price to show discount.
                      Discount percentage will be automatically calculated.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Quantity Unit Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantityUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit of Measurement</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="grams">Grams (g)</SelectItem>
                          <SelectItem value="liters">Liters (L)</SelectItem>
                          <SelectItem value="ml">Milliliters (ml)</SelectItem>
                          <SelectItem value="count">Count</SelectItem>
                          <SelectItem value="set">Set</SelectItem>
                          <SelectItem value="pack">Pack</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                          <SelectItem value="meters">Meters (m)</SelectItem>
                          <SelectItem value="feet">Feet (ft)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Select the unit of measurement for this product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantityPerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity per Unit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        e.g., 1 for single item, 5 for 5kg pack, 12 for dozen
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">
                Default Rating and Reviews
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Rating (0-5)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            placeholder="0.0"
                            {...field}
                            value={field.value || 0}
                          />
                          <div className="flex text-green-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className="cursor-pointer"
                                onClick={() => field.onChange(star)}
                              >
                                {star <= (field.value || 0) ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                    />
                                  </svg>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Reviews Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          value={field.value || 0}
                          readOnly
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        This is automatically calculated from user reviews
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminReviewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Review Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Base review count set by admin (e.g., 100). This will be added to actual user reviews.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-gray-500">
                The admin review count is added to actual user reviews to show total reviews. 
                For example: Admin Count (100) + User Reviews (1) = Total (101) reviews shown.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Product Images</FormLabel>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.multiple = false;
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Upload Single Image
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.multiple = true;
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <ImageIcon className="h-4 w-4 mr-1" /> Add Multiple Images
                  </Button>
                </div>
              </div>

              {/* Existing Images Management */}
              {product && existingImages.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Current Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={imageUrl}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/api/placeholder-image';
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
              />

              {/* Image upload previews */}
              {imageUploads.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUploads.map((upload, index) => (
                    <div key={index} className="relative group">
                      <div className="border rounded-md overflow-hidden h-24 flex items-center justify-center bg-gray-50">
                        <img
                          src={upload.preview}
                          alt={`Upload preview ${index + 1}`}
                          className="object-contain h-full w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-70"
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </button>
                      <span className="text-xs text-gray-500 truncate block mt-1">
                        {upload.file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Display already saved images (for edit mode) */}
              {product && product.images && product.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Saved Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="border rounded-md overflow-hidden h-24 flex items-center justify-center bg-gray-50">
                          <img
                            src={imageUrl}
                            alt={`Product image ${index + 1}`}
                            className="object-contain h-full w-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/200x150?text=Error";
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 truncate block mt-1">
                          Saved image {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3D Model Upload Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>3D Model (Optional)</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => model3dInputRef.current?.click()}
              disabled={uploading3dModel}
            >
              <Upload className="h-4 w-4 mr-1" />
              {uploading3dModel ? "Uploading..." : "Upload 3D Model"}
            </Button>
          </div>

          {/* Hidden 3D model file input */}
          <input
            type="file"
            ref={model3dInputRef}
            onChange={handle3dModelSelect}
            accept=".glb,.gltf,.obj,.fbx,.dae"
            className="hidden"
          />

          {/* 3D Model upload preview */}
          {model3dUpload && (
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Box className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{model3dUpload.name}</p>
                    <p className="text-xs text-gray-500">
                      {(model3dUpload.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setModel3dUpload(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Current 3D model (in edit mode) */}
          {product?.model3d?.url && !model3dUpload && (
            <div className="border rounded-md p-4 bg-green-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  <Box className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Current 3D Model</p>
                  <p className="text-xs text-gray-500">
                    Type: {product.model3d.type?.toUpperCase() || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <FormDescription className="text-xs">
            Upload a 3D model file (.glb, .gltf, .obj, .fbx, .dae) to enable 3D product preview for customers.
          </FormDescription>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Product Highlights</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHighlightField}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Highlight
            </Button>
          </div>
          {form.getValues("highlights").map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`highlights.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter a key feature or highlight"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeHighlightField(index)}
                disabled={form.getValues("highlights").length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Specifications</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpecificationField}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Specification
            </Button>
          </div>
          {specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  placeholder="Specification (e.g. Display)"
                  value={spec.key}
                  onChange={(e) =>
                    updateSpecificationKey(index, e.target.value)
                  }
                />
                <Input
                  placeholder="Value (e.g. 6.7-inch FHD+)"
                  value={spec.value}
                  onChange={(e) =>
                    updateSpecificationValue(index, e.target.value)
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeSpecificationField(index)}
                disabled={specifications.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Color-Size Combinations Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Color & Size Management</h3>
            <Button
              type="button"
              onClick={addColorCombination}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Color
            </Button>
          </div>

          {colorSizeCombinations.map((combination, colorIndex) => (
            <Card key={colorIndex} className="p-4">
              <div className="space-y-4">
                {/* Color Header */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Color Name</Label>
                    <Input
                      value={combination.color || ''}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        
                        // Update the color name immediately
                        const updatedCombinations = [...colorSizeCombinations];
                        updatedCombinations[colorIndex] = {
                          ...updatedCombinations[colorIndex],
                          color: newValue
                        };
                        
                        // Auto-set color value based on name
                        if (newValue) {
                          const colorValue = getColorValue(newValue);
                          updatedCombinations[colorIndex].colorValue = colorValue;
                        }
                        
                        setColorSizeCombinations(updatedCombinations);
                        form.setValue('colorSizeCombinations', updatedCombinations);
                      }}
                      placeholder="e.g., Red, Stone, Blue"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Color Value (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={combination.colorValue}
                        onChange={(e) => updateColorCombination(colorIndex, 'colorValue', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={combination.colorValue}
                        onChange={(e) => updateColorCombination(colorIndex, 'colorValue', e.target.value)}
                        placeholder="#FF0000"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeColorCombination(colorIndex)}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sizes for this color */}
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Sizes for {combination.color || 'this color'}</Label>
                    <Button
                      type="button"
                      onClick={() => addSizeToColor(colorIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add Size
                    </Button>
                  </div>

                  {combination.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="flex items-center gap-2">
                      <Input
                        placeholder="Size (e.g., L, XL, 8mm, 12mm)"
                        value={size.size}
                        onChange={(e) => updateSizeInColor(colorIndex, sizeIndex, 'size', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Stock"
                        value={size.stock}
                        onChange={(e) => updateSizeInColor(colorIndex, sizeIndex, 'stock', parseInt(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                      />
                      <Input
                        placeholder="SKU (optional)"
                        value={size.sku ?? ''}
                        onChange={(e) => updateSizeInColor(colorIndex, sizeIndex, 'sku', e.target.value)}
                        className="w-32"
                      />
                      <Button
                        type="button"
                        onClick={() => removeSizeFromColor(colorIndex, sizeIndex)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {combination.sizes.length === 0 && (
                    <p className="text-sm text-muted-foreground">No sizes added yet. Click "Add Size" to start.</p>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {colorSizeCombinations.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No color variants configured yet.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add colors with specific sizes (e.g., Red: L, M, XL or Stone: 5mm, 8mm, 12mm)
              </p>
              <Button
                type="button"
                onClick={addColorCombination}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Color
              </Button>
            </Card>
          )}
        </div>



        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            type="submit"
            disabled={productMutation.isPending || uploadingImages || uploading3dModel}
            className="min-w-[120px]"
            onClick={() => {
              // Debug what's preventing submission
              console.log("Create Product button clicked");
              console.log("Form valid:", form.formState.isValid);
              console.log("Form errors:", form.formState.errors);
              console.log("Highlights:", form.getValues("highlights"));
              console.log("Image uploads:", imageUploads.length);
              
              // Check for missing required fields
              const currentHighlights = form.getValues("highlights");
              if (currentHighlights.length === 0 || (currentHighlights.length === 1 && currentHighlights[0] === "")) {
                toast({
                  title: "Missing Product Highlights",
                  description: "Please add at least one product highlight before creating the product.",
                  variant: "destructive",
                });
                return;
              }
              
              if (imageUploads.length === 0 && (!product || !product.images || product.images.length === 0)) {
                toast({
                  title: "Missing Product Images",
                  description: "Please upload at least one product image before creating the product.",
                  variant: "destructive",
                });
                return;
              }
            }}
          >
            {productMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {product ? "Updating..." : "Creating..."}
              </>
            ) : uploadingImages ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading Images...
              </>
            ) : uploading3dModel ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading 3D Model...
              </>
            ) : (
              product ? "Update Product" : "Create Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
