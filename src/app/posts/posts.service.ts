import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

// Injectable: To add this service available to the Angular, only one instance
// The other way is to import it in app.module.ts - providers; this will create multiple instances
@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  // Subject: a special case of observable
  // where we can manually call next() instead of passively waiting for a response
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    // Do not return the original array of it, be immutable
    // because arrays and objects are reference types in both js and ts
    // spread operators here will create a deep copy of the original array
    return [...this.posts];
  }

  getPostUpdateListener() {
    // returns an Observable we can listen but can't emit
    return this.postsUpdated.asObservable();
  }

  addPost(title: String, content: String) {
    const newPost: Post = { title: title, content: content };
    this.posts.push(newPost);
    // pushes new value and it emits a new value and this value is a copy of posts
    this.postsUpdated.next([...this.posts]);
  }
}
