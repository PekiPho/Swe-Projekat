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
  selector: 'app-big-post',
  templateUrl: './big-post.component.html',
  styleUrls: ['./big-post.component.scss'],
})
export class BigPostComponent {
 
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

 
  @Output() close = new EventEmitter<void>();

  
  @Output() followClicked = new EventEmitter<{ postId: string, isFollowing: boolean }>();

  
  @Output() resolvedClicked = new EventEmitter<{ postId: string, isResolved: boolean }>();

 
  newCommentText: string = '';

  
  onClose(): void {
    this.close.emit();
  }

  
  onFollowClick(): void {
    this.post.isFollowing = !this.post.isFollowing;
    this.followClicked.emit({ postId: this.post.id, isFollowing: this.post.isFollowing });
  }

 
  onResolvedClick(): void {
    this.post.isResolved = true;
    this.resolvedClicked.emit({ postId: this.post.id, isResolved: this.post.isResolved });
  }

  
  onSubmitComment(): void {
    if (this.newCommentText.trim()) {
      
      const newComment: Comment = {
        userName: 'Current User',
        text: this.newCommentText,
      };

     
      this.post.comments.push(newComment);

      
      console.log('New comment submitted:', this.newCommentText);
      console.log('Updated post object:', this.post);

      
      this.newCommentText = '';
    }
  }
}
