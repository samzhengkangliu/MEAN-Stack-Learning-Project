import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.model";

// Injectable: To add this service available to the Angular, only one instance
// The other way is to import it in app.module.ts - providers; this will create multiple instances
@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];

  // Subject: a special case of observable
  // where we can manually call next() instead of passively waiting for a response
  private postsUpdated = new Subject<Post[]>();

  // Inject HttpClient
  constructor(private http: HttpClient) {}

  getPosts() {
    // Do not return the original array of it, be immutable
    // because arrays and objects are reference types in both js and ts
    // spread operators here will create a deep copy of the original array
    // return [...this.posts];

    // http will handle unsusribe here
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      // methods accept multiple operators
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    // returns an Observable we can listen but can't emit
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const newPost: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, postId: string }>("http://localhost:3000/api/posts", newPost)
      .subscribe(responseData => {
        const id = responseData.postId;
        newPost.id = id;
        this.posts.push(newPost);
        // pushes new value and it emits a new value and this value is a copy of posts
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        // Update the posts and Subject after deletion
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
