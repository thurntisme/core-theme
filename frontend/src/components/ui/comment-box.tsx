import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  date: string;
  content: string;
}

interface CommentBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  comments?: Comment[];
}

export function CommentBox({
  comments = [],
  className,
  ...props
}: CommentBoxProps) {
  const [newComment, setNewComment] = React.useState('');
  const [name, setName] = React.useState('');
  const [allComments, setAllComments] = React.useState<Comment[]>(comments);

  const handleAddComment = () => {
    if (!newComment.trim() || !name.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      author: {
        name: name.trim(),
        initials: name
          .trim()
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
      },
      date: new Date().toLocaleDateString(),
      content: newComment.trim(),
    };

    setAllComments((prev) => [comment, ...prev]);
    setNewComment('');
    setName('');
  };

  const isFormValid = name.trim() !== '' && newComment.trim() !== '';

  return (
    <div className={cn('space-y-6', className)} {...props}>
      <Card>
        <CardHeader className="px-5 pb-3">
          <h3 className="text-lg font-medium">Add a comment</h3>
        </CardHeader>
        <CardContent className="px-5 pt-0 space-y-4">
          <div className="space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-24 resize-none"
            required
          />
        </CardContent>
        <CardFooter className="px-5 justify-end">
          <Button onClick={handleAddComment} disabled={!isFormValid}>
            Post Comment
          </Button>
        </CardFooter>
      </Card>

      {allComments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Comments ({allComments.length})
          </h3>
          {allComments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="px-5 pb-3 flex flex-row items-start space-x-4 space-y-0">
                <Avatar>
                  {comment.author.avatar && (
                    <AvatarImage
                      src={comment.author.avatar}
                      alt={comment.author.name}
                    />
                  )}
                  <AvatarFallback>{comment.author.initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">
                    {comment.author.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {comment.date}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-5 pt-0">
                <p className="text-sm">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
