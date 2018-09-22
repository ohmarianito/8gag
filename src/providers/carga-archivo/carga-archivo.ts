import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from "firebase";
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';




@Injectable()
export class CargaArchivoProvider {

  imagenes: ArchivoASubir[] = [];
  lastKey : string = null;

  constructor(public toastCtrl: ToastController,
              public afdb :AngularFireDatabase) {

                this.cargarUltimoKey()
                    .subscribe( ()=>this.cargarImagenes());//cuando subribe termina se llama a otra funcion

  }

  cargarImagenes(){
    //metodo cargar imagenes de 3 en 3
    //retornar obvserable o promesa (se hizo promesa que es mas facil)
    let promesa = new Promise(  (resolve, reject ) =>{
        this.afdb.list('/post', 
          ref => ref.limitToLast(3) //trae todo hasta el ultimo que se carga en el cargarUltimo por eso se hace el pop
                    .orderByKey()
                    .endAt(this.lastKey)        
        ).valueChanges()
         .subscribe( (posts:any)=>{
          posts.pop();  //para no duplicar eliminar ultima entrada borro ultima posicion del arreglo
            if (posts.length == 0){
                console.log('YA NO HAY MAS IMAGEN');
                resolve(false); //retorno de la promesa para decir que ya no hay mas imagenes
                return;
              }
              //si llega aca todavia hay registros obetnego el utlimo
              this.lastKey = posts[0].key;
              //inserta todas las imagenes
              for(let i = posts.length-1; i >= 0; i--){
                  let post = posts[i];
                  this.imagenes.push(post);
              }
              //pueden haber mas imagenes
              resolve(true);
          });
    });
    return promesa;
  }

  private cargarUltimoKey(){
    return this.afdb.list('/post', ref => ref.orderByKey().limitToLast(1))
      .valueChanges()
      .map( (post :any) => {//tipo any para que no de error cuando pongo .key abajo
      //aca tengo un arreglo
      console.log(post);
      this.lastKey = post[0].key;

      this.imagenes.push( post[0]);
    });//esto retorna un observable porque puedo hacer el .subcribe()
  }

  cargarImagenFirebase( archivo : ArchivoASubir){
    let promesa = new Promise( (resolve, reject)=>{
    this.mostrarToast("Cargando....");  

    let storageRef = firebase.storage().ref();
    let nombreArchivo:string = new Date().valueOf().toString();

    let uploadTask : firebase.storage.UploadTask = 
      storageRef.child(`gagImg/${ nombreArchivo }`)//ACA NO USA COMILLAS
      .putString( archivo.img, 'base64', {contentType : 'image/jpeg'} )


      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED, 
        //varios callbacks
        ()=> {},// saber el % de cuabtos Mbs se han subido 
        (error) => {
          //manejo de error
          console.log('EROOR EN LA CARGA');
          console.log(JSON.stringify(error));
          this.mostrarToast(JSON.stringify(error));
          reject();//llama a un catch que tenga en cargarImagenFirebase
        },
        ()=> {
          //TODO bien
          console.log('ARCHIVO SUBIDO');
          this.mostrarToast("Se cargo imagen!!!");
          
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.crearPost(archivo.titulo, downloadURL, nombreArchivo);
          });


          resolve();//se termina la carga
        }
        
        
        
        )
    });

    return promesa;
  }

  private crearPost( tituloIn:string, url:string, keyIn:string){
    console.log("LLEGO CON tit " + tituloIn + " url " + url + " key " + keyIn);
    let post : ArchivoASubir = {
      img: url,
      titulo: tituloIn,
      key: keyIn
    };
    
    console.log(JSON.stringify(post));
    //this.afdb.list('/post').push(post); Asi lo genera con un id generico
    this.afdb.object(`/post/${ keyIn }`).update(post); //.then se puede hacer promesa
    this.imagenes.push(post);
    
  }

  mostrarToast(msj:string){
      this.toastCtrl.create({
        message: msj,
        duration: 2000
      }).present();
  }


}

interface ArchivoASubir {
  titulo : string;
  img : string;
  key? : string;
}
