/*** Creation de la base de données */

SET default_storage_engine= InnoDB;
SET SQL_SAFE_UPDATES=0;
drop table if exists CampagneMesure;
drop table if exists Mesure;
drop table if exists Parametre;

/*==============================================================*/
/* Table : CampagneMesure                                             */
/*==============================================================*/
create table CampagneMesure(
   idCampagne          	int not null auto_increment,
   nom               	varchar(25),
   capteurTemperature  	boolean,
   capteurCO2			boolean,
   capteurO2			boolean,
   capteurLumiere	  	boolean,
   capteurHumidite		boolean,
   intervalReleve		time,
   volume 				float,
   duree				int,
   primary key (idCampagne)
);

/*==============================================================*/
/* Table : Mesure                                              */
/*==============================================================*/
create table Mesure(
   idCampagne       int,
   Temperature  	boolean,
   CO2				boolean,
   O2				boolean,
   Lumiere	  		boolean,
   Humidite			boolean,
   DateHeure		datetime,
   constraint FK_Mesure_CampagneMesure foreign key (idCampagne)
   references CampagneMesure (idCampagne) on delete restrict on update restrict
);

/*==============================================================*/
/* Table : Parametre                                              */
/*==============================================================*/
create table Parametre(
   IntervalSuppression  int
);