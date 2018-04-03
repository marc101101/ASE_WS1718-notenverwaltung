import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';

import { GlobalDataService, LastOpened } from '../../providers/index';


declare var require: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private title: string = `Notenverwaltung ASE WS17/18 !`;
  private last_files: Array<any> = [
  ];
  private view_mode: boolean = true;

  constructor(
    public dataService: GlobalDataService,
    public router: Router,
    public lastOpened: LastOpened,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.lastOpened.getLastOpendFiles().subscribe(
      data => {
        this.last_files = data;  
        this.last_files.forEach(file => {
          file.file_name = file.path.replace(/^.*[\\\/]/, '');
          let dateObj = new Date(file.last_opened);
          file.last_opened = String(dateObj.getDate()) + "." 
          + String(dateObj.getMonth() + 1) + "." 
          + dateObj.getFullYear() + " um " 
          + dateObj.getHours() + ":" 
          + (dateObj.getMinutes()<10?'0':'') + dateObj.getMinutes();
        });      
      }
    );
  }

  onChange(file) {
    console.log(file);
    
    this.dataService.getLocalFile(file['0'].path).subscribe(
      data => {
        if(this.dataService.checkJsonValidity() == 1){
            alert("file not recognized. please select a valid file.")
        }
        else{
            this.router.navigate(['course/overview']);
        }
      },
      err => {
        alert("File not recognized. Please select a valid file.")
      }
    );
  }
  
  openDialog() {
    var app = require('electron').remote;
    var dialog = app.dialog;

    dialog.showOpenDialog((fileNames) => {
      if (fileNames === undefined) {
        console.log("No file selected")
        return;
      }
      this.router.navigate(['course/overview']);

      this.dataService.getLocalFile(fileNames[0]).subscribe(data => {        
        this.router.navigate(['course/overview']);
      });
    });
  }
}
