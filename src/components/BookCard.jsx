import ImageFallback from "@/components/shared/ImageFallback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BookOpen, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  const { book_image, title, price, slug, batch, stock } = book;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ImageFallback
            src={book_image}
            alt={title}
            className="group-hover:scale-105 transition-transform duration-300"
            icon={BookOpen}
            text="Book Cover"
          />
          {/* Batch Tag */}
          {batch && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 bg-secondary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                <BookOpen className="w-3 h-3" />
                {batch}
              </span>
            </div>
          )}
          {/* Stock Status */}
          {stock && (
            <div className="absolute top-3 left-3">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
                  stock > 20
                    ? "bg-green-500 text-white"
                    : stock > 0
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {stock > 20
                  ? "In Stock"
                  : stock > 0
                  ? `Only ${stock} left`
                  : "Out of Stock"}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <h3 className="text-base lg:text-lg font-medium text-foreground line-clamp-2 ">
          {title}
        </h3>

        <div className="flex items-center justify-start ">
          <span className="text-2xl  font-medium text-primary">৳{price}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Link className="w-full" to={`/books/${slug}`}>
          <Button className="w-full" disabled={stock === 0}>
            <ShoppingCart className="w-4 h-4 mr-2" />{" "}
            {stock === 0 ? "Out of Stock" : "Order Now"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
