import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Link as LinkIcon, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import CarouselManagement from './CarouselManagement';

interface NavbarSettings {
  id?: number;
  logoImage: string;
  redirectLink: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const NavbarSettings: React.FC = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [redirectLink, setRedirectLink] = useState<string>('/');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current navbar settings
  const { data: currentSettings, isLoading } = useQuery<NavbarSettings>({
    queryKey: ['/api/navbar-settings']
  });

  // Update state when data loads
  React.useEffect(() => {
    if (currentSettings) {
      setRedirectLink(currentSettings.redirectLink || '/');
      setLogoPreview(currentSettings.logoImage);
    }
  }, [currentSettings]);

  // Update navbar settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/navbar-settings', {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update navbar settings');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/navbar-settings'] });
      toast({
        title: "Settings Updated",
        description: "Navbar settings have been updated successfully.",
      });
      setLogoFile(null);
      setUploading(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
      setUploading(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    
    if (logoFile) {
      formData.append('logoImage', logoFile);
    } else if (currentSettings?.logoImage) {
      formData.append('logoImage', currentSettings.logoImage);
    }
    
    formData.append('redirectLink', redirectLink);

    updateSettingsMutation.mutate(formData);
  };

  const resetToDefault = () => {
    setRedirectLink('/');
    setLogoFile(null);
    setLogoPreview('');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading navbar settings...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <ImageIcon className="h-6 w-6 text-blue-600" />
          </div>
          Navbar Configuration
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Customize your website's navigation bar logo and configure user redirect settings for enhanced branding and user experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Image Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ImageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <Label htmlFor="logo" className="text-lg font-semibold text-gray-900">
                  Brand Logo
                </Label>
                <p className="text-sm text-gray-500 mt-1">Upload your company logo for the navigation bar</p>
              </div>
            </div>
            
            {/* Current/Preview Logo */}
            {(logoPreview || currentSettings?.logoImage) && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-center space-x-6">
                  <div className="relative w-32 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={logoPreview || currentSettings?.logoImage}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder-image';
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Current Logo</p>
                    <p className="text-xs text-gray-500 mt-1">Displayed in navigation bar</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="default"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
              >
                <Upload className="h-4 w-4" />
                Upload New Logo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetToDefault}
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Default
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {logoFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">
                    Ready to upload: {logoFile.name}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">Click "Save Settings" to apply the new logo</p>
              </div>
            )}
          </div>

          {/* Redirect Link Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <LinkIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <Label htmlFor="redirectLink" className="text-lg font-semibold text-gray-900">
                  Logo Click Destination
                </Label>
                <p className="text-sm text-gray-500 mt-1">Set where users go when they click your logo</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <Input
                id="redirectLink"
                type="text"
                value={redirectLink}
                onChange={(e) => setRedirectLink(e.target.value)}
                placeholder="Enter redirect URL (e.g., /, /home, /products)"
                className="w-full text-base py-3 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-start gap-2 mt-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <div className="text-sm text-gray-600">
                  <strong>Current setting:</strong> Users clicking the navbar logo will be redirected to <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">{redirectLink || '/'}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Changes will be applied immediately after saving
              </div>
              <Button
                type="submit"
                disabled={uploading || updateSettingsMutation.isPending}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-base font-medium"
              >
                {uploading || updateSettingsMutation.isPending ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {uploading || updateSettingsMutation.isPending ? 'Applying Changes...' : 'Save Configuration'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Main component that includes both navbar and carousel management
const NavbarSettingsWithCarousel: React.FC = () => {
  return (
    <div className="space-y-8">
      <NavbarSettings />
      <CarouselManagement />
    </div>
  );
};

export default NavbarSettingsWithCarousel;