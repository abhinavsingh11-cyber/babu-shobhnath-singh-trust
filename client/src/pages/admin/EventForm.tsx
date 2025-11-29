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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { insertEventSchema, type Event } from '@shared/schema';
import { useState, useEffect } from 'react';

// Extend the insert schema for form validation
const eventFormSchema = insertEventSchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(3, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  category: z.enum(['literature', 'education', 'culture', 'social'], {
    required_error: 'Please select a category',
  }),
  published: z.boolean().default(true),
  imageUrl: z.string().optional(),
  titleHi: z.string().optional(),
  descriptionHi: z.string().optional(),
  locationHi: z.string().optional(),
  createdBy: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

export default function EventForm() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!id;

  // Fetch event data if editing
  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/admin/events/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/admin/events/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      return response.json();
    },
    enabled: isEditMode,
  });

  // Form setup
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      titleHi: '',
      description: '',
      descriptionHi: '',
      category: 'literature',
      date: new Date().toISOString().split('T')[0],
      location: '',
      locationHi: '',
      imageUrl: '',
      published: true,
    },
  });

  // Update form when event data loads (useEffect to avoid infinite re-renders)
  useEffect(() => {
    if (event && !form.formState.isDirty) {
      form.reset({
        title: event.title,
        titleHi: event.titleHi || '',
        description: event.description,
        descriptionHi: event.descriptionHi || '',
        category: event.category as 'literature' | 'education' | 'culture' | 'social',
        date: event.date,
        location: event.location,
        locationHi: event.locationHi || '',
        imageUrl: event.imageUrl || '',
        published: event.published ?? true,
      });
      if (event.imageUrl) {
        setImagePreview(event.imageUrl);
      }
    }
  }, [event?.id]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create event');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Event Created',
        description: 'The event has been created successfully.',
      });
      navigate('/admin/events');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create event',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update event');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Event Updated',
        description: 'The event has been updated successfully.',
      });
      navigate('/admin/events');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update event',
        variant: 'destructive',
      });
    },
  });

  // Image upload handler
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image under 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Upload image
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      form.setValue('imageUrl', data.url, { shouldDirty: true });

      toast({
        title: 'Image Uploaded',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Form submit handler
  const onSubmit = (data: EventFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-2xl text-muted-foreground">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Link href="/admin/events">
        <Button variant="outline" className="mb-6" data-testid="button-back-to-events">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Events
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* English Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Title (English) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter event title in English"
                        {...field}
                        className="text-base"
                        data-testid="input-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hindi Title */}
              <FormField
                control={form.control}
                name="titleHi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Title (Hindi)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="कार्यक्रम का शीर्षक हिंदी में दर्ज करें"
                        {...field}
                        className="text-base"
                        data-testid="input-title-hi"
                      />
                    </FormControl>
                    <FormDescription className="text-base">
                      Optional - Provide Hindi translation for bilingual support
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-base" data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="literature">Literature / साहित्य</SelectItem>
                        <SelectItem value="education">Education / शिक्षा</SelectItem>
                        <SelectItem value="culture">Culture / संस्कृति</SelectItem>
                        <SelectItem value="social">Social Causes / सामाजिक कार्य</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Event Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="text-base"
                        data-testid="input-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location (English) */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Location (English) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter event location"
                        {...field}
                        className="text-base"
                        data-testid="input-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location (Hindi) */}
              <FormField
                control={form.control}
                name="locationHi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Location (Hindi)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="स्थान हिंदी में दर्ज करें"
                        {...field}
                        className="text-base"
                        data-testid="input-location-hi"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description (English) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Description (English) *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed event description"
                        rows={6}
                        {...field}
                        className="text-base"
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description (Hindi) */}
              <FormField
                control={form.control}
                name="descriptionHi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Description (Hindi)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="विस्तृत विवरण हिंदी में दर्ज करें"
                        rows={6}
                        {...field}
                        className="text-base"
                        data-testid="textarea-description-hi"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-4">
                <FormLabel className="text-lg">Event Image</FormLabel>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={isUploading}
                    data-testid="button-upload-image"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-base text-muted-foreground">
                    Max size: 5MB
                  </span>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-md h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Published Toggle */}
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-lg">Publish Event</FormLabel>
                      <FormDescription className="text-base">
                        Make this event visible to the public
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-published"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-event"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isEditMode ? 'Update Event' : 'Create Event'}
                </Button>
                <Link href="/admin/events">
                  <Button type="button" variant="outline" size="lg" data-testid="button-cancel">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
