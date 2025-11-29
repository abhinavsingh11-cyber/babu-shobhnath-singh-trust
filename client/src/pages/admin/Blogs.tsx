import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Plus, Pencil, Trash2, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Blog } from '@shared/schema';

export default function AdminBlogs() {
  const { toast } = useToast();

  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ['/api/admin/blogs'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blogs'] });
      toast({
        title: 'Success',
        description: 'Blog deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete blog',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-xl">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Blogs Management</h1>
          <p className="text-xl text-muted-foreground">
            Manage all blog posts and articles
          </p>
        </div>
        <Link href="/admin/blogs/new">
          <Button size="lg" data-testid="button-create-blog">
            <Plus className="h-5 w-5 mr-2" />
            Create Blog
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">All Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          {!blogs || blogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">No blogs yet</p>
              <Link href="/admin/blogs/new">
                <Button>
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Blog
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">Title</TableHead>
                  <TableHead className="text-base">Author</TableHead>
                  <TableHead className="text-base">Category</TableHead>
                  <TableHead className="text-base">Status</TableHead>
                  <TableHead className="text-right text-base">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium text-base">{blog.title}</TableCell>
                    <TableCell className="text-base">{blog.author}</TableCell>
                    <TableCell className="text-base capitalize">{blog.category}</TableCell>
                    <TableCell>
                      <Badge variant={blog.published ? 'default' : 'secondary'}>
                        {blog.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blogs/${blog.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-view-blog-${blog.id}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-edit-blog-${blog.id}`}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(blog.id, blog.title)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-blog-${blog.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <p className="text-base text-muted-foreground">
          <strong>Total Blogs:</strong> {blogs?.length || 0}
        </p>
      </div>
    </div>
  );
}
