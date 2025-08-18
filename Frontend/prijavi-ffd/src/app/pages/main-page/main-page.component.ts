import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ReportService } from '../../../services/report.service';
import { ReportToSend } from '../../../interfaces/report';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import { CommonModule } from '@angular/common';
import { Region, Severity, Tag } from '../../../interfaces/media';
import { HttpClient } from '@angular/common/http';
import { FilterService } from '../../../services/filter.service';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit{
  selectedRegion: number | null = null;
  selectedSeverity: number | null = null;
  sortMenuOpen = false;
  user:User|null = null;
  ngOnInit(): void {
    this.userService.userr$.subscribe({
      next:(u)=>{
       this.user=u
      }
    })
  }
  createReport=false;
   showReportModal() {
    console.log('Dugme kliknuto!'); // za debug
    this.createReport = true;
    this.loadAllOptions();
  }
   closeReportModal() {
    this.createReport = false;
  }

  toggleSortMenu() {
    this.sortMenuOpen = !this.sortMenuOpen;
  }

  sortBy(type: string) {
    console.log(`Sorting by ${type}`);
    this.sortMenuOpen = false;
  }
  title:string='';
  text:string='';
  tags: Tag[] = [];
  regions: Region[] = [];
  severities: Severity[] = [];
  roleNameInput:string ='';

  constructor(private reportService:ReportService, private userService:UserService, private http:HttpClient, private filterService:FilterService, private roleService:RoleService){}

  loadAllOptions(): void {
  this.filterService.loadTags().subscribe({
    next: (tags) => this.tags = tags,
    error: (err) => console.error('Error loading tags:', err)
  });

  this.filterService.loadRegion().subscribe({
    next: (regions) => this.regions = regions,
    error: (err) => console.error('Error loading regions:', err)
  });

  this.filterService.loadSeverity().subscribe({
    next: (severities) => this.severities = severities,
    error: (err) => console.error('Error loading severities:', err)
  });
}
onRegionChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  this.selectedRegion = select.value ? Number(select.value) : null;
  console.log('Selected Region ID:', this.selectedRegion);
}
onSeverityChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  this.selectedSeverity = select.value ? Number(select.value) : null;
  console.log('Selected Severity ID:', this.selectedSeverity);
}
selectedFile: File | null = null;

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    console.log("Selected file:", this.selectedFile);
  }
}

saveReport() {
  const title = (document.getElementById('title') as HTMLInputElement).value;
  const description = (document.getElementById('description') as HTMLTextAreaElement).value;

  const selectedTags = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[type=checkbox]:checked')
  ).map(cb => cb.value);

  const region = this.regions.find(r => r.id === this.selectedRegion);
  const severity = this.severities.find(s => s.id === this.selectedSeverity);

  const reportData: ReportToSend = {
    title,
    description,
     tagNames: selectedTags,
    regionName: region ? region.name : "",
    severityLevel: severity ? severity.level : ""
  };

  console.log("Report data:", reportData);
  this.reportService.addReport(this.user!.username, reportData, this.selectedFile ?? undefined).subscribe({
    next: (res) => {
      console.log("Report saved in DB:", res);
      this.closeReportModal();
    },
    error: (err) => {
      console.error("Error saving report:", err);
    }
  });
}
addRole(){
  if(!this.roleNameInput){
    console.log("Unesite rolu!");
    return;
  }

  this.roleService.getRoleByName(this.roleNameInput).subscribe({
    next:(role)=>{
      if(!role){
        console.log("rola ne postoji!");
        return;
      }
      this.roleService.giveUserARole(this.user!.username,this.roleNameInput).subscribe({
        next:()=>{
          this.roleNameInput = '';
        },
        error:(err)=>{
          console.error(err);
        }
      });
    },
    error:(err)=>{
      console.error(err);
    }
  })
}
removeRole(){
  this.roleService.removeRoleFromUser(this.user!.username).subscribe({
    next:()=>{
      console.log("uspesno uklonjena rola");
    },
    error:(err)=>{
      console.error(err);
    }
  })
}
}