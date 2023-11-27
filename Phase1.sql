/*** Creation de la base de données */

SET default_storage_engine= InnoDB;
SET SQL_SAFE_UPDATES=0;
drop table if exists Measurements;
drop table if exists Logs;
drop table if exists Campaigns;
drop table if exists Settings;

/*==============================================================*/
/* Table : Campaigns                                            */
/*==============================================================*/
create table Campaigns (
   idCampaign          	int not null auto_increment,
   name               	varchar(50),
   beginDate			datetime,
   temperatureSensorState  	int(1),
   CO2SensorState			int(1),
   O2SensorState			int(1),
   luminositySensorState	  	int(1),
   humiditySensorState		int(1),
   interval_		int,
   volume 				float,
   duration				int,
   finished       boolean,
   alertLevel     int(1),
   primary key (idCampaign)
);

/*==============================================================*/
/* Table : Measurements                                          */
/*==============================================================*/
create table Measurements (
   idCampaign     int,
   temperature  	float,
   CO2				float,
   O2				   float,
   luminosity	  	float,
   humidity			float,
   date           datetime,
   constraint FK_Measurements_Campaigns foreign key (idCampaign)
   references Campaigns (idCampaign) on delete restrict on update restrict
);

/*==============================================================*/
/* Table : Settings                                             */
/*==============================================================*/
create table Settings (
   removeInterval  int,
   autoRemove      boolean
);

/*==============================================================*/
/* Table : Logs                                                 */
/*==============================================================*/
create table Logs(
   idCampaign       int,
   state			int(1),
   title            varchar(100),
   message         varchar(1000),
   occuredDate             datetime,
   constraint FK_Logs_Campaigns foreign key (idCampaign)
   references Campaigns (idCampaign) on delete restrict on update restrict
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
insert into Campaigns values (0,nom,now(),capteurTemperature,capteurCO2,capteurO2,capteurLumiere,capteurHumidite,intervalReleve,volume,duree,0); 
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
insert into Measurements values (idCampagne,Temperature,CO2,O2,Lumiere,Humidite,DateHeure); 
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
delete from Measurements where idCampaign=id;
delete from Campaigns where idCampaign=id;
END $
DELIMITER ;
call supprCampagne(4);


drop procedure if exists triCampagne;
delimiter $
create procedure triCampagne (IN d datetime)
begin
Select * from Campaigns where beginDate>=d order by beginDate asc; 
END $
DELIMITER ;
call triCampagne('2023-11-10 11:30:10');


drop procedure if exists rechercheCampagne;
delimiter $
create procedure rechercheCampagne (IN n varchar(25))
begin
Select * from Campaigns where name like concat('%',n,'%'); 
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