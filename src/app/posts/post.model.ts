// Defines how an object looks like but cannot be instantiated
// like a contract, blueprint
export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}
