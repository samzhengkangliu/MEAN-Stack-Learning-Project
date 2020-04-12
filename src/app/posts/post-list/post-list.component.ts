import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})

// OnInit, OnDestroy: lifecycle hook
export class PostListComponent implements OnInit, OnDestroy {
  // bindable from the parent component via property binding
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  isLoading: boolean = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  // Dependency Injection with the PostsService
  // public -> create a new property with the same name and store incoming values in it
  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  // runs automatically everytime we create this component
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      // Observer: subscribe(): 3 possible arguments:
      // next() is a function to get executed whenever new data is emitted;
      // error() will be called whenever an error is emitted;
      // complete() will be called whenever the observable is completed.
      // Note: Subcription will not be canceled when the component is teared down
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    // Remove subscription and prevent memory leaks
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
