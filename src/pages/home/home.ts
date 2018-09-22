import { CargaArchivoProvider } from './../../providers/carga-archivo/carga-archivo';
import { SubirPage } from './../subir/subir';
import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';


//FIREBASE
//import { AngularFireDatabase } from '@angular/fire/database';
//import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //arreglo de Firebase
  //posts: Observable<any[]>;
  hayMas : boolean = true;

  constructor(private modalCrler:ModalController, 
              public archivoProvider:CargaArchivoProvider,
              private socialSharing: SocialSharing) {

    //por defecto trae cuisines pero tengo en la BD 'post'                
    //this.posts = afDB.list('post').valueChanges();                  
  }

  mostrarModal(){
    let modal = this.modalCrler.create( SubirPage);
    modal.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    this.archivoProvider.cargarImagenes().then( //se puede hacer then porque es una promesa
      (hayMas2:boolean)=>{//este hay mas es lo que retorna el metodo cargar resolve true o false
        console.log(hayMas2);
        this.hayMas = hayMas2;
        infiniteScroll.complete()
      }
    )    
  }

  shareFoto( post : any){//o archivoSubir

      this.socialSharing.canShareVia('facebook', '', '', '', '').then(() => {
        console.log("SI ES POSIBLE COMPARTIR");
      }).catch(() => {
        console.log("NOOOO ES POSIBLE COMPARTIR");
        return;
      });
      this.socialSharing.shareViaFacebook("PRUEBA", null, post.img).then(() => {
        // Success!
        console.log("Success");
      }).catch(() => {
        // Error!
        console.log("EXITO AL COMPARTIR");
      });
  }
}
