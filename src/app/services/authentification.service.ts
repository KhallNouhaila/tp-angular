import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { AppUser } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  users : AppUser[]=[];
  authenticatedUser!: AppUser;

  constructor() { 
    this.users.push(
      {userId: UUID.UUID(), username:'user1', password:"1234", roles:["USER"] },
      {userId: UUID.UUID(), username:'user2', password:"1234", roles:["USER"] },
      {userId: UUID.UUID(), username:'admin', password:"1234", roles:["USER", "ADMIN"] },
    );
  }

  public login(username:string, password:string):Observable<AppUser>{
    let appUser = this.users.find(u=>u.username==username);
    if(!appUser) return throwError(()=> new Error('user not found'));
    if(appUser.password!=password){
      return throwError(()=> new Error('Bad credentials'));

    }
    return of(appUser);

  }

  public authenticateUser(appUser: AppUser):Observable<boolean>{
    this.authenticatedUser = appUser;
    localStorage.setItem(
      "authUser", 
      JSON.stringify({username:appUser.username, roles:appUser.roles, jwt:"JWT_TOKEN"}),

    );
    return of(true);
  }

  public hasRole(role:string):boolean{
    return this.authenticatedUser!.roles.includes(role);
  }

  public isAuthenticate(){
    return this.authenticatedUser!=undefined;
  }

  public logout():Observable<boolean>{
    this.authenticatedUser = undefined as any;
    localStorage.removeItem("authUser");
    return of(true);
  }


}
