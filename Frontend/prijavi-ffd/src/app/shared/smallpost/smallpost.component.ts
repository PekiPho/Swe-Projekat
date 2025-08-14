import { Component, Input, Output, EventEmitter } from '@angular/core';


export interface Post {
  id: string;
  userName: string;
  severity: 'Low' | 'Medium' | 'High';
  place: string;
  situationType: string;
  description: string;
  imageUrls: string[];
  commentCount: number;
  comments: Comment[];
  isFollowing: boolean;
  isResolved: boolean;
}


export interface Comment {
  userName: string;
  text: string;
}

@Component({
  selector: 'app-small-post',
  templateUrl: './small-post.component.html',
  styleUrls: ['./small-post.component.scss'],
})
export class SmallPostComponent {
  
  @Input() post: Post = {
    id: '',
    userName: '',
    severity: 'Low',
    place: '',
    situationType: '',
    description: '',
    imageUrls: [],
    commentCount: 0,
    comments: [],
    isFollowing: false,
    isResolved: false
  };

  
  @Output() postClicked = new EventEmitter<Post>();

  
  @Output() followClicked = new EventEmitter<{ postId: string, isFollowing: boolean }>();

  
  onPostClick(): void {
    this.postClicked.emit(this.post);
  }

  
  onFollowClick(event: Event): void {
    event.stopPropagation(); 
    this.post.isFollowing = !this.post.isFollowing;
    this.followClicked.emit({ postId: this.post.id, isFollowing: this.post.isFollowing });
  }
}
