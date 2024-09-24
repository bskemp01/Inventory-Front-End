import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Error } from 'src/app/models/error.model';

const nullError: Error = {
  title: '',
  description: '',
};
const nullMessage = {
  message: '',
  confirm: '',
  duration: 0,
};
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}
  public error: BehaviorSubject<Error> = new BehaviorSubject<Error>(nullError);
  public notification: BehaviorSubject<{
    message: string;
    confirm: string;
    duration: number;
  }> = new BehaviorSubject<{
    message: string;
    confirm: string;
    duration: number;
  }>(nullMessage);

  getError() {
    return this.error.value;
  }

  setError(error: Error) {
    this.error.next(error);
  }

  setSnackbar(message: string, confirm: string, duration: number) {
    this.notification.next({
      message: message,
      confirm: confirm,
      duration: duration,
    });
  }
}
