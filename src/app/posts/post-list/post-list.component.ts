import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import {PostsService} from '../posts.service';
import { Subscription } from 'rxjs';
import {PageEvent} from '@angular/material';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSubs: Subscription;
  private authStatusSub: Subscription;
  constructor(private postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSubs  = this.postsService.getPostUpdateListener().subscribe((postsData: {posts: Post[], postCount: number }) => {
      this.isLoading = false;
      this.posts = postsData.posts;
      this.totalPosts = postsData.postCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();


    });
  }

  ngOnDestroy() {
    this.postsSubs.unsubscribe();
    this.authStatusSub.unsubscribe();
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
    },() => {
      this.isLoading = false;
    });
  }




}
