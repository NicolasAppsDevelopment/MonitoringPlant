/*** Creation de la base de données */

SET default_storage_engine= InnoDB;
SET SQL_SAFE_UPDATES=0;
drop table if exists Mesure;
drop table if exists Logs;
drop table if exists CampagneMesure;
drop table if exists Parametre;

/*==============================================================*/
/* Table : CampagneMesure                                       */
/*==============================================================*/
create table CampagneMesure(
   idCampagne          	int not null auto_increment,
   nom               	varchar(50),
   DateDebut			datetime,
   capteurTemperature  	int(1),
   capteurCO2			int(1),
   capteurO2			int(1),
   capteurLumiere	  	int(1),
   capteurHumidite		int(1),
   intervalReleve		int,
   volume 				float,
   duree				int,
   etat       int,
   primary key (idCampagne)
);

/*==============================================================*/
/* Table : Mesure                                               */
/*==============================================================*/
create table Mesure(
   idCampagne     int,
   Temperature  	float,
   CO2				float,
   O2				   float,
   Lumiere	  		float,
   Humidite			float,
   DateHeure		datetime,
   constraint FK_Mesure_CampagneMesure foreign key (idCampagne)
   references CampagneMesure (idCampagne) on delete restrict on update restrict
);

/*==============================================================*/
/* Table : Parametre                                            */
/*==============================================================*/
create table Parametre(
   IntervalSuppression  int,
   AutoSupprEnable      boolean
);

/*==============================================================*/
/* Table : Logs                                                 */
/*==============================================================*/
create table Logs(
   idCampagne       int,
   titre            varchar(100),
   messsage         varchar(1000),
   dateApparition   datetime,
   constraint FK_Logs_CampagneMesure foreign key (idCampagne)
   references CampagneMesure (idCampagne) on delete restrict on update restrict
);


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
insert into CampagneMesure values (0,nom,now(),capteurTemperature,capteurCO2,capteurO2,capteurLumiere,capteurHumidite,intervalReleve,volume,duree,0); 
END $
DELIMITER ;
call ajoutCampagne("test1",1,0,1,0,1,100,null,5000);
call ajoutCampagne("be",1,1,0,0,1,10,500,200);
call ajoutCampagne("quoi",0,0,1,0,1,500,null,15000);
call ajoutCampagne("feur",0,0,1,0,1,500,null,15000);
call ajoutCampagne("feur2",0,0,1,0,1,500,null,15000);


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
call ajoutMesure(1,null,62,165,14,158,now());
call ajoutMesure(1,null,65,15,154,25,now());
call ajoutMesure(2,165,null,null,154,158,now());
call ajoutMesure(2,165,null,null,154,158,now());
call ajoutMesure(4,165,null,null,154,158,now());


drop procedure if exists supprCampagne;
delimiter $
create procedure supprCampagne (IN id  int)
begin
delete from Mesure where idCampagne=id;
delete from CampagneMesure where idCampagne=id;
END $
DELIMITER ;
call supprCampagne(4);


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
	IN id 					int,
    IN capteurTemperature  	boolean,
	IN capteurCO2			boolean,
	IN capteurO2			boolean,
	IN capteurLumiere	  	boolean,
	IN capteurHumidite		boolean,
    IN debut 				datetime,
    IN fin 					datetime)
begin
declare requete varchar(500);
set @requete ="SELECT ";

if capteurTemperature then
	set @requete=concat(requete,"Temperature,");
end if;
if capteurCO2 then
	set @requete=concat(requete,"CO2,");
end if;
if capteurO2 then
	set @requete=concat(requete,"O2,");
end if;
if capteurLumiere then
	set @requete=concat(requete,"Lumiere,");
end if;
if capteurHumidite then
	set @requete=concat(requete,"Humidite,");
end if;

set @requete=concat(requete,"DateHeure from Mesure where idCampagne=",id," and DateHeure<",fin," and DateHeure>",debut,";");

/*prepare exportation from @requete;
execute exportation;
deallocate prepare exportation;

select Temperature,CO2,O2,Lumiere,Humidite from Mesure where idCampagne=id and DateHeure<fin and DateHeure>debut; 
select @requete;*/
END $
DELIMITER ;
call exportCampagne(2,1,1,1,0,0,'2023-11-10 11:30:10',now()); 