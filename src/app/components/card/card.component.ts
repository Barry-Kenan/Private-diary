import { DataService } from 'src/app/services/data.service';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Note } from '../../models/note';

/**
 * Компонент карточки для записи
 */
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  /**
   * данные записи
   */
  @Input()
  public data!: Note;

  constructor(private dataService: DataService, private toast: ToastrService) {}

  /**
   * метод для удаления записи
   * @param data данные записи
   */
  public delete(data: Note): void {
    this.dataService.deleteNote(data);
    this.toast.info(`Запись: ${data.name} удаленаы`);
  }
}
