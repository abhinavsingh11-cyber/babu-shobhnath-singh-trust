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
import { insertBlogSchema, type Blog } from '@shared/schema';
import { useState, useEffect } from 'react';

const blogFormSchema = insertBlogSchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  author: z.string().min(2, 'Author name is required'),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean().default(true),
  imageUrl: z.string().optional(),
  titleHi: z.string().optional(),
  contentHi: z.string().optional(),
  excerptHi: z.string().optional(),
  createdBy: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

export default function BlogForm() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!id;

  const { data: blog, isLoading } = useQuery<Blog>({
    queryKey: [`/api/admin/blogs/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch blog');
      return response.json();
    },
    enabled: isEditMode,
  });

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      titleHi: '',
      content: '',
      contentHi: '',
      excerpt: '',
      excerptHi: '',
      category: '',
      author: '',
      imageUrl: '',
      published: true,
    },
  });

  useEffect(() => {
    if (blog && !form.formState.isDirty) {
      form.reset({
        title: blog.title,
        titleHi: blog.titleHi || '',
        content: blog.content,
        contentHi: blog.contentHi || '',
        excerpt: blog.excerpt,
        excerptHi: blog.excerptHi || '',
        category: blog.category,
        author: blog.author,
        imageUrl: blog.imageUrl || '',
        published: blog.published ?? true,
      });
      if (blog.imageUrl) setImagePreview(blog.imageUrl);
    }
  }, [blog?.id]);

  const createMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create blog');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blogs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({ title: 'Blog Created', description: 'The blog has been created successfully.' });
      navigate('/admin/blogs');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update blog');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blogs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({ title: 'Blog Updated', description: 'The blog has been updated successfully.' });
      navigate('/admin/blogs');
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

  const onSubmit = (data: BlogFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoading) {
    return <div className="container mx-auto px-6 py-8"><p className="text-2xl text-muted-foreground">Loading blog data...</p></div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Link href="/admin/blogs">
        <Button variant="outline" className="mb-6" data-testid="button-back-to-blogs">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Blogs
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{isEditMode ? 'Edit Blog' : 'Create New Blog'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog title in English" {...field} className="text-base" data-testid="input-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="titleHi" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title (Hindi)</FormLabel>
                  <FormControl>
                    <Input placeholder="ब्लॉग शीर्षक हिंदी में दर्ज करें" {...field} className="text-base" data-testid="input-title-hi" />
                  </FormControl>
                  <FormDescription className="text-base">Optional - Provide Hindi translation</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="author" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Author *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} className="text-base" data-testid="input-author" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Category *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Literature, Education, Culture" {...field} className="text-base" data-testid="input-category" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Excerpt (English) *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief summary of the blog (shown in listings)" rows={3} {...field} className="text-base" data-testid="textarea-excerpt" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="excerptHi" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Excerpt (Hindi)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="संक्षिप्त सारांश हिंदी में" rows={3} {...field} className="text-base" data-testid="textarea-excerpt-hi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Content (English) *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full blog content" rows={12} {...field} className="text-base" data-testid="textarea-content" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="contentHi" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Content (Hindi)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="पूर्ण सामग्री हिंदी में" rows={12} {...field} className="text-base" data-testid="textarea-content-hi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="space-y-4">
                <FormLabel className="text-lg">Blog Image</FormLabel>
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
                    <FormLabel className="text-lg">Publish Blog</FormLabel>
                    <FormDescription className="text-base">Make this blog visible to the public</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-published" />
                  </FormControl>
                </FormItem>
              )} />

              <div className="flex gap-4 pt-4">
                <Button type="submit" size="lg" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-blog">
                  <Save className="h-5 w-5 mr-2" />
                  {isEditMode ? 'Update Blog' : 'Create Blog'}
                </Button>
                <Link href="/admin/blogs">
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
