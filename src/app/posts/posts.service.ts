import { Post } from './post.model';
import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';
@Injectable()
export class PostsService {
  private postsUpdated = new Subject<{posts: Post[], postCount: number }>();
  private posts: Post[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; //`` are template expression: dynamic add values into a normal string
    this.http.get<{message: string, posts: any, maxPosts: number}>
    (BACKEND_URL + queryParams)
      .pipe(map((item) => {
        return {
          posts:
          item.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }
        }) ,
          maxPosts: item.maxPosts
      }
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts],
        postCount: transformedPostsData.maxPosts });
      });

  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append('content', content);
    postData.append('image', image, title);


    this.http
      .post<{message: string, post: Post}>(
        BACKEND_URL,
        postData
      )
      .subscribe((responseData) => {

        this.router.navigate(["/"]);
      })

  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL  + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {

    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);

    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this.http.put(BACKEND_URL + id, postData).subscribe(response => {
      this.router.navigate(["/"]);
    });

  }

}
