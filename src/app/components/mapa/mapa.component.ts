import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MapaEditarComponent } from './mapa-editar.component';
import { LocationService } from '../../location.service';
import { google } from '@agm/core/services/google-maps-types';
import { map } from 'rxjs/operator/map';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  marcadores: Marcador[] = [];

  public lat;
  public lng;
  
  //public LocationService: LocationService;

  constructor(
               public snackBar: MatSnackBar,
               public dialog: MatDialog,
               public locationService: LocationService,

               ) {

    if ( localStorage.getItem('marcadores') ) {
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
    }
  }

  ngOnInit() {
    this.getLocation();
    //this.marcarRuta()
  }

  
  getLocation() {
        this.locationService.getPosition().then(pos => {
        this.lat = pos.lat;
        this.lng = pos.lng;
    });
  }

  agregarMarcador( evento ) {

    const coords: { lat: number, lng: number } = evento.coords;

    const nuevoMarcador = new Marcador( coords.lat, coords.lng );

    this.marcadores.push( nuevoMarcador );

    this.guardarStorage();
    this.snackBar.open('Marcador agregado', 'Cerrar', { duration: 3000 });
  }


  marcarRuta(){
  //   const lineSymbol = {
  //     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //   };
  //   const line = new google.maps.Polyline({
  //     path: [
  //       { lat: 22.291, lng: 153.027 },
  //       { lat: 18.291, lng: 153.027 },
  //     ],
  //     geodesic : true,
  //     strokeColor : '#FF0000',
  //     strokeOpacity : 1,
  //     strokeWeight : 4,
  //     icons: [
  //       {
  //         icon: lineSymbol,
  //         offset: "100%",
  //       },
  //     ],
  //     map: map,
  //   });
  const flightPlanCoordinates = [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 },
  ];
  const flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  flightPath.setMap(map);
   }
  borrarMarcador( i: number ) {

    this.marcadores.splice(i, 1);
    this.guardarStorage();
    this.snackBar.open('Marcador borrado', 'Cerrar', { duration: 3000 });
  }

  editarMarcador( marcador: Marcador ) {

    const dialogRef = this.dialog.open( MapaEditarComponent , {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if ( !result ) {
        return;
      }

      marcador.titulo = result.titulo;
      marcador.desc = result.desc;

      this.guardarStorage();
      this.snackBar.open('Marcador actualizado', 'Cerrar', { duration: 3000 });

    });

  }



  guardarStorage() {

    localStorage.setItem('marcadores', JSON.stringify( this.marcadores ) );

  }

}
