import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})

// OnInit, OnDestroy: lifecycle hook
export class PostListComponent implements OnInit, OnDestroy {
  // bindable from the parent component via property binding
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription;

  // Dependency Injection with the PostsService
  // public -> create a new property with the same name and store incoming values in it
  constructor(public postsService: PostsService) {}

  // runs automatically everytime we create this component
  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      // Observer: subscribe(): 3 possible arguments:
      // next() is a function to get executed whenever new data is emitted;
      // error() will be called whenever an error is emitted;
      // complete() will be called whenever the observable is completed.
      // Note: Subcription will not be canceled when the component is teared down
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    // Remove subscription and prevent memory leaks
    this.postsSub.unsubscribe();
  }
}
