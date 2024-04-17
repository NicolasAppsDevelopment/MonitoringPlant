/*** Creation de la base de données */

SET default_storage_engine= InnoDB;
SET SQL_SAFE_UPDATES=0;
drop table if exists Measurements;
drop table if exists Logs;
drop table if exists Campaigns;
drop table if exists Settings;
drop table if exists Configurations;
drop table if exists Questions;
drop table if exists Users;

/*==============================================================*/
/* Table : Configurations                                       */
/*==============================================================*/
create table Configurations (
   idConfig     int not null auto_increment,
   name         varchar(50) not null,
   altitude		int not null,
   f1  			double not null,
   m			double not null,
   dPhi1		double not null,
   dPhi2	  	double not null,
   dKSV1		double not null,
   dKSV2	  	double not null,
   pressure	  	int not null,
   calibIsHumid	int(1) not null,
   cal0	  		double not null,
   cal2nd		double not null,
   o2cal2nd		double not null,
   t0			double not null,
   t2nd			double not null,
   primary key (idConfig)
);

/*==============================================================*/
/* Table : Campaigns                                            */
/*==============================================================*/
create table Campaigns (
   idCampaign          		int not null auto_increment,
   idConfig					int,
   name               		varchar(50) not null,
   beginDate				datetime not null,
   temperatureSensorState  	int(1) not null,
   CO2SensorState			int(1) not null,
   O2SensorState			int(1) not null,
   luminositySensorState	int(1) not null,
   humiditySensorState		int(1) not null,
   interval_				int not null,
   volume 					float,
   duration					int not null,
   humidMode      		int(1) not null,
   enableFiboxTemp  		int(1) not null,
   finished       			boolean not null,
   alertLevel     			int(1) not null,
   endingDate     			datetime,
   primary key (idCampaign),
   constraint FK_Campaigns_Configurations foreign key (idConfig)
   references Configurations (idConfig)
);

/*==============================================================*/
/* Table : Measurements                                         */
/*==============================================================*/
create table Measurements (
   idCampaign	int not null,
   temperature  float,
   CO2			float,
   O2			float,
   luminosity	float,
   humidity		float,
   date         datetime not null,
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
   idCampaign       int not null,
   state			int(1) not null,
   title            varchar(100) not null,
   message          varchar(1000) not null,
   occuredDate      datetime not null,
   constraint FK_Logs_Campaigns foreign key (idCampaign)
   references Campaigns (idCampaign) on delete restrict on update restrict
);

/*==============================================================*/
/* Table : Users                                                */
/*==============================================================*/
create table Users(
   idUser       int not null auto_increment,
   user varchar(100),
   password varchar(255),
   primary key (idUser)
);

/*==============================================================*/
/* Table : Questions                                            */
/*==============================================================*/
create table Questions(
   idUser       int not null,
   question varchar(300),
   answer varchar(200),
   primary key (idUser,question,answer),
   constraint FK_Questions_Users foreign key (idUser)
   references Users (idUser) on delete restrict on update restrict
);