import { useParams, useLocation, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { insertPoetrySchema, type Poetry } from '@shared/schema';
import { useState, useEffect } from 'react';

const poetryFormSchema = insertPoetrySchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  author: z.string().min(2, 'Author name is required'),
  published: z.boolean().default(true),
  imageUrl: z.string().optional(),
  titleHi: z.string().optional(),
  contentHi: z.string().optional(),
  excerptHi: z.string().optional(),
  authorHi: z.string().optional(),
  createdBy: z.string().optional(),
});

type PoetryFormData = z.infer<typeof poetryFormSchema>;

export default function PoetryForm() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!id;

  const { data: poetry, isLoading } = useQuery<Poetry>({
    queryKey: [`/api/admin/poetry/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/admin/poetry/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch poetry');
      return response.json();
    },
    enabled: isEditMode,
  });

  const form = useForm<PoetryFormData>({
    resolver: zodResolver(poetryFormSchema),
    defaultValues: {
      title: '',
      titleHi: '',
      content: '',
      contentHi: '',
      excerpt: '',
      excerptHi: '',
      author: '',
      authorHi: '',
      imageUrl: '',
      published: true,
    },
  });

  useEffect(() => {
    if (poetry && !form.formState.isDirty) {
      form.reset({
        title: poetry.title,
        titleHi: poetry.titleHi || '',
        content: poetry.content,
        contentHi: poetry.contentHi || '',
        excerpt: poetry.excerpt,
        excerptHi: poetry.excerptHi || '',
        author: poetry.author,
        authorHi: poetry.authorHi || '',
        imageUrl: poetry.imageUrl || '',
        published: poetry.published ?? true,
      });
      if (poetry.imageUrl) setImagePreview(poetry.imageUrl);
    }
  }, [poetry?.id]);

  const createMutation = useMutation({
    mutationFn: async (data: PoetryFormData) => {
      const response = await fetch('/api/admin/poetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create poetry');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/poetry'] });
      queryClient.invalidateQueries({ queryKey: ['/api/poetry'] });
      toast({ title: 'Poetry Created', description: 'The poetry has been created successfully.' });
      navigate('/admin/poetry');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PoetryFormData) => {
      const response = await fetch(`/api/admin/poetry/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update poetry');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/poetry'] });
      queryClient.invalidateQueries({ queryKey: ['/api/poetry'] });
      toast({ title: 'Poetry Updated', description: 'The poetry has been updated successfully.' });
      navigate('/admin/poetry');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File Too Large', description: 'Please select an image under 5MB', variant: 'destructive' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid File Type', description: 'Please select an image file', variant: 'destructive' });
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      form.setValue('imageUrl', data.url, { shouldDirty: true });
      toast({ title: 'Image Uploaded', description: 'Image uploaded successfully' });
    } catch (error) {
      toast({ title: 'Upload Failed', description: error instanceof Error ? error.message : 'Failed to upload image', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: PoetryFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoading) {
    return <div className="container mx-auto px-6 py-8"><p className="text-2xl text-muted-foreground">Loading poetry data...</p></div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Link href="/admin/poetry">
        <Button variant="outline" className="mb-6" data-testid="button-back-to-poetry">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Poetry
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{isEditMode ? 'Edit Poetry' : 'Create New Poetry'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter poetry title in English" {...field} className="text-base" data-testid="input-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="titleHi" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title (Hindi)</FormLabel>
                  <FormControl>
                    <Input placeholder="कविता शीर्षक हिंदी में दर्ज करें" {...field} className="text-base" data-testid="input-title-hi" />
                  </FormControl>
                  <FormDescription className="text-base">Optional - Provide Hindi translation</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="author" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Author (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} className="text-base" data-testid="input-author" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="authorHi" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Author (Hindi)</FormLabel>
                  <FormControl>
                    <Input placeholder="लेखक का नाम हिंदी में" {...field} className="text-base" data-testid="input-author-hi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Excerpt (English) *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief excerpt or first few lines" rows={3} {...field} className="text-base" data-testid="textarea-excerpt" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="excerptHi" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Excerpt (Hindi)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="संक्षिप्त अंश या पहली पंक्तियाँ" rows={3} {...field} className="text-base" data-testid="textarea-excerpt-hi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Full Poetry (English) *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Complete poem or kavita" rows={16} {...field} className="text-base font-serif" data-testid="textarea-content" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="contentHi" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Full Poetry (Hindi)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="पूर्ण कविता हिंदी में" rows={16} {...field} className="text-base font-serif" data-testid="textarea-content-hi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="space-y-4">
                <FormLabel className="text-lg">Featured Image</FormLabel>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()} disabled={isUploading} data-testid="button-upload-image">
                    <Upload className="h-5 w-5 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <span className="text-base text-muted-foreground">Max size: 5MB</span>
                </div>
                {imagePreview && <div className="mt-4"><img src={imagePreview} alt="Preview" className="max-w-md h-auto rounded-lg border" /></div>}
              </div>

              <FormField control={form.control} name="published" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-lg">Publish Poetry</FormLabel>
                    <FormDescription className="text-base">Make this poetry visible to the public</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-published" />
                  </FormControl>
                </FormItem>
              )} />

              <div className="flex gap-4 pt-4">
                <Button type="submit" size="lg" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-poetry">
                  <Save className="h-5 w-5 mr-2" />
                  {isEditMode ? 'Update Poetry' : 'Create Poetry'}
                </Button>
                <Link href="/admin/poetry">
                  <Button type="button" variant="outline" size="lg" data-testid="button-cancel">Cancel</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
