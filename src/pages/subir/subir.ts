import { CargaArchivoProvider } from './../../providers/carga-archivo/carga-archivo';
import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";
import { Camera, CameraOptions } from '@ionic-native/camera';



@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {
  titulo : string = "";
  imagenPreview : string = "";
  imagen64 : string; //para firebesase metod

  constructor(private viewCtrl : ViewController,
              private camera: Camera,
              private cargaArchivoProv:CargaArchivoProvider) {
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  mostarCamara(){
    const options: CameraOptions = {
      quality: 50,
      // destinationType: this.camera.DestinationType.FILE_URI,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation : true
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.imagenPreview = 'data:image/jpg;base64,' + imageData;
     console.log("EXITO SACANDO LA FOTO");
     this.imagen64 = imageData;
    }, (err) => {
     // Handle error
     console.error("ERROR EN CAMARA", JSON.stringify(err));
    });

  }

  seleccionarFoto(){
    const options: CameraOptions = {
      quality: 50,
      // destinationType: this.camera.DestinationType.FILE_URI,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation : true,
      sourceType : 2
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.imagenPreview = 'data:image/jpg;base64,' + imageData;
     console.log("EXITO SELECCIONANDO LA FOTO");
     this.imagen64 = imageData;
    }, (err) => {
     // Handle error
     console.error("ERROR  AL CARGAR FOTO", JSON.stringify(err));
    });
    
  }

  crearPost(){
    let archivo = {
      img: this.imagen64,
      titulo: this.titulo
    }
    this.cargaArchivoProv.cargarImagenFirebase(archivo).then(()=> {
      console.error('Cerrar modal');
      this.cerrarModal()
    });
  }
}
