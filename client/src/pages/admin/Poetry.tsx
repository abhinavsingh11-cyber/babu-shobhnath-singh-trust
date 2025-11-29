import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Plus, Pencil, Trash2, Eye, BookOpen } from 'lucide-react';
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
import type { Poetry } from '@shared/schema';

export default function AdminPoetry() {
  const { toast } = useToast();

  const { data: poetry, isLoading } = useQuery<Poetry[]>({
    queryKey: ['/api/admin/poetry'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/poetry/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/poetry'] });
      toast({
        title: 'Success',
        description: 'Poetry deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete poetry',
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
        <div className="text-xl">Loading poetry...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Poetry Management</h1>
          <p className="text-xl text-muted-foreground">
            Manage all poetry and kavita
          </p>
        </div>
        <Link href="/admin/poetry/new">
          <Button size="lg" data-testid="button-create-poetry">
            <Plus className="h-5 w-5 mr-2" />
            Create Poetry
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">All Poetry</CardTitle>
        </CardHeader>
        <CardContent>
          {!poetry || poetry.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">No poetry yet</p>
              <Link href="/admin/poetry/new">
                <Button>
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Poetry
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">Title</TableHead>
                  <TableHead className="text-base">Author</TableHead>
                  <TableHead className="text-base">Status</TableHead>
                  <TableHead className="text-right text-base">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poetry.map((poem) => (
                  <TableRow key={poem.id}>
                    <TableCell className="font-medium text-base">{poem.title}</TableCell>
                    <TableCell className="text-base">{poem.author}</TableCell>
                    <TableCell>
                      <Badge variant={poem.published ? 'default' : 'secondary'}>
                        {poem.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/poetry/${poem.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-view-poetry-${poem.id}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/admin/poetry/${poem.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-edit-poetry-${poem.id}`}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(poem.id, poem.title)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-poetry-${poem.id}`}
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
          <strong>Total Poetry:</strong> {poetry?.length || 0}
        </p>
      </div>
    </div>
  );
}
