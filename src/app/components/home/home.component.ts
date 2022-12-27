import { AfterViewInit, Component, DoCheck, NgZone, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, throttleTime } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Note } from '../../models/note';

/**
 * компонент для авторизованных пользователей, для показа записей
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, DoCheck, AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport) public scroller: CdkVirtualScrollViewport;

  /**
   * массив записей
   */
  public posts: Note[];

  /**
   * загрузка записей
   */
  public loading: boolean;

  constructor(private dataService: DataService, private toast: ToastrService, private ngZone: NgZone) {
    this.posts = [];
    this.loading = false;
  }

  public ngOnInit(): void {
    this.getAllFiles();
  }

  public ngAfterViewInit(): void {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 426),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.getAllFiles();
        });
      });
  }

  public ngDoCheck(): void {
    this.posts = this.posts.sort((a, b) => b.createdDate.valueOf() - a.createdDate.valueOf());
  }

  /**
   * метод получения всех записей
   */
  private getAllFiles(): void {
    this.loading = true;
    this.dataService.getAllNotes().subscribe(
      res => {
        this.posts = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          data.createdDate = data.createdDate.toDate();
          this.loading = false;

          return data;
        });
      },
      err => {
        this.toast.error(err);
      }
    );
  }
}
