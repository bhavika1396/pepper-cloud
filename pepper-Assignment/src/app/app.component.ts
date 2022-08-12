import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbCalendar,NgbModule, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';

export interface PeriodicElement {
  id: number;
  Subject: string;
  Type: string;
  Assigned: string;
  StartDate : string;
  Status : string;
}
const ELEMENT_DATA: PeriodicElement[] = [

  {
    "id": 1,
    "Subject": "Sample",
    "Type": "To Do",
    "Assigned": "Ravi Kumar",
    "StartDate": "1996-12-13",
    "Status":"Not Started"
  },
  {
    "id": 2,
    "Subject": "Sample",
    "Type": "To Do",
    "Assigned": "Anand Pai",
    "StartDate": "1996-12-12",
    "Status":"Not Started"
  },
  {
    "id": 3,
    "Subject": "Sample",
    "Type": "To Do",
    "Assigned": "Jayaram Ramesh",
    "StartDate": "1996-12-11",
    "Status":"Not Started"
  },
  // {
  //   "id": 4,
  //   "Subject": "Sample",
  //   "Type": "To Do",
  //   "Assigned": "Allan Gomez",
  //   "StartDate": "1996-12-10",
  //   "Status":"Not Started"
  // },
  // {
  //   "id": 5,
  //   "Subject": "Sample",
  //   "Type": "To Do",
  //   "Assigned": "Ravi Kumar",
  //   "StartDate": "1996-12-13",
  //   "Status":"Not Started"
  // },
  // {
  //   "id": 6,
  //   "Subject": "Sample",
  //   "Type": "To Do",
  //   "Assigned": "Anand Pai",
  //   "StartDate": "1996-12-12",
  //   "Status":"Not Started"
  // },
  // {
  //   "id": 7,
  //   "Subject": "Sample",
  //   "Type": "To Do",
  //   "Assigned": "Jayaram Ramesh",
  //   "StartDate": "1996-12-11",
  //   "Status":"Not Started"
  // },
  // {
  //   "id": 8,
  //   "Subject": "Sample",
  //   "Type": "To Do",
  //   "Assigned": "Allan Gomez",
  //   "StartDate": "1996-12-10",
  //   "Status":"Not Started"
  // },
   
    ]
  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  // Status!: 'Not Started';
  abc=false;
  title = 'pepper-Assignment';
  startDate = new FormControl(new Date());
  RemindOnDate = new FormControl(new Date ());
  endDate = new FormControl(new Date());
  model: any = {};
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  @ViewChild('adduserform')
  adduserform!: NgForm;
  displayedColumns: string[] = ['Subject', 'Type', 'Assigned to','Due Date','Status'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);  
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(private _liveAnnouncer: LiveAnnouncer,private calendar: NgbCalendar, public formatter: NgbDateParserFormatter){
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }
    //Submits the form data to the table 
    // onadduser(userData: PeriodicElement) {
    //   console.log(userData);
    //   // this.dataSource.data.push(userData);
    //   // console.log('data', userData)
    // }
    //method select all checkbox
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
   
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }
  
      this.selection.select(...this.dataSource.data);
    }
  
    
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
      //method for sorting
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
    onDateSelection(date: NgbDate) {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
        this.toDate = date;
      } else {
        this.toDate = null;
        this.fromDate = date;
      }
    }
  
    isHovered(date: NgbDate) {
      return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }
  
    isInside(date: NgbDate) {
      return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }
  
    isRange(date: NgbDate) {
      return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
    }
    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
      const parsed = this.formatter.parse(input);
      return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }
    onadduser(userData: PeriodicElement) {
      console.log(userData);
      this.dataSource.data.push(userData);
      console.log('data', userData)
    }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
