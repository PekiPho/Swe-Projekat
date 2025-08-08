import { Component } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  posts = [
    { title: 'Post 1', content: 'Some details here' },
    { title: 'Post 2', content: 'More details here' },
    { title: 'Post 3', content: 'Even more details here' }
  ];
}
  