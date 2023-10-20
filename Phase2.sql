/*** Creation de la base de données */

SET default_storage_engine= InnoDB;
SET SQL_SAFE_UPDATES=0;
drop table if exists Parametre;
drop table if exists QuestionSecurite;
drop table if exists Mesure;
drop table if exists Commentaire;
drop table if exists CampagneMesure;
drop table if exists EleveGroupe;
drop table if exists EleveTravail;
drop table if exists Travail;
drop table if exists Sujet;
drop table if exists Etudiant;
drop table if exists Groupe;


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
   intervalReleve		time,
   volume 				float,
   duree				int,
   nomCellule			varchar(25),
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
/* Table : QuestionSecurite                                              */
/*==============================================================*/
create table QuestionSecurite(
   idQuestion  int,
   Question    varchar(200),
   primary key (idQuestion)
);

/*==============================================================*/
/* Table : Parametre                                              */
/*==============================================================*/
create table Parametre(
   IntervalSuppression  int,
   MotDePasse     		varchar(25),
   idQuestion1		    int,
   idQuestion2		    int,
   idQuestion3		    int,
   Reponse1		    	varchar(50),
   Reponse2		    	varchar(50),
   Reponse3		    	varchar(50),
   nomAdmin      		varchar(50),
   prenomAdmin   		varchar(50),
   constraint FK_Parametre_QuestionSecurite1 foreign key (idQuestion1)
   references QuestionSecurite (idQuestion) on delete restrict on update restrict,
   constraint FK_Parametre_QuestionSecurite2 foreign key (idQuestion2)
   references QuestionSecurite (idQuestion) on delete restrict on update restrict,
   constraint FK_Parametre_QuestionSecurite3 foreign key (idQuestion3)
   references QuestionSecurite (idQuestion) on delete restrict on update restrict
);

/*==============================================================*/
/* Table : Etudiant                                              */
/*==============================================================*/
create table Etudiant(
   idEtudiant       int,
   nom      		varchar(25),
   prenom   		varchar(25),
   primary key (idEtudiant)
);

/*==============================================================*/
/* Table : Sujet                                              */
/*==============================================================*/
create table Sujet(
   idSujet  int,
   nom      varchar(25),
   type   	varchar(25),
   primary key (idSujet)
);

/*==============================================================*/
/* Table : Travail                                              */
/*==============================================================*/
create table Travail(
   idTravail  int,
   idSujet    int,
   cleAcces   varchar(25),
   primary key (idTravail),
   constraint FK_Travail_Sujet foreign key (idSujet)
   references Sujet (idSujet) on delete restrict on update restrict
);

/*==============================================================*/
/* Table : Commentaire                                              */
/*==============================================================*/
create table Commentaire(
   idCommentaire 	int,
   idCampagne		int,
   commentaire 		varchar(1000),
   sentByAdmin   	boolean,
   lu   			boolean,
   primary key (idCommentaire),
   constraint FK_Commentaire_CampagneMesure foreign key (idCampagne)
   references CampagneMesure (idCampagne) on delete restrict on update restrict
);

/*==============================================================*/
/* Table : Groupe                                              */
/*==============================================================*/
create table Groupe(
   idGroupe 	int,
   nom 			varchar(25),
   primary key (idGroupe)
);

/*==============================================================*/
/* Table : EleveGroupe                                              */
/*==============================================================*/
create table EleveGroupe(
   idEtudiant 	int,
   idGroupe		int,
   primary key (idEtudiant,idGroupe),
   constraint FK_EleveGroupe_Groupe foreign key (idGroupe)
   references Groupe (idGroupe) on delete restrict on update restrict,
   constraint FK_EleveGroupe_Etudiant foreign key (idEtudiant)
   references Etudiant (idEtudiant) on delete restrict on update restrict
);

/*==============================================================*/
/* Table : EleveTravail                                              */
/*==============================================================*/
create table EleveTravail(
   idEtudiant 	int,
   idTravail	int,
   primary key (idEtudiant,idTravail),
   constraint FK_EleveTravail_Travail foreign key (idTravail)
   references Travail (idTravail) on delete restrict on update restrict,
   constraint FK_EleveTravail_Etudiant foreign key (idEtudiant)
   references Etudiant (idEtudiant) on delete restrict on update restrict
);

