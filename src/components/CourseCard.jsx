import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function CourseCard({ course }) {
  const { thumbnail, name, price, id } = course;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-secondary/50">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-primary/60" />
                </div>
                <p className="text-sm text-muted-foreground">Course Thumbnail</p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-secondary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">৳{price}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="lg">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
