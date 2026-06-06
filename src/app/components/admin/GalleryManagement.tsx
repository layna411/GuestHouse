import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { GalleryImage } from '../../types';
import { galleryApi } from '../../services/api';
import { toast } from 'sonner';

export function GalleryManagement() {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await galleryApi.getAll();
      setPhotos(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to retrieve photo gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file to upload.');
      return;
    }

    setAdding(true);
    try {
      // 1. Upload file to static folder via backend
      const uploadRes = await galleryApi.upload(selectedFile);
      
      // 2. Add dynamic URL to database
      const newPhoto = await galleryApi.add(uploadRes.imageUrl, caption);
      setPhotos(prev => [...prev, newPhoto]);
      setSelectedFile(null);
      setCaption('');
      
      // Reset input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast.success('Photo uploaded and added to gallery successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (!confirm('Are you sure you want to remove this photo from the website showcase?')) return;
    try {
      await galleryApi.delete(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      toast.success('Photo removed from gallery successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete photo.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Gallery Photo Management</h1>
          <p className="text-muted-foreground">Manage the photos displayed in the Saveetha Guest House gallery showcase</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchGallery} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Reload
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Add Photo Form */}
        <Card glass className="lg:col-span-1 h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-accent" />
              <CardTitle>Add New Photo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div>
                <label className="block mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="glass-input w-full px-3 py-2 text-sm text-foreground bg-input-background file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:cursor-pointer"
                  required
                />
              </div>
              <p className="text-[10px] text-muted-foreground -mt-2">
                Supported formats: JPG, PNG, WEBP, GIF. Upload limit: 5MB.
              </p>

              <Input
                label="Caption / Label (Optional)"
                name="caption"
                placeholder="Executive Suite Lounge Area"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />

              <Button type="submit" variant="primary" className="w-full font-bold flex items-center justify-center gap-1.5" disabled={adding}>
                <Plus className="w-4 h-4" />
                {adding ? 'Adding...' : 'Add Image to Website'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Photos Showcase Grid */}
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Gallery Photos ({photos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-900 border border-border/40">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || 'Gallery Image'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Delete overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-2 bg-destructive/90 hover:bg-destructive text-white rounded-lg transition-colors cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold text-white truncate">{photo.caption || 'Saveetha Guest House'}</p>
                        <p className="text-[9px] text-slate-300 truncate font-mono mt-0.5">{photo.imageUrl}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && photos.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No photos currently in the gallery. Use the form on the left to add photos!
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
