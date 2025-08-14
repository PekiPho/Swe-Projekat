import { Component, OnInit, Output, EventEmitter } from '@angular/core';


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
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Output() postClicked = new EventEmitter<Post>();

  userPosts: Post[] = [];

  constructor() { }

  ngOnInit(): void {

    this.userPosts = this.generateUserPosts(5);
  }

  /**
   * Generiše nasumične postove za korisnika.
   * @param count Broj postova za generisanje.
   * @returns Niz nasumično generisanih postova.
   */
  private generateUserPosts(count: number): Post[] {
    const generatedPosts: Post[] = [];
    const userNames = ['Miloš'];
    const severities = ['Low', 'Medium', 'High'];
    const situationTypes = ['Saobraćaj', 'Hitna pomoć', 'Krađa', 'Požar', 'Poplava'];
    const descriptions = [
      'Nesreća na putu E75, kolone su velike.',
      'Sumnjivo lice primećeno u blizini banke.',
      'Požar u zgradi, vatrogasci su na terenu.',
      'Veliki kvar na vodovodnoj cevi u centru grada.',
      'Saobraćajni udes sa lakšim povredama.'
    ];
    const imagePlaceholders = [
      'https://placehold.co/100x70/E9D5FF/6B46C1?text=Image',
      'https://placehold.co/100x70/BEE3F8/2B6CB0?text=Image',
      'https://placehold.co/100x70/9AE6B4/2F855A?text=Image',
      'https://placehold.co/100x70/FEEBCF/DD6B20?text=Image'
    ];

    for (let i = 0; i < count; i++) {
      generatedPosts.push({
        id: `user-post-${i}`,
        userName: userNames[0],
        severity: severities[Math.floor(Math.random() * severities.length)] as 'Low' | 'Medium' | 'High',
        place: `Mesto ${i + 1}`,
        situationType: situationTypes[Math.floor(Math.random() * situationTypes.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        imageUrls: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => imagePlaceholders[Math.floor(Math.random() * imagePlaceholders.length)]),
        commentCount: Math.floor(Math.random() * 20),
        comments: [],
        isFollowing: false,
        isResolved: Math.random() > 0.8
      });
    }

    return generatedPosts;
  }

  
  onPostClicked(post: Post): void {
    this.postClicked.emit(post);
  }
}
