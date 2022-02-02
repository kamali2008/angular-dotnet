import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:4000/Users';
  

  userToken: string;


  constructor( private http: HttpClient ) {
    this.leerToken();
  }


  logout() {
    localStorage.removeItem('token');
  }

  login( usuario: UsuarioModel ) {

  /*  const authData = {
      ...usuario,
      returnSecureToken: true
    };
*/
    return this.http.post(
      `${ this.url }/authenticate`,
      usuario
    ).pipe(
      map( resp => {
        this.guardarToken( resp['token'] );
        console.log('********respuesta de login*********')
        console.log(resp);
        
        return resp;
      })
    );

  }

  nuevoUsuario( usuario: UsuarioModel ) {

   /* const authData = {
      ...usuario,
      returnSecureToken: true
    };
*/
    return this.http.post(
      `${ this.url }/register`,
      usuario
    ).pipe(
      map( resp => {
        this.guardarToken( resp['token'] );
        return resp;
      })
    );

  }


  private guardarToken( idToken: string ) {

    console.log('localStorage antes');
    console.log(localStorage);

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );

    console.log('localStorage despues');
    console.log(localStorage);

  }

  leerToken() {

    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;

  }


  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }


  }


}
