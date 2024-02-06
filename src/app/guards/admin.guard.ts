import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private firestore: AngularFirestore) { }

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users').doc(user.uid).get().pipe(
            map(doc => {
              const data = doc.data() as { role: string };
              if (data && (data.role === 'admin' || data.role === 'manager')) {
                return true;
              } else {
                this.router.navigate(['/home']);
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/home']);
          return of(false);
        }
      })
    );
  }
}