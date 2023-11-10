/*** Creation de la base de données */

SET default_storage_engine= InnoDB;
SET SQL_SAFE_UPDATES=0;
drop table if exists Mesure;
drop table if exists CampagneMesure;
drop table if exists Parametre;

/*==============================================================*/
/* Table : CampagneMesure                                             */
/*==============================================================*/
create table CampagneMesure(
   idCampagne          	int not null auto_increment,
   nom               	varchar(25),
   DateDebut			datetime,
   capteurTemperature  	boolean,
   capteurCO2			boolean,
   capteurO2			boolean,
   capteurLumiere	  	boolean,
   capteurHumidite		boolean,
   intervalReleve		int,
   volume 				float,
   duree				int,
   primary key (idCampagne)
);

/*==============================================================*/
/* Table : Mesure                                              */
/*==============================================================*/
create table Mesure(
   idCampagne       int,
   Temperature  	float,
   CO2				float,
   O2				float,
   Lumiere	  		float,
   Humidite			float,
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


drop procedure if exists ajoutMesure;
delimiter $
create procedure ajoutMesure (
   IN idCampagne    int,
   IN Temperature  	float,
   IN CO2			float,
   IN O2			float,
   IN Lumiere	  	float,
   IN Humidite		float,
   IN DateHeure		datetime)
begin
insert into Mesure values (idCampagne,Temperature,CO2,O2,Lumiere,Humidite,DateHeure); 
END $
DELIMITER ;
call ajoutMesure(1,null,62,165,15,154,158,now());
call ajoutMesure(1,null,165,15,154,158,now());
call ajoutMesure(2,165,null,null,154,158,now());
call ajoutMesure(2,165,null,null,154,158,now());


drop procedure if exists ajoutCampagne;
delimiter $
create procedure ajoutCampagne (
   IN nom               	varchar(25),
   IN capteurTemperature  	boolean,
   IN capteurCO2			boolean,
   IN capteurO2			    boolean,
   IN capteurLumiere	  	boolean,
   IN capteurHumidite		boolean,
   IN intervalReleve		int,
   IN volume 				float,
   IN duree				    int)
begin
insert into CampagneMesure values (0,nom,now(),capteurTemperature,capteurCO2,capteurO2,capteurLumiere,capteurHumidite,intervalReleve,volume,duree); 
END $
DELIMITER ;
call ajoutCampagne("test1",1,0,1,0,1,100,null,5000);
call ajoutCampagne("be",1,1,0,0,1,10,500,200);
call ajoutCampagne("quoi",0,0,1,0,1,500,null,15000);
call ajoutCampagne("feur",0,0,1,0,1,500,null,15000);

drop procedure if exists triCampagne;
delimiter $
create procedure triCampagne (IN d datetime)
begin
Select * from CampagneMesure where DateDebut>=d order by DateDebut asc; 
END $
DELIMITER ;
call triCampagne('2023-11-10 11:30:10');


drop procedure if exists rechercheCampagne;
delimiter $
create procedure rechercheCampagne (IN n varchar(25))
begin
Select * from CampagneMesure where nom like concat('%',n,'%'); 
END $
DELIMITER ;
call rechercheCampagne('1');


drop procedure if exists exportCampagne;
delimiter $
create procedure exportCampagne (
   IN id	       		int,
   IN Temperature  		boolean,
   IN CO2				boolean,
   IN O2				boolean,
   IN Lumiere	  		boolean,
   IN Humidite			boolean,
   IN intervalReleve	int,
   IN moyenne			boolean,
   IN Debut				datetime,
   IN Fin				datetime,
   IN volume 			boolean)
begin
select Temperature,CO2,O2,Lumiere,Humidite from Mesure where idCampagne=id; 
END $
DELIMITER ;

call exportCampagne(1,1,1,1,0,0,65,0,'2023-11-10 11:30:10','2023-11-10 11:30:10',0); 