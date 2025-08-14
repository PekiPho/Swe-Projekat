import { Component, OnInit } from '@angular/core';


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
  selector: 'app-following-list',
  templateUrl: './following-list.component.html',
  styleUrls: ['./following-list.component.scss']
})
export class FollowingListComponent implements OnInit {
 
  allPosts: Post[] = [];

  followingPosts: Post[] = [];

  constructor() { }

  ngOnInit(): void {
   
    this.allPosts = this.generateRandomPosts(10);
 
    this.followingPosts = this.allPosts.filter(post => post.isFollowing);
  }

  /**
   * Generiše određeni broj nasumičnih postova za demonstraciju.
   * Neki od njih su nasumično označeni kao praćeni.
   * @param count Broj postova za generisanje.
   * @returns Niz nasumično generisanih postova.
   */
  private generateRandomPosts(count: number): Post[] {
    const generatedPosts: Post[] = [];
    const userNames = ['Jovan', 'Marija', 'Petar', 'Ana', 'Marko', 'Elena'];
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
        id: `following-post-${i}`,
        userName: userNames[Math.floor(Math.random() * userNames.length)],
        severity: severities[Math.floor(Math.random() * severities.length)] as 'Low' | 'Medium' | 'High',
        place: `Mesto ${i + 1}`,
        situationType: situationTypes[Math.floor(Math.random() * situationTypes.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        imageUrls: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => imagePlaceholders[Math.floor(Math.random() * imagePlaceholders.length)]),
        commentCount: Math.floor(Math.random() * 20),
        comments: [],
        
        isFollowing: Math.random() > 0.5,
        isResolved: Math.random() > 0.8
      });
    }

    return generatedPosts;
  }

  /**
   * Rukuje događajem klika na post iz podkomponente.
   * @param post Objekat posta na koji je kliknuto.
   */
  onPostClicked(post: Post): void {
    console.log('Kliknuto na praćeni post:', post.id);
    
  }
}
